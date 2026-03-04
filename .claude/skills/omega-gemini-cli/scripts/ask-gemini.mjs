#!/usr/bin/env node
/**
 * Headless Gemini CLI wrapper.
 * Usage:
 *   node ask-gemini.mjs "your prompt" [--model MODEL] [--json] [--sandbox] [--timeout-ms N]
 *   echo "prompt" | node ask-gemini.mjs [--model MODEL] [--json] [--sandbox] [--timeout-ms N]
 * Prompt is always sent via stdin to bypass shell argument length limits on all platforms.
 * Windows: shell: true is required to resolve the gemini.cmd wrapper.
 */
import { spawn } from 'child_process';
import path from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { assertNonEmptyPrompt, parseCliArgs } from './parse-args.mjs';
import { formatJsonOutput } from './format-output.mjs';

const USAGE =
  'Usage: node ask-gemini.mjs "prompt" [--model MODEL] [--json] [--sandbox] [--timeout-ms N]\nExit codes: 0 success, 1 error, 124 timeout';
const MAX_STDIN_BYTES_DEFAULT = 50 * 1024 * 1024;
const MAX_STDIN_BYTES = Number.parseInt(process.env.ASK_GEMINI_MAX_STDIN_BYTES, 10);
const EFFECTIVE_MAX_STDIN_BYTES =
  Number.isInteger(MAX_STDIN_BYTES) && MAX_STDIN_BYTES > 0
    ? MAX_STDIN_BYTES
    : MAX_STDIN_BYTES_DEFAULT;

const MODEL_SAFE_PATTERN = /^[a-zA-Z0-9._-]+$/;

export function buildGeminiArgs({ prompt: _prompt, model, outputJson, sandbox }) {
  // Gemini uses stdin for the prompt. -p "" keeps Gemini in headless mode;
  // it appends the -p value to stdin, so "" + stdin = stdin.
  // On non-Windows we pass a proper args array — no shell quoting issues.
  const cliArgs = ['-p', '', '--yolo'];
  if (sandbox) cliArgs.push('-s');
  if (model) cliArgs.push('-m', model);
  if (outputJson) cliArgs.push('--output-format', 'json');
  return cliArgs;
}

export function getExecutables(cliArgs, isWin, model) {
  if (isWin) {
    // On Windows with shell:true, Node joins args into a shell string.
    // An empty-string array element becomes nothing, so build command as a string
    // where "" is explicit. Model is validated before interpolation (security).
    const modelFlag = model ? ` -m ${model}` : '';
    const sandboxFlag = cliArgs.includes('-s') ? ' -s' : '';
    const jsonFlag = cliArgs.includes('--output-format') ? ' --output-format json' : '';
    return [
      {
        executable: `gemini -p "" --yolo${modelFlag}${sandboxFlag}${jsonFlag}`,
        args: [],
        shell: true,
        notFoundPattern: /not recognized as an internal or external command/i,
        stdinPrompt: true,
      },
      {
        executable: `npx -y @google/gemini-cli -p "" --yolo${modelFlag}${sandboxFlag}${jsonFlag}`,
        args: [],
        shell: true,
        notFoundPattern: /not recognized as an internal or external command/i,
        stdinPrompt: true,
      },
    ];
  }
  return [
    { executable: 'gemini', args: cliArgs, stdinPrompt: true },
    {
      executable: 'npx',
      args: ['-y', '@google/gemini-cli', ...cliArgs],
      stdinPrompt: true,
    },
  ];
}

function runCandidate(candidate, runOptions, timeoutMs, promptText) {
  return new Promise((resolve) => {
    let proc;
    try {
      const spawnOpts = { ...runOptions };
      if (candidate.shell) spawnOpts.shell = true;
      if (process.platform !== 'win32') spawnOpts.detached = true;
      // Gemini receives prompt via stdin, so stdio[0] must be 'pipe'.
      spawnOpts.stdio = ['pipe', 'pipe', 'pipe'];
      proc = spawn(candidate.executable, candidate.args, spawnOpts);
    } catch (err) {
      if (err && (err.code === 'ENOENT' || err.code === 'EINVAL')) {
        resolve({ enoent: true });
        return;
      }
      resolve({
        code: 1,
        stdout: '',
        stderr: `Failed to start ${candidate.executable}: ${err && err.message ? err.message : String(err)}`,
        timedOut: false,
      });
      return;
    }
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let timer = null;
    let killPromise = null;
    let settled = false;

    function finish(value) {
      if (settled) return;
      settled = true;
      resolve(value);
    }

    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');

    proc.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    proc.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        timedOut = true;
        if (process.platform === 'win32') {
          killPromise = new Promise((done) => {
            if (!proc.pid) {
              done();
              return;
            }
            const killer = spawn('taskkill', ['/F', '/T', '/PID', String(proc.pid)], {
              stdio: 'ignore',
            });
            killer.on('error', () => done());
            killer.on('close', () => done());
          });
        } else {
          try {
            process.kill(-proc.pid, 'SIGKILL');
          } catch {
            proc.kill('SIGKILL');
          }
        }
      }, timeoutMs);
    }

    proc.on('error', (err) => {
      if (timer) clearTimeout(timer);
      if (err && err.code === 'ENOENT') {
        finish({ enoent: true });
        return;
      }
      finish({
        code: 1,
        stdout,
        stderr:
          (stderr ? stderr + '\n' : '') + `Failed to run ${candidate.executable}: ${err.message}`,
        timedOut,
      });
    });

    proc.on('close', (code) => {
      if (timer) clearTimeout(timer);
      // Windows exit code 9009 = "command not found" (cmd.exe cannot resolve the executable).
      if (process.platform === 'win32' && code === 9009) {
        finish({ enoent: true });
        return;
      }
      if (killPromise) {
        killPromise.finally(() => {
          finish({ code: code ?? 1, stdout, stderr, timedOut });
        });
        return;
      }
      finish({ code: code ?? 1, stdout, stderr, timedOut });
    });

    // Prompt is sent via stdin — no .trim() so intentional leading/trailing whitespace is preserved.
    proc.stdin.on('error', () => {}); // ignore EPIPE if the process closes stdin early
    proc.stdin.write(promptText, 'utf8');
    proc.stdin.end();
  });
}

async function runWithFallback(candidates, runOptions, timeoutMs, promptText) {
  for (const candidate of candidates) {
    const result = await runCandidate(candidate, runOptions, timeoutMs, promptText);
    if (result.enoent) continue;
    const combined = [result.stderr, result.stdout].filter(Boolean).join('\n');
    if (
      result.code !== 0 &&
      candidate.notFoundPattern &&
      candidate.notFoundPattern.test(combined)
    ) {
      continue;
    }
    return result;
  }
  return { code: 1, stdout: '', stderr: 'Gemini CLI not found on PATH.', timedOut: false };
}

function printFailure(stderr, stdout, timedOut) {
  const combined = [stderr, stdout].filter(Boolean).join('\n').trim();
  if (timedOut) {
    const msg =
      'Gemini request timed out. Try a shorter prompt or set a larger timeout with --timeout-ms.';
    console.error(combined ? `${msg}\n\nPartial Output:\n${combined}` : msg);
    return;
  }
  console.error(combined);
  const hint =
    combined.toLowerCase().includes('not found') ||
    combined.toLowerCase().includes('command not found')
      ? '\nHint: Is the Gemini CLI installed and authenticated? Run: node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs'
      : '';
  if (hint) console.error(hint);
}

async function run(promptText, opts) {
  try {
    assertNonEmptyPrompt(promptText);
  } catch {
    console.error(USAGE);
    process.exit(1);
  }

  const isWin = process.platform === 'win32';

  // Validate model before interpolation into Windows command string (security).
  if (isWin && opts.model && !MODEL_SAFE_PATTERN.test(opts.model)) {
    console.error('Error: --model contains invalid characters:', opts.model);
    process.exit(1);
  }

  const cliArgs = buildGeminiArgs({
    prompt: promptText,
    model: opts.model,
    outputJson: opts.outputJson,
    sandbox: opts.sandbox,
  });
  const runOptions = {
    env: process.env,
  };
  const candidates = getExecutables(cliArgs, isWin, opts.model);
  const result = await runWithFallback(candidates, runOptions, opts.timeoutMs, promptText);

  if (result.code !== 0) {
    printFailure(result.stderr, result.stdout, result.timedOut);
    process.exit(result.timedOut ? 124 : (result.code ?? 1));
  }

  if (opts.outputJson) {
    const { output, exitCode, warning } = formatJsonOutput(result.stdout);
    if (warning) process.stderr.write(warning + '\n');
    process.stdout.write(output);
    if (exitCode !== 0) process.exit(exitCode);
    return;
  }

  process.stdout.write(result.stdout);
}

export function isEntryPoint() {
  if (!process.argv[1]) return false;
  return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

async function main() {
  let opts;
  try {
    opts = parseCliArgs(process.argv.slice(2));
  } catch (err) {
    console.error(err && err.message ? err.message : String(err));
    console.error(USAGE);
    process.exit(1);
  }

  if (opts.help) {
    console.log(USAGE);
    process.exit(0);
  }

  if (opts.prompt) {
    await run(opts.prompt, opts);
    return;
  }

  const rl = createInterface({ input: process.stdin });
  const lines = [];
  let stdinBytes = 0;
  let stdinLimitExceeded = false;
  // lines.join('\n') always uses a 1-byte newline regardless of platform.
  const newlineBytes = 1;
  rl.on('line', (line) => {
    if (stdinLimitExceeded) return;
    const separatorBytes = lines.length > 0 ? newlineBytes : 0;
    const nextBytes = stdinBytes + separatorBytes + Buffer.byteLength(line, 'utf8');
    if (nextBytes > EFFECTIVE_MAX_STDIN_BYTES) {
      stdinLimitExceeded = true;
      rl.close();
      return;
    }
    stdinBytes = nextBytes;
    lines.push(line);
  });
  rl.on('close', async () => {
    if (stdinLimitExceeded) {
      console.error(
        `Input from stdin exceeds ${(EFFECTIVE_MAX_STDIN_BYTES / (1024 * 1024)).toFixed(1)} MB limit. Provide a shorter prompt.`
      );
      // Use exitCode rather than process.exit() so buffered stderr is flushed
      // before the process terminates naturally.
      process.exitCode = 1;
      return;
    }
    await run(lines.join('\n'), opts);
  });
}

if (isEntryPoint()) {
  await main();
}

#!/usr/bin/env node
/**
 * Headless Gemini CLI: run Gemini with a prompt and optional model.
 * No MCP required. Uses: gemini -p "..." [-m model] [--output-format json] [--yolo]
 * Usage: node ask-gemini.mjs "your prompt" [--model gemini-2.5-flash] [--json]
 *        echo "prompt" | node ask-gemini.mjs [--model gemini-2.5-flash] [--json]
 */
import { spawn } from 'child_process';
import { createInterface } from 'readline';

const args = process.argv.slice(2);
let prompt = '';
let model = '';
let outputJson = false;
let sandbox = false;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--model' || args[i] === '-m') {
    model = args[i + 1] || '';
    i++;
  } else if (args[i] === '--json') {
    outputJson = true;
  } else if (args[i] === '--sandbox' || args[i] === '-s') {
    sandbox = true;
  } else if (!args[i].startsWith('-')) {
    prompt = args[i];
    break;
  }
}

function run(promptText) {
  if (!promptText || !promptText.trim()) {
    console.error('Usage: node ask-gemini.mjs "prompt" [--model MODEL] [--json] [--sandbox]');
    process.exit(1);
  }
  const cliArgs = ['-p', promptText.trim()];
  if (model) cliArgs.push('-m', model);
  if (sandbox) cliArgs.push('-s');
  if (outputJson) cliArgs.push('--output-format', 'json');
  cliArgs.push('--yolo'); // non-interactive / auto-approve for headless

  // Use argument array only (no shell string) so the prompt is passed as a single argv to gemini.
  const runOptions = { stdio: ['pipe', 'pipe', 'pipe'], env: process.env, shell: false };

  function onClose(stdout, stderr, code) {
    if (code !== 0) {
      console.error(stderr || stdout);
      const hint =
        (stderr || stdout).toLowerCase().includes('not found') ||
        (stderr || stdout).toLowerCase().includes('command not found')
          ? '\nHint: Is the Gemini CLI installed and authenticated? Run: node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs'
          : '';
      if (hint) console.error(hint);
      process.exit(code ?? 1);
    }
    if (outputJson) {
      try {
        const data = JSON.parse(stdout);
        process.stdout.write(data.response ?? stdout);
      } catch (e) {
        process.stderr.write(
          'Warning: Gemini did not return valid JSON; raw output below. (' +
            (e && e.message ? e.message : 'parse error') +
            ')\n'
        );
        process.stdout.write(stdout);
        process.exit(1);
      }
    } else {
      process.stdout.write(stdout);
    }
  }

  function runProc(executable, execArgs) {
    const proc = spawn(executable, execArgs, runOptions);
    let stdout = '';
    let stderr = '';
    proc.stdout.setEncoding('utf8');
    proc.stderr.setEncoding('utf8');
    proc.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    proc.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    proc.on('close', (code) => onClose(stdout, stderr, code));
    proc.on('error', (err) => {
      if (err.code === 'ENOENT' && executable === 'gemini') {
        runProc('npx', ['-y', '@google/gemini-cli', ...cliArgs]);
      } else {
        console.error('Failed to run gemini:', err.message);
        console.error(
          'Hint: Is the Gemini CLI installed? Run: node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs'
        );
        process.exit(1);
      }
    });
  }

  runProc('gemini', cliArgs);
}

if (prompt) {
  run(prompt);
} else {
  const rl = createInterface({ input: process.stdin });
  const lines = [];
  rl.on('line', (line) => lines.push(line));
  rl.on('close', () => run(lines.join('\n')));
}

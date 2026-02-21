import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const SCRIPT_PATH = path.resolve('.claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs');

function makeGeminiStubDir() {
  const dir = mkdtempSync(path.join(tmpdir(), 'gemini-stub-'));
  const stubJsPath = path.join(dir, 'gemini-stub.mjs');
  const shimPath = path.join(dir, process.platform === 'win32' ? 'gemini.cmd' : 'gemini');

  writeFileSync(
    stubJsPath,
    `#!/usr/bin/env node
const mode = process.env.GEMINI_STUB_MODE || 'echo';
const args = process.argv.slice(2);
let stdin = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (stdin += chunk));
process.stdin.on('end', () => {
  if (mode === 'json') {
    process.stdout.write(JSON.stringify({ response: 'stub response' }));
    return;
  }
  if (mode === 'invalid-json') {
    process.stdout.write('not-json');
    return;
  }
  if (mode === 'error') {
    process.stderr.write('stub failure');
    process.exit(2);
    return;
  }
  process.stdout.write(JSON.stringify({ args, stdin }));
});
`
  );

  if (process.platform === 'win32') {
    writeFileSync(shimPath, `@echo off\r\n"${process.execPath}" "${stubJsPath}" %*\r\n`);
  } else {
    writeFileSync(shimPath, `#!/usr/bin/env bash\n"${process.execPath}" "${stubJsPath}" "$@"\n`);
    chmodSync(shimPath, 0o755);
  }

  return dir;
}

function runAskGemini(args, mode) {
  const stubDir = makeGeminiStubDir();
  const env = {
    ...process.env,
    GEMINI_STUB_MODE: mode,
    PATH: `${stubDir}${path.delimiter}${process.env.PATH || ''}`,
  };

  const result = spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    cwd: path.resolve('.'),
    env,
    encoding: 'utf8',
  });

  rmSync(stubDir, { recursive: true, force: true });
  return result;
}

describe('ask-gemini integration', () => {
  it('forwards stdin prompt and required flags to gemini', () => {
    const result = runAskGemini(['hello world'], 'echo');

    assert.equal(result.status, 0);
    const parsed = JSON.parse(result.stdout);
    assert.deepEqual(parsed.args, ['-p', '', '--yolo']);
    assert.equal(parsed.stdin, 'hello world');
  });

  it('returns consistent json envelope when --json is used', () => {
    const result = runAskGemini(['--json', 'prompt text'], 'json');

    assert.equal(result.status, 0);
    const parsed = JSON.parse(result.stdout);
    assert.deepEqual(parsed, { response: 'stub response' });
  });

  it('returns json error envelope and non-zero exit for invalid json in --json mode', () => {
    const result = runAskGemini(['--json', 'prompt text'], 'invalid-json');

    assert.equal(result.status, 1);
    const parsed = JSON.parse(result.stdout);
    assert.equal(typeof parsed.error, 'string');
    assert.equal(parsed.raw, 'not-json');
    assert.match(result.stderr, /Warning: Gemini did not return valid JSON\./);
  });

  it('propagates gemini non-zero exit and stderr', () => {
    const result = runAskGemini(['prompt text'], 'error');

    assert.equal(result.status, 2);
    assert.match(result.stderr, /stub failure/);
  });
});

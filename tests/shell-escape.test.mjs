/**
 * Unit tests for Windows cmd.exe prompt escaping (shell-escape.mjs).
 * Run from repo root: node --test tests/shell-escape.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { escapeForWindowsCmd } from '../.claude/skills/omega-gemini-cli/scripts/shell-escape.mjs';

describe('escapeForWindowsCmd', () => {
  it('escapes double quotes (cmd.exe use "" not \\)', () => {
    assert.strictEqual(escapeForWindowsCmd('say "hello"'), 'say ""hello""');
  });

  it('escapes percent', () => {
    assert.strictEqual(escapeForWindowsCmd('path %PATH%'), 'path ^%PATH^%');
  });

  it('escapes caret', () => {
    assert.strictEqual(escapeForWindowsCmd('a^b'), 'a^^b');
  });

  it('escapes double quote as "" for cmd.exe', () => {
    assert.strictEqual(escapeForWindowsCmd('backslash"quote'), 'backslash""quote');
  });

  it('does not escape dollar sign (not special in cmd.exe)', () => {
    assert.strictEqual(escapeForWindowsCmd('$HOME'), '$HOME');
    assert.strictEqual(escapeForWindowsCmd('costs $100'), 'costs $100');
  });

  it('returns empty string for non-string', () => {
    assert.strictEqual(escapeForWindowsCmd(null), '');
    assert.strictEqual(escapeForWindowsCmd(undefined), '');
  });

  it('leaves safe text unchanged', () => {
    assert.strictEqual(escapeForWindowsCmd('hello world'), 'hello world');
    assert.strictEqual(escapeForWindowsCmd('prompt with spaces'), 'prompt with spaces');
  });

  it('leaves cmd.exe non-special chars unchanged inside double-quoted strings', () => {
    // &, |, <, >, (, ) are NOT special inside double-quoted cmd.exe strings — no escaping needed
    assert.strictEqual(escapeForWindowsCmd('echo 1 & echo 2'), 'echo 1 & echo 2');
    assert.strictEqual(escapeForWindowsCmd('a | b'), 'a | b');
    assert.strictEqual(escapeForWindowsCmd('input < file.txt'), 'input < file.txt');
    assert.strictEqual(escapeForWindowsCmd('output > file.txt'), 'output > file.txt');
    assert.strictEqual(escapeForWindowsCmd('(grouped)'), '(grouped)');
  });

  it('leaves whitespace-only string unchanged', () => {
    assert.strictEqual(escapeForWindowsCmd('   '), '   ');
    assert.strictEqual(escapeForWindowsCmd('\t\n'), '\t\n');
  });

  it('handles mixed special chars', () => {
    const out = escapeForWindowsCmd('test "quoted" and %VAR% and ^caret');
    assert.ok(out.includes('""'));
    assert.ok(out.includes('^%'));
    assert.ok(out.includes('^^'));
  });
});

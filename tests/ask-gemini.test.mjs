/**
 * Unit tests for ask-gemini.mjs arg parsing, command construction, and JSON output formatting.
 * Extracted pure functions enable testing without spawning processes.
 * Run from repo root: node --test tests/ask-gemini.test.mjs
 *
 * Naming convention: method_scenario_expectedResult
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertNonEmptyPrompt,
  parseCliArgs,
} from '../.claude/skills/omega-gemini-cli/scripts/parse-args.mjs';
import { formatJsonOutput } from '../.claude/skills/omega-gemini-cli/scripts/format-output.mjs';
import {
  buildGeminiArgs,
  getExecutables,
} from '../.claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs';

// ---------------------------------------------------------------------------
// parseCliArgs
// ---------------------------------------------------------------------------

describe('parseCliArgs', () => {
  it('parses prompt and options', () => {
    const opts = parseCliArgs([
      'review this',
      '--model',
      'gemini-2.5-flash',
      '--json',
      '--sandbox',
    ]);
    assert.equal(opts.prompt, 'review this');
    assert.equal(opts.model, 'gemini-2.5-flash');
    assert.equal(opts.outputJson, true);
    assert.equal(opts.sandbox, true);
  });

  it('parses timeout and help flags', () => {
    const opts = parseCliArgs(['--timeout-ms', '5000', '--help']);
    assert.equal(opts.timeoutMs, 5000);
    assert.equal(opts.help, true);
  });

  it('supports prompt after -- sentinel', () => {
    const opts = parseCliArgs(['--model', 'gemini-2.5-flash', '--', '--not-a-flag', 'value']);
    assert.equal(opts.model, 'gemini-2.5-flash');
    assert.equal(opts.prompt, '--not-a-flag value');
  });

  it('throws on unknown option', () => {
    assert.throws(() => parseCliArgs(['--nope']), /Unknown option/);
  });

  it('throws on invalid timeout', () => {
    assert.throws(() => parseCliArgs(['--timeout-ms', '0']), /Invalid value for --timeout-ms/);
  });

  it('throws when --model is missing value', () => {
    assert.throws(() => parseCliArgs(['--model']), /Missing value for --model/);
  });

  it('supports -m shorthand for --model', () => {
    const opts = parseCliArgs(['review this', '-m', 'gemini-2.5-flash']);
    assert.equal(opts.model, 'gemini-2.5-flash');
    assert.equal(opts.prompt, 'review this');
  });

  it('supports -s shorthand for --sandbox', () => {
    const opts = parseCliArgs(['-s', 'run this']);
    assert.equal(opts.sandbox, true);
    assert.equal(opts.prompt, 'run this');
  });

  it('parses flags after prompt correctly', () => {
    const opts = parseCliArgs(['hello world', '--model', 'gemini-2.5-flash']);
    assert.equal(opts.prompt, 'hello world');
    assert.equal(opts.model, 'gemini-2.5-flash');
  });

  it('returns empty prompt when only flags provided', () => {
    const opts = parseCliArgs(['--model', 'gemini-2.5-flash']);
    assert.equal(opts.prompt, '');
  });
});

// ---------------------------------------------------------------------------
// assertNonEmptyPrompt
// ---------------------------------------------------------------------------

describe('assertNonEmptyPrompt', () => {
  it('throws for empty prompt', () => {
    assert.throws(() => assertNonEmptyPrompt('  '), /Prompt is required/);
  });

  it('accepts non-empty prompt', () => {
    assert.doesNotThrow(() => assertNonEmptyPrompt('ok'));
  });
});

// ---------------------------------------------------------------------------
// buildGeminiArgs
// ---------------------------------------------------------------------------

describe('buildGeminiArgs', () => {
  it('constructs minimal args when only prompt provided', () => {
    const args = buildGeminiArgs({ prompt: 'hi', model: '', outputJson: false, sandbox: false });
    assert.deepEqual(args, ['-p', '', '--yolo']);
  });

  it('constructs required args and optional flags', () => {
    const args = buildGeminiArgs({
      prompt: 'analyze file',
      model: 'gemini-2.5-flash',
      outputJson: true,
      sandbox: true,
    });
    assert.deepEqual(args, [
      '-p',
      '',
      '--yolo',
      '-s',
      '-m',
      'gemini-2.5-flash',
      '--output-format',
      'json',
    ]);
  });
});

// ---------------------------------------------------------------------------
// getExecutables
// ---------------------------------------------------------------------------

describe('getExecutables', () => {
  it('returns Windows candidates with shell commands', () => {
    const candidates = getExecutables(['-p', '', '--yolo'], true, '');
    assert.equal(candidates.length, 2);
    assert.ok(candidates[0].executable.startsWith('gemini'));
    assert.ok(candidates[1].executable.startsWith('npx'));
    assert.equal(candidates[0].shell, true);
  });

  it('returns non-Windows candidates', () => {
    const candidates = getExecutables(['-p', '', '--yolo'], false, '');
    assert.equal(candidates[0].executable, 'gemini');
    assert.equal(candidates[1].executable, 'npx');
  });
});

// ---------------------------------------------------------------------------
// formatJsonOutput
// ---------------------------------------------------------------------------

describe('formatJsonOutput', () => {
  describe('successful Gemini JSON', () => {
    it('formatJsonOutput_validGeminiJson_returnsResponseObject', () => {
      const geminiOutput = JSON.stringify({ response: 'Paris is the capital of France.' });
      const result = formatJsonOutput(geminiOutput);
      assert.equal(result.exitCode, 0);
      const parsed = JSON.parse(result.output);
      assert.equal(parsed.response, 'Paris is the capital of France.');
    });

    it('formatJsonOutput_validJson_outputIsValidJson', () => {
      const geminiOutput = JSON.stringify({ response: 'hello' });
      const result = formatJsonOutput(geminiOutput);
      assert.doesNotThrow(() => JSON.parse(result.output));
    });

    it('formatJsonOutput_missingResponseField_returnsEmptyString', () => {
      const geminiOutput = JSON.stringify({ something_else: 'foo' });
      const result = formatJsonOutput(geminiOutput);
      assert.equal(result.exitCode, 0);
      const parsed = JSON.parse(result.output);
      assert.equal(parsed.response, '');
    });
  });

  describe('edge cases', () => {
    it('formatJsonOutput_emptyString_returnsErrorObject', () => {
      const result = formatJsonOutput('');
      assert.equal(result.exitCode, 1);
      assert.doesNotThrow(() => JSON.parse(result.output));
      const parsed = JSON.parse(result.output);
      assert.ok(parsed.error);
    });

    it('formatJsonOutput_nonStringResponse_passesValueThrough', () => {
      const result = formatJsonOutput(JSON.stringify({ response: 123 }));
      assert.equal(result.exitCode, 0);
      const parsed = JSON.parse(result.output);
      assert.equal(parsed.response, 123);
    });
  });

  describe('invalid / non-JSON Gemini output', () => {
    it('formatJsonOutput_plainText_returnsErrorObject', () => {
      const result = formatJsonOutput('not json at all');
      assert.equal(result.exitCode, 1);
      const parsed = JSON.parse(result.output);
      assert.ok(parsed.error);
      assert.equal(parsed.raw, 'not json at all');
    });

    it('formatJsonOutput_invalidJson_outputIsValidJson', () => {
      const result = formatJsonOutput('broken { json');
      assert.doesNotThrow(() => JSON.parse(result.output));
    });

    it('formatJsonOutput_invalidJson_setsWarning', () => {
      const result = formatJsonOutput('broken json');
      assert.ok(result.warning);
      assert.ok(result.warning.includes('Warning'));
    });
  });
});

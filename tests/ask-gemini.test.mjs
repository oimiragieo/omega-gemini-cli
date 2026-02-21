/**
 * Unit tests for ask-gemini arg parsing and JSON output formatting.
 * Extracted pure functions enable testing without spawning processes.
 * Run from repo root: node --test tests/ask-gemini.test.mjs
 *
 * Naming convention: method_scenario_expectedResult
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs } from '../.claude/skills/omega-gemini-cli/scripts/parse-args.mjs';
import { formatJsonOutput } from '../.claude/skills/omega-gemini-cli/scripts/format-output.mjs';

// ---------------------------------------------------------------------------
// parseArgs
// ---------------------------------------------------------------------------

describe('parseArgs', () => {
  describe('prompt extraction', () => {
    it('parseArgs_quotedPrompt_returnsFullPrompt', () => {
      const result = parseArgs(['What is 2 plus 2']);
      assert.equal(result.prompt, 'What is 2 plus 2');
    });

    it('parseArgs_unquotedMultiWordPrompt_joinsAllWords', () => {
      // Simulates: node ask-gemini.mjs What is the capital of France
      const result = parseArgs(['What', 'is', 'the', 'capital', 'of', 'France']);
      assert.equal(result.prompt, 'What is the capital of France');
    });

    it('parseArgs_flagsAfterPrompt_promptDoesNotIncludeFlags', () => {
      // Bug fix: flags after prompt were previously swallowed into the prompt string
      const result = parseArgs(['hello world', '--model', 'gemini-2.5-flash']);
      assert.equal(result.prompt, 'hello world');
      assert.equal(result.model, 'gemini-2.5-flash');
    });

    it('parseArgs_noPrompt_returnsEmptyString', () => {
      const result = parseArgs(['--model', 'gemini-2.5-flash']);
      assert.equal(result.prompt, '');
    });
  });

  describe('--model / -m flag', () => {
    it('parseArgs_longModelFlag_setsModel', () => {
      const result = parseArgs(['--model', 'gemini-2.5-flash', 'my prompt']);
      assert.equal(result.model, 'gemini-2.5-flash');
      assert.equal(result.prompt, 'my prompt');
    });

    it('parseArgs_shortModelFlag_setsModel', () => {
      const result = parseArgs(['-m', 'gemini-2.5-pro', 'my prompt']);
      assert.equal(result.model, 'gemini-2.5-pro');
    });

    it('parseArgs_modelAsLastArg_doesNotCrash', () => {
      // Bug fix: --model as final arg had no bounds check
      const result = parseArgs(['my prompt', '--model']);
      assert.equal(result.prompt, 'my prompt');
      assert.equal(result.model, '');
    });

    it('parseArgs_noModelFlag_returnsEmptyString', () => {
      const result = parseArgs(['my prompt']);
      assert.equal(result.model, '');
    });
  });

  describe('--json flag', () => {
    it('parseArgs_jsonFlag_setsOutputJson', () => {
      const result = parseArgs(['--json', 'my prompt']);
      assert.equal(result.outputJson, true);
    });

    it('parseArgs_noJsonFlag_outputJsonFalse', () => {
      const result = parseArgs(['my prompt']);
      assert.equal(result.outputJson, false);
    });
  });

  describe('--sandbox / -s flag', () => {
    it('parseArgs_sandboxFlag_setsSandbox', () => {
      const result = parseArgs(['--sandbox', 'my prompt']);
      assert.equal(result.sandbox, true);
    });

    it('parseArgs_shortSandboxFlag_setsSandbox', () => {
      const result = parseArgs(['-s', 'my prompt']);
      assert.equal(result.sandbox, true);
    });

    it('parseArgs_noSandboxFlag_sandboxFalse', () => {
      const result = parseArgs(['my prompt']);
      assert.equal(result.sandbox, false);
    });
  });

  describe('prompt edge cases', () => {
    it('parseArgs_promptWithInternalQuotes_preservesQuotes', () => {
      const result = parseArgs(['What is "the best" answer?']);
      assert.equal(result.prompt, 'What is "the best" answer?');
    });

    it('parseArgs_duplicateModelFlag_usesLastValue', () => {
      const result = parseArgs(['--model', 'm1', '--model', 'm2', 'my prompt']);
      assert.equal(result.model, 'm2');
      assert.equal(result.prompt, 'my prompt');
    });
  });

  describe('combined flags', () => {
    it('parseArgs_allFlagsBeforePrompt_parsesCorrectly', () => {
      const result = parseArgs(['--model', 'gemini-2.5-flash', '--json', '--sandbox', 'run this']);
      assert.equal(result.model, 'gemini-2.5-flash');
      assert.equal(result.outputJson, true);
      assert.equal(result.sandbox, true);
      assert.equal(result.prompt, 'run this');
    });

    it('parseArgs_allFlagsAfterPrompt_parsesCorrectly', () => {
      // This was broken before (flags after prompt were absorbed into prompt)
      const result = parseArgs(['run this', '--model', 'gemini-2.5-flash', '--json', '--sandbox']);
      assert.equal(result.prompt, 'run this');
      assert.equal(result.model, 'gemini-2.5-flash');
      assert.equal(result.outputJson, true);
      assert.equal(result.sandbox, true);
    });
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
      // Fix: success must also return JSON (not plain text) when --json is used
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
      // response: 123 is valid JSON — value passes through as-is
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
      // Fix: error case must also return valid JSON (consistent with success case)
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

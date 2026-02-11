#!/usr/bin/env node
/**
 * Verify omega-gemini-cli headless setup: Node and Gemini CLI only. No MCP required.
 * Exit 0 if all OK, 1 otherwise. Read-only.
 * Usage: node verify-setup.mjs
 */
import { execSync } from 'child_process';

const MIN_NODE_MAJOR = 18;

function checkNode() {
  const v = process.version.slice(1).split('.')[0];
  const major = parseInt(v, 10);
  if (major >= MIN_NODE_MAJOR) return { ok: true };
  return { ok: false, message: `Node ${MIN_NODE_MAJOR}+ required; current: ${process.version}` };
}

function checkGeminiCLI() {
  try {
    execSync('gemini -help', { stdio: 'pipe', timeout: 5000 });
    return { ok: true, how: 'gemini' };
  } catch {
    try {
      execSync('npx -y @google/gemini-cli -help', { stdio: 'pipe', timeout: 15000 });
      return { ok: true, how: 'npx @google/gemini-cli' };
    } catch {
      return {
        ok: false,
        message:
          'Gemini CLI not found. Install: npm install -g @google/gemini-cli or use npx @google/gemini-cli',
      };
    }
  }
}

function main() {
  const report = [];
  let allOk = true;

  const nodeResult = checkNode();
  if (nodeResult.ok) {
    report.push('OK Node: ' + process.version);
  } else {
    report.push('MISSING Node: ' + nodeResult.message);
    allOk = false;
  }

  const geminiResult = checkGeminiCLI();
  if (geminiResult.ok) {
    report.push('OK Gemini CLI: ' + (geminiResult.how || 'found'));
  } else {
    report.push('MISSING Gemini CLI: ' + geminiResult.message);
    allOk = false;
  }

  report.push('Headless mode: no MCP config required. Use scripts/ask-gemini.mjs to run Gemini.');

  console.log(report.join('\n'));
  process.exit(allOk ? 0 : 1);
}

main();

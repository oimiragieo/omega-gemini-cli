#!/usr/bin/env node
/**
 * Add gemini-cli MCP server to Claude config if missing. Idempotent.
 * Usage: node ensure-mcp-config.mjs
 */
import fs from 'fs';
import path from 'path';

const MCP_SERVER_ID = 'gemini-cli';
const MCP_ENTRY = {
  command: 'npx',
  args: ['-y', 'gemini-mcp-tool'],
};

function getClaudeConfigPath() {
  const platform = process.platform;
  const home = process.env.HOME || process.env.USERPROFILE;
  const appData = process.env.APPDATA;

  if (platform === 'win32' && appData) {
    return path.join(appData, 'Claude', 'claude_desktop_config.json');
  }
  if (platform === 'darwin' && home) {
    return path.join(
      home,
      'Library',
      'Application Support',
      'Claude',
      'claude_desktop_config.json'
    );
  }
  if (home) {
    return path.join(home, '.config', 'claude', 'claude_desktop_config.json');
  }
  return null;
}

function main() {
  const configPath = getClaudeConfigPath();
  if (!configPath) {
    console.error('Could not resolve Claude config path (missing HOME or APPDATA).');
    process.exit(1);
  }

  const dir = path.dirname(configPath);
  let config = {};

  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      console.error('Invalid JSON in config:', configPath, e.message);
      process.exit(1);
    }
  }

  if (!config.mcpServers || typeof config.mcpServers !== 'object') {
    config.mcpServers = {};
  }

  if (config.mcpServers[MCP_SERVER_ID]) {
    const entry = config.mcpServers[MCP_SERVER_ID];
    const args = entry.args || [];
    const hasTool = args.some((a) => String(a).includes('gemini-mcp-tool'));
    if (hasTool) {
      console.log('Already configured:', configPath);
      process.exit(0);
      return;
    }
  }

  config.mcpServers[MCP_SERVER_ID] = MCP_ENTRY;

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    console.log('MCP config updated:', configPath);
  } catch (e) {
    console.error('Failed to write config:', e.message);
    process.exit(1);
  }
}

main();

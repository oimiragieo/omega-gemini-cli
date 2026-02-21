#!/usr/bin/env node
/**
 * Escape a prompt for safe use inside a Windows cmd.exe double-quoted string.
 * In cmd.exe: ^ is the escape char; % expands env vars; " terminates the string.
 * &, |, <, >, (, ) are NOT special inside double-quoted strings and need no escaping.
 * $ is NOT special in cmd.exe (unlike bash), so no escaping needed.
 * Order matters: escape ^ first so it doesn't double-escape the ^ we add for %.
 */
export function escapeForWindowsCmd(prompt) {
  if (typeof prompt !== 'string') return '';
  return prompt.replace(/\^/g, '^^').replace(/%/g, '^%').replace(/"/g, '""');
}

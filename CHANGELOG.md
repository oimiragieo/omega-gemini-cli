# Changelog

## [Unreleased]

- **Bug fix**: Prompt truncation — unquoted multi-word prompts (e.g. `node ask-gemini.mjs What is 2 plus 2`) now capture the full prompt instead of only the first word.
- **Bug fix**: Arg parsing now uses `node:util parseArgs` — flags may appear before or after the prompt in any order; `--model` as the last arg no longer crashes.
- **Bug fix**: `--json` output is now a consistent `{"response":"..."}` envelope on both success and error (previously success returned plain text).
- **Bug fix**: Prompt sent via stdin on all platforms — removes `ARG_MAX` risk on Linux/macOS; Windows already used stdin.
- **Bug fix**: Windows `npx` fallback now also triggers on exit code `9009` (`command not found` in cmd.exe), not only on `ENOENT`.
- **Improvement**: Intentional leading/trailing whitespace in prompts is now preserved (removed `.trim()` on stdin write).
- **Improvement**: `npx` fallback emits a warning so users know why the response may be slow.
- **New scripts**: `parse-args.mjs` (pure arg parser, exported for testing) and `format-output.mjs` (pure JSON formatter, exported for testing).
- **Tests**: Added `tests/ask-gemini.test.mjs` — 27 unit tests for arg parsing and JSON output using native `node:test` + `node:assert`. Total suite now 35 tests.
- **Tests**: Added 7 new tests to `tests/shell-escape.test.mjs` covering cmd.exe non-special chars (`&`, `|`, `<`, `>`, `()`) and whitespace-only strings.
- **Docs**: Added `## Response times` section to all three `SKILL.md` files (~2 min for simple queries, ~5–10 min for codebase reviews).
- **Docs**: Updated `--json` description across all SKILL.md files, Cursor rules, `references/headless.md`, and `references/tools.md` to reflect the new consistent JSON envelope.

- **README**: "What this is" is now a table (Path | Purpose). Writing guide applied (voice, tone, punctuation). Quick start clarifies that setup is only needed when Gemini CLI isn't installed or you haven't signed in; Node is required either way. Sandbox and Analyze/Brainstorm sections with tested examples. Headless table documents Claude `--dangerously-skip-permissions`, script usage, and Copilot/Codex/Cursor. Repository contents table; `.claude` required for all agents.
- **CI**: Tests included in repo so `npm test` passes; Prettier format for README.

## 2.0.0 — Portable headless skill (no MCP)

- **Headless-only**: Replaced MCP server with a portable `.claude` skill that runs the Gemini CLI in headless mode via scripts. No MCP server or MCP configuration required.
- **Scripts**: Added `ask-gemini.mjs` (prompt, `--model`, `--sandbox`, `--json`) and `verify-setup.mjs` (Node + Gemini CLI check). Removed dependency on `npx gemini-mcp-tool`.
- **Commands**: /analyze, /sandbox, /brainstorm, /omega-gemini, /omega-gemini-setup—all invoke the headless script or verify-setup from the project root.
- **References**: installation, auth, headless, tools, models-2026, copy-and-run, mcp-vs-headless (feature comparison), hooks.
- **Copy-and-run**: Documented what to copy (`.claude` and optionally `.cursor`) and that paths are relative to the project root.
- **Removed**: MCP server source (`src/`), npm package build, VitePress docs site, and CI/deploy workflows. Repo is now skill + README + CHANGELOG + LICENSE.

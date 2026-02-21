---
name: omega-gemini-cli
description: Use when the user wants to use Google Gemini for analysis, large files or codebases, sandbox execution, or brainstorming. Uses headless Gemini CLI scripts (no MCP). Triggers on "use Gemini", "analyze with Gemini", "large file", "sandbox", "brainstorm with Gemini".
allowed-tools: Read, Grep, Bash
---

# Omega Gemini CLI (headless)

This skill uses the **Gemini CLI in headless mode** so Claude can run Gemini from scripts—no MCP server or MCP configuration required.

## Response times

Gemini CLI runs as a subprocess and includes model startup time. Typical wall-clock times observed on this setup:

- Simple Q&A / news query: ~2 minutes
- Codebase or large-file review: ~5–10 minutes

Set expectations with the user before running long tasks.

## Overview

Run Gemini via the headless script: [scripts/ask-gemini.mjs](./scripts/ask-gemini.mjs) (from the skill root) or `.claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs` (from the project root). It invokes `gemini -p "..."` (and optional `-m`, `-s`, `--output-format json`, `--yolo`) and returns the response. Requires **Node.js** and the **Google Gemini CLI** to be installed. For one-time setup after copying this folder, run **/omega-gemini-setup**. For install and auth, see [references/installation.md](references/installation.md) and [references/auth.md](references/auth.md).

## First-time setup

If the user has not set up Gemini CLI yet, direct them to run **/omega-gemini-setup**. That runs the verification script (`node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs`) and guides them to install Node, install Gemini CLI, and complete one-time auth. No MCP config is needed.

## How to run Gemini (headless)

From the project root (where `.claude` lives), run:

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "USER_PROMPT"
```

Options (append to the command):

- `--model MODEL` / `-m MODEL` — model to use (e.g. `gemini-2.5-flash`). Avoid quota issues by using Flash or Flash-lite.
- `--sandbox` / `-s` — sandbox mode.
- `--json` — output a JSON object `{"response":"..."}` (consistent envelope on success and error).

Gemini CLI also supports `--output-format stream-json`, `--approval-mode`, `--allowed-tools`, `--resume`, and more. See [references/headless.md](references/headless.md) for the full `gemini --help` reference.

Examples:

- Analysis: `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Review @src/main.js for bugs"`
- With model: `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Summarize this" --model gemini-2.5-flash`
- Stdin: `echo "Explain recursion" | node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs`

When the user says "ask gemini for feedback" (or similar), build the prompt from their request and any @ file refs, then run the script and return the script output to the user.

## When to use this skill

- **Large files or codebases** — Use Gemini's context for analysis.
- **Second opinion / feedback** — User wants Gemini's take on code or docs.
- **Sandbox** — Run or test code via Gemini (use `--sandbox` in the script when supported).
- **Brainstorming** — Build a prompt that includes the challenge and optional methodology (e.g. "Brainstorm 5 ideas using SCAMPER: ...") and run the script.

For full headless options and examples, see [references/headless.md](references/headless.md). For features the old MCP had that are not in headless (change mode, chunking, structured brainstorm), see [references/mcp-vs-headless.md](references/mcp-vs-headless.md). For copying this skill into another project, see [references/copy-and-run.md](references/copy-and-run.md). Other surfaces: [Cursor](references/cursor.md), [Codex CLI](references/codex.md), [GitHub Copilot CLI](references/copilot-cli.md), [Antigravity IDE](references/antigravity.md), [VS Code](references/vscode.md), [Gemini CLI (native feedback/test)](references/gemini-native.md).

## Cursor CLI from Windows

If the user is on **Windows** and wants to run the **Cursor headless CLI** (`cursor-agent`), the binary is only on PATH inside WSL. Always use this form so the command works from Windows Claude (or any Windows terminal):

```bash
wsl bash -lc "cursor-agent -p 'USER_PROMPT'"
```

Use single quotes around the prompt inside the double-quoted string to avoid escaping issues. Do not suggest `cursor-agent -p "..."` alone on Windows—it will not run unless the user is already inside a WSL shell.

## Slash commands

- **/analyze** — Run the headless script with the user's prompt (and any @ refs). Example: `/analyze summarize @README.md`.
- **/sandbox** — Run the script with `--sandbox` and the user's prompt (e.g. run or test code).
- **/omega-gemini** — Same as above: use the headless script for analysis, sandbox, or brainstorm as appropriate.
- **/omega-gemini-setup** — Verify Node and Gemini CLI; guide the user to install and auth. No MCP.

Natural language: "use gemini to explain index.html", "ask gemini for feedback on this function", "brainstorm with Gemini using design thinking".

## Models (2026)

Gemini CLI model IDs: **gemini-3-pro-preview**, **gemini-3-flash-preview**, **gemini-2.5-pro**, **gemini-2.5-flash**, **gemini-2.5-flash-lite**. Use `--model gemini-2.5-flash` (or `gemini-2.5-flash-lite`) to reduce quota/latency. See [references/models-2026.md](references/models-2026.md).

## Auth

One-time Google sign-in and quota/auth issues: [references/auth.md](references/auth.md).

## Copy and run in another project

Copy the **entire** `.claude` folder (so you have `.claude/skills/omega-gemini-cli/` and `.claude/commands/`) into the target project. Open that project in Claude and run from its root. Run **/omega-gemini-setup** once, then "ask gemini" works. Details: [references/copy-and-run.md](references/copy-and-run.md).

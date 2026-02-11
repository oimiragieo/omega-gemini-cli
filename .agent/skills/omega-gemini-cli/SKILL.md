---
name: omega-gemini-cli
description: Use when the user wants to use Google Gemini for analysis, large files or codebases, sandbox execution, or brainstorming. Runs headless Gemini CLI via a Node script (no MCP). Triggers on "use Gemini", "ask Gemini", "analyze with Gemini", "large file", "sandbox", "brainstorm with Gemini".
---

# Omega Gemini CLI (headless)

This skill runs the **Gemini CLI in headless mode** so Antigravity can call Gemini from the project—no MCP server or MCP configuration required.

## Overview

From the **project root** (the directory that contains `.claude` and `.agent`), run the headless script. It invokes `gemini -p "..."` with optional model, sandbox, and JSON flags and returns the response. Requires **Node.js** and **Google Gemini CLI** to be installed.

## How to run Gemini

From the project root, run:

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "USER_PROMPT"
```

Optional flags (append to the command):

- `--model gemini-2.5-flash` (or another model) — reduce quota issues.
- `--sandbox` — sandbox mode for running code.
- `--json` — output JSON; the script prints the `.response` field.

Examples:

- Analysis: `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Review @src/main.js for bugs"`
- With model: `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Summarize this" --model gemini-2.5-flash`
- Stdin: `echo "Explain recursion" | node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs`

When the user says "ask Gemini", "use Gemini", or similar, build the prompt from their request and any @ file refs, run this command from the project root, and return the script output.

## When to use this skill

- **Large files or codebases** — Use Gemini's context for analysis.
- **Second opinion / feedback** — User wants Gemini's take on code or docs.
- **Sandbox** — Run or test code via Gemini (add `--sandbox` when supported).
- **Brainstorming** — Build a prompt that includes the challenge and optional method (e.g. SCAMPER) and run the script.

## If Gemini CLI is not set up

If the script fails (e.g. "gemini not found"), direct the user to install Node.js and Gemini CLI and complete one-time auth. Setup can be verified by running from project root:

```bash
node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs
```

Full installation and auth details: `.claude/skills/omega-gemini-cli/references/installation.md` and `references/auth.md` (same repo).

## Shared scripts

Scripts are shared with the Claude and Codex skills: `.claude/skills/omega-gemini-cli/scripts/`. No duplicate copies are required for Antigravity.

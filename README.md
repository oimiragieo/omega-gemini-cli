# Omega Gemini CLI (portable skill for Claude, Codex, Cursor, Gemini CLI, Antigravity, VS Code)

You get a **portable skill** so **Claude**, **Codex**, **Cursor**, **Copilot**, and others can use the **Gemini CLI** in headless mode. You don't need an MCP server or MCP config. **The `.claude` folder is required.** It holds the scripts and skill that run Gemini. The other folders (`.agents`, `.agent`, `.cursor`, `.vscode`) only tell each agent to use that skill; they don't work alone. Copy `.claude` first, then copy the folder for your agent if you use Codex, Antigravity, or VS Code.

## What this is

| Path | Purpose |
|------|---------|
| **.claude/skills/omega-gemini-cli/** | Skill and headless scripts (`ask-gemini.mjs`, `verify-setup.mjs`), plus docs for installation, auth, headless, codex, antigravity, vscode, gemini-native, copy-and-run. No MCP. |
| **.claude/commands/** | Slash commands in Claude: /analyze, /sandbox, /brainstorm, /omega-gemini, /omega-gemini-setup. |
| **.agents/skills/omega-gemini-cli/** | Same headless workflow for **Codex CLI** (OpenAI). |
| **.agent/skills/omega-gemini-cli/** | Same headless workflow for **Antigravity IDE** (Google). |
| **.gemini/skills/omega-feedback-test/** | **Gemini CLI (native)**: feedback and test suggestions when you ask inside Gemini CLI. |
| **.cursor/rules/** | Extra rules so **Cursor** uses the headless script when you say “ask Gemini”. |
| **.vscode/tasks.json** | **VS Code** tasks: Ask Gemini, Verify setup. |
| **references/copilot-cli.md** | **GitHub Copilot CLI** headless usage (`copilot -p "..."`, `COPILOT_MODEL`, PowerShell). |

Everything runs with **Node** and the **Gemini CLI** (e.g. `gemini -p "..."`). No extra npm deps; no build step.

## Quick start (in a new project)

**1. Copy the skill into your project.**  
Copy the **entire** `.claude` folder into your project. **This folder is required.** The scripts (`ask-gemini.mjs`, `verify-setup.mjs`) and skill instructions live here. The `.agents`, `.agent`, `.cursor`, and `.vscode` folders only point their agents at this skill; if you copy one of those without `.claude`, it won't work. Copying `.claude` alone is enough for Claude, Cursor, and GitHub Copilot.

**2. Run setup once.**  
From the project root, run:

```bash
node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs
```

If you use Claude, run **/omega-gemini-setup** in the chat instead. When the script asks, install Node and the Gemini CLI; then run `gemini` in a terminal once to sign in.

**3. Use it.**

- **In Claude:** Say “ask Gemini to analyze this” or use **/analyze**, **/brainstorm**, or **/sandbox**.
- **From a terminal:**  
  `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Your prompt"`  
  See **Analyze and brainstorm** below for example prompts.

**Using Codex, Antigravity, or VS Code?** You still need **.claude** (step 1). Then copy the matching folder as well: **.agents** (Codex), **.agent** (Antigravity), **.vscode** (VS Code tasks). Details: [copy-and-run.md](.claude/skills/omega-gemini-cli/references/copy-and-run.md).

## Analyze and brainstorm

From the **project root**, run the headless script with a prompt. In Claude use **/analyze** or **/brainstorm**; in Codex or Copilot say “ask Gemini to analyze…” / “use Gemini to brainstorm…”.

**Script (all surfaces):**

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT" [--model gemini-2.5-flash]
```

### Analyze

Use it for code or doc review, summaries, and Q&A. You can reference files in the prompt (e.g. “Summarize README.md” or “Review the scripts in .claude/skills/…”).

**Example (tested):**

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "List the main purpose of this project and its top-level folders in 3 short bullet points." --model gemini-2.5-flash
```

### Brainstorm

Use it for idea generation. Include the challenge and, if you want, a method (e.g. SCAMPER, design thinking) or domain.

**Example (tested):**

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Brainstorm 3 short ideas for improving a CLI tool's first-run experience. One sentence each." --model gemini-2.5-flash
```

### Sandbox

Add **`--sandbox`** to run or test code in Gemini’s sandbox. In Claude use **/sandbox**; in Codex or Copilot say “run in Gemini sandbox.”.

**Example (tested):**

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Run a simple Python one-liner in the sandbox: print('Hello from sandbox')" --sandbox --model gemini-2.5-flash
```

Add `--json` for machine-readable output. See [references/headless.md](.claude/skills/omega-gemini-cli/references/headless.md).

## Headless CLI verification

From the project root you can run each agent’s CLI in headless (non-interactive) mode with a single prompt. The commands below assume that CLI is on your PATH.

| Agent                     | Headless command                                    | Notes                                                                                                                                                                                                                                                                               |
| ------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gemini**                | `gemini -p "PROMPT" --yolo` or script               | Use the script for Windows-safe quoting: `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT"`.                                                                                                                                                                    |
| **Claude Code**           | `claude -p "PROMPT" --dangerously-skip-permissions` | Headless run; add `--dangerously-skip-permissions` (like Gemini's `--yolo`) so it doesn’t block on permission prompts. Output goes to stdout.                                                                                                                 |
| **Codex**                 | `codex exec "PROMPT"`                               | Non-interactive; can be slow when using tools (e.g. web search).                                                                                                                                                                                                                    |
| **Cursor**                | `cursor-agent -p "PROMPT"`                          | Cursor CLI in WSL (install: `curl https://cursor.com/install -fsS \| bash`). Use `-p` for headless. From Windows: `wsl bash -lc "cursor-agent -p 'PROMPT'"`.                                                                                                                        |
| **GitHub Copilot**        | `copilot -p "PROMPT"`                               | Install: `npm install -g @github/copilot`. Set `COPILOT_MODEL` for backend (e.g. `claude-sonnet-4.5`, `gpt-5`, `gemini-2.5-pro`). PowerShell: `$env:COPILOT_MODEL="…"; copilot -p "…"`. See [references/copilot-cli.md](.claude/skills/omega-gemini-cli/references/copilot-cli.md). |
| **Antigravity / VS Code** | —                                                   | No standalone headless CLI in PATH; use the IDE or Run Task/terminal.                                                                                                                                                                                                               |

## Requirements

- **Node.js** 18+ to run the scripts.
- **Google Gemini CLI** (e.g. `npm install -g @google/gemini-cli`) and one-time Google sign-in.

## Repository contents

| Path             | Purpose                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `.claude/`       | **Required.** Skill, commands, and headless scripts. All other agent folders depend on this. |
| `.agents/`       | Codex CLI skill; tells Codex to use the scripts in `.claude/`.                              |
| `.agent/`        | Antigravity IDE skill; tells Antigravity to use the scripts in `.claude/`.                  |
| `.gemini/`       | Gemini CLI native skill: feedback and test workflow.                                        |
| `.cursor/rules/` | Cursor IDE rules; Cursor also reads `.claude/skills/`.                                       |
| `.vscode/`       | VS Code tasks (Ask Gemini, Verify setup); runs the script in `.claude/`.                   |
| `README.md`      | This file.                                                                                   |
| `CHANGELOG.md`   | Version history.                                                                             |
| `LICENSE`        | License terms.                                                                               |

No MCP server. The skill doesn't depend on any npm packages; a **package.json** exists for development (lint, format, tests). Scripts live under `.claude/skills/omega-gemini-cli/scripts/` and are shared by Claude, Codex, Copilot, and Antigravity. **Tests:** `npm test` (Node 18+). **CI:** GitHub Actions runs tests and lint on push/PR.

## Resources (Agent Skills docs)

- **[Claude Code — Extend Claude with skills](https://code.claude.com/docs/en/skills)**
- **[Gemini CLI — Agent Skills](https://geminicli.com/docs/cli/skills/)**
- **[Cursor — Agent Skills](https://cursor.com/docs/context/skills)**
- **[GitHub Copilot — About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills#creating-and-adding-skills)** (Copilot coding agent, Copilot CLI, VS Code Insiders)
- **[VS Code — Use Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)**
- **[Codex — Agent Skills](https://developers.openai.com/codex/skills/)**

## License

[MIT License (Non-Commercial)](LICENSE). Commercial use prohibited without prior written permission from the copyright holder.

**Disclaimer:** Unofficial, third-party tool. Not affiliated with, endorsed by, or sponsored by Google.

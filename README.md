# Omega Gemini CLI (portable skill for Claude, Codex, Cursor, Gemini CLI, Antigravity, VS Code)

A **portable skill** that lets **Claude** and **Codex CLI** use the **Gemini CLI in headless mode**—no MCP server or MCP configuration. Copy `.claude` (and optionally `.agents` and `.cursor`) into any project; run setup once; then “ask Gemini” from either agent.

## What this is

- **.claude/skills/omega-gemini-cli/** — Skill with headless scripts (`ask-gemini.mjs`, `verify-setup.mjs`), references: installation, auth, headless, codex, antigravity, vscode, gemini-native, copy-and-run. No MCP.
- **.claude/commands/** — Slash commands (Claude): /analyze, /sandbox, /brainstorm, /omega-gemini, /omega-gemini-setup.
- **.agents/skills/omega-gemini-cli/** — Same headless workflow for **Codex CLI** (OpenAI).
- **.agent/skills/omega-gemini-cli/** — Same headless workflow for **Antigravity IDE** (Google).
- **.gemini/skills/omega-feedback-test/** — **Gemini CLI (native)**: structured feedback and test suggestions when you ask inside Gemini CLI.
- **.cursor/rules/** — Optional rules so **Cursor** uses the headless script when you say “ask Gemini” or similar.
- **.vscode/tasks.json** — Optional **VS Code** tasks: Ask Gemini, Verify setup.

All logic runs via **Node + Gemini CLI** (e.g. `gemini -p "..."`). No npm dependencies; no build step.

## Quick start (in a new project)

1. Copy the **entire** `.claude` folder into your project (so you have `.claude/skills/omega-gemini-cli/` and `.claude/commands/`).
2. For **Codex** copy **.agents**; for **Antigravity** copy **.agent**; for **Gemini CLI** feedback/test copy **.gemini**; for **VS Code** tasks copy **.vscode**; optionally copy **.cursor/rules/** into your project’s `.cursor/rules/`.
3. Open that project in Claude (or run `codex` from the project root) and run **/omega-gemini-setup** in Claude, or run `node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs` from the project root.
4. Install **Node** and **Gemini CLI** if prompted; complete one-time auth (`gemini` in a terminal).
5. In **Claude** say “ask gemini for feedback” or use /analyze, /sandbox, /brainstorm; in **Codex** or **Antigravity** say "ask Gemini"; in **Gemini CLI** ask for "feedback" or "test suggestions"; in **VS Code** use Run Task → Ask Gemini.

See **.claude/skills/omega-gemini-cli/references/copy-and-run.md** and references (codex, antigravity, vscode, gemini-native) for per-surface details.

## Requirements

- **Node.js** 18+ (for running the scripts).
- **Google Gemini CLI** (e.g. `npm install -g @google/gemini-cli`) and one-time Google sign-in.

## Repository contents

| Path             | Purpose                                                               |
| ---------------- | --------------------------------------------------------------------- |
| `.claude/`       | Skill, commands, and headless scripts (Claude; required for scripts). |
| `.agents/`       | Codex CLI skill (same scripts).                                       |
| `.agent/`        | Antigravity IDE skill (same scripts).                                 |
| `.gemini/`       | Gemini CLI native skill: feedback & test workflow.                    |
| `.cursor/rules/` | Optional rules for Cursor IDE.                                        |
| `.vscode/`       | Optional VS Code tasks (Ask Gemini, Verify setup).                    |
| `README.md`      | This file.                                                            |
| `CHANGELOG.md`   | Version history.                                                      |
| `LICENSE`        | License terms.                                                        |

No `src/`, `package.json`, or MCP server. Scripts live under `.claude/skills/omega-gemini-cli/scripts/` and are shared by Claude, Codex, and Antigravity.

## Resources (official Agent Skills docs)

- **[Claude Code — Extend Claude with skills](https://code.claude.com/docs/en/skills)**
- **[Gemini CLI — Agent Skills](https://geminicli.com/docs/cli/skills/)**
- **[Cursor — Agent Skills](https://cursor.com/docs/context/skills)**
- **[VS Code — Use Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)**
- **[Codex — Agent Skills](https://developers.openai.com/codex/skills/)**

## License

See [LICENSE](LICENSE).

**Disclaimer:** This is an unofficial, third-party tool and is not affiliated with, endorsed, or sponsored by Google.

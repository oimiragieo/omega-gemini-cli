# Cursor IDE and Agent Skills

Cursor supports the same **Agent Skills** open standard. The **omega-gemini-cli** skill is already available in Cursor because Cursor discovers skills from **`.claude/skills/`** (project-level, Claude compatibility) in addition to `.cursor/skills/` and `.codex/skills/`.

## How Cursor discovers this skill

Cursor automatically loads skills from:

| Location              | Scope                                          |
| --------------------- | ---------------------------------------------- |
| `.cursor/skills/`     | Project                                        |
| **`.claude/skills/`** | Project (Claude compatibility) ← **this repo** |
| `.codex/skills/`      | Project (Codex compatibility)                  |
| `~/.cursor/skills/`   | User (global)                                  |

This repo has the skill at **`.claude/skills/omega-gemini-cli/`**, so Cursor discovers it with no extra setup. You do **not** need to copy anything into `.cursor/skills/` unless you want a project-specific copy there.

## Skill format alignment

The skill follows Cursor’s expected format:

- **Required**: `SKILL.md` with YAML frontmatter `name` and `description` (name matches folder `omega-gemini-cli`).
- **Optional**: `scripts/`, `references/`, `assets/` (we use `scripts/` and `references/`).
- **Script reference**: From the skill root, the headless script is at `scripts/ask-gemini.mjs`. From the project root, run: `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT"`.

## How to use in Cursor

1. **Automatic**: When you ask for Gemini (e.g. “ask Gemini to review this”), the agent can apply the **omega-gemini-cli** skill and run the headless script.
2. **Manual**: Type **/** in Agent chat and search for **omega-gemini-cli** to invoke the skill explicitly.
3. **View skills**: **Cursor Settings** (Ctrl+Shift+J / Cmd+Shift+J) → **Rules** → skills appear under “Agent Decides”.

## .cursor/rules/ (optional)

This repo also includes **`.cursor/rules/omega-gemini-cli.mdc`** and **omega-gemini-tools.mdc**. They duplicate the “when to use” and “how to run” guidance for Cursor’s rule engine. With Cursor 2.4+ and Agent Skills, the skill in `.claude/skills/` is enough; the rules are optional and can be migrated to skills via **/migrate-to-skills** if you prefer.

## Copying to another project

Copy the **entire** `.claude` folder so the target project has `.claude/skills/omega-gemini-cli/`. Cursor will discover the skill from `.claude/skills/`. Optionally copy `.cursor/rules/` for the legacy rule files.

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

## Headless CLI (print mode)

The **Cursor CLI** installs a **`cursor-agent`** binary in WSL (or Linux/macOS). Install with:

```bash
curl https://cursor.com/install -fsS | bash
```

For **headless** (non-interactive) use, always pass **`-p`** or **`--print`**:

```bash
cursor-agent -p "your prompt"
```

**From Windows (required):** `cursor-agent` is only on PATH in WSL. When assisting a Windows user (e.g. from Claude or Codex on Windows), **always** invoke the Cursor headless CLI via WSL—otherwise the command will not run:

```bash
wsl bash -lc "cursor-agent -p 'what is 5 + 5?'"
```

Use single quotes around the prompt inside the double-quoted string. Do not suggest `cursor-agent -p "..."` from a Windows shell without the `wsl bash -lc "..."` wrapper. **Untrusted prompts:** If the prompt may contain single quotes or user-controlled input, use an env var or temp file instead of inline quoting to avoid injection (e.g. `set CURSOR_PROMPT=...` then `wsl bash -lc "cursor-agent -p \"$CURSOR_PROMPT\""` or pass via file).

Without `-p`, the agent may open an interactive UI window. Add `--force` to allow file modifications. See [Cursor headless docs](https://cursor.com/docs/cli/headless).

## How to use in Cursor

1. **Automatic**: When you ask for Gemini (e.g. “ask Gemini to review this”), the agent can apply the **omega-gemini-cli** skill and run the headless script.
2. **Manual**: Type **/** in Agent chat and search for **omega-gemini-cli** to invoke the skill explicitly.
3. **View skills**: **Cursor Settings** (Ctrl+Shift+J / Cmd+Shift+J) → **Rules** → skills appear under “Agent Decides”.

## .cursor/rules/ (optional)

This repo also includes **`.cursor/rules/omega-gemini-cli.mdc`** and **omega-gemini-tools.mdc**. They duplicate the “when to use” and “how to run” guidance for Cursor’s rule engine. With Cursor 2.4+ and Agent Skills, the skill in `.claude/skills/` is enough; the rules are optional and can be migrated to skills via **/migrate-to-skills** if you prefer.

## Copying to another project

Copy the **entire** `.claude` folder so the target project has `.claude/skills/omega-gemini-cli/`. Cursor will discover the skill from `.claude/skills/`. Optionally copy `.cursor/rules/` for the legacy rule files.

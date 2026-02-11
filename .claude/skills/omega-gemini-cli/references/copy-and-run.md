# Copy and run (portable setup)

To use omega-gemini-cli in another project with no MCP, copy the right folders and run from the **project root**.

## What to copy

**Minimum (skill only):**

- Copy the **entire** `.claude/skills/omega-gemini-cli` folder into the target project so you have:
  - `TARGET_PROJECT/.claude/skills/omega-gemini-cli/SKILL.md`
  - `TARGET_PROJECT/.claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs`
  - `TARGET_PROJECT/.claude/skills/omega-gemini-cli/scripts/verify-setup.mjs`
  - `TARGET_PROJECT/.claude/skills/omega-gemini-cli/references/*.md`

Claude can then use the skill and run the script when you ask for Gemini. You will not have slash commands unless you also copy commands.

**Recommended (skill + commands):**

- Copy the **entire** `.claude` folder into the target project:
  - `TARGET_PROJECT/.claude/skills/omega-gemini-cli/` (as above)
  - `TARGET_PROJECT/.claude/commands/analyze.md`, `sandbox.md`, `brainstorm.md`, `omega-gemini.md`, `omega-gemini-setup.md`

Then you get /analyze, /sandbox, /brainstorm, /omega-gemini, /omega-gemini-setup.

**Optional (Cursor rules):**

- Copy `.cursor/rules/omega-gemini-cli.mdc` and `omega-gemini-tools.mdc` into `TARGET_PROJECT/.cursor/rules/`. Cursor also discovers the **skill** from `.claude/skills/` (no copy to `.cursor/skills/` needed). See [cursor.md](cursor.md).

**Other surfaces (copy the same .claude folder first, then):**

- **Cursor**: no extra copy needed — Cursor discovers the skill from `.claude/skills/`. Optionally copy `.cursor/rules/`. See [cursor.md](cursor.md).
- **Codex CLI**: copy **.agents** → Codex discovers `.agents/skills/omega-gemini-cli/`. See [codex.md](codex.md).
- **Antigravity IDE**: copy **.agent** → agent discovers `.agent/skills/omega-gemini-cli/`. See [antigravity.md](antigravity.md).
- **VS Code**: copy **.vscode** for Run Task (Ask Gemini, Verify setup). See [vscode.md](vscode.md).
- **Gemini CLI (native feedback/test)**: copy **.gemini** → Gemini CLI discovers `.gemini/skills/omega-feedback-test/`. See [gemini-native.md](gemini-native.md).

## After copying

1. **Open the target project** in Claude (that project is the workspace/project root).
2. Run **/omega-gemini-setup** (if you copied commands) or run manually:
   ```bash
   node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs
   ```
3. Install **Node** and **Gemini CLI** if the script reports they are missing. Complete **one-time auth** (run `gemini` in a terminal and sign in). See [installation.md](installation.md) and [auth.md](auth.md).
4. From then on, "ask gemini for feedback" (or /analyze, etc.) works: Claude runs the script from the project root and returns Gemini’s output.

## Path requirement

All script paths in the skill and commands are relative to the **project root** (the directory that contains `.claude`). For example:

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "your prompt"
```

So when Claude runs this, the current working directory must be the project root. In normal use (single project open) it is. In a monorepo, use the root that contains `.claude`, or adjust the path in the command to match where you placed the skill.

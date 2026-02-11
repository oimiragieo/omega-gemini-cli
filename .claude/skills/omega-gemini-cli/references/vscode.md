# VS Code and omega-gemini-cli

VS Code (with **GitHub Copilot**) and the **Gemini CLI Companion** both support the omega-gemini-cli workflow. This page covers Agent Skills discovery, then Companion, Run Task, and terminal.

## Agent Skills (GitHub Copilot in VS Code)

**Agent Skills** is an open standard ([agentskills.io](https://agentskills.io)) that VS Code uses for project and personal skills. Copilot discovers skills from:

| Location              | Scope   | Notes                                |
| --------------------- | ------- | ------------------------------------ |
| **`.github/skills/`** | Project | Recommended by VS Code docs          |
| **`.claude/skills/`** | Project | Legacy path; **this repo uses this** |
| `~/.copilot/skills/`  | User    | Recommended for personal skills      |
| `~/.claude/skills/`   | User    | Legacy for personal skills           |

This repo stores the skill at **`.claude/skills/omega-gemini-cli/`**, so **VS Code (Copilot) discovers it automatically** with no extra setup. You do not need to copy it to `.github/skills/` unless you prefer the recommended path (if you do, copy the folder and keep scripts under `.claude/` or adjust paths in the skill).

### Skill format alignment

The skill follows VS Code’s expected format:

- **SKILL.md** with YAML frontmatter: **name** (required, lowercase, hyphens, max 64 chars) and **description** (required, max 1024 chars). Our `name` is `omega-gemini-cli`; the description states what the skill does and when to use it.
- **Body**: Instructions, when to use, step-by-step procedures, and references to scripts. Scripts are referenced from the skill root, e.g. [scripts/ask-gemini.mjs](./scripts/ask-gemini.mjs); from the project root, run `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT"`.
- **Progressive disclosure**: Copilot loads name/description first, then the SKILL.md body when relevant, then other files in the skill as needed.

To add more search paths (e.g. a shared folder), use the **`chat.agentSkillsLocations`** setting in VS Code. The same skill format works with GitHub Copilot in VS Code, Copilot CLI, and the Copilot coding agent (open standard at [agentskills.io](https://agentskills.io)).

## 1. Gemini CLI Companion (extension)

Google’s **Gemini CLI Companion** extension gives VS Code native integration with Gemini CLI: workspace context, in-editor diffs, and commands.

- **Install**: [VS Code Marketplace – Gemini CLI Companion](https://marketplace.visualstudio.com/items?itemName=Google.gemini-cli-vscode-ide-companion), or run **`/ide install`** from Gemini CLI in the integrated terminal.
- **Use**: Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run **Gemini CLI: Run** (or use Gemini CLI in the terminal with the extension connected).
- **Requirements**: Gemini CLI 0.1.20+, VS Code 1.99.0+.

The Companion uses Gemini CLI directly; it does not run our headless script. For the **same “ask Gemini from a script” workflow** (e.g. in a task or from another tool), use the Run Task or terminal option below.

## 2. Run Task (headless script)

If this repo (or your project) has **`.vscode/tasks.json`** with an omega-gemini task, you can run the headless script from VS Code:

1. **Terminal → Run Task…** (or `Ctrl+Shift+B` / `Cmd+Shift+B` if set as build).
2. Choose **Ask Gemini** (or the task name defined in `tasks.json`).
3. Enter a prompt when prompted, or the task may use a default.

The task runs from the **workspace root** and calls:

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "<prompt>"
```

See the example **`.vscode/tasks.json`** in this repo. Copy it into your project if you copy `.claude` there.

## 3. Integrated terminal

From the workspace root in the VS Code terminal:

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Your prompt here"
```

Add `--model gemini-2.5-flash`, `--sandbox`, or `--json` as needed. Requires Node.js and Gemini CLI to be installed (run **/omega-gemini-setup** in Claude or `node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs`).

## Summary

| Method                     | Best for                                                                                                             |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Agent Skills (Copilot)** | Skill at `.claude/skills/omega-gemini-cli/` is discovered automatically; Copilot loads it when your request matches. |
| **Gemini CLI Companion**   | Full Gemini CLI experience inside VS Code (diffs, context).                                                          |
| **Run Task**               | One-off “ask Gemini” from the editor using the headless script.                                                      |
| **Terminal**               | Scripting or manual runs of the headless script.                                                                     |

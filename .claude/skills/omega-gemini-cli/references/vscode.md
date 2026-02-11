# VS Code and omega-gemini-cli

VS Code (with **GitHub Copilot**) and the **Gemini CLI Companion** both support the omega-gemini-cli workflow. This page covers Agent Skills discovery, then Companion, Run Task, and terminal.

## Agent Skills (GitHub Copilot)

**Agent Skills** enhance Copilot coding agent, the **GitHub Copilot CLI**, and agent mode in **Visual Studio Code Insiders**. Support in the stable version of VS Code is coming soon. Skills are an open standard ([agentskills.io](https://agentskills.io)); official docs: [About Agent Skills — GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills#creating-and-adding-skills).

**Where Copilot discovers skills:**

| Location              | Scope   | Notes                                                              |
| --------------------- | ------- | ------------------------------------------------------------------ |
| **`.github/skills/`** | Project | Recommended by GitHub; repo-specific                               |
| **`.claude/skills/`** | Project | Also supported; **this repo uses this**                            |
| `~/.copilot/skills/`  | User    | Personal skills, shared across projects (Copilot agent & CLI only) |
| `~/.claude/skills/`   | User    | Personal skills (Copilot agent & CLI only)                         |

This repo stores the skill at **`.claude/skills/omega-gemini-cli/`**, so **Copilot discovers it automatically** with no extra setup. You can instead use `.github/skills/omega-gemini-cli/` if you prefer the recommended path (keep scripts under `.claude/` or update paths in the skill).

### Skill format (SKILL.md)

Per [GitHub’s Creating and adding skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills#creating-and-adding-skills):

- **SKILL.md** (required filename) with YAML frontmatter: **name** (required, lowercase, hyphens), **description** (required — when Copilot should use it), **license** (optional).
- **Body**: Instructions, examples, and guidelines. Copilot injects the file into context when it chooses the skill based on your prompt and the description.

This skill’s `name` is `omega-gemini-cli`; the description triggers on “use Gemini”, “analyze with Gemini”, etc. Scripts live in the skill directory; from the project root run `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT"`.

To add more search paths in VS Code, use **`chat.agentSkillsLocations`**. For **Copilot CLI** headless usage (`copilot -p "..."`, `COPILOT_MODEL`), see [copilot-cli.md](copilot-cli.md).

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

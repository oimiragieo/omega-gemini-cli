# Antigravity IDE support

**Antigravity** is Google’s AI-native IDE (VS Code–based). Omega-gemini-cli is available as a **workspace skill** so you can "ask Gemini" (headless) from Antigravity in the same way as in Codex or Claude.

## How it works

- Antigravity discovers skills from **`.agent/skills/`** (workspace) and `~/.gemini/antigravity/skills/` (global).
- This repo includes **`.agent/skills/omega-gemini-cli/`** with a `SKILL.md` that tells the agent when and how to run the headless Gemini script.
- The agent uses the **same scripts** as the Claude and Codex skills: `.claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs` and `verify-setup.mjs`.

## Using it in Antigravity

1. Open this project (or a project that has copied both `.claude` and `.agent`) in **Antigravity**.
2. When you want Gemini’s help, say e.g. "ask Gemini to review this file" or "use Gemini to brainstorm ideas". The agent will match the **omega-gemini-cli** skill and run the headless script from the project root.
3. You can also mention the skill by name: "use omega-gemini-cli to analyze the API."

## Requirements

Same as for Claude and Codex: **Node.js** 18+ and **Google Gemini CLI** installed and authenticated. Verify from the project root:

```bash
node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs
```

## Copying to another project

To use the skill in another project:

1. Copy the **entire** `.claude` folder (skill + scripts).
2. Copy the **entire** `.agent` folder (so you have `.agent/skills/omega-gemini-cli/SKILL.md`).
3. Open that project in Antigravity; the skill is discovered automatically.

Scripts stay under `.claude/skills/omega-gemini-cli/scripts/`; no need to duplicate them for Antigravity.

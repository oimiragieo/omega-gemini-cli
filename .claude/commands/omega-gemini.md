---
description: Use Google Gemini via omega-gemini-cli headless script (analysis, sandbox, brainstorm)
argument-hint: '[request or question]'
allowed-tools: Bash, Read
---

Use the **omega-gemini-cli** skill and the **headless script** for this request. No MCP.

- For **analysis** or **ask Gemini** something: run `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT"` from the project root. Include any @ file refs in the prompt.
- For **run or test code** safely: run the same script with `--sandbox`: `node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT" --sandbox`.
- For **brainstorm**: run the script with a prompt that states the challenge and optional methodology (e.g. "Brainstorm 5 ideas using design thinking: ...").

Use `--model gemini-2.5-flash` if you want to avoid quota issues. Return the script output as Gemini's response. See `.claude/skills/omega-gemini-cli/SKILL.md` and `references/headless.md` for details.

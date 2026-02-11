---
description: Analyze files or ask Gemini using omega-gemini-cli headless script
argument-hint: '[prompt or @file ...]'
allowed-tools: Bash, Read
---

Use the **headless Gemini CLI script** to analyze or answer with Gemini. No MCP required.

1. Build the **prompt** from the user's input. If they referenced files (e.g. with `@path` or by name), include those refs or the file content in the prompt so Gemini has context.
2. From the **project root** (where `.claude` lives), run:
   ```bash
   node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT"
   ```
   Replace `PROMPT` with the full analysis request. Optionally add `--model gemini-2.5-flash` to reduce quota issues.
3. Return the script's stdout as Gemini's response to the user.

If no argument was given, ask the user what they want Gemini to analyze or answer.

Do not use any MCP tool; use only the script above.

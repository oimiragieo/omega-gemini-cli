---
description: Run code or scripts safely in Gemini sandbox via omega-gemini-cli headless script
argument-hint: [prompt or @file ...]
allowed-tools: Bash, Read
---

Use the **headless Gemini CLI script** with **sandbox** to run or test code safely.

1. Build the **prompt** from the user's input (e.g. "Create and run a Python script that processes CSV data" or "Test @script.py").
2. From the **project root**, run:
   ```bash
   node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT" --sandbox
   ```
3. Return the script's output to the user.

If the user did not provide a prompt, ask what they want to run or test in the sandbox.

Do not use MCP; use only the script above.

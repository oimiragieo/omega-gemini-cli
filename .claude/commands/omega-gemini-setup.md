---
description: Verify omega-gemini-cli headless setup (Node, Gemini CLI). No MCP required.
allowed-tools: Bash, Read
---

Run the omega-gemini-cli headless setup so that "ask gemini" works via CLI scripts (no MCP).

1. **Run the verification script** from the project root (where .claude lives):

   ```bash
   node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs
   ```

   If the script is not at that path, find the workspace root that contains `.claude/skills/omega-gemini-cli/scripts/verify-setup.mjs` and run it from there.

2. **If Node is missing or too old**: Tell the user to install Node 20+ from https://nodejs.org and try again.

3. **If Gemini CLI is missing**: Tell the user to install it (e.g. `npm install -g @google/gemini-cli`) or follow `.claude/skills/omega-gemini-cli/references/installation.md`, then run the verification script again.

4. **Auth**: Remind the user that one-time Google sign-in is required. They should run `gemini` (or `npx @google/gemini-cli`) in a terminal once and complete sign-in. Point to `.claude/skills/omega-gemini-cli/references/auth.md` for auth and quota issues.

No MCP configuration is needed. Claude will use the headless script `scripts/ask-gemini.mjs` to run Gemini. Summarize the verification output for the user and any remaining steps (install Gemini CLI, complete auth).

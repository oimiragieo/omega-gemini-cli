# Installation and configuration (omega-gemini-cli)

Omega-gemini-cli uses the **Gemini CLI in headless mode**. No MCP server or MCP configuration is required.

## Quick setup (after copying .claude)

1. Run **/omega-gemini-setup** in Claude, or
2. From the project root run: `node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs`
3. If Node or Gemini CLI is missing, install them (see Prerequisites). Complete one-time auth (see [auth.md](auth.md)).

## Prerequisites

1. **Node.js** (v18 or higher; Node 20+ recommended): [nodejs.org](https://nodejs.org).
2. **Google Gemini CLI** installed and configured: [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli).

Install Gemini CLI:

```bash
npm install -g @google/gemini-cli
```

Or use it via npx (no global install):

```bash
npx @google/gemini-cli -p "Your prompt"
```

## Verify installation

From the project root:

```bash
node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs
```

Then run the headless script once to confirm:

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Say hello"
```

## One-time auth

Run `gemini` (or `npx @google/gemini-cli`) in a terminal and complete Google sign-in when prompted. See [auth.md](auth.md).

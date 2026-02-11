# Auth and troubleshooting (omega-gemini-cli)

## One-time auth

The Gemini CLI uses your Google account. In a terminal, run:

```bash
gemini
```

or, if not installed globally:

```bash
npx @google/gemini-cli
```

Complete the browser sign-in when prompted. After that, the MCP can use Gemini without asking again on this machine.

## Quota errors

If you see "quota exceeded" or "Gemini 2.5 Pro" limit errors:

- Ask the model to use **gemini-2.5-flash** instead (e.g. pass `model: "gemini-2.5-flash"` when calling ask-gemini).
- Check your Google AI / Gemini quota and usage in the Google AI Studio or Cloud console.

## Script fails or "gemini not found"

If the headless script fails or reports that the gemini command is not found:

1. Run **/omega-gemini-setup** in Claude, or
2. From the project root run: `node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs`
3. Install Gemini CLI if needed: `npm install -g @google/gemini-cli`. Ensure it is on your PATH (e.g. run `gemini -help`).

## Official docs

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) — install and auth
- [Google AI for Developers](https://ai.google.dev) — API and quota

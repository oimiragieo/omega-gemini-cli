# Auth and troubleshooting (omega-gemini-cli)

## One-time auth

The Gemini CLI uses your Google account or an API key. In a terminal, run:

```bash
gemini
```

or, if not installed globally:

```bash
npx @google/gemini-cli
```

Complete the browser sign-in when prompted. After that, the headless script can use Gemini without asking again on this machine.

### API key (CI/CD and automation)

Set one of these before running the headless script:

```bash
export GEMINI_API_KEY="your-api-key"
```

Or configure auth in `~/.gemini/settings.json`. The CLI also accepts `GOOGLE_GENAI_USE_VERTEXAI` and `GOOGLE_GENAI_USE_GCA` for enterprise backends.

### Workspace trust (headless / automation)

In untrusted project folders, the CLI may override `--yolo` approval. The headless script passes `--skip-trust` automatically. Alternatively:

```bash
export GEMINI_CLI_TRUST_WORKSPACE=true
```

## Quota errors

If you see "quota exceeded" or Pro-tier limit errors:

- Use **gemini-3.1-flash-lite** or **gemini-3.5-flash** instead (e.g. `--model gemini-3.1-flash-lite`).
- Check your Google AI / Gemini quota and usage in [Google AI Studio](https://aistudio.google.com) or the Cloud console.

## Script fails or "gemini not found"

If the headless script fails or reports that the gemini command is not found:

1. Run **/omega-gemini-setup** in Claude, or
2. From the project root run: `node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs`
3. Install Gemini CLI if needed: `npm install -g @google/gemini-cli`. Ensure it is on your PATH (e.g. run `gemini --help`).

## Model access errors

If you see _"you don't have access to gemini-3.5-flash"_ or similar:

- Your account may need Preview Release Channel access for newer models.
- Fall back to `gemini-3.1-flash-lite` or `gemini-2.5-flash`.
- See [models-2026.md](models-2026.md) for the full list and aliases.

## Official docs

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) — install and auth
- [Google AI for Developers](https://ai.google.dev) — API and quota

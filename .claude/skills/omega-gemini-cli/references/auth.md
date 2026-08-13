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

- Use **gemini-3.1-flash-lite** or **gemini-3.7-flash** instead (e.g. `--model gemini-3.1-flash-lite`).
- Check your Google AI / Gemini quota and usage in [Google AI Studio](https://aistudio.google.com) or the Cloud console.

## Script fails or "gemini not found"

If the headless script fails or reports that the gemini command is not found:

1. Run **/omega-gemini-setup** in Claude, or
2. From the project root run: `node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs`
3. Install Gemini CLI if needed: `npm install -g @google/gemini-cli`. Ensure it is on your PATH (e.g. run `gemini --help`).

## 🚨 Gemini CLI no longer serves consumer accounts (June 18, 2026)

If `gemini -p "..."` drops you into an OAuth browser prompt and never answers, this is almost
certainly the cause — **not** a broken install.

On **June 18, 2026** Gemini CLI (and the Code Assist IDE extensions / Code Assist for GitHub)
stopped serving requests for **Google AI Pro, Google AI Ultra, and free-tier individual accounts**.
Google consolidated the consumer terminal experience into **Antigravity CLI** (`agy`).

Still fully supported — this project works normally on any of these:

- A **paid Gemini API key** (`GEMINI_API_KEY`) or Gemini Enterprise Agent Platform key.
- A **Gemini Code Assist Standard or Enterprise** license.
- Gemini Code Assist for GitHub via a Google Cloud org.

If you are on an individual Pro/Ultra/free account, no re-login will fix it — use `agy`
(see the `use-gemini` skill) or attach an API key. Sources: [Google Developers Blog transition post](https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
and [gemini-cli discussion #27274](https://github.com/google-gemini/gemini-cli/discussions/27274).

⚠️ Because of this, `gemini-3.7-flash` availability in the CLI could not be probed locally —
the ID is verified against the [DeepMind model card](https://deepmind.google/models/model-cards/gemini-3-7-flash/)
(13 Aug 2026) and DeepMind Flash product page, not against an authenticated CLI session.

## Model access errors

If you see _"you don't have access to gemini-3.7-flash"_ or similar:

- Fall back to `gemini-3.6-flash`, then `gemini-3.5-flash-lite` or `gemini-3.1-flash-lite`.
- See [models-2026.md](models-2026.md) for the full list and aliases.

## Official docs

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) — install and auth
- [Google AI for Developers](https://ai.google.dev) — API and quota

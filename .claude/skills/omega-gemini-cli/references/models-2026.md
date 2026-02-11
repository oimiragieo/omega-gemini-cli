# Gemini models and CLI (2026)

Current references for the Google Gemini CLI and API as of 2026. Use these when recommending models or linking to official docs.

## CLI

- **Official repo**: [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- **Docs**: [google-gemini.github.io/gemini-cli](https://google-gemini.github.io/gemini-cli/), [gemini-cli.xyz/docs](https://gemini-cli.xyz/docs/en/)
- **Requirements**: Node.js 20+

## API and models

- **API docs**: [ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)
- **Gemini 3**: [ai.google.dev/gemini-api/docs/gemini-3](https://ai.google.dev/gemini-api/docs/gemini-3)
- **Models list**: [ai.google.dev/api/models](https://ai.google.dev/api/models)

## Model names (2026)

Prefer **Gemini 3** where available:

- **Gemini 3 Pro** — Complex reasoning, 1M input / 64k output, thinking mode.
- **Gemini 3 Flash** — Faster, frontier-class, same context.

**Gemini 2.5** remains valid:

- **Gemini 2.5 Pro** — Default in many flows; may hit quota (fallback to Flash).
- **Gemini 2.5 Flash** — Lower latency, quota fallback option.

Some Gemini 2.0 Flash variants are deprecated (e.g. March 2026 shutdown); use 2.5 or 3 where possible.

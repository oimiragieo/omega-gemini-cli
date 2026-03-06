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

### Available in Gemini CLI

Use these with `--model` / `-m` in the headless script (e.g. `--model gemini-2.5-flash`):

| #   | Model ID                 | Status                                      |
| --- | ------------------------ | ------------------------------------------- |
| 1   | `gemini-3.1-pro`         | Latest — replaces gemini-3-pro-preview      |
| 2   | `gemini-3.1-flash-lite`  | New lightweight model (March 2026)          |
| 3   | `gemini-3-flash-preview` | Preview                                     |
| 4   | `gemini-2.5-pro`         | Stable                                      |
| 5   | `gemini-2.5-flash`       | Stable                                      |
| 6   | `gemini-2.5-flash-lite`  | Stable                                      |

### Deprecated

| Model ID               | Shutdown date    | Replacement      |
| ---------------------- | ---------------- | ---------------- |
| `gemini-3-pro-preview` | March 9, 2026    | `gemini-3.1-pro` |

- **Gemini 3.1** — `gemini-3.1-pro` is the latest flagship for complex reasoning. `gemini-3.1-flash-lite` is a new lightweight model for high-volume, low-latency tasks.
- **Gemini 3** (preview) — `gemini-3-pro-preview` is deprecated and shuts down March 9, 2026. Migrate to `gemini-3.1-pro`.
- **Gemini 2.5** — Pro and Flash are stable; use **gemini-2.5-flash** or **gemini-2.5-flash-lite** to reduce quota/latency.

Run `gemini` (or the CLI’s model selector) to confirm current list.

# Gemini models and CLI (2026)

Current references for the Google Gemini CLI and API as of June 2026. Use these when recommending models or linking to official docs.

## CLI

- **Official repo**: [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- **Docs**: [google-gemini.github.io/gemini-cli](https://google-gemini.github.io/gemini-cli/), [geminicli.com/docs](https://geminicli.com/docs/)
- **Requirements**: Node.js 18+ (Node 20+ recommended)

## API and models

- **API docs**: [ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)
- **Gemini 3**: [ai.google.dev/gemini-api/docs/gemini-3](https://ai.google.dev/gemini-api/docs/gemini-3)
- **Gemini 3.5 Flash**: [ai.google.dev/gemini-api/docs/models/gemini-3.5-flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash)
- **Models list**: [ai.google.dev/api/models](https://ai.google.dev/api/models)
- **Deprecations**: [ai.google.dev/gemini-api/docs/deprecations](https://ai.google.dev/gemini-api/docs/deprecations)

## Model names (2026)

### Available in Gemini CLI

Use these with `--model` / `-m` in the headless script (e.g. `--model gemini-3.5-flash`):

| #   | Model ID                             | Status                           | Use case                                        |
| --- | ------------------------------------ | -------------------------------- | ----------------------------------------------- |
| 1   | `gemini-3.5-flash`                   | Stable (GA)                      | Recommended default — agentic and coding        |
| 2   | `gemini-3.1-pro-preview`             | Preview                          | Complex reasoning / flagship                    |
| 3   | `gemini-3.1-pro-preview-customtools` | Preview                          | When custom tools are ignored in favor of bash  |
| 4   | `gemini-3.1-flash-lite`              | Stable                           | Cost / high-volume (CLI `flash-lite` alias)     |
| 5   | `gemini-3-flash-preview`             | Preview (legacy)                 | Migrate to `gemini-3.5-flash`                   |
| 6   | `gemini-3-flash`                     | CLI alias                        | Resolves to `gemini-3.5-flash` on some backends |
| 7   | `gemini-2.5-pro`                     | Stable (retiring ≥ Oct 16, 2026) | Deep analysis                                   |
| 8   | `gemini-2.5-flash`                   | Stable (retiring ≥ Oct 16, 2026) | Legacy fast default                             |
| 9   | `gemini-2.5-flash-lite`              | Stable (retiring ≥ Oct 16, 2026) | Legacy budget option                            |

### CLI model aliases

The Gemini CLI also accepts routing aliases (resolved by the CLI, not API model IDs):

| Alias        | Resolves to (typical)   |
| ------------ | ----------------------- |
| `auto`       | Best model for the task |
| `pro`        | Highest-capability tier |
| `flash`      | Fast tier               |
| `flash-lite` | `gemini-3.1-flash-lite` |

### Shut down

| Model ID               | Shutdown date | Replacement              |
| ---------------------- | ------------- | ------------------------ |
| `gemini-3-pro-preview` | March 9, 2026 | `gemini-3.1-pro-preview` |

### Retiring (not yet shut down)

Per [deprecations](https://ai.google.dev/gemini-api/docs/deprecations), Gemini 2.5 models retire no earlier than **October 16, 2026**:

| Model                   | Recommended replacement  |
| ----------------------- | ------------------------ |
| `gemini-2.5-flash`      | `gemini-3.5-flash`       |
| `gemini-2.5-flash-lite` | `gemini-3.1-flash-lite`  |
| `gemini-2.5-pro`        | `gemini-3.1-pro-preview` |

## Recommendations

- **General / agentic headless** — `gemini-3.5-flash` (or `gemini-3-flash` CLI alias). Some OAuth accounts require Preview Release Channel access; fall back to `gemini-3.1-flash-lite` or `gemini-2.5-flash` if access is denied.
- **Quota / cost / high volume** — `gemini-3.1-flash-lite` (CLI `flash-lite` alias).
- **Complex reasoning** — `gemini-3.1-pro-preview`.
- **Custom tools ignored** — `gemini-3.1-pro-preview-customtools`.

Run `gemini` (or the CLI's `/model` command) to confirm the list available to your account.

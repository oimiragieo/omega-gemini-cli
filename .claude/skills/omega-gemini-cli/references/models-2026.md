# Gemini models and CLI (2026)

Current references for the Google Gemini CLI and API as of August 2026. Use these when recommending models or linking to official docs.

## CLI

- **Official repo**: [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- **Docs**: [google-gemini.github.io/gemini-cli](https://google-gemini.github.io/gemini-cli/), [geminicli.com/docs](https://geminicli.com/docs/)
- **Requirements**: Node.js 18+ (Node 20+ recommended)

## API and models

- **API docs**: [ai.google.dev/gemini-api/docs](https://ai.google.dev/gemini-api/docs)
- **Gemini 3**: [ai.google.dev/gemini-api/docs/gemini-3](https://ai.google.dev/gemini-api/docs/gemini-3)
- **Gemini 3.7 Flash** (latest): [DeepMind product page](https://deepmind.google/models/gemini/flash/) · [model card](https://deepmind.google/models/model-cards/gemini-3-7-flash/) (published 13 Aug 2026) · [API model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.7-flash)
- **Gemini 3.6 Flash**: [ai.google.dev/gemini-api/docs/models/gemini-3.6-flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash) · [what's new (3.6 / 3.5 Flash-Lite)](https://ai.google.dev/gemini-api/docs/latest-model)
- **Gemini 3.5 Flash**: [ai.google.dev/gemini-api/docs/models/gemini-3.5-flash](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash)
- **Models list**: [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)
- **Deprecations**: [ai.google.dev/gemini-api/docs/deprecations](https://ai.google.dev/gemini-api/docs/deprecations)
- **Gemini CLI stable**: [v0.55.1](https://geminicli.com/docs/changelogs/latest/) (11 Aug 2026) — `npm install -g @google/gemini-cli@latest`

## Model names (2026)

### Available in Gemini CLI

Use these with `--model` / `-m` in the headless script (e.g. `--model gemini-3.7-flash`):

| #   | Model ID                             | Status                           | Use case                                          |
| --- | ------------------------------------ | -------------------------------- | ------------------------------------------------- |
| 1   | `gemini-3.7-flash`                   | Stable (GA)                      | **Recommended default** — complex coding, agentic  |
| 2   | `gemini-3.6-flash`                   | Stable                           | Previous generation — general agentic / multimodal |
| 3   | `gemini-3.5-flash`                   | Stable (legacy)                  | Baseline speed for routine high-throughput work    |
| 4   | `gemini-3.5-flash-lite`              | Stable                           | Fastest / most cost-effective 3.5                  |
| 5   | `gemini-3.1-pro-preview`             | Preview                          | Complex reasoning / flagship                       |
| 6   | `gemini-3.1-pro-preview-customtools` | Preview                          | When custom tools are ignored in favor of bash     |
| 7   | `gemini-3.1-flash-lite`              | Stable (shutdown May 7, 2027)    | Cost / high-volume (CLI `flash-lite` alias)        |
| 8   | `gemini-3-flash-preview`             | Preview (legacy)                 | Migrate to `gemini-3.6-flash` (per Google)         |
| 9   | `gemini-3-flash`                     | CLI alias                        | Resolves to a current Flash on some backends       |
| 10  | `gemini-2.5-pro`                     | Stable (retiring ≥ Oct 16, 2026) | Deep analysis                                      |
| 11  | `gemini-2.5-flash`                   | Stable (retiring ≥ Oct 16, 2026) | Legacy fast default                                |
| 12  | `gemini-2.5-flash-lite`              | Stable (retiring ≥ Oct 16, 2026) | Legacy budget option                               |

**Gemini 3.7 Flash** (GA, model card published **13 August 2026** — verified via DeepMind product
page + model card; API `docs/models` index may lag same-day launches):
1M-token context, 64k max output, customizable thinking levels. Built on 3.6 Flash (same architecture
and training data per the model card). Distributed via Gemini API / AI Studio / Antigravity / Enterprise.

- **Price is identical to 3.6 Flash**: introductory **$0.75 / $3.75** per 1M in/out through
  **December 31, 2026**; then list **$1.50 / $7.50**. Same-cost upgrade → preferred default.
- **Benchmarks** (DeepMind model card / flash page, 3.7 vs 3.6): Terminal-bench 2.1 **85.8% vs 78.0%**;
  DeepSWE v1.1 **65.3% vs 48.6%**; FrontierCode 1.1 **43.6% vs 34.4%**; OSWorld-2.0 **47.9% vs 33.8%**;
  GDM-MRCR v2 @128k **97.0% vs 91.8%**. Artificial Analysis Intelligence Index **56 vs 52**.
- Prefer **`high` thinking** when you want benchmark-grade quality; default is `medium` (same as 3.6).

⚠️ **Not on the deprecations page yet** — day-of release. Google's replacement column below still
names `gemini-3.6-flash` for retiring 2.5 Flash; our preference is 3.7 when your account can reach it.

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

| Model                   | Google's stated replacement | Our preference             |
| ----------------------- | --------------------------- | -------------------------- |
| `gemini-2.5-flash`      | `gemini-3.6-flash`          | `gemini-3.7-flash`         |
| `gemini-2.5-flash-lite` | `gemini-3.1-flash-lite`     | `gemini-3.5-flash-lite` (3.1-flash-lite itself shuts down May 7, 2027) |
| `gemini-2.5-pro`        | `gemini-3.1-pro-preview`    | same                       |

## Recommendations

- **General / agentic headless** — `gemini-3.7-flash`. Fall back to `gemini-3.6-flash`, then `gemini-3.5-flash-lite` / `gemini-3.1-flash-lite` if access is denied. Consumer OAuth without an API key no longer works on Gemini CLI after the June 18, 2026 Antigravity transition — see [auth.md](auth.md).
- **Quota / cost / high volume** — `gemini-3.5-flash-lite` or `gemini-3.1-flash-lite` (CLI `flash-lite` alias).
- **Complex reasoning** — `gemini-3.1-pro-preview`.
- **Custom tools ignored** — `gemini-3.1-pro-preview-customtools`.

Run `gemini` (or the CLI's `/model` command) to confirm the list available to your account.

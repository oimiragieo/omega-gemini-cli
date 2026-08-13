# Headless mode (Gemini CLI)

Omega-gemini-cli uses the **Gemini CLI in headless mode** so you can run Gemini from scripts and Claude without any MCP server. No MCP configuration is required.

## Overview

Headless mode:

- Accepts prompts via command line or stdin
- Returns text or JSON
- Works in automation and with the scripts in this skill

The `ask-gemini.mjs` wrapper always passes `--yolo` (auto-approve) and `--skip-trust` (trust workspace) so headless runs work in CI and untrusted folders.

## Basic usage

### Direct prompt

```bash
gemini -p "What is machine learning?" --yolo
```

### With our script (no MCP)

From the project root (where `.claude` lives):

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "What is machine learning?"
```

The script runs `gemini` if it's on your PATH; if not (e.g. you only have `npx @google/gemini-cli`), it automatically falls back to `npx -y @google/gemini-cli` so a global install isn't required.

Options:

- `--model MODEL` or `-m MODEL` — e.g. `gemini-3.7-flash`, `gemini-3.1-flash-lite`. Full list: [models-2026.md](models-2026.md)
- `--json` — output a JSON object `{"response":"..."}` (consistent envelope on success and error)
- `--sandbox` or `-s` — sandbox mode if supported by your CLI

### Stdin

```bash
echo "Explain this code" | gemini --yolo
```

Or with the script (prompt from stdin when no argument given):

```bash
echo "Summarize this" | node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs
```

### File + prompt

```bash
cat README.md | gemini -p "Summarize this documentation" --yolo
```

## Output formats

- **Text (default)** — human-readable.
- **JSON** — `gemini -p "query" --output-format json` for programmatic use. The script's `--json` flag wraps the output in a consistent `{"response":"..."}` envelope.

## CLI reference (`gemini --help`)

Full options as of Gemini CLI **0.55.1** (stable, 11 Aug 2026):

```
Usage: gemini [options] [command]

Gemini CLI - Defaults to interactive mode. Use -p/--prompt for non-interactive (headless) mode.

Commands:
  gemini mcp                   Manage MCP servers
  gemini extensions <command>  Manage Gemini CLI extensions.    [aliases: extension]
  gemini skills <command>      Manage agent skills.               [aliases: skill]
  gemini hooks <command>       Manage Gemini CLI hooks.            [aliases: hook]
  gemini gemma                 Manage local Gemma model routing
  gemini [query..]             Launch Gemini CLI                 [default]

Options:
  -d, --debug                     Run in debug mode (open debug console with F12)  [boolean]
  -m, --model                     Model                                            [string]
  -p, --prompt                    Non-interactive (headless) mode. Appended to stdin if any. [string]
  -i, --prompt-interactive        Execute prompt then continue in interactive mode  [string]
      --skip-trust                Trust the current workspace for this session      [boolean]
  -w, --worktree                  Start Gemini in a new git worktree               [string]
  -s, --sandbox                   Run in sandbox?                                  [boolean]
  -y, --yolo                      Auto-approve all actions (YOLO mode)             [boolean]
      --approval-mode             Approval mode: default | auto_edit | yolo | plan  [string]
      --policy                    Additional policy files or directories to load    [array]
      --admin-policy              Additional admin policy files or directories      [array]
      --acp                       Starts the agent in ACP mode                     [boolean]
      --experimental-acp          Deprecated alias for --acp                       [boolean]
      --allowed-mcp-server-names  Allowed MCP server names                         [array]
      --allowed-tools             [DEPRECATED] Use Policy Engine instead            [array]
  -e, --extensions                Extensions to use (default: all)                 [array]
  -l, --list-extensions           List available extensions and exit               [boolean]
  -r, --resume                    Resume a previous session ("latest" or index)    [string]
      --session-file              Load a session from a JSON file                  [string]
      --session-id                Start a new session with a manually provided UUID [string]
      --list-sessions             List available sessions and exit                 [boolean]
      --delete-session            Delete a session by index                        [string]
      --include-directories       Additional workspace directories                 [array]
      --screen-reader             Enable screen reader mode                        [boolean]
  -o, --output-format             Output format: text | json | stream-json         [string]
      --raw-output                Disable sanitization of model output (security risk) [boolean]
      --accept-raw-output-risk    Suppress --raw-output security warning           [boolean]
  -v, --version                   Show version number                              [boolean]
  -h, --help                      Show help                                        [boolean]
```

### Key options for headless / scripted use

| Option            | Short | Description                                       | Example                                 |
| ----------------- | ----- | ------------------------------------------------- | --------------------------------------- |
| `--prompt`        | `-p`  | Run headless with this prompt                     | `gemini -p "query" --yolo`              |
| `--model`         | `-m`  | Model name (see [models-2026.md](models-2026.md)) | `-m gemini-3.7-flash`                   |
| `--yolo`          | `-y`  | Auto-approve all actions (used by ask-gemini.mjs) | `gemini -p "query" --yolo`              |
| `--skip-trust`    |       | Trust workspace (used by ask-gemini.mjs)          | `gemini -p "query" --yolo --skip-trust` |
| `--output-format` | `-o`  | `text` (default), `json`, or `stream-json`        | `--output-format json`                  |
| `--sandbox`       | `-s`  | Sandbox mode                                      | `gemini -p "query" -s --yolo`           |
| `--approval-mode` |       | Preferable long-term form of YOLO: `yolo`         | `--approval-mode=yolo`                  |
| `--resume`        | `-r`  | Resume a previous session                         | `--resume latest`                       |

> **Notes:** `--allowed-tools` is deprecated in favor of the [Policy Engine](https://geminicli.com/docs/core/policy-engine). Prefer `--policy` for tool restrictions. Official docs increasingly recommend `--approval-mode=yolo` over `--yolo`; the wrapper keeps `--yolo` for broad CLI compatibility (still accepted in 0.55.1).

## Examples

Code review:

```bash
cat src/auth.py | gemini -p "Review this for security issues" --yolo > review.txt
```

With script and JSON:

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "List main risks in @src" --model gemini-3.7-flash --json
```

Commit message from staged diff:

```bash
git diff --cached | gemini -p "Write a concise commit message" --output-format json --yolo | jq -r '.response'
```

## Exit codes (headless / scripting)

Use these in scripts to distinguish error types:

| Exit Code | Constant                 | Description                                                  |
| --------- | ------------------------ | ------------------------------------------------------------ |
| 0         | —                        | Success                                                      |
| 41        | FatalAuthenticationError | Authentication error — re-run `gemini` and sign in           |
| 42        | FatalInputError          | Invalid or missing input (non-interactive mode only)         |
| 44        | FatalSandboxError        | Sandbox error (Docker / Podman / Seatbelt)                   |
| 52        | FatalConfigError         | `settings.json` is invalid or contains errors                |
| 53        | FatalTurnLimitedError    | Max conversational turns reached (non-interactive mode only) |

## Debugging

**Enable debug output:**

```bash
gemini -p "query" --debug --yolo
```

In interactive mode press `F12` to open the debug console.

**DEBUG env var — use `.gemini/.env`, not `.env`:**

Setting `DEBUG=true` or `DEBUG_MODE=true` in a project's `.env` file does **not** work. The Gemini CLI automatically excludes `DEBUG` and `DEBUG_MODE` from project `.env` files to prevent interference. Use `.gemini/.env` instead:

```
# .gemini/.env
DEBUG_MODE=true
```

Or configure `advanced.excludedEnvVars` in your `settings.json` to reduce which variables are excluded.

## Resources

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) — install and headless docs
- [Authentication](auth.md) — one-time sign-in, API keys, workspace trust
- [Models (2026)](models-2026.md) — current model IDs and recommendations

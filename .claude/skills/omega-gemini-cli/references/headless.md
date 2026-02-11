# Headless mode (Gemini CLI)

Omega-gemini-cli uses the **Gemini CLI in headless mode** so you can run Gemini from scripts and Claude without any MCP server. No MCP configuration is required.

## Overview

Headless mode:

- Accepts prompts via command line or stdin
- Returns text or JSON
- Works in automation and with the scripts in this skill

## Basic usage

### Direct prompt

```bash
gemini -p "What is machine learning?"
```

### With our script (no MCP)

From the project root (where `.claude` lives):

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "What is machine learning?"
```

The script runs `gemini` if it’s on your PATH; if not (e.g. you only have `npx @google/gemini-cli`), it automatically falls back to `npx -y @google/gemini-cli` so a global install isn’t required.

Options:

- `--model MODEL` or `-m MODEL` — e.g. `gemini-2.5-flash`, `gemini-3-flash-preview`. Full list: [models-2026.md](models-2026.md)
- `--json` — output as JSON (script prints the `.response` field)
- `--sandbox` or `-s` — sandbox mode if supported by your CLI

### Stdin

```bash
echo "Explain this code" | gemini
```

Or with the script (prompt from stdin when no argument given):

```bash
echo "Summarize this" | node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs
```

### File + prompt

```bash
cat README.md | gemini -p "Summarize this documentation"
```

## Output formats

- **Text (default)** — human-readable.
- **JSON** — `gemini -p "query" --output-format json` for programmatic use. The script’s `--json` flag uses this and prints only the response text.

## Configuration options (CLI)

| Option            | Description             | Example                                  |
| ----------------- | ----------------------- | ---------------------------------------- |
| `--prompt`, `-p`  | Headless prompt         | `gemini -p "query"`                      |
| `--output-format` | `text` or `json`        | `gemini -p "query" --output-format json` |
| `--model`, `-m`   | Model name              | `gemini -p "query" -m gemini-2.5-flash`  |
| `--yolo`, `-y`    | Auto-approve (headless) | `gemini -p "query" --yolo`               |

## Examples

Code review:

```bash
cat src/auth.py | gemini -p "Review this for security issues" > review.txt
```

With script and JSON:

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "List main risks in @src" --model gemini-2.5-flash --json
```

Commit message from staged diff:

```bash
git diff --cached | gemini -p "Write a concise commit message" --output-format json | jq -r '.response'
```

## Resources

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) — install and headless docs
- [Authentication](auth.md) — one-time sign-in

# Headless script reference (omega-gemini-cli)

Omega-gemini-cli uses **scripts/ask-gemini.mjs** to run the Gemini CLI in headless mode. No MCP required.

## ask-gemini.mjs

Invokes `gemini -p "..."` with optional flags and returns stdout (or `.response` when using `--json`).

| Option                 | Description                                              | Example                           |
| ---------------------- | -------------------------------------------------------- | --------------------------------- |
| **Prompt**             | First positional arg or stdin                            | `"Review this code for security"` |
| **--model** / **-m**   | Model name (e.g. gemini-2.5-flash, gemini-3-pro-preview) | `--model gemini-2.5-flash`        |
| **--sandbox** / **-s** | Sandbox mode (if CLI supports it)                        | `--sandbox`                       |
| **--json**             | Output `{"response":"..."}` JSON envelope                | `--json`                          |

The script adds `--yolo` (auto-approve) for non-interactive runs.

### Usage

```bash
# From project root
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Your prompt"
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Prompt" --model gemini-2.5-flash --json
echo "Prompt via stdin" | node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs
```

### Requirements

- **gemini** must be on PATH (install with `npm install -g @google/gemini-cli`). If you only use `npx @google/gemini-cli`, run that directly instead of this script, or symlink/copy the script and replace the `gemini` command with `npx` + `@google/gemini-cli`.

For more examples and CLI options, see [headless.md](headless.md).

# Headless script reference (omega-gemini-cli)

Omega-gemini-cli uses **scripts/ask-gemini.mjs** to run the Gemini CLI in headless mode. No MCP required.

## ask-gemini.mjs

Invokes `gemini -p "" --yolo --skip-trust` with optional flags and returns stdout (or `.response` when using `--json`). The prompt is always sent via stdin.

| Option                 | Description                                       | Example                           |
| ---------------------- | ------------------------------------------------- | --------------------------------- |
| **Prompt**             | First positional arg or stdin                     | `"Review this code for security"` |
| **--model** / **-m**   | Model name (see [models-2026.md](models-2026.md)) | `--model gemini-3.7-flash`        |
| **--sandbox** / **-s** | Sandbox mode (if CLI supports it)                 | `--sandbox`                       |
| **--json**             | Output `{"response":"..."}` JSON envelope         | `--json`                          |
| **--timeout-ms**       | Abort after N milliseconds (exit 124 on timeout)  | `--timeout-ms 30000`              |

The script adds `--yolo` (auto-approve) and `--skip-trust` (workspace trust) for non-interactive runs.

### Usage

```bash
# From project root
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Your prompt"
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Prompt" --model gemini-3.1-flash-lite --json
echo "Prompt via stdin" | node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs
```

### Requirements

- **gemini** must be on PATH (install with `npm install -g @google/gemini-cli`). If you only use `npx @google/gemini-cli`, the script falls back to `npx -y @google/gemini-cli` automatically.

For more examples and CLI options, see [headless.md](headless.md).

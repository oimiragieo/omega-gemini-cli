# Omega Gemini CLI

> Portable headless skill for running Google Gemini CLI from Claude Code, Cursor, Codex, Antigravity, and VS Code — no MCP server required.

A zero-dependency Node.js wrapper that lets any agent platform invoke **Google Gemini CLI** in non-interactive mode. Copy one folder into your project, run one verification step, and every supported agent surface can call Gemini headlessly for analysis, brainstorming, and sandbox code execution.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Reference](#cli-reference)
- [Configuration](#configuration)
- [Integration Guides](#integration-guides)
- [Deploying to Another Project](#deploying-to-another-project)
- [Usage Examples](#usage-examples)
- [Slash Commands](#slash-commands)
- [Development](#development)
- [Repository Structure](#repository-structure)
- [Resources](#resources)
- [License](#license)

---

## Features

- **Headless execution** — runs `gemini -p "…" --yolo` non-interactively with prompts sent safely via stdin
- **Cross-platform** — Windows (`shell: true` with injection-safe model validation) and Unix/macOS (array-based spawn) handled automatically
- **Automatic fallback** — tries global `gemini` binary, falls back to `npx -y @google/gemini-cli` if not found
- **Model selection** — Gemini 3.1 Pro, 3.1 Flash Lite, 2.5 Flash (recommended for quota efficiency), Pro, and more
- **JSON output** — `{"response":"…"}` envelope for automation pipelines
- **Sandbox mode** — runs code in Gemini's sandboxed execution environment
- **Stdin-first prompts** — prompts are always passed via stdin (never command-line args) to avoid ARG_MAX limits and shell injection
- **Zero runtime dependencies** — pure Node.js stdlib; no `npm install` needed to run
- **Multi-surface** — same script shared by Claude Code, Cursor, Codex, Antigravity, VS Code, and Gemini CLI native
- **Gemini CLI native skill** — includes a `.gemini/` skill for feedback and test suggestions inside a native Gemini CLI session

---

## Prerequisites

| Requirement       | Minimum version | Install                             |
| ----------------- | --------------- | ----------------------------------- |
| Node.js           | 18+             | [nodejs.org](https://nodejs.org)    |
| Google Gemini CLI | 0.1+            | `npm install -g @google/gemini-cli` |

Gemini CLI requires a one-time Google sign-in. Run `gemini` in a terminal and complete the OAuth flow; credentials are cached in `~/.config/gcloud/` and reused by all subsequent headless calls.

---

## Installation

### 1. Install Gemini CLI

```bash
npm install -g @google/gemini-cli
```

Or use without a global install — the wrapper automatically falls back to `npx -y @google/gemini-cli`.

### 2. One-time authentication

```bash
gemini
# A browser window opens for Google sign-in. Complete it once.
# Credentials are cached and reused automatically.
```

### 3. Copy the skill into your project

```bash
# From the omega-gemini-cli repo root:
cp -r .claude /path/to/your-project/
```

The `.claude` folder is the **only required piece**. All other folders (`.agents`, `.agent`, `.cursor`, `.vscode`, `.gemini`) are optional integration shims for specific platforms.

### 4. Verify the setup

```bash
cd /path/to/your-project
node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs
```

Expected output when everything is ready:

```
OK  Node: v20.11.1
OK  Gemini CLI: found
Headless mode ready. Use scripts/ask-gemini.mjs to run Gemini.
```

---

## Quick Start

From your **project root** (the directory containing `.claude`):

```bash
# Ask Gemini a question
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Summarize this repository in three bullet points"

# Review a file
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Review src/index.js for potential bugs"

# Generate ideas with a faster model
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Brainstorm 5 ways to improve CLI onboarding" \
  --model gemini-2.5-flash

# Run code in Gemini's sandbox
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Run this Python: print('Hello from Gemini sandbox')" \
  --sandbox
```

---

## CLI Reference

### Syntax

```
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "PROMPT" [OPTIONS]
```

The `PROMPT` argument is required unless you are piping input from stdin. Flags can appear before or after the prompt in any order. The prompt is always forwarded to Gemini via stdin — never as a command-line argument — which eliminates shell quoting issues and ARG_MAX limits.

### Options

| Option         | Short | Type                | Default        | Description                                                                                                |
| -------------- | ----- | ------------------- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| `PROMPT`       | —     | string (positional) | required       | The question or task for Gemini. Reads from stdin if omitted. Multi-word prompts are joined automatically. |
| `--model`      | `-m`  | string              | Gemini default | Model to use. See [Model notes](#model-notes).                                                             |
| `--sandbox`    | `-s`  | boolean             | `false`        | Execute code inside Gemini's sandbox environment.                                                          |
| `--json`       | —     | boolean             | `false`        | Return a JSON envelope `{"response":"…"}` instead of plain text. On error, returns `{"error":"…"}`.        |
| `--timeout-ms` | —     | integer             | `0` (none)     | Abort after N milliseconds. Exit code `124` on timeout. Must be a positive integer.                        |
| `--help`       | `-h`  | boolean             | `false`        | Print usage and exit.                                                                                      |
| `--`           | —     | sentinel            | —              | Everything after `--` is treated as part of the prompt. Useful when the prompt starts with `-`.            |

### Model notes

| Model ID                 | Description                | Use case                           |
| ------------------------ | -------------------------- | ---------------------------------- |
| `gemini-3.1-pro`         | Latest flagship            | Complex analysis and reasoning     |
| `gemini-3.1-flash-lite`  | New lightweight (Mar 2026) | High-volume, low-latency tasks     |
| `gemini-2.5-flash`       | Fast, quota-efficient      | Recommended default for most tasks |
| `gemini-2.5-pro`         | Stable, high-quality       | Deep analysis and reasoning        |
| `gemini-2.5-flash-lite`  | Minimal quota, fastest     | High-volume automation             |
| `gemini-3-flash-preview` | Preview, fast              | Latest features with speed         |

> **Deprecation notice:** `gemini-3-pro-preview` shuts down **March 9, 2026**. Use `gemini-3.1-pro` instead.

Omit `--model` to let Gemini CLI use its own default selection.

### Input methods

```bash
# Positional argument (most common)
node ask-gemini.mjs "Your prompt here"

# Multi-word prompt (automatically joined, no quoting required)
node ask-gemini.mjs What is the capital of France

# Stdin pipe
echo "Your prompt" | node ask-gemini.mjs

# Pipe a file for review
cat src/main.js | node ask-gemini.mjs "Review this code for security issues"

# Prompt containing flag-like text
node ask-gemini.mjs -- --this-is-not-a-flag but-it-is-the-prompt
```

### Direct CLI equivalent

The wrapper runs the following under the hood:

```bash
gemini -p "" --yolo
# (prompt is sent via stdin)
# With optional additions:
#   -m gemini-2.5-flash
#   -s
#   --output-format json
```

### Exit codes

| Code  | Meaning                                                                       |
| ----- | ----------------------------------------------------------------------------- |
| `0`   | Success                                                                       |
| `1`   | Error (CLI not found, invalid arguments, parse failure, stdin limit exceeded) |
| `2+`  | Gemini CLI exit code propagated                                               |
| `124` | Timeout (`--timeout-ms` exceeded)                                             |

---

## Configuration

### Environment variables

| Variable                     | Default            | Description                                                                                                                                   |
| ---------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `ASK_GEMINI_MAX_STDIN_BYTES` | `52428800` (50 MB) | Maximum bytes accepted from stdin. Prompts exceeding this limit are rejected with exit code `1`.                                              |
| `COPILOT_MODEL`              | —                  | **GitHub Copilot CLI only.** Selects the backend AI model when running `copilot -p "…"`. Examples: `"gemini-2.5-pro"`, `"claude-sonnet-4.5"`. |

### Gemini CLI debug logging

Gemini CLI reads debug settings from `.gemini/.env` (not `.env`):

```
# .gemini/.env
DEBUG_MODE=true
```

### Google authentication

Credentials are cached in `~/.config/gcloud/` after the first `gemini` login. No additional configuration is required. For service accounts in CI/CD environments:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

---

## Integration Guides

### Claude Code

Claude Code automatically discovers `.claude/skills/`. Use the built-in slash commands:

```
/analyze    Review this README for completeness
/brainstorm 5 ideas for improving developer onboarding
/sandbox    Run this Python snippet
/omega-gemini-setup
```

Or invoke the script directly from a Claude Code task prompt:

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "YOUR PROMPT"
```

### Cursor IDE

Cursor reads `.claude/skills/` automatically. The `.cursor/rules/` files additionally route natural-language requests through the headless script.

1. Copy `.claude/` and `.cursor/` into your project.
2. In the Cursor agent, say: **"ask Gemini to review this file"** — Cursor routes the request to `ask-gemini.mjs`.

### Codex CLI (OpenAI)

Codex discovers skills under `.agents/skills/`.

1. Copy `.claude/` and `.agents/` into your project.
2. Run: `codex exec "ask Gemini to summarize this project"` — Codex delegates to `ask-gemini.mjs`.

Direct headless call for comparison:

```bash
codex exec "PROMPT"
```

### GitHub Copilot CLI

Use Copilot CLI headlessly and select Gemini as the backend via `COPILOT_MODEL`:

```bash
# Use Gemini as the Copilot backend
COPILOT_MODEL="gemini-2.5-pro" copilot -p "Review this function for bugs"

# PowerShell
$env:COPILOT_MODEL="gemini-2.5-pro"; copilot -p "Review this function"
```

See [references/copilot-cli.md](.claude/skills/omega-gemini-cli/references/copilot-cli.md) for the full Copilot CLI reference.

### Antigravity IDE

Antigravity discovers skills under `.agent/skills/`.

1. Copy `.claude/` and `.agent/` into your project.
2. Use natural language in the Antigravity agent: **"use Gemini to analyze the auth module"** — Antigravity runs `ask-gemini.mjs`.

### VS Code

Two tasks are included in `.vscode/tasks.json`:

1. Copy `.claude/` and `.vscode/` into your project.
2. Open the Command Palette → **Tasks: Run Task**.
3. Select **Ask Gemini** — enter a prompt when prompted. Output appears in the integrated terminal.
4. Select **Omega Gemini: Verify setup** to check Node and CLI availability.

### Gemini CLI native

A native Gemini CLI skill is included in `.gemini/skills/omega-feedback-test/`. It provides feedback and test-suggestion workflows when you are inside an interactive Gemini CLI session.

1. Copy `.gemini/` into your project.
2. Start an interactive Gemini session: `gemini`
3. Use the skill for feedback or test suggestions from within the session.

For headless use from within Gemini CLI:

```bash
gemini -p "" --yolo
# Or invoke the wrapper:
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "YOUR PROMPT"
```

---

## Deploying to Another Project

### Minimum (required for all platforms)

```bash
cp -r omega-gemini-cli/.claude /path/to/target-project/
```

This alone is sufficient for **Claude Code**, **Cursor**, and **GitHub Copilot CLI**.

### Full suite (optional, platform-specific)

```bash
# Codex CLI skill host
cp -r omega-gemini-cli/.agents /path/to/target-project/

# Antigravity IDE
cp -r omega-gemini-cli/.agent /path/to/target-project/

# VS Code tasks
cp -r omega-gemini-cli/.vscode /path/to/target-project/

# Gemini CLI native skill
cp -r omega-gemini-cli/.gemini /path/to/target-project/

# Cursor rules
cp -r omega-gemini-cli/.cursor /path/to/target-project/
```

After copying, run the verification script from the target project root:

```bash
cd /path/to/target-project
node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs
```

---

## Usage Examples

### Analysis and code review

```bash
# Summarize a project
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "List the main purpose of this project and its top-level folders in 3 short bullet points." \
  --model gemini-2.5-flash

# Review a specific file
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Review src/auth.js for security vulnerabilities and suggest fixes."

# Explain a concept
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Explain the tradeoffs between REST and GraphQL for a real-time dashboard." \
  --model gemini-2.5-pro
```

### Brainstorming

```bash
# General brainstorm
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Brainstorm 3 short ideas for improving a CLI tool's first-run experience. One sentence each." \
  --model gemini-2.5-flash

# With a methodology
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Use SCAMPER to generate ideas for improving our onboarding flow."

# Domain-specific
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Generate 3 API design patterns for a high-throughput event ingestion service."
```

### Sandbox code execution

```bash
# Run a Python one-liner
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Run this Python one-liner in the sandbox: print('Hello from Gemini sandbox')" \
  --sandbox \
  --model gemini-2.5-flash

# Generate and execute a script
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Create and run a Python script that sorts a list of numbers and prints the result" \
  --sandbox
```

### Model selection

```bash
# Fast, quota-efficient (recommended default)
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Quick summary of this diff" \
  --model gemini-2.5-flash

# High-quality for complex tasks
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Perform a deep security audit of this authentication module" \
  --model gemini-2.5-pro

# Latest flagship
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Explain this advanced algorithm" \
  --model gemini-3.1-pro
```

### JSON output for automation

```bash
# Returns {"response":"..."}
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Extract all function names from this module" \
  --json

# Parse with jq
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Summarize in one sentence" \
  --json | jq -r '.response'

# Generate a commit message
git diff --cached | node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Write a concise conventional commit message for these changes." \
  --json | jq -r '.response'
```

### Stdin input

```bash
# Pipe a file for review
cat README.md | node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "What sections are missing from this README?"

# Pipe a large file safely (stdin never hits ARG_MAX)
cat large-schema.sql | node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Identify tables without a primary key." \
  --model gemini-2.5-flash
```

### Timeout for CI/CD

```bash
# Fail fast after 30 seconds
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Validate this config file" \
  --timeout-ms 30000

# Check exit code
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "..." --timeout-ms 10000
if [ $? -eq 124 ]; then echo "Gemini timed out"; fi
```

### Combining options

```bash
node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
  "Analyze this codebase and list the top 3 security risks" \
  --model gemini-2.5-pro \
  --json \
  --timeout-ms 60000
```

### GitHub Actions CI/CD integration

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'

- name: Install Gemini CLI
  run: npm install -g @google/gemini-cli

- name: Authenticate Gemini CLI
  run: |
    echo "$GOOGLE_SERVICE_ACCOUNT_JSON" > /tmp/sa.json
    export GOOGLE_APPLICATION_CREDENTIALS=/tmp/sa.json
  env:
    GOOGLE_SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_JSON }}

- name: Verify setup
  run: node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs

- name: Run AI code review
  run: |
    node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs \
      "Review the PR diff for security issues and breaking changes" \
      --model gemini-2.5-pro \
      --json
```

---

## Slash Commands

When using **Claude Code**, the following slash commands are available:

| Command                                          | Description                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `/analyze [prompt or @file …]`                   | Analyze files or answer questions with Gemini. Supports `@file` references.       |
| `/brainstorm [challenge] [methodology] [domain]` | Generate ideas. Optionally specify a method (SCAMPER, design thinking) or domain. |
| `/sandbox [prompt or @file …]`                   | Run or test code in Gemini's sandbox.                                             |
| `/omega-gemini [request]`                        | Flexible entry point: routes to analysis or brainstorm as appropriate.            |
| `/omega-gemini-setup`                            | Verify Node.js and Gemini CLI are installed and authenticated.                    |

---

## Development

### Running tests

```bash
npm test
```

Tests are written for the Node.js native test runner (`node:test`). Coverage includes:

- **Unit tests** (`tests/ask-gemini.test.mjs`) — argument parsing, command construction, platform-specific executable selection, JSON output formatting.
- **Integration tests** (`tests/ask-gemini.integration.test.mjs`) — end-to-end spawning with a stub Gemini CLI, timeout handling (exit code `124`), stdin forwarding, JSON envelope extraction, non-zero exit propagation.

### CI gate

```bash
npm run test:ci
# Runs: tests + eslint + prettier check + changelog format check
```

The GitHub Actions workflow tests on Node.js **20**.

### Linting and formatting

```bash
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier (in-place)
npm run format:check  # Prettier (check only, used in CI)
```

### Changelog policy

Every pull request must add at least one entry under `## [Unreleased]` in `CHANGELOG.md`. CI enforces this:

```bash
npm run changelog:check
```

### References maintenance

Reference documentation lives in `.claude/skills/omega-gemini-cli/references/`. If script behavior or command signatures change, update the affected reference files in the same PR. Governance policy is documented in [references/README.md](.claude/skills/omega-gemini-cli/references/README.md).

---

## Repository Structure

```
omega-gemini-cli/
├── .claude/                                  # Required — shared skill runtime
│   ├── commands/                             # Claude Code slash commands
│   │   ├── analyze.md
│   │   ├── brainstorm.md
│   │   ├── sandbox.md
│   │   ├── omega-gemini.md
│   │   └── omega-gemini-setup.md
│   └── skills/omega-gemini-cli/
│       ├── SKILL.md                          # Skill definition and trigger rules
│       ├── scripts/
│       │   ├── ask-gemini.mjs                # Main headless wrapper
│       │   ├── parse-args.mjs                # Pure CLI argument parser (exported)
│       │   ├── format-output.mjs             # JSON response formatter (exported)
│       │   └── verify-setup.mjs              # Node + CLI pre-flight check
│       └── references/                       # Reference documentation
│           ├── headless.md                   # Full headless CLI guide
│           ├── installation.md               # Node + Gemini CLI setup
│           ├── auth.md                       # Authentication troubleshooting
│           ├── models-2026.md                # Current model names and quotas
│           ├── copy-and-run.md               # Portability guide
│           ├── mcp-vs-headless.md            # MCP vs headless feature comparison
│           ├── cursor.md                     # Cursor IDE integration
│           ├── codex.md                      # Codex CLI integration
│           ├── antigravity.md                # Antigravity IDE integration
│           ├── copilot-cli.md                # GitHub Copilot CLI guide
│           ├── gemini-native.md              # Gemini CLI native skill guide
│           ├── vscode.md                     # VS Code tasks guide
│           ├── tools.md                      # Script reference table
│           ├── hooks.md                      # Extension hooks guide
│           └── README.md                     # Governance and freshness policy
├── .agents/skills/omega-gemini-cli/          # Codex CLI skill entrypoint
├── .agent/skills/omega-gemini-cli/           # Antigravity IDE skill entrypoint
├── .gemini/skills/omega-feedback-test/       # Gemini CLI native skill
│   └── SKILL.md
├── .cursor/rules/                            # Cursor routing rules
│   ├── omega-gemini-cli.mdc
│   └── omega-gemini-tools.mdc
├── .vscode/tasks.json                        # VS Code Ask/Verify tasks
├── .github/
│   ├── workflows/ci.yml                      # CI: Node 20
│   └── pull_request_template.md
├── tests/
│   ├── ask-gemini.test.mjs                   # Unit tests
│   └── ask-gemini.integration.test.mjs       # Integration tests
├── scripts/
│   └── check-changelog.mjs                   # CI changelog validator
├── package.json
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## Resources

- [Google Gemini CLI — Agent Skills](https://geminicli.com/docs/cli/skills/)
- [Claude Code — Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Cursor — Agent Skills](https://cursor.com/docs/context/skills)
- [GitHub Copilot — About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [VS Code — Use Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Codex — Agent Skills](https://developers.openai.com/codex/skills/)

---

## License

[MIT License (Non-Commercial)](LICENSE). Commercial use requires prior written permission from the copyright holder.

**Disclaimer:** Unofficial, third-party tool. Not affiliated with, endorsed by, or sponsored by Google.

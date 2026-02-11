# GitHub Copilot CLI (headless)

The **GitHub Copilot CLI** (`copilot`) runs as a headless agent from the terminal. You can use it with multiple backends (Anthropic, OpenAI, Google, xAI) by setting **`COPILOT_MODEL`**.

**Agent Skills** (including omega-gemini-cli) work with **Copilot coding agent**, the **GitHub Copilot CLI**, and agent mode in **VS Code Insiders**. Copilot discovers project skills from **`.github/skills`** or **`.claude/skills`**, and personal skills from **`~/.copilot/skills`** or **`~/.claude/skills`**. See [About Agent Skills — GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills#creating-and-adding-skills). Copilot CLI is in public preview and subject to change.

## Install

```bash
npm install -g @github/copilot
```

Requires a GitHub Copilot subscription. See [GitHub Copilot features](https://github.com/settings/copilot/features) for policies and availability.

## Headless (print mode)

Use **`-p`** for non-interactive, single-prompt runs:

```bash
copilot -p "Your prompt here"
```

## Selecting a model

Set **`COPILOT_MODEL`** to choose the AI backend. Availability depends on your Copilot subscription.

### Bash / WSL / Linux / macOS

```bash
# Anthropic (Claude)
COPILOT_MODEL="claude-sonnet-4.5" copilot -p "Your prompt here"
COPILOT_MODEL="claude-opus-4.1" copilot -p "Your prompt here"
COPILOT_MODEL="claude-sonnet-4" copilot -p "Your prompt here"
COPILOT_MODEL="claude-haiku-4.5" copilot -p "Your prompt here"
COPILOT_MODEL="claude-sonnet-3.5" copilot -p "Your prompt here"

# OpenAI
COPILOT_MODEL="gpt-5" copilot -p "Your prompt here"
COPILOT_MODEL="gpt-5-mini" copilot -p "Your prompt here"
COPILOT_MODEL="gpt-4.1" copilot -p "Your prompt here"
COPILOT_MODEL="gpt-5-codex" copilot -p "Your prompt here"

# Google
COPILOT_MODEL="gemini-2.5-pro" copilot -p "Your prompt here"

# xAI
COPILOT_MODEL="grok-code-fast-1" copilot -p "Your prompt here"
```

### Windows PowerShell

When your prompt starts with `PS C:\` (PowerShell), set the env var with `$env:COPILOT_MODEL` and a semicolon:

```powershell
$env:COPILOT_MODEL="claude-sonnet-4.5"; copilot -p "Your prompt here"
$env:COPILOT_MODEL="gpt-5"; copilot -p "Your prompt here"
$env:COPILOT_MODEL="gemini-2.5-pro"; copilot -p "Your prompt here"
```

## Available models (Copilot “Select Model” UI)

Models shown in the Copilot CLI “Select Model” list (names and availability may change; check the CLI or [GitHub Copilot](https://github.com/settings/copilot/features)):

| Model                  | Note    |
| ---------------------- | ------- |
| Claude Sonnet 4.5      | Default |
| Claude Haiku 4.5       |         |
| Claude Opus 4.6        |         |
| Claude Opus 4.6 (fast) |         |
| Claude Opus 4.5        |         |
| Claude Sonnet 4        |         |
| Gemini 3 Pro (Preview) |         |
| GPT-5.2-Codex          |         |
| GPT-5.2                |         |
| GPT-5.1-Codex-Max      |         |
| GPT-5.1-Codex          |         |
| GPT-5.1                |         |
| GPT-5                  |         |
| GPT-5.1-Codex-Mini     |         |
| GPT-5 mini             |         |
| GPT-4.1                |         |

Use the CLI’s model selector or set `COPILOT_MODEL` to the value that matches the model you want (e.g. `claude-sonnet-4.5`, `gpt-5`, `gemini-2.5-pro`). Exact env values may differ; run `copilot` and use “Select Model” to see current options.

## Relation to omega-gemini-cli

This repo’s **omega-gemini-cli** skill uses the **Gemini CLI** headless script (`ask-gemini.mjs`). The **Copilot CLI** is a separate headless agent that can use Gemini (or other models) via `COPILOT_MODEL`. Use Copilot CLI when you want a single terminal agent with multiple backends; use omega-gemini-cli when you want “ask Gemini” from Claude, Codex, Cursor, or VS Code via the Gemini CLI script.

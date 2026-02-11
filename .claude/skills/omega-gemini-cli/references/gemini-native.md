# Gemini CLI (native) support

When you use **Gemini CLI** directly (terminal or IDE integration), this repo adds two things: a **feedback/test skill** and optional use of the **headless script** from inside Gemini.

## 1. Feedback & test skill (in Gemini CLI)

Gemini CLI discovers skills from **`.gemini/skills/`** (workspace) and `~/.gemini/skills/` (user). This repo includes:

- **`.gemini/skills/omega-feedback-test/`** — A skill that runs when you ask for **feedback**, **testing suggestions**, or a **self-review** in Gemini CLI.

When you're in a Gemini CLI session and say things like "give me feedback on this", "review this", "suggest tests", or "sanity check", Gemini uses the **omega-feedback-test** skill to respond with structured feedback (summary, strengths, risks, test ideas, next steps).

No extra setup: open this project (or a project that has copied `.gemini`), run `gemini`, and ask for feedback or tests. Use **/skills list** in Gemini CLI to see it.

## 2. Running the headless script from Gemini CLI

If you want a **second Gemini run** (e.g. "ask Gemini again with this prompt") from within a Gemini CLI session, you can run the headless script yourself:

```bash
!node .claude/skills/omega-gemini-cli/scripts/ask-gemini.mjs "Your prompt"
```

Whether the `!` prefix is supported depends on your Gemini CLI version; otherwise run that command in a separate terminal from the project root.

## Requirements

- **Gemini CLI** installed and signed in.
- For the headless script: **Node.js** and the same Gemini CLI (script calls `gemini -p "..."`).

## Copying to another project

To get the feedback/test skill in another repo:

1. Copy the **`.gemini`** folder (so you have `.gemini/skills/omega-feedback-test/SKILL.md`).
2. Run Gemini CLI from that project; the skill is discovered automatically.

You can also install the skill to your user directory: `gemini skills link /path/to/this/repo --scope workspace` from the target repo, or copy `.gemini/skills/omega-feedback-test` to `~/.gemini/skills/`.

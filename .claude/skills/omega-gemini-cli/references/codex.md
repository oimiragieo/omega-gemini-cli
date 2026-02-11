# Codex CLI support

Omega-gemini-cli is available as a **Codex Agent Skill**, so you can "ask Gemini" from **Codex** (OpenAI’s terminal coding agent). Skills follow the [Agent Skills](https://agentskills.io) open standard.)

## Alignment with Codex docs

- **Skill structure:** Directory with **SKILL.md** (required: `name` and `description`) plus optional scripts/references/assets/agents. This skill is instruction-only; scripts live in `.claude/skills/omega-gemini-cli/scripts/` and are invoked by path.
- **Where Codex reads skills:** Codex scans **`.agents/skills`** from the current working directory up to the repo root. This repo has the skill at **`$REPO_ROOT/.agents/skills/omega-gemini-cli/`** (REPO scope).
- **Progressive disclosure:** Codex loads only metadata first; full SKILL.md when it uses the skill.
- **Activation:** Explicit (type **$** or **/skills**, choose omega-gemini-cli) or implicit (task matches description).
- **Enable/disable:** In `~/.codex/config.toml`, use `[[skills.config]]` with `path` and `enabled = false`; restart Codex after changes.
- Scripts are shared with the Claude skill; no duplicate copies under `.agents/`.

## Using it in Codex

1. Open this project (or a project that has copied both `.claude` and `.agents`) and run **Codex** from the project root (or a subdirectory).
   ```bash
   codex
   ```
2. When you want Gemini’s help, say e.g. "ask Gemini to review this file" or "use Gemini to brainstorm ideas". Codex will match the **omega-gemini-cli** skill and run the headless script.
3. You can also invoke the skill explicitly: type **$** or use **/skills** and choose **omega-gemini-cli**.

## Requirements

Same as for Claude: **Node.js** 18+ and **Google Gemini CLI** installed and authenticated. Run from project root to verify:

```bash
node .claude/skills/omega-gemini-cli/scripts/verify-setup.mjs
```

## Copying to another project

To use both Claude and Codex in another project:

1. Copy the **entire** `.claude` folder (skill + commands + scripts).
2. Copy the **entire** `.agents` folder (so you have `.agents/skills/omega-gemini-cli/SKILL.md`).
3. Optionally copy `.cursor/rules/` for Cursor IDE.
4. Run from that project’s root; run the verify-setup script once if needed.

Codex will pick up the skill from `.agents/skills`; Claude uses `.claude/skills`. Both use the same headless scripts under `.claude/skills/omega-gemini-cli/scripts/`.

## Skill scope reference (Codex)

| Scope       | Location                    | This repo                          |
| ----------- | --------------------------- | ---------------------------------- |
| REPO (root) | `$REPO_ROOT/.agents/skills` | `.agents/skills/omega-gemini-cli/` |
| REPO (CWD)  | `$CWD/.agents/skills`       | —                                  |
| USER        | `$HOME/.agents/skills`      | —                                  |
| ADMIN       | `/etc/codex/skills`         | —                                  |

Codex supports symlinked skill folders. To install from another repo, use **$skill-installer** or copy the skill directory into one of the locations above.

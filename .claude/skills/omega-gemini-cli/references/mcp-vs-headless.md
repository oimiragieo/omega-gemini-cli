# MCP vs headless (feature comparison)

This skill uses **headless CLI scripts** only. No MCP server is required. The following MCP-only features are **not** in the headless skill; you can approximate some with prompts.

## Features the MCP had that are not in the headless skill

| Feature                    | MCP behavior                                                                                                                                       | Headless workaround                                                                                                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Change mode**            | Injected structured-edit instructions (FILE/OLD/NEW), parsed output, chunking, file cache, and **fetch-chunk** for multi-chunk responses.          | Ask Gemini in the prompt to output edits in that format (e.g. "For each change output: **FILE: path:line** then OLD: ... NEW: ..."). No parsing or chunk cache; one response only.           |
| **Chunking / fetch-chunk** | Large change-mode responses were split into chunks and cached; you could request the next chunk by cache key and index.                            | Run the script again with a follow-up prompt (e.g. "Continue with the next set of edits") or ask for a single batch of edits.                                                                |
| **Structured brainstorm**  | Built-in methodology frameworks (SCAMPER, design-thinking, divergent, convergent, lateral, auto), domain, idea count, feasibility/impact analysis. | Put methodology and structure in the prompt (e.g. "Brainstorm 10 ideas using SCAMPER for: ... Include feasibility and impact for each."). See [prompts below](#brainstorm-prompt-templates). |
| **Ping**                   | Echo test for MCP connection.                                                                                                                      | Run `echo "pong"` or `gemini -help` in the terminal.                                                                                                                                         |
| **Help**                   | Returned `gemini -help` output.                                                                                                                    | Run `gemini -help` (or `npx @google/gemini-cli -help`) in the terminal or via the script with prompt "Show your help".                                                                       |

## What the headless skill provides

- **ask-gemini.mjs** — Run Gemini with a prompt; optional `--model`, `--sandbox`, `--json`. No MCP.
- **verify-setup.mjs** — Check Node and Gemini CLI only.
- **Commands** — /analyze, /sandbox, /brainstorm, /omega-gemini, /omega-gemini-setup (all use the script or verify-setup).
- **Skill + rules** — When to run the script and how. Copy `.claude` (and optionally `.cursor`) into a project and run from that project’s root.

## Brainstorm prompt templates

Use these in the script prompt to get methodology-driven brainstorming without the MCP:

- **SCAMPER**: "Brainstorm ideas using SCAMPER (Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse) for: [CHALLENGE]. Give 10 ideas with one sentence each."
- **Design thinking**: "Using design thinking (empathize, define, ideate, prototype, test), brainstorm 8 ideas for: [CHALLENGE]. Include a short feasibility note for each."
- **Divergent**: "Do divergent brainstorming: generate 12 varied ideas for [CHALLENGE] without judging. List each in one line."

Replace `[CHALLENGE]` with the user’s question or context.

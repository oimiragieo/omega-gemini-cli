# Changelog

## [Unreleased]

## 2.0.0 — Portable headless skill (no MCP)

- **Headless-only**: Replaced MCP server with a portable `.claude` skill that runs the Gemini CLI in headless mode via scripts. No MCP server or MCP configuration required.
- **Scripts**: Added `ask-gemini.mjs` (prompt, `--model`, `--sandbox`, `--json`) and `verify-setup.mjs` (Node + Gemini CLI check). Removed dependency on `npx gemini-mcp-tool`.
- **Commands**: /analyze, /sandbox, /brainstorm, /omega-gemini, /omega-gemini-setup—all invoke the headless script or verify-setup from the project root.
- **References**: installation, auth, headless, tools, models-2026, copy-and-run, mcp-vs-headless (feature comparison), hooks.
- **Copy-and-run**: Documented what to copy (`.claude` and optionally `.cursor`) and that paths are relative to the project root.
- **Removed**: MCP server source (`src/`), npm package build, VitePress docs site, and CI/deploy workflows. Repo is now skill + README + CHANGELOG + LICENSE.

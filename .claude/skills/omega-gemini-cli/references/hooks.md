# Hooks (omega-gemini-cli skill)

Hooks run at specific points in the skill or session lifecycle. When the client supports skill hooks, you can configure them in the skill's SKILL.md frontmatter under `hooks`.

## Event types

- **PreToolUse** — Run before a tool is used (e.g. validate or enrich ask-gemini/brainstorm arguments).
- **PostToolUse** — Run after a tool returns (e.g. log, retry, or format results).
- **SessionStart** — Run when the session starts (e.g. load project context).
- **Stop** — Run when the agent stops (e.g. enforce completion or cleanup).

## Matchers

For tool-related hooks (PreToolUse, PostToolUse), use a matcher to target tools:

- Exact: `ask-gemini`, `brainstorm`, `fetch-chunk`, `ping`, `Help`
- Pattern: `ask-gemini|brainstorm` to match either
- All tools: `*`

## Example (Claude Code)

In SKILL.md frontmatter:

```yaml
hooks:
  - event: PreToolUse
    matcher: 'ask-gemini|brainstorm'
    type: prompt
    prompt: 'Verify the prompt parameter is non-empty and on-topic. If not, suggest a clearer prompt.'
    timeout: 15
```

Or a command-based hook:

```yaml
hooks:
  - event: PostToolUse
    matcher: 'ask-gemini'
    type: command
    command: "echo 'Gemini call completed'"
    timeout: 5
```

## When to use

- **PreToolUse** on `ask-gemini|brainstorm`: Ensure `prompt` is set and optionally validate length or content.
- **PostToolUse**: Log usage, summarize long outputs, or trigger follow-up when changeMode returns multiple chunks.

Check your client's (e.g. Claude Code) hooks documentation for the exact schema and supported events.

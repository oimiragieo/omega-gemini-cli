---
name: omega-feedback-test
description: Use when the user asks for feedback on code, a self-review, testing suggestions, or a sanity check. Provides structured feedback, test ideas, or a short review checklist so the user can validate their work.
---

# Omega: Feedback & Test (Gemini CLI)

This skill follows the [Agent Skills](https://agentskills.io) open standard and is discovered by Gemini CLI from **Workspace Skills** (`.gemini/skills/`). When the user wants **feedback**, **testing suggestions**, or a **self-review** while working in Gemini CLI, follow this workflow so they get consistent, actionable output.

## When to use this skill

- User says "give me feedback", "review this", "test this", "sanity check", "what could go wrong?", "suggest tests", or similar.
- User wants a second pass on code or design before committing or shipping.

## Structured feedback format

Provide a short, scannable response:

1. **Summary** (1–2 sentences) — What you’re looking at and the main takeaway.
2. **Strengths** — What’s solid (patterns, clarity, correctness).
3. **Risks / improvements** — Edge cases, bugs, security, performance, or clarity.
4. **Test ideas** (if relevant) — Concrete test cases or scenarios to run (unit, integration, or manual).
5. **Next steps** (optional) — One to three concrete actions if the user asked for “what to do next”.

Keep each section brief. If the user only asked for “test ideas”, focus there and shorten the rest.

## Test suggestions

When the user asks for tests or “how to test”:

- Suggest specific inputs, edge cases, or scenarios.
- Mention tools or commands if relevant (e.g. pytest, jest, curl).
- Prefer a short list of test cases over long prose.

## Scope

- Use only the context the user provided (files, selection, or conversation). Don’t invent files or code.
- If the request is vague, ask one short clarifying question or state your assumptions and proceed.

This skill helps Gemini CLI act as a consistent “feedback and test” partner without changing how the rest of the session works.

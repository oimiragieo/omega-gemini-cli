# References Governance

This folder contains supporting reference docs for setup, usage patterns, and agent-specific guidance.

## Source of truth

- Canonical runtime behavior is defined by `../../scripts/ask-gemini.mjs`.
- Setup and environment checks are defined by `../../scripts/verify-setup.mjs`.
- Slash-command behavior is defined by `../../../commands/`.
- Reference docs must align to those files and should not introduce conflicting behavior.

## Ownership

- Owner: repository maintainers for `omega-gemini-cli`.
- When scripts or command behavior changes, update the relevant file(s) in this folder in the same pull request.

## Freshness policy

- Review cadence: at least once per release.
- During review, confirm examples still run as written.
- During review, confirm flags and defaults match the scripts.
- During review, confirm install/auth/model guidance still matches current CLI behavior.

## Status tags

- Use one of these tags at the top of each reference file.
- `Status: Maintained` for current docs.
- `Status: Needs review` when content may be stale.

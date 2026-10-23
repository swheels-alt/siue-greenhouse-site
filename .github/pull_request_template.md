## What and why

Closes #

## How I tested it

<!-- Commands you ran, and what you checked by hand. UI changes: add a screenshot if it helps,
with no real names, emails or phone numbers. -->

## Author checklist

- [ ] Every item in [docs/DEFINITION_OF_DONE.md](../docs/DEFINITION_OF_DONE.md) that applies is done
- [ ] Size: 400 changed lines or fewer, not counting lockfiles (aim for 200 to 400); if more, the reason is written above
- [ ] If AI wrote any of this, I have read and can explain every line
- [ ] No secrets, real personal data, or debug code

## Reviewer checklist (QA plan 4.2)

Label every comment so the author knows what blocks the merge:
`defect:` must be fixed · `design:` blocks until we agree · `question:` needs an answer · `nit:` optional, never blocks.
Still disagree after one exchange each? The tiebreaker decides within 1 business day (Sam; Yahir if Sam is involved).

Correctness

- [ ] Meets every acceptance criterion in the linked issue
- [ ] Handles empty input, too-long input, past dates, duplicates, and end before start
- [ ] Errors reach the user in plain language

Security

- [ ] Every new route is in `docs/api/openapi.yaml` and classified in `backend/app/auth/route_access.py` with the right role
- [ ] Input is validated on the server; no SQL built from strings; no personal data in logs

Accessibility and branding

- [ ] Images have alt text that says what the image shows; every input has a visible label
- [ ] I used the change with the keyboard only, and focus order makes sense
- [ ] Colors and fonts come from `frontend/src/styles/theme.css`

Maintainability

- [ ] I could explain this change to the next team without the author present
- [ ] The front end calls the API only through `frontend/src/api/`
- [ ] A schema change has a migration that upgrades and downgrades

Tests

- [ ] I read the tests, and they would fail if the code were wrong

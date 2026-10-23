# Contributing

The full rules are in [docs/QA_PLAN.md](docs/QA_PLAN.md). This is the short version.

## Workflow (QA plan 4.1)

1. Take an issue from Ready on the project board and assign yourself. Limit: 2 in progress.
2. Branch from `main`: `type/issue-short-name`, for example `feat/42-plant-search` or
   `fix/57-reservation-end-time`. Types: feat, fix, docs, test, chore.
3. Commit in small steps. Message: an imperative summary of 72 characters or fewer, then
   `Refs #42`.
4. Run `make lint` and `make test` locally (pre-commit runs the fast checks on every commit).
5. Open a PR from the template, with `Closes #42`. Fix until CI is green, then request review.
6. Resolve every `defect:`, `design:` and `question:` comment, check [docs/DEFINITION_OF_DONE.md](docs/DEFINITION_OF_DONE.md),
   and squash merge.

## Reviews (QA plan 3.4)

- One approval from someone other than the author. Two approvals when the PR touches a
  protected path: `backend/app/auth/`, `backend/app/reservations/`, `backend/migrations/`,
  `.github/workflows/`, `.github/rulesets/`, `.github/CODEOWNERS`, `docs/QA_PLAN.md`,
  `docs/DEFINITION_OF_DONE.md`. The protected-paths check enforces this; a change to the QA plan
  or the Definition of Done also needs the QA lead (or the backup, when the QA lead wrote it).
- First review within 1 business day. If none comes, the reviewer of the week takes it
  ([docs/ROTATION.md](docs/ROTATION.md)).
- Aim for 200 to 400 changed lines, not counting lockfiles and generated files. Over 400, say
  why in the description.
- Label every comment: `defect:` must be fixed; `design:` blocks until we agree; `question:` needs
  an answer; `nit:` is optional and never blocks. If you still disagree after one exchange each,
  the tiebreaker decides within 1 business day: Sam, or Yahir when Sam is involved.
- AI-written code is allowed. The author must be able to explain every line, and the person who
  merges is accountable for it.
- Bug fixes include a regression test named for the issue, for example
  `test_issue_57_end_before_start.py`, that fails before the fix.

## Never commit

Secrets, real personal data (tour requesters' names, emails, phone numbers), or debug code.
If a secret is ever pushed, tell Dane so it is rotated.

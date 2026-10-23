# Definition of Done

An issue is done only when every box below that applies is ticked. The PR template links here,
and the reviewer checks it before approving (QA plan 3.5). This file is a protected path:
changing it needs 2 approvals, one from the QA lead (QA plan 10.2).

- [ ] **Merged through a reviewed PR.** At least 1 approval from someone other than the author
      (2 on protected paths); every `defect:`, `design:` and
      `question:` comment resolved.
- [ ] **CI is green on the PR.** Every required check passed; nothing was re-run to get a pass.
- [ ] **New behavior is tested.** A bug fix includes a test that failed before the fix and passes
      after it, named for the issue (`test_issue_57_...`).
- [ ] **Public interfaces are documented.** Docstrings or `///` comments on public functions;
      every new or changed route is in `docs/api/openapi.yaml` and classified in
      `backend/app/auth/route_access.py`.
- [ ] **Setup still works.** If the change touches setup, dependencies, the Makefile or
      `.env.example`, the `fresh-setup` check passed and `docs/SETUP.md` matches.
- [ ] **Accessible.** No new axe violations; any UI change was checked with the keyboard only.
- [ ] **Changelog.** A user-visible change adds a line under Unreleased in `CHANGELOG.md`.
- [ ] **Issue closed with a link to the PR.** A defect is closed only after someone other than
      the fixer verifies it (QA plan 8.3).

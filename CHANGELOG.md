# Changelog

All user-visible changes are listed here (Keep a Changelog format, Semantic Versioning).

## [Unreleased]

### Added

- C++ reservation conflict check (`cpp/include/greenhouse/conflict.hpp`): checks a requested
  time against approved reservations (half-open ranges, so back-to-back bookings do not
  conflict) and lists a day's open slots; 19 GoogleTest cases. Not yet called from Python
  (ADR 0001 is still proposed)
- Starter repository: CI gates, review rules, issue forms, QA plan and docs (October 23, 2026)
- docs/DEFINITION_OF_DONE.md, docs/DEBT.md (technical debt register) and docs/ROTATION.md
  (reviewer of the week, build cop, module owners)
- Monthly mutation testing: `make mutation` and `.github/workflows/mutation.yml` (report only)
- Real defect records in docs/qa/defects/ (#1 and #2) and the first monthly QA report,
  docs/qa/reports/2026-10.md
- `scripts/qa_report.py` computes the DORA and flow metrics (M1 to M12) from the GitHub CLI, with
  unit tests on sample GitHub CLI output in scripts/tests/
- ESLint rules for name length and no class components; "Options considered and rejected" in the
  ADR template; proposed C++ role in ADR 0001

### Changed

- CI runs `fast-checks` first (format, lint, types, complexity, secrets, dependency audit), then
  the test jobs; required checks are fast-checks, backend-tests, cpp, frontend-tests, fresh-setup,
  e2e and protected-paths
- Coverage is reported in each CI job summary and no longer blocks a merge
- Playwright never retries; flaky tests are quarantined instead
- Three code owners per protected path; .github/CODEOWNERS and docs/DEFINITION_OF_DONE.md are now
  protected; a QA plan change needs the QA lead's approval (or the backup's)
- Defects carry a severity (S1 to S4) and a priority (P1 to P3); screenshots are optional on the
  bug form
- Dependency audits block only PRs that change dependencies; a new nightly job fails on any
  advisory, which starts the M15 clock
- A red main gets a revert PR within 1 hour and is green again within 1 business day (M4, M9)
- `make setup` checks for Python 3.12 or newer and installs the hooks only inside a git
  repository; docs/SETUP.md covers Ubuntu 22.04
- Either the QA lead or the backup may approve a QA plan change; a `verifying` label stops the
  M8 fix clock while a fix waits for verification
- Issue #3 (first task) has Given/When/Then acceptance criteria in docs/qa/issues/
- Release archives go to GitHub Release assets and the department folder, not the repository
- PR template: Definition of Done, comment labels, AI accountability line, size guide
- CodeQL runs only on a public repository and is not a required check
- Lighthouse CI runs through a pinned `npx` call instead of the e2e lockfile, because its
  dependencies carry High advisories with no fix (exception in docs/qa/waivers.md)
- README lists the C++ tools; setup goal is 30 minutes from clone to passing tests

### Fixed

- #1: the route allow-list test compared the allow-list with itself and could never fail; it now
  checks every route in docs/api/openapi.yaml

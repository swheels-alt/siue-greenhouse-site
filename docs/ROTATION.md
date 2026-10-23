# Weekly rotation and module owners

## Reviewer of the week and build cop

Each week one person is **reviewer of the week** and one is **build cop** (QA plan 5.1). The
rotation starts the week of November 2, 2026 with week A and repeats A, B, C, D. Swaps are fine;
post them in the team chat and edit this table in the same week.

| Week | Reviewer of the week | Build cop |
| --- | --- | --- |
| A | Sam Wheeler | Dane Niblett |
| B | Dane Niblett | Matthew Wilson |
| C | Matthew Wilson | Yahir Romero |
| D | Yahir Romero | Sam Wheeler |

**Reviewer of the week** gives the first review on any PR that has no reviewer within 1 business
day (M10), and picks up reviews when the assigned reviewer is away.

**Build cop**

- Watches `main`. When it goes red, opens a PR within 1 hour of noticing that reverts the
  merge that broke it (or, for a new advisory, bumps the package), labeled `revert`, and asks
  the reviewer of the week to review it first. Goal: main green again within 1 business day
  (M4, M9). Then opens an issue for the author.
- Quarantines a flaky test the same day it is seen: skip it with a link to an issue labeled
  `flaky`, owned by the test's module owner (M12). Never re-runs a job to get a pass.
- Merges or closes the Monday Dependabot PRs, and opens issues for nightly failures.

## Module owners (proposed; confirmed at the first weekly meeting)

An owner keeps the module's tests, docs and debt rows current and is the default reviewer for
design questions in it. The backup acts with full authority when the owner is away.

| Module or area | Owner | Backup |
| --- | --- | --- |
| auth (`backend/app/auth/`) | Dane Niblett | Sam Wheeler |
| reservations (`backend/app/reservations/`) | Sam Wheeler | Matthew Wilson |
| tours (`backend/app/tours/`) | Yahir Romero | Sam Wheeler |
| inventory (`backend/app/inventory/`) | Matthew Wilson | Yahir Romero |
| content (`backend/app/content/`) | Yahir Romero | Matthew Wilson |
| Front end and theme (`frontend/`) | Matthew Wilson | Dane Niblett |
| C++ (`cpp/`) | Dane Niblett | Sam Wheeler |
| CI and repository settings (`.github/`) | Dane Niblett | Sam Wheeler |
| Docs (`docs/`, `README.md`) | Yahir Romero | Matthew Wilson |

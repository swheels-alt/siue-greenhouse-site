# 0001: Python web framework, and which server parts are C++

Status: Proposed
Date: 2026-10-23
Author: Dane Niblett
Approved by:

## Context

The team plans to build the server in Python and C++ with MySQL, and the front end in React.
SIUE ITS has not yet confirmed which languages and databases it allows on its hosting (D1).
`make migrate`, `make seed` and `make run` wait on this decision (docs/DEBT.md).

C++ needs a job with a clear boundary. Splitting ordinary request handling across two languages
would double the build, test and review cost for no benefit to users.

## Decision (proposed)

- **Python** serves the whole REST API: routing, validation, database access, sign-on and roles.
  The framework and its migration tool are chosen once ITS answers.
- **C++** owns one library: the reservation availability and conflict check. Given a space, a
  start and an end, and the approved reservations for that space, it answers whether the request
  overlaps any of them and lists the open slots for a day. Python calls it through a small
  binding; the library has no database or network access, so it is tested on its own with
  GoogleTest.
- **Fallback: all Python.** If ITS does not allow C++ on its hosting, or the binding takes more
  than one week of one person's time, the same check is written in Python behind the same
  function signature, and `cpp/` is removed in one PR with this ADR marked Superseded.

## Options considered and rejected

| Option | Why we rejected it |
| --- | --- |
| C++ for the whole server | Slower to build forms and APIs; fewer of us can review it; nothing in the site needs C++ speed for every request |
| C++ for image resizing of plant photos | Mature Python libraries already do it; would add a native dependency to the deploy for no gain |
| A separate C++ service behind its own port | A second process to deploy, monitor and secure on SIUE hosting, for one function |
| No C++ at all from the start | Kept as the fallback; the team plan names C++, and the conflict check is a small, testable place to use it |

## Consequences

To be completed when accepted: update the Makefile targets, docs/DATABASE.md, docs/ARCHITECTURE.md
and QA plan 1.1; remove the first debt row in docs/DEBT.md and close defect #2.

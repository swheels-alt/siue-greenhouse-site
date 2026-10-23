# QA report: YYYY-MM

Prepared by: Sam Wheeler (backup Yahir Romero), first week of the month. Generate the numbers
with `make qa-report` (scripts/qa_report.py), paste them below, then fill in the rest by hand.
Metric IDs and thresholds are in QA plan Section 7.

Release(s) this month:

## Delivery (DORA)

Until a deploy pipeline exists (ADR 0002), a "deployment" is a merge to `main`.

| Metric | Threshold | This month | Last month | Status |
| --- | --- | --- | --- | --- |
| M1 Deployment frequency (merges to main per week) | Reported | | | |
| M2 Change lead time, median (PR opened to merged) | 2 business days or less | | | |
| M3 Change fail rate (revert or hotfix PRs / merged PRs) | 15% or less | | | |
| M4 Failed deployment recovery time (main red to green) | Revert PR within 1 hour; green within 1 business day | | | |
| M5 Deployment rework rate (hotfixes) | 1 or fewer per release | | | |

## Quality and flow

| Metric | Threshold | This month | Last month | Status |
| --- | --- | --- | --- | --- |
| M6 Escaped defects this month, by severity | 0 S1 or S2 | | | |
| M7 Open S1 or S2 at release | 0 | | | |
| M8 Overdue fixes (P1 past 2 days, P2 past its release) | 0 | | | |
| M9 Build health: times main was red, total hours red | 2 or fewer, each 1 business day or less | | | |
| M10 Review latency, median to first review | 1 business day or less | | | |
| M11 CI duration, median | 10 minutes or less | | | |
| M12 Open flaky tests (quarantined) | 2 or fewer, each 7 days or less | | | |
| M13 Functions over complexity 10 | 0 (CI gate) | | | |
| M14 Accessibility: axe serious or critical, Lighthouse, manual check | 0, 95 or more, passed | | | |
| M15 Vulnerabilities past deadline (Critical 2 days, High 7 days) | 0 | | | |
| M16 Onboarding dry run (if one ran) | 30 minutes clone to tests; 2 hours with prerequisites | | | |

## Reported only (no threshold, never a gate)

| Measure | This month | Last month |
| --- | --- | --- |
| Coverage, Python / C++ / front end, with Google band (60 acceptable, 75 commendable, 90 exemplary) | | |
| Mutation testing: mutants, killed, survived; action for each survivor | | |
| Maintainability index: modules below grade A | | |
| PR size, median changed lines (guide: 200 to 400) | | |
| Defects found before release | | |
| Lighthouse performance | | |

## Actions

Red items and action issues (one owner, due next retro):

Open defects by severity and priority:

Escaped defects this month (with postmortem link):

# Lessons learned

One line per lesson, linked to the retro or issue it came from (QA plan 10.2). New members read
this during onboarding.

| Date | Lesson | Source |
| --- | --- | --- |
| 2026-10-23 | GoogleTest is fetched by git tag, not a release archive, so it builds on networks that block archive downloads | Starter repository setup |
| 2026-10-23 | A test that builds its expected value from the code under test can never fail; read the test's inputs, not just its result | Defect #1, docs/qa/defects/0001-vacuous-route-test.md |
| 2026-10-23 | Mutation testing found an untested promise (sort order) in code with 100% line coverage | First mutation run, docs/qa/reports/2026-10.md |

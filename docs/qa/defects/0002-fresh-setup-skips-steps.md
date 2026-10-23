# Defect #2: the fresh-setup check skips three quick-start steps

| Field | Value |
| --- | --- |
| Reported | October 23, 2026, during the review of QA plan version 1.0 against the course rubric; filed by Sam Wheeler |
| Environment | CI workflow `.github/workflows/ci.yml`, job `fresh-setup` |
| Steps to reproduce | 1. Compare the README quick start with the `fresh-setup` job. 2. Run `make migrate`, `make seed` and `make run`. |
| Expected | The job runs every quick-start command, so a broken setup step fails CI |
| Actual | The job runs `make setup`, `make db-up` and `make test` only. `make migrate`, `make seed` and `make run` print a notice and do nothing, because the web framework and its migration tool wait on ADR 0001 |
| Severity | S3: setup could break in those steps without CI noticing, but they do nothing yet, so nothing can break today |
| Priority | P3, labeled deferred |
| Triage | October 23, 2026, Sam Wheeler. Labels: bug, severity:S3, priority:P3, deferred. Assigned to Dane Niblett |
| Reason for deferring | The steps cannot be tested until they exist. Recorded in docs/DEBT.md and cited in the `fresh-setup` job's comment |
| Revisit trigger | ADR 0001 accepted. The PR that implements `make migrate`, `make seed` and `make run` adds them to the `fresh-setup` job, plus a check that the API answers on `/health` |
| Verification | When fixed, by someone other than Dane: a PR that breaks `make migrate` must turn `fresh-setup` red |

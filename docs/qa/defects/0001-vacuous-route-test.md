# Defect #1: the route allow-list test could never fail

| Field | Value |
| --- | --- |
| Reported | October 23, 2026, during the review of QA plan version 1.0 against the course rubric; filed by Sam Wheeler |
| Environment | Local, starter repository as of October 23, 2026; Python 3.13, pytest 9.1.1 |
| Steps to reproduce | 1. Add a `delete` operation under `/api/v1/plants` in `docs/api/openapi.yaml`, without adding that route to either table in `backend/app/auth/route_access.py`. 2. Run `.venv/bin/pytest backend/tests/unit/test_route_access.py`. |
| Expected | The route allow-list test fails and names the unclassified route, as QA plan goal Q4 promises |
| Actual | Every test in the file passes. The allow-list test passed `PUBLIC_ROUTES` in as the "registered" routes, so it compared the allow-list with itself and could not fail for any input |
| Severity | S2: the check behind the security goal (Q4) gave false assurance. No user data was exposed, because no protected route exists yet |
| Priority | P1: a security check that cannot fail is fixed before any route is added |
| Triage | October 23, 2026, Sam Wheeler. Labels: bug, severity:S2, priority:P1; `verifying` added when the fix merged on October 23, which stops the M8 fix clock on day 0. Assigned to Sam Wheeler; owner of auth is Dane Niblett |
| Fix | The test (now `test_issue_1_every_spec_route_is_classified`) reads every route from `docs/api/openapi.yaml` (the route list until ADR 0001 adds a web framework) through a shared fixture in `backend/tests/unit/conftest.py`, and checks each one is classified |
| Regression test | `test_issue_1_unclassified_spec_route_is_caught` in `backend/tests/unit/test_route_access.py` writes a spec with an unclassified route and asserts it is reported. It fails on the old test logic and passes on the new |
| Follow-up found by mutation testing | The first mutation run on the same day (27 mutants) left 3 alive, all removing the documented sort order of `unclassified()`. `test_unclassified_routes_are_sorted_by_path_then_method` was added; the rerun killed 27 of 27 |
| Verification | Pending: Matthew Wilson (not the fixer) repeats the steps above by October 27, 2026 (2 business days after the fix) and records "Verified" here and on the issue. The defect stays open until then |

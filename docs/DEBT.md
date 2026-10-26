# Technical debt register

Debt we took on knowingly. Reviewed at every retrospective (QA plan 10.1 and 11.4): a row is
removed when it is paid, and new debt is added in the PR that creates it. Owners are named people;
"When we pay it" is a date or the event that triggers payment.

| What | Where | Why we took it | What it costs us | Owner | When we pay it |
| --- | --- | --- | --- | --- | --- |
| `make migrate`, `make seed` and `make run` only print a notice | `Makefile` | The web framework and its migration tool wait on ADR 0001 and ITS's answer on allowed languages | The `fresh-setup` check cannot test the full quick start (defect #2); newcomers cannot run the site yet | Dane Niblett | When ADR 0001 is accepted |
| `deploy.yml` only prints a notice; there is no staging server | `.github/workflows/deploy.yml` | Hosting and a test server wait on ADR 0002 and ITS | Gate G4 does not exist yet; merges are not tried on a server before release | Dane Niblett | When ADR 0002 is accepted |
| Browser flows and Lighthouse are switched off in CI | `e2e/`, repository variable `E2E_ENABLED` | There were no real pages to test until #3; the flows now pass locally (PR for #3) | Accessibility (M14) is checked only by unit-level linting until then | Matthew Wilson | Set `E2E_ENABLED` when the #3 PR merges |
| CODEOWNERS uses placeholder handles | `.github/CODEOWNERS` | Real GitHub usernames are not collected yet | Code owner review cannot be required until they are replaced | Sam Wheeler | Before the ruleset is applied (D5) |
| ESLint held at version 9 | `frontend/package.json` | `eslint-plugin-jsx-a11y` does not support ESLint 10 yet | We miss ESLint 10 fixes; a later upgrade is larger | Matthew Wilson | Semester tool review, January 2027 |
| Theme colors and fonts are placeholders | `frontend/src/styles/theme.css` | SIUE Marketing and Communications has not confirmed the brand values for this site | Pages may need restyling once confirmed; branding review items cannot pass yet | Matthew Wilson | When Keith Harris (Marketing and Communications) confirms the values |
| Lighthouse CI is run with `npx`, outside the lockfile | `e2e/package.json` script `lighthouse` | Its dependencies carry High advisories with no fix yet (docs/qa/waivers.md) | The Lighthouse version is pinned only by the script, and Dependabot does not watch it | Dane Niblett | When `@lhci/cli` ships a release that passes `npm audit`; checked at the January 2027 tool review |
| Location and hours are placeholders | `frontend/src/content/visit.json` | The sponsor has not confirmed the building, address or hours | The home page shows a visible placeholder notice; visitors cannot rely on the hours yet | Sam Wheeler | When greenhouse staff confirm them; then set `placeholder` to false |

# SIUE Greenhouse Website

The website for the SIUE Greenhouse, Department of Biological Sciences: public information,
a plant inventory, table space reservations for faculty, and public tour requests. Built by the
CS 425 senior project team (Fall 2026 to Spring 2027) and handed off to the department's
webmaster at the end of Spring 2027.

How quality is kept: [docs/QA_PLAN.md](docs/QA_PLAN.md).

## Quick start

Prerequisites: Git, Docker Desktop, make, the C++ toolchain (CMake 3.20 or newer, a C++17
compiler such as g++ or clang, clang-format and clang-tidy), Python (version in
`.python-version`) and Node.js (version in `.nvmrc`). On Windows, run everything in a WSL2
Ubuntu terminal. Install commands for each system: [docs/SETUP.md](docs/SETUP.md).

Goal (QA plan Q3, M16): with the prerequisites installed, clone to passing `make test` in
30 minutes or less.

```bash
git clone https://github.com/swheels-alt/siue-greenhouse-site.git greenhouse-site
cd greenhouse-site
cp .env.example .env     # local defaults work as-is
make setup               # Python venv, Python and Node packages, pre-commit hooks
make db-up               # MySQL in Docker on port 3306
make migrate             # builds the schema
make seed                # fake plants, spaces, reservations and tour requests
make run                 # API at http://localhost:8000, site at http://localhost:5173
make test                # Python, C++ and front-end tests; make e2e runs the browser flows
```

Status on October 26, 2026: `setup`, `db-up`, `test` and `lint` work. `migrate`, `seed` and `run`
print a notice until ADR 0001 picks the Python web framework (QA plan Appendix C, D1; tracked as
defect #2 and in [docs/DEBT.md](docs/DEBT.md)).

## Run the front-end prototype

The fall prototype runs in the browser with no server or database:

```bash
cd frontend
npm ci
npm run dev              # http://localhost:5173
```

| Page | Address | What works | Not yet |
| --- | --- | --- | --- |
| Home | `#/` | Location, "Get directions" map link, hours for each day (#3) | Address and hours are placeholders until staff confirm them |
| Plants | `#/plants` | Search by common or scientific name, filter by type | 13 sample plants; no staff editing until the API exists |
| Request a tour | `#/tour` | Every field checked, plain-language errors, spam trap, confirmation | Nothing is sent: the tours API waits on ADR 0001 |

Table reservations, SIUE sign-in and staff tools wait on ADR 0001 and ADR 0003 and are planned
for Spring 2027. The C++ reservation conflict check is a tested library in `cpp/`, not yet wired
to Python.

Browser flows with axe accessibility checks: `make e2e` (builds the site and runs
`e2e/tests/`).

## Where things are

| Path | What it holds |
| --- | --- |
| `backend/app/` | Python server modules: content, inventory, reservations, tours, auth |
| `cpp/` | C++ server components; which parts are C++ is set by ADR 0001 |
| `frontend/` | React front end |
| `e2e/` | Playwright browser flows with axe accessibility checks |
| `docs/` | Plan, setup, architecture, decisions, QA records |
| `.github/` | CI, review rules, issue forms, Dependabot |

## Docs

[SETUP](docs/SETUP.md) · [ARCHITECTURE](docs/ARCHITECTURE.md) ·
[DATABASE](docs/DATABASE.md) · [DEPLOY](docs/DEPLOY.md) ·
[TROUBLESHOOTING](docs/TROUBLESHOOTING.md) · [HANDOFF](docs/HANDOFF.md) ·
[CONTRIBUTING](CONTRIBUTING.md) · [Definition of Done](docs/DEFINITION_OF_DONE.md) ·
[Rotation and module owners](docs/ROTATION.md) · [Technical debt](docs/DEBT.md) ·
[Repository settings](docs/REPO_SETTINGS.md) · [Onboarding checklist](docs/ONBOARDING_CHECKLIST.md) ·
[Lessons learned](docs/LESSONS.md)

## Team

Samuel Wheeler, Dane Niblett, Matthew Wilson, Yahir Romero. Sponsor: Jordyn Grawe, Biology
Laboratory Manager (Dr. Jason Williams, Chair of Biological Sciences, while she is away).
Weekly team meeting: day and time set each semester and recorded here.

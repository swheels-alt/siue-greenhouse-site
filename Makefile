# SIUE Greenhouse Website: developer commands (README quick start, QA plan 9.3).
VENV := .venv
BIN := $(VENV)/bin
CPP_BUILD := build/cpp

.PHONY: setup db-up db-down migrate seed run test test-python test-cpp test-frontend e2e lint format mutation qa-report

PYTHON ?= python3

setup:
	@$(PYTHON) -c 'import sys; sys.exit(0 if sys.version_info >= (3, 12) else 1)' || \
	  (echo "Python 3.12 or newer is needed (.python-version); see docs/SETUP.md." && exit 1)
	$(PYTHON) -m venv $(VENV)
	$(BIN)/pip install -r backend/requirements.lock
	cd frontend && npm ci
	@if git rev-parse --git-dir >/dev/null 2>&1; then $(BIN)/pre-commit install; \
	else echo "Not a git repository yet, so the pre-commit hooks were not installed: run git init, then $(BIN)/pre-commit install."; fi

db-up:
	docker compose up -d db

db-down:
	docker compose down

# These three arrive with ADR 0001, which picks the Python web framework (D1).
migrate seed run:
	@echo "make $@ is not available yet: it arrives with ADR 0001 (docs/decisions/0001-web-framework-and-cpp-split.md)."

test: test-python test-cpp test-frontend

test-python:
	$(BIN)/pytest

test-cpp:
	cmake -S cpp -B $(CPP_BUILD) -DCMAKE_BUILD_TYPE=Debug
	cmake --build $(CPP_BUILD)
	ctest --test-dir $(CPP_BUILD) --output-on-failure

test-frontend:
	cd frontend && npm test

e2e:
	cd e2e && npm ci && npx playwright install --with-deps chromium && npx playwright test

lint:
	$(BIN)/ruff check .
	$(BIN)/ruff format --check .
	$(BIN)/mypy
	$(BIN)/lizard -C 10 -L 60 -w cpp/include cpp/src backend/app
	clang-format --dry-run --Werror cpp/include/greenhouse/*.hpp cpp/src/*.cpp cpp/tests/*.cpp
	cd frontend && npm run lint && npm run format:check && npm run lint:css

format:
	$(BIN)/ruff format .
	$(BIN)/ruff check --fix .
	clang-format -i cpp/include/greenhouse/*.hpp cpp/src/*.cpp cpp/tests/*.cpp
	cd frontend && npx prettier --write .

# Mutation testing (QA plan 3.3): runs monthly in .github/workflows/mutation.yml, or by hand.
# Every surviving mutant gets an action: a new test, or a note in the monthly report saying why not.
mutation:
	cd backend && rm -rf mutants && ../$(BIN)/mutmut run; ../$(BIN)/mutmut results

# Monthly QA report (QA plan 8.2). Paste the output into docs/qa/reports/YYYY-MM.md.
qa-report:
	$(BIN)/python scripts/qa_report.py

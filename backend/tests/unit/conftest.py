"""Shared test fixtures."""

from pathlib import Path

import pytest
import yaml

from app.auth.route_access import Route


def _find_spec() -> Path:
    """Walk up from this file to the repository's docs/api/openapi.yaml."""
    for folder in Path(__file__).resolve().parents:
        candidate = folder / "docs" / "api" / "openapi.yaml"
        if candidate.exists():
            return candidate
    raise FileNotFoundError("docs/api/openapi.yaml not found above " + __file__)


SPEC = _find_spec()
HTTP_METHODS = {"get", "post", "put", "patch", "delete"}


def load_spec_routes(spec_path: Path = SPEC) -> set[Route]:
    """Every route listed in an OpenAPI file, as Route values."""
    spec = yaml.safe_load(spec_path.read_text(encoding="utf-8"))
    return {
        Route(method.upper(), path)
        for path, operations in spec["paths"].items()
        for method in operations
        if method in HTTP_METHODS
    }


@pytest.fixture
def spec_routes() -> set[Route]:
    """Routes in docs/api/openapi.yaml, the route registry until ADR 0001 adds a framework."""
    return load_spec_routes()

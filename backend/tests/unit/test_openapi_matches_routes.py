"""OpenAPI drift test (QA plan 3.2): the spec and the route tables must list the same routes."""

from app.auth.route_access import PROTECTED_ROUTES, PUBLIC_ROUTES, Route


def test_spec_matches_route_tables(spec_routes: set[Route]) -> None:
    classified = set(PUBLIC_ROUTES) | set(PROTECTED_ROUTES)
    assert spec_routes == classified

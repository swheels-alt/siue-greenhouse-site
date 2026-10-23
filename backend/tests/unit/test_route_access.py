from pathlib import Path

from conftest import load_spec_routes

from app.auth.route_access import (
    PROTECTED_ROUTES,
    PUBLIC_ROUTES,
    Role,
    Route,
    is_allowed,
    unclassified,
)

RESERVE = Route("POST", "/api/v1/reservations")
PROTECTED = {RESERVE: frozenset({Role.FACULTY})}


def test_issue_1_every_spec_route_is_classified(spec_routes: set[Route]) -> None:
    # Defect #1: this test used to pass PUBLIC_ROUTES in as the "registered" routes, so it
    # compared the table with itself and could never fail. It now checks the spec's routes.
    assert unclassified(spec_routes) == []


def test_issue_1_unclassified_spec_route_is_caught(tmp_path: Path) -> None:
    # Regression check for defect #1: a route added to the spec without being classified must
    # be reported. The old version of the test above would have passed on this spec.
    spec = tmp_path / "openapi.yaml"
    spec.write_text(
        "paths:\n  /health:\n    get: {}\n  /api/v1/plants:\n    delete: {}\n", encoding="utf-8"
    )
    assert unclassified(load_spec_routes(spec)) == [Route("DELETE", "/api/v1/plants")]


def test_route_is_never_both_public_and_protected() -> None:
    assert not set(PUBLIC_ROUTES) & set(PROTECTED_ROUTES)


def test_unlisted_route_is_reported() -> None:
    stray = Route("DELETE", "/api/v1/plants/1")
    assert unclassified([*PUBLIC_ROUTES, stray]) == [stray]


def test_public_route_needs_no_login() -> None:
    assert is_allowed(Route("GET", "/health"), frozenset())


def test_protected_route_rejects_visitor() -> None:
    assert not is_allowed(RESERVE, frozenset(), protected=PROTECTED)


def test_protected_route_rejects_wrong_role() -> None:
    assert not is_allowed(RESERVE, frozenset({Role.STAFF}), protected=PROTECTED)


def test_protected_route_allows_right_role() -> None:
    assert is_allowed(RESERVE, frozenset({Role.FACULTY}), protected=PROTECTED)


def test_unknown_route_is_denied_even_with_roles() -> None:
    assert not is_allowed(Route("GET", "/admin"), frozenset(Role), protected=PROTECTED)


def test_unclassified_routes_are_sorted_by_path_then_method() -> None:
    # Added after the first mutation run (QA plan 3.3): three mutants that removed this
    # documented ordering survived because no test checked it.
    plants_post = Route("POST", "/api/v1/plants")
    plants_get = Route("GET", "/api/v1/plants")
    admin = Route("GET", "/admin")
    assert unclassified([plants_post, admin, plants_get], public=frozenset(), protected={}) == [
        admin,
        plants_get,
        plants_post,
    ]

"""Route allow-list (QA plan Q4, security floor).

Every API route is either public or login-required with named roles. A route that is in
neither table is denied, and the test suite fails if any registered route is unclassified.
Changes to this file are a protected path: two approvals (QA plan 3.4).
"""

from collections.abc import Iterable, Mapping
from dataclasses import dataclass
from enum import StrEnum


class Role(StrEnum):
    """Roles that come from SIUE sign-on."""

    FACULTY = "faculty"
    STAFF = "staff"
    REVIEWER = "reviewer"


@dataclass(frozen=True)
class Route:
    """One HTTP method and path, for example GET /health."""

    method: str
    path: str


PUBLIC_ROUTES: frozenset[Route] = frozenset(
    {
        Route("GET", "/health"),
    }
)

PROTECTED_ROUTES: Mapping[Route, frozenset[Role]] = {}


def unclassified(
    registered: Iterable[Route],
    public: frozenset[Route] = PUBLIC_ROUTES,
    protected: Mapping[Route, frozenset[Role]] = PROTECTED_ROUTES,
) -> list[Route]:
    """List registered routes that are in neither table.

    Args:
        registered: Every route the web framework has registered.
        public: Routes anyone may call.
        protected: Login-required routes and the roles allowed on each.

    Returns:
        The unclassified routes, sorted by path then method; empty when all are classified.
    """
    missing = [route for route in registered if route not in public and route not in protected]
    return sorted(missing, key=lambda route: (route.path, route.method))


def is_allowed(
    route: Route,
    roles: frozenset[Role],
    public: frozenset[Route] = PUBLIC_ROUTES,
    protected: Mapping[Route, frozenset[Role]] = PROTECTED_ROUTES,
) -> bool:
    """Decide whether a caller with these roles may use a route.

    Args:
        route: The route being called.
        roles: The caller's roles; empty for a visitor who is not logged in.
        public: Routes anyone may call.
        protected: Login-required routes and the roles allowed on each.

    Returns:
        True for public routes, or protected routes the caller has a role for. Unknown routes
        are always denied.
    """
    if route in public:
        return True
    allowed = protected.get(route)
    return allowed is not None and bool(allowed & roles)

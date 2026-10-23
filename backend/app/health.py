"""Health check that SIUE ITS can monitor (QA plan 2.3, reliability)."""

from typing import TypedDict

VERSION = "0.1.0"


class HealthStatus(TypedDict):
    """Body of the GET /health response."""

    status: str
    version: str


def health_status() -> HealthStatus:
    """Report that the service is up.

    Returns:
        The service status and the running version.
    """
    return {"status": "ok", "version": VERSION}

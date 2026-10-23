from app.health import VERSION, health_status


def test_health_reports_ok_and_version() -> None:
    assert health_status() == {"status": "ok", "version": VERSION}

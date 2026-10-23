from app.logging_utils import REMOVED, scrub


def test_personal_fields_are_removed() -> None:
    record = {"requester_email": "visitor@example.com", "Phone": "618-555-0100", "tour_id": 7}
    assert scrub(record) == {"requester_email": REMOVED, "Phone": REMOVED, "tour_id": 7}


def test_other_fields_are_kept() -> None:
    assert scrub({"plant_id": 3, "action": "added"}) == {"plant_id": 3, "action": "added"}

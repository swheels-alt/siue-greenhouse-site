"""Keep tour requesters' personal data out of logs (QA plan 3.1, MySQL rules)."""

from collections.abc import Mapping

PERSONAL_FIELDS: frozenset[str] = frozenset(
    {"name", "email", "phone", "requester_name", "requester_email", "requester_phone"}
)
REMOVED = "[removed]"


def scrub(record: Mapping[str, object]) -> dict[str, object]:
    """Return a copy of a log record with personal fields blanked out.

    Args:
        record: Key-value pairs about to be logged.

    Returns:
        The same keys, with every personal field's value replaced by "[removed]".
    """
    return {
        key: REMOVED if key.lower() in PERSONAL_FIELDS else value for key, value in record.items()
    }

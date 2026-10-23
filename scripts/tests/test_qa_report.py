"""Tests for the monthly report's computations, on recorded GitHub CLI output (QA plan 7)."""

import json
from datetime import datetime
from pathlib import Path

import pytest

import qa_report as report

FIXTURES = Path(__file__).parent / "fixtures"
MONTH = "2026-10"
NOW = datetime.fromisoformat("2026-10-23T12:00:00Z")


def load(name: str) -> list[dict]:
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


@pytest.fixture
def prs() -> list[dict]:
    return load("prs.json")


@pytest.fixture
def issues() -> list[dict]:
    return load("issues.json")


def test_business_days_skip_the_weekend() -> None:
    friday_noon = datetime.fromisoformat("2026-10-09T12:00:00Z")
    monday_noon = datetime.fromisoformat("2026-10-12T12:00:00Z")
    assert report.business_days(friday_noon, monday_noon) == pytest.approx(1.0)


def test_business_days_inside_a_weekend_are_zero() -> None:
    saturday = datetime.fromisoformat("2026-10-10T08:00:00Z")
    sunday = datetime.fromisoformat("2026-10-11T20:00:00Z")
    assert report.business_days(saturday, sunday) == 0


def test_m1_merges_per_week_counts_only_the_month(prs: list[dict]) -> None:
    assert report.merges_per_week(prs, MONTH) == pytest.approx(4 / (30.4 / 7))


def test_m2_lead_time_is_the_median_in_business_days(prs: list[dict]) -> None:
    assert report.median_lead_time(prs, MONTH) == pytest.approx(1.0)


def test_m3_change_fail_rate_counts_revert_and_hotfix(prs: list[dict]) -> None:
    assert report.change_fail_rate(prs, MONTH) == pytest.approx(0.5)


def test_m3_no_merges_means_no_data() -> None:
    assert report.change_fail_rate([], MONTH) is None


def test_m5_hotfix_count(prs: list[dict]) -> None:
    assert report.hotfix_count(prs, MONTH) == 1


def test_pr_size_median(prs: list[dict]) -> None:
    assert report.median_pr_size(prs, MONTH) == 95


def test_m10_review_latency_ignores_the_authors_own_review(prs: list[dict]) -> None:
    assert report.first_review_days(prs[1]) == pytest.approx(1.0)
    assert report.median_review_latency(prs, MONTH) == pytest.approx(0.5)


def test_m4_m9_red_periods_on_main() -> None:
    periods = report.red_periods(load("runs_main.json"), NOW)
    assert [round(hours, 2) for _, hours in periods] == [1.5, 25.8]
    assert periods[0][0] == datetime.fromisoformat("2026-10-06T10:06:00Z")


def test_m11_ci_duration_median_skips_unfinished_runs() -> None:
    assert report.median_ci_minutes(load("runs_main.json"), MONTH) == pytest.approx(6)


def test_m6_escaped_defects_opened_this_month(issues: list[dict]) -> None:
    counts = report.escaped_by_severity(issues, MONTH)
    assert report.dict_text(counts) == "S1 1, S2 1, S3 0, S4 0"


def test_m7_open_defects_by_severity(issues: list[dict]) -> None:
    assert report.dict_text(report.open_by_severity(issues)) == "S1 1, S2 1, S3 2, S4 1"


def test_m8_overdue_p1_and_p2(issues: list[dict]) -> None:
    assert report.overdue_fixes(issues, NOW) == [20, 21]


def test_m8_fix_waiting_for_verification_is_not_overdue(issues: list[dict]) -> None:
    # Defect #1's case: the fix merged on day 0 and only verification is pending.
    verifying = [
        {**issue, "labels": [*issue["labels"], {"name": "verifying"}]}
        for issue in issues
        if issue["number"] == 20
    ]
    assert report.overdue_fixes(verifying, NOW) == []


def test_m12_flaky_open_and_old(issues: list[dict]) -> None:
    assert report.flaky_status(issues, NOW) == (2, 1)


@pytest.mark.parametrize(
    ("percent", "band"),
    [(59.9, "below acceptable"), (60, "acceptable"), (75, "commendable"), (90, "exemplary")],
)
def test_coverage_bands(percent: float, band: str) -> None:
    assert report.coverage_band(percent) == band


def test_mutation_counts() -> None:
    text = (FIXTURES / "mutmut_results.txt").read_text(encoding="utf-8")
    counts = report.mutation_counts(text)
    assert (counts["killed"], counts["survived"], counts["no tests"]) == (3, 1, 1)

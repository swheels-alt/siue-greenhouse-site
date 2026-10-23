"""Collect the automatic numbers for the monthly QA report (QA plan Section 7 and 8.2).

Run from the repository root after `make test` (and `make mutation` once a month):

    python3 scripts/qa_report.py            # this month
    python3 scripts/qa_report.py 2026-10    # a given month

GitHub numbers (M1 to M12, PR size) come from the GitHub CLI and need `gh auth login`: M3 and M5
from the revert and hotfix labels, M4 and M9 from CI and nightly runs on main;
without it each prints "n/a (GitHub CLI not available)". Local numbers (coverage, mutation
testing, maintainability index) come from the files the test runs leave behind. Paste the output
into docs/qa/reports/YYYY-MM.md. Until a deploy pipeline exists (ADR 0002), a "deployment" is a
merge to main.

The computation functions take parsed JSON and are unit tested in scripts/tests/ with sample
GitHub CLI output written in the CLI's JSON format; only the gh_* functions talk to GitHub.
"""

import json
import shutil
import subprocess
import sys
import xml.etree.ElementTree as ET  # noqa: S405 (reads our own coverage file)
from collections import Counter
from collections.abc import Iterable
from datetime import UTC, datetime, timedelta
from pathlib import Path
from statistics import median
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
NA = "n/a (GitHub CLI not available)"
SEVERITIES = ("S1", "S2", "S3", "S4")
Item = dict[str, Any]


# ---------------------------------------------------------------- pure computation


def parse_time(value: str) -> datetime:
    """Parse a GitHub timestamp such as 2026-10-20T14:03:00Z."""
    return datetime.fromisoformat(value)


def business_days(start: datetime, end: datetime) -> float:
    """Days between two times, counting only Monday to Friday (24 hours per weekday)."""
    total = 0.0
    cursor = start
    while cursor < end:
        midnight = (cursor + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        step_end = min(midnight, end)
        if cursor.weekday() < 5:
            total += (step_end - cursor).total_seconds()
        cursor = step_end
    return total / 86400


def label_names(item: Item) -> set[str]:
    """Label names on a PR or issue."""
    return {label["name"] for label in item.get("labels", [])}


def in_month(stamp: str | None, month: str) -> bool:
    """Whether a timestamp falls in a YYYY-MM month."""
    return bool(stamp) and str(stamp).startswith(month)


def merges_per_week(prs: list[Item], month: str) -> float:
    """M1: merged PRs per week in the month (deployment frequency until ADR 0002)."""
    merged = [pr for pr in prs if in_month(pr.get("mergedAt"), month)]
    return len(merged) / (30.4 / 7)


def median_lead_time(prs: list[Item], month: str) -> float | None:
    """M2: median business days from PR opened to merged."""
    days = [
        business_days(parse_time(pr["createdAt"]), parse_time(pr["mergedAt"]))
        for pr in prs
        if in_month(pr.get("mergedAt"), month)
    ]
    return median(days) if days else None


def change_fail_rate(prs: list[Item], month: str) -> float | None:
    """M3: share of merged PRs labeled revert or hotfix."""
    merged = [pr for pr in prs if in_month(pr.get("mergedAt"), month)]
    if not merged:
        return None
    failed = [pr for pr in merged if label_names(pr) & {"revert", "hotfix"}]
    return len(failed) / len(merged)


def hotfix_count(prs: list[Item], month: str) -> int:
    """M5: merged PRs labeled hotfix (unplanned deployments)."""
    return sum(
        1 for pr in prs if in_month(pr.get("mergedAt"), month) and "hotfix" in label_names(pr)
    )


def median_pr_size(prs: list[Item], month: str) -> float | None:
    """Reported only: median changed lines per merged PR (includes lockfiles)."""
    sizes = [pr["additions"] + pr["deletions"] for pr in prs if in_month(pr.get("mergedAt"), month)]
    return median(sizes) if sizes else None


def first_review_days(pr: Item) -> float | None:
    """Business days from PR opened to the first review by someone other than the author."""
    author = pr["author"]["login"]
    times = [
        parse_time(review["submittedAt"])
        for review in pr.get("reviews", [])
        if review["author"]["login"] != author and review.get("submittedAt")
    ]
    if not times:
        return None
    return business_days(parse_time(pr["createdAt"]), min(times))


def median_review_latency(prs: list[Item], month: str) -> float | None:
    """M10: median business days to first review, for PRs opened in the month."""
    days = [
        latency
        for pr in prs
        if in_month(pr.get("createdAt"), month) and (latency := first_review_days(pr)) is not None
    ]
    return median(days) if days else None


def red_periods(runs: list[Item], now: datetime) -> list[tuple[datetime, float]]:
    """M4 and M9: each time main went red, with how many hours it stayed red.

    Takes completed CI runs on main. A period starts when a failing run follows a passing one,
    and ends when the next run passes; a period still open is measured up to now.
    """
    finished = sorted(
        (run for run in runs if run.get("conclusion") in {"success", "failure"}),
        key=lambda run: run["createdAt"],
    )
    periods: list[tuple[datetime, float]] = []
    red_since: datetime | None = None
    for run in finished:
        ended = parse_time(run["updatedAt"])
        if run["conclusion"] == "failure" and red_since is None:
            red_since = ended
        elif run["conclusion"] == "success" and red_since is not None:
            periods.append((red_since, (ended - red_since).total_seconds() / 3600))
            red_since = None
    if red_since is not None:
        periods.append((red_since, (now - red_since).total_seconds() / 3600))
    return periods


def median_ci_minutes(runs: list[Item], month: str) -> float | None:
    """M11: median minutes per completed CI run started in the month."""
    minutes = [
        (parse_time(run["updatedAt"]) - parse_time(run["startedAt"])).total_seconds() / 60
        for run in runs
        if in_month(run.get("startedAt"), month) and run.get("status") == "completed"
    ]
    return median(minutes) if minutes else None


def severity_counts(issues: Iterable[Item]) -> Counter[str]:
    """Count issues by severity label (severity:S1 to severity:S4)."""
    counts: Counter[str] = Counter(dict.fromkeys(SEVERITIES, 0))
    for issue in issues:
        for level in SEVERITIES:
            if f"severity:{level}" in label_names(issue):
                counts[level] += 1
    return counts


def escaped_by_severity(issues: list[Item], month: str) -> Counter[str]:
    """M6: issues labeled escaped and opened in the month, by severity."""
    return severity_counts(
        issue
        for issue in issues
        if "escaped" in label_names(issue) and in_month(issue.get("createdAt"), month)
    )


def open_by_severity(issues: list[Item]) -> Counter[str]:
    """M7: open defects by severity (S1 and S2 must be 0 at release)."""
    return severity_counts(issue for issue in issues if issue.get("state") == "OPEN")


def overdue_fixes(issues: list[Item], now: datetime) -> list[int]:
    """M8: open P1 issues older than 2 days, and open P2 issues past their milestone's due date.

    An issue labeled verifying has its fix merged and waits only for verification, so the fix
    clock has stopped; it is not counted.
    """
    overdue = []
    for issue in issues:
        if issue.get("state") != "OPEN":
            continue
        labels = label_names(issue)
        if "verifying" in labels:
            continue
        age = now - parse_time(issue["createdAt"])
        due = (issue.get("milestone") or {}).get("dueOn")
        if "priority:P1" in labels and age > timedelta(days=2):
            overdue.append(issue["number"])
        elif "priority:P2" in labels and due and parse_time(due) < now:
            overdue.append(issue["number"])
    return sorted(overdue)


def flaky_status(issues: list[Item], now: datetime) -> tuple[int, int]:
    """M12: open flaky-test issues, and how many are older than 7 days."""
    open_flaky = [
        issue for issue in issues if issue.get("state") == "OPEN" and "flaky" in label_names(issue)
    ]
    old = [i for i in open_flaky if now - parse_time(i["createdAt"]) > timedelta(days=7)]
    return len(open_flaky), len(old)


def coverage_band(percent: float) -> str:
    """Google's coverage bands, reported only (QA plan 7.3)."""
    if percent >= 90:
        return "exemplary"
    if percent >= 75:
        return "commendable"
    if percent >= 60:
        return "acceptable"
    return "below acceptable"


def mutation_counts(results_text: str) -> Counter[str]:
    """Count mutants by status from `mutmut results --all true` output."""
    counts: Counter[str] = Counter()
    for line in results_text.splitlines():
        if ":" in line:
            counts[line.rsplit(":", 1)[1].strip()] += 1
    return counts


# ---------------------------------------------------------------- GitHub CLI


def gh_available() -> bool:
    """Whether the GitHub CLI is installed and logged in."""
    if shutil.which("gh") is None:
        return False
    status = subprocess.run(["gh", "auth", "status"], capture_output=True, check=False)
    return status.returncode == 0


def gh_json(*args: str) -> list[Item]:
    """Run a gh command that prints JSON and parse it."""
    result = subprocess.run(["gh", *args], capture_output=True, text=True, check=True)
    data: list[Item] = json.loads(result.stdout)
    return data


def gh_merged_prs() -> list[Item]:
    """Merged PRs into main, newest 500."""
    fields = "number,createdAt,mergedAt,additions,deletions,labels,author,reviews"
    return gh_json(
        "pr", "list", "--state", "merged", "--base", "main", "--limit", "500", "--json", fields
    )


def gh_all_prs() -> list[Item]:
    """All PRs, newest 500, for review latency."""
    fields = "number,createdAt,author,reviews"
    return gh_json("pr", "list", "--state", "all", "--limit", "500", "--json", fields)


def gh_ci_runs(branch: str | None = None, workflow: str = "ci.yml") -> list[Item]:
    """Runs of one workflow, newest 500, optionally on one branch."""
    args = ["run", "list", "--workflow", workflow, "--limit", "500"]
    if branch:
        args += ["--branch", branch]
    fields = "conclusion,status,createdAt,startedAt,updatedAt,event"
    return gh_json(*args, "--json", fields)


def gh_issues() -> list[Item]:
    """Every issue, newest 1000, with the fields the defect metrics need."""
    fields = "number,state,createdAt,closedAt,labels,milestone"
    return gh_json("issue", "list", "--state", "all", "--limit", "1000", "--json", fields)


# ---------------------------------------------------------------- local files


def python_coverage() -> str:
    """Python line coverage from coverage.xml, with its band."""
    path = ROOT / "coverage.xml"
    if not path.exists():
        return "not run (make test-python)"
    rate = float(ET.parse(path).getroot().attrib["line-rate"]) * 100  # noqa: S314
    return f"{rate:.1f}% ({coverage_band(rate)})"


def frontend_coverage() -> str:
    """Front-end line coverage from the Vitest summary, with its band."""
    path = ROOT / "frontend" / "coverage" / "coverage-summary.json"
    if not path.exists():
        return "not run (make test-frontend)"
    rate = float(json.loads(path.read_text(encoding="utf-8"))["total"]["lines"]["pct"])
    return f"{rate:.1f}% ({coverage_band(rate)})"


def below_grade_a() -> str:
    """Python modules radon does not grade A for maintainability index."""
    radon = shutil.which("radon") or str(ROOT / ".venv" / "bin" / "radon")
    result = subprocess.run(
        [radon, "mi", "-j", str(ROOT / "backend" / "app")],
        capture_output=True,
        text=True,
        check=True,
    )
    grades = json.loads(result.stdout)
    lower = [
        f"{Path(name).relative_to(ROOT)} ({info['rank']})"
        for name, info in grades.items()
        if info.get("rank") != "A"
    ]
    return ", ".join(lower) if lower else f"none; all {len(grades)} modules grade A"


def mutation_summary() -> str:
    """Latest mutmut results, if `make mutation` has run."""
    backend = ROOT / "backend"
    mutmut = str(Path(shutil.which("mutmut") or ROOT / ".venv" / "bin" / "mutmut").resolve())
    if not (backend / "mutants").exists():
        return "not run this month (make mutation)"
    result = subprocess.run(
        [mutmut, "results", "--all", "true"],
        cwd=backend,
        capture_output=True,
        text=True,
        check=False,
    )
    counts = mutation_counts(result.stdout)
    total = sum(counts.values())
    return f"{total} mutants: {counts['killed']} killed, {counts['survived']} survived"


# ---------------------------------------------------------------- report


def fmt(value: float | None, unit: str = "", digits: int = 1) -> str:
    """Format a number, or say there was no data."""
    return "no data" if value is None else f"{value:.{digits}f}{unit}"


def github_rows(month: str, now: datetime) -> list[tuple[str, str]]:
    """Rows computed from GitHub, or n/a rows when the CLI is not available."""
    names = [
        "M1 Deployment frequency (merges to main per week)",
        "M2 Change lead time, median",
        "M3 Change fail rate",
        "M4 Failed deployment recovery time (longest red period on main)",
        "M5 Deployment rework (hotfix PRs)",
        "M6 Escaped defects opened this month",
        "M7 Open defects by severity",
        "M8 Overdue fixes (P1 over 2 days, P2 past milestone)",
        "M9 Build health: times main went red, hours red",
        "M10 Review latency, median to first review",
        "M11 CI duration, median",
        "M12 Open flaky tests (over 7 days old)",
        "PR size, median changed lines (reported only)",
    ]
    if not gh_available():
        return [(name, NA) for name in names]
    merged, all_prs, issues = gh_merged_prs(), gh_all_prs(), gh_issues()
    main_runs = gh_ci_runs("main") + gh_ci_runs("main", "nightly.yml")
    all_runs = gh_ci_runs()
    periods = [
        (start, hours)
        for start, hours in red_periods(main_runs, now)
        if start.strftime("%Y-%m") == month
    ]
    flaky_open, flaky_old = flaky_status(issues, now)
    rate = change_fail_rate(merged, month)
    values = [
        fmt(merges_per_week(merged, month)),
        fmt(median_lead_time(merged, month), " business days"),
        "no data" if rate is None else f"{rate:.0%}",
        fmt(max((hours for _, hours in periods), default=None), " hours"),
        str(hotfix_count(merged, month)),
        dict_text(escaped_by_severity(issues, month)),
        dict_text(open_by_severity(issues)),
        ", ".join(f"#{n}" for n in overdue_fixes(issues, now)) or "none",
        f"{len(periods)} times, {sum(hours for _, hours in periods):.1f} hours",
        fmt(median_review_latency(all_prs, month), " business days"),
        fmt(median_ci_minutes(all_runs, month), " minutes"),
        f"{flaky_open} ({flaky_old})",
        fmt(median_pr_size(merged, month), "", 0),
    ]
    return list(zip(names, values, strict=True))


def dict_text(counts: Counter[str]) -> str:
    """Format severity counts as S1 0, S2 1, ..."""
    return ", ".join(f"{level} {counts[level]}" for level in SEVERITIES)


def main() -> None:
    """Print the automatic rows of the monthly report as Markdown tables."""
    now = datetime.now(UTC)
    month = sys.argv[1] if len(sys.argv) > 1 else now.strftime("%Y-%m")
    print(f"Generated {now:%Y-%m-%d %H:%M} UTC by scripts/qa_report.py for {month}\n")
    print("| Metric (QA plan 7.1 and 7.2) | Value |")
    print("| --- | --- |")
    for name, value in github_rows(month, now):
        print(f"| {name} | {value} |")
    print("\n| Reported only, never a gate | Value |")
    print("| --- | --- |")
    print(f"| Python line coverage | {python_coverage()} |")
    print(f"| Front-end line coverage | {frontend_coverage()} |")
    print("| C++ line coverage | see the gcovr summary on the latest CI run |")
    print(f"| Mutation testing (backend/app) | {mutation_summary()} |")
    print(f"| Maintainability index below grade A | {below_grade_a()} |")


if __name__ == "__main__":
    main()

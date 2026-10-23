# Issue #3: Home page shows the greenhouse location and hours

Filed as GitHub issue #3 in D5, labeled `feature` and `good first issue`. This is the first task
for a new developer (QA plan 9.5): small enough to finish and open as a PR on day one.

## Why

Q2 (QA plan 2.1): a visitor finds the hours and location within 3 clicks of the home page. On
the home page itself is 0 clicks.

## Acceptance criteria

- **Given** a visitor on the home page, **when** the page loads, **then** a section headed
  "Visit the greenhouse" shows the street address, a "Get directions" link that opens a map, and
  the opening hours for each day of the week.
- **Given** the greenhouse staff change the hours, **when** they edit
  `frontend/src/content/visit.json` and the change merges, **then** the home page shows the new
  hours with no code change.
- **Given** a keyboard-only visitor, **when** they press Tab from the top of the page, **then** the
  "Get directions" link receives focus with a visible outline, and a screen reader reads the
  section heading and each day's hours as text, not as an image.
- **Given** a day the greenhouse is closed, **when** that day is shown, **then** it reads "Closed".

## Done when

Every item in docs/DEFINITION_OF_DONE.md is met, including a Vitest test of the section and a
CHANGELOG line. The address and hours are placeholders until the sponsor confirms them; the PR
says so.

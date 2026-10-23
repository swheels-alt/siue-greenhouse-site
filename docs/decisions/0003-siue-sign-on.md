# 0003: SIUE sign-on integration

Status: Proposed
Date: 2026-10-23
Author: Dane Niblett, with SIUE ITS
Approved by:

## Context

Faculty, staff and the reservation reviewer log in with SIUE accounts. Public pages and the tour
form need no login. We need the sign-on protocol ITS supports, how roles reach the app, and
test accounts for staging (D3).

## Decision

Pending the ITS answer. Until then, local development uses the dev login stub, which works only
when APP_ENV=local.

## Consequences

To be written when accepted. Update backend/app/auth/ and the route allow-list tests.

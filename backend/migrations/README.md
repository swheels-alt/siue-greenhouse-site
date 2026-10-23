# Migrations

Schema changes happen only through migration files committed here (QA plan 3.1). Nobody runs
ALTER by hand on a shared database. CI runs upgrade, downgrade, then upgrade again on every PR.

The migration tool comes with the web framework chosen in ADR 0001 (D1). This folder is a
protected path: changes need two approvals (QA plan 3.4).

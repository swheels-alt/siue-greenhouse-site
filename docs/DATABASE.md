# Database

MySQL, version matched to what SIUE ITS runs (`docker-compose.yml` uses 8.4 locally).

## Rules (QA plan 3.1)

- Schema changes only through committed migration files in `backend/migrations/`.
- snake_case, singular table names: `plant`, `reservation`, `tour_request`.
- Every table has `id`, `created_at` and `updated_at`; every foreign key is indexed.
- Tour requesters' name, email and phone live only in `tour_request` and are never logged.
- Every migration can be rolled back; CI runs upgrade, downgrade, upgrade on every PR.

## Tables

The ER diagram and table list are added here with the first migration, after ADR 0001 picks
the framework and its migration tool.

## Writing a migration

Steps are added with ADR 0001. Until then, no schema exists.

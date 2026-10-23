# Deploy and rollback

The staging and production targets are set in ADR 0002 with SIUE ITS (D2). Until then a merge to
`main` does not deploy anywhere: `.github/workflows/deploy.yml` only prints a notice, and the CI
checks on the PR are the last automated gate (docs/DEBT.md).

## Rules that apply once ADR 0002 is accepted (QA plan 4.1 and 11.3)

- Every merge to `main` deploys to staging (gate G4); production deploys happen only at a release
  (G5).
- The deploy script takes a database backup before every deploy.
- Rollback: redeploy the previous tag. If a migration ran, run its downgrade, or restore the
  pre-deploy backup.
- Deploys are done in pairs, and every credential is held by at least two people (R8).
- Secrets live in GitHub Actions secrets and on the server, never in this repository.

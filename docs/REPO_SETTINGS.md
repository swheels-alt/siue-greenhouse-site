# Repository settings

Steps for Dane (backup: Sam) after creating the repository in the department's GitHub
organization (D4). Settings that GitHub stores outside the code are recorded here so they can be
rebuilt.

**Public or private.** We recommend a public repository. On GitHub Free, branch rulesets (step 2)
are enforced only on public repositories, and CodeQL code scanning (step 5) is free only on public
repositories; a private repository needs a paid plan (Team, plus GitHub Code Security for CodeQL)
for the same protection. The code holds no secrets or personal data (gitleaks and the review
checklist enforce this), so public costs us nothing.

1. **Push this starter repository** as the first commit on `main`.
2. **Apply the branch ruleset** in `.github/rulesets/main.json`:

   ```bash
   gh api repos/OWNER/REPO/rulesets --method POST --input .github/rulesets/main.json
   ```

   It blocks direct pushes (admins too), requires 1 approval, code owner review, resolved
   threads, squash merges, and these checks: fast-checks, backend-tests, cpp, frontend-tests,
   fresh-setup, e2e, protected-paths. CodeQL is deliberately not a required check.
3. **Put real usernames in `.github/CODEOWNERS`** in place of the placeholder handles
   (docs/DEBT.md).
4. **Create the labels** in `.github/labels.yml`, for example:

   ```bash
   gh label create "severity:S1" --color b60205 --description "Critical"
   ```

5. **Turn on** Dependabot alerts and security updates. On a public repository, also turn on code
   scanning; `.github/workflows/codeql.yml` skips itself on a private one.
6. **Set auto-assigned reviewers** for the team: round robin, 1 reviewer per PR. The reviewer of
   the week (docs/ROTATION.md) covers any PR with no review after 1 business day.
7. **Create the project board** with columns Backlog, Ready, In progress, In review, Done.
8. **When the first real page template exists**, Matthew sets the repository variable
   `E2E_ENABLED` to `true` so the browser and Lighthouse checks run on every PR.
9. **Set the repository variables `QA_LEAD` and `QA_LEAD_BACKUP`** to the GitHub usernames of the
   QA lead (Sam Wheeler) and the QA lead's backup (Yahir Romero). The protected-paths check uses
   them: a change to docs/QA_PLAN.md or docs/DEFINITION_OF_DONE.md needs an approval from the QA
   lead or the backup, whichever did not write the PR, so it works while one is away. Update
   both at handoff.

Known follow-ups are in [DEBT.md](DEBT.md).

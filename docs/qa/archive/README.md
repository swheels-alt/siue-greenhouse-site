# Archive

Index of the exports made at each release and at handoff (QA plan 8). The exports themselves are
not committed here, so the history is not copied into the repository again at every release:
they are attached as assets to that version's GitHub Release and copied to the Biology
department's folder named in docs/HANDOFF.md. Commands:

```bash
gh issue list --state all --limit 1000 --json number,title,labels,state,createdAt,closedAt > issues-vX.Y.Z.json
```

```bash
git bundle create greenhouse-site-vX.Y.Z.bundle --all
gh pr list --state all --limit 1000 --json number,title,author,reviews,state,createdAt,mergedAt > prs-vX.Y.Z.json
gh release upload vX.Y.Z greenhouse-site-vX.Y.Z.bundle prs-vX.Y.Z.json issues-vX.Y.Z.json
```

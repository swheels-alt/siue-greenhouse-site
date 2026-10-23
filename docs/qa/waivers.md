# Gate waivers and security exceptions

A gate can be waived only for a release, never for one PR's CI. A waiver needs the QA lead, one
other team member and, for any S1 or S2, the sponsor, all in writing (QA plan 11.2).

| Date | Gate or finding | Reason | Approved by | Expires |
| --- | --- | --- | --- | --- |
| 2026-10-23 | Security exception, M15: Lighthouse CI (`@lhci/cli` 0.15.1, the latest) depends on packages with High advisories (extract-zip, tmp, basic-ftp, and others), and extract-zip has no fixed release | It runs only inside CI against a local build, never on a server or in the shipped site. It was removed from `e2e/package-lock.json` and is run pinned with `npx @lhci/cli@0.15.1` in the e2e job, so `npm audit` stays a clean gate for everything we ship | Pending: Sam Wheeler (QA lead) and Dane Niblett (security owner) | When `@lhci/cli` releases a version without High advisories, or January 2027 tool review |

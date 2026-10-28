# QA certification — Gate Q PASS

**Decision: Gate Q PASS for the scoped minimal local starter.**

Decision authority: **JARVIS, QA Lead**, as communicated by the Director in this conversation. Recorded on 2026-10-28 following independent Q2 evidence review. This document records JARVIS's decision; it does not extend the tested scope.

## Exact certified candidate

- Repository: `/home/moose/nextjs/web-factory-nextjs-starter-v1`
- Branch: `feat/minimal-web-starter`
- HEAD: `6b4b761995483b260f72259ae3102325d9e8ef54`
- **Tested working-tree fingerprint:** `323ae21c9f3aaa7823382c5e41e675f8e167af43b163da9d1960218f284b02e9`
- **Fingerprint reverified before certification:** identical; all 16 input hashes and the path set match Q2, with no added, removed or changed included input.
- Verification recorded at: `2026-10-28T09:17:00.181722+00:00`.
- Lockfile SHA-256: `a4db1b8de41f412581f7af81216060cc6e2ff1c64bed27c9a365df7bf614e279`.

**HEAD alone is not the certified candidate.** The tested working tree includes the uncommitted dependency repair: Next.js and eslint-config-next 16.4.3, Next resolving PostCSS 8.5.23 and Sharp 0.35.5, and the corresponding lockfile/configuration state. React/React DOM remain 19.2.4 and Tailwind remains 3.4.19. Certification attaches to the fingerprinted working-tree inputs, not to the older dependency state in HEAD or arbitrary later branch contents.

The fingerprint follows Q1: SHA-256 per file, sorted relative paths, manifest lines `<hash><two spaces><path>\n`, then SHA-256 of that UTF-8 manifest. It covers source, configuration, tests, local image, package manifests/lockfile, README and ignore rules. Secrets, dependencies, build/cache/browser output, QA/engineering reports and generated `next-env.d.ts` are excluded; generated type changes were separately recorded during Q2. The exact file manifest is linked below. QAM documentation changes do not alter this fingerprint. Later changes to included inputs require a QA impact review before this certification is applied to the changed candidate.

## Approved evidence and result

- [Q1 recon and approved test plan](QA_Q1_PLAN.md)
- [Independent Q2 results](QA_Q2_RESULTS.md)
- [Q2 evidence directory](evidence/qa-q2/20261028T081836Z/)
- [Candidate identity](evidence/qa-q2/20261028T081836Z/candidate.json)
- [Before fingerprint manifest](evidence/qa-q2/20261028T081836Z/fingerprint-before.sha256) and [after manifest](evidence/qa-q2/20261028T081836Z/fingerprint-after.sha256)
- [Command results and exit codes](evidence/qa-q2/20261028T081836Z/commands.jsonl)
- [Full npm audit](evidence/qa-q2/20261028T081836Z/audit.log)
- [Preservation evidence](evidence/qa-q2/20261028T081836Z/preservation.json) and [cleanup evidence](evidence/qa-q2/20261028T081836Z/cleanup-final.json)

Q2 recorded **12 PASS, 0 FAIL, 0 BLOCKED**, with fresh clean installation, full audit including development dependencies, lint, typecheck, production build, the existing two browser tests, additional independent browser checks and a development smoke check. The full npm audit reported **zero vulnerabilities at every severity**. The initial QA locator error was corrected in the QA driver and its affected scenario passed on rerun; no product repair was made during QA. Screenshots were personally inspected. Original work was preserved and QA-owned servers were stopped.

## Certified scope and limitations

Certified scope: a reusable minimal **local POC starter** using Next.js App Router, React, TypeScript and Tailwind 3; typed local content and local SVG; responsive homepage, section navigation, mobile disclosure and basic keyboard behavior; local development/production commands and reproducible dependency installation.

Execution environment: **Node v26.7.0, npm 11.19.0, Playwright 1.59.1, Chromium 147.0.7727.15**. Coverage used Chromium desktop and emulated mobile, with breakpoint/narrow-width checks. This is not certification across other Node versions, browser engines or physical devices, nor a comprehensive accessibility audit. The existing host/browser fallback limitation remains; Q2's installed browser launched successfully without a new workaround. Non-failing ESLint support, install-script policy, Node deprecation and color-environment warnings remain documented in Q2. Zero npm findings are a point-in-time audit result.

**Deployment, cloud hosting, production operations and the actual Cyberize website are outside this certification.** Payload, Supabase, authentication, payments and shared CMS are also outside this POC scope; their absence is not a defect.

This recording changed only `QAM/QA_CERTIFICATION.md` and `QAM/README.md`. No product inputs, dependencies or services were changed, and no commit, push or merge was performed.

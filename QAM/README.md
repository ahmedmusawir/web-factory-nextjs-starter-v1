# Independent QA status

**Q1: APPROVED by JARVIS. Q2: COMPLETE — 12 PASS, 0 FAIL, 0 BLOCKED. Gate Q: PASS by JARVIS for the scoped minimal local starter.**

The QA Lead decision, exact certified candidate and limitations are recorded in [QA_CERTIFICATION.md](QA_CERTIFICATION.md). This decision supersedes pending-QA status in earlier engineering handoffs; those historical reports and evidence remain preserved.

## Certified candidate

- Branch: `feat/minimal-web-starter`
- HEAD: `6b4b761995483b260f72259ae3102325d9e8ef54`
- Tested working-tree fingerprint: `323ae21c9f3aaa7823382c5e41e675f8e167af43b163da9d1960218f284b02e9`

The product inputs were rehashed before certification and match Q2 exactly. **HEAD alone omits the uncommitted dependency repair.** Certification applies to the fingerprinted working tree containing Next.js/eslint-config-next 16.4.3 and its repaired lockfile. Changes to product inputs require QA impact review.

## Acceptance checklist

- [x] Q1 independent recon/test plan and QA Lead approval.
- [x] Q2 independent clean install, dependency consistency, full npm audit, lint, typecheck, build and browser checks.
- [x] Homepage, metadata, landmarks and local image render without required secrets/backend/external fonts.
- [x] Skip link, visible focus, desktop anchors, mobile open/close/selection, Escape focus return and ARIA behavior.
- [x] No observed horizontal overflow in desktop/mobile and narrow/breakpoint checks.
- [x] Documented dev/production scripts operate on default port 3001; unrelated services preserved.
- [x] Approved stack, typed local content, README and POC exclusions retained.
- [x] Evidence reviewed by JARVIS; Gate Q PASS recorded.

## Reports and evidence

- [Q1 plan](QA_Q1_PLAN.md)
- [Q2 independent execution report](QA_Q2_RESULTS.md)
- [Independent evidence: run 20261028T081836Z](evidence/qa-q2/20261028T081836Z/) — command exit codes, full audit, screenshots, browser observations, source fingerprints and cleanup.
- [Engineering E2 handoff](../agent_docs/RESPONSES/STARTER_E2_HANDOFF.md) and [dependency repair](../agent_docs/RESPONSES/STARTER_DEPENDENCY_REPAIR.md) — historical engineering self-checks, distinct from independent Q2 evidence.

Q2 ran in an isolated candidate copy and preserved engineering evidence. Its full audit, including development dependencies, reported zero vulnerabilities. Future checks should retain their own evidence and reverify candidate identity; do not overwrite or relabel this certified run.

## Revalidation commands

Use an isolated copy of the actual candidate as described in Q1. Check ports before startup; preserve any existing preview and stop only processes you start.

```sh
npm ci
npm ls --depth=0
npm audit --include=dev
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The matching Chromium browser must be installed; `npx playwright install chromium` is the documented setup command when needed. Separately smoke-check `npm run dev` and the homepage. Do not install host packages or stop other services. The existing Playwright configuration uses 3001; Q1 describes isolated alternate-port execution if it is occupied.

## Certification limits

Tested on Node v26.7.0 / npm 11.19.0 and Playwright 1.59.1 / Chromium 147.0.7727.15, using desktop and emulated mobile. No broader runtime/browser/physical-device matrix or comprehensive accessibility certification is implied. Non-failing tooling warnings and the browser host limitation are recorded in Q2; audit findings are point-in-time.

**Deployment and the actual Cyberize website are outside this certification.** Payload, Supabase, login, payments and shared CMS remain outside the minimal local starter's POC scope.

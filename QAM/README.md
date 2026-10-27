# Independent QA handoff

**Q1: NOT RUN. Q2: NOT RUN. Gate Q: NOT RUN.**

Engineering self-checks are recorded in `../agent_docs/RESPONSES/STARTER_E2_HANDOFF.md`; they are not independent QA. The Director's shot-2 correction supersedes E1's QA timing: Q1 begins after engineering handoff and includes independent recon/test planning and QA Lead approval; Q2 is independent execution after that approval.

## Acceptance checklist

- [ ] Q1: independently inspect the implementation, dependency/audit limitations and smoke coverage; produce the test plan and obtain QA Lead approval.
- [ ] Q2: independently run clean install, lint, typecheck, production build and desktop/mobile browser checks.
- [ ] Homepage title, main heading, header/main/footer and local image render without page errors or required secrets/network content.
- [ ] Skip link, visible keyboard focus, desktop anchors and mobile toggle/ARIA state, Escape focus return and selection-close work.
- [ ] No horizontal overflow on desktop/mobile, with mobile menu open and closed.
- [ ] Both server modes default to 3001; occupied ports are not reused and unrelated processes are untouched.
- [ ] Exact approved direct pins, generated lockfile, Tailwind 3, local typed content, clear README and POC exclusions are retained.
- [ ] Record independent results and defects; obtain the independent Gate Q decision.

## Commands and evidence

Run from the repository root, with port 3001 free:

```sh
npm ci
npm ls --depth=0
npm audit
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Separately run `npm run dev`, request http://localhost:3001, then stop only that process. Do not install host packages or stop other services.

Engineering evidence: `QAM/evidence/*.log`, `QAM/evidence/audit.json`, `QAM/evidence/direct-versions.json`, and desktop/mobile PNGs. Latest browser report: `playwright-report/index.html`; failure artifacts: `test-results/`. Re-running tests refreshes browser evidence. Independent QA should retain its own results separately and must not relabel engineering evidence as independent execution.

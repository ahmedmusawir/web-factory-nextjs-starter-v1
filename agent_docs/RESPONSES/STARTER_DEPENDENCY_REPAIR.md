# Dependency repair — final verification

Date: 2026-10-27. **Engineering verification complete; independent Q1, Q2 and Gate Q remain NOT RUN.**

## Repository and preserved work

- Root: `/home/moose/nextjs/web-factory-nextjs-starter-v1`
- Branch: `feat/minimal-web-starter` (unchanged)
- HEAD: `6b4b761995483b260f72259ae3102325d9e8ef54`
- The repair originally began with a clean tree. This final verification began with the existing uncommitted repair changes listed below; all were preserved. Only this report was edited during final verification.
- Runtime used for the saved checks: Node `v26.7.0`, npm `11.19.0`. No runtime, feature or design changes.

## Versions and advisory disposition

| Package/path | Before | Final |
| --- | --- | --- |
| next | 16.2.12 | 16.4.3 |
| eslint-config-next | 16.2.12 | 16.4.3 |
| Next → PostCSS | nested 8.4.31 | root 8.5.23, deduplicated |
| Direct PostCSS | 8.5.23 | 8.5.23 unchanged |
| Next → Sharp | 0.34.5 | 0.35.5 |
| Linux x64 Sharp libvips package | 1.2.4 | 1.3.4 |

React/React DOM 19.2.4, Tailwind 3.4.19 and all other direct pins remain unchanged. The vulnerable nested PostCSS entry is absent from both lockfile and installation. Next resolves the repaired PostCSS/Sharp paths; Sharp's public runtime reports 0.35.5 and libvips 8.18.7. No overrides, force fixes or legacy peer resolution were used.

Registry manifests and every reported advisory range were checked during repair. The replacements exclude all original reported ranges, and the complete post-repair audit confirms the actual installed dependency resolution. Before: **1 critical + 2 high vulnerable packages**. Final saved npm audit: **0 critical, 0 high, 0 moderate, 0 low, 0 info; total 0**.

Detailed advisory URLs/ranges/dispositions remain in `QAM/evidence/dependency-repair/advisory-check.json`; registry metadata is in `registry.json`, before/after audits in `audit-before.json` and `audit-after.json`, and resolved paths in `paths.log`. The historical E2 audit/report are preserved.

## Final check results

The user authorized reuse of checks already passed after the final dependency change. All six saved results below were verified and reused; they were **not rerun in this final verification turn**. Their logs postdate the final lockfile update. Every direct version in the current manifest, lockfile and installation matches `direct-versions.json`; app code, test specs and validation configuration are unchanged from HEAD. The prior tool execution records confirm these exit codes.

Evidence paths below are relative to `QAM/evidence/dependency-repair/`.

| Actual command | Exit | Result | Evidence |
| --- | --- | --- | --- |
| `npm ci --cache /tmp/stark-starter-npm-cache --fetch-retries=0` | 0 | Clean install; 388 packages added, 389 audited | `ci.log` |
| `npm audit --json --cache /tmp/stark-starter-npm-cache --fetch-retries=0` | 0 | Zero vulnerabilities at all severities | `audit-after.json` |
| `npm run lint` | 0 | `eslint . --max-warnings=0` passed | `lint.log` |
| `npm run typecheck` | 0 | `next typegen && tsc --noEmit` passed | `typecheck.log` |
| `npm run build` | 0 | `next build` passed using Next 16.4.3; static homepage/not-found | `build.log` |
| `npm run test:e2e` | 0 | `playwright test`: desktop and mobile, **2 passed**, 4.7 seconds | `e2e.log`, `desktop.png`, `mobile.png` |

Also confirmed the current dependency consistency, absence of the vulnerable nested copy, unchanged application/test files and `git diff --check` (exit 0). Lockfile SHA-256: `a4db1b8de41f412581f7af81216060cc6e2ff1c64bed27c9a365df7bf614e279`.

Reviewed `tests/home.spec.ts` and the actual Playwright config: desktop homepage/title/landmarks and section navigation; mobile keyboard opening, button closing, selection closing and navigation; Tab/Enter skip link, Escape and focus return to the menu button; local image visibility and nonzero natural width; no page errors and no horizontal overflow closed/open are covered by the passing tests.

The saved browser run used a free port 3001 with `reuseExistingServer: false`, and stopped its own production server (`cleanup.log`). No server was started, reused, stopped or otherwise touched in this final verification. Tony's preview was left alone. Latest generated browser report: `playwright-report/index.html` (ignored).

## Limitations and preview

No unresolved reported npm vulnerabilities or failed required checks. This is a point-in-time audit, not a guarantee against unknown issues. Remaining non-failing warnings: ESLint 9.39.4 unsupported-version notice, unrs-resolver install-script policy notice, Node 26 Playwright deprecation and color-environment warnings. The previously documented Chromium host fallback limitation remains. Other Node versions/browser engines and independent QA have not been tested. No broader repair was needed.

Tony's development preview commands (if his preview is already running, use it without starting another):

```sh
cd /home/moose/nextjs/web-factory-nextjs-starter-v1
npm run dev -- --hostname 127.0.0.1
```

Open **http://127.0.0.1:3001**. For production preview, when port 3001 is free:

```sh
cd /home/moose/nextjs/web-factory-nextjs-starter-v1
npm run build
npm run start -- --hostname 127.0.0.1
```

## Final git status

```text
 M QAM/README.md
 M README.md
 M next-env.d.ts
 M package-lock.json
 M package.json
?? QAM/evidence/dependency-repair/
?? agent_docs/RESPONSES/STARTER_DEPENDENCY_REPAIR.md
```

Changes comprise the two direct pins/lockfile, Next-generated route/root-params type imports, README/QAM evidence pointers, repair evidence and this report. Application/content/assets, tests, original evidence and E1/E2 reports remain unchanged. No commit, push, merge or deployment was performed.

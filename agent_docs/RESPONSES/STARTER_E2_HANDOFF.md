# Starter E2 — engineering handoff

Date: 2026-10-27. Branch: `feat/minimal-web-starter`. Implementation and engineering self-checks complete. **Q1 NOT RUN; Q2 NOT RUN; Gate Q NOT RUN.** No commit, push, merge or deployment.

## Built

A small Next.js App Router homepage with React, TypeScript and Tailwind 3/PostCSS/Autoprefixer. Includes typed local branding/navigation/hero/feature content, a local SVG illustration, responsive header/main/footer, section links, a keyboard-accessible mobile menu, Escape focus return, selection-close behavior, metadata, skip link and visible focus. Uses system fonts; no external font downloads, secrets or environment variables are required to view it.

The README documents install, preview, checks and edit locations. Playwright checks desktop (1440×900) and mobile (375×812) against a production server. `QAM/README.md` contains the minimal acceptance checklist, commands, evidence locations and corrected independent QA sequence: Q1 independent recon/test plan plus QA Lead approval, then Q2 independent execution.

No Supabase, Payload, authentication, Stripe, database, CMS, role portals, deployment integration, theme/state framework or unused UI dependencies. Payload/Supabase is deferred, not abandoned. Both server scripts default to port 3001.

## Repository and dependencies

Confirmed root `/home/moose/nextjs/web-factory-nextjs-starter-v1`, origin `https://github.com/ahmedmusawir/web-factory-nextjs-starter-v1.git`, initial branch `main`, HEAD `a5ffd44`. Initial status had only the expected untracked E1 report; no unexpected user changes. E1 was preserved unchanged. Created the requested feature branch (the sandbox initially denied writing `.git`; the authorized retry succeeded).

Runtime used: **Node v26.7.0, npm 11.19.0**. Node installation unchanged. Generated npm lockfile, verified clean `npm ci`, and inspected the full dependency tree with no invalid/missing peer errors. Actual installed direct versions all match approved exact pins:

| Package | Resolved version |
| --- | --- |
| next / eslint-config-next | 16.2.12 |
| react / react-dom | 19.2.4 |
| typescript | 5.9.3 |
| tailwindcss | 3.4.19 |
| postcss | 8.5.23 |
| autoprefixer | 10.6.2 |
| eslint | 9.39.4 |
| @types/node | 20.19.43 |
| @types/react / @types/react-dom | 19.2.2 |
| @playwright/test | 1.59.1 |

No dependency-pin departures, overrides, `--force` or `--legacy-peer-deps` were used. npm warned that ESLint 9.39.4 is unsupported and that sharp/unrs-resolver install scripts were not approved by npm's install-script policy; no policy bypass was applied. Lint, build and browser checks succeeded with the installed native packages.

## Executed checks and real results

Commands below ran from the repository root. Logs are in `QAM/evidence/`.

| Command/check | Actual result | Evidence |
| --- | --- | --- |
| `npm install --fetch-retries=0 --cache /tmp/stark-starter-npm-cache` | Exit 0; lockfile generated. Original sandbox install stalled on network access and was stopped, including its remaining task-owned child. | `install.log` |
| `npm ci --cache /tmp/stark-starter-npm-cache --fetch-retries=0` | Exit 0; 387 packages added, 388 audited. | `ci.log` |
| `npm ls --depth=0 --json` / `npm ls --all` | Exit 0; exact direct versions verified against manifest and lockfile, no peer resolution errors. | `direct-versions.json`, `dependency-tree.log` |
| `npm audit --json --cache /tmp/stark-starter-npm-cache --fetch-retries=0` | Exit 1: 1 critical and 2 high vulnerable package findings; unresolved. | `audit.json` |
| `npm run lint` | Final exit 0. Initial anonymous PostCSS config export warning fixed with a named config variable. Rerun after final test edit passed. | `lint.log`, `lint-initial.log` |
| `npm run typecheck` | Exit 0; Next route types generated and TypeScript passed, including final rerun. | `typecheck.log` |
| `npm run build` | Exit 0; homepage and not-found page statically prerendered. Initial sandbox attempt failed because Turbopack could not bind its internal socket; authorized execution passed. | `build.log`, `build-sandbox.log` |
| `npx playwright install chromium` | Final exit 0 after archive-extraction workaround described below. | `browser-install-verified.log`, `browser-install-fallback.log` |
| `npm run test:e2e` | Final exit 0: **2 passed** (desktop/mobile), 4.3 seconds. Initial desktop passed; mobile test's changing button-name locator failed. Fixed test locator; both then passed. | `e2e.log`, `e2e-initial.log` |
| `npm run dev -- --hostname 127.0.0.1` plus HTTP request | Served expected homepage with HTTP 200 on 3001; only this check's process group was stopped in cleanup. | `dev-smoke.log`, `dev-server.log` |
| `git diff --check` | Exit 0. | Engineering terminal output |
| Final host process/port inspection | No task-owned server/installer remains; no TCP listener on 3001. | `process-cleanup.log` |

Smoke assertions cover title, heading, landmarks, image load, keyboard skip link, section navigation/CTA/back-to-top, mobile keyboard open, toggle-close, Escape focus return, selection-close, ARIA expanded state, no page errors, and no horizontal overflow closed/open. Reviewed full-page screenshots at `QAM/evidence/desktop.png` and `QAM/evidence/mobile.png`. The latest interactive browser report is `playwright-report/index.html` (ignored generated output); `test-results/` is also ignored and contains the latest run state. Initial failure details remain in the initial log; failure traces are generated on future failures. These are engineering self-checks, not independent QA or a comprehensive accessibility audit.

## Audit findings and limitations

The audit identifies **Next 16.2.12 as critical**, **Next's nested PostCSS 8.4.31 as high**, and **Sharp 0.34.5 as high**. Direct PostCSS 8.5.23 does not replace Next's nested copy. The Next finding includes RCE, cache poisoning, disclosure, SSRF and denial-of-service advisories; applicability varies by platform/features, and this check does not establish that the starter is immune. Full affected ranges, advisory URLs and paths are retained in `audit.json`.

npm recommends **Next 16.4.3** as remediation. That would depart from the explicitly approved exact pin; review updating **both next and eslint-config-next to 16.4.3**, regenerate the lockfile, then repeat audit and engineering/independent QA. No upgrade or broad override was silently applied. The dependency security limitation remains unresolved and must be addressed before public deployment. No other material stack departure was necessary for local implementation/validation.

Browser environment limitation: Playwright reports this host OS is unsupported and uses its Ubuntu 24.04 fallback. Its standard Chromium installer downloaded but stalled extracting an archive; a retry with process-local `UV_USE_IO_URING=0` stalled too. Stopped only verified task-owned installer PIDs. Downloaded the official **147.0.7727.15 / revision 1217** Chromium and headless-shell archives specified by Playwright 1.59.1, verified ZIP integrity, extracted with the existing `unzip` utility, verified binary versions, and completed the cache markers only after successful extraction. A subsequent unmodified `npx playwright install chromium` passed; both browser tests passed. Initial/retry logs are `browser-install-initial.log` and `browser-install.log`; fallback details are in `browser-install-fallback.log`. No system packages, sudo, Node change or application environment requirement was introduced. Other hosts should try the normal documented installer first.

Node 26 emitted a Playwright `module.register()` deprecation warning; color-environment warnings also appeared. Neither failed the tests. Only the installed Node and Chromium configuration was exercised; Node 22 and other browser engines were not independently tested.

## Changed files and preview

Modified: `README.md`.

Added: `.gitignore`; `package.json`, `package-lock.json`; `tsconfig.json`, generated `next-env.d.ts`; `eslint.config.mjs`, `postcss.config.mjs`, `tailwind.config.ts`; `app/layout.tsx`, `app/page.tsx`, `app/globals.css`; `components/site-header.tsx`; `content/site.ts`; `public/images/starter.svg`; `playwright.config.ts`, `tests/home.spec.ts`; `QAM/README.md`, `QAM/evidence/` logs/JSON/screenshots; this handoff. E1 remains an existing untracked report, unchanged. Generated `node_modules/`, `.next/`, TypeScript cache and browser reports are ignored.

Tony can preview the installed starter with this exact command (first ensure port 3001 is free):

```sh
cd /home/moose/nextjs/web-factory-nextjs-starter-v1 && npm run dev -- --hostname 127.0.0.1
```

Open **http://127.0.0.1:3001**. For the built production preview, substitute `npm run start -- --hostname 127.0.0.1`. Stop only your own preview with Ctrl+C before running tests.

No task-owned servers are left running. Bob, ADK, Hermes and the shared Cyberize workspace were not modified or stopped. Engineering stops here; independent QAM and its QA Lead approval remain pending.

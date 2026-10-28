# Q1 recon and proposed Q2 test plan

2026-10-27 · SOL, QA Executor · QA Lead: JARVIS · Director: Tony

**Status: Q1 recon/plan prepared; awaiting JARVIS approval. Q2 NOT RUN. Gate Q NOT DECIDED.** Engineering logs are claims and historical context, not independent execution evidence. This turn performs source/document/tooling recon only.

## Candidate identity and inputs

Repository: `/home/moose/nextjs/web-factory-nextjs-starter-v1`
Branch: `feat/minimal-web-starter`
HEAD: `6b4b761995483b260f72259ae3102325d9e8ef54`

All requested inputs were found at their specified paths and read. No applicable ancestor or repository `AGENTS.md` was found. README/QAM instructions and the Director's later QA correction govern: Q1 approval precedes Q2; E1's earlier QA timing is superseded.

The candidate includes the working tree, not just HEAD. Current tracked modifications:

```text
 M QAM/README.md
 M README.md
 M next-env.d.ts
 M package-lock.json
 M package.json
```

Relevant untracked material: `agent_docs/RESPONSES/STARTER_DEPENDENCY_REPAIR.md` and `QAM/evidence/dependency-repair/` containing `advisory-check.json`, `audit-after.json`, `audit-before.json`, `build.log`, `ci.log`, `cleanup.log`, `dependency-tree.log`, `desktop.png`, `direct-versions.json`, `e2e.log`, `install.log`, `lint.log`, `mobile.png`, `paths.log`, `registry.json`, `typecheck.log`. These inform recon but are not product inputs or independent evidence. No untracked application/configuration input was found. This plan is the only Q1 write.

Actual diff: Next and matching ESLint config 16.2.12 → 16.4.3; Next's PostCSS 8.4.31 nested entry removed in favor of root 8.5.23; Sharp 0.34.5 → 0.35.5 and associated native packages/libvips 1.2.4 → 1.3.4; Next env/SWC/plugin and related helper entries updated. Generated `next-env.d.ts` switches dev route imports to production route/root-params imports. README/QAM evidence pointers updated. App, content, SVG, CSS, tests and Playwright config have no diff from HEAD. This supports the narrow source-change claim, not runtime success.

Manifest/lockfile inspection: lockfile v3, 448 package records; next/eslint-config-next 16.4.3; React/React DOM 19.2.4; Tailwind 3.4.19; direct PostCSS 8.5.23; locked Sharp 0.35.5. No overrides section. Q2 will independently install and audit this resolution.

## Practical fingerprint

Hash each file's raw bytes using SHA-256. Sort relative paths lexically; format each manifest line as `<sha256><two spaces><path>\n`. SHA-256 of the UTF-8 manifest is **`323ae21c9f3aaa7823382c5e41e675f8e167af43b163da9d1960218f284b02e9`** (16 files).

Included: source, styles, local assets, dependency manifests, configuration, tests, README and ignore rules, including any newly discovered relevant untracked inputs. Excluded: secrets/`.env*`, `.git`, dependencies, caches/build/browser output, QAM reports/evidence, `agent_docs`, and generated `next-env.d.ts`. Preserve and record generated `next-env.d.ts` separately; its regeneration is expected and cannot invalidate the source fingerprint by itself.

```text
8df6c2c2a33b37f6110354009c69591fc6a5774db63143248677ff291e82b2ec  .gitignore
3c047e743850857f786b78c213ac3a33cc6cc7b1ce1341cd34cdf0d520bff83e  README.md
95a416f342711dda1af2ed0a4de1cd54e283126e0c118eef428cea7f0f27f4b9  app/globals.css
e9f5b78dca5ac05c777cd2b9e85bae17387651029e3416064c2f6c4a7c4b7d4e  app/layout.tsx
148b434566a4b9cb6f6952dab75615123645967bc4f9f03e0c6fdb7865e931fa  app/page.tsx
1770ad1ddedafba7d0beb92bbf13ec1ff305825a916924681f0689dd7f7ed9bd  components/site-header.tsx
d1dc0fd89a51c78c7767505cee877e8ce07e61af5b4580f160eb8baae21f1587  content/site.ts
61a8f62d99f957bf381bb5f1bb0fae662331dd76deff97cd7eb5220df9ddee36  eslint.config.mjs
a4db1b8de41f412581f7af81216060cc6e2ff1c64bed27c9a365df7bf614e279  package-lock.json
79963717283fbb32f638e37bb996e917c7f348fb44e8584be632b3f9db6157e3  package.json
5afae2235f74a9298db8633ceb9fe277d4ef5770808107a2cd0ed713e80ab104  playwright.config.ts
367fbca6f16a783112387d94ee7bb91ec72e3b36b6d61228f6247cda6ee46d47  postcss.config.mjs
c67dc9b33f8b6a72a462eea528c565afee0ed464a9107fd77a5b9ba0217b3eab  public/images/starter.svg
d52881b04c0990b826d7ba72655e9ff38e556ab4740c4a267369d268c93d24a8  tailwind.config.ts
f3d2e579e19776d25aee85b78b02c133125d167058f857d3deff5d8c127af296  tests/home.spec.ts
15a1042d528a9dce8929e233e28f7a3523d1078ff6c65e035f6081cd177e2ba0  tsconfig.json
```

Q2 preflight must regenerate the path set and hashes, compare against this manifest, and check branch/HEAD and diff. New/removed relevant files also invalidate the candidate identity. If changed, report the delta and obtain QA Lead review before applying this approval to the new candidate. Recompute after Q2 to detect concurrent edits. Do not read/hash secret contents.

## Acceptance criteria and coverage

Extracted from E1 implementation/validation, E2 handoff, README and the authorized dependency repair:

| Acceptance criterion | Source/coverage observed in Q1 | Q2 acceptance |
| --- | --- | --- |
| Minimal App Router/React/TS/Tailwind 3 with local typed content/image | Small app tree, `content/site.ts`, local SVG, Tailwind/PostCSS config | Clean install/build; content/image render with no required secrets, external fonts or backend |
| Reproducible exact direct pins and repaired dependencies | Manifest/lockfile declare repaired versions | `npm ci`, dependency tree and manifest/lock/installed comparisons agree; original vulnerable paths absent |
| Full audit has zero reported vulnerabilities | Engineering claims zero; not independently verified | Fresh full audit including dev dependencies exits 0 with every severity count 0 |
| Real lint/typecheck/build commands | Scripts perform ESLint, route generation/tsc and Next build | All exit 0; no bypass/force/legacy peers |
| Responsive header/main/footer, section anchors and metadata | Semantic layout, title/description, responsive classes and section IDs | Desktop/mobile render and all visible navigation destinations work |
| Accessible disclosure navigation | Button name/state/controls, selection close, header Escape handler, focus ref | Keyboard/pointer open/close, state and hidden-link tab behavior, Escape focus return, meaningful selection focus |
| Skip link and visible keyboard focus | Skip link CSS and `:focus-visible` rule | Visible on keyboard focus; Enter reaches main; focused controls visibly identifiable |
| Local image and overflow | Existing spec checks naturalWidth and root width | Image 200/natural dimensions; no overflow closed/open; visual screenshot review |
| Working dev/production modes, default 3001 | Actual scripts `next dev -p 3001`, `next start -p 3001` | Isolated startup, HTTP 200, interactive page; preserve any occupied port |
| README and scope | README identifies edit locations; no excluded integrations in source | Follow documented flow; missing Payload/Supabase/login/payment/cloud features are not defects |

Existing `tests/home.spec.ts` is one smoke test run in two Chromium projects (1440×900 and 375×812). It checks title/heading/landmarks, SVG image load, skip focus, anchors/CTA/back-to-top, mobile Enter opening, toggle close, selection close, Escape focus return, ARIA state, page exceptions and root horizontal overflow. Q2 must rerun it independently; prior engineering passes do not satisfy Q2.

Gaps to cover independently: `console.error`/failed responses (spec listens only to `pageerror`), meta description/lang, visible focus appearance and natural Tab order (spec programmatically focuses menu), `aria-controls` target, Space activation, hidden links excluded from Tab sequence, mobile navigation via keyboard and focus after selection, breakpoint transition behavior, and visual inspection. These are missing assertions, **not proven product defects**. The Escape listener is scoped to header; Q2 checks Escape while focus is in its disclosure, and records behavior outside without imposing modal-menu requirements. The menu is a nonmodal disclosure; no focus trap/outside-click contract is required.

## Tooling and safe execution environment

Read-only recon found Node v26.7.0, npm 11.19.0, Python, curl and unzip. Local Playwright/core 1.59.1 and executable Chromium/headless-shell revision 1217 (147.0.7727.15) exist. Binary presence does not prove launch/host-library compatibility. No dedicated interactive-browser tool is available; Q2 will use a separately authored Playwright browser driver with screenshots/DOM observations, beyond the existing spec.

Host TCP snapshot at 2026-10-27 14:30 UTC: 3000 and 8000 occupied; 3001, 3002, 3003 have no listeners. Occupancy is transient. Never touch 3000/8000, Hermes services, or Tony's preview. Do not issue requests to or reuse an occupied starter port.

Q2 will use an isolated `/tmp/stark-qa-q2-<run>/` copy of the fingerprinted candidate (plus the preserved generated types file), not `git archive HEAD`, because the repair is uncommitted. No copying secrets, node_modules or build output. This also prevents clean install/build from disrupting Tony's preview through shared node_modules/.next, and avoids overwriting engineering screenshots. Verify copied input hashes before commands. Source/config files remain unchanged in the original repo.

Set these variables in Q2 only:

```sh
export QA_REPO=/home/moose/nextjs/web-factory-nextjs-starter-v1
export QA_WORK=/tmp/stark-qa-q2-<run>
export QA_EVIDENCE="$QA_REPO/QAM/evidence/qa-q2/<run>"
export QA_PORT=3001
export QA_BASE_URL="http://127.0.0.1:$QA_PORT"
```

`<run>` is a unique UTC timestamp. Record host/runtime, git status/diff, fingerprint manifest, copied file list and chosen port. Network/socket permission may be required for npm/audit/Turbopack/browser execution; record permission denials separately from product failures. No install or server startup is authorized by this Q1 execution itself.

## Exact Q2 command sequence after approval

1. Reconfirm branch/HEAD, regenerate fingerprint and inspect status. Copy the approved candidate inputs to QA_WORK; create QA_EVIDENCE. Capture every command's stdout/stderr and exit code (avoid pipelines masking exits). Do not rely on engineering logs. Run checks from QA_WORK.

```sh
cd "$QA_WORK"
npm ci --cache /tmp/stark-qa-npm-cache --fetch-retries=0
npm ls --depth=0 --json
npm ls --all
npm ls next eslint-config-next postcss sharp
npm audit --include=dev --json --cache /tmp/stark-qa-npm-cache --fetch-retries=0
npm run lint
npm run typecheck
npm run build
```

Independently compare every direct manifest pin with lockfile root declarations, lockfile package records and installed manifests; inspect all PostCSS/Sharp paths and resolve them from Next. Verify no vulnerable Next-nested PostCSS remains. Record lockfile hash before/after ci/build. A complete fresh audit response is required; network failure is BLOCKED, not zero findings. Do not use omit=dev, audit fix, force or legacy peers.

2. Recheck host TCP listeners (read `/proc/net/tcp` and `/proc/net/tcp6`) immediately before startup. Prefer 3001 if free. If occupied, leave it alone and select free 3002 then 3003, updating QA_PORT/QA_BASE_URL. No free approved port means BLOCKED pending a free port, not permission to stop another process.

When 3001 is free, run the unchanged config:

```sh
PLAYWRIGHT_HTML_OUTPUT_DIR="$QA_EVIDENCE/playwright-report" npm run test:e2e -- --output "$QA_EVIDENCE/test-results"
```

Existing screenshots land in QA_WORK/QAM/evidence; copy them to QA_EVIDENCE afterward. Engineering originals in QA_REPO remain untouched.

If 3001 is occupied, create this **temporary QA-only wrapper in QA_WORK after lint/typecheck/build**, preserving both original config and test spec. It only redirects the test server/base URL; fingerprint it as a QA harness artifact:

```ts
// qa-port.config.ts (temporary; excluded from candidate identity)
import base from './playwright.config';
import { defineConfig } from '@playwright/test';
const port = Number(process.env.QA_PORT);
if (![3002, 3003].includes(port)) throw new Error('Unexpected QA port');
export default defineConfig({
  ...base,
  use: { ...base.use, baseURL: `http://127.0.0.1:${port}` },
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`, reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  },
});
```

```sh
PLAYWRIGHT_HTML_OUTPUT_DIR="$QA_EVIDENCE/playwright-report" npm run test:e2e -- --config qa-port.config.ts --output "$QA_EVIDENCE/test-results"
```

The appended explicit port must actually win over the script's default `-p 3001`; verify readiness/output at the selected port. If it does not, stop only the QA-owned process and report a harness blocker rather than trying Tony's preview. Tests keep `reuseExistingServer: false` in either path.

3. Independently launch a task-owned production server in QA_WORK on the rechecked selected port (not the server from the completed automated run), capture its PID/process group, and drive it with a new `qa-independent.cjs` script stored only in QA_WORK. Use local Playwright with fresh contexts and scenario observations; retain this driver as evidence. Commands:

```sh
npm run start -- --hostname 127.0.0.1 --port "$QA_PORT"
node "$QA_WORK/qa-independent.cjs" "$QA_BASE_URL" "$QA_EVIDENCE"
```

The executor manages startup/backgrounding and readiness with a bounded wait, then always stops only the process group it created. Review screenshots personally as well as assertions. Scenarios below are the driver specification, not claims already tested.

4. After production shutdown, short dev check on the rechecked selected port:

```sh
npm run dev -- --hostname 127.0.0.1 --port "$QA_PORT"
curl --fail --silent --show-error "$QA_BASE_URL/"
node "$QA_WORK/qa-independent.cjs" "$QA_BASE_URL" "$QA_EVIDENCE/dev" --smoke
```

Require HTTP 200, expected heading/local image, working hydrated menu and no application console/runtime error; no full repeat of all production scenarios. Verify scripts still default to 3001 by source; exercise actual default commands without appended port when 3001 is free. Stop QA-owned dev process. Record default-port runtime as unexercised if Tony occupies 3001, while still validating configured defaults and alternate-port runtime.

5. Record final fingerprint/status in original repo, copied generated-file changes, server cleanup and port snapshot. Candidate source hash must match Q1. Save independent `QAM/QA_Q2_RESULTS.md` and evidence under QA_EVIDENCE only after Q2 approval. No source repairs or dependency changes during QA; reproducible defects go to JARVIS/engineering.

## Independent browser scenarios

| ID | Scenario and expected observation | Evidence |
| --- | --- | --- |
| B1 | Fresh desktop 1440×900: HTTP 200; title/description/lang; header/main/footer, local illustration and layout readable. Click each nav/hero/footer/brand link and confirm correct target and visible section. | Desktop screenshot, URL/landmark/metadata observations |
| B2 | Fresh mobile 375×812: menu initially collapsed, hidden links not tabbable; tap open/close repeatedly and select each section; correct ARIA state and close on selection; no clipped controls. | Open/closed screenshots and state/focus log |
| B3 | Keyboard-only fresh load: Tab reveals visibly focused skip link; Enter focuses main. Natural Tab reaches mobile toggle; Enter and Space toggle; Tab reaches visible links; Escape from nav closes and returns focus to button. Reopen, keyboard-select a section and inspect usable focus/target. | Focus outline screenshots; activeElement/ARIA/URL sequence |
| B4 | Resize around md boundary (767/768px) and narrow 320px sanity check; desktop nav available, mobile controls usable, no concealed focused controls after transition. Record open/closed state without requiring an unspecified reset policy. | Viewport/layout observations and any failure screenshot |
| B5 | Inspect image src/network 200, SVG content type, complete/naturalWidth > 0 and descriptive alt. Capture console.error, pageerror, failed requests and HTTP >=400 from navigation through interactions; attribute unexpected application errors. | Network/console log |
| B6 | Measure root scrollWidth <= clientWidth (allow only rounding tolerance documented, not hidden overflow fixes), closed/open menu at normal desktop/mobile and narrow check; visually inspect full-page screenshots. | Width measurements and screenshots |

This is a basic accessibility/navigation smoke, not a WCAG certification or broad browser matrix. Chromium desktop/mobile on the available Node runtime is sufficient for this POC; state that mobile is viewport/touch emulation, not a physical handset.

## Result criteria, gaps and approval gate

- **PASS per criterion:** independent command exits 0 with meaningful complete output, or browser scenario produces the expected observation with retained evidence. Full audit must explicitly report all severity counts 0, including dev dependencies. Overall Q2 pass recommendation requires all scoped criteria and candidate identity/cleanup to pass.
- **FAIL:** reproducible product behavior violates acceptance, install/peer inconsistency, nonzero audit finding, or a validation failure attributable to the candidate. Capture reproduction and impact; do not widen scope or silently repair it.
- **BLOCKED:** missing QA Lead approval, candidate drift needing review, unavailable registry, unsupported/unlaunchable browser/host libraries, denied required execution permissions, or no safe free port. Do unaffected approved checks; never convert blocked work into a pass. Q1 tooling availability does not establish Q2 success.
- Warnings alone are recorded and assessed: engineering mentions unsupported ESLint pin, install-script policy notices and Node/browser deprecations. Do not waive an actual failed check or add a compatibility matrix to resolve a harmless warning.
- Operational gap: current Playwright config hardcodes 3001 and existing tests write screenshots to the engineering path. The isolated copy and temporary wrapper above avoid changing product code or evidence; this is not a product defect.
- Documentation gap: QAM README currently says Q1 NOT RUN and E2's old audit is intentionally historical. This plan records Q1 recon only; do not edit those inputs or infer any QA approval from engineering's reused evidence.
- No confirmed product defect from source recon. No missing input. The only immediate gate is **JARVIS approval of this plan**. Registry access, clean-install success and browser operation remain unverified until Q2.

**Stop here for QA Lead approval. No package install, validation suite, browser test, service restart, repair, commit, push, merge or deployment was performed during Q1. Only `QAM/QA_Q1_PLAN.md` was created. Gate Q remains undecided.**

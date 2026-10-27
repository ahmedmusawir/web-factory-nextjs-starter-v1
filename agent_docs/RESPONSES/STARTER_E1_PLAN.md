# Starter E1 — recon and implementation plan

Date: 2026-10-27. Plan only; engineering shot 2 requires Director approval.

## Recon

- Root: `/home/moose/nextjs/web-factory-nextjs-starter-v1`.
- Origin (fetch/push): `https://github.com/ahmedmusawir/web-factory-nextjs-starter-v1.git`.
- Branch: `main`; HEAD: `a5ffd44` (`Initial commit`). Initial working tree clean.
- Only project file: `README.md`, containing the project name and one-line description. No manifest, lockfile, application, tests or existing instruction files. Checked hidden/ignored workspace files and ancestor `AGENTS.md` locations. Empty, read-only `.agents`, `.codex` and `.aws` directories are environment scaffolding; left untouched. No unexpected project content or dirty changes.
- Installed Node `v26.7.0`, npm `11.19.0`. Retain the original `node >=22` requirement; installed runtime meets declared package engines, but execution compatibility remains to be tested.
- No TCP listener on port 3001 in `/proc/net/tcp` or `/proc/net/tcp6` at inspection. `ss` could not open its netlink socket, so used these read-only tables. Recheck before starting; no service was started or stopped.
- Registry DNS was unavailable in the sandbox; approved read-only network queries succeeded. No packages installed, branches changed, commits made, or other projects modified. This report is the only created file.

## Dependency proposal

Read-only HTTPS GET queries to the [npm registry](https://registry.npmjs.org/) verified version existence, engines, peers and dependency declarations. All supplied fully specified reference versions exist. The following are highest stable versions within the supplied caret ranges at inspection, **not installed versions**:

| Package | Supplied range | Range maximum observed | Proposed exact pin |
| --- | --- | --- | --- |
| next | ^16.2.12 | 16.4.3 | 16.2.12 |
| react / react-dom | ^19.2.4 | 19.3.1 | 19.2.4 |
| typescript | ^5 | 5.9.3 | 5.9.3 |
| tailwindcss | ^3.4.1 | 3.4.19 | 3.4.19 |
| postcss | ^8.5.23 | 8.5.32 | 8.5.23 |
| autoprefixer | ^10 | 10.6.2 | 10.6.2 |
| eslint | ^9.39.4 | 9.39.5 | 9.39.4 |
| eslint-config-next | ^16.2.9 | 16.4.3 | 16.2.12 |
| @types/node | ^20 | 20.19.43 | 20.19.43 |
| @types/react / @types/react-dom | ^19.2.2 | 19.3.0 | 19.2.2 |
| lucide-react | ^1.16.0 | 1.62.0 | omit |
| clsx | ^2.1.1 | 2.1.1 | omit |
| tailwind-merge | ^2.3.0 | 2.6.1 | omit |
| @playwright/test | ^1.59.1 | 1.64.1 | 1.59.1 |

Keep known reference pins where specified, update Tailwind within 3.4, and match Next/config at 16.2.12. Use a text/CSS menu button and simple class strings; icon and class utility packages add no value here. Playwright is used by the actual smoke test. Retain Node 20 type definitions from the reference; avoid newer Node APIs. No Radix, form/state/theme packages or Jest stack.

Compatibility evidence: [Next 16.2.12](https://registry.npmjs.org/next/16.2.12) requires Node >=20.9 and accepts React/React DOM ^19.0.0; its optional Playwright peer accepts ^1.51.1. [React DOM 19.2.4](https://registry.npmjs.org/react-dom/19.2.4) requires React ^19.2.4. [ESLint config 16.2.12](https://registry.npmjs.org/eslint-config-next/16.2.12) exists and requires ESLint >=9, optionally TypeScript >=3.3.1; its declared typescript-eslint ^8.46.0 baseline accepts TypeScript >=4.8.4 <6 and ESLint ^9. Autoprefixer 10.6.2 requires PostCSS ^8.1.0; Tailwind 3.4.19 declares PostCSS ^8.4.47. React DOM types 19.2.2 require React types ^19.2.0. Other proposed direct packages declare no required peers. Node 26 satisfies the inspected engines. These are manifest checks, not proof of a resolved install or runtime success.

Proposed `package.json`:

```json
{
  "name": "stark-web-factory-starter",
  "version": "0.1.0",
  "private": true,
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "next typegen && tsc --noEmit",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "16.2.12",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@playwright/test": "1.59.1",
    "@types/node": "20.19.43",
    "@types/react": "19.2.2",
    "@types/react-dom": "19.2.2",
    "autoprefixer": "10.6.2",
    "eslint": "9.39.4",
    "eslint-config-next": "16.2.12",
    "postcss": "8.5.23",
    "tailwindcss": "3.4.19",
    "typescript": "5.9.3"
  }
}
```

Old overrides, assessed individually (all reference versions verified):

| Old override | Decision and evidence |
| --- | --- |
| postcss ^8.5.23 | Omit initially. Direct tooling uses 8.5.23; Next 16.2.12 separately pins 8.4.31, so the direct pin does not replace Next's copy. Inspect the shot-2 lockfile/audit before deciding whether a narrowly scoped fix or Next patch is needed. No demonstrated need for a global override yet. |
| jest-mock 30.4.1 | Omit: no Jest consumer in the proposed starter. |
| sharp ^0.35.3 | Omit: Next declares optional sharp ^0.34.5; forcing 0.35 crosses its declared compatibility range. Use Next's image dependency. |
| brace-expansion ^5.0.8 | Omit: no demonstrated affected dependency path. A global major replacement could break consumers; inspect actual resolution first. |
| js-yaml ^5.2.2 | Omit: no direct YAML usage or demonstrated affected path. Do not force transitive consumers onto another major. |

No `overrides` section proposed. Existence and peer compatibility do not establish security; shot 2 will inspect actual dependency/audit results without automatic force fixes.

## Small implementation

```text
app/{layout.tsx,page.tsx,globals.css}
components/site-header.tsx
content/site.ts
public/images/starter.svg
tests/home.spec.ts
eslint.config.mjs
postcss.config.mjs
tailwind.config.ts
tsconfig.json
next-env.d.ts
playwright.config.ts
package.json
package-lock.json
.gitignore
README.md
```

Hand-create this structure in shot 2; no latest scaffold. Keep the homepage/layout server-rendered, with only the header/menu needing client state. Typed local content holds branding, navigation and section text; a local image provides a self-contained visual. Use Tailwind 3 directives and the Tailwind/Autoprefixer PostCSS plugins, system fonts, a simple responsive header/main/footer, section anchors, title/description metadata, a skip link, visible keyboard focus and descriptive image alt text. The mobile button exposes `aria-expanded`/`aria-controls`; close on selection and Escape, restoring button focus on Escape. Use ordinary navigation links without a modal or ARIA menu abstraction.

README: preserve the project identity, document Node requirement, install/run/check commands, browser installation, port 3001, content/image edit locations, and no required secrets/env. No database, authentication, portals, Stripe, CMS or deployment integration. Payload/Supabase remains deferred for this POC, not abandoned.

## Shot-2 validation and QA handoff

1. Generate `package-lock.json` with `npm install`, then verify a clean reproducible `npm ci`; inspect dependency tree/peer errors and `npm audit` findings. No force fixes. Exact direct pins plus the generated lockfile establish the tested resolution.
2. Run `npm run lint`, `npm run typecheck`, and `npm run build`. ESLint uses the Next flat configs; type generation precedes standalone TypeScript checking. All commands must perform real checks.
3. Install the matching Chromium browser with `npx playwright install chromium` when authorized for shot 2. Configure Playwright to run the production build using `npm run start -- --hostname 127.0.0.1`, base URL `http://127.0.0.1:3001`, and `reuseExistingServer: false`. Run `npm run test:e2e` after build. Recheck 3001 first; if occupied, stop work on server startup and report it. Never stop another process or use 3000/8000 or a Hermes port.
4. One smoke spec, desktop and mobile viewports (e.g. 1440×900 and 375×812): assert homepage title/heading and landmarks, local image loading, working section navigation, keyboard-accessible mobile open/close/selection/Escape behavior and ARIA state, no page errors, and no horizontal overflow with menu closed and open. Verify dev startup separately on 3001 and stop only this task's own process.

Built-in QAM acceptance checklist:

- [ ] Q1 reviews the test plan before implementation/test finalization: coverage, meaningful assertions, accessible navigation and port isolation.
- [ ] Engineer implements and records actual install/lint/typecheck/build/browser results; no placeholder tests or claims of independent QA.
- [ ] Q2 independently executes clean install and all checks against the reviewed revision, including desktop/mobile navigation and overflow; reports evidence and defects.
- [ ] README is usable, lockfile present, exact direct pins match the approved stack, no secrets required, no excluded systems added, and only authorized files/services changed.

## Blockers / pending gates

No actual recon blocker remains. Director approval is required before shot 2. Package installation, lockfile resolution/audit, browser availability and runtime checks remain unperformed; any failures must be reported then. Port availability is a point-in-time observation. Engineer checks and Q1/Q2 have **not** passed or been executed in this shot.

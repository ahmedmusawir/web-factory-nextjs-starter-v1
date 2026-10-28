# Stark Web Factory starter

A small Next.js App Router starter for Stark Workbench and Web Factory: React, TypeScript and Tailwind CSS 3, with local content and images. No secrets, environment variables, external fonts or backend are required.

## Install and run

Use Node **22 or newer** and npm. From this directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3001. Dev and production start both default to **3001**. Check that it is free first; never stop or reuse another service on that port. Leave services on 3000, 8000 and Hermes ports alone.

Production preview:

```sh
npm run build
npm run start
```

Stop your own server with Ctrl+C when finished.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

The smoke tests launch and stop a production server on 127.0.0.1:3001, and refuse to reuse an existing server. Stop your own dev/preview server before testing. Chromium and its host libraries must be available; browser installation does not install system packages. Tests cover desktop/mobile rendering, local image loading, keyboard skip navigation, section links, mobile menu state/Escape/selection, page errors and horizontal overflow.

Results: `playwright-report/index.html`, `test-results/` (failure traces/screenshots) and `QAM/evidence/` (engineering logs and full-page screenshots). See `QAM/README.md` for independent QA status.

## Make it yours

- `content/site.ts`: typed branding, metadata, navigation, hero and feature content.
- `app/page.tsx`: page sections, remaining headings/about copy and layout.
- `app/layout.tsx`: shared header/footer, footer copy and metadata wiring.
- `components/site-header.tsx`: responsive navigation and mobile behavior.
- `public/images/starter.svg`: local illustration; update its alt text in `app/page.tsx` when replacing it.
- `app/globals.css` and `tailwind.config.ts`: styles and Tailwind 3 configuration.

Direct dependencies are pinned; commit the npm lockfile with future implementation approval. There is no CMS, database, authentication, Stripe or role portal. Payload/Supabase is deferred for this POC, not abandoned.

The dependency repair upgraded Next.js and its matching ESLint config to 16.4.3. The follow-up audit reported zero vulnerabilities; see `agent_docs/RESPONSES/STARTER_DEPENDENCY_REPAIR.md` and `QAM/evidence/dependency-repair/audit-after.json`. The original E2 audit is retained as historical evidence. Independent QA remains NOT RUN.

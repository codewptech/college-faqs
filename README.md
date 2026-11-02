# College FAQs

College FAQs is a Nuxt 4 application for MBA, Engineering, Study Abroad, admission guidance, education-loan guidance, FAQs, and related student-facing tools. It includes eight enquiry forms, the existing Nitro submission API, a Prisma 6.19.3 PostgreSQL schema, and shared Zod 4.6.7 validation. The owner intentionally removed the migration folder; that deletion is preserved. Repository migration commands cannot provision a fresh database without separately reviewed and authorized migration artifacts.

## Stack and setup

Nuxt 4, Vue 3, TypeScript, server-side rendering, Sass, Nitro, PostgreSQL, Prisma, and Zod. The UI uses centralized design tokens and reusable components without a UI framework. Editorial and responsive landing images are local; the existing brand logo uses the external asset host.

Use Node.js 24, matching the Dockerfile. The repository includes `package-lock.json` and a non-secret `.env.example`; actual `.env` values and database credentials remain private. Install from the existing lockfile. Use the example to prepare your own development configuration without overwriting an existing private `.env`. Historical Phase B reports describe earlier snapshots; current runtime instructions are in [submission runtime verification](docs/submission-runtime-verification-v1.md).

After configuring your own private environment:

```bash
npm ci
npm run db:generate
npm run dev
```

The development server normally runs at `http://localhost:3000`. Production commands:

```bash
npm run build
npm run preview
```

`npm run build` generates Prisma Client before the SSR/Nitro build. Generation/build do not require a database connection or apply migrations. A successful build or `/api/health` response does not establish submission readiness. Do not run migration commands against an existing or production database based on this README.

The server-side configuration contract is:

- `DATABASE_URL`: the server-only PostgreSQL connection used by Prisma at runtime.
- `SUBMISSIONS_ORIGIN`: the exact browser-facing origin, such as `http://localhost:3000` in development or the approved public HTTPS origin behind a proxy. Do not include a path or trailing slash.
- `DIRECT_URL`: required by the existing Prisma schema for CLI validation/migration workflows, targeting the same database; it is not forwarded to the Nitro runtime container.

Compose explicitly requires the first two variables. Its container listens on `0.0.0.0:3002`; the host publishes `127.0.0.1:3002`. The public HTTPS origin is separate from that internal HTTP upstream. Submission checks do not trust uncontrolled forwarded headers. Setting a host `.env` alone does not forward undeclared variables into a container. These repository settings have not been applied to production.

Production uses **Neon managed PostgreSQL** with the Nuxt/Nitro application on the existing VPS behind Docker/Nginx and canonical HTTPS WWW. No permanent VPS PostgreSQL service is intended. This is the owner-selected architecture; actual Neon configuration has not been inspected. Obtain pooled runtime and direct administrative URLs for the same intended Neon branch/database; keep the direct credential outside the running application container. See [technical closure and release gates](docs/technical-closure-and-release-gates-v1.md) for TLS, provisioning and approval boundaries.

For an authorized target, `node scripts/check-submission-readiness.mjs` provides a private, read-only, five-second-bounded catalog check. Supply its environment explicitly; it does not load `.env` or publish a database-debug endpoint. It checks the eight models' column types/lengths/nullability, UUID/time defaults, primary/idempotency keys and SELECT/INSERT/schema/function grants. RLS requires separate review. It does not prove actual writes, arbitrary constraints/triggers, TLS posture, full schema equality or migration history. Neon cold-start delays can require warming/retrying this conservative five-second probe. The script runs from a prepared source checkout with Prisma Client; it is not copied into the runtime image. `/api/health` remains liveness only.

## Main structure

- `app/app.vue`: application root, route announcer, canonical URL, and basic Open Graph metadata.
- `app/layouts/default.vue`: skip link, global Header, main landmark, and Footer.
- `app/pages/`: public routes with page-specific SEO metadata.
- `app/components/`: layout, navigation, program, legal, content-rendering, country-guide, and shared UI components.
- `app/composables/useFormPreview.ts`: native form validation, inline errors, and focus handling.
- `app/composables/useFormSubmission.ts`: shared API submission, pending state, safe failures, and retry keys.
- `shared/submission-contracts.ts`: authoritative Zod validation and normalization for all eight forms.
- `server/api/submissions.ts`: public POST-only enquiry submission entry point.
- `server/utils/`: request protections, explicit persistence mapping, and server-only Prisma access.
- `prisma/schema.prisma`: eight dedicated enquiry models; the intentionally deleted migration folder remains absent.
- `tests/`: general application tests against real HTTP, browser and disposable PostgreSQL interfaces.
- `app/data/navigation.ts`: public navigation structure.
- `app/data/studyDestinations.ts`: Study Abroad destination names and route identifiers.
- `app/data/content/`: typed local editorial content for source-heavy pages.
- `app/assets/scss/`: centralized tokens, mixins, base styles, layout utilities, and components.
- `public/editorial/`: country/editorial artwork and responsive landing-image variants.
- `app/components/ui/FormAvailability.vue`: inactive SSR/first-render fieldset guard until form handlers mount.
- `server/api/health.get.ts`: existing health endpoint.

Use explicit root imports such as `~~/app/components/ui/SuccessDialog.vue` for application files. Keep the accepted Sass architecture and gap-based `.flow` spacing. Sequential processes use circular `.step-indicator` markers; indexed content uses `.number-badge`.

## Manual public content

Source-heavy pages use typed local data under `app/data/content/`. About, Explore, both legal pages, the Study Abroad landing page and nine country guides currently contain published content. The publication mechanism also supports intentionally incomplete content; the original independent audit is a historical snapshot, not a live publication monitor.

Only place **publication-approved content** in frontend data files. Anything imported by the frontend should be treated as public information. Do not store confidential client documents, internal notes, student records, passwords, credentials, API keys, or other secrets in `app/data/content/`.

Keep confidential source material outside the repository and manually transfer only the text or data that is intended to appear publicly. Normal publication updates for About, Admission Guide, Education Loan, FAQs, Privacy Policy, Terms & Conditions, the Study Abroad landing page, and the nine country guides should be possible by editing the relevant data files rather than page templates.

The shared content renderer supports paragraphs, bullet/numbered lists, notes, safe links, and semantic responsive tables. Content files use a simple `ready` flag where appropriate. Incomplete pages render a neutral public state and use `noindex, follow` until content is both marked ready and contains publishable page content.

A normal section can be entered directly in a data file without changing a Vue template:

```ts
sections: [
  {
    id: "section-slug",
    title: "Public section heading",
    blocks: [
      { type: "paragraph", text: "Publication-approved paragraph." },
      { type: "list", items: ["First approved item", "Second approved item"] },
    ],
  },
];
```

For rich inline text, plain strings are sufficient in most cases; the `ContentText` segment form exists only when a paragraph needs a safe link or bold segment. Editorial publication status is set in `app/data/resourceCatalog.ts`; typed content objects derive their `ready` properties from that catalog. Publish only after the relevant file contains approved content. A frontend readiness flag does not protect confidential drafts. Country guides can be maintained directly in their existing data modules.

## Route groups

Home and About; MBA landing and seven tools; Engineering; Study Abroad landing and nine country guides; Explore Admission Guide, Education Loan, and FAQs; Privacy Policy and Terms & Conditions. MBA and Study Abroad use directory `index.vue` landing routes with sibling pages; avoid creating conflicting same-name parent `.vue` files.

Country guides: USA, UK, Canada, Australia, France, Germany, Malaysia, UAE, and Georgia.

## Assets and publication safety

Keep unavailable media as local, replaceable artwork with dimensions and appropriate alt text. Decorative illustrations use empty alt text; below-the-fold images load lazily where appropriate. Do not publish sample testimonials, coupons, announcements, functional QR codes, contact details, statistics, legal wording, or destination facts as verified content unless they have been explicitly approved for publication.

The seven existing landing illustrations have local WebP variants at 480, 768, 1024 and 1448px in the existing `public/editorial` path. Their consuming pages own typed `src`/`srcset`/`sizes`/dimension/alt metadata. Home cards retain lazy loading; hero artwork and cropping are preserved. The nine country overview assets and external host configuration are unchanged. No external asset upload was performed.

## Form submissions

All eight hydrated forms send validated JSON enquiries to `POST /api/submissions`. They require JavaScript: SSR and first hydration render keep every named control and submit button inside a disabled fieldset, with loading and `<noscript>` explanations. Mounted Vue enables the controls. Explicit native POST to the same endpoint safely fails its JSON-only contract rather than serializing personal data into a GET URL. No second persistence endpoint exists.

Common contact data is stored in dedicated columns; form-specific fields, exam rows and college lists remain structured JSONB. Every new enquiry creates an independent record; an identical retry with the same request key reuses its saved record. A unique per-request key makes retries safe without merging students or blocking a later enquiry.

The frontend confirms success only after persistence. Errors retain entered details and allow retries. Saving an enquiry does not submit an institution application, run a college-prediction algorithm, or guarantee a callback. No student accounts, public retrieval/export endpoints, admin dashboard, or authentication system are introduced.

Privacy Policy and Terms & Conditions are populated and published in the current content catalog. This technical state is not certification of legal adequacy. Form disclosures describe the implemented saving behavior; substantive policy changes still require the appropriate approval.

## Testing and technical checks

After `npm ci`, use these two commands:

```bash
npm run test:all
npm run check:all
```

`test:all` runs the complete general application suite with Node's test runner, real HTTP requests, Chrome and disposable PostgreSQL. It checks public routes/SSR, all eight enquiry forms, persisted contact/JSON data, validation, safe failures, retry/conflict behavior, no-JavaScript privacy and essential keyboard/accessibility flows. Tests use a private Nuxt development server, so no prior production build is required. `check:all` separately validates the Prisma schema, checks Vue/TypeScript semantics and builds production once, using explicit dummy database settings. Neither command accesses Neon.

Prerequisites are **Linux, Node 24, Chrome and PostgreSQL test infrastructure**. Chrome defaults to `google-chrome`; set `CHROME_PATH` if needed. For local PostgreSQL, set `PG_BIN` to an existing PostgreSQL 18 binary directory; the suite initializes and stops its own private temporary cluster automatically. CI instead supplies `TEST_POSTGRES_URL` for its dedicated PostgreSQL 18.6 service. Only loopback test credentials (`college_test` / `synthetic-only`) are accepted; the runner creates a fresh random test database, verifies its identity/emptiness before provisioning, and drops only that database. No existing user database or repository migration history is used. Missing prerequisites fail visibly; browser/database coverage is never silently skipped. Temporary logs are printed under `/tmp/college-tests-*`; owned processes/databases are cleaned up on success or failure.

The CI job is checkout → Node setup → `npm ci` → **Application tests** (`npm run test:all`) → **Technical checks** (`npm run check:all`). Its PostgreSQL service is disposable test infrastructure, separate from VPS/Docker application hosting and Neon production storage. Existing deployment triggers, permissions, environment, secrets, exact-commit safeguards, Docker commands and health checks remain intact. Local verification does not establish that GitHub-hosted CI or production deployment passed.

The approved pinned Golar checker remains in `scripts/typecheck.mjs`, invoked by `typecheck:vue` inside `check:all`. Its native TypeScript engine is separately versioned from the application's TypeScript 7.0.2; Nuxt's existing dependency-declaration checking limitations still apply. Existing standalone development/build/schema commands remain available. `scripts/check-submission-readiness.mjs` and its catalog helper are private operational tools requiring separately authorized target access; they are intentionally excluded from automatic verification. Migrations, db push/reset, deployment and production probes are never part of either consolidated command.

Earlier audit/implementation reports are historical records and retain their original commands; this README describes the current testing interface. The intentional `prisma/migrations` deletion, unchanged eight-model contract, Neon provisioning approval boundary and outstanding operational/security risk decisions remain documented in [technical closure and release gates](docs/technical-closure-and-release-gates-v1.md). Manual UI/UX review remains separately deferred.

# College FAQs

College FAQs is a Nuxt 4 application for MBA, Engineering, Study Abroad, admission guidance, education-loan guidance, FAQs, and related student-facing tools. This repository contains the V1 frontend and Phase B integration source: Nitro submission APIs, Prisma 6.19.3 PostgreSQL schema/migrations, shared Zod 4.6.7 validation, and integration of all eight existing enquiry forms.

## Stack and setup

Nuxt 4, Vue 3, TypeScript, server-side rendering, Sass, Nitro, PostgreSQL, Prisma, and Zod. The UI uses centralized design tokens and reusable components, with no UI framework or external image service.

Use Node.js 24, matching the existing Dockerfile. **Dependencies have not yet been installed; `package-lock.json`, `.env` and `.env.example` are intentionally absent.** Existing Docker and CI require a generated, synchronized lockfile for `npm ci`. Dependency installation and environment configuration remain future setup work. See [Phase B setup, verification, and owner actions](docs/phase-b-implementation.md).

After future lockfile generation and development environment configuration:

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

`npm run build` generates Prisma Client before the SSR/Nitro build. No database connection is needed to generate or build. Previously reported TypeScript/build checks used a separate temporary dependency environment; they were not rerun during the feedback/documentation correction. Details and future reproduction commands are in the Phase B report.

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
- `prisma/`: eight dedicated enquiry models and the reviewed initial migration.
- `tests/`: existing tests plus contract, mapping, HTTP API, and frontend submission checks.
- `app/data/navigation.ts`: public navigation structure.
- `app/data/studyDestinations.ts`: Study Abroad destination names and route identifiers.
- `app/data/content/`: publication-facing content slots for source-heavy pages.
- `app/assets/scss/`: centralized tokens, mixins, base styles, layout utilities, and components.
- `public/placeholders/`: local, replaceable SVG artwork.
- `server/api/health.get.ts`: existing health endpoint.

Use explicit root imports such as `~~/app/components/ui/SuccessDialog.vue` for application files. Keep the accepted Sass architecture and gap-based `.flow` spacing. Sequential processes use circular `.step-indicator` markers; indexed content uses `.number-badge`.

## Manual public content

Source-heavy pages use typed local data under `app/data/content/`. These files are intentionally safe to remain empty until final public copy is ready.

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

For rich inline text, plain strings are sufficient in most cases; the `ContentText` segment form exists only when a paragraph needs a safe link or bold segment. Keep `ready: false` while a page is incomplete, then set it to `true` when its public content is ready to publish. Country files contain their full empty object explicitly so each guide can be populated in place.

## Route groups

Home and About; MBA landing and seven tools; Engineering; Study Abroad landing and nine country guides; Explore Admission Guide, Education Loan, and FAQs; Privacy Policy and Terms & Conditions. MBA and Study Abroad use directory `index.vue` landing routes with sibling pages; avoid creating conflicting same-name parent `.vue` files.

Country guides: USA, UK, Canada, Australia, France, Germany, Malaysia, UAE, and Georgia.

## Assets and publication safety

Keep unavailable media as local, replaceable artwork with dimensions and appropriate alt text. Decorative illustrations use empty alt text; below-the-fold images load lazily where appropriate. Do not publish sample testimonials, coupons, announcements, functional QR codes, contact details, statistics, legal wording, or destination facts as verified content unless they have been explicitly approved for publication.

## Form submissions (Phase B)

All eight existing forms send validated enquiries to `POST /api/submissions`. Common contact data is stored in dedicated columns; form-specific fields, exam rows, and college lists remain structured JSONB. Every new enquiry creates an independent record; an identical retry with the same request key reuses its saved record. A unique per-request key makes retries safe without merging students or blocking a later enquiry.

The frontend confirms success only after persistence. Errors retain entered details and allow retries. Saving an enquiry does not submit an institution application, run a college-prediction algorithm, or guarantee a callback. No student accounts, public retrieval/export endpoints, admin dashboard, or authentication system are introduced.

Privacy Policy and Terms & Conditions remain the original unpublished content slots. The owner must review and publish appropriate wording before public collection. Form disclosures describe the implemented saving behavior without inventing consent or retention promises.

Run `npm test` after dependencies and Prisma Client are prepared. Tests use the existing Node test runner, Vue compiler/SSR utilities, esbuild, and database mocks; no live database is required. HTTP tests bind ephemeral localhost ports. `tests/frontend-browser.mjs` is a separate optional Chrome/Playwright verification harness; see the report for temporary tooling instructions.

Prisma schema and migration source exist, but no PostgreSQL database has been provisioned or connected. Live persistence and production migration status are unverified. Authentication is not configured for these public enquiry forms. Dependency/environment setup, database provisioning and authorized migration/deployment remain future owner actions. Deployment/CI files remain byte-identical to the pre-removal baseline; the lockfile and environment files are intentionally absent.

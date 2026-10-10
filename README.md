# College FAQs

College FAQs is a Nuxt 4 frontend for MBA, Engineering, Study Abroad, admission guidance, education-loan guidance, FAQs, and related student-facing tools. This repository contains the V1 frontend plus the existing deployment and health-check foundation.

## Stack and setup

Nuxt 4, Vue 3, TypeScript, server-side rendering, and Sass. The UI uses centralized design tokens and reusable components, with no UI framework or external image service.

Use Node.js 24, matching the existing Dockerfile. From the project root:

```bash
npm install
npm run dev
```

The development server normally runs at `http://localhost:3000`. Production commands:

```bash
npm run build
npm run preview
```

There is no separate lint or typecheck toolchain configured. `npm run build` is the primary compile-time verification step.

## Main structure

- `app/app.vue`: application root, route announcer, canonical URL, and basic Open Graph metadata.
- `app/layouts/default.vue`: skip link, global Header, main landmark, and Footer.
- `app/pages/`: public routes with page-specific SEO metadata.
- `app/components/`: layout, navigation, program, legal, content-rendering, country-guide, and shared UI components.
- `app/composables/useFormPreview.ts`: browser-only form validation, inline errors, and focus handling.
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
    id: 'section-slug',
    title: 'Public section heading',
    blocks: [
      { type: 'paragraph', text: 'Publication-approved paragraph.' },
      { type: 'list', items: ['First approved item', 'Second approved item'] },
    ],
  },
]
```

For rich inline text, plain strings are sufficient in most cases; the `ContentText` segment form exists only when a paragraph needs a safe link or bold segment. Keep `ready: false` while a page is incomplete, then set it to `true` when its public content is ready to publish. Country files contain their full empty object explicitly so each guide can be populated in place.

## Route groups

Home and About; MBA landing and seven tools; Engineering; Study Abroad landing and nine country guides; Explore Admission Guide, Education Loan, and FAQs; Privacy Policy and Terms & Conditions. MBA and Study Abroad use directory `index.vue` landing routes with sibling pages; avoid creating conflicting same-name parent `.vue` files.

Country guides: USA, UK, Canada, Australia, France, Germany, Malaysia, UAE, and Georgia.

## Assets and publication safety

Keep unavailable media as local, replaceable artwork with dimensions and appropriate alt text. Decorative illustrations use empty alt text; below-the-fold images load lazily where appropriate. Do not publish sample testimonials, coupons, announcements, functional QR codes, contact details, statistics, legal wording, or destination facts as verified content unless they have been explicitly approved for publication.

## Form boundary and next phase

Forms currently validate details in the browser only. They send no request and save no data. The shared disclosure and `SuccessDialog` state this clearly. A valid interaction does not arrange a callback, submit an institution application, or run a real college-prediction service.

No authentication, database integration, Excel export, or predictor algorithm is included in this frontend phase. Backend/database form integration is a later phase and should be connected only after the final field contracts and publication requirements are confirmed.

`Dockerfile`, `compose.yaml`, and the health endpoint are already present. Preserve that foundation and change deployment files only for a demonstrated need.

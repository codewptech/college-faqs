# College FAQs — Three-issue global scoped rewrite

Status: **CANDIDATE / NOT PRODUCTION-VERIFIED**. Do not deploy without running the full test suite, production build, and real-browser regression checks in the intended environment.

## Governing scope

This rewrite follows the three functional scopes in the supplied `issues.pptx`: (1) every country overview, (2) shared editorial article rendering wherever its components are used, and (3) shared editorial-date behavior and Explore hero/content composition. This is a from-scratch rewrite **of those affected functional implementations**, not an unrelated entire-repository rewrite. The whole-repository audit requested after the three issues is NOT included.

Original immutable source baseline: `college-faqs-copy(3).zip` SHA-256 `c9eea4a644336110147bef73a703cc2f339b5c9ce615c2c572dcd86eb0ae0b29`.

## Changes made

- Rewrote the existing country overview panel and its scoped styling for all nine destinations; added a separate `overviewImage` descriptor to the existing country records. Preserved existing card photographs, descriptions, links, and considerations.
- Added optimized WebP copies of nine user-supplied country-map images under the existing `public/editorial/` media location; sources and metadata remain application-owned. No R2 changes.
- Rewrote `StudyDestinationGuide.vue`, `ContentSections.vue`, and `ContentText.vue` in their existing component locations, preserving their public contracts and all existing typed editorial block kinds. Introduced only one small pure section-normalization helper in existing `content/helpers.ts` so displayed section IDs and TOC links agree and duplicates are not linked.
- Rewrote `ContentEditorialDates.vue`, keeping the same props and display conventions, and added strict date-time validation plus exact `lastUpdated < effectiveAt` logic in the existing helpers module.
- Rewrote `ExploreHero.vue` to accept the existing date component via a named metadata slot, and updated all three Explore page consumers. Metadata now belongs to the hero introduction instead of an independent detached container. Scoped the first-content spacing adjustment to these pages using the existing Sass utility file.
- Added focused regression tests in `tests/three-issue-rewrite.test.mjs`.

## Verification actually performed

- ZIP original integrity: passed.
- Nine WebP files decode at their intended 1376×768 dimensions, and all referenced destinations have existing media and preserved card images: passed.
- New focused Node tests: **4 passed, 0 failed**.
- Existing source-based tests run without application dependencies: **6 passed, 5 failed** on the untouched original baseline; after rewriting, those same tests gave **6 passed, 5 failed**. The five pre-existing failures assume quoted object-key formatting that does not match the original TypeScript editorial files; the untouched source showed identical failures.
- TypeScript syntax parsing via globally installed TypeScript compiler: **73 files parsed, 0 syntax diagnostics**.
- Basic Vue SFC template tag-balance scan: **49 files, 0 flags**. This is not a Vue compiler test.
- No existing code or content files removed.

## Verification blocked / remaining

- `npm ci` did not complete (network timeout); `npm ci --offline` failed with `ENOTCACHED` for a missing package.
- This environment's Node is `v22.16.0`, below the requirements of the resolved Nuxt dependency.
- `npm run build` cannot run because `prisma` is unavailable (exit 127).
- The project's full `npm test` command cannot start on this Node version (`bad option: --test-isolation=none`).
- No production Nuxt SSR rendering, browser/hydration test, or viewport screenshot comparison was run. Chromium exists, but Nuxt application dependencies and a working built app are not available.
- The original screenshot's exact runtime cause is **not conclusively established**. The shared guide-rendering path is rewritten, but the issue cannot be marked resolved without actual SSR/browser verification.

## Next validation before production

In a clean Node environment satisfying the lockfile's engine constraints, run `npm ci`, `npm test`, `npm run build`, and browser checks for all nine countries and content/metadata consumers at mobile, tablet, and desktop widths. Compare pre-existing baseline failures against new failures. Confirm all three issues actually work in SSR and hydrated UI. Do not start the separate whole-repo audit or deploy without the user's authorization.

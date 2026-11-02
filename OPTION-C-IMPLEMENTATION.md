# College FAQs — Option C implementation notes

This is an issue-driven refactor of the uploaded baseline. Existing APIs, PostgreSQL/Prisma schema, all eight form contracts and external image URLs are intentionally unchanged. **Do not overwrite your production `.env` with anything from this archive.**

## Changes

- Public editorial publication statuses centralized in `app/data/resourceCatalog.ts`; existing `ready` properties derive from the catalog to preserve runtime fixtures. Set public publication status there only after substantive content is approved; existing `hasContent` guards still prevent empty bodies from publishing.
- Home resource cards and Study Abroad destination guide links report pending content accurately.
- Pending About/Explore/country pages render a compact `PendingResource` in place of a full marketing illustration and nearly empty body. Published-page templates are retained.
- MBA CTA restores the shared section's upper padding. Home's continuous gray surface now explicitly declares its spacing variant.
- All four programme hero image wrappers reserve layout size during cold-image loading. Existing asset URLs are untouched.
- Generic Home programme-card image alternatives are decorative where adjacent headings provide the programme identity.
- Confirmed obsolete Explore CTA selectors removed.

## Blockers and safe verification

- This package does **not** invent Privacy Policy or Terms & Conditions text. Those pages remain pending until the business owner supplies approved, accurate content.
- The uploaded source is a snapshot, not the live VPS. No actual database connection, production submission, migration or deployment was performed.
- Run `npm ci`, `npm test`, `npm run build` and the repository's browser tests in a supported Node 24 environment before deployment. Verify all 26 routes at 375/768/1024/1440px, particularly pending and published fixtures.
- The uploaded ZIP lacked executable dependencies; see the accompanying verification report for any execution limitations in this environment.

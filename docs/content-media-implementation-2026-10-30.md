# College FAQs — Content & Media Implementation Report

**Source baseline:** `college-faqs-with-legal-content.zip` (the latest available ZIP, which already incorporated the user's original repository and the previous Option C/legal changes).
**Implementation:** 30 October 2026.
**Status:** Source implementation and focused verification complete; **not production-deployment approved**.

## Delivered content

- **About Us:** client-provided company background, services, student-first approach, statistics, mission and CTA, with cleaner web content hierarchy.
- **Admission Guide:** practical admission process, eligibility, exams, admission routes, documents, fees/funding and the client's entrance-exam infographic.
- **Education Loan:** loan coverage, how the team can help, required documents, lender comparison and non-guarantee statement.
- **FAQs:** all 14 questions and answers, grouped into meaningful areas.
- **Study Abroad landing:** editorial intro, nine destination summaries, planning guidance and the existing functional evaluation and mentor forms.
- **Nine country guides:** Australia, Canada, France, Georgia, Germany, Malaysia, UAE, UK and USA, retaining country-specific sections and the client's original comparison tables.
- **Legal pages:** the existing 11-section Privacy Policy and 21-section Terms & Conditions retained; all three editorial dates on _both_ records changed to `2026-11-01T00:00:00+05:30` as explicitly requested.

## Images and alt text

- Extracted and inspected **29** DOCX images. Optimized and included **27 WebP images** (~1.2 MB combined). Two campus pictures in the Georgia document were not used because their geographic provenance was unclear.
- Nine country-specific article heroes also power corresponding destination cards. Other suitable source images appear within article sections. The admission infographic is included in its appropriate section.
- Each new image has a content-owned `alt`, source, intrinsic width/height, and appropriate caption; semantic `<figure>` / `<figcaption>` markup is supported in the shared renderer.
- Corrected the header logo accessibility treatment: the brand link has the accessible name, while the image itself is decorative. Refined existing homepage program-card alternatives. Existing hero illustrations with `aria-hidden` remain intentionally decorative (`alt=""`).
- **Asset-rights approval remains necessary:** images being provided in the client's Word document does not establish that the client owns their publishing rights.

## Date-time architecture

- `publishedAt`, `lastUpdated`, `effectiveAt` live in each authoritative content record, with offset-aware ISO 8601 values or `null`.
- Both legal pages: all three values `2026-11-01T00:00:00+05:30` (1 November 2026, midnight IST). The display component distinguishes a scheduled future date from a completed past publication.
- Country guides and the three Explore resources have manually assigned `lastUpdated` at the time their editorial records were revised on 30 October 2026. Their `publishedAt` remains `null` because an actual production publication date has not been established; `effectiveAt` is inapplicable.
- The Study Abroad landing and About page do not display an editorial timestamp without a meaningful one. No file modification timestamps are used as substitutes.
- The shared date component formats for Asia/Kolkata and emits semantic `<time datetime>` elements; country OG article dates are projected from the content fields.

## Selected factual corrections and remaining fact checking

The client guides supplied the information. Edits are restrained, but the following were cross-checked against official sources:

- **UK:** Graduate visas for eligible bachelor's/master's graduates are generally **2 years for applications made before 1 January 2027** and **18 months for applications from 1 January 2027** (doctorates: three years). Source: https://www.gov.uk/graduate-visa
- **Canada:** PGWP conditions depend on programme and institution; eligible master's courses lasting eight months may qualify for a three-year PGWP. Source: https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html
- **Canada:** updated 2026 financial support figures were checked against IRCC: https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html
- **Germany:** 2026 blocked-account and work-rights guidance was checked against https://www.make-it-in-germany.com/en/visa-recognition/visa-types/studying
- **Australia:** student visa financial and work requirements were checked against https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500 and https://immi.homeaffairs.gov.au/visas/already-have-a-visa/check-visa-details-and-conditions/see-your-visa-conditions?cno=8105&product=500
- **Australia:** the 2026 replacement of the University of Adelaide/UniSA with Adelaide University was checked against https://adelaide.edu.au/about/news/2026/a-bold-new-future-for-australian-higher-education-begins-today/
- **France:** the August 2026 student-visa funds threshold was checked against Campus France (https://www.japon.campusfrance.org/fr/modification-du-montant-des-ressources-exigees-pour-les-demandes-de-visa-etudiant-a-compter-du-1er).
- **Georgia:** corrected the unsafe implication that WHO/WDOMS listing establishes Indian medical licensing eligibility. NMC requirements require institution/programme-specific review.
- **UAE:** removed an unverified universal 15/40-hour allowance; student employment depends on correct permits and local conditions. https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/job-offers-and-work-permits-and-contracts/work-permits

**Not all individual university, programme, fee, visa, scholarship, housing or currency claims have been independently verified.** The site includes official links and visible qualifications, but a final country-by-country content review is required before public release. This is particularly important for medical credential recognition, student-visa processes and local employment permissions.

## Verified integrity

- All **26 existing route files** preserved.
- All **16 editorial resources** have substantive content and are marked published in the public resource catalog.
- All **8 previously referenced external asset URLs** preserved unchanged.
- Backend, `server/`, `shared/`, `prisma/`, and form-composable files unchanged byte-for-byte from the baseline.
- All 27 optimized media assets referenced and packaged.
- Focused Node-native regression tests: **11 passed, 0 failed**.
- Strict TypeScript typechecking of the standalone typed content modules: **passed**.
- TypeScript syntax parsing across app/server/shared/tests: **passed**.
- Structural HTML/Vue tag check: **49 Vue files, 0 flagged** (does **not** replace the Vue compiler).

## Not yet verified / release gates

1. **Full dependency installation and Nuxt build:** unavailable in this sandbox. Node is `v22.16.0`, below the dependency engine requirement (`^22.22.3 || ^24.15.0 || >=26`); npm registry access also failed (`EAI_AGAIN`). Therefore, the entire original test suite and Nuxt production build **have not been run** on this revision.
2. **Actual browser QA:** mobile/tablet/desktop visual checks, heading levels, image rendering, long tables, keyboard/reader navigation and CTA/form checks are still required in the supported environment.
3. **Client/legal signoff:** verify the legal document terms and the 1 November dates are authorised for publication.
4. **Image rights:** verify the public-use rights for each client-supplied photograph and infographic.
5. **Editorial fact-check:** verify every applicable country-specific rule and indicative cost immediately before public release. Recheck periodically thereafter.
6. **Real publication dates:** enter `publishedAt` when the relevant nonlegal content is actually first published, never infer it from the build date or filesystem.

## Local verification / safe integration

Review the patch on a **new Git branch** based on the matching `college-faqs-with-legal-content.zip` source. Do **not** apply the patch to the original pre-Option-C ZIP.

Use Node 24.15.0 or a newer supported LTS release, then run:

```bash
npm ci
npm test
npx nuxt typecheck
npm run build
```

The typecheck command may require adding a `vue-tsc` dev dependency if absent. If your current CI does not provide that command reproducibly, establish it before accepting a green build. Then preview the site locally and test all 16 updated pages at mobile and desktop widths. Do not deploy automatically to production without that review.

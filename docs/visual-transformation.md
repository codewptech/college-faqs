# College FAQs: Red, White & Charcoal

## A. Overall outcome and baseline

The existing Nuxt application now uses official brand red for primary actions and accents, charcoal headings and selected panels, white image surfaces, and neutral alternating sections. The existing font, content, responsive grids, components, and application architecture remain in place.

Work started on branch `main` at `f6d86939f6bec31feb9f80179881aa96f0908482`, with 18 already-modified frontend files. Those changes were preserved and extended. The starting working tree was saved as `/tmp/college-faqs-before-transform.patch` and `/tmp/college-faqs-before-transform.tgz`. No commit or deployment was made.

Installed versions were checked locally: Node 24.22.1, Nuxt 4.6.2, Vue 3.5.44, Vue Router 5.4.0, Sass 1.106.1, Prisma 6.19.3, and Zod 4.6.7. Dependencies and lockfiles were not changed.

## B. Files modified in this implementation

Paths below are relative to the repository. This list describes changes from the saved starting working tree, including its existing styling refresh.

| File                                             | Reason                                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/assets/scss/abstracts/_variables.scss`      | Remap existing primary tokens to official red; neutralize blue-tinted greys and shadows; define charcoal surface and stronger heading weight.           |
| `app/assets/scss/base/_typography.scss`          | Strengthen H1 weight while preserving the existing font family, sizing, and heading semantics.                                                          |
| `app/assets/scss/components/_buttons.scss`       | Keep secondary button hover neutral; primary buttons inherit official red and darker hover tokens.                                                      |
| `app/assets/scss/components/_forms.scss`         | Add a strong, offset focus outline; preserve independent error styling and functional select-arrow gradients.                                           |
| `app/assets/scss/components/_header.scss`        | Give the existing logo placement a white backing; navigation inherits red active states and charcoal text.                                              |
| `app/assets/scss/components/_footer.scss`        | Use a neutral section background and white logo backing.                                                                                                |
| `app/assets/scss/components/_dialog.scss`        | Neutralize the dialog backdrop; retain green success feedback.                                                                                          |
| `app/assets/scss/components/_mba-subpages.scss`  | Remove hero gradients and give informational notices neutral surfaces and charcoal markers.                                                             |
| `app/components/home/ProgramCard.vue`            | Give all programme images white backing, retaining media proportions and existing cover behavior.                                                       |
| `app/components/explore/ExploreHero.vue`         | Remove hero gradients and give illustrations white surfaces, retaining contain behavior.                                                                |
| `app/components/content/ContentCta.vue`          | Solid charcoal panel, red primary action, light neutral copy and focus, and stacked tablet presentation.                                                |
| `app/components/mba/MbaToolCard.vue`             | Charcoal featured card, restrained red accents, neutral hover, readable light text, visible red symbol on white, and no hover movement.                 |
| `app/components/study/StudyDestinationGuide.vue` | White country-guide hero and image backing with the existing aspect ratio.                                                                              |
| `app/pages/index.vue`                            | White hero, exact-copy red headline emphasis, neutral programme section, light neutral CTA text, and improved tablet CTA wrapping.                      |
| `app/pages/about.vue`                            | Remove image glow and section gradients; white media, neutral sections, and charcoal CTA.                                                               |
| `app/pages/programs/mba/index.vue`               | White hero/media, neutral support panels, charcoal concluding CTA, and stacked tablet CTA wrapping.                                                     |
| `app/pages/programs/engineering/index.vue`       | White hero/media, solid neutral enquiry section, and red labels protected from paragraph-colour overrides.                                              |
| `app/pages/programs/study-abroad/index.vue`      | White hero, guide images, and form surfaces; charcoal mentor panel with neutral light text, red callback submit, and white outer focus outline on dark. |
| `app/pages/explore/admission-guide.vue`          | Remove remaining page-scoped CTA gradient and blue-tinted dark-panel copy.                                                                              |
| `app/pages/explore/education-loan.vue`           | Remove remaining page-scoped CTA gradient and blue-tinted dark-panel copy.                                                                              |
| `app/pages/explore/faqs.vue`                     | Remove remaining page-scoped CTA gradient and blue-tinted dark-panel copy.                                                                              |
| `docs/visual-transformation.md`                  | Record the implementation, asset inventory, verification, and remaining limitations.                                                                    |

`app/assets/scss/components/_cards.scss` and `app/assets/scss/layout/_utilities.scss` already had uncommitted changes and were left intact. Their existing semantic tokens now resolve to the new palette. Other routes and shared components inherit the design without unnecessary edits.

## C. Final design tokens

| Token                                                    | Value / purpose                                                      |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| `--color-brand-red`, `--color-primary-600`               | **`#B7131F`**, exact official red and primary actions                |
| `--color-primary-700`                                    | `#98101A`, primary hover and prominent links                         |
| `--color-brand-red-dark`, `--color-primary-800`          | `#90101A`, dark red emphasis                                         |
| `--color-brand-red-soft`, `--color-primary-50`           | `#FFF0F1`, restrained badges and interaction highlights              |
| `--color-primary-100`                                    | `#F7DADD`, supporting red tint                                       |
| `--color-primary-900`                                    | `#5E0A11`, deepest red scale entry                                   |
| `--color-white`, `--color-background`, `--color-surface` | `#FFFFFF`, page canvas, cards, inputs, image backings                |
| `--color-gray-50`, `--color-surface-subtle`              | `#F5F5F6`, alternating neutral sections                              |
| `--color-gray-100`                                       | `#EDEDF0`, neutral supporting surfaces                               |
| `--color-gray-200`, `--color-border`                     | `#E1E2E5`, subtle borders and light text on charcoal                 |
| `--color-gray-400`, `--color-border-control`             | `#858995`, visible control boundaries                                |
| `--color-gray-500`, `--color-text-muted`                 | `#535865`, supporting text                                           |
| `--color-gray-700`, `--color-text-secondary`             | `#434751`, body copy                                                 |
| `--color-gray-800`                                       | `#303239`, secondary charcoal                                        |
| `--color-gray-900`, `--color-text`                       | `#191B20`, primary headings and text                                 |
| `--color-surface-dark`                                   | `#1B1D21`, selected information panels and CTAs                      |
| `--color-link` / `--color-link-hover`                    | Primary 700 / 800                                                    |
| `--color-focus`                                          | Official red on light surfaces; light neutral locally on dark panels |
| `--color-success`                                        | `#15803D`, preserved semantic success                                |
| `--color-warning`                                        | `#A16207`, preserved semantic warning                                |
| `--color-danger` / `--color-danger-light`                | `#B91C1C` / `#FFB4B4`, errors on light / dark surfaces               |

Disabled controls retain neutral backgrounds and muted text. Success, warning, and errors are independent from the brand scale. Decorative section gradients are removed; select-arrow gradients remain functional controls.

## D. Image-background audit

All intentional image surfaces have white CSS backing. Hero sections surrounding images are also solid white, without gradients, glows, blend modes, or filters. Existing card image cropping and illustration proportions are preserved.

This includes the homepage hero and three programme cards, About, MBA, Engineering, Study Abroad, all Explore illustrations, destination-guide cards, all nine country-guide heroes, and header/footer logos.

**Asset limitation:** the existing local illustrations contain pale-blue canvases inside the SVG itself (`#EFF6FF` / `#eff6ff`). Existing remote homepage artwork also contains blue imagery and light-blue canvas areas visible in screenshots. White CSS cannot remove those pixels. All artwork, URLs, alt text, and ownership remain unchanged; no asset was generated, downloaded for replacement, recoloured, filtered, or removed.

## E. Future image replacement guide

| Reference location                                                            | Existing asset(s), unchanged                                                                                                                   | Presentation                                              |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `app/pages/index.vue`                                                         | `https://assets.collegefaqs.com/home/hero-image.png`                                                                                           | White hero and visual wrapper; natural proportions        |
| `app/pages/index.vue`, rendered by `ProgramCard.vue`                          | `https://assets.collegefaqs.com/home/mba-section.png`, `engineering-section.png`, `study-abroad-section.png` under the same `/home/` directory | Consistent white 16:10 media; existing cover crop         |
| `app/components/layout/AppHeader.vue`, `AppFooter.vue`                        | `https://assets.collegefaqs.com/logo.jpeg`                                                                                                     | White logo placements; existing footer fallback preserved |
| `app/pages/about.vue`                                                         | `/placeholders/about-guidance.svg`                                                                                                             | White hero/media; decorative pseudo-element removed       |
| `app/pages/programs/mba/index.vue`                                            | `/placeholders/mba-guidance.svg`                                                                                                               | White hero/media                                          |
| `app/pages/programs/engineering/index.vue`                                    | `/placeholders/engineering-guidance.svg`                                                                                                       | White hero/media                                          |
| `app/pages/programs/study-abroad/index.vue`                                   | `/placeholders/study-abroad-guidance.svg`                                                                                                      | White hero/media                                          |
| `app/pages/explore/admission-guide.vue`                                       | `/placeholders/admission-guide.svg`, passed to `ExploreHero.vue`                                                                               | White hero/media                                          |
| `app/pages/explore/education-loan.vue`                                        | `/placeholders/education-loan.svg`, passed to `ExploreHero.vue`                                                                                | White hero/media                                          |
| `app/pages/explore/faqs.vue`                                                  | `/placeholders/faqs.svg`, passed to `ExploreHero.vue`                                                                                          | White hero/media                                          |
| `app/components/study/StudyDestinationGuide.vue` and Study Abroad guide cards | `/placeholders/study-destination-guide.svg`                                                                                                    | White backing on all nine country guides and guide cards  |

Local files live in `public/placeholders/`. They can later be replaced at the same paths; remote assets can be replaced at their existing hosted URLs or their bindings updated in the reference files above. No surrounding CSS changes should be needed for suitable white-backed or transparent replacements.

## F. Testing results

| Check                               | Result                                                                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm test` on the final source      | **191 passed, 0 failed**, 12 suites; no skipped tests                                                                                               |
| `npm run build` on the final source | **Passed**, production client/server build completed in 21.6 seconds                                                                                |
| All-route responsive browser sweep  | **26 routes at 375, 768, 1024, and 1440px**; no horizontal page overflow or unexpected runtime/console errors                                       |
| Computed UI styling                 | No blue brand styling or section gradients; all audited image backings white and image ancestors gradient-free                                      |
| Final browser interactions          | **297 assertions passed**, 0 failed, 48 intercepted mock API responses, 0 runtime errors                                                            |
| Final targeted browser review       | **158 assertions passed**, 0 failed; revised MBA, Engineering, and Study Abroad styles at all four widths, destination selection and keyboard focus |
| Image loading after scrolling       | **81 of 81 placements loaded** across all 26 routes; no broken images                                                                               |
| Preservation comparison             | **47 Vue script blocks unchanged**, no unexpected template edits                                                                                    |
| Final diff whitespace check         | `git diff --check` passed                                                                                                                           |

The interaction checks exercised all eight forms at both 375px and 1440px: blank and malformed inputs, field focus, inline error colours, correct submission contracts, simulated server and validation failures, pending/disabled styling, duplicate suppression, success feedback, modal focus, and Escape cleanup. Every submission was intercepted before reaching the server. Desktop dropdown keyboard controls and outside-click dismissal, mobile navigation at 375/768px, primary/secondary hover, and reduced motion were also checked. All nine destination selectors were exercised at mobile and desktop sizes, including native keyboard activation and visible focus.

The all-route sweep found a white-on-white symbol inside the new featured MBA card. It was corrected to official red on white and included in the final targeted verification. Screenshot review also prompted the MBA tablet CTA wrap fix and restoration of red Engineering section labels.

Contrast calculations include:

| Combination                           | Ratio   |
| ------------------------------------- | ------- |
| White text / official red             | 6.72:1  |
| Charcoal `#191B20` / white            | 17.23:1 |
| Muted text `#535865` / subtle neutral | 6.53:1  |
| Light text `#E1E2E5` / dark panel     | 13.03:1 |
| Control border `#858995` / white      | 3.49:1  |
| Success green / success tint          | 4.79:1  |
| Error red / white                     | 6.47:1  |
| Light error / dark panel              | 10.00:1 |

Checks used headless Google Chrome through a fresh CDP harness. Existing pending content was left pending, so unpublished content sections were not enabled for screenshots. The production preview ran with `DATABASE_URL` unset; no live enquiry or database operation was performed.

Evidence lives in `/tmp/college-red-qa/`: `unit-tests.log`, `production-build.log`, `routes-report.json`, `interactions-report.json`, `final-targeted-report.json`, `image-report.json`, `preservation.json`, and the fresh browser scripts. The original all-route report records the discovered icon contrast issue; the final targeted report records its correction.

## G. Visual-review results

The desktop homepage now opens with a white canvas, confident charcoal typography, a red final headline phrase, and a red primary action. Neutral programme/resource sections and the charcoal concluding CTA establish a clearer rhythm than the blue baseline. Mobile stacking and card proportions remain recognizable; the homepage and MBA CTAs have more comfortable tablet wrapping. Programme pages, resource pages, tools, forms, legal pages, and country guides use the same palette without changing their content or structure.

Fresh full-page screenshots were reviewed by the implementing agent and an independent reviewer, including Home at all four widths, MBA, Engineering, Study Abroad, About, Admission Guide, College Predictor, and the USA country guide. About and several guide/legal pages correctly continue to display their existing pending-content states.

Baseline images are in `/tmp/college-red-qa/baseline/`. Final screenshot examples:

| View                   | Screenshot                                                                |
| ---------------------- | ------------------------------------------------------------------------- |
| Homepage desktop       | `/tmp/college-red-qa/final/home-1440.png`                                 |
| Homepage mobile        | `/tmp/college-red-qa/final/home-375.png`                                  |
| Homepage tablet        | `/tmp/college-red-qa/final/home-768.png`                                  |
| Homepage small desktop | `/tmp/college-red-qa/final/home-1024.png`                                 |
| MBA desktop / tablet   | `/tmp/college-red-qa/final/programs-mba-1440.png`, `programs-mba-768.png` |
| Engineering            | `/tmp/college-red-qa/final/programs-engineering-1440.png`                 |
| Study Abroad           | `/tmp/college-red-qa/final/programs-study-abroad-1440.png`                |
| About                  | `/tmp/college-red-qa/final/about-1440.png`                                |
| Explore representative | `/tmp/college-red-qa/final/explore-admission-guide-1440.png`              |
| Form representative    | `/tmp/college-red-qa/final/programs-mba-college-predictor-1440.png`       |
| Country guide          | `/tmp/college-red-qa/final/programs-study-abroad-usa-1440.png`            |
| Mobile success dialog  | `/tmp/college-red-qa/final/success-dialog-375.png`                        |

## H. Preservation confirmation

An automated comparison against the starting snapshot verified all 47 Vue script blocks unchanged. Templates are unchanged except the homepage emphasis span around the exact words “next college decision.”, the shared CTA's first-action presentation class, and the Study Abroad callback button's primary presentation class. Written content, SEO metadata, legal and pending content, image bindings, route paths, destinations, navigation handlers, validation, and form submission logic are preserved.

Server/API code, student data handling, Prisma schemas, migrations, dependencies, environment files, Docker/hosting/deployment configuration, and existing tests were not edited. No database migrations, real student submissions, commits, or deployments were performed.

## I. Remaining concerns

No outstanding implementation defects were found in the executed checks. Existing artwork retains its embedded blue canvases and blue illustration colours, as required by the asset-preservation policy. Suitable white-backed or transparent replacements can use the inventory above. No additional design expansion or content publication was undertaken.

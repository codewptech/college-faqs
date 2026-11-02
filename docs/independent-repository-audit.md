# Independent Repository Audit — College FAQs

Audit date: **1 November 2026 (Asia/Kolkata)**. Repository: `/mnt/data/dcode/college-faqs`. Starting branch: `main`, HEAD `d7a9f535d6ed8107fa7d1f97b91ad3b865d9c338`.

**Audit only. No corrections were performed.** Conclusions concern the inspected working tree, including its existing modifications and untracked files. They do not establish the state of the deployed website. Earlier implementation reports were treated as claims to evaluate; their historical verification counts were not reused as current evidence.

## Executive Summary

The application is a functioning Nuxt SSR education-guidance site with 26 public routes, local editorial content, eight enquiry forms, and a Nitro/Prisma submission backend. The inspected code has useful shared contracts, restrained server/client boundaries, semantic content rendering, and meaningful backend unit coverage. All public routes rendered successfully, the production build completed, and all 227 automated tests passed in an environment allowing localhost sockets.

The evidence does **not** establish production readiness. The checked-in deployment omits the runtime settings needed by the submission backend, and the working tree contains no migration artifacts for provisioning its eight models. All eight forms also have a confirmed privacy/functionality defect when JavaScript is unavailable: native submission sends contact and academic fields through a GET query string without saving an enquiry. Additional confirmed issues affect editorial navigation, repeated loan content, overlapping dialogs, landmark naming, image transfer, and maintenance documentation.

| Audit severity | Register entries |
| -------------- | ---------------: |
| Critical       |                0 |
| High           |                1 |
| Medium         |                4 |
| Low            |                5 |
| Informational  |                3 |
| **Total**      |           **13** |

Ten entries are confirmed defects or verification/control gaps. Three Informational entries describe dependency maintenance risk, an accessibility candidate needing manual interpretation, and potential API abuse risk. Raw npm/axe severities are kept separate from this audit's assessment of application impact.

Confidence is **high** for repository configuration, current browser behavior, and the reproducible findings below; **limited** for real database persistence, deployed infrastructure, assistive-technology usability, real-device compatibility, and field performance. A separate manual UI/accessibility review can proceed using this report as a baseline. It must not be interpreted as approval to release the submission workflow.

## Repository Understanding

### Purpose and implementation

College FAQs provides MBA, Engineering, Study Abroad, admission, loan and FAQ guidance. MBA tools collect requests for mentoring, prediction-related guidance, applications and interview preparation. The implemented predictor saves an enquiry; it does not calculate college predictions. Coupons and College Updates deliberately render empty states. Study Abroad includes nine destination guides, destination selection, profile evaluation and mentoring forms. About, legal and Explore pages render typed editorial content.

| Area                    | Independently observed implementation                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Runtime/package manager | Node 24, npm, committed `package-lock.json`; inspected runtime Node **24.22.1**, npm **12.2.1**                                   |
| Framework               | Installed/locked Nuxt **4.6.3**, Vue **3.5.44**, vue-router **5.4.0**; manifest uses compatible ranges                            |
| Rendering               | Default server-side rendering with client hydration and client route navigation; Node/Nitro production output                     |
| Language/styles         | TypeScript **7.0.2**, Sass **1.107.1**; tokens, mixins, shared styles and page-scoped SCSS                                        |
| Server/data             | Nitro/H3, Zod **4.6.7**, Prisma Client/CLI **6.19.3**, PostgreSQL schema                                                          |
| State                   | Local Vue refs/computed/watch; no separate global state library or account/auth system                                            |
| Testing                 | Node test runner, esbuild, Vue compiler/SSR helpers, HTTP fixtures with injected persistence; two opt-in browser scripts          |
| Deployment              | Two-stage Node 24 Dockerfile; loopback-bound Docker Compose service; GitHub Actions test/build followed by SSH/Compose deployment |

`app/app.vue` wraps routes, announces navigation, and supplies canonical/Open Graph URL metadata. `app/layouts/default.vue` provides the skip link, header, main landmark and footer. `app/error.vue` renders the shared error/recovery UI. File-based pages import shared layout, UI, content and program components explicitly.

Editorial data resides in `app/data/content/`; publication state derives from `app/data/resourceCatalog.ts`. `ContentText` renders escaped text and supported links rather than raw HTML. `ContentSections` interprets paragraphs, lists, notes, images and responsive tables. Country route wrappers use one `StudyDestinationGuide`. Shared dates, CTA and reading-navigation components reduce repeated logic. The Study Abroad landing page retains its own selected-destination and two-form state.

Forms use `useFormPreview` for native/custom validation and focus, `useFormSubmission` for shared contract checking, requests, pending/error state and retry keys, and `submission-payload.ts` for named-field extraction. Eight allowlisted form identifiers enter `POST /api/submissions`; server mapping selects explicit Prisma delegates. Contact columns are separate from structured JSONB details. Database-backed unique request keys support identical retries without treating a later enquiry as a duplicate.

The Prisma schema contains eight models, UUID IDs/request keys, timestamps, bounded contact columns and JSONB details. Schema validity and offline SQL generation were checked; database tables, constraints and successful live writes were not verified.

### Public routes

Every route below was independently discovered from `app/pages`, directly loaded as SSR HTML, and rendered in Chrome at all six viewport widths.

| Family               | Routes                                                                                                                                                                        | Important behavior                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| General              | `/`, `/about`                                                                                                                                                                 | Program/resource navigation; editorial About content                     |
| MBA landing          | `/programs/mba`                                                                                                                                                               | Tool cards and guidance navigation                                       |
| MBA forms            | `/programs/mba/talk-to-mentor`, `/programs/mba/college-predictor`, `/programs/mba/application-form`, `/programs/mba/start-your-application`, `/programs/mba/gdpi-preparation` | Five forms; conditional exam/Other fields and college lists              |
| MBA resources        | `/programs/mba/coupons`, `/programs/mba/college-updates`                                                                                                                      | Intentional empty states; `noindex, follow`                              |
| Engineering          | `/programs/engineering`                                                                                                                                                       | Program information and enquiry form                                     |
| Study Abroad landing | `/programs/study-abroad`                                                                                                                                                      | Nine destination choices/guide cards; profile and mentor forms           |
| Country guides       | `/programs/study-abroad/usa`, `/uk`, `/canada`, `/australia`, `/france`, `/germany`, `/malaysia`, `/uae`, `/georgia` under the same `/programs/study-abroad` prefix           | Shared guide renderer, sections, photographs, CTA and reading navigation |
| Explore              | `/explore/admission-guide`, `/explore/education-loan`, `/explore/faqs`                                                                                                        | Editorial sections, reading navigation, FAQs/native disclosures          |
| Legal                | `/privacy-policy`, `/terms-and-conditions`                                                                                                                                    | Published local content and explicit editorial dates                     |

The abbreviated country suffixes above all have the full prefix; they are not root-level aliases. Server routes are `GET /api/health` and the POST-only `/api/submissions`. There is no public enquiry-retrieval/admin endpoint in the inspected source.

## Audit Coverage

Reviewed areas include the root configuration/manifests, lockfile metadata, Docker/Compose/CI files, all page families, layout/navigation, shared UI/content/study components, form composables and payload utility, editorial/publication/media descriptors, shared contracts, all server utility/API files, Prisma schema and missing migration paths, Sass structure, all 13 default test modules, both browser harnesses, and their helpers. Existing README and audit/implementation documents were examined for current-state claims and test methodology.

Coverage combined:

1. Repository and instruction discovery, Git/file inventory and preservation baseline.
2. Independent source/data-flow inspection in parallel across frontend/content, forms/tests and backend/security.
3. Safe automated verification and production compilation.
4. Runtime rendering, keyboard/interaction, no-JavaScript, responsive, SSR/status/metadata and accessibility checks.
5. Reproduction of candidates and cross-checking against tests and implementation.
6. Final severity review, removal of unsupported conformance/exploit claims, and file-preservation verification.

This is broad technical coverage, not exhaustive testing of every possible input, browser, screen reader, network condition or editorial statement.

### Repository protection

Before execution, Git showed **45 changed tracked paths** (including **two deleted migration files**) and **54 untracked files**. There were 129 tracked paths and 183 unique tracked/untracked baseline entries including the deleted paths. Existing changes included application/data/styles, tests, documentation, package files and CI. Ignored local files/directories included `.env`, `.nuxt/`, `.output/` and `node_modules/`.

No applicable `AGENTS.md` or `instructions.md` was found in the searched repository/ancestor locations. Package scripts and test sources were inspected before execution. SHA-256 hashes and Git status were saved under `/tmp/college-audit` before builds. Existing ignored build outputs were regenerated as permitted; existing source/user files were not edited. The only intentional repository addition is this report. No install was run against the repository, no dependency/lockfile was changed, and no commit, branch change, cleanup, migration, deployment or live database write was performed.

## Verification Evidence

### Commands and automated results

Commands ran from the repository unless otherwise stated. The default shell lacked Node on PATH; the existing Node installation was used by prepending:

```bash
export PATH=/home/inusky/.nvm/versions/node/v24.22.1/bin:$PATH
```

| Exact command/check                                                                                       | Actual result                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git status --short --branch`, `git status --short --ignored`, `git ls-files --others --exclude-standard` | Baseline work/ignored outputs identified and preserved                                                                                                                                                     |
| `git diff --check`                                                                                        | Passed, no whitespace errors; checked before and after the audit                                                                                                                                           |
| `node --version`, `npm --version`                                                                         | v24.22.1 / 12.2.1                                                                                                                                                                                          |
| `npm ls --depth=0`                                                                                        | Exit 0; all declared top-level dependencies resolved, no reported invalid/missing top-level packages                                                                                                       |
| Manifest versus lockfile root inspection                                                                  | Dependency declarations match; inspected resolved HTTP package sources use `registry.npmjs.org`                                                                                                            |
| `npm test` in restricted sandbox                                                                          | 227 tests: 204 passed, 23 failed because localhost `listen` returned `EPERM`; not classified as application failures                                                                                       |
| `npm test` with localhost sockets allowed                                                                 | **227 tests, 12 suites, 227 passed, 0 failed/cancelled/skipped/todo**, approximately 1.65 seconds                                                                                                          |
| `npm run db:validate`                                                                                     | Passed; Prisma schema valid, no database connection/migration                                                                                                                                              |
| `node_modules/.bin/prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`  | Safe offline output: 8 `CREATE TABLE` and 8 unique-index statements; no schema applied                                                                                                                     |
| `npm run build`                                                                                           | **Passed**; Prisma Client generated, client/SSR/Nitro compiled, Node production output produced; Nuxt reported approximately 19.4 seconds                                                                  |
| `CI=1 node_modules/.bin/nuxt typecheck`                                                                   | **Blocked/exit 1:** no Vue-aware checker installed; CLI printed installation instructions without changing the repository                                                                                  |
| `node_modules/.bin/tsc -b --noEmit`                                                                       | Exit 0, no diagnostics; not equivalent to checking Vue templates/full Nuxt application                                                                                                                     |
| `node /tmp/college-audit/type-tools/node_modules/vue-tsc/bin/vue-tsc.js -b --noEmit`                      | **Blocked/exit 1:** temporary vue-tsc 3.3.14 with the project's TypeScript 7.0.2 failed `ERR_PACKAGE_PATH_NOT_EXPORTED` for `typescript/lib/tsc`; no application diagnostics obtained                      |
| `npm audit --json --cache /tmp/college-audit/npm-cache --ignore-scripts`                                  | First restricted attempt failed DNS; network-enabled repeat succeeded with exit 1 for **17 affected package names: 3 High, 12 Moderate, 2 Low**, representing four unique upstream advisories; see AUD-011 |
| Lint                                                                                                      | No lint script/configuration discovered; no lint pass claimed                                                                                                                                              |

The build emitted a bundler plugin-timing warning; no build failure resulted. Fresh `npm ci`, Docker image construction, static generation and deployment were not run. Successful compilation is not a substitute for the blocked full Vue type check.

The Vue checker and axe analyzer were downloaded into `/tmp` only, using `npm install --prefix /tmp/college-audit/type-tools --no-save --package-lock=false --ignore-scripts --cache /tmp/college-audit/npm-cache vue-tsc typescript@7.0.2` and `npm pack axe-core --pack-destination /tmp/college-audit --cache /tmp/college-audit/npm-cache --ignore-scripts`. Neither changed repository dependencies.

### Browser environment and results

Fresh output was launched with:

```bash
DATABASE_URL='' DIRECT_URL='' NITRO_HOST=127.0.0.1 NITRO_PORT=3417 node .output/server/index.mjs
```

This intentionally isolated the audit from database writes. Headless **Google Chrome 155.0.8059.84**, Linux, CDP port 9328, device scale factor 1 was used. The main matrix used **360, 390, 768, 1024, 1440 and 1920 CSS pixels**, each 900px high. These were desktop Chrome viewport emulations, not real phones. No CPU/network throttle was imposed. Additional existing-suite cases used 1000px height, selected 800/720px interactions, and form/concurrent-dialog checks used 780×493.

| Runtime verification                                                                                                                                                                       | Result and scope                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Independent responsive sweep: `node /tmp/college-audit/scan.mjs`                                                                                                                           | **156 completed page/viewport cases: 26×6**. No document horizontal overflow, duplicate IDs, unlabeled visible form controls, empty visible links/buttons by the specified DOM checks, broken completed images, uncaught exceptions or captured hydration mismatch warnings                      |
| Sweep interruption                                                                                                                                                                         | One CDP `Runtime.evaluate` timeout interrupted the first run after four widths. The temporary harness resumed unfinished cases and completed all 156; not attributed to an application defect                                                                                                    |
| Existing suite: `CDP_PORT=9328 UI_TEST_ORIGIN=http://127.0.0.1:3417 UI_TEST_ARTIFACTS=/tmp/college-audit/existing-browser node --experimental-strip-types tests/browser/four-issue-ui.mjs` | **910 passed, 0 failed**; 16 editorial/study/legal routes across six widths; CTA/rail/anchor/selection/disclosure checks. Limitations described in AUD-004                                                                                                                                       |
| Independent forms: `node /tmp/college-audit/forms-audit.mjs`                                                                                                                               | **104 positive checks passed; 1 deliberately failing audit assertion reproduced AUD-002.** All eight hydrated forms exercised; API responses mocked                                                                                                                                              |
| Native no-JS clicks: `node /tmp/college-audit/forms-native-audit.mjs`                                                                                                                      | **8/8 actual submit-button mouse clicks** reproduced GET query leakage using synthetic values; no API persistence                                                                                                                                                                                |
| Concurrent dialogs: `node /tmp/college-audit/dialog-concurrency.mjs`                                                                                                                       | Reproduced AUD-008 with two mocked successes                                                                                                                                                                                                                                                     |
| Content/navigation: `node /tmp/college-audit/content-runtime.mjs` and supplemental probes                                                                                                  | Desktop ArrowDown/Escape, mobile Enter/Tab/Escape and focus restoration passed; reproduced TOC error and loan duplication; no-JS header limitation verified                                                                                                                                      |
| Accessibility: `node /tmp/college-audit/a11y.mjs`                                                                                                                                          | axe-core **4.14.0**, **52 cases: 26×2** at 390/1440px, WCAG 2/2.1/2.2 A/AA and best-practice tags; see interpretation below                                                                                                                                                                      |
| SSR/link/status: `node /tmp/college-audit/http.mjs`                                                                                                                                        | **33 local paths** requested; 26 public routes SSR-rendered with H1 content; internal navigation paths resolved; nested/trailing-slash URLs returned successfully                                                                                                                                |
| Final browser: `node /tmp/college-audit/final-browser.mjs`                                                                                                                                 | Client navigation updated title/canonical; browser Back/Forward worked; unknown route showed 404 UI and `noindex, nofollow`; Back to Home recovered; all same-document anchor targets existed across 26 routes; reduced motion produced `scroll-behavior:auto` and near-zero transition duration |

Form checks included blank/invalid-phone rejection, server-field error attachment and focus, 503/network error retention, retry-key reuse, pending duplicate suppression, mocked confirmed success, native dialog naming/Escape/unlock, predictor percentile zero acceptance and −1/101 rejection, conditional Other details, five-exam limit/removal, and exam dependencies for application/start forms. The upper inclusive boundary of 100 was covered by unit fixtures rather than the independent form browser run. These checks do not prove a successful database transaction.

All 26 pages had one H1, a title and description in the inspected DOM. Titles were distinct. Canonicals used the configured `https://www.collegefaqs.com` origin and omitted query strings. `/api/health` returned 200 with `{"status":"ok"}` in the deliberately database-disabled preview. GET `/api/submissions` returned 405. Unknown paths and `/sitemap.xml` returned 404. Browser HTML navigation received the shared error UI; a generic fetch without an HTML Accept header received Nitro JSON error content, which is normal content negotiation rather than a separate defect.

### Accessibility interpretation

Automated checks produced **106 flagged node instances** across the 52 runs: the same two brand links in every run (104 instances, AUD-012), and redundant Study Abroad region naming at both widths (two instances, AUD-009). These are repeated instances, not 106 unique defects. The brand result is explicitly **not** classified as confirmed WCAG nonconformance.

There were **no confirmed automated color-contrast failures**, but color contrast was marked incomplete in 48 of 52 cases. This is not a contrast pass for every text/background combination. Visible keyboard focus and navigation/modal/disclosure behavior were manually exercised in Chrome. Labels, required notes, validation focus, skip-link/main semantics, reduced-motion CSS and cleanup paths were inspected. Screen-reader, speech-control, full contrast, touch/zoom and cross-browser accessibility review remain necessary; no comprehensive compliance claim is made.

### Test quality

Backend tests meaningfully exercise strict structures, unknown-field rejection, numeric boundaries/zero, conditional values, mapping, safe errors, body limits/timeouts, content type/method/origin checks, concurrency release and retry/idempotency logic. HTTP tests use real local sockets around injected persistence; storage tests use an in-memory delegate. They do not apply migrations or validate real PostgreSQL behavior.

Some new content tests compile and SSR-render actual templates, which is stronger than source-text matching. Other tests still assert implementation strings or compile only page scripts. The passing browser suite verifies selected positive scenarios while missing the independently reproduced section-body scroll and concurrent-dialog cases. Thus 227/227 and 910/910 are valuable bounded results, not proof of complete functionality. No tests were repaired or added to the repository.

### Evidence artifacts

Temporary artifacts are under `/tmp/college-audit`; they are outside the repository and may not survive environment cleanup. The report records essential measurements and reproduction steps so its conclusions do not depend solely on those files.

| Evidence                     | Temporary path                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| Baseline hashes/status       | `baseline-hashes.json`, `baseline-status.txt`                                                        |
| Tests/build/type checks      | `npm-test.log`, `npm-test-unrestricted.log`, `build.log`, `typecheck.log`, `tsc.log`, `vue-tsc.log`  |
| Matrix/HTTP/final navigation | `scan-results.json`, `http-results.json`, `final-browser-results.json`                               |
| Browser suite/a11y           | `existing-browser/results.json`, `a11y-results.json`                                                 |
| Forms/native fallback        | `forms-results.json`, `forms-native-results.json`                                                    |
| Concurrent modal             | `dialog-concurrency-results.json`, `dialog-overlap-before.png`, `dialog-overlap-after.png` (780×493) |
| TOC                          | `toc-confirmation.json`, `toc-incorrect-active-1440.png` (1440×900)                                  |
| Loan duplication             | `loan-card-evidence.json`, `loan-duplicated-headings-390.png`, `loan-duplicated-headings-1440.png`   |
| General screenshots          | `screenshots/` and `existing-browser/`                                                               |
| Advisory/reachability        | `npm-audit-live.json`, `dependency-advisory-notes.md`                                                |

## Findings Register

### AUD-001 — High — Checked-in deployment omits required submission runtime settings

- **Classification / confidence / verification:** Confirmed configuration defect; **High confidence**. Source and safe service execution verified. Actual deployed overrides/proxy/database unverified.
- **Affected files:** `compose.yaml:10-13`, `Dockerfile:21`, `.dockerignore:13-15`, `server/utils/prisma.ts:8-12`, `server/api/submissions.ts:9`, `server/utils/submission-http.ts:75-78`, `server/utils/submission-service.ts:96-106`, `.github/workflows/deploy-production.yml:123-133`, `server/api/health.get.ts:1-7`.
- **Routes/features:** All eight enquiry forms when deployed using the repository's Docker/Compose workflow.

Compose supplies only `NODE_ENV`, `NITRO_HOST` and `NITRO_PORT`. It supplies neither `DATABASE_URL` nor an `env_file`; Docker excludes `.env` and copies only `.output` into the runtime stage. `getPrisma` rejects a missing database URL. A host `.env` file does not automatically forward undeclared settings into the container.

The configured public origin is also absent. Submission handling deliberately ignores forwarded host/protocol and defaults its allowed origin to the upstream request origin. In an ordinary HTTPS-to-HTTP reverse-proxy arrangement, the public browser's HTTPS Origin therefore differs from that default unless `SUBMISSIONS_ORIGIN` is configured.

**Evidence/reproduction:** Safe direct service calls with synthetic data and injected persistence returned 403 `ORIGIN_NOT_ALLOWED` for browser Origin `https://www.collegefaqs.com` and upstream request origin `http://www.collegefaqs.com`; no persistence call occurred. Explicitly supplying the HTTPS expected origin returned injected 201. A separate call using actual persistence with `DATABASE_URL` unset returned 503 `DATABASE_UNAVAILABLE` before connecting. The isolated preview still returned healthy 200 from `/api/health` with database variables blank.

**Impact/root cause:** The checked-in deployment can report healthy while enquiry saving is unavailable. Runtime configuration was not carried through the deployment boundary. This does not prove the live deployment lacks an external override.

**Recommended correction:** In a separate implementation task, explicitly provide server-only database configuration and the canonical browser origin through the deployment environment. Review readiness/failure visibility, then verify the real proxy and database in an authorized environment. Keep credentials out of the image/client bundle.

### AUD-002 — Medium — Native form fallback sends personal data in GET URLs

- **Classification / confidence / verification:** Confirmed privacy and functional defect; **High confidence**, actual browser clicks reproduced on **all eight forms**.
- **Affected files:** `app/pages/programs/mba/talk-to-mentor.vue:45-52`, `college-predictor.vue:123-130`, `application-form.vue:58-65`, `start-your-application.vue:59-66`, `gdpi-preparation.vue:137-144` within the same MBA directory; `app/pages/programs/engineering/index.vue:300-308`; `app/pages/programs/study-abroad/index.vue:509-516` and `801-808`.
- **Routes/features:** Five MBA forms, Engineering enquiry, Study Abroad profile and mentor forms.

The forms omit native `method`/`action`, use `novalidate`, and depend on Vue's `@submit.prevent`. Without JavaScript, the browser defaults to GET on the current route and serializes named fields. No request reaches the JSON POST API and no saved confirmation appears. The same source design presents a risk before hydration, although that timing window was not separately reproduced.

**Reproduction:** Disable JavaScript in a fresh browser document, open a form, enter synthetic name/phone and click Submit. For mentor, observed navigation included:

```text
/programs/mba/talk-to-mentor?fullName=SYNTHETIC_AUDIT_NAME&phone=9999999999&email=synthetic%40example.invalid&program=mba&message=&submissionTrap=
```

Eight independent actual mouse clicks reproduced this behavior; `form.method` was `get`. Required blank email/qualification fields could also navigate because native validation is disabled. Only synthetic data was used.

**Impact/root cause:** Contact, academic and free-text values enter browser history and URLs, potentially reaching request logs or copied links, while the enquiry is lost. Actual downstream logging/disclosure was not inspected. The form's native behavior is unsafe when its client handler is unavailable.

**Recommended correction:** Provide an intentional safe native/server fallback or prevent unsafe native submission until client handling exists. Any fallback must preserve POST/validation and data-handling guarantees; simply pointing the native form at the JSON-only endpoint is insufficient.

### AUD-003 — Medium — Database provisioning command has no migration artifacts

- **Classification / confidence / verification:** Confirmed repository/provisioning defect; **High confidence**. File inventory and offline schema diff verified; no live migration run.
- **Affected files:** Absent working-tree `prisma/migrations/20261024000000_initial_submissions/migration.sql` and `prisma/migrations/migration_lock.toml` (both existing tracked deletions); `package.json:14-15`, `prisma/schema.prisma:12` onward, `README.md:3,39`.
- **Routes/features:** Reproducible clean database setup and all enquiry persistence on a newly provisioned database.

Only `prisma/schema.prisma` remains under `prisma/`. The project still advertises included migrations and exposes `prisma migrate deploy`. That command applies migration history; the schema file alone is not migration history.

**Evidence/reproduction:** Inventory the directory and compare it to the documented setup. Offline `prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` generated eight table and eight unique-index definitions. None of the corresponding migration files exists in the working tree. The deleted files were preserved as deleted.

**Impact/root cause:** Following the documented migration deployment procedure cannot provision these models from the current repository. An existing externally provisioned database may work; this was not evaluated. Required versioned provisioning artifacts are absent.

**Recommended correction:** Resolve the intended migration state in a separate task, restore/review versioned provisioning artifacts as appropriate, and verify migrations against an authorized disposable database before deployment. Do not infer an existing database's schema from Prisma schema validity.

### AUD-004 — Medium — CI passes without full Vue type or behavioral browser verification

- **Classification / confidence / verification:** Confirmed verification/control gap; **High confidence**, scripts/CI inspected and checker failures reproduced. This is not evidence of an undiscovered TypeScript error.
- **Affected files:** `package.json:5-28`, `.github/workflows/deploy-production.yml:31-38`, `tests/frontend-submission.test.mjs:54-65,182-217`, `tests/frontend-other-controls.test.mjs:18-31`, `tests/browser/four-issue-ui.mjs:84-91,101-109`.
- **Routes/features:** Application-wide release verification, especially forms, Vue templates and shared components.

CI runs `npm test` and `npm run build`, without a full Vue type-check or browser gate. The default test glob excludes both browser scripts. No Vue-aware checker is installed. The Nuxt type-check command failed for that reason; a temporary current vue-tsc 3.3.14 also failed to initialize with pinned TypeScript 7.0.2. TypeScript-only checking and Vite transpilation do not establish Vue template correctness.

Some form tests compile scripts without mounting their templates and fabricate controls/native validity. Tests named as requiring Other fields do not actually assert `required`. The browser suite checks image `src`/rendered dimensions rather than successful decoding; its TOC checks scroll to exact heading targets, missing body-scroll behavior. The form browser harness runs sequential dialogs and misses concurrent ownership.

**Evidence/reproduction:** Run the reported commands, inspect the cited assertions, then compare passing 227/227 and 910/910 results with AUD-002/AUD-006/AUD-008. Those confirmed behaviors are not rejected by the existing gates.

**Impact/root cause:** CI can accept meaningful native markup, interaction and template regressions. Coverage is intentionally layered but important layers are not enforced and some assertions are weaker than their names suggest.

**Recommended correction:** Establish a compatible, reproducible full Vue checking toolchain and a bounded browser gate. Add meaningful regression coverage for actual form markup/fallbacks, section-body scrolling and concurrent dialogs in a separate task. Retain useful unit tests; do not replace behavior checks with additional source-text assertions.

### AUD-005 — Medium — Fixed-resolution PNGs impose multi-megabyte landing-page transfers

- **Classification / confidence / verification:** Confirmed performance/resource-efficiency issue; **High confidence**. Source, actual HTTP downloads, image dimensions and browser selection verified.
- **Affected files:** `app/pages/index.vue:17,25,33,100-106`, `app/components/home/ProgramCard.vue:14-21`, `app/pages/programs/mba/index.vue:94-100`, `app/pages/programs/engineering/index.vue:118-124`, `app/pages/programs/study-abroad/index.vue:175-181`.
- **Routes/features:** Home and three program landing pages, particularly mobile visits.

Seven external PNGs are all 1448×1086 and approximately 1.20–1.66 MB each. At 390px, Chrome rendered the Home hero at 343px and cards at 341px, but selected the same full-size URLs with no `srcset`.

| Download                               |  Actual bytes |
| -------------------------------------- | ------------: |
| Home hero                              |     1,662,009 |
| Home MBA card                          |     1,197,952 |
| Home Engineering card                  |     1,295,086 |
| Home Study Abroad card                 |     1,213,414 |
| **Home image total, after cards load** | **5,368,461** |
| MBA landing hero                       |     1,217,086 |
| Engineering hero                       |     1,208,184 |
| Study Abroad hero                      |     1,239,646 |

**Reproduction/evidence:** Open Home at 390px, scroll through program cards, inspect each image's `currentSrc`, `naturalWidth`, displayed width and empty `srcset`; compare actual GET byte counts. All seven URLs returned 200. The total is image data, not a measured initial transfer or load-time result; lazy cards load later.

**Impact/root cause:** Small-screen users fetch substantially larger resources than their displayed dimensions require. Direct original PNG use lacks responsive selection/modern variants. No Core Web Vitals or specific delay is inferred from these byte counts.

**Recommended correction:** Supply suitable compressed modern-format/responsive variants and choose sizes matching layout while preserving intended artwork and explicit dimensions. Re-measure transfer and visual quality in a separate task.

### AUD-006 — Low — Reading navigation highlights the wrong section during body scrolling

- **Classification / confidence / verification:** Confirmed behavior defect; **High confidence**, reproduced in Chrome.
- **Affected files:** `app/components/content/ContentOnThisPage.vue:32-63`; heading-target entries in `app/pages/about.vue:65-75`, `app/pages/explore/admission-guide.vue:52-56`, `app/pages/explore/education-loan.vue:51-59`.
- **Routes/features:** About, Admission Guide, Education Loan desktop reading navigation.

The observer tests target-element rectangles. Some callers supply a section wrapper, others only an H2. When a scroll jump enters a long section below its H2, the heading has already left the observation band; if no target is visible, `activeId` remains on an earlier section. Visual highlighting and `aria-current` become incorrect even though the links still work.

**Reproduction:** At 1440×900 on Education Loan, first visit `#loan-planning`, then scroll to roughly 400px below `#loan-compare-title`. Observed `scrollY=1881`; the current “Understand your loan options” section extended from viewport −475.5 to 1497.6px, but “What can an education loan cover?” remained current. Similar mismatches occurred on About and Admission. Sampled country guides using full section targets behaved correctly.

**Impact/root cause:** Readers and assistive-technology users receive inaccurate current-section orientation. Mixed anchor extents conflict with the shared observation algorithm. Screenshot: `/tmp/college-audit/toc-incorrect-active-1440.png`.

**Recommended correction:** Use consistent full-section observation or derive the current section from ordered section starts/reading position. Verify jumps into section bodies as well as exact anchor activation.

### AUD-007 — Low — Loan cards repeat complete descriptions as headings and paragraphs

- **Classification / confidence / verification:** Confirmed content-structure/UI defect; **High confidence**, source and rendered dimensions verified.
- **Affected files:** `app/data/content/explore/educationLoan.ts:89-139`, `app/pages/explore/education-loan.vue:247-262`, `app/components/content/ContentSections.vue:39-46`.
- **Routes/features:** Education Loan, “Understand your loan options” five-card guidance list.

All five items put their full instruction/explanation into `title` and repeat that text in a paragraph, prefixed with its list number. The shared renderer correctly renders the supplied fields as H3 and body, producing duplicate reading content and unusually large headings.

**Reproduction/evidence:** Visit the section at 390px or 1440px. For example, “Prepare Your Documents Get guidance on commonly required documents…” appears as both heading and paragraph. At 390px the H3s measured **180–270px** high, cards **423.6–592.7px**. At 1440px some H3s measured **337.5px**. Screenshots and measurements are in `loan-duplicated-headings-{390,1440}.png` and `loan-card-evidence.json` under the evidence directory.

**Impact/root cause:** Users encounter repeated prose and difficult heading scanning; assistive heading navigation includes full paragraphs. The data conflates headings and explanations. Severity is Low because information remains available and controls still work.

**Recommended correction:** Separate approved short headings from their existing explanatory text, preserving editorial meaning. No editorial corrections were made during this audit.

### AUD-008 — Low — One dialog closes the global scroll lock while another remains open

- **Classification / confidence / verification:** Confirmed shared-state defect; **High confidence**, concurrent mocked form responses and actual wheel input reproduced it.
- **Affected files:** `app/components/ui/SuccessDialog.vue:33-39,56-60,78-80`, `app/pages/programs/study-abroad/index.vue:893-898`.
- **Routes/features:** Study Abroad's two independent success dialogs.

Each instance adds/removes the same `dialog-open` body class without coordinating ownership. Both forms can be submitted while their requests are pending; two successful responses open two native dialogs. Closing the top dialog unconditionally removes the lock needed by the remaining dialog.

**Reproduction/evidence:** At 780×493, hold both form requests, resolve both with mocked valid saved responses, then close the top dialog. Before: two dialogs, body `overflow:hidden`. After: one dialog still open, body `overflow:visible`; a wheel input scrolled the underlying page from 0 to 400px. No actual persistence was used. See `dialog-concurrency-results.json` and before/after screenshots.

**Impact/root cause:** Background content can scroll beneath a remaining modal. Global lock ownership is instance-local. This needs overlapping successes, so the observed impact is limited.

**Recommended correction:** Coordinate modal state or retain the lock while any owning dialog remains open, including unmount paths. Test overlapping asynchronous success and close order separately.

### AUD-009 — Low — Study guide area exposes two indistinguishably named landmarks

- **Classification / confidence / verification:** Confirmed redundant/nonunique landmark semantics; **High confidence**, source and axe at both widths verified. Not presented as a proven WCAG failure.
- **Affected files:** `app/pages/programs/study-abroad/index.vue:371-386,405-410`.
- **Routes/features:** Study Abroad destination guide list, landmark navigation.

An outer named `section` becomes a region named “Destination guides”. Its nested horizontal scroller explicitly declares another region with the same name. Axe reports `landmark-unique` at both widths; assistive navigation receives redundant entries for the same area.

**Reproduction:** Inspect the landmark tree or run the specified axe checks on Study Abroad. Compare the outer heading-derived region name to the inner `aria-label`.

**Impact/root cause:** Users cannot distinguish the nested entries by their label. Impact is modest because both refer to substantially the same content. The duplicate results from naming both the content section and its scrolling container identically. [W3C landmark guidance](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) recommends considering purpose/content when labeling repeated landmarks.

**Recommended correction:** Review which region boundaries are useful and give distinct purpose-based naming where both are retained, while preserving keyboard scrolling and its description.

### AUD-010 — Low — Current README contradicts repository and publication state

- **Classification / confidence / verification:** Confirmed documentation defect; **High confidence**, filesystem/source/rendering cross-checked.
- **Affected files:** `README.md:3,9,39,75,93,97`; related historical/current-state statements in `docs/phase-b-implementation.md:5,92,104`.
- **Routes/features:** Developer onboarding, release/setup and legal publication maintenance.

README line 9 says the lockfile/environment example are included; line 97 says lock/environment files are intentionally absent. Both `package-lock.json` and `.env.example` exist. README says legal pages remain unpublished slots, but current legal modules/catalog contain substantive published text and the browser renders indexable legal pages. README also claims included migrations although those working-tree files are deleted (AUD-003), and describes country content objects as empty although they are populated.

**Reproduction:** Compare the cited current README statements with the actual files, catalog and rendered legal pages. Historical reports remain useful historical records, but their claims do not establish current environment/deployment state.

**Impact/root cause:** Maintainers receive conflicting setup/publication instructions. Documentation was not reconciled with later working-tree changes.

**Recommended correction:** Update current setup/publication descriptions after the intended repository state is settled; clearly separate historical evidence from current prerequisites. Do not replace unknown production facts with assumptions.

### AUD-011 — Informational — Four advisories affect build/CLI dependencies; application exploit unconfirmed

- **Classification / confidence / verification:** **Potential toolchain security/maintenance risk.** High confidence in package/advisory presence and inspected artifact reachability; application exploitation **not established**. No exploitation attempted.
- **Affected files:** `package.json:18-28`; `package-lock.json:3903,3942,4819,4828,5489,6604,7657`; Docker build stage `Dockerfile:5-10`.
- **Features:** Dependency installation, Prisma CLI and Nuxt build tooling.

Live npm audit reported 17 affected package names, including propagated parent packages. These derive from **four unique advisories**, rather than 17 independent exploits:

| Affected installed versions          | Upstream severity | Primary advisory / condition                                                                                                                                                                                         |
| ------------------------------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| deepmerge 4.3.1                      | Low               | [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4), CVE-2026-93753; merge-object prototype poisoning                                                                                           |
| deepmerge-ts 7.1.5                   | High              | [GHSA-ggr8-5vv4-36mx](https://github.com/RebeccaStevens/deepmerge-ts/security/advisories/GHSA-ggr8-5vv4-36mx), CVE-2026-40345; recursive/cyclic object-graph merging; patched ≥8.0.0                                 |
| glob 13.0.6 and nested 10.5.0        | Moderate          | [GHSA-3g3m-2fjr-6pw4](https://github.com/isaacs/node-glob/security/advisories/GHSA-3g3m-2fjr-6pw4), CVE-2026-118773; cancellation does not stop traversal; patched ≥14.0.2                                           |
| minimatch 10.2.6, nested 9.0.9/5.1.9 | Moderate          | [GHSA-g3hv-75wg-m249](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249), CVE-2026-118764; pattern amplification; registry range <11.0.1, maintainer discusses 10.2.6/optimizationLevel ≥2 |

**Evidence/reproduction:** Repeat the advisory command against the lockfile and inspect dependency callers/current `.output`. All three High package entries propagate the same deepmerge-ts advisory through `@prisma/config` and `prisma`. Plain JSON cannot create the cyclic graphs described by that advisory. The inspected uses concern trusted CLI/build input, not form request input. None of these four packages or their flagged build parents appeared in the generated runtime dependency manifest/directories; generated server source-map paths also did not identify them. No attacker-controlled merge/glob path was found.

**Impact/root cause:** There is a real dependency maintenance exposure in installed tooling; current evidence does not support a High application vulnerability. Different build inputs/future bundles could change reachability. npm's package-category counts alone do not prove Docker runtime exposure.

**Recommended correction:** Review compatible upstream/transitive updates in a separately authorized dependency task, rerun tests/build/advisory and inspect the resulting artifact. Do not blindly use `npm audit fix --force`: its proposals include major Prisma changes and an apparent Nuxt downgrade.

### AUD-012 — Informational — Brand-link label mismatch is an automated candidate

- **Classification / confidence / verification:** **Candidate requiring manual interpretation**, not confirmed accessibility nonconformance. High confidence in DOM/accessible-name mismatch; impact/conformance unverified.
- **Affected files:** `app/components/layout/AppHeader.vue:115-144`, `app/components/layout/AppFooter.vue:31-62`.
- **Routes/features:** Header/footer home links on all routes; speech-control naming.

Axe reports `label-content-name-mismatch` for both links in every run: their explicit accessible name is “College FAQs home”, while visible text also contains the smaller tagline “Your College Repository”. Chrome's accessibility tree confirmed that `aria-label` supersedes those contents.

**Reproduction:** Inspect either link's computed accessible name and visible content, or repeat axe at 390/1440px. This is 104 repeated node instances, not 104 separate defects.

**Impact/root cause:** If the whole visible brand/tagline is treated as the operative label, the accessible name omits part of it. However, “College FAQs” already appears verbatim and the tagline may be descriptive rather than part of the operative label. No actual speech-control failure was tested. [W3C Label in Name guidance](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html) requires identifying the label rather than assuming every nearby description belongs to it.

**Recommended next verification:** Manually review the intended label and speech interaction before deciding whether a correction is needed. Do not adopt axe's “serious” impact as an independently confirmed audit severity.

### AUD-013 — Informational — Public enquiry API has no sustained abuse throttling

- **Classification / confidence / verification:** **Potential operational risk**, not confirmed exploit or requirement violation. High confidence in source behavior; deployment-level protections unverified. No load/abuse test performed.
- **Affected files:** `server/utils/submission-security.ts:3-26`, `server/utils/submission-service.ts:96-125`, `server/api/submissions.ts:5-10`.
- **Routes/features:** Public `POST /api/submissions` and storage/operational capacity.

The process-local guard limits concurrent requests to 16 and releases capacity when each finishes. It does not limit sequential submissions by time, identity or source. Browser origin checks and a honeypot are useful controls but do not authenticate a non-browser client. Independent legitimate repeat enquiries are deliberately supported; new UUID keys can create independent records.

**Evidence/reproduction:** Source inspection and existing concurrency/repeat tests establish this behavior. Exploiting it or generating records was unnecessary and was not attempted.

**Impact/root cause:** Automated valid-looking submissions could consume storage or staff capacity if no external protection exists. Actual traffic, cost, exposure and proxy/WAF policies are unknown. This is an explicit tradeoff in the present guard, not proof of an attack or an instruction to restore a particular removed policy.

**Recommended next verification:** Review expected traffic, abuse response and deployment protections with the owner before choosing any additional controls. Preserve legitimate repeat-enquiry semantics and avoid collecting extra identifiers without a justified need.

## Cross-Cutting Architectural Observations

### Sound boundaries independently supported by code

The backend uses strict shared Zod validation and explicit form-to-model selection rather than trusting request-selected model names. Inputs, JSON structure and text lengths are bounded; streamed JSON is limited to 32KiB with a 10-second read timeout and strict UTF-8 handling. Unsupported methods/content encodings and cross-origin browser requests are rejected. Success awaits persistence, and error paths intentionally avoid submitted values, credentials, SQL stacks and request-body logging. No public read/export endpoint or raw SQL input path was found.

The content renderer escapes text; no current `v-html`/unsafe HTML sink or unsafe authored URL scheme was found. No tracked credential/private-key material was confirmed in the inspected patterns; ignored `.env` values were not printed. These observations do not constitute a complete secret-history scan or infrastructure security review.

Local component state is adequate for the observed feature set. Country guides and content blocks have useful shared implementations. Most event listeners/observers have corresponding cleanup, and browser-only code is in lifecycle/event paths. No reproducible hydration mismatch, sustained listener leak or expensive scroll-loop defect was established. A global state library, new routing architecture or rewrite is not justified by this audit.

### Shared contracts need matching native and global ownership behavior

Forms share strong hydrated validation/retry behavior, yet all repeat the unsafe native fallback. Reading navigation shares an algorithm but callers provide inconsistent target extents. Dialog instances share a global CSS lock without shared ownership. These findings support focused contract corrections and regression cases, rather than a broad refactor.

Large page components combine content layout and form markup, but size/duplication alone was not classified as a defect without a demonstrated consequence. The verified consequences are the shared fallback and modal/anchor behavior recorded above.

### UI, responsiveness and accessibility

The matrix supports generally stable wrapping/containment at the measured widths. Native forms, dialogs, details/summary, list/table markup, explicit image dimensions and focus styles are used extensively. The Study guide list intentionally scrolls within its own container and does not cause document overflow. Sidebar/CTA layouts passed their specified browser checks. Loan headings and current-section highlighting are explicit exceptions.

With JavaScript disabled, SSR editorial/legal content remains readable and native FAQ disclosures work. Primary header navigation is client-dependent: at 390px the hamburger is inert and only the brand anchor is visible; at 1440px Home/About links remain but Programs/Explore cannot expand. Footer links retain access to major routes. This is a verified progressive-enhancement limitation; absent an explicit no-JS menu requirement and given the footer fallback, it is not counted as a separate major navigation defect. The unsafe form submission is counted separately because it has an independently demonstrated data-handling consequence.

### SEO, publication and media

Titles/descriptions/canonical URLs and main content were present on all public routes. Intentional empty coupons/updates pages have `noindex, follow`; substantive editorial/legal/country pages were indexable in the inspected snapshot. Legal dates use explicit 2026-11-01 instants and a fixed display timezone; no current SSR/browser date mismatch was observed. The footer year uses `new Date().getFullYear()`; a cross-timezone New Year boundary was not tested and is not reported as a current defect.

All 36 local WebP assets were present and their authored dimensions matched intrinsic dimensions. Their payloads totaled 2,044,600 bytes; the largest was 105,112 bytes. External landing PNGs are the demonstrated resource-size issue. Local content does not depend on a remote CMS/API for initial rendering. The site's external logo/image host remains an availability dependency; normal loads succeeded, and footer logo fallback logic exists.

No sitemap, structured data or social preview image was discovered. Their absence is an optional SEO/product improvement, not inherently a correctness defect. External editorial links were inspected for current source safety, but their destination content and all official facts were not exhaustively crawled or validated. Editorial/legal approval comments are not independent proof of factual accuracy or legal adequacy.

### Deployment and performance evidence boundaries

The pipeline includes tests/build, pinned exact-commit deployment intent, SSH host checking, a non-root runtime user, loopback port publishing and a basic health check. It does not verify database readiness, run the opt-in browsers, or provide the missing submission environment in checked-in Compose. The audit inspected these files without executing their mutation/deployment steps.

No reliable field Core Web Vitals, Lighthouse score, throughput ceiling or memory-leak measurement was produced. Local route timings under concurrent audit activity/cache are not representative performance benchmarks. Resource byte counts, image dimensions and build timing are the measured performance evidence; no speed numbers were invented.

## Recommended Remediation

These are proposed next actions only. No item was implemented.

| Priority | Action                                                                                                          | Dependencies / evidence to obtain                                                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Resolve runtime submission configuration and migration state (AUD-001/003)                                      | Confirm intended production overrides and reviewed provisioning artifacts; then use an explicitly authorized disposable database/proxy environment for real roundtrips |
| 1        | Make native form behavior safe (AUD-002)                                                                        | Preserve existing JSON/API contract and hydrated validation; verify all eight forms with JS disabled, hydration delayed and ordinary success/error paths               |
| 2        | Establish compatible full Vue checking and meaningful browser gates (AUD-004)                                   | Resolve TypeScript/checker compatibility without assuming a specific upgrade/downgrade; add bounded cases for the confirmed gaps in a separate implementation task     |
| 2        | Reduce landing image transfer (AUD-005)                                                                         | Preserve artwork/layout; compare compressed responsive candidates and actual mobile transfer                                                                           |
| 3        | Correct TOC target semantics, loan field separation, modal lock ownership and redundant landmarks (AUD-006–009) | Reproduce before/after on affected routes, long section-body jumps and overlapping async responses; review approved content before editing                             |
| 3        | Reconcile current maintenance documentation (AUD-010)                                                           | Describe inspected repository state separately from historical verification and unknown live infrastructure                                                            |
| Review   | Assess compatible advisory updates and API abuse requirements (AUD-011/013)                                     | Verify reachability and policy; avoid forced dependency changes or arbitrary limits                                                                                    |
| Review   | Perform manual UI, contrast and assistive-technology review (AUD-012 and limitations)                           | Decide label semantics; use actual screen reader/speech control and representative devices                                                                             |

## Unverified Areas

- **Real PostgreSQL:** No connection, migration, fixture write, constraint roundtrip or actual successful form persistence. Database availability, privileges, TLS, backups, retention/deletion and operational access controls remain unknown.
- **Production:** No public form submission, deployed environment/proxy inspection, Docker build/run, SSH/deploy operation, remote logs or live health-readiness assessment. External overrides could affect AUD-001's production manifestation.
- **Full Vue typing:** Native Nuxt checking lacked a checker; isolated current vue-tsc could not initialize against pinned TypeScript 7.0.2. No full template-type pass is claimed.
- **Clean installation:** Existing installed dependencies were used. `npm ci` and registry-integrity reproducibility were not tested in a clean checkout/container. Manifest/lock/top-level installed consistency was checked.
- **Accessibility:** No screen-reader or speech-control session, exhaustive contrast resolution, 200–400% zoom/text-size matrix, real touch target usability study or complete WCAG conformance determination. Axe incomplete results remain unresolved.
- **Browsers/devices:** Chrome/Linux only; no Safari/iOS, Firefox, actual Android/iPhone, unusual font loading, slow/failed hydration matrix or reduced-connectivity devices.
- **Performance/reliability:** No field monitoring, controlled Lighthouse/Web Vitals benchmark, stress test, prolonged memory/observer profiling or external-host failure campaign.
- **Security:** No destructive exploitation, penetration test, full Git-history secret scan, WAF/TLS/header/DB configuration audit, sustained abuse test or proof of advisory exploitability.
- **Content:** No factual/legal certification of country admissions/visa/work rights, scholarships, loan figures, editorial provenance, approval status or legal sufficiency. No authored copy was changed.
- **External links/services:** Image GET/HEAD checks succeeded for inspected assets; every external editorial destination and its continued availability was not verified.

## Final Assessment

**The independent technical audit is complete to the available non-destructive scope.** The public presentation generally renders and navigates reliably in the tested Chrome matrix, and the existing unit/browser suites provide useful bounded confidence. They do not cover important native fallback, deployment and shared asynchronous state behavior.

The main release concerns are the checked-in submission deployment/provisioning gaps and the native GET disclosure of form data. Correcting these requires a separate authorized implementation and verification task. The report also provides reproducible lower-impact UI/accessibility findings and clearly marks unproven risks.

The available rendering/build evidence **supports proceeding to a separate manual UI and accessibility review**, with known defects and limitations supplied to the reviewer. It **does not support calling the application production-ready or confirming live enquiry persistence**. No fixes, commits, dependency changes, migrations or deployments were performed.

Final preservation check: all 183 pre-existing tracked/untracked baseline entries retained their original bytes or original absent state; existing Git modifications/deletions were preserved. This report is the only intentional repository addition. Temporary evidence/tooling and regenerated ignored build outputs are outside that source-change assertion.

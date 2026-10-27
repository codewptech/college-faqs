# College FAQs V1 — Phase B implementation report

Delivered source date: 24 October 2026. The original Phase B working-tree baseline, including its pre-existing changes, is documented in [the initial audit](phase-b-form-audit.md) and [baseline checksums](phase-b-baseline-manifest.json). The rate-limit removal uses the complete supplied college-faqs-v1-phase-b-full.zip as its baseline.

Current setup clarification, 24 October 2026: dependencies have not been installed in the owner's environment. `package-lock.json`, `.env` and `.env.example` are intentionally absent. No PostgreSQL database has been provisioned or connected; live persistence and production migration status are not verified. Authentication is not configured and is not required by the implemented public enquiry workflow. These are owner-confirmed development decisions, not accidental file loss or implementation failures.

Historical verification below used separate temporary dependencies and does not establish readiness of the owner's current environment. This correction changes concurrency feedback and documentation only; it installs nothing and configures no external service.

## A. Implementation completed

- Eight explicit, shared Zod 4.6.7 schemas replace the manual validator while preserving validateSubmission, identifiers, normalized fields and issue paths. Strict envelopes/objects, enums, length/type/range limits, conditional Other rules, zero-valued results, exam associations, Unicode/punctuation and optional omission are covered.
- One Nitro POST entry point validates and normalizes before allowlisted Prisma persistence. Contact mapping is explicit; form data stays structured JSONB. Only ID and creation time return on success. No accounts, enquiry reads, export API, dashboard, CRM or extra backend application.
- Server-only lazy Prisma 6.19.3 singleton and initial Prisma Migrate SQL. No database URL is public. Generation/build do not connect to a database. No migration was executed during the reported verification or this correction.
- All eight existing forms use the API, native/custom plus shared schema validation, pending guards, safe error feedback/focus, retained input, and persistence-confirmed dialogs. UI and dynamic controls remain. No prediction algorithm, institution application submission, callback guarantee or new consent was introduced.
- Request protections: POST only; exact JSON content type; compressed body rejection; strict 32 KiB streamed byte limit even without Content-Length; 10 second body timeout; same-origin browser checks; honeypot; 16 concurrent requests maximum; no-store responses; no request-body/PII/error-stack logging. There is no per-minute request limit or IP tracking; sequential submissions and independent repeat enquiries are permitted.
- Unique UUID idempotency key per table makes concurrent/retried identical requests return the original saved metadata. Same key with changed data returns 409. New keys permit independent repeat enquiries. Client retains key on uncertain failures, changes key when data changes, and releases it after confirmed success or explicit key conflict. No central submissions table or student deduplication.

## B. Files changed

The original Phase B file list and checksum manifest are historical snapshots, not current inventories. Git HEAD is f49b6f7; before this correction there were 21 modified tracked files, one tracked deletion and 27 untracked files. Git alone cannot isolate the uncommitted backend/removal work.

The supplied baseline ZIP was independently compared again: SHA256 `d38612e81e36e67e17b1ee323e2fcee908e2ccad96821a0a808c13c1f755b76d`, CRC valid, 135 files. Before this correction, 106 were byte-identical, 27 differed and two were intentionally absent (`package-lock.json`, `.env.example`); no project files were added relative to that archive. `.env` is also intentionally absent and is not an entry in that baseline.

- Eight differing paths relate to removal: `server/utils/submission-security.ts`, `server/utils/submission-service.ts`, `server/utils/submission-http.ts`, `app/composables/useFormSubmission.ts`, `tests/submission-api.test.mjs`, `tests/frontend-submission.test.mjs`, this report and `phase-b-verification.json`.
- The other 19 differences are owner-authorized formatting changes, retained as supplied. The complete list is under `currentCorrection.comparison.ownerAuthorizedFormattingFiles` in [verification JSON](phase-b-verification.json). Other editorial/layout differences against Git HEAD already occur in the supplied baseline and predate the removal.
- This correction modifies five existing files: the client composable, its frontend test, this report, verification JSON and the directly related README setup/preservation statements. Only README becomes an additional differing baseline path: final counts are 105 byte-identical, 28 differing and two intentionally absent, with no added project files.

## C. Database architecture

| Form                 | Prisma model / PostgreSQL table                  | Email                     |
| -------------------- | ------------------------------------------------ | ------------------------- |
| mba_mentor           | MbaMentorEnquiry / mba_mentor                    | Nullable                  |
| mba_predictor        | MbaPredictorEnquiry / mba_predictor              | Nullable                  |
| mba_application      | MbaApplicationEnquiry / mba_application          | Required                  |
| mba_start            | MbaStartEnquiry / mba_start                      | Nullable                  |
| mba_gdpi             | MbaGdpiEnquiry / mba_gdpi                        | Required                  |
| engineering_enquiry  | EngineeringEnquiry / engineering_enquiry         | Nullable                  |
| study_abroad_profile | StudyAbroadProfileEnquiry / study_abroad_profile | Nullable                  |
| study_abroad_mentor  | StudyAbroadMentorEnquiry / study_abroad_mentor   | Nullable; no input exists |

The Prisma schema defines each table with exactly: database-generated UUID id; server/database creation timestamp; unique UUID idempotencyKey; required name VARCHAR(120); required mobile VARCHAR(16); email VARCHAR(254) with the audited nullability; details JSONB. These are source definitions, not provisioned database tables. There is no updatedAt because there is no update operation. There are no relational child tables. Contacts are excluded from details. Repeating exams and college lists remain structured arrays in details.

`prisma/migrations/20261024000000_initial_submissions/migration.sql` was generated with Prisma 6 migrate diff from an empty schema and contains exactly eight form tables and their unique key indexes. UUID generation uses PostgreSQL gen_random_uuid(). Review before applying.

## D. API integration

All forms in the table above post `{ form, fields }` to `/api/submissions`. The client allowlists actual named controls and explicitly constructs predictor/GDPI arrays. Study Abroad retains input name while validated output uses fullName. No database metadata or client-supplied timestamps/IDs enter persistence.

Success: HTTP 201 `{ ok: true, submission: { id, createdAt } }`, only after create or verification of an already-persisted identical request. Failures: HTTP 400 invalid JSON/request key/trap, 403 origin, 405 method, 408 body timeout, 409 key conflict, 413 body limit, 415 content type/encoding, 422 contract validation, 429 concurrent request capacity exhausted, 503 database availability, 500 unexpected error. Error bodies use `{ ok: false, error: { code, message, issues? } }`; Retry-After: 1 is supplied only for concurrent request overload, and Allow for unsupported methods. Capacity becomes available as soon as an in-flight request finishes, without a time-based cooldown. No public retrieval method exists.

The client now displays "We're handling several enquiries right now. Please try again in a moment." for `TOO_MANY_REQUESTS` and the HTTP 429 fallback. The 16-request capacity, response code/header, release behavior, validation, idempotency and submission lifecycle are unchanged. No frequency limit or client waiting timer was added.

## E. Verification results

Original Phase B verification supplied with the baseline ZIP (historically reported results on Node 24.18.0, not rerun during this correction). The `rateLimitRemoval` JSON record is also historical; current correction checks are recorded separately under `currentCorrection`:

| Check                                                                                | Result                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| npm test                                                                             | 190 tests passed, 0 failed, including original tests and new contract, mapping/idempotency, real local HTTP with mock persistence, and frontend handler/composable cases                   |
| Dedicated vue-tsc --build                                                            | Passed all Nuxt project references, using temporary TypeScript 5.9.3/vue-tsc 3.1.4 tooling                                                                                                 |
| Prisma Client generation                                                             | Passed, client 6.19.3                                                                                                                                                                      |
| Prisma schema validation                                                             | Passed using dummy local URLs; no database connection                                                                                                                                      |
| Prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script | Passed offline; migration matches generated SQL                                                                                                                                            |
| npm run build                                                                        | Passed full Nuxt SSR/Nitro build; build generates client first                                                                                                                             |
| Actual Chrome browser checks                                                         | 152 passed, 0 failed; all 8 forms, pending/duplicate events, invalid focus, server/network failures, retry keys, confirmed dialogs, exam arrays, 390/1280 pixel layouts, no browser errors |
| Standalone .output smoke                                                             | Copied only .output to a temporary directory; health 200, SSR page 200, intentionally unreachable localhost DB 503 with safe DATABASE_UNAVAILABLE; native Prisma engine included           |
| Protected-file hashes / original file preservation                                   | All 5 protected files byte-identical; no original files removed; existing 3 test files unchanged                                                                                           |
| ZIP validation/extraction                                                            | See phase-b-verification.json and archive integrity artifacts; all archived source files verified after extraction                                                                         |

`npm test` explicitly uses Node's --test-isolation=none. The original report described default child isolation reporting file wrappers without executing the existing async test registrations; explicit isolation executed and counted 190 tests. HTTP tests require permission to bind ephemeral localhost ports in restricted environments. Ordinary tests require no live DB. Generate Prisma Client before tests after a clean install.

Exact dependency additions: @prisma/client 6.19.3 and zod 4.6.7 dependencies; prisma 6.19.3 dev dependency. The only supporting addition is @types/node 24.10.1 as a dev dependency, required to type-check new Nitro Node primitives such as IncomingMessage, Buffer, process and crypto. Existing dependency ranges are unchanged. No test framework, adapter, driver, runtime service or UI dependency was added.

The original verification report described installing temporary dependencies using --no-save --package-lock=false, with TypeScript, vue-tsc and playwright-core outside the project. That historical environment is distinct from the owner's uninstalled current environment. Its reported npm advisories were not independently audited or remediated during this correction.

Not verified: live Neon connectivity/persistence, applying migration SQL to a development or production database, production Docker/CI npm ci after lock synchronization, production environment injection, production deployment and external proxy behavior. Successful persistence is covered with isolated/mock database delegates and HTTP API tests. No supplied credentials or production systems were accessed.

### Rate-limit removal verification

Historical rate-limit-removal verification reported 191 automated tests and 152 browser assertions passing across all eight forms at 390/1280 pixels; TypeScript 5.9.3/vue-tsc 3.3.5, Prisma 6.19.3 validation/client generation and a Nuxt build using temporary cached dependencies passed. The HTTP regression accepted 24 valid requests with distinct keys within one minute using injected persistence, then still rejected invalid input. Idempotency, form contracts, body-size limits and concurrency handling passed. The delivery report recorded 24 built-API requests in 127 ms returning safe DATABASE_UNAVAILABLE responses without 429/Retry-After, and a stalled-body 408 after 10,012 ms. These are historical observations, not newly executed checks or live database writes.

The earlier independent audit in this conversation also executed 191 passing tests, 152 passing browser assertions, TypeScript verification, Prisma validation and the cached-dependency Nuxt build in a disposable copy. Its initial HTTP-test attempt was blocked by sandbox port permissions; the permitted rerun passed. Actual PostgreSQL persistence was not verified. Neither that audit nor this correction establishes production migration status.

Correction verification: dependency-free execution of the actual composable with stubbed imports checks the approved message, HTTP 429 fallbacks, other errors and request lifecycle. JSON parsing, baseline comparison and before/after scope checks are performed separately. Full application tests, browser tests, type checks, Prisma validation and Nuxt build are NOT RUN during this correction because project dependencies are intentionally uninstalled; none were installed. Exact correction results are in `currentCorrection` in [verification JSON](phase-b-verification.json).

The previous claims of exactly eight changed files, 127 unchanged files and preservation of every original/protected file do not describe the current working tree. Section B supplies the measured pre-correction and final counts. Earlier archive claims are retained only as explicitly labeled historical reports in verification JSON; no replacement archive was created.

## F. Protected files and baseline

Against the verified pre-removal ZIP, `Dockerfile`, `compose.yaml`, `.dockerignore`, `.github/workflows/deploy-production.yml`, `package.json`, the Prisma schema and migration files remain byte-identical. `package-lock.json` and `.env.example` are intentionally absent. Several form pages, contracts and storage files retain owner-authorized formatting differences; they are not byte-identical. No protected application, dependency, schema or deployment files were modified by this correction.

**There is currently no lockfile.** Existing Docker copies `package-lock.json` and runs `npm ci`; CI also uses `npm ci`. A generated, synchronized lockfile and installed dependencies are future setup prerequisites. The older baseline lockfile had a dependency mismatch, but that historical file is not the current setup. No Docker/CI bypass or lockfile change was made.

## G. Remaining owner actions and exact setup commands

1. Review source, dependency additions, SQL and unpublished privacy/terms wording. Approve and publish appropriate legal content before public information collection; this implementation does not invent consent, retention periods or policy promises.
2. When the owner starts dependency setup, generate a synchronized lockfile and install dependencies. These are future commands, NOT executed during this correction:

```bash
npm install --package-lock-only
npm ci
```

3. Provision a PostgreSQL development database (Neon is an option). Environment setup is pending: neither `.env` nor `.env.example` exists. Configure server-only variables through the chosen local environment mechanism; create a local `.env` only as a future setup action if needed. Set DATABASE_URL and DIRECT_URL to the SAME development database, and SUBMISSIONS_ORIGIN to the browser origin. No copy-from-template command is currently available. After that setup:

```bash
npm run db:generate
npm run db:validate
```

Prisma 6.19.3 uses datasource url/directUrl in schema.prisma and the bundled prisma-client-js TCP engine. No Prisma 7 config or driver adapter is used. Runtime needs DATABASE_URL; schema validation and migration commands need the configured DIRECT_URL as well. Each Node process owns one client/pool. Choose connection settings for the eventual database provider and total processes; no current example configures them. Prisma opens lazily; requests do not create/disconnect separate pools.

4. Inspect migration status and apply the reviewed included migration to the **development database only**. migrate deploy applies checked-in migrations without a shadow database:

```bash
npx prisma migrate status
npm run db:migrate:deploy
npm test
npm run build
```

For authoring future changes on a disposable development branch with shadow-database permissions:

```bash
npm run db:migrate:dev -- --name describe_your_change
```

Do not point migrate dev at production. Do not use reset or db push as a production migration shortcut.

5. Later, only after owner review/authorization, supply production pooled DATABASE_URL and direct DIRECT_URL through the server's secure environment mechanism, verify target identity, review migration status/SQL, take the owner's normal recovery precautions, and apply the reviewed checked-in migration:

```bash
# Run only in the reviewed, authorized production environment.
npm run db:generate
npx prisma migrate status
npm run db:migrate:deploy
```

This production block is documentation, not an executed action. Existing Compose does NOT forward these database variables or SUBMISSIONS_ORIGIN. The owner must arrange separately reviewed server-side environment injection before launch; merely exporting a host variable does not pass it into the current container. No such deployment change was made here.

6. Set SUBMISSIONS_ORIGIN to the actual public HTTPS origin behind the existing TLS proxy. Forwarded host/proto headers are deliberately not trusted. Without that configured origin, browser submissions behind TLS termination can fail origin validation. The independent process-local safeguard allows at most 16 in-flight requests and releases capacity when each request finishes. There is no IP-based or time-window-based request limit. No paid service/infrastructure is required by this implementation.

7. Verify real development submissions and authorized production operation after credentials, migrations, policies, lockfile and deployment environment are ready. Operational staff retrieval/exports are outside this implementation; there is no public enquiry data endpoint.

### Reproducing optional verification tooling

The implementation does not add verification-only packages to package.json. The following are future reproduction instructions after project dependency setup, not commands executed during this correction. They use the tooling versions reported by the historical removal verification:

```bash
npm install --prefix /tmp/college-faqs-verification --package-lock=false --ignore-scripts typescript@5.9.3 vue-tsc@3.3.5 playwright-core@1.64.1
npx nuxt prepare
/tmp/college-faqs-verification/node_modules/.bin/vue-tsc --build --pretty false
# Run the built app locally without production credentials on port 3407.
NITRO_HOST=127.0.0.1 NITRO_PORT=3407 node .output/server/index.mjs
# In another terminal; Chrome must already be available:
PLAYWRIGHT_MODULE=/tmp/college-faqs-verification/node_modules/playwright-core/index.mjs TEST_BASE_URL=http://127.0.0.1:3407 CHROME_BIN=/usr/bin/google-chrome node tests/frontend-browser.mjs
```

The browser harness expects the local server to have no database configured for its final actual 503 check; other frontend persistence responses are deliberately mocked. No simulated success is presented as live Neon persistence.

Version-specific implementation references: [Prisma 6 datasource/directUrl](https://docs.prisma.io/docs/orm/v6/reference/prisma-config-reference), [Prisma 6 connection lifecycle](https://www.prisma.io/docs/orm/v6/prisma-client/setup-and-configuration/databases-connections/connection-management), [Zod 4 API migration reference](https://zod.dev/v4/changelog). Existing repository conventions remain the implementation source of truth.

# Dependency and submission-abuse review v1

Reviewed 1 November 2026. No dependencies, lockfile, application abuse controls,
personal-data collection or production settings were changed. Neither risk below
has been accepted on the owner's behalf.

## AUD-011 — RISK ACCEPTANCE REQUIRED

The fresh read-only command `npm audit --json --ignore-scripts --fetch-retries=0
--fetch-timeout=15000 --cache /tmp/college-remediation/npm-cache` returned exit 1:
**17 affected package names (3 High, 12 Moderate, 2 Low)**. They derive from **four
unique upstream advisories**; parent/dependent propagation is not additional CVEs.
The result is `/tmp/college-remediation/npm-audit-recheck.json`.

| Installed affected versions              | Dependency chain / use                                                             | Prerequisites and observed reachability                                                                                                                                                                                                                                                                          | Upstream fix and disposition                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| deepmerge 4.3.1                          | Nuxt → Nitro build tools → `@rollup/plugin-node-resolve` → deepmerge               | Prototype poisoning needs malicious merged objects. The inspected resolver call merges built-in defaults, not form input. No corresponding generated runtime package/source-map path found.                                                                                                                      | [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4), CVE-2026-93753, Low. No patched version listed. Monitor upstream; do not invent a safe override.                                                                                                                                                             |
| deepmerge-ts 7.1.5                       | Prisma CLI 6.19.3 → `@prisma/config` → deepmerge-ts                                | Requires recursive object graphs at matching property paths. Plain JSON cannot create this condition. The current caller loads trusted local Prisma JS/TS config; this repository has no such config file. No form-input or runtime path found.                                                                  | [Maintainer GHSA-ggr8-5vv4-36mx](https://github.com/RebeccaStevens/deepmerge-ts/security/advisories/GHSA-ggr8-5vv4-36mx), CVE-2026-40345, High upstream; patched ≥8.0.0. All three High npm package entries are this same advisory propagated to Prisma/config. Major transitive or Prisma changes need compatibility review/approval. |
| glob 13.0.6, nested 10.5.0               | Nuxt → Nitro build tracing/archive tooling → `@vercel/nft` / archiver-utils → glob | Aborted traversal can continue filesystem work. Examined NFT calls scan build-source asset paths without a cancellation signal; no request-controlled traversal/runtime package found.                                                                                                                           | [Maintainer GHSA-3g3m-2fjr-6pw4](https://github.com/isaacs/node-glob/security/advisories/GHSA-3g3m-2fjr-6pw4), CVE-2026-118773, Moderate; patched ≥14.0.2. Major changes from current versions need tests; no compatible override proved here.                                                                                         |
| minimatch 10.2.6, nested 9.0.9 and 5.1.9 | glob / archiver / readdir-glob build/archive dependencies                          | Registry flags <11.0.1; the [maintainer description](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249) specifically concerns 10.2.6 with optimizationLevel ≥2 and attacker-controlled patterns. Older nested nodes were not independently exploited. No application input path found. | GHSA-g3hv-75wg-m249, CVE-2026-118764, Moderate; patched 11.0.1. Forcing one new major across older callers could change APIs/module behavior; review parent releases rather than blanket overrides.                                                                                                                                    |

Installed versions still match the lockfile. The inspected generated runtime
manifest/directories and server source-map paths contain none of the four affected
packages or flagged build parents. This narrows observed deployment reachability;
it does not prove that all development/build configurations are immune. npm's
production/development package labels alone do not prove Docker artifact exposure.

No project-compatible dependency fix was established without dependency changes.
The automated proposal includes a major Prisma upgrade and an apparent Nuxt
downgrade outside the current manifest range. Neither is justified as an automatic
remediation, and `npm audit fix --force` was not run.

**Proposed owner decision:** Within seven days (by 8 November 2026), assign review
of compatible parent/transitive releases and decide whether to approve a tested
update or accept the presently bounded toolchain exposure with a review date.
Until that decision, preserve trusted build inputs and the existing `.output`-only
runtime boundary; refresh advisories weekly and immediately reassess if untrusted
config/pattern input or affected runtime bundling is introduced. This is a proposal,
not an accepted risk decision or a claim that a High application exploit exists.

## AUD-013 — RISK ACCEPTANCE REQUIRED

The existing public API still provides:

- POST-only, strict JSON content type/encoding checks; 32KiB streamed byte bound,
  strict UTF-8 and a 10-second body-read deadline.
- Strict shared Zod form/field schemas and bounded contact/text/numeric inputs.
- Exact configured browser-origin validation, rejection of cross-site browser
  requests, and the existing honeypot header check. Uncontrolled forwarded headers
  remain untrusted. These checks do not authenticate non-browser clients.
- At most 16 in-flight requests per Node process, with release on completion/error.
- Database-enforced per-form UUID request-key uniqueness, identical retry handling
  and conflict rejection. New keys intentionally permit legitimate repeat enquiries.
- Safe response/log error codes; no public enquiry retrieval/export endpoint.

The real disposable PostgreSQL regression verified committed writes, legitimate
new-key repeats, concurrent same-key retries, DB uniqueness, invalid/origin rejection
and safe unavailable-DB behavior. Existing API regressions cover body/method/origin/
concurrency limits. No load attack, sustained spam test, new tracking or new control
was introduced.

The process guard does not impose a time-window/source quota. Automated clients
can supply valid-looking fields and new UUIDs; storage/staff-capacity impact depends
on actual traffic and upstream protections. Proxy/WAF policies, retention and
production metrics were not inspected, so there is no evidence of an active attack
or a justified numeric threshold.

**Proposed owner decision:** Confirm expected traffic, existing upstream safeguards,
retention/operational monitoring and the desired response to repeated automated
enquiries. Then approve a proportionate control or explicitly accept the present
posture with a review date. Any CAPTCHA, IP logging, new identifying data, external
service or new sustained rate restriction requires separate operational/privacy
approval. Preserve legitimate repeat-enquiry and idempotency semantics. This
review does not authorize live infrastructure inspection or changes.

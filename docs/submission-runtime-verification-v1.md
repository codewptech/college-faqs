# Submission runtime and isolated verification v1

Verified locally on 1 November 2026. Live production configuration and database
state remain unverified. No production service, secret, migration or record was
accessed or changed.

## Configuration contract

| Setting               | Responsibility                                                                                                                                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`        | Server-only PostgreSQL runtime URL, supplied privately by the operator. Compose explicitly requires and forwards it. Never use `NUXT_PUBLIC_*`.                                                                                                    |
| `SUBMISSIONS_ORIGIN`  | Exact public browser origin, such as the local development origin in `.env.example`. No path, credentials or trailing slash. Required explicitly by Compose. Behind TLS termination this is the public HTTPS origin, even if the upstream is HTTP. |
| `DIRECT_URL`          | Existing Prisma schema/CLI workflow requires a direct URL for the same database. Supply for schema validation/migration commands when appropriate. It is not required or forwarded by the Nitro runtime service.                                   |
| `NITRO_HOST=0.0.0.0`  | Listen on container interfaces so Docker can forward traffic.                                                                                                                                                                                      |
| `127.0.0.1:3002:3002` | Publish only on host loopback. This is different from the container's listening interface.                                                                                                                                                         |

Compose's required-variable interpolation prevents starting the checked-in service
without explicit DB/origin settings. A host `.env` alone is not container runtime
environment: only the two declared substitutions are forwarded. `.env` remains
excluded from Docker build context. No real credentials are in the example.
Forwarded host/protocol headers remain untrusted by the API; strict browser-origin
validation is preserved. No Dockerfile, live proxy or deployment workflow was changed.

Docker/Compose is not installed in the verification environment, so actual Compose
construction/start and live TLS termination were not tested. YAML parsing verified
the substitutions and preserved interface bindings. A real local HTTP forwarding
proxy preserved a synthetic HTTPS Origin over the HTTP upstream during the real
database integration test; an incorrect Origin returned 403 before persistence.

## Private readiness versus liveness

`GET /api/health` is unchanged liveness: the Node server responds. It is not proof
that any enquiry can be saved.

Run `node scripts/check-submission-readiness.mjs` only with explicitly authorized
server-side environment variables. The script does **not** load `.env` itself or
add an HTTP endpoint. It validates configured origin presence, connects using the
provided database URL, and checks catalog presence of the eight enquiry tables.
A parent process kills the probe after five seconds. Output is a generic status;
database URLs, stack traces and submitted records are never printed. It reads only
catalog metadata and performs no write or enquiry-data query.

Run this CLI from a repository/tooling checkout with its generated Prisma Client.
The unchanged runtime image copies only `.output`; it does not package this source
script. The CLI checks the explicitly supplied target, not a live container's
environment unless separately and correctly provided by its operator.

A readiness success confirms that bounded connection/catalog check only. It does
not certify write privileges, column/index equivalence, production migration
history, TLS/proxy correctness, or an actual committed submission. Those require
separately authorized evidence. Missing configuration, wrong-origin format,
unavailable database and a stalled TCP negotiation were tested. An empty database
failed; the migrated disposable database passed.

Targeted regression command:

```bash
node --experimental-strip-types --test --test-isolation=none tests/submission-readiness.test.mjs
```

Two tests passed, including an actual stalled loopback connection terminated in
about five seconds. A restricted sandbox needs permission for these local sockets.

## Real disposable PostgreSQL verification

No PostgreSQL installation or Docker was initially available. PostgreSQL 18.6
executable binaries were downloaded using `npm pack @embedded-postgres/linux-x64@18.6.0-beta.19
--ignore-scripts` into `/tmp/college-remediation` only. No project/system package was
installed. Package-local symlinks were inspected/reconstituted under that directory.
`initdb` initialized a **new**, private, current-user cluster; `pg_ctl` started only
that cluster on `127.0.0.1:35473`. Existing services/containers were not touched.

The reviewed, byte-identical migration candidate described in
[migration reconciliation](migration-reconciliation-v1.md) was copied to a
temporary Prisma project. Both connection variables were explicitly supplied;
commands ran from that temporary directory, without loading repository `.env`.
Only newly created `college_faqs_remediation_…` databases were migrated.

The opt-in regression is outside the default test glob:

```bash
# Set both values explicitly for a NEW migrated disposable database/cluster.
COLLEGE_FAQS_DISPOSABLE_DATABASE_URL="$DISPOSABLE_URL" \
COLLEGE_FAQS_DISPOSABLE_CLUSTER_DIRECTORY="$DISPOSABLE_CLUSTER_DIRECTORY" \
node --experimental-strip-types tests/integration/submission-postgres.mjs
```

It rejects non-loopback/default-port URLs, unexpected database/role/schema,
host overrides, cluster directories outside temporary storage or belonging to
another user, non-private clusters, a connected server whose `data_directory`
differs, and nonempty enquiry tables. It never loads `.env`, creates migrations,
resets a database or deletes rows. Provisioning a fresh target is a separate,
explicit step; running twice on the same populated target intentionally fails.

Actual final results:

- One reviewed migration applied to a newly created empty database; eight tables
  and eight unique request-key indexes verified. Prisma diff against the current
  schema reported **No difference detected** (exit 0).
- All eight API forms persisted through real H3 HTTP handling and a local proxy.
  An independent Prisma client read the committed contact columns, JSONB details,
  UUID key/ID and database timestamp from the intended model.
- Each form committed two legitimate submissions. Four concurrent retries of the
  first key returned identical metadata without extra rows. Changed data using
  that key returned 409; direct duplicate insertion produced real DB `P2002`.
- Invalid input returned 422 and wrong Origin 403 without writes. Missing and
  actually unreachable DB paths returned safe 503 responses. Logs contained only
  bounded error codes. **16 synthetic records** were committed in the final run.

Exact temporary evidence: `postgres-integration-final.json`,
`disposable-migration-final.log`, `disposable-schema-diff-final.log`,
`disposable-run-metadata.json`, `readiness-empty-db.log`,
`readiness-migrated-db.log`, `readiness-tests-final.log`, and the reproducible
temporary coordinator `run-postgres-verification.mjs`, all under
`/tmp/college-remediation`. These paths are temporary, not deployment artifacts.

These real local roundtrips establish isolated persistence, not the state of the
production database or its migration history. The owner explicitly instructed
**PRESERVE THE DELETIONS** for both repository migration artifacts. They remain
absent; future restoration/replacement requires separate approval (AUD-003
**DEFERRED — APPROVAL REQUIRED**). No production migration is authorized by local
success.

## Final built application and browser bridge

After resuming the interrupted remediation, the same explicitly owned disposable
database was reused without creating, regenerating or applying any migration.
A separate child ran the final `.output/server/index.mjs` on loopback port 3421,
with only that synthetic `DATABASE_URL` and its exact local `SUBMISSIONS_ORIGIN`;
`DIRECT_URL` was deliberately omitted. The test verified the connected database,
role, private current-user cluster directory and PostgreSQL `data_directory`
before permitting synthetic writes. Repository `.env` was not loaded.

Actual hydrated forms, using real submit-button mouse clicks and unmocked network
requests, returned HTTP 201 through the built Nitro endpoint for **all eight
forms**. Independent Prisma reads verified committed IDs, timestamps, request keys,
contact columns and normalized JSONB in each intended model. Each same-key retry
returned the same saved metadata without another row; wrong Origins returned 403.
Eight additional synthetic rows were committed. A forced native URL-encoded POST
returned 415 without echoing the synthetic marker. Browser errors/hydration warnings
and submitted-value leakage in captured server logs were absent in this run.

Evidence: `/tmp/college-remediation/built-browser-postgres.mjs`,
`built-browser-postgres-results.json`, `built-browser-postgres.log` and
`built-browser-postgres-preview.log`. Run command was
`node --experimental-strip-types /tmp/college-remediation/built-browser-postgres.mjs`.
These temporary artifacts contain only the owned local test target and synthetic
fixtures. No production configuration, data, migration or deployment was touched.

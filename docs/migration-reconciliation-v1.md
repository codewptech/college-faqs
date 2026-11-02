# Migration reconciliation proposal v1

Prepared 1 November 2026 against the current working tree. This is a proposal,
not authorization to alter any existing database or migration history.

**Owner decision: PRESERVE THE DELETIONS.** Neither migration artifact was restored.
AUD-003 remains **DEFERRED — APPROVAL REQUIRED** for any future restoration or
replacement of versioned provisioning artifacts. Passing a candidate against a
new disposable database does not override this decision.

## Independently established state

- The working tree deletes `prisma/migrations/20261024000000_initial_submissions/migration.sql`
  and `prisma/migrations/migration_lock.toml`. Those deletions remain preserved.
- Git history introduces both artifacts in commit
  `c357a0b6886460e8b36fecf460cbb4c37dd1b4f8` (“Make backend and home page completely”).
  No later committed change to these artifacts explains the working-tree deletions.
  Their intent cannot be inferred from their absence or historical documentation.
- The initial SQL at current HEAD is **byte-identical** to newly generated SQL from
  the current Prisma schema, using Prisma 6.19.3:
  `prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`.
  It creates eight enquiry tables and eight unique UUID request-key indexes.
- The reviewed SQL has 4,053 bytes and SHA-256
  `25ece7067ae7aec23c2bb820ef217f9e00a663eeb527c23b3f7118937c61848a`.
  The 24-byte migration lock has SHA-256
  `1db17a8d051aa136110736752c5e1f8b7ed92b6ea8e803112fbbe2497047c210`
  and contains `provider = "postgresql"` followed by a newline.
- Review candidates are saved outside the repository at
  `/tmp/college-remediation/candidate-reviewed-initial-migration.sql` and
  `/tmp/college-remediation/candidate-migration-lock.toml`. The current-schema
  comparison is `/tmp/college-remediation/current-schema.sql`. These temporary
  files may not survive cleanup; the source artifacts remain recoverable from
  the identified commit. No previous ZIP was used.

## Reviewed future proposal, not approved for implementation

Only if the owner separately authorizes reversing the preserved deletions, restore **only** the
two paths above from the reviewed HEAD content, then compare their bytes/hashes
again. Do not run a checkout/reset affecting other user work. This restores a
reproducible provisioning history without changing the Prisma model/API contract.

The current instruction is to preserve them. A future provisioning replacement
requires separate review/approval. Do not silently substitute schema generation
or `db push` for migration history, and do not infer the live database's state
from the owner-directed repository deletion.

Restoring repository artifacts does **not** authorize applying them to production.

## Database decision boundary

The production database was not accessed. Its tables, existing records,
`_prisma_migrations`, privileges and drift are unverified. Before any separately
authorized database operation, identify the target and inspect its actual state:

| Observed target state                                     | Safe next decision                                                                                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Newly created, empty disposable database                  | Apply the reviewed migration there and verify schema and synthetic roundtrips. This is the only migration target used by this remediation. |
| Existing schema and matching successful migration history | Preserve it; verify expected state without reinitialization.                                                                               |
| Existing matching tables without migration history        | Prepare a reviewed baseline/resolve proposal after proving equality; do not apply an initial CREATE TABLE migration automatically.         |
| Schema or migration-history drift                         | Stop automatic application and report the exact mismatch for review.                                                                       |
| Production unavailable                                    | Leave live state unverified; local success does not establish production readiness.                                                        |

Never reset an existing database, run `db push` against production, rewrite live
migration history, or use student records as fixtures. The isolated verification
uses a new loopback-only PostgreSQL cluster under `/tmp`, synthetic records and an
explicit `college_faqs_remediation_…` database; it does not load repository `.env`.
Results are recorded in the final remediation verification report.

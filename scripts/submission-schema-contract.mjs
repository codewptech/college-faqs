/** Private catalog-only compatibility check for the unchanged eight-model contract.
 * No enquiry rows, DDL, migration history or credentials are read or printed.
 * This is a conservative readiness gate, not a general schema-diff engine.
 */
export const submissionTables = Object.freeze([
  "mba_mentor",
  "mba_predictor",
  "mba_application",
  "mba_start",
  "mba_gdpi",
  "engineering_enquiry",
  "study_abroad_profile",
  "study_abroad_mentor",
]);

export async function readSubmissionCatalog(prisma) {
  const columns = await prisma.$queryRaw`
    SELECT c.relname AS "table", a.attname AS name,
      format_type(a.atttypid, a.atttypmod) AS type, a.attnotnull AS required,
      pg_get_expr(d.adbin, d.adrelid) AS "default",
      has_column_privilege(c.oid, a.attnum, 'SELECT') AS selectable,
      has_column_privilege(c.oid, a.attnum, 'INSERT') AS insertable
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    JOIN pg_attribute a ON a.attrelid=c.oid
    LEFT JOIN pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum
    WHERE n.nspname=current_schema() AND c.relkind IN ('r', 'p')
      AND a.attnum > 0 AND NOT a.attisdropped
  `;
  const indexes = await prisma.$queryRaw`
    SELECT c.relname AS "table", i.indisprimary AS primary,
      ARRAY(SELECT a.attname::text FROM unnest(i.indkey) WITH ORDINALITY k(num, ord)
        JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum=k.num ORDER BY k.ord) AS columns
    FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname=current_schema() AND i.indisunique AND i.indisvalid
      AND i.indisready AND i.indpred IS NULL AND i.indexprs IS NULL
      AND i.indnkeyatts=1 AND i.indnatts=1
  `;
  const tables = await prisma.$queryRaw`
    SELECT c.relname AS "table", c.relrowsecurity AS "rowSecurity"
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname=current_schema() AND c.relkind IN ('r', 'p')
  `;
  const permissions = await prisma.$queryRaw`
    SELECT has_schema_privilege(current_schema(), 'USAGE') AS "schemaUsage",
      has_function_privilege('gen_random_uuid()', 'EXECUTE') AS "uuidExecutable"
  `;
  return { columns, indexes, tables, permissions };
}

export function submissionCatalogCompatible({
  columns,
  indexes,
  tables,
  permissions,
}) {
  if (!permissions[0]?.schemaUsage || !permissions[0]?.uuidExecutable)
    return false;
  return submissionTables.every((table) => {
    const found = tables.filter((entry) => entry.table === table);
    // Policies can change write behavior; require a separate review if RLS is on.
    if (found.length !== 1 || found[0].rowSecurity) return false;
    const expected = {
      id: ["uuid", true, /^(?:pg_catalog\.)?gen_random_uuid\(\)$/],
      createdAt: [
        "timestamp(3) with time zone",
        true,
        /^(?:now\(\)|CURRENT_TIMESTAMP)$/i,
      ],
      idempotencyKey: ["uuid", true],
      name: ["character varying(120)", true],
      mobile: ["character varying(16)", true],
      email: [
        "character varying(254)",
        ["mba_application", "mba_gdpi"].includes(table),
      ],
      details: ["jsonb", true],
    };
    const actual = columns.filter((column) => column.table === table);
    if (actual.length !== Object.keys(expected).length) return false;
    if (
      !actual.every((column) => {
        const contract = expected[column.name];
        return (
          contract &&
          column.type === contract[0] &&
          column.required === contract[1] &&
          column.selectable &&
          column.insertable &&
          (!contract[2] || contract[2].test(column.default ?? ""))
        );
      })
    )
      return false;
    return (
      indexes.some(
        (index) =>
          index.table === table &&
          index.primary &&
          index.columns.length === 1 &&
          index.columns[0] === "id",
      ) &&
      indexes.some(
        (index) =>
          index.table === table &&
          index.columns.length === 1 &&
          index.columns[0] === "idempotencyKey",
      )
    );
  });
}

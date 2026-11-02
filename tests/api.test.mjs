import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { request } from "node:http";
import { after, test } from "node:test";
import { PrismaClient } from "@prisma/client";
import { context } from "./helpers/context.mjs";
import { forms } from "./fixtures.mjs";

const db = new PrismaClient({ datasourceUrl: context.database, log: [] });
after(() => db.$disconnect());
const sample = { form: forms[0].form, fields: forms[0].fields };
async function send(
  body = sample,
  { key = randomUUID(), headers = {}, method = "POST", raw } = {},
) {
  const response = await fetch(`${context.origin}/api/submissions`, {
    method,
    headers: {
      "content-type": "application/json",
      origin: context.origin,
      "idempotency-key": key,
      ...headers,
    },
    ...(method === "GET" || method === "HEAD"
      ? {}
      : { body: raw ?? JSON.stringify(body) }),
  });
  return {
    status: response.status,
    headers: response.headers,
    body: await response.json(),
  };
}
const rows = (table) =>
  db.$queryRawUnsafe(`SELECT * FROM "${table}" ORDER BY id`);
const total = async () =>
  (
    await Promise.all(
      forms.map(async ({ table }) => (await rows(table)).length),
    )
  ).reduce((a, b) => a + b, 0);

test("every enquiry form commits its contact and structured details before returning success", async (t) => {
  for (const fixture of forms)
    await t.test(fixture.form, async () => {
      const key = randomUUID();
      const result = await send(
        { form: fixture.form, fields: fixture.fields },
        { key },
      );
      assert.equal(result.status, 201);
      assert.deepEqual(Object.keys(result.body).sort(), ["ok", "submission"]);
      assert.equal(result.body.ok, true);
      assert.deepEqual(Object.keys(result.body.submission).sort(), [
        "createdAt",
        "id",
      ]);
      const record = (await rows(fixture.table)).find(
        (row) => row.id === result.body.submission.id,
      );
      assert.ok(
        record,
        "independent database connection sees the committed record",
      );
      assert.equal(record.name, fixture.fields.fullName ?? fixture.fields.name);
      assert.equal(record.mobile, "+919999999999");
      assert.equal(record.email, fixture.fields.email ?? null);
      assert.deepEqual(record.details, fixture.details);
      assert.equal(record.idempotencyKey, key);
      assert.equal(
        record.createdAt.toISOString(),
        result.body.submission.createdAt,
      );
      assert.equal(result.headers.get("cache-control"), "no-store");
      assert.equal(result.headers.get("x-content-type-options"), "nosniff");
    });
});

test("concurrent retries reuse a saved enquiry, conflicts preserve it, and new enquiries remain independent", async () => {
  const before = (await rows("mba_mentor")).length;
  const key = randomUUID();
  const replies = await Promise.all(
    Array.from({ length: 4 }, () => send(sample, { key })),
  );
  for (const reply of replies) {
    assert.equal(reply.status, 201);
    assert.deepEqual(reply.body, replies[0].body);
  }
  assert.equal((await rows("mba_mentor")).length, before + 1);
  const conflict = await send(
    {
      ...sample,
      fields: { ...sample.fields, fullName: "Different SYNTHETIC Student" },
    },
    { key },
  );
  assert.equal(conflict.status, 409);
  assert.equal((await rows("mba_mentor")).length, before + 1);
  const next = await send();
  assert.equal(next.status, 201);
  assert.notEqual(next.body.submission.id, replies[0].body.submission.id);
  assert.equal((await rows("mba_mentor")).length, before + 2);
});

test("invalid fields and conditional results produce useful errors without persisting or echoing personal data", async () => {
  const before = await total();
  const invalid = [
    null,
    [],
    { form: "unknown", fields: {} },
    { ...sample, fields: { ...sample.fields, phone: "SENSITIVE_INVALID" } },
    { ...sample, fields: { ...sample.fields, extra: "SENSITIVE_INVALID" } },
    {
      form: "mba_predictor",
      fields: { ...forms[1].fields, exams: [{ exam: "cat", percentile: 101 }] },
    },
    {
      form: "mba_predictor",
      fields: { ...forms[1].fields, exams: [{ exam: "other", score: 0 }] },
    },
    { form: "mba_application", fields: { ...forms[2].fields, exam: "" } },
    {
      form: "study_abroad_profile",
      fields: { ...forms[6].fields, otherStudyLevel: "" },
    },
  ];
  invalid.push(...forms.map(({ form }) => ({ form, fields: {} })));
  for (const body of invalid) {
    const result = await send(body);
    assert.equal(result.status, 422);
    assert.equal(result.body.ok, false);
    assert.ok(result.body.error.issues.length);
    assert.ok(
      result.body.error.issues.every(
        (issue) => typeof issue.field === "string" && issue.message,
      ),
    );
    assert.doesNotMatch(
      JSON.stringify(result.body),
      /SENSITIVE_INVALID|SYNTHETIC Student|postgresql:\/\//,
    );
  }
  assert.equal(await total(), before);
});

test("HTTP rejects malformed JSON/encoding, unsupported methods, oversized bodies, invalid keys and foreign origins safely", async () => {
  const before = await total();
  const cases = [
    [{ raw: "{" }, 400],
    [{ raw: Buffer.from([0xc3, 0x28]) }, 400],
    [
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        raw: "name=SENSITIVE_INVALID",
      },
      415,
    ],
    [{ headers: { "content-encoding": "gzip" } }, 415],
    [{ key: "not-a-uuid" }, 400],
    [{ headers: { "x-submission-trap": "bot" } }, 400],
    [{ headers: { origin: "https://foreign.example.invalid" } }, 403],
    [{ headers: { "sec-fetch-site": "cross-site" } }, 403],
    [{ raw: "x".repeat(100_000) }, 413],
    [{ method: "GET" }, 405],
  ];
  for (const [options, expected] of cases) {
    const result = await send(sample, options);
    assert.equal(result.status, expected);
    assert.equal(result.body.ok, false);
    assert.doesNotMatch(
      JSON.stringify(result.body),
      /SENSITIVE_INVALID|SYNTHETIC Student|Prisma|postgresql:\/\//,
    );
  }
  assert.equal(await total(), before);
});

test("a database write failure returns a safe error, leaves saved data intact and recovers", async () => {
  const before = await rows("mba_mentor");
  // Controlled fault in the newly owned test database, never an existing target.
  await db.$executeRawUnsafe(
    "ALTER TABLE mba_mentor ADD CONSTRAINT synthetic_failure CHECK (false) NOT VALID",
  );
  try {
    const result = await send();
    assert.equal(result.status, 500);
    assert.equal(result.body.ok, false);
    assert.doesNotMatch(
      JSON.stringify(result.body),
      /SYNTHETIC Student|constraint|Prisma|postgresql:\/\//,
    );
    assert.deepEqual(await rows("mba_mentor"), before);
  } finally {
    await db.$executeRawUnsafe(
      "ALTER TABLE mba_mentor DROP CONSTRAINT synthetic_failure",
    );
  }
  assert.equal((await send()).status, 201);
});

test(
  "streamed requests are bounded by size and time without consuming saved-data integrity",
  { timeout: 20_000 },
  async () => {
    const before = await total();
    async function stream(oversize) {
      let outgoing;
      try {
        return await new Promise((resolve, reject) => {
          outgoing = request(
            `${context.origin}/api/submissions`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                origin: context.origin,
                "idempotency-key": randomUUID(),
              },
            },
            (response) => {
              response.resume();
              response.on("end", () => resolve(response.statusCode));
            },
          );
          outgoing.on("error", reject);
          outgoing.setTimeout(15_000, () =>
            outgoing.destroy(new Error("Request deadline not enforced")),
          );
          outgoing.write(oversize ? "x".repeat(100_000) : '{"form":');
          if (oversize) outgoing.end();
        });
      } finally {
        outgoing?.destroy();
      }
    }
    assert.equal(await stream(true), 413);
    assert.equal(await stream(false), 408);
    assert.equal(await total(), before);
  },
);

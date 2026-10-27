import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { validateSubmission } from "../shared/submission-contracts.ts";
import { mapSubmission } from "../server/utils/submission-mapping.ts";
import { saveWithDelegate } from "../server/utils/submission-storage.ts";

const contact = {
  fullName: " Student O'Brien ",
  phone: "+91 (98765) 43210",
  email: "Student@EXAMPLE.COM",
};
const fixtures = {
  mba_mentor: {
    ...contact,
    program: "mba",
    message: "Question <about> fees & scholarships?",
  },
  mba_predictor: {
    ...contact,
    currentCity: "Pune",
    exams: [
      { exam: "cat", score: 0, percentile: 100 },
      { exam: "other", otherExamName: "State exam", score: -1.5 },
    ],
    preferredSpecialization: "other",
    otherSpecialization: "Strategy",
    preferredLocation: "Mumbai",
    budgetLakhs: 0,
  },
  mba_application: {
    ...contact,
    currentCity: "Pune",
    graduationDegree: "B.Com",
    graduationYear: "2026",
    graduationScore: "8.3 CGPA",
    exam: "CAT",
    score: 0,
    percentile: 0,
    preferredColleges: "College A\nCollege B",
    preferredSpecialization: "Finance",
    feeRange: "10–20 lakh",
    notes: "Call after 5pm.",
  },
  mba_start: {
    ...contact,
    currentStage: "have-shortlist",
    currentCity: "Pune",
    budgetLakhs: 25.1,
    preferredLocation: "Delhi",
    collegeShortlist: "College A",
    entranceExams: "CAT",
    bestScore: 0,
    bestPercentile: 100,
    helpNeeded: "Documents",
  },
  mba_gdpi: {
    ...contact,
    currentCity: "Pune",
    appliedColleges: [" A ", "", "B"],
    targetColleges: ["C"],
  },
  engineering_enquiry: {
    ...contact,
    preferredBranch: "Computer science",
    message: "Admissions?",
  },
  study_abroad_profile: {
    name: contact.fullName,
    phone: contact.phone,
    email: contact.email,
    qualification: "B.Com",
    studyLevel: "other",
    otherStudyLevel: "Diploma",
    destination: "canada",
    course: "Economics",
    intake: "Fall 2027",
    message: "Scholarships?",
  },
  study_abroad_mentor: { name: contact.fullName, phone: contact.phone },
};
function valid(form, fields = fixtures[form]) {
  const result = validateSubmission({ form, fields });
  assert.equal(result.ok, true, JSON.stringify(result));
  return result.value;
}
function memoryDelegate() {
  const rows = new Map();
  return {
    rows,
    async create({ data }) {
      if (rows.has(data.idempotencyKey))
        throw Object.assign(new Error("Unique constraint with private SQL"), {
          code: "P2002",
        });
      const row = {
        ...structuredClone(data),
        email: data.email ?? null,
        id: randomUUID(),
        createdAt: new Date(),
      };
      rows.set(data.idempotencyKey, row);
      return row;
    },
    async findUnique({ where }) {
      return rows.get(where.idempotencyKey) ?? null;
    },
  };
}

describe("explicit contact and JSONB mapping", () => {
  for (const form of Object.keys(fixtures)) {
    it(`${form}: every valid form-specific field survives, contacts separated`, () => {
      const value = valid(form);
      const mapped = mapSubmission(value);
      assert.equal(mapped.name, "Student O'Brien");
      assert.equal(mapped.mobile, "+919876543210");
      assert.equal(
        mapped.email,
        form === "study_abroad_mentor" ? null : "student@example.com",
      );
      const { fullName, phone, email, ...expected } = value.fields;
      assert.deepEqual(mapped.details, expected);
      assert.deepEqual(JSON.parse(JSON.stringify(mapped.details)), expected);
      for (const name of [
        "name",
        "fullName",
        "mobile",
        "phone",
        "email",
        "form",
      ])
        assert.equal(Object.hasOwn(mapped.details, name), false);
    });
    it(`${form}: storage is independent and only returns ID/time`, async () => {
      const db = memoryDelegate();
      const saved = await saveWithDelegate(db, valid(form), randomUUID());
      assert.deepEqual(Object.keys(saved).sort(), ["createdAt", "id"]);
      assert.equal(db.rows.size, 1);
      assert.ok(Number.isFinite(Date.parse(saved.createdAt)));
    });
  }
  it("missing optional contacts are null and missing details remain absent", () => {
    assert.deepEqual(
      mapSubmission(
        valid("mba_start", {
          fullName: "Student",
          phone: "9876543210",
          email: "",
          currentCity: null,
        }),
      ),
      { name: "Student", mobile: "9876543210", email: null, details: {} },
    );
  });
  it("examination relationships, numeric types and punctuation are retained", () => {
    const { details } = mapSubmission(valid("mba_predictor"));
    assert.deepEqual(details.exams, fixtures.mba_predictor.exams);
    assert.equal(typeof details.budgetLakhs, "number");
    assert.match(mapSubmission(valid("mba_mentor")).details.message, /<about>/);
    assert.deepEqual(mapSubmission(valid("mba_gdpi")).details.appliedColleges, [
      "A",
      "B",
    ]);
  });
});

describe("database-backed idempotency", () => {
  it("concurrent/repeated identical HTTP keys return one persisted record", async () => {
    const db = memoryDelegate();
    const key = randomUUID();
    const value = valid("mba_start");
    const results = await Promise.all(
      Array.from({ length: 8 }, () => saveWithDelegate(db, value, key)),
    );
    assert.equal(db.rows.size, 1);
    for (const result of results) assert.deepEqual(result, results[0]);
  });
  it("new keys allow legitimate identical repeat enquiries", async () => {
    const db = memoryDelegate();
    const value = valid("mba_start");
    const a = await saveWithDelegate(db, value, randomUUID());
    const b = await saveWithDelegate(db, value, randomUUID());
    assert.notEqual(a.id, b.id);
    assert.equal(db.rows.size, 2);
  });
  it("same key with changed data conflicts without overwriting", async () => {
    const db = memoryDelegate();
    const key = randomUUID();
    await saveWithDelegate(db, valid("mba_start"), key);
    await assert.rejects(
      saveWithDelegate(
        db,
        valid("mba_start", { ...fixtures.mba_start, helpNeeded: "Changed" }),
        key,
      ),
      { code: "IDEMPOTENCY_CONFLICT" },
    );
    assert.equal(db.rows.get(key).details.helpNeeded, "Documents");
  });
  it("unrelated DB errors and invisible conflicting rows propagate", async () => {
    const privateError = Object.assign(new Error("secret connection SQL"), {
      code: "P1001",
    });
    await assert.rejects(
      saveWithDelegate(
        {
          create: async () => {
            throw privateError;
          },
        },
        valid("mba_start"),
        randomUUID(),
      ),
      { code: "P1001" },
    );
    await assert.rejects(
      saveWithDelegate(
        {
          create: async () => {
            throw { code: "P2002" };
          },
          findUnique: async () => null,
        },
        valid("mba_start"),
        randomUUID(),
      ),
      { code: "P2002" },
    );
  });
});

it("schema has exactly eight locked tables, optional email only where applicable", () => {
  const schema = readFileSync(
    new URL("../prisma/schema.prisma", import.meta.url),
    "utf8",
  );
  const models = [...schema.matchAll(/model (\w+) \{([\s\S]*?)\n\}/g)];
  assert.equal(models.length, 8);
  for (const [, name, body] of models) {
    assert.match(body, /details\s+Json\s+@db.JsonB/);
    assert.match(body, /name\s+String\s+@db.VarChar\(120\)/);
    assert.match(body, /mobile\s+String\s+@db.VarChar\(16\)/);
    assert.match(body, /createdAt\s+DateTime\s+@default\(now\(\)\)/);
    assert.match(body, /idempotencyKey\s+String\s+@unique\s+@db.Uuid/);
    assert.doesNotMatch(body, /updatedAt|studentId|status|staff/);
    assert.equal(
      /email\s+String\?/.test(body),
      !["MbaApplicationEnquiry", "MbaGdpiEnquiry"].includes(name),
    );
  }
});

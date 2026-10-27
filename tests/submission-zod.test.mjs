import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SUBMISSION_FORMS,
  submissionEnvelopeSchema,
  submissionSchemas,
  validateSubmission,
} from "../shared/submission-contracts.ts";

const contact = {
  fullName: " Student O'Neil ",
  phone: "+91 (98765) 43210",
  email: " STUDENT+tag@Example.COM ",
};
const complete = {
  mba_mentor: {
    ...contact,
    program: "study-abroad",
    message: " MBA & overseas questions. ",
  },
  mba_predictor: {
    ...contact,
    currentCity: " Pune ",
    exams: [
      { exam: "cat", score: "0", percentile: "100" },
      { exam: "other", otherExamName: " Local Test ", score: "-2.5" },
    ],
    preferredSpecialization: "other",
    otherSpecialization: " Strategy & Analytics ",
    preferredLocation: " Mumbai ",
    budgetLakhs: "0",
  },
  mba_application: {
    ...contact,
    currentCity: " Pune ",
    graduationDegree: " B.Com ",
    graduationYear: " 2026 ",
    graduationScore: " 8.2 CGPA ",
    exam: " CAT ",
    score: "-3.5",
    percentile: "0",
    preferredColleges: " College A; College B ",
    preferredSpecialization: " Finance ",
    feeRange: " 10–15 lakh ",
    notes: " Call after 5pm. ",
  },
  mba_start: {
    ...contact,
    currentStage: "have-shortlist",
    currentCity: " Pune ",
    budgetLakhs: "100000",
    preferredLocation: " Mumbai ",
    collegeShortlist: " College A\nCollege B ",
    entranceExams: " CAT & XAT ",
    bestScore: "1e2",
    bestPercentile: "1e2",
    helpNeeded: " Compare the shortlist. ",
  },
  mba_gdpi: {
    ...contact,
    currentCity: " Pune ",
    appliedColleges: [" College A ", "", " College C "],
    targetColleges: [" College B ", null, " College D "],
  },
  engineering_enquiry: {
    ...contact,
    preferredBranch: " CSE / IT ",
    message: " Admission questions. ",
  },
  study_abroad_profile: {
    name: contact.fullName,
    phone: contact.phone,
    email: contact.email,
    qualification: " B.Com ",
    studyLevel: "other",
    otherStudyLevel: " Diploma ",
    destination: "uk",
    course: " Design ",
    intake: " Autumn 2027 ",
    message: " Part-time options? ",
  },
  study_abroad_mentor: { name: contact.fullName, phone: contact.phone },
};
const check = (form, fields) => validateSubmission({ form, fields });
function passing(result) {
  assert.equal(result.ok, true, JSON.stringify(result));
  return result.value.fields;
}
function failsOn(result, field) {
  assert.equal(result.ok, false, JSON.stringify(result));
  assert.ok(
    result.issues.some((issue) => issue.field === field),
    JSON.stringify(result),
  );
}

function expected(fields) {
  return Object.fromEntries(
    Object.entries(fields).flatMap(([key, value]) => {
      if (key === "phone") return [[key, "+919876543210"]];
      if (key === "email") return [[key, "student+tag@example.com"]];
      if (key === "exams")
        return [
          [
            key,
            [
              { exam: "cat", score: 0, percentile: 100 },
              { exam: "other", otherExamName: "Local Test", score: -2.5 },
            ],
          ],
        ];
      if (
        [
          "budgetLakhs",
          "score",
          "percentile",
          "bestScore",
          "bestPercentile",
        ].includes(key)
      )
        return [[key, Number(value)]];
      if (Array.isArray(value))
        return [[key, value.filter(Boolean).map((item) => item.trim())]];
      return [[key === "name" ? "fullName" : key, value.trim()]];
    }),
  );
}

describe("Zod schemas preserve the complete real forms", () => {
  it("does not treat missing required selections or emails as optional object properties", () => {
    for (const [form, field] of [
      ["mba_mentor", "program"],
      ["mba_application", "email"],
      ["mba_gdpi", "email"],
      ["study_abroad_profile", "qualification"],
    ]) {
      const fields = { ...complete[form] };
      delete fields[field];
      failsOn(check(form, fields), field);
      failsOn(check(form, { ...fields, [field]: undefined }), field);
      failsOn(check(form, { ...fields, [field]: null }), field);
      failsOn(check(form, { ...fields, [field]: " " }), field);
    }
    failsOn(
      check("mba_predictor", {
        ...complete.mba_predictor,
        exams: [{ score: 0 }],
      }),
      "exams[0].exam",
    );
  });
  it("exports one authoritative schema per existing contract and a strict envelope", () => {
    assert.deepEqual(Object.keys(submissionSchemas), [...SUBMISSION_FORMS]);
    assert.equal(
      submissionEnvelopeSchema.safeParse({
        form: "mba_start",
        fields: {},
        metadata: {},
      }).success,
      false,
    );
  });
  for (const form of SUBMISSION_FORMS) {
    it(`${form}: normalizes every supported field without losing form details`, () => {
      const fields = passing(check(form, complete[form]));
      assert.deepEqual(fields, expected(complete[form]));
      // Prisma JSON receives only JSON-safe values, with no undefined placeholders.
      assert.deepEqual(JSON.parse(JSON.stringify(fields)), fields);
    });
    it(`${form}: requires a nonblank name without coercing an object or number`, () => {
      const key = form.startsWith("study_abroad") ? "name" : "fullName";
      for (const value of [undefined, null, "", "   ", 42, {}, []]) {
        failsOn(check(form, { ...complete[form], [key]: value }), key);
      }
    });
    it(`${form}: validates optional versus required email exactly as its controls do`, () => {
      if (form === "study_abroad_mentor") {
        failsOn(
          check(form, { ...complete[form], email: "student@example.com" }),
          "email",
        );
        return;
      }
      for (const value of [undefined, null, "", " \t\r\n "]) {
        const result = check(form, { ...complete[form], email: value });
        if (["mba_application", "mba_gdpi"].includes(form))
          failsOn(result, "email");
        else assert.equal(Object.hasOwn(passing(result), "email"), false);
      }
      for (const value of [
        "plain",
        "bad@",
        "@example.com",
        "bad name@example.com",
        "bad@example",
        [],
        123,
      ]) {
        failsOn(check(form, { ...complete[form], email: value }), "email");
      }
    });
  }
});

describe("sanitization rejects unsupported data without corrupting meaningful text", () => {
  it("rejects unsupported controls even at positions removed by trim", () => {
    for (const character of [
      "\u0000",
      "\u0001",
      "\u000B",
      "\u000C",
      "\u001F",
      "\u007F",
    ]) {
      for (const value of [
        `${character}Student`,
        `Student${character}`,
        character,
      ]) {
        failsOn(
          check("mba_start", { ...complete.mba_start, fullName: value }),
          "fullName",
        );
      }
      failsOn(
        check("mba_start", {
          ...complete.mba_start,
          budgetLakhs: `${character}0`,
        }),
        "budgetLakhs",
      );
    }
  });
  it("preserves punctuation, Unicode and line breaks without HTML escaping", () => {
    const value =
      "  Café & Design — O'Neil\n<script>example text</script>\t?  ";
    const fields = passing(
      check("engineering_enquiry", {
        ...complete.engineering_enquiry,
        message: value,
      }),
    );
    assert.equal(fields.message, value.trim());
    assert.equal(fields.fullName, "Student O'Neil");
  });
  it("preserves meaningful leading zeroes and international country codes in phone strings", () => {
    for (const [raw, normalized] of [
      ["00123456789", "00123456789"],
      ["+44 (020) 7946.0958", "+4402079460958"],
      ["123-4567", "1234567"],
      ["123456789012345", "123456789012345"],
    ]) {
      assert.equal(
        passing(check("mba_start", { ...complete.mba_start, phone: raw }))
          .phone,
        normalized,
      );
    }
    for (const phone of [
      "123456",
      "1234567890123456",
      "+-",
      "12+34567890",
      "1234567ext8",
      false,
    ]) {
      failsOn(check("mba_start", { ...complete.mba_start, phone }), "phone");
    }
  });
  it("omits empty optional text, arrays and numbers without treating zero as empty", () => {
    const fields = passing(
      check("mba_start", {
        fullName: "Student",
        phone: "9876543210",
        email: " ",
        currentCity: null,
        currentStage: "",
        preferredLocation: undefined,
        budgetLakhs: "0",
        entranceExams: "CAT",
        bestScore: 0,
        bestPercentile: "0",
        collegeShortlist: "",
        helpNeeded: " \t\n ",
      }),
    );
    assert.deepEqual(fields, {
      fullName: "Student",
      phone: "9876543210",
      budgetLakhs: 0,
      entranceExams: "CAT",
      bestScore: 0,
      bestPercentile: 0,
    });
    assert.equal(
      Object.hasOwn(
        passing(
          check("mba_gdpi", {
            ...complete.mba_gdpi,
            appliedColleges: ["", " ", null],
          }),
        ),
        "appliedColleges",
      ),
      false,
    );
  });
  it("enforces every declared text length boundary", () => {
    const boundaries = [
      ["mba_start", "fullName", 120],
      ["mba_start", "phone", 32],
      ["mba_start", "currentCity", 120],
      ["mba_start", "preferredLocation", 150],
      ["mba_start", "collegeShortlist", 2000],
      ["mba_start", "entranceExams", 250],
      ["mba_start", "helpNeeded", 3000],
      ["mba_application", "graduationDegree", 150],
      ["mba_application", "graduationYear", 20],
      ["mba_application", "graduationScore", 50],
      ["mba_application", "exam", 80],
      ["mba_application", "preferredColleges", 2000],
      ["mba_application", "preferredSpecialization", 150],
      ["mba_application", "feeRange", 100],
      ["mba_application", "notes", 3000],
      ["engineering_enquiry", "preferredBranch", 150],
      ["engineering_enquiry", "message", 3000],
      ["study_abroad_profile", "qualification", 150],
      ["study_abroad_profile", "course", 150],
      ["study_abroad_profile", "intake", 100],
      ["study_abroad_profile", "otherStudyLevel", 150],
      ["mba_predictor", "otherSpecialization", 150],
    ];
    for (const [form, field, max] of boundaries) {
      failsOn(
        check(form, { ...complete[form], [field]: "x".repeat(max + 1) }),
        field,
      );
      if (field !== "phone")
        assert.equal(
          check(form, { ...complete[form], [field]: "x".repeat(max) }).ok,
          true,
          `${form}.${field}`,
        );
    }
    failsOn(
      check("mba_start", { ...complete.mba_start, email: "a".repeat(255) }),
      "email",
    );
    failsOn(
      check("mba_gdpi", {
        ...complete.mba_gdpi,
        appliedColleges: ["x".repeat(151)],
      }),
      "appliedColleges[0]",
    );
    failsOn(
      check("mba_predictor", {
        ...complete.mba_predictor,
        exams: [{ exam: "other", otherExamName: "x".repeat(151), score: 0 }],
      }),
      "exams[0].otherExamName",
    );
  });
});

describe("numeric boundaries and conditional context", () => {
  it("normalizes negative zero to the JSONB representation used by retry comparisons", () => {
    for (const raw of [-0, "-0", "-0.0", "-0e5"]) {
      for (const [form, field] of [
        ["mba_start", "bestScore"],
        ["mba_start", "bestPercentile"],
        ["mba_start", "budgetLakhs"],
        ["mba_application", "score"],
        ["mba_application", "percentile"],
      ]) {
        const value = passing(check(form, { ...complete[form], [field]: raw }))[
          field
        ];
        assert.equal(Object.is(value, 0), true);
        assert.equal(Object.is(value, -0), false);
      }
      const exams = [{ exam: "cat", score: raw, percentile: raw }];
      const row = passing(
        check("mba_predictor", { ...complete.mba_predictor, exams }),
      ).exams[0];
      assert.equal(Object.is(row.score, 0), true);
      assert.equal(Object.is(row.percentile, 0), true);
    }
  });
  it("supports HTML decimal/exponent syntax and signed scores", () => {
    for (const [raw, normalized] of [
      [".5", 0.5],
      ["1.", 1],
      ["+2.5", 2.5],
      ["-0.5", -0.5],
      ["1e2", 100],
      [0, 0],
      ["-1e6", -1000000],
      ["1e6", 1000000],
    ]) {
      assert.equal(
        passing(
          check("mba_application", { ...complete.mba_application, score: raw }),
        ).score,
        normalized,
      );
    }
    for (const raw of [
      true,
      {},
      [],
      "0x10",
      "0b10",
      "NaN",
      "Infinity",
      Infinity,
      NaN,
      "1,000",
      1000000.1,
      -1000000.1,
    ]) {
      failsOn(
        check("mba_application", { ...complete.mba_application, score: raw }),
        "score",
      );
    }
  });
  it("enforces percentile and budget limits while retaining inclusive boundaries", () => {
    for (const [form, field, min, max] of [
      ["mba_application", "percentile", 0, 100],
      ["mba_start", "bestPercentile", 0, 100],
      ["mba_start", "budgetLakhs", 0, 100000],
      ["mba_predictor", "budgetLakhs", 0, 100000],
    ]) {
      for (const value of [min, max])
        assert.equal(
          check(form, { ...complete[form], [field]: value }).ok,
          true,
        );
      for (const value of [min - 0.01, max + 0.01])
        failsOn(check(form, { ...complete[form], [field]: value }), field);
    }
  });
  it("requires exam context even when the supplied result is zero", () => {
    for (const [form, field, exam] of [
      ["mba_application", "score", "exam"],
      ["mba_application", "percentile", "exam"],
      ["mba_start", "bestScore", "entranceExams"],
      ["mba_start", "bestPercentile", "entranceExams"],
    ])
      failsOn(
        check(form, { ...complete[form], [exam]: " ", [field]: 0 }),
        exam,
      );
    assert.equal(
      check("mba_application", { ...contact, exam: "CAT" }).ok,
      true,
    );
    assert.equal(
      check("mba_start", { ...contact, entranceExams: "CAT" }).ok,
      true,
    );
  });
});

describe("strict structures, repeated values and allowed selections", () => {
  it("rejects malformed envelopes, metadata and incorrect fields structures", () => {
    for (const input of [
      undefined,
      null,
      42,
      "text",
      [],
      {},
      { form: "toString", fields: {} },
      { form: "__proto__", fields: {} },
    ])
      assert.equal(validateSubmission(input).ok, false);
    for (const fields of [undefined, null, "text", 42, [], true])
      failsOn(check("mba_start", fields), "fields");
    failsOn(
      validateSubmission({
        form: "mba_start",
        fields: complete.mba_start,
        model: "Student",
      }),
      "model",
    );
    failsOn(
      check(
        "mba_start",
        JSON.parse(
          '{"fullName":"Student","phone":"9876543210","__proto__":{"admin":true}}',
        ),
      ),
      "__proto__",
    );
  });
  it("rejects deeply nested unsupported values without recursively traversing arbitrary JSON", () => {
    const nested = JSON.parse(
      '{"child":'.repeat(2000) + "0" + "}".repeat(2000),
    );
    for (const input of [
      nested,
      { form: "mba_start", fields: nested },
      {
        form: "mba_start",
        fields: { ...complete.mba_start, fullName: nested },
      },
      { form: "mba_start", fields: { ...complete.mba_start, extra: nested } },
      {
        form: "mba_predictor",
        fields: { ...complete.mba_predictor, exams: [nested] },
      },
    ])
      assert.doesNotThrow(() =>
        assert.equal(validateSubmission(input).ok, false),
      );
  });
  it("does not reflect invalid field values into validation errors", () => {
    const marker = "DO-NOT-RETURN-THIS-PERSONAL-VALUE";
    const result = check("mba_start", {
      ...complete.mba_start,
      email: marker,
      currentStage: marker,
      bestPercentile: marker,
    });
    assert.equal(result.ok, false);
    assert.equal(JSON.stringify(result).includes(marker), false);
  });
  it("rejects extra fields at every supported object depth", () => {
    for (const form of SUBMISSION_FORMS)
      failsOn(check(form, { ...complete[form], id: "client-generated" }), "id");
    failsOn(
      check("mba_predictor", {
        ...complete.mba_predictor,
        exams: [{ exam: "cat", score: 0, createdAt: "now" }],
      }),
      "exams[0].createdAt",
    );
  });
  it("rejects malformed exam rows and preserves each zero-valued result with its exam", () => {
    for (const row of [null, "CAT", 42, [], false])
      failsOn(
        check("mba_predictor", { ...complete.mba_predictor, exams: [row] }),
        "exams[0]",
      );
    for (const row of [{ score: 0 }, { exam: "unknown", score: 0 }])
      failsOn(
        check("mba_predictor", { ...complete.mba_predictor, exams: [row] }),
        "exams[0].exam",
      );
    const rows = [
      { exam: "cat", score: 0 },
      { exam: "xat", percentile: 0 },
      { exam: "cat", score: -5, percentile: 100 },
    ];
    assert.deepEqual(
      passing(
        check("mba_predictor", { ...complete.mba_predictor, exams: rows }),
      ).exams,
      rows,
    );
    failsOn(
      check("mba_predictor", {
        ...complete.mba_predictor,
        exams: [{ exam: "cat", score: "", percentile: null }],
      }),
      "exams[0]",
    );
  });
  it("enforces all predefined selections while leaving actual free-text controls free", () => {
    for (const [form, field] of [
      ["mba_mentor", "program"],
      ["mba_predictor", "preferredSpecialization"],
      ["mba_start", "currentStage"],
      ["study_abroad_profile", "studyLevel"],
      ["study_abroad_profile", "destination"],
    ])
      failsOn(
        check(form, { ...complete[form], [field]: "unsupported" }),
        field,
      );
    assert.equal(
      check("mba_application", {
        ...complete.mba_application,
        preferredSpecialization: "A custom specialization",
        exam: "A custom exam",
      }).ok,
      true,
    );
    assert.equal(
      check("engineering_enquiry", {
        ...complete.engineering_enquiry,
        preferredBranch: "A custom branch",
      }).ok,
      true,
    );
  });
  it("rejects stale Other text when selection is absent or blank", () => {
    failsOn(
      check("mba_predictor", {
        ...complete.mba_predictor,
        preferredSpecialization: "",
      }),
      "otherSpecialization",
    );
    failsOn(
      check("study_abroad_profile", {
        ...complete.study_abroad_profile,
        studyLevel: undefined,
      }),
      "otherStudyLevel",
    );
  });
  it("rejects non-array college fields and invalid item types without joining values", () => {
    for (const value of ["College A", {}, 123, false])
      failsOn(
        check("mba_gdpi", { ...complete.mba_gdpi, targetColleges: value }),
        "targetColleges",
      );
    failsOn(
      check("mba_gdpi", {
        ...complete.mba_gdpi,
        targetColleges: ["College A", { name: "College B" }],
      }),
      "targetColleges[1]",
    );
    assert.deepEqual(
      passing(
        check("mba_gdpi", {
          ...complete.mba_gdpi,
          targetColleges: ["A; B", "C, D"],
        }),
      ).targetColleges,
      ["A; B", "C, D"],
    );
  });
});

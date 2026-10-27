import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SUBMISSION_FORMS,
  validateSubmission,
} from "../shared/submission-contracts.ts";

const contact = { fullName: " Sample Student ", phone: "+91 98765 43210" };
const minimum = {
  mba_mentor: { ...contact, program: "mba" },
  mba_predictor: {
    ...contact,
    exams: [{ exam: "cat", score: "45", percentile: "91.2" }],
  },
  mba_application: { ...contact, email: "Test@Example.com" },
  mba_start: { ...contact },
  mba_gdpi: {
    ...contact,
    email: "test@example.com",
    appliedColleges: ["College A", "", "College B"],
  },
  engineering_enquiry: { ...contact },
  study_abroad_profile: {
    name: " Sample Student ",
    phone: contact.phone,
    qualification: "B.Com",
  },
  study_abroad_mentor: { name: " Sample Student ", phone: contact.phone },
};

const check = (form, fields) => validateSubmission({ form, fields });
const badFields = (result) =>
  result.ok ? [] : result.issues.map((issue) => issue.field);
const failsOn = (result, field) => {
  assert.equal(result.ok, false, JSON.stringify(result));
  assert.ok(
    badFields(result).includes(field),
    `Expected ${field}; found ${badFields(result)}`,
  );
};

const passing = (result) => {
  assert.equal(result.ok, true, JSON.stringify(result));
  return result.value.fields;
};

describe("contract inventory and basic validity", () => {
  it("defines exactly eight distinct public form contracts", () => {
    assert.equal(SUBMISSION_FORMS.length, 8);
    assert.equal(new Set(SUBMISSION_FORMS).size, 8);
    assert.deepEqual([...SUBMISSION_FORMS].sort(), Object.keys(minimum).sort());
  });

  for (const form of SUBMISSION_FORMS) {
    it(`${form}: accepts the minimum fields and normalizes contact information`, () => {
      const fields = passing(check(form, minimum[form]));
      assert.equal(fields.fullName, "Sample Student");
      assert.equal(fields.phone, "+919876543210");
      assert.equal(Object.hasOwn(fields, "name"), false);
    });
    it(`${form}: requires a phone number`, () => {
      const { phone, ...withoutPhone } = minimum[form];
      failsOn(check(form, withoutPhone), "phone");
    });
    it(`${form}: rejects unrecognized fields`, () => {
      failsOn(check(form, { ...minimum[form], isAdmin: "true" }), "isAdmin");
    });
  }
});

describe("input shape and sanitation", () => {
  it("rejects unknown form ids and malformed bodies", () => {
    failsOn(validateSubmission(null), "form");
    failsOn(validateSubmission({ form: "not-a-form", fields: {} }), "form");
    failsOn(validateSubmission({ form: "mba_mentor", fields: [] }), "fields");
    failsOn(validateSubmission({ form: "mba_mentor", fields: "x" }), "fields");
  });
  it("rejects extraneous envelope keys", () => {
    failsOn(
      validateSubmission({
        form: "mba_start",
        fields: minimum.mba_start,
        privateFlag: true,
      }),
      "privateFlag",
    );
  });
  it("rejects unexpected value types and unsupported controls", () => {
    failsOn(
      check("mba_mentor", { ...minimum.mba_mentor, fullName: 123 }),
      "fullName",
    );
    failsOn(
      check("mba_mentor", { ...minimum.mba_mentor, fullName: "A\u0001B" }),
      "fullName",
    );
  });
  it("does not accept too-long field values", () => {
    failsOn(
      check("engineering_enquiry", {
        ...minimum.engineering_enquiry,
        message: "x".repeat(3001),
      }),
      "message",
    );
    failsOn(
      check("mba_start", { ...minimum.mba_start, fullName: "x".repeat(121) }),
      "fullName",
    );
  });
  it("accepts phone punctuation and normalizes national/international digits", () => {
    const national = passing(
      check("mba_start", { ...minimum.mba_start, phone: "(987) 654-3210" }),
    );
    assert.equal(national.phone, "9876543210");
  });
  it("rejects malformed phone values", () => {
    for (const phone of [
      "++91 9876543210",
      "call-me",
      "123",
      "1".repeat(16),
      9999999999,
    ]) {
      failsOn(check("mba_start", { ...minimum.mba_start, phone }), "phone");
    }
  });
  it("normalizes optional email and rejects malformed addresses", () => {
    const fields = passing(
      check("mba_mentor", {
        ...minimum.mba_mentor,
        email: " TEST@Example.com ",
      }),
    );
    assert.equal(fields.email, "test@example.com");
    failsOn(
      check("mba_mentor", { ...minimum.mba_mentor, email: "invalid@" }),
      "email",
    );
  });
  it("enforces required email only on applicable forms", () => {
    failsOn(
      check("mba_application", { ...minimum.mba_application, email: "" }),
      "email",
    );
    failsOn(check("mba_gdpi", { ...minimum.mba_gdpi, email: null }), "email");
    assert.equal(
      check("mba_start", { ...minimum.mba_start, email: "" }).ok,
      true,
    );
  });
  it("enforces required qualification and allowed program values", () => {
    failsOn(
      check("study_abroad_profile", { name: "Student", phone: "9876543210" }),
      "qualification",
    );
    failsOn(
      check("mba_mentor", { ...minimum.mba_mentor, program: "phd" }),
      "program",
    );
  });
});

describe("numeric inputs and related fields", () => {
  it("accepts zero percentiles and decimal scores", () => {
    const fields = passing(
      check("mba_application", {
        ...minimum.mba_application,
        exam: "CAT",
        score: "0.5",
        percentile: "0",
      }),
    );
    assert.equal(fields.score, 0.5);
    assert.equal(fields.percentile, 0);
  });
  it("accepts the exponent syntax supported by HTML number controls", () => {
    const fields = passing(
      check("mba_application", {
        ...minimum.mba_application,
        exam: "CAT",
        percentile: "1e2",
      }),
    );
    assert.equal(fields.percentile, 100);
  });
  it("rejects invalid percentiles, numeric coercion and negative budget", () => {
    for (const percentile of [-1, 100.01, "0x10", "Infinity", "abc"]) {
      failsOn(
        check("mba_application", {
          ...minimum.mba_application,
          exam: "CAT",
          percentile,
        }),
        "percentile",
      );
    }
    failsOn(
      check("mba_start", { ...minimum.mba_start, budgetLakhs: "-1" }),
      "budgetLakhs",
    );
  });
  it("requires an exam when the MBA application provides result numbers", () => {
    failsOn(
      check("mba_application", { ...minimum.mba_application, score: 88 }),
      "exam",
    );
    failsOn(
      check("mba_application", { ...minimum.mba_application, percentile: 88 }),
      "exam",
    );
  });
  it("requires an exam when the MBA start form provides result numbers", () => {
    failsOn(
      check("mba_start", { ...minimum.mba_start, bestScore: 88 }),
      "entranceExams",
    );
    failsOn(
      check("mba_start", { ...minimum.mba_start, bestPercentile: 88 }),
      "entranceExams",
    );
  });
});

describe("MBA College Predictor — multiple exams and Other", () => {
  const predictor = minimum.mba_predictor;
  const examFields = (exams, rest = {}) => ({ ...predictor, ...rest, exams });
  it("preserves up to five exam rows in order", () => {
    const exams = [
      { exam: "cat", percentile: 88.1 },
      { exam: "cmat", score: 205 },
      { exam: "xat", score: 34.5 },
      { exam: "mat", percentile: 80 },
      { exam: "snap", score: 29 },
    ];
    assert.deepEqual(
      passing(check("mba_predictor", examFields(exams))).exams.map(
        (row) => row.exam,
      ),
      exams.map((row) => row.exam),
    );
  });
  it("rejects zero rows, six rows, and non-array exams", () => {
    for (const exams of [[], Array(6).fill({ exam: "cat", score: 1 }), {}]) {
      failsOn(check("mba_predictor", examFields(exams)), "exams");
    }
  });
  it("requires score or percentile per row", () => {
    failsOn(check("mba_predictor", examFields([{ exam: "cat" }])), "exams[0]");
  });
  it("validates percentile and unexpected row fields", () => {
    failsOn(
      check("mba_predictor", examFields([{ exam: "cat", percentile: 101 }])),
      "exams[0].percentile",
    );
    failsOn(
      check(
        "mba_predictor",
        examFields([{ exam: "cat", score: 1, unknown: true }]),
      ),
      "exams[0].unknown",
    );
  });
  it("allows Other with a specified examination name", () => {
    const fields = passing(
      check(
        "mba_predictor",
        examFields([
          { exam: "other", otherExamName: " Test Exam ", score: "50" },
        ]),
      ),
    );
    assert.deepEqual(fields.exams, [
      { exam: "other", otherExamName: "Test Exam", score: 50 },
    ]);
  });
  it("requires a name for Other and disallows stale names for named exams", () => {
    failsOn(
      check("mba_predictor", examFields([{ exam: "other", score: 40 }])),
      "exams[0].otherExamName",
    );
    failsOn(
      check(
        "mba_predictor",
        examFields([{ exam: "cat", otherExamName: "Test Exam", score: 40 }]),
      ),
      "exams[0].otherExamName",
    );
  });
  it("allows Undecided separately from Other specialization", () => {
    assert.equal(
      passing(
        check(
          "mba_predictor",
          examFields([{ exam: "cat", score: 45 }], {
            preferredSpecialization: "undecided",
          }),
        ),
      ).preferredSpecialization,
      "undecided",
    );
    failsOn(
      check(
        "mba_predictor",
        examFields([{ exam: "cat", score: 45 }], {
          preferredSpecialization: "other-undecided",
        }),
      ),
      "preferredSpecialization",
    );
  });
  it("requires otherSpecialization only when Other selected", () => {
    failsOn(
      check(
        "mba_predictor",
        examFields([{ exam: "cat", score: 45 }], {
          preferredSpecialization: "other",
        }),
      ),
      "otherSpecialization",
    );
    assert.equal(
      passing(
        check(
          "mba_predictor",
          examFields([{ exam: "cat", score: 45 }], {
            preferredSpecialization: "other",
            otherSpecialization: "Strategy",
          }),
        ),
      ).otherSpecialization,
      "Strategy",
    );
    failsOn(
      check(
        "mba_predictor",
        examFields([{ exam: "cat", score: 45 }], {
          preferredSpecialization: "finance",
          otherSpecialization: "Strategy",
        }),
      ),
      "otherSpecialization",
    );
  });
});

describe("Study Abroad — Other study level and destinations", () => {
  const profile = minimum.study_abroad_profile;
  it("requires a study-level detail when Other is selected", () => {
    failsOn(
      check("study_abroad_profile", { ...profile, studyLevel: "other" }),
      "otherStudyLevel",
    );
    const fields = passing(
      check("study_abroad_profile", {
        ...profile,
        studyLevel: "other",
        otherStudyLevel: "Diploma",
      }),
    );
    assert.equal(fields.otherStudyLevel, "Diploma");
  });
  it("does not allow an Other detail when a named level is selected", () => {
    failsOn(
      check("study_abroad_profile", {
        ...profile,
        studyLevel: "mba",
        otherStudyLevel: "Diploma",
      }),
      "otherStudyLevel",
    );
  });
  it("accepts the nine supported destinations but not unknown values", () => {
    for (const destination of [
      "usa",
      "uk",
      "canada",
      "australia",
      "france",
      "germany",
      "malaysia",
      "uae",
      "georgia",
    ]) {
      assert.equal(
        check("study_abroad_profile", { ...profile, destination }).ok,
        true,
      );
    }
    failsOn(
      check("study_abroad_profile", { ...profile, destination: "moon" }),
      "destination",
    );
  });
});

describe("MBA GDPI — repeatable college fields", () => {
  it("accepts up to three colleges and skips empty slots", () => {
    const fields = passing(
      check("mba_gdpi", {
        ...minimum.mba_gdpi,
        targetColleges: [" A ", "", "C"],
      }),
    );
    assert.deepEqual(fields.targetColleges, ["A", "C"]);
  });
  it("rejects more than three and invalid entries", () => {
    failsOn(
      check("mba_gdpi", {
        ...minimum.mba_gdpi,
        targetColleges: ["A", "B", "C", "D"],
      }),
      "targetColleges",
    );
    failsOn(
      check("mba_gdpi", { ...minimum.mba_gdpi, targetColleges: ["A", 12] }),
      "targetColleges[1]",
    );
  });
});

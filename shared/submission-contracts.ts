/**
 * Authoritative, database-independent schemas for the eight existing forms.
 * Shared by browser validation and Nitro; never retain or log submitted data.
 */
import { z } from "zod";

export const SUBMISSION_FORMS = [
  "mba_mentor",
  "mba_predictor",
  "mba_application",
  "mba_start",
  "mba_gdpi",
  "engineering_enquiry",
  "study_abroad_profile",
  "study_abroad_mentor",
] as const;

export type SubmissionForm = (typeof SUBMISSION_FORMS)[number];
export type SubmissionIssue = { field: string; message: string };
export type ExamResult = {
  exam: string;
  otherExamName?: string;
  score?: number;
  percentile?: number;
};
export type SubmissionFieldValue = string | number | string[] | ExamResult[];
export type ValidatedSubmission = {
  form: SubmissionForm;
  fields: Record<string, SubmissionFieldValue>;
};
export type SubmissionValidationResult =
  | { ok: true; value: ValidatedSubmission }
  | { ok: false; issues: SubmissionIssue[] };

// Tabs and line breaks remain meaningful in messages. Reject unsupported C0
// controls before trimming, including controls that JavaScript trim removes.
const unsupportedControls = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;
const htmlNumber = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

function text(max: number, required: true): z.ZodType<string, unknown>;
function text(
  max: number,
  required?: false,
): z.ZodType<string | undefined, unknown>;
function text(
  max: number,
  required = false,
): z.ZodType<string | undefined, unknown> {
  const optional = z.preprocess(
    (value) => (value === null ? undefined : value),
    z
      .string({ error: "Enter text." })
      .superRefine((value, context) => {
        if (unsupportedControls.test(value)) {
          context.addIssue({
            code: "custom",
            message: "Remove unsupported control characters.",
          });
        }
      })
      .transform((value) => value.trim())
      .pipe(z.string().max(max, { error: `Maximum ${max} characters.` }))
      .transform((value) => value || undefined)
      .optional(),
  );
  return required
    ? optional.pipe(z.string({ error: "This field is required." }))
    : optional;
}

function selection(values: readonly [string, ...string[]], required = false) {
  const allowed = z.enum(values, { error: "Choose a valid option." });
  return required
    ? text(150, true).pipe(allowed)
    : text(150).pipe(allowed.optional());
}

const name = text(120, true);
const phone = text(32, true).transform((value, context) => {
  if (!/^\+?[\d()\s.-]+$/.test(value)) {
    context.addIssue({
      code: "custom",
      message: "Enter a valid phone number.",
    });
    return z.NEVER;
  }
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    context.addIssue({
      code: "custom",
      message: "Phone number must contain 7–15 digits.",
    });
    return z.NEVER;
  }
  return value.startsWith("+") ? `+${digits}` : digits;
});
function email(required = false) {
  const address = z
    .email({ error: "Enter a valid email address." })
    .toLowerCase();
  return required
    ? text(254, true).pipe(address)
    : text(254).pipe(address.optional());
}
const currentCity = text(120);
const message = text(3000);

function numeric(min = -1_000_000, max = 1_000_000) {
  return z
    .preprocess(
      (value) => (value === null ? undefined : value),
      z
        .union([z.string(), z.number()], { error: "Enter a number." })
        .optional(),
    )
    .transform((raw, context) => {
      if (raw === undefined) return undefined;
      if (typeof raw === "string") {
        if (unsupportedControls.test(raw)) {
          context.addIssue({
            code: "custom",
            message: "Remove unsupported control characters.",
          });
          return z.NEVER;
        }
        const value = raw.trim();
        if (!value) return undefined;
        if (!htmlNumber.test(value)) {
          context.addIssue({
            code: "custom",
            message: "Enter a valid number.",
          });
          return z.NEVER;
        }
      }
      const value = Number(raw);
      if (!Number.isFinite(value) || Math.abs(value) > 1_000_000) {
        context.addIssue({ code: "custom", message: "Enter a valid number." });
        return z.NEVER;
      }
      if (value < min || value > max) {
        context.addIssue({
          code: "custom",
          message: `Enter a value between ${min} and ${max}.`,
        });
        return z.NEVER;
      }
      // JSON/JSONB represents negative zero as zero. Keep retries and persistence
      // comparisons consistent with that representation.
      return value === 0 ? 0 : value;
    });
}
const optionalScore = numeric();
const percentile = numeric(0, 100);
const budget = numeric(0, 100000);

const examNames = [
  "cat",
  "xat",
  "cmat",
  "mat",
  "nmat",
  "snap",
  "mah-mba-cet",
  "other",
] as const;
const mbaSpecializations = [
  "marketing",
  "finance",
  "human-resources",
  "operations",
  "business-analytics",
  "other",
  "undecided",
] as const;
const countries = [
  "usa",
  "uk",
  "canada",
  "australia",
  "france",
  "germany",
  "malaysia",
  "uae",
  "georgia",
] as const;

/** Remove omitted optional values without coercing zero or flattening arrays. */
function compact<T extends Record<string, unknown>>(fields: T) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined),
  ) as { [K in keyof T]: Exclude<T[K], undefined> };
}

function requireOtherDetail(
  chosen: string | undefined,
  detail: string | undefined,
  field: string,
  context: z.RefinementCtx,
) {
  if (chosen === "other" && !detail) {
    context.addIssue({
      code: "custom",
      path: [field],
      message: "Please specify your Other selection.",
    });
  } else if (chosen !== "other" && detail) {
    context.addIssue({
      code: "custom",
      path: [field],
      message: "Only provide this field when Other is selected.",
    });
  }
}

const examResult = z
  .strictObject({
    exam: selection(examNames, true),
    otherExamName: text(150),
    score: optionalScore,
    percentile,
  })
  .superRefine((entry, context) => {
    requireOtherDetail(
      entry.exam,
      entry.otherExamName,
      "otherExamName",
      context,
    );
    if (entry.score === undefined && entry.percentile === undefined) {
      context.addIssue({
        code: "custom",
        message: "Enter a score or percentile for this exam.",
      });
    }
  })
  .transform(compact);

const collegeList = z
  .preprocess(
    (value) => (value === null || value === "" ? undefined : value),
    z
      .array(text(150))
      .max(3, { error: "Enter at most 3 colleges." })
      .optional(),
  )
  .transform((values) => {
    const nonempty = values?.filter(
      (value): value is string => value !== undefined,
    );
    return nonempty?.length ? nonempty : undefined;
  });

/** Named fields come directly from the existing form controls and Phase A contract. */
export const submissionSchemas = {
  mba_mentor: z
    .strictObject({
      fullName: name,
      phone,
      email: email(),
      program: selection(["mba", "engineering", "study-abroad"], true),
      message,
    })
    .transform(compact),
  mba_predictor: z
    .strictObject({
      fullName: name,
      phone,
      email: email(),
      currentCity,
      exams: z
        .array(examResult)
        .min(1, { error: "Add between one and five entrance exams." })
        .max(5, { error: "Add between one and five entrance exams." }),
      preferredSpecialization: selection(mbaSpecializations),
      otherSpecialization: text(150),
      preferredLocation: text(150),
      budgetLakhs: budget,
    })
    .superRefine((fields, context) => {
      requireOtherDetail(
        fields.preferredSpecialization,
        fields.otherSpecialization,
        "otherSpecialization",
        context,
      );
    })
    .transform(compact),
  mba_application: z
    .strictObject({
      fullName: name,
      phone,
      email: email(true),
      currentCity,
      graduationDegree: text(150),
      graduationYear: text(20),
      graduationScore: text(50),
      exam: text(80),
      score: optionalScore,
      percentile,
      preferredColleges: text(2000),
      preferredSpecialization: text(150),
      feeRange: text(100),
      notes: message,
    })
    .superRefine((fields, context) => {
      if (
        (fields.score !== undefined || fields.percentile !== undefined) &&
        !fields.exam
      ) {
        context.addIssue({
          code: "custom",
          path: ["exam"],
          message: "Enter the entrance exam for the score or percentile.",
        });
      }
    })
    .transform(compact),
  mba_start: z
    .strictObject({
      fullName: name,
      phone,
      email: email(),
      currentStage: selection([
        "exploring-colleges",
        "have-shortlist",
        "ready-to-apply",
        "applications-submitted",
        "preparing-gdpi",
      ]),
      currentCity,
      budgetLakhs: budget,
      preferredLocation: text(150),
      collegeShortlist: text(2000),
      entranceExams: text(250),
      bestScore: optionalScore,
      bestPercentile: percentile,
      helpNeeded: message,
    })
    .superRefine((fields, context) => {
      if (
        (fields.bestScore !== undefined ||
          fields.bestPercentile !== undefined) &&
        !fields.entranceExams
      ) {
        context.addIssue({
          code: "custom",
          path: ["entranceExams"],
          message: "Enter the entrance exam for the score or percentile.",
        });
      }
    })
    .transform(compact),
  mba_gdpi: z
    .strictObject({
      fullName: name,
      phone,
      email: email(true),
      currentCity,
      appliedColleges: collegeList,
      targetColleges: collegeList,
    })
    .transform(compact),
  engineering_enquiry: z
    .strictObject({
      fullName: name,
      phone,
      email: email(),
      preferredBranch: text(150),
      message,
    })
    .transform(compact),
  study_abroad_profile: z
    .strictObject({
      name,
      phone,
      email: email(),
      qualification: text(150, true),
      studyLevel: selection(["undergraduate", "postgraduate", "mba", "other"]),
      otherStudyLevel: text(150),
      destination: selection(countries),
      course: text(150),
      intake: text(100),
      message,
    })
    .superRefine((fields, context) => {
      requireOtherDetail(
        fields.studyLevel,
        fields.otherStudyLevel,
        "otherStudyLevel",
        context,
      );
    })
    .transform(compact),
  study_abroad_mentor: z.strictObject({ name, phone }).transform(compact),
} satisfies Record<SubmissionForm, z.ZodType>;

export const submissionEnvelopeSchema = z.strictObject({
  form: z.enum(SUBMISSION_FORMS, { error: "Unsupported form." }),
  // Preserve own keys here so the selected strict form schema can reject all
  // unsupported keys, including __proto__ (z.record intentionally drops it).
  fields: z.custom<Record<string, unknown>>(
    (value) =>
      value !== null && typeof value === "object" && !Array.isArray(value),
    { error: "Invalid submission fields." },
  ),
});

function fieldPath(path: readonly PropertyKey[]) {
  return path.reduce<string>(
    (result, part) =>
      typeof part === "number"
        ? `${result}[${part}]`
        : `${result}${result ? "." : ""}${String(part)}`,
    "",
  );
}

function validationIssues(
  error: z.ZodError,
  envelope = false,
): SubmissionIssue[] {
  return error.issues.flatMap((issue) => {
    if (issue.code === "unrecognized_keys") {
      return issue.keys.map((key) => ({
        field: fieldPath([...issue.path, key]),
        message: envelope
          ? "Unexpected submission field."
          : "Unexpected field.",
      }));
    }
    const field = fieldPath(issue.path) || (envelope ? "form" : "fields");
    return [
      {
        field,
        message:
          envelope && field === "form"
            ? "Unsupported form."
            : envelope && field === "fields"
              ? "Invalid submission fields."
              : issue.message,
      },
    ];
  });
}

/** Compatibility interface: preserves Phase A field names, normalization and issue paths. */
export function validateSubmission(input: unknown): SubmissionValidationResult {
  const envelope = submissionEnvelopeSchema.safeParse(input);
  if (!envelope.success)
    return { ok: false, issues: validationIssues(envelope.error, true) };
  const { form, fields } = envelope.data;
  const parsed = submissionSchemas[form].safeParse(fields);
  if (!parsed.success)
    return { ok: false, issues: validationIssues(parsed.error) };
  const normalized = parsed.data as Record<string, SubmissionFieldValue>;
  if (Object.hasOwn(normalized, "name")) {
    normalized.fullName = normalized.name!;
    delete normalized.name;
  }
  return { ok: true, value: { form, fields: normalized } };
}

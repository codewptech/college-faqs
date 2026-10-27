import type { SubmissionForm } from "../../shared/submission-contracts";

/** Names come from the existing HTML forms. Never send arbitrary form controls. */
const fieldsByForm: Record<SubmissionForm, readonly string[]> = {
  mba_mentor: ["fullName", "phone", "email", "program", "message"],
  mba_predictor: [
    "fullName",
    "phone",
    "email",
    "currentCity",
    "preferredSpecialization",
    "otherSpecialization",
    "preferredLocation",
    "budgetLakhs",
  ],
  mba_application: [
    "fullName",
    "phone",
    "email",
    "currentCity",
    "graduationDegree",
    "graduationYear",
    "graduationScore",
    "exam",
    "score",
    "percentile",
    "preferredColleges",
    "preferredSpecialization",
    "feeRange",
    "notes",
  ],
  mba_start: [
    "fullName",
    "phone",
    "email",
    "currentStage",
    "currentCity",
    "budgetLakhs",
    "preferredLocation",
    "collegeShortlist",
    "entranceExams",
    "bestScore",
    "bestPercentile",
    "helpNeeded",
  ],
  mba_gdpi: ["fullName", "phone", "email", "currentCity"],
  engineering_enquiry: [
    "fullName",
    "phone",
    "email",
    "preferredBranch",
    "message",
  ],
  study_abroad_profile: [
    "name",
    "phone",
    "email",
    "qualification",
    "studyLevel",
    "otherStudyLevel",
    "destination",
    "course",
    "intake",
    "message",
  ],
  study_abroad_mentor: ["name", "phone"],
};

export function submissionFields(
  form: SubmissionForm,
  data: FormData,
): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  for (const field of fieldsByForm[form]) {
    const value = data.get(field);
    if (typeof value === "string") fields[field] = value;
  }
  if (form === "mba_predictor") {
    const exams: Record<string, string>[] = [];
    // Rendered rows use contiguous indices, even after removing a stable row ID.
    for (let index = 0; index < 5; index++) {
      if (!data.has(`exams[${index}][exam]`)) break;
      const entry: Record<string, string> = {};
      for (const key of ["exam", "otherExamName", "score", "percentile"]) {
        const value = data.get(`exams[${index}][${key}]`);
        if (typeof value === "string") entry[key] = value;
      }
      exams.push(entry);
    }
    fields.exams = exams;
  }
  if (form === "mba_gdpi") {
    for (const group of ["appliedColleges", "targetColleges"]) {
      fields[group] = Array.from({ length: 3 }, (_, index) => {
        const value = data.get(`${group}[${index}]`);
        return typeof value === "string" ? value : "";
      });
    }
  }
  return fields;
}

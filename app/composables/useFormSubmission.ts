import { ref, type Ref } from "vue";
import {
  validateSubmission,
  type SubmissionForm,
  type SubmissionIssue,
} from "~~/shared/submission-contracts";
import { submissionFields } from "../utils/submission-payload";

type FormValidation = {
  formRef: Ref<HTMLFormElement | null>;
  applyIssues: (issues: SubmissionIssue[]) => void;
};

const failureMessages: Record<string, string> = {
  VALIDATION_ERROR: "Please check the form and try again.",
  VALIDATION_FAILED: "Please check the form and try again.",
  INVALID_INPUT: "Please check the form and try again.",
  TOO_MANY_REQUESTS:
    "We're handling several enquiries right now. Please try again in a moment.",
  DATABASE_UNAVAILABLE:
    "We could not save your enquiry right now. Please try again later.",
  SERVICE_UNAVAILABLE:
    "We could not save your enquiry right now. Please try again later.",
  INTERNAL_ERROR:
    "We could not save your enquiry right now. Please try again later.",
  IDEMPOTENCY_CONFLICT:
    "This request could not be confirmed. Please try again.",
};

export function useFormSubmission(
  form: SubmissionForm,
  validation: FormValidation,
) {
  const pending = ref(false);
  const submissionError = ref("");
  const submissionIssues = ref<SubmissionIssue[]>([]);
  let previousPayload = "";
  let requestKey = "";

  async function submit() {
    if (pending.value || !validation.formRef.value) return false;
    submissionError.value = "";
    submissionIssues.value = [];
    const data = new FormData(validation.formRef.value);
    const payload = { form, fields: submissionFields(form, data) };
    const checked = validateSubmission(payload);
    if (!checked.ok) {
      submissionError.value = "Please check the form and try again.";
      submissionIssues.value = checked.issues;
      validation.applyIssues(checked.issues);
      return false;
    }
    pending.value = true;
    try {
      const fingerprint = JSON.stringify(checked.value);
      if (fingerprint !== previousPayload || !requestKey) {
        requestKey = crypto.randomUUID();
        previousPayload = fingerprint;
      }
      const trap = data.get("submissionTrap");
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Idempotency-Key": requestKey,
          "X-Submission-Trap": typeof trap === "string" ? trap : "",
        },
        // Send the original supported field names; Study Abroad uses name.
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20_000),
      });
      const result = await response.json();
      if (
        response.ok &&
        result?.ok === true &&
        typeof result.submission?.id === "string" &&
        result.submission.id &&
        typeof result.submission?.createdAt === "string" &&
        Number.isFinite(Date.parse(result.submission.createdAt))
      ) {
        requestKey = "";
        previousPayload = "";
        return true;
      }
      const issues: SubmissionIssue[] = Array.isArray(result?.error?.issues)
        ? result.error.issues.filter(
            (issue: SubmissionIssue) =>
              issue &&
              typeof issue.field === "string" &&
              typeof issue.message === "string",
          )
        : [];
      submissionIssues.value = issues;
      if (issues.length) validation.applyIssues(issues);
      if (
        response.status === 409 &&
        result?.error?.code === "IDEMPOTENCY_CONFLICT"
      ) {
        // The server confirmed that this key belongs to different details.
        // Retrying this rejected payload is safe with a fresh identifier.
        requestKey = "";
        previousPayload = "";
      }
      submissionError.value =
        failureMessages[result?.error?.code] ??
        (response.status === 429
          ? failureMessages.TOO_MANY_REQUESTS!
          : "We could not save your enquiry. Your information is still here; please try again.");
      return false;
    } catch {
      submissionError.value =
        "We could not confirm your submission. Check your connection and try again. Your information is still here.";
      return false;
    } finally {
      pending.value = false;
    }
  }

  return { pending, submissionError, submissionIssues, submit };
}

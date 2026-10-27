import {
  validateSubmission,
  type SubmissionIssue,
  type ValidatedSubmission,
} from "../../shared/submission-contracts.ts";
import {
  createSubmissionGuard,
  MAX_SUBMISSION_BYTES,
  SubmissionBodyError,
  validOrigin,
} from "./submission-security.ts";

type StoredSubmission = { id: string; createdAt: string };
type Failure = {
  ok: false;
  error: { code: string; message: string; issues?: SubmissionIssue[] };
};
export type SubmissionResponse = {
  status: number;
  headers?: Record<string, string>;
  body: { ok: true; submission: StoredSubmission } | Failure;
};
export type SubmissionRequest = {
  method: string;
  headers: Record<string, string | undefined>;
  requestOrigin: string;
  readBody: () => Promise<Uint8Array>;
};

function failure(
  status: number,
  code: string,
  message: string,
  issues?: SubmissionIssue[],
): SubmissionResponse {
  return {
    status,
    body: {
      ok: false,
      error: { code, message, ...(issues ? { issues } : {}) },
    },
  };
}

/** HTTP-independent orchestration. Persistence is injected for isolated tests. */
export function createSubmissionService(options: {
  persist: (
    value: ValidatedSubmission,
    key: string,
  ) => Promise<StoredSubmission>;
  guard?: ReturnType<typeof createSubmissionGuard>;
  expectedOrigin?: () => string | undefined;
  log?: (code: string) => void;
}) {
  const guard = options.guard ?? createSubmissionGuard();
  const log =
    options.log ?? ((code) => console.warn("Submission request failed:", code));

  return async function submit(
    request: SubmissionRequest,
  ): Promise<SubmissionResponse> {
    let release: (() => void) | undefined;
    try {
      if (request.method !== "POST") {
        return {
          ...failure(
            405,
            "METHOD_NOT_ALLOWED",
            "Use POST to submit this form.",
          ),
          headers: { Allow: "POST" },
        };
      }
      const headers = request.headers;
      if (
        !/^application\/json(?:\s*;\s*charset\s*=\s*utf-8)?\s*$/i.test(
          headers["content-type"] ?? "",
        )
      ) {
        return failure(
          415,
          "UNSUPPORTED_CONTENT_TYPE",
          "Send an application/json request.",
        );
      }
      if (
        headers["content-encoding"] &&
        headers["content-encoding"].toLowerCase() !== "identity"
      ) {
        return failure(
          415,
          "UNSUPPORTED_CONTENT_ENCODING",
          "Compressed request bodies are not supported.",
        );
      }
      const expectedOrigin =
        options.expectedOrigin?.() ?? request.requestOrigin;
      if (
        headers["sec-fetch-site"] === "cross-site" ||
        (headers.origin !== undefined &&
          !validOrigin(headers.origin, expectedOrigin))
      ) {
        return failure(
          403,
          "ORIGIN_NOT_ALLOWED",
          "Submit this form from the College FAQs website.",
        );
      }
      const key = headers["idempotency-key"];
      if (
        !key ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          key,
        )
      ) {
        return failure(
          400,
          "INVALID_IDEMPOTENCY_KEY",
          "A valid submission request identifier is required.",
        );
      }
      if (headers["x-submission-trap"]?.trim()) {
        return failure(
          400,
          "INVALID_SUBMISSION",
          "Unable to accept this submission.",
        );
      }
      const claimedLength = headers["content-length"];
      if (
        claimedLength !== undefined &&
        (!/^\d+$/.test(claimedLength) ||
          Number(claimedLength) > MAX_SUBMISSION_BYTES)
      ) {
        return failure(413, "BODY_TOO_LARGE", "The submission is too large.");
      }
      const access = guard.take();
      if (!access.allowed) {
        return {
          ...failure(
            429,
            "TOO_MANY_REQUESTS",
            "Too many requests. Please wait before trying again.",
          ),
          headers: { "Retry-After": String(access.retryAfter) },
        };
      }
      release = access.release;
      const bytes = await request.readBody();
      // Defensive check for adapters that do not stream or enforce the limit.
      if (bytes.byteLength > MAX_SUBMISSION_BYTES) {
        return failure(413, "BODY_TOO_LARGE", "The submission is too large.");
      }
      let input: unknown;
      try {
        input = JSON.parse(
          new TextDecoder("utf-8", { fatal: true }).decode(bytes),
        );
      } catch {
        return failure(400, "INVALID_JSON", "Send a valid JSON submission.");
      }
      const result = validateSubmission(input);
      if (!result.ok) {
        const unsupported = result.issues.some(
          (issue) => issue.field === "form",
        );
        return failure(
          422,
          unsupported ? "UNSUPPORTED_FORM" : "VALIDATION_FAILED",
          "Check the form details and try again.",
          result.issues,
        );
      }
      const submission = await options.persist(result.value, key.toLowerCase());
      return { status: 201, body: { ok: true, submission } };
    } catch (error) {
      if (error instanceof SubmissionBodyError) {
        if (error.code === "BODY_TOO_LARGE")
          return failure(413, error.code, "The submission is too large.");
        if (error.code === "REQUEST_TIMEOUT")
          return failure(
            408,
            error.code,
            "The submission took too long. Please try again.",
          );
        return failure(
          400,
          error.code,
          "Unable to read this submission. Please try again.",
        );
      }
      const failureObject =
        error && typeof error === "object" ? error : undefined;
      const code =
        failureObject && "code" in failureObject
          ? failureObject.code
          : failureObject && "errorCode" in failureObject
            ? failureObject.errorCode
            : undefined;
      if (code === "IDEMPOTENCY_CONFLICT") {
        return failure(
          409,
          "IDEMPOTENCY_CONFLICT",
          "This request identifier was already used for different details. Please submit again.",
        );
      }
      const initializationFailure =
        failureObject &&
        "name" in failureObject &&
        failureObject.name === "PrismaClientInitializationError";
      if (
        initializationFailure ||
        (typeof code === "string" &&
          [
            "DATABASE_UNAVAILABLE",
            "P1000",
            "P1001",
            "P1002",
            "P1003",
            "P1008",
            "P1010",
            "P1011",
            "P1012",
            "P1013",
            "P1017",
            "P2024",
            "P2037",
          ].includes(code))
      ) {
        log("DATABASE_UNAVAILABLE");
        return failure(
          503,
          "DATABASE_UNAVAILABLE",
          "We could not save your enquiry. Please try again shortly.",
        );
      }
      log("INTERNAL_ERROR");
      return failure(
        500,
        "INTERNAL_ERROR",
        "We could not save your enquiry. Please try again.",
      );
    } finally {
      release?.();
    }
  };
}

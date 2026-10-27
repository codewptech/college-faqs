export const MAX_SUBMISSION_BYTES = 32 * 1024;

/** Process-local protection for in-flight requests only. */
export function createSubmissionGuard(
  options: {
    maxConcurrent?: number;
  } = {},
) {
  const maxConcurrent = options.maxConcurrent ?? 16;
  let concurrent = 0;

  function take() {
    if (concurrent >= maxConcurrent)
      return { allowed: false as const, retryAfter: 1 };
    concurrent++;
    let released = false;
    return {
      allowed: true as const,
      release() {
        if (!released) concurrent--;
        released = true;
      },
    };
  }

  return { take };
}

export class SubmissionBodyError extends Error {
  readonly code: "BODY_TOO_LARGE" | "INVALID_BODY" | "REQUEST_TIMEOUT";
  constructor(code: "BODY_TOO_LARGE" | "INVALID_BODY" | "REQUEST_TIMEOUT") {
    super(code);
    this.code = code;
  }
}

export function validOrigin(origin: string, expected: string): boolean {
  try {
    const parsed = new URL(origin);
    const target = new URL(expected);
    return (
      ["http:", "https:"].includes(parsed.protocol) &&
      !parsed.username &&
      !parsed.password &&
      parsed.origin === origin &&
      parsed.origin === target.origin &&
      !target.username &&
      !target.password &&
      target.pathname === "/" &&
      !target.search &&
      !target.hash
    );
  } catch {
    return false;
  }
}

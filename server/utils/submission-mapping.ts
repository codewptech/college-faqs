import type { ValidatedSubmission } from "../../shared/submission-contracts.ts";

/** Only accepts output from the authoritative validator. Does not rename inputs. */
export function mapSubmission(value: ValidatedSubmission) {
  const { fullName, phone, email, ...details } = value.fields;
  if (
    typeof fullName !== "string" ||
    typeof phone !== "string" ||
    (email !== undefined && typeof email !== "string")
  ) {
    throw new Error("Invalid validated contact fields.");
  }
  return { name: fullName, mobile: phone, email: email ?? null, details };
}

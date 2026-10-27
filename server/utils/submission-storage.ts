import { isDeepStrictEqual } from "node:util";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { ValidatedSubmission } from "../../shared/submission-contracts.ts";
import { getPrisma } from "./prisma.ts";
import { mapSubmission } from "./submission-mapping.ts";

type StoredContact = ReturnType<typeof mapSubmission>;
type StoredRecord = StoredContact & { id: string; createdAt: Date };
type CreateData = Omit<StoredContact, "email" | "details"> & {
  email?: string;
  details: Prisma.InputJsonObject;
  idempotencyKey: string;
};
export type SubmissionDelegate = {
  create(args: { data: CreateData }): Promise<StoredRecord>;
  findUnique(args: {
    where: { idempotencyKey: string };
  }): Promise<StoredRecord | null>;
};

// Explicit dispatch: no request-provided database model or property access.
function delegateFor(
  prisma: PrismaClient,
  value: ValidatedSubmission,
): SubmissionDelegate {
  switch (value.form) {
    case "mba_mentor":
      return prisma.mbaMentorEnquiry as unknown as SubmissionDelegate;
    case "mba_predictor":
      return prisma.mbaPredictorEnquiry as unknown as SubmissionDelegate;
    case "mba_application":
      return prisma.mbaApplicationEnquiry as unknown as SubmissionDelegate;
    case "mba_start":
      return prisma.mbaStartEnquiry as unknown as SubmissionDelegate;
    case "mba_gdpi":
      return prisma.mbaGdpiEnquiry as unknown as SubmissionDelegate;
    case "engineering_enquiry":
      return prisma.engineeringEnquiry as unknown as SubmissionDelegate;
    case "study_abroad_profile":
      return prisma.studyAbroadProfileEnquiry as unknown as SubmissionDelegate;
    case "study_abroad_mentor":
      return prisma.studyAbroadMentorEnquiry as unknown as SubmissionDelegate;
  }
  throw new Error("Unsupported form.");
}

/** The unique DB key arbitrates concurrent retries, across processes/restarts. */
export async function saveWithDelegate(
  delegate: SubmissionDelegate,
  value: ValidatedSubmission,
  idempotencyKey: string,
) {
  const mapped = mapSubmission(value);
  let record: StoredRecord;
  try {
    record = await delegate.create({
      data: {
        name: mapped.name,
        mobile: mapped.mobile,
        ...(mapped.email !== null ? { email: mapped.email } : {}),
        details: mapped.details as Prisma.InputJsonObject,
        idempotencyKey,
      },
    });
  } catch (error) {
    if (
      !error ||
      typeof error !== "object" ||
      !("code" in error) ||
      error.code !== "P2002"
    )
      throw error;
    const previous = await delegate.findUnique({ where: { idempotencyKey } });
    if (!previous) throw error;
    const { name, mobile, email, details } = previous;
    if (!isDeepStrictEqual({ name, mobile, email, details }, mapped)) {
      throw Object.assign(new Error("Request key already used."), {
        code: "IDEMPOTENCY_CONFLICT",
      });
    }
    record = previous;
  }
  return { id: record.id, createdAt: record.createdAt.toISOString() };
}

export function persistSubmission(
  value: ValidatedSubmission,
  idempotencyKey: string,
) {
  return saveWithDelegate(
    delegateFor(getPrisma(), value),
    value,
    idempotencyKey,
  );
}

/** Private, read-only check. Does not load .env or expose an HTTP endpoint. */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validOrigin } from "../server/utils/submission-security.ts";
import {
  readSubmissionCatalog,
  submissionCatalogCompatible,
} from "./submission-schema-contract.mjs";

const deadlineMs = 5_000;

async function probe() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient({ log: [], errorFormat: "minimal" });
  try {
    if (!submissionCatalogCompatible(await readSubmissionCatalog(prisma))) {
      throw new Error("Schema unavailable");
    }
    process.exitCode = 0;
  } catch {
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv.includes("--probe")) {
  // Parent owns the hard deadline, including client initialization/disconnect.
  await probe().catch(() => {
    process.exitCode = 1;
  });
} else if (
  !process.env.DATABASE_URL ||
  !validOrigin(
    process.env.SUBMISSIONS_ORIGIN ?? "",
    process.env.SUBMISSIONS_ORIGIN ?? "",
  )
) {
  console.error(
    "SUBMISSION_NOT_READY: configure DATABASE_URL and exact SUBMISSIONS_ORIGIN.",
  );
  process.exitCode = 1;
} else {
  const child = spawn(
    process.execPath,
    [fileURLToPath(import.meta.url), "--probe"],
    {
      stdio: "ignore",
      env: process.env,
    },
  );
  const timer = setTimeout(() => child.kill("SIGKILL"), deadlineMs);
  const code = await new Promise((resolve) => {
    child.once("error", () => resolve(1));
    child.once("exit", (status) => resolve(status === 0 ? 0 : 1));
  });
  clearTimeout(timer);
  console[code === 0 ? "log" : "error"](
    code === 0
      ? "SUBMISSION_READY: origin configured; eight-model catalog contract and grants compatible."
      : "SUBMISSION_NOT_READY: database/schema unavailable or check exceeded 5 seconds.",
  );
  process.exitCode = code;
}

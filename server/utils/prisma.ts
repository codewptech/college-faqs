import { PrismaClient } from "@prisma/client";

// One pool per Node/Nitro process, including hot reload. Never import from app/.
const databaseGlobal = globalThis as typeof globalThis & {
  collegeFaqsPrisma?: PrismaClient;
};

export function getPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw Object.assign(new Error("Database is not configured."), {
      code: "DATABASE_UNAVAILABLE",
    });
  }
  return (databaseGlobal.collegeFaqsPrisma ??= new PrismaClient({
    log: [],
    errorFormat: "minimal",
  }));
}

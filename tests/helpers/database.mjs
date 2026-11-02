import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { realpath, rm, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { freePort } from "./runtime.mjs";

/** Either an explicit disposable CI service or an owned private local cluster.
 * Never reads DATABASE_URL/.env; never resets/drops an existing database.
 */
export async function database({ artifacts, run, env }) {
  const { PrismaClient } = await import("@prisma/client");
  let cluster;
  let bin;
  let started = false;
  let admin;
  let name;
  let created = false;
  const supplied = process.env.TEST_POSTGRES_URL;
  const close = async () => {
    try {
      if (created)
        await admin.$executeRawUnsafe(`DROP DATABASE "${name}" WITH (FORCE)`);
    } finally {
      await admin?.$disconnect();
      if (started) {
        await run(
          join(bin, "pg_ctl"),
          ["-D", cluster, "-m", "fast", "-w", "stop"],
          "postgres-stop",
        );
        await rm(cluster, { recursive: true });
      }
    }
  };
  try {
    let service;
    if (supplied) {
      service = new URL(supplied);
      assert.equal(service.protocol, "postgresql:");
      assert.equal(
        service.hostname,
        "127.0.0.1",
        "Only an explicit loopback test service is allowed",
      );
      assert.equal(service.username, "college_test");
      assert.equal(service.password, "synthetic-only");
      assert.equal(service.pathname, "/postgres");
      assert.ok(
        service.port && !service.search && !service.hash,
        "Use the dedicated service port without overrides",
      );
    } else {
      assert.notEqual(
        process.getuid?.(),
        0,
        "Run local PostgreSQL tests as an ordinary user",
      );
      assert.ok(
        process.env.PG_BIN,
        "PostgreSQL required: set PG_BIN to installed binaries, or TEST_POSTGRES_URL to the dedicated CI test service. No tests are skipped.",
      );
      bin = resolve(process.env.PG_BIN);
      for (const tool of ["initdb", "postgres", "pg_ctl"])
        assert.ok(
          (await stat(join(bin, tool))).isFile(),
          `Missing PostgreSQL binary: ${tool}`,
        );
      cluster = join(artifacts, "postgres");
      await run(
        join(bin, "initdb"),
        [
          "-D",
          cluster,
          "-U",
          "college_test",
          "--auth-local=trust",
          "--auth-host=trust",
          "--no-locale",
          "-E",
          "UTF8",
        ],
        "postgres-init",
      );
      const port = await freePort();
      await run(
        join(bin, "pg_ctl"),
        [
          "-D",
          cluster,
          "-l",
          join(artifacts, "postgres.log"),
          "-o",
          `-h 127.0.0.1 -p ${port} -k ${artifacts}`,
          "-w",
          "start",
        ],
        "postgres-start",
      );
      started = true;
      service = new URL(
        `postgresql://college_test:synthetic-only@127.0.0.1:${port}/postgres`,
      );
    }
    admin = new PrismaClient({
      datasourceUrl: service.href,
      log: [],
      errorFormat: "minimal",
    });
    const [identity] =
      await admin.$queryRaw`SELECT current_database() AS database, current_user AS role, current_setting('data_directory') AS directory`;
    assert.equal(identity.database, "postgres");
    assert.equal(identity.role, "college_test");
    if (cluster) {
      assert.equal(await realpath(identity.directory), await realpath(cluster));
      const info = await stat(cluster);
      assert.equal(info.uid, process.getuid());
      assert.equal(info.mode & 0o077, 0);
    }
    name = `college_faqs_test_${randomUUID().replaceAll("-", "")}`;
    // Only a new random test database is ever provisioned; no IF EXISTS/reset.
    await admin.$executeRawUnsafe(`CREATE DATABASE "${name}"`);
    created = true;
    service.pathname = `/${name}`;
    service.search = "connect_timeout=3&connection_limit=4";
    const url = service.href;
    const db = new PrismaClient({
      datasourceUrl: url,
      log: [],
      errorFormat: "minimal",
    });
    try {
      const [check] = await db.$queryRaw`SELECT current_database() AS name`;
      assert.equal(check.name, name);
      const tables =
        await db.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
      assert.equal(tables.length, 0, "Refuse a nonempty target");
    } finally {
      await db.$disconnect();
    }
    const schema = join(artifacts, "schema.sql");
    await run(
      process.execPath,
      [
        "node_modules/prisma/build/index.js",
        "migrate",
        "diff",
        "--from-empty",
        "--to-schema-datamodel",
        "prisma/schema.prisma",
        "--script",
        "--output",
        schema,
      ],
      "test-schema",
      { ...env, DATABASE_URL: url, DIRECT_URL: url },
    );
    await run(
      process.execPath,
      [
        "node_modules/prisma/build/index.js",
        "db",
        "execute",
        "--url",
        url,
        "--file",
        schema,
      ],
      "test-provision",
      { ...env, DATABASE_URL: url, DIRECT_URL: url },
    );
    return { url, close };
  } catch (error) {
    await close();
    throw error;
  }
}

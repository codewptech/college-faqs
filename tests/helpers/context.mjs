import assert from "node:assert/strict";
import { readFileSync, realpathSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, sep } from "node:path";

assert.ok(
  process.env.TEST_CONTEXT,
  "Run the complete suite with npm run test:all",
);
const file = realpathSync(process.env.TEST_CONTEXT);
const directory = dirname(file);
assert.ok(
  directory.startsWith(`${realpathSync(tmpdir())}${sep}college-tests-`),
);
assert.equal(statSync(directory).uid, process.getuid());
assert.equal(statSync(directory).mode & 0o077, 0);
export const context = JSON.parse(readFileSync(file, "utf8"));
const app = new URL(context.origin);
const db = new URL(context.database);
assert.equal(app.hostname, "127.0.0.1");
assert.equal(app.protocol, "http:");
assert.equal(db.hostname, "127.0.0.1");
assert.equal(db.username, "college_test");
assert.equal(db.password, "synthetic-only");
assert.match(db.pathname, /^\/college_faqs_test_[a-f0-9]{32}$/);
assert.ok(!db.searchParams.has("host"));

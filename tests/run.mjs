/** Complete black-box application suite. Linux, Node 24, Chrome and test PG required. */
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { database } from "./helpers/database.mjs";
import {
  freePort,
  ready,
  root,
  run as execute,
  start,
} from "./helpers/runtime.mjs";

const artifacts = await mkdtemp(join(tmpdir(), "college-tests-"));
const env = {
  ...process.env,
  DATABASE_URL: "postgresql://unused@127.0.0.1:1/unused",
  DIRECT_URL: "postgresql://unused@127.0.0.1:1/unused",
  NODE_ENV: "test",
  NUXT_TELEMETRY_DISABLED: "1",
};
delete env.NODE_TEST_CONTEXT;
const tasks = [];
const run = (cmd, args, label, settings = env) =>
  execute(cmd, args, { env: settings, log: join(artifacts, `${label}.log`) });
let pg;
let passed = false;
console.log(`Application-test artifacts: ${artifacts}`);
try {
  await run(
    process.env.CHROME_PATH || "google-chrome",
    ["--version"],
    "chrome-version",
  );
  await run(
    process.execPath,
    ["node_modules/prisma/build/index.js", "generate"],
    "prisma-client",
  );
  pg = await database({ artifacts, run, env });
  const port = await freePort();
  let cdp = await freePort();
  while (cdp === port) cdp = await freePort();
  const origin = `http://127.0.0.1:${port}`;
  const appEnv = {
    ...env,
    DATABASE_URL: pg.url,
    DIRECT_URL: pg.url,
    SUBMISSIONS_ORIGIN: origin,
    NUXT_HOST: "127.0.0.1",
    NITRO_HOST: "127.0.0.1",
  };
  const app = start(
    process.execPath,
    [
      "node_modules/nuxt/bin/nuxt.mjs",
      "dev",
      "--no-fork",
      "--no-tui",
      "--no-takeover",
      "--strictPort",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--dotenv",
      join(artifacts, "no.env"),
    ],
    { env: appEnv, log: join(artifacts, "application.log") },
  );
  tasks.push(app);
  await ready(`${origin}/api/health`, app);
  const chrome = start(
    process.env.CHROME_PATH || "google-chrome",
    [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-background-networking",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--no-first-run",
      "--remote-debugging-address=127.0.0.1",
      `--remote-debugging-port=${cdp}`,
      `--user-data-dir=${join(artifacts, "chrome")}`,
      "about:blank",
    ],
    { env, log: join(artifacts, "chrome.log") },
  );
  tasks.push(chrome);
  await ready(`http://127.0.0.1:${cdp}/json/version`, chrome);
  const context = join(artifacts, "context.json");
  await writeFile(context, JSON.stringify({ origin, cdp, database: pg.url }));
  // One Node runner owns all suites; browser/database are mandatory, never opt-in.
  const suites = (await readdir(join(root, "tests")))
    .filter((file) => file.endsWith(".test.mjs"))
    .sort()
    .map((file) => `tests/${file}`);
  if (!suites.length) throw new Error("No application tests found");
  const tests = start(
    process.execPath,
    ["--test", "--test-concurrency=1", ...suites],
    {
      env: { ...appEnv, TEST_CONTEXT: context },
      log: join(artifacts, "tests.log"),
    },
  );
  tasks.push(tests);
  tests.child.stdout.on("data", (data) => process.stdout.write(data));
  tests.child.stderr.on("data", (data) => process.stderr.write(data));
  await tests.wait(360_000);
  passed = true;
} finally {
  const stopped = await Promise.allSettled(
    tasks.reverse().map((task) => task.stop()),
  );
  try {
    await pg?.close();
  } finally {
    await rm(join(artifacts, "chrome"), { recursive: true, force: true });
  }
  const failures = stopped.filter((result) => result.status === "rejected");
  if (failures.length)
    throw new AggregateError(
      failures.map((result) => result.reason),
      "Owned process cleanup failed",
    );
  await writeFile(
    join(artifacts, "result.json"),
    JSON.stringify(
      { passed, productionAccessed: false, ownedProcessesStopped: true },
      null,
      2,
    ),
  );
}

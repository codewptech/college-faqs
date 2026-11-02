import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createWriteStream } from "node:fs";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../../", import.meta.url));
export async function freePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

export function start(command, args, { env, log, group = true }) {
  const output = createWriteStream(log);
  const child = spawn(command, args, {
    cwd: root,
    env,
    detached: group,
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.pipe(output, { end: false });
  child.stderr.pipe(output, { end: false });
  let failure;
  child.on("error", (error) => {
    failure = error;
  });
  const finished = new Promise((resolve) => child.once("close", resolve));
  function signal(value) {
    if (!child.pid) return;
    try {
      if (group) process.kill(-child.pid, value);
      else child.kill(value);
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }
  }
  return {
    child,
    async wait(timeout = 120_000) {
      const timer = setTimeout(() => signal("SIGKILL"), timeout);
      try {
        const code = await finished;
        if (failure)
          throw new Error(`Cannot run ${command}: ${failure.message}`);
        assert.equal(code, 0, `${command} failed; see ${log}`);
      } finally {
        clearTimeout(timer);
      }
    },
    async stop() {
      signal("SIGTERM");
      const timer = setTimeout(() => signal("SIGKILL"), 5_000);
      try {
        await finished;
      } finally {
        clearTimeout(timer);
      }
      await new Promise((resolve) => output.end(resolve));
    },
    alive() {
      if (failure) throw new Error(`Cannot run ${command}: ${failure.message}`);
      assert.equal(child.exitCode, null, `Local process exited; see ${log}`);
      assert.equal(
        child.signalCode,
        null,
        `Local process was terminated; see ${log}`,
      );
    },
  };
}

export async function run(command, args, settings) {
  const task = start(command, args, { ...settings, group: false });
  try {
    await task.wait();
  } finally {
    await task.stop();
  }
}

export async function ready(url, task) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    task.alive();
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(1_000) })).ok) return;
    } catch {
      /* wait only for this owned local process */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Local startup timed out: ${url}`);
}

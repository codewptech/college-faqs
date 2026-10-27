import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createServer, request as httpRequest } from "node:http";
import { once } from "node:events";
import { PassThrough } from "node:stream";
import { test } from "node:test";
import { createApp, toNodeListener } from "h3";
import {
  createSubmissionHandler,
  readSubmissionBody,
} from "../server/utils/submission-http.ts";
import { createSubmissionService } from "../server/utils/submission-service.ts";
import {
  createSubmissionGuard,
  MAX_SUBMISSION_BYTES,
} from "../server/utils/submission-security.ts";

const contact = { fullName: " Student ", phone: "+91 98765 43210" };
const fieldsByForm = {
  mba_mentor: { ...contact, program: "mba", message: "Please advise." },
  mba_predictor: {
    ...contact,
    exams: [
      { exam: "cat", score: "0", percentile: "100" },
      { exam: "other", otherExamName: "Exam B", score: "42" },
    ],
  },
  mba_application: {
    ...contact,
    email: "STUDENT@Example.com",
    exam: "CAT",
    score: "0",
    percentile: "0",
  },
  mba_start: {
    ...contact,
    entranceExams: "CAT",
    bestScore: "0",
    bestPercentile: "100",
  },
  mba_gdpi: {
    ...contact,
    email: "student@example.com",
    appliedColleges: ["A", "", "B"],
    targetColleges: ["C"],
  },
  engineering_enquiry: {
    ...contact,
    preferredBranch: "Computer Science",
    message: "Please advise.",
  },
  study_abroad_profile: {
    name: " Student ",
    phone: contact.phone,
    qualification: "B.Com",
    studyLevel: "other",
    otherStudyLevel: "Diploma",
    destination: "usa",
  },
  study_abroad_mentor: { name: " Student ", phone: contact.phone },
};
const envelope = (form = "mba_mentor", fields = fieldsByForm[form]) => ({
  form,
  fields,
});
const saved = () => ({
  id: randomUUID(),
  createdAt: "2026-10-24T00:00:00.000Z",
});

async function serverFor(t, options = {}) {
  const calls = [];
  const logs = [];
  const service = createSubmissionService({
    persist:
      options.persist ??
      (async (value, key) => {
        calls.push({ value, key });
        return saved();
      }),
    guard: options.guard,
    expectedOrigin: options.expectedOrigin,
    log: (code) => logs.push(code),
  });
  const app = createApp();
  app.use("/api/submissions", createSubmissionHandler(service));
  const server = createServer(toNodeListener(app));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });
  return {
    base,
    calls,
    logs,
    async send(body = envelope(), options = {}) {
      const response = await fetch(`${base}/api/submissions`, {
        method: "POST",
        ...options,
        headers: {
          "content-type": "application/json",
          "idempotency-key": randomUUID(),
          ...options.headers,
        },
        body: typeof body === "string" ? body : JSON.stringify(body),
      });
      const data = await response.json();
      return { response, data };
    },
  };
}

for (const form of Object.keys(fieldsByForm)) {
  test(`API ${form}: validates, normalizes, persists, and returns only server metadata`, async (t) => {
    const api = await serverFor(t);
    const key = randomUUID();
    const { response, data } = await api.send(envelope(form), {
      headers: { "idempotency-key": key },
    });
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.deepEqual(Object.keys(data).sort(), ["ok", "submission"]);
    assert.equal(data.ok, true);
    assert.deepEqual(Object.keys(data.submission).sort(), ["createdAt", "id"]);
    assert.equal(api.calls.length, 1);
    assert.equal(api.calls[0].key, key);
    assert.equal(api.calls[0].value.form, form);
    assert.equal(api.calls[0].value.fields.fullName, "Student");
    assert.equal(api.calls[0].value.fields.phone, "+919876543210");
    assert.doesNotMatch(JSON.stringify(data), /Student|98765|example\.com/);
    if (form === "mba_predictor") {
      assert.deepEqual(api.calls[0].value.fields.exams, [
        { exam: "cat", score: 0, percentile: 100 },
        { exam: "other", otherExamName: "Exam B", score: 42 },
      ]);
    }
    if (form === "mba_gdpi")
      assert.deepEqual(api.calls[0].value.fields.appliedColleges, ["A", "B"]);
  });
}

test("API rejects unsupported forms, malformed structures, unknown fields, and invalid fields before persistence", async (t) => {
  const api = await serverFor(t);
  for (const body of [
    { form: "arbitrary_model", fields: fieldsByForm.mba_mentor },
    null,
    [],
    "null",
    "[]",
    '"text"',
    { form: "mba_mentor", fields: [] },
    { ...envelope(), database: "students" },
    envelope("mba_mentor", { ...fieldsByForm.mba_mentor, isAdmin: true }),
    envelope("mba_mentor", {
      ...fieldsByForm.mba_mentor,
      phone: "bad",
      email: "invalid@",
    }),
    envelope("mba_predictor", {
      ...fieldsByForm.mba_predictor,
      exams: [{ exam: "cat", percentile: 101 }],
    }),
  ]) {
    const { response, data } = await api.send(body);
    assert.equal(response.status, 422, JSON.stringify(body));
    assert.equal(data.ok, false);
    assert.ok(
      ["UNSUPPORTED_FORM", "VALIDATION_FAILED"].includes(data.error.code),
    );
    assert.ok(data.error.issues.length);
  }
  assert.equal(api.calls.length, 0);
});

test("API returns bounded validation messages without submitted values", async (t) => {
  const api = await serverFor(t);
  const { response, data } = await api.send(
    envelope("mba_mentor", {
      ...fieldsByForm.mba_mentor,
      email: "private-invalid-address",
    }),
  );
  assert.equal(response.status, 422);
  assert.ok(data.error.issues.some((issue) => issue.field === "email"));
  assert.doesNotMatch(
    JSON.stringify(data),
    /private-invalid-address|98765|Student/,
  );
});

test("API rejects invalid JSON and malformed UTF-8 without database calls", async (t) => {
  const api = await serverFor(t);
  for (const body of ["{", "", '{"form":', "{unquoted:1}"]) {
    const { response, data } = await api.send(body);
    assert.equal(response.status, 400);
    assert.equal(data.error.code, "INVALID_JSON");
  }
  const response = await fetch(`${api.base}/api/submissions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "idempotency-key": randomUUID(),
    },
    body: new Uint8Array([123, 34, 255, 34, 58, 49, 125]),
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, "INVALID_JSON");
  assert.equal(api.calls.length, 0);
});

test("API rejects retrieval and unsupported methods with Allow: POST", async (t) => {
  const api = await serverFor(t);
  for (const method of ["GET", "PUT", "DELETE", "OPTIONS", "HEAD"]) {
    const response = await fetch(`${api.base}/api/submissions`, { method });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "POST");
    if (method !== "HEAD")
      assert.equal((await response.json()).error.code, "METHOD_NOT_ALLOWED");
  }
  assert.equal(api.calls.length, 0);
});

test("API requires JSON content type and refuses compressed bodies", async (t) => {
  const api = await serverFor(t);
  for (const contentType of [
    "text/plain",
    "application/x-www-form-urlencoded",
    "application/json; charset=latin1",
  ]) {
    const { response, data } = await api.send(envelope(), {
      headers: { "content-type": contentType },
    });
    assert.equal(response.status, 415);
    assert.equal(data.error.code, "UNSUPPORTED_CONTENT_TYPE");
  }
  const compressed = await api.send(envelope(), {
    headers: { "content-encoding": "gzip" },
  });
  assert.equal(compressed.response.status, 415);
  assert.equal(compressed.data.error.code, "UNSUPPORTED_CONTENT_ENCODING");
  const accepted = await api.send(envelope(), {
    headers: { "content-type": "Application/JSON; charset=UTF-8" },
  });
  assert.equal(accepted.response.status, 201);
  assert.equal(api.calls.length, 1);
});

test("API requires UUID idempotency keys and rejects filled automated-submission traps", async (t) => {
  const api = await serverFor(t);
  for (const key of ["", "not-a-uuid", "a".repeat(300)]) {
    const { response, data } = await api.send(envelope(), {
      headers: { "idempotency-key": key },
    });
    assert.equal(response.status, 400);
    assert.equal(data.error.code, "INVALID_IDEMPOTENCY_KEY");
  }
  const trap = await api.send(envelope(), {
    headers: { "x-submission-trap": "bot-filled" },
  });
  assert.equal(trap.response.status, 400);
  assert.equal(trap.data.error.code, "INVALID_SUBMISSION");
  assert.equal(api.calls.length, 0);
});

test("API enforces exact origins, rejects cross-site requests, and ignores spoofed forwarding", async (t) => {
  const api = await serverFor(t);
  for (const headers of [
    { origin: "https://evil.example" },
    { origin: "null" },
    { origin: `${api.base}/path` },
    { origin: `${api.base}/` },
    { origin: api.base, "sec-fetch-site": "cross-site" },
    {
      origin: "https://evil.example",
      "x-forwarded-host": "evil.example",
      "x-forwarded-proto": "https",
    },
  ]) {
    const { response, data } = await api.send(envelope(), { headers });
    assert.equal(response.status, 403, JSON.stringify(headers));
    assert.equal(data.error.code, "ORIGIN_NOT_ALLOWED");
  }
  assert.equal(
    (
      await api.send(envelope(), {
        headers: { origin: api.base, "sec-fetch-site": "same-origin" },
      })
    ).response.status,
    201,
  );
  assert.equal((await api.send()).response.status, 201); // non-browser client
  assert.equal(api.calls.length, 2);
});

test("API allows the explicitly configured canonical origin behind TLS termination", async (t) => {
  const api = await serverFor(t, {
    expectedOrigin: () => "https://www.collegefaqs.com",
  });
  assert.equal(
    (
      await api.send(envelope(), {
        headers: { origin: "https://www.collegefaqs.com" },
      })
    ).response.status,
    201,
  );
  assert.equal(
    (await api.send(envelope(), { headers: { origin: api.base } })).response
      .status,
    403,
  );
  assert.equal(
    (
      await api.send(envelope(), {
        headers: { origin: "https://www.collegefaqs.com.evil.example" },
      })
    ).response.status,
    403,
  );
});

test("API limits bodies by actual bytes with and without Content-Length", async (t) => {
  const api = await serverFor(t);
  const body = JSON.stringify(
    envelope("mba_mentor", {
      ...fieldsByForm.mba_mentor,
      message: "é".repeat(MAX_SUBMISSION_BYTES),
    }),
  );
  const direct = await api.send(body);
  assert.equal(direct.response.status, 413);
  assert.equal(direct.data.error.code, "BODY_TOO_LARGE");
  const result = await new Promise((resolve, reject) => {
    const request = httpRequest(
      `${api.base}/api/submissions`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": randomUUID(),
          "transfer-encoding": "chunked",
        },
      },
      (response) => {
        let resultBody = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          resultBody += chunk;
        });
        response.on("end", () =>
          resolve({
            status: response.statusCode,
            body: JSON.parse(resultBody),
          }),
        );
      },
    );
    request.on("error", reject);
    request.write(body.slice(0, 8192));
    request.write(body.slice(8192, 16384));
    request.end(body.slice(16384));
  });
  assert.equal(result.status, 413);
  assert.equal(result.body.error.code, "BODY_TOO_LARGE");
  assert.equal(api.calls.length, 0);
});

test("API accepts more than 12 valid requests in one minute from the same visitor", async (t) => {
  const api = await serverFor(t);
  const started = Date.now();
  const ids = new Set();
  for (let attempt = 0; attempt < 24; attempt++) {
    const { response, data } = await api.send();
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("retry-after"), null);
    assert.equal(data.ok, true);
    ids.add(data.submission.id);
  }
  assert.ok(
    Date.now() - started < 60_000,
    "all requests complete within one minute",
  );
  assert.equal(api.calls.length, 24);
  assert.equal(new Set(api.calls.map(({ key }) => key)).size, 24);
  assert.equal(
    ids.size,
    24,
    "intentional repeat enquiries receive independent saved metadata",
  );
  const invalid = await api.send(
    envelope("mba_mentor", { ...fieldsByForm.mba_mentor, phone: "invalid" }),
  );
  assert.equal(invalid.response.status, 422);
  assert.equal(invalid.data.error.code, "VALIDATION_FAILED");
  assert.equal(api.calls.length, 24);
  assert.equal((await api.send()).response.status, 201);
  assert.equal(api.calls.length, 25);
});

test("API bounds concurrent requests and releases capacity after persistence", async (t) => {
  let resolvePersistence;
  let entered;
  const enteredPromise = new Promise((resolve) => {
    entered = resolve;
  });
  const persistence = new Promise((resolve) => {
    resolvePersistence = resolve;
  });
  const api = await serverFor(t, {
    guard: createSubmissionGuard({ maxConcurrent: 1 }),
    persist: async () => {
      entered();
      return persistence;
    },
  });
  const first = api.send();
  await enteredPromise;
  const blocked = await api.send();
  assert.equal(blocked.response.status, 429);
  assert.equal(blocked.response.headers.get("retry-after"), "1");
  assert.equal(blocked.data.error.code, "TOO_MANY_REQUESTS");
  resolvePersistence(saved());
  assert.equal((await first).response.status, 201);
  assert.equal((await api.send()).response.status, 201);
});

test("API preserves retry identifiers, allows independent repeat enquiries, and reports conflicts", async (t) => {
  const requests = new Map();
  const api = await serverFor(t, {
    persist: async (value, key) => {
      const previous = requests.get(key);
      const fingerprint = JSON.stringify(value);
      if (previous) {
        if (previous.fingerprint !== fingerprint)
          throw Object.assign(new Error("private details"), {
            code: "IDEMPOTENCY_CONFLICT",
          });
        return previous.result;
      }
      const result = saved();
      requests.set(key, { fingerprint, result });
      return result;
    },
  });
  const key = randomUUID();
  const first = await api.send(envelope(), {
    headers: { "idempotency-key": key },
  });
  const retry = await api.send(envelope(), {
    headers: { "idempotency-key": key.toUpperCase() },
  });
  assert.deepEqual(first.data, retry.data);
  assert.equal(requests.size, 1);
  const changed = await api.send(
    envelope("mba_mentor", {
      ...fieldsByForm.mba_mentor,
      message: "Different enquiry",
    }),
    { headers: { "idempotency-key": key } },
  );
  assert.equal(changed.response.status, 409);
  assert.equal(changed.data.error.code, "IDEMPOTENCY_CONFLICT");
  const repeat = await api.send();
  assert.equal(repeat.response.status, 201);
  assert.notEqual(repeat.data.submission.id, first.data.submission.id);
  assert.equal(requests.size, 2);
});

test("API never reports success before persistence and safely handles database/unexpected failures", async (t) => {
  for (const code of [
    "DATABASE_UNAVAILABLE",
    "P1001",
    "P2024",
    "P2037",
    "UNEXPECTED_CODE",
  ]) {
    const api = await serverFor(t, {
      persist: async () => {
        throw Object.assign(
          new Error(
            "postgresql://user:SECRET@host/db student@example.com SELECT private stack trace",
          ),
          { code },
        );
      },
    });
    const { response, data } = await api.send();
    assert.equal(response.status, code === "UNEXPECTED_CODE" ? 500 : 503);
    assert.equal(data.ok, false);
    assert.equal("submission" in data, false);
    assert.doesNotMatch(
      JSON.stringify(data),
      /SECRET|postgresql|SELECT|stack|student@example/,
    );
    assert.deepEqual(api.logs, [
      code === "UNEXPECTED_CODE" ? "INTERNAL_ERROR" : "DATABASE_UNAVAILABLE",
    ]);
  }
});

test("API safely recognizes Prisma initialization errors using errorCode", async (t) => {
  const api = await serverFor(t, {
    persist: async () => {
      throw Object.assign(new Error("private database connection string"), {
        name: "PrismaClientInitializationError",
        errorCode: "P1001",
      });
    },
  });
  const { response, data } = await api.send();
  assert.equal(response.status, 503);
  assert.equal(data.error.code, "DATABASE_UNAVAILABLE");
  assert.doesNotMatch(JSON.stringify(data), /private|connection|P1001/);
  assert.deepEqual(api.logs, ["DATABASE_UNAVAILABLE"]);
});

test("concurrency guard retains its default capacity and releases each request only once", () => {
  const guard = createSubmissionGuard();
  const active = Array.from({ length: 16 }, () => guard.take());
  for (const access of active) assert.equal(access.allowed, true);
  assert.equal(guard.take().allowed, false);
  active[0].release();
  active[0].release(); // release is idempotent
  const replacement = guard.take();
  assert.equal(replacement.allowed, true);
  assert.equal(guard.take().allowed, false);
  for (const access of active) access.release();
  replacement.release();
  const next = guard.take();
  assert.equal(
    next.allowed,
    true,
    "released capacity is available immediately",
  );
  next.release();
});

test("API releases concurrent capacity after validation and persistence failures", async (t) => {
  let attempts = 0;
  const api = await serverFor(t, {
    guard: createSubmissionGuard({ maxConcurrent: 1 }),
    persist: async () => {
      if (++attempts === 1)
        throw Object.assign(new Error("unavailable"), {
          code: "DATABASE_UNAVAILABLE",
        });
      return saved();
    },
  });
  assert.equal((await api.send("{")).response.status, 400);
  assert.equal(
    (
      await api.send(
        envelope("mba_mentor", {
          ...fieldsByForm.mba_mentor,
          phone: "invalid",
        }),
      )
    ).response.status,
    422,
  );
  assert.equal((await api.send()).response.status, 503);
  assert.equal((await api.send()).response.status, 201);
  assert.equal(attempts, 2);
});

test("body reader handles transport aborts and enforces its read deadline", async () => {
  const aborted = new PassThrough();
  const abortedResult = readSubmissionBody(aborted);
  aborted.emit("aborted");
  aborted.emit("error", new Error("transport disconnected"));
  await assert.rejects(abortedResult, { code: "INVALID_BODY" });
  const stalled = new PassThrough();
  const keepAlive = setTimeout(() => {}, 100);
  try {
    await assert.rejects(readSubmissionBody(stalled, 5), {
      code: "REQUEST_TIMEOUT",
    });
  } finally {
    clearTimeout(keepAlive);
    aborted.destroy();
    stalled.destroy();
  }
});

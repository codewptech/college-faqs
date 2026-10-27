/** Exercise the actual composables, payload mapper, and page submit handlers. */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { build } from "esbuild";
import { compileScript, parse } from "@vue/compiler-sfc";
import { ref } from "vue";

// Register the suite before esbuild starts its asynchronous compile.
test("frontend submission integration", async (suite) => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const routes = [
    ["mba_mentor", "mba/talk-to-mentor"],
    ["mba_predictor", "mba/college-predictor"],
    ["mba_application", "mba/application-form"],
    ["mba_start", "mba/start-your-application"],
    ["mba_gdpi", "mba/gdpi-preparation"],
    ["engineering_enquiry", "engineering/index"],
    ["study_abroad_profile", "study-abroad/index"],
  ];
  const compiled = await build({
    stdin: {
      contents: [
        'export { useFormSubmission } from "./app/composables/useFormSubmission";',
        'export { useFormPreview } from "./app/composables/useFormPreview";',
        'export { submissionFields } from "./app/utils/submission-payload";',
        ...routes.map(
          ([form, route]) =>
            `export { default as ${form} } from "./app/pages/programs/${route}.vue";`,
        ),
      ].join("\n"),
      resolveDir: root,
    },
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    plugins: [
      {
        name: "actual-page-script-tests",
        setup(builder) {
          builder.onResolve({ filter: /^vue$/ }, () => ({
            path: import.meta.resolve("vue"),
            external: true,
          }));
          builder.onResolve({ filter: /^~~\// }, ({ path }) =>
            builder.resolve(resolve(root, path.slice(3)), {
              resolveDir: root,
              kind: "import-statement",
            }),
          );
          builder.onLoad({ filter: /\.vue$/ }, async ({ path }) => {
            const { descriptor } = parse(await readFile(path, "utf8"), {
              filename: path,
            });
            if (!descriptor.script && !descriptor.scriptSetup) {
              return { contents: "export default {};", loader: "js" };
            }
            const script = compileScript(descriptor, { id: path });
            return {
              contents:
                'import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";\n' +
                script.content,
              loader: "ts",
              resolveDir: dirname(path),
            };
          });
        },
      },
    ],
  });
  const actual = await import(
    `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`
  );
  const { useFormSubmission, useFormPreview, submissionFields } = actual;
  const NativeFormData = globalThis.FormData;

  const contact = {
    fullName: " Asha Rao ",
    phone: "+91 (98765) 43210",
    email: " ASHA@Example.COM ",
  };
  const fixtures = {
    mba_mentor: {
      ...contact,
      program: "mba",
      message: " Admission questions & plans. ",
    },
    mba_predictor: {
      ...contact,
      currentCity: " Pune ",
      preferredSpecialization: "other",
      otherSpecialization: " Healthcare ",
      preferredLocation: " Pune & Mumbai ",
      budgetLakhs: "0",
      exams: [
        { exam: "cat", score: "0", percentile: "100" },
        {
          exam: "other",
          otherExamName: " Institute's exam ",
          score: "-2.5",
          percentile: "",
        },
      ],
    },
    mba_application: {
      ...contact,
      currentCity: "Pune",
      graduationDegree: "B.Sc.",
      graduationYear: "2025",
      graduationScore: "8.2 CGPA",
      exam: "CAT",
      score: "0",
      percentile: "0",
      preferredColleges: "College A\nCollege B",
      preferredSpecialization: "Finance",
      feeRange: "10–15 lakhs",
      notes: "Please discuss options.",
    },
    mba_start: {
      ...contact,
      currentStage: "exploring-colleges",
      currentCity: "Pune",
      budgetLakhs: "0",
      preferredLocation: "Mumbai",
      collegeShortlist: "College A",
      entranceExams: "CAT",
      bestScore: "0",
      bestPercentile: "100",
      helpNeeded: "Shortlist advice",
    },
    mba_gdpi: {
      ...contact,
      currentCity: "Pune",
      appliedColleges: ["College A", "", "College B"],
      targetColleges: ["", "College C", ""],
    },
    engineering_enquiry: {
      ...contact,
      preferredBranch: "Computer science",
      message: "Admission advice",
    },
    study_abroad_profile: {
      name: contact.fullName,
      phone: contact.phone,
      email: contact.email,
      qualification: "B.Sc.",
      studyLevel: "other",
      otherStudyLevel: "Research diploma",
      destination: "france",
      course: "Data science",
      intake: "Autumn 2027",
      message: "Options & costs?",
    },
    study_abroad_mentor: { name: contact.fullName, phone: contact.phone },
  };

  function entries(fields) {
    const result = [];
    for (const [key, value] of Object.entries(fields)) {
      if (key === "exams") {
        value.forEach((exam, index) =>
          Object.entries(exam).forEach(([field, text]) =>
            result.push([`exams[${index}][${field}]`, String(text)]),
          ),
        );
      } else if (Array.isArray(value)) {
        value.forEach((text, index) =>
          result.push([`${key}[${index}]`, String(text)]),
        );
      } else result.push([key, String(value)]);
    }
    return result;
  }
  function dataFor(fields) {
    const data = new NativeFormData();
    for (const [name, value] of entries(fields)) data.append(name, value);
    return data;
  }
  function control(name, value, options = {}) {
    return {
      id: options.id ?? `test-${name}`,
      name,
      value,
      required: options.required ?? false,
      type: options.type ?? "text",
      customMessage: "",
      focused: false,
      nativeValid: true,
      get validity() {
        return { valid: this.nativeValid && !this.customMessage };
      },
      get validationMessage() {
        return this.customMessage || "Enter a valid value.";
      },
      setCustomValidity(message) {
        this.customMessage = message;
      },
      focus() {
        this.focused = true;
      },
    };
  }
  function formFor(fields) {
    return {
      controls: entries(fields).map(([name, value]) => control(name, value)),
      reported: 0,
      querySelectorAll() {
        return this.controls;
      },
      reportValidity() {
        this.reported++;
        return this.controls.every((item) => item.validity.valid);
      },
    };
  }
  function mocks(t, fetcher) {
    const previous = {
      FormData: globalThis.FormData,
      fetch: globalThis.fetch,
      useSeoMeta: globalThis.useSeoMeta,
    };
    globalThis.FormData = class extends NativeFormData {
      constructor(form) {
        super();
        if (form)
          for (const item of form.controls) this.append(item.name, item.value);
      }
    };
    globalThis.fetch = fetcher;
    globalThis.useSeoMeta = () => {};
    t.after(() => Object.assign(globalThis, previous));
  }
  function response(status, body) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const saved = {
    ok: true,
    submission: {
      id: "ab0150cf-f2d5-4a8b-9f9d-e62dd508d832",
      createdAt: "2026-10-24T10:00:00.000Z",
    },
  };
  function harness(form = "mba_mentor", fields = fixtures[form]) {
    const formElement = formFor(fields);
    const applied = [];
    return {
      formElement,
      applied,
      state: useFormSubmission(form, {
        formRef: ref(formElement),
        applyIssues: (issues) => applied.push(issues),
      }),
    };
  }
  function deferred() {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    return { promise, resolve: resolvePromise };
  }

  for (const [form, fields] of Object.entries(fixtures)) {
    await suite.test(
      `${form}: exact HTML fields produce the supported API payload`,
      async (t) => {
        const data = dataFor(fields);
        data.append("databaseModel", "secrets");
        data.append("submissionTrap", "");
        data.append("exams[0][id]", "client-row-id");
        assert.deepEqual(submissionFields(form, data), fields);
        let received;
        mocks(t, async (url, options) => {
          received = { url, options, payload: JSON.parse(options.body) };
          return response(201, saved);
        });
        const { state } = harness(form, fields);
        assert.equal(await state.submit(), true);
        assert.equal(received.url, "/api/submissions");
        assert.equal(received.options.method, "POST");
        assert.equal(
          received.options.headers["Content-Type"],
          "application/json",
        );
        assert.match(
          received.options.headers["Idempotency-Key"],
          /^[0-9a-f-]{36}$/,
        );
        assert.deepEqual(received.payload, { form, fields });
        assert.equal(state.pending.value, false);
        assert.equal(state.submissionError.value, "");
      },
    );
  }

  await suite.test(
    "empty optional fields remain supported and zero-valued results are sent",
    async (t) => {
      let payload;
      mocks(t, async (_url, options) => {
        payload = JSON.parse(options.body);
        return response(201, saved);
      });
      const { state } = harness("mba_application", {
        ...fixtures.mba_application,
        currentCity: "",
        notes: "",
        score: "0",
        percentile: "0",
      });
      assert.equal(await state.submit(), true);
      assert.equal(payload.fields.score, "0");
      assert.equal(payload.fields.percentile, "0");
      assert.equal(payload.fields.notes, "");
    },
  );

  await suite.test(
    "contract failures apply field issues and never request or report success",
    async (t) => {
      let requests = 0;
      mocks(t, async () => {
        requests++;
        return response(201, saved);
      });
      const { state, applied } = harness("mba_mentor", {
        ...fixtures.mba_mentor,
        phone: "letters",
      });
      assert.equal(await state.submit(), false);
      assert.equal(requests, 0);
      assert.ok(applied[0].some((issue) => issue.field === "phone"));
      assert.ok(state.submissionError.value);
    },
  );

  await suite.test(
    "pending submission blocks repeated calls until persistence is confirmed",
    async (t) => {
      const waiting = deferred();
      let requests = 0;
      mocks(t, async () => {
        requests++;
        return waiting.promise;
      });
      const { state } = harness();
      const first = state.submit();
      assert.equal(state.pending.value, true);
      assert.equal(await state.submit(), false);
      assert.equal(requests, 1);
      waiting.resolve(response(201, saved));
      assert.equal(await first, true);
      assert.equal(state.pending.value, false);
    },
  );

  await suite.test(
    "network failures retain input and request identity; changed input gets a new key",
    async (t) => {
      const keys = [];
      mocks(t, async (_url, options) => {
        keys.push(options.headers["Idempotency-Key"]);
        throw new Error("sensitive transport internals");
      });
      const { state, formElement } = harness();
      const original = formElement.controls.map((item) => item.value);
      assert.equal(await state.submit(), false);
      assert.equal(await state.submit(), false);
      assert.equal(keys[0], keys[1]);
      assert.deepEqual(
        formElement.controls.map((item) => item.value),
        original,
      );
      assert.doesNotMatch(state.submissionError.value, /sensitive/);
      formElement.controls.find((item) => item.name === "message").value =
        "Changed enquiry";
      assert.equal(await state.submit(), false);
      assert.notEqual(keys[1], keys[2]);
    },
  );

  await suite.test(
    "503 retries reuse the same key and successful repeat enquiries get fresh keys",
    async (t) => {
      const keys = [];
      let requests = 0;
      mocks(t, async (_url, options) => {
        keys.push(options.headers["Idempotency-Key"]);
        return ++requests === 1
          ? response(503, {
              ok: false,
              error: {
                code: "DATABASE_UNAVAILABLE",
                message: "internal database URL",
              },
            })
          : response(201, saved);
      });
      const { state } = harness();
      assert.equal(await state.submit(), false);
      assert.match(state.submissionError.value, /could not save/);
      assert.doesNotMatch(state.submissionError.value, /database URL/);
      assert.equal(await state.submit(), true);
      assert.equal(keys[0], keys[1]);
      assert.equal(await state.submit(), true);
      assert.notEqual(keys[1], keys[2]);
    },
  );

  await suite.test(
    "server validation issues are applied and concurrent request overload has clear retry feedback",
    async (t) => {
      const issues = [
        { field: "phone", message: "Enter a valid phone number." },
      ];
      let requests = 0;
      mocks(t, async () =>
        ++requests === 1
          ? response(422, {
              ok: false,
              error: {
                code: "VALIDATION_FAILED",
                message: "Check inputs",
                issues,
              },
            })
          : response(429, {
              ok: false,
              error: { code: "TOO_MANY_REQUESTS", message: "ignored" },
            }),
      );
      const { state, applied } = harness();
      assert.equal(await state.submit(), false);
      assert.deepEqual(applied, [issues]);
      assert.deepEqual(state.submissionIssues.value, issues);
      assert.equal(await state.submit(), false);
      const overloadMessage =
        "We're handling several enquiries right now. Please try again in a moment.";
      assert.equal(state.submissionError.value, overloadMessage);
      // An unrecognized error code must still use the HTTP 429 fallback.
      globalThis.fetch = async () =>
        response(429, { ok: false, error: { code: "UNKNOWN_ERROR" } });
      assert.equal(await state.submit(), false);
      assert.equal(state.submissionError.value, overloadMessage);
    },
  );

  await suite.test(
    "an explicit idempotency conflict allows a fresh request key",
    async (t) => {
      const keys = [];
      mocks(t, async (_url, options) => {
        keys.push(options.headers["Idempotency-Key"]);
        return keys.length === 1
          ? response(409, {
              ok: false,
              error: { code: "IDEMPOTENCY_CONFLICT", message: "Conflict" },
            })
          : response(201, saved);
      });
      const { state } = harness();
      assert.equal(await state.submit(), false);
      assert.equal(await state.submit(), true);
      assert.notEqual(keys[0], keys[1]);
    },
  );

  await suite.test(
    "malformed or unconfirmed success responses cannot report success",
    async (t) => {
      const candidates = [
        response(200, { ok: true }),
        response(200, {
          ok: true,
          submission: { id: "x", createdAt: "invalid" },
        }),
        response(500, saved),
        new Response("not JSON", { status: 200 }),
        response(200, {
          ok: false,
          error: { code: "INTERNAL_ERROR", message: "private stack trace" },
        }),
      ];
      mocks(t, async () => candidates.shift());
      const { state } = harness();
      for (let index = 0; index < 5; index++) {
        assert.equal(await state.submit(), false);
        assert.equal(state.pending.value, false);
        assert.ok(state.submissionError.value);
        assert.doesNotMatch(state.submissionError.value, /private stack/);
      }
    },
  );

  await suite.test(
    "honeypot data travels only in its dedicated header",
    async (t) => {
      let received;
      mocks(t, async (_url, options) => {
        received = options;
        return response(400, {
          ok: false,
          error: { code: "INVALID_SUBMISSION", message: "Rejected" },
        });
      });
      const { state, formElement } = harness();
      formElement.controls.push(control("submissionTrap", "automated value"));
      assert.equal(await state.submit(), false);
      assert.equal(received.headers["X-Submission-Trap"], "automated value");
      assert.equal(
        Object.hasOwn(JSON.parse(received.body).fields, "submissionTrap"),
        false,
      );
    },
  );

  await suite.test(
    "native validation focuses invalid controls and maps repeated server issue paths",
    () => {
      const validation = useFormPreview();
      const form = formFor({ fullName: "   ", phone: "9876543210" });
      form.controls[0].required = true;
      validation.formRef.value = form;
      assert.equal(validation.validate(), false);
      assert.equal(form.controls[0].focused, true);
      assert.equal(form.reported, 1);
      assert.ok(validation.errors.value[form.controls[0].id]);
      form.controls[0].value = "Asha";
      assert.equal(validation.validate(), true);
      const exam = control("exams[1][percentile]", "101", {
        id: "exam-percentile-42",
      });
      form.controls.push(exam);
      validation.applyIssues([
        {
          field: "exams[1].percentile",
          message: "Enter a value between 0 and 100.",
        },
      ]);
      assert.equal(exam.focused, true);
      assert.equal(
        validation.errors.value[exam.id],
        "Enter a value between 0 and 100.",
      );
    },
  );

  for (const [form] of routes) {
    await suite.test(
      `${form}: actual page handler keeps the dialog closed through failure and opens only after confirmed success`,
      async (t) => {
        let requests = 0;
        mocks(t, async () =>
          ++requests === 1
            ? response(503, {
                ok: false,
                error: { code: "DATABASE_UNAVAILABLE", message: "Unavailable" },
              })
            : response(201, saved),
        );
        const page = actual[form].setup({}, { expose() {} });
        const study = form === "study_abroad_profile";
        const element = formFor(fixtures[form]);
        (study ? page.profileForm : page.formRef).value = element;
        if (form === "mba_predictor")
          page.exams.value = fixtures.mba_predictor.exams.map(
            (entry, index) => ({ ...entry, id: index + 1 }),
          );
        if (form === "mba_application") {
          page.entranceExam.value = "CAT";
          page.score.value = 0;
        }
        if (form === "mba_start") {
          page.entranceExams.value = "CAT";
          page.bestScore.value = 0;
        }
        const submit = study ? page.submitProfileForm : page.submitForm;
        const dialog = study ? page.profileDialogOpen : page.successDialogOpen;
        element.controls[0].nativeValid = false;
        await submit();
        assert.equal(requests, 0);
        assert.equal(dialog.value, false);
        element.controls[0].nativeValid = true;
        await submit();
        assert.equal(requests, 1);
        assert.equal(dialog.value, false);
        assert.equal(
          element.controls[0].value,
          fixtures[form].fullName ?? fixtures[form].name,
        );
        await submit();
        assert.equal(requests, 2);
        assert.equal(dialog.value, true);
      },
    );
  }

  await suite.test(
    "Study Abroad mentor uses its independent real page submit handler",
    async (t) => {
      const waiting = deferred();
      mocks(t, async () => waiting.promise);
      const page = actual.study_abroad_profile.setup({}, { expose() {} });
      page.mentorForm.value = formFor(fixtures.study_abroad_mentor);
      const submitting = page.submitMentorForm();
      assert.equal(page.mentorPending.value, true);
      assert.equal(page.mentorDialogOpen.value, false);
      waiting.resolve(response(201, saved));
      await submitting;
      assert.equal(page.mentorDialogOpen.value, true);
      assert.equal(page.profileDialogOpen.value, false);
    },
  );
});

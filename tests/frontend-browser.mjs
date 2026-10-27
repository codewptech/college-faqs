/** Opt-in actual-browser verification; install playwright-core in a temporary tools directory. */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright-core"
);
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3407";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
let assertions = 0;
function check(value, message) {
  assert.ok(value, message);
  assertions++;
}
const routes = [
  ["mba_mentor", "/programs/mba/talk-to-mentor", 0],
  ["mba_predictor", "/programs/mba/college-predictor", 0],
  ["mba_application", "/programs/mba/application-form", 0],
  ["mba_start", "/programs/mba/start-your-application", 0],
  ["mba_gdpi", "/programs/mba/gdpi-preparation", 0],
  ["engineering_enquiry", "/programs/engineering", 0],
  ["study_abroad_profile", "/programs/study-abroad", 0],
  ["study_abroad_mentor", "/programs/study-abroad", 1],
];
try {
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  for (const [formId, path, index] of routes) {
    await page.goto(`${base}${path}?verification=${randomUUID()}`);
    await page.waitForFunction(
      () => !!document.querySelector("#__nuxt")?.__vue_app__,
    );
    const form = page.locator("form").nth(index);
    const button = form.locator('button[type="submit"]');
    let calls = [];
    let mode = "failure";
    let finish;
    await page.route("**/api/submissions", async (route) => {
      calls.push({
        fields: route.request().postDataJSON(),
        key: route.request().headers()["idempotency-key"],
      });
      if (mode === "network") return route.abort("failed");
      if (mode === "pending")
        await new Promise((resolve) => {
          finish = resolve;
        });
      if (mode === "failure")
        return route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            ok: false,
            error: { code: "DATABASE_UNAVAILABLE", message: "Unavailable" },
          }),
        });
      if (mode === "validation")
        return route.fulfill({
          status: 422,
          contentType: "application/json",
          body: JSON.stringify({
            ok: false,
            error: {
              code: "VALIDATION_FAILED",
              message: "Check",
              issues: [
                { field: "phone", message: "Enter a valid phone number." },
              ],
            },
          }),
        });
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          submission: { id: randomUUID(), createdAt: new Date().toISOString() },
        }),
      });
    });
    await button.click();
    check(
      calls.length === 0,
      `${formId}: blank native validation prevents request`,
    );
    check(
      (await page.locator("dialog[open]").count()) === 0,
      `${formId}: invalid never opens success`,
    );
    await form
      .locator('[name="fullName"], [name="name"]')
      .fill("Browser Student");
    await form.locator('[name="phone"]').fill("invalid-phone");
    const email = form.locator('[name="email"]');
    if (await email.count()) await email.fill("Student@EXAMPLE.COM");
    if (formId === "study_abroad_profile")
      await form.locator('[name="qualification"]').fill("B.Com");
    if (formId === "mba_predictor") {
      await form.locator('[name="exams[0][exam]"]').selectOption("cat");
      await form.locator('[name="exams[0][score]"]').fill("0");
      await form.getByRole("button", { name: /add.*exam/i }).click();
      await form.locator('[name="exams[1][exam]"]').selectOption("other");
      await form.locator('[name="exams[1][otherExamName]"]').fill("State Exam");
      await form.locator('[name="exams[1][percentile]"]').fill("100");
      await form
        .locator('[name="preferredSpecialization"]')
        .selectOption("other");
      await form.locator('[name="otherSpecialization"]').fill("Strategy");
    }
    if (formId === "mba_gdpi") {
      await form.locator('[name="appliedColleges[0]"]').fill("College A");
      await form.locator('[name="appliedColleges[2]"]').fill("College C");
    }
    await button.click();
    check(
      calls.length === 0,
      `${formId}: contract validates phone before request`,
    );
    check(
      await form
        .locator('[name="phone"]')
        .evaluate((el) => document.activeElement === el),
      `${formId}: invalid phone focused`,
    );
    await form.locator('[name="phone"]').fill("+91 98765 43210");
    await button.click();
    await form.getByRole("alert").first().waitFor();
    check(
      calls.length === 1 && calls[0].fields.form === formId,
      `${formId}: correct API contract`,
    );
    check(
      (await page.locator("dialog[open]").count()) === 0,
      `${formId}: DB failure never opens success`,
    );
    check(
      (await form.locator('[name="phone"]').inputValue()) === "+91 98765 43210",
      `${formId}: input retained on failure`,
    );
    mode = "network";
    await button.click();
    await page.waitForFunction(() =>
      [...document.querySelectorAll('[role="alert"]')].some((el) =>
        el.textContent.includes("connection"),
      ),
    );
    check(
      calls[1].key === calls[0].key,
      `${formId}: failed retry preserves key`,
    );
    check(
      (await page.locator("dialog[open]").count()) === 0,
      `${formId}: network failure never opens success`,
    );
    mode = "validation";
    await button.click();
    await page.waitForFunction(
      () => document.activeElement?.getAttribute("name") === "phone",
    );
    check(
      (await form.locator('[name="phone"]').getAttribute("aria-invalid")) ===
        "true",
      `${formId}: server issue attached`,
    );
    await form.locator('[name="phone"]').fill("+91 98765 43210");
    mode = "pending";
    await button.click();
    await page.waitForFunction(() =>
      document.querySelector('form[aria-busy="true"]'),
    );
    check(await button.isDisabled(), `${formId}: pending disables submit`);
    const before = calls.length;
    await form.evaluate((el) =>
      el.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      ),
    );
    check(
      calls.length === before,
      `${formId}: pending prevents duplicate event`,
    );
    check(
      (await page.locator("dialog[open]").count()) === 0,
      `${formId}: waits for persistence response`,
    );
    mode = "success";
    finish();
    await page.locator("dialog[open]").waitFor();
    check(
      await page
        .locator("dialog[open]")
        .textContent()
        .then((s) => /saved/i.test(s)),
      `${formId}: confirmed saved message`,
    );
    check(!(await button.isDisabled()), `${formId}: pending released`);
    if (formId === "mba_predictor") {
      const fields = calls.at(-1).fields.fields;
      check(
        fields.exams.length === 2 &&
          fields.exams[0].score === "0" &&
          fields.exams[1].otherExamName === "State Exam",
        "predictor: structured exam payload",
      );
      check(!Object.hasOwn(fields.exams[0], "id"), "predictor: UI ID excluded");
    }
    if (formId === "mba_gdpi")
      check(
        Array.isArray(calls.at(-1).fields.fields.appliedColleges),
        "GDPI: array payload",
      );
    if (formId.startsWith("study_abroad"))
      check(
        Object.hasOwn(calls.at(-1).fields.fields, "name"),
        `${formId}: original name contract`,
      );
    await page
      .locator("dialog[open]")
      .getByRole("button", { name: "Done", exact: true })
      .click();
    await button.click();
    await page.locator("dialog[open]").waitFor();
    check(
      calls.at(-1).key !== calls.at(-2).key,
      `${formId}: later enquiry gets new key`,
    );
    await page.unroute("**/api/submissions");
  }
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [, path] of routes) {
      await page.goto(`${base}${path}?layout=${randomUUID()}`);
      check(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${path}: no overflow at ${width}px`,
      );
    }
  }
  check(pageErrors.length === 0, `no browser errors: ${pageErrors.join("; ")}`);
  // Actual built API with no DATABASE_URL: safe failure, no false success.
  const response = await page.request.post(`${base}/api/submissions`, {
    headers: { "Idempotency-Key": randomUUID(), Origin: base },
    data: {
      form: "mba_start",
      fields: { fullName: "Browser Student", phone: "9876543210" },
    },
  });
  check(response.status() === 503, "built API: no DB returns503");
  check(
    (await response.json()).error.code === "DATABASE_UNAVAILABLE",
    "built API: safe unconfigured DB code",
  );
  console.log(
    JSON.stringify({
      passed: assertions,
      failed: 0,
      forms: routes.length,
      viewports: [390, 1280],
    }),
  );
} finally {
  await browser.close();
}

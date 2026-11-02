import assert from "node:assert/strict";
import { test } from "node:test";
import { context } from "./helpers/context.mjs";
import { openBrowserTab } from "./helpers/cdp.mjs";
import { forms } from "./fixtures.mjs";

const formAt = (fixture = forms[0]) => {
  if (fixture.form.startsWith("study_abroad_")) {
    const profile = fixture.form === "study_abroad_profile";
    return `[...document.forms].find(f=>f.elements.namedItem('phone') && !!f.elements.namedItem('qualification')===${profile})`;
  }
  return "document.querySelector('form')";
};
async function browser(t, width = 390) {
  const tab = await openBrowserTab(context.cdp);
  await tab.send("Network.enable");
  await tab.send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  t.after(async () => {
    await tab.close();
    for (const warning of new Set(
      tab.warnings.map((value) => value.split("\n")[0]),
    ))
      t.diagnostic(warning);
    assert.deepEqual(
      tab.errors,
      [],
      "No uncaught application errors; critical hydration is also covered by the actual user flows",
    );
  });
  return tab;
}
async function visit(tab, fixture) {
  await tab.navigate(context.origin + fixture.route);
  await tab.waitFor(
    `${formAt(fixture)}?.querySelector('input')?.matches(':enabled')`,
  );
  assert.equal(
    await tab.evaluate(`(async()=>{
    const server=new DOMParser().parseFromString(await fetch(location.href).then(r=>r.text()),'text/html');
    return server.querySelector('h1').textContent===document.querySelector('h1').textContent;
  })()`),
    true,
    "Hydration preserves the server-rendered page heading",
  );
}
async function fill(tab, fixture, extra = {}) {
  const fields = {
    fullName: "SYNTHETIC Browser",
    name: "SYNTHETIC Browser",
    phone: "9999999999",
    email: "browser@example.invalid",
    ...fixture.controls,
    ...extra,
  };
  await tab.evaluate(`(() => { const f=${formAt(fixture)};
    for(const [name,value] of Object.entries(${JSON.stringify(fields)})) {
      const e=f.elements.namedItem(name); if(!e) continue;
      e.value=value; e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true}));
    }
  })()`);
}
async function click(tab, selector) {
  const position = await tab.evaluate(
    `(() => { const e=${selector}; e.scrollIntoView({block:'center',behavior:'instant'}); const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}; })()`,
  );
  await tab.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    ...position,
    button: "left",
    clickCount: 1,
  });
  await tab.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    ...position,
    button: "left",
    clickCount: 1,
  });
}
const submit = (tab, fixture) =>
  click(tab, `${formAt(fixture)}.querySelector('[type=submit]')`);
const key = async (tab, value) => {
  const code = value === "Escape" ? 27 : value === "Tab" ? 9 : 13;
  await tab.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: value,
    windowsVirtualKeyCode: code,
    ...(value === "Enter" ? { text: "\r" } : {}),
  });
  await tab.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: value,
    windowsVirtualKeyCode: code,
  });
};
const dialog =
  "document.querySelector('dialog[open],[role=dialog][aria-modal=true]')";

test(
  "all eight forms have accessible controls and confirm real persisted submissions",
  { timeout: 120_000 },
  async (t) => {
    const tab = await browser(t);
    const posts = [];
    tab.on("Network.responseReceived", ({ response }) => {
      if (response.url === `${context.origin}/api/submissions`)
        posts.push(response.status);
    });
    for (const fixture of forms) {
      await visit(tab, fixture);
      const unnamed = await tab.evaluate(
        `[...${formAt(fixture)}.elements].filter(e=>e.matches('input:not([type=hidden]),select,textarea')&&e.tabIndex>=0&&e.getBoundingClientRect().width>0).filter(e=>![...e.labels||[]].some(l=>l.textContent.trim())&&!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')).map(e=>e.name)`,
      );
      assert.deepEqual(
        unnamed,
        [],
        `${fixture.form}: controls need accessible names`,
      );
      await fill(tab, fixture);
      await submit(tab, fixture);
      await tab.waitFor(
        `${dialog} && /saved|success/i.test(${dialog}.textContent)`,
      );
      const tree = await tab.send("Accessibility.getFullAXTree");
      assert.ok(
        tree.nodes.some(
          (node) => node.role?.value === "dialog" && node.name?.value,
        ),
        "Confirmation has an accessible name",
      );
      await key(tab, "Escape");
      await tab.waitFor(`!${dialog}`);
    }
    assert.deepEqual(
      posts,
      Array(8).fill(201),
      "Every confirmation follows a real HTTP success",
    );
  },
);

test(
  "without JavaScript, native interactions cannot expose contact details in GET URLs",
  { timeout: 90_000 },
  async (t) => {
    const tab = await browser(t);
    const requests = [];
    tab.on("Network.requestWillBeSent", ({ request }) =>
      requests.push(request),
    );
    await tab.send("Emulation.setScriptExecutionDisabled", { value: true });
    for (const fixture of forms) {
      await tab.navigate(context.origin + fixture.route);
      await fill(tab, fixture, {
        fullName: "SYNTHETIC_PRIVACY_MARKER",
        name: "SYNTHETIC_PRIVACY_MARKER",
      });
      const data = await tab.evaluate(
        `JSON.stringify([...new FormData(${formAt(fixture)})])`,
      );
      assert.ok(!data.includes("SYNTHETIC_PRIVACY_MARKER"));
      await submit(tab, fixture);
      await key(tab, "Enter");
      assert.equal(await tab.evaluate("location.search"), "");
      // Even a forced native submission must not serialize personal data via GET.
      await tab.evaluate(`${formAt(fixture)}.requestSubmit()`);
      await tab.waitFor(
        "location.pathname==='/api/submissions'&&document.readyState==='complete'",
      );
    }
    assert.ok(
      requests.every(
        (request) => !request.url.includes("SYNTHETIC_PRIVACY_MARKER"),
      ),
    );
    const native = requests.filter(
      (request) => request.url === `${context.origin}/api/submissions`,
    );
    assert.equal(native.length, 8);
    assert.ok(
      native.every(
        (request) =>
          request.method === "POST" &&
          !request.postData?.includes("SYNTHETIC_PRIVACY_MARKER"),
      ),
    );
  },
);

test(
  "validation focuses errors; a pending or failed submission keeps data and retries with the same key",
  { timeout: 60_000 },
  async (t) => {
    const tab = await browser(t, 1280);
    const fixture = forms[0];
    await visit(tab, fixture);
    await submit(tab);
    assert.equal(
      await tab.evaluate("document.activeElement.matches(':invalid')"),
      true,
    );
    assert.equal(await tab.evaluate(`!!${dialog}`), false);
    await fill(tab, fixture);
    const held = [];
    let intercept = true;
    tab.on("Fetch.requestPaused", async (event) => {
      if (intercept) held.push(event);
      else
        await tab.send("Fetch.continueRequest", { requestId: event.requestId });
    });
    await tab.send("Fetch.enable", {
      patterns: [
        {
          urlPattern: `${context.origin}/api/submissions`,
          requestStage: "Request",
        },
      ],
    });
    await submit(tab);
    for (let i = 0; !held.length && i < 100; i++)
      await new Promise((resolve) => setTimeout(resolve, 25));
    assert.equal(held.length, 1);
    assert.equal(
      await tab.evaluate(
        `${formAt()}.querySelector('[type=submit]').matches(':disabled')`,
      ),
      true,
    );
    await tab.evaluate(`${formAt()}.requestSubmit()`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    assert.equal(held.length, 1, "Pending submission does not send duplicates");
    await tab.send("Fetch.fulfillRequest", {
      requestId: held[0].requestId,
      responseCode: 503,
      responseHeaders: [{ name: "Content-Type", value: "application/json" }],
      body: Buffer.from(
        JSON.stringify({ ok: false, error: { code: "DATABASE_UNAVAILABLE" } }),
      ).toString("base64"),
    });
    await tab.waitFor(
      `${formAt()}.querySelector('[role=alert]')?.textContent.trim() && !${formAt()}.querySelector('[type=submit]').disabled`,
    );
    assert.equal(
      await tab.evaluate(`${formAt()}.elements.fullName.value`),
      "SYNTHETIC Browser",
    );
    assert.equal(await tab.evaluate(`!!${dialog}`), false);
    await submit(tab);
    for (let i = 0; held.length < 2 && i < 100; i++)
      await new Promise((resolve) => setTimeout(resolve, 25));
    assert.equal(held.length, 2);
    const header = (request) =>
      Object.entries(request.headers).find(
        ([name]) => name.toLowerCase() === "idempotency-key",
      )?.[1];
    assert.ok(header(held[0].request));
    assert.equal(header(held[0].request), header(held[1].request));
    intercept = false;
    await tab.send("Fetch.continueRequest", { requestId: held[1].requestId });
    await tab.waitFor(`!!${dialog}`);
    await key(tab, "Escape");
    await tab.waitFor(`!${dialog}`);
    await tab.waitFor(
      `document.activeElement===${formAt()}.querySelector('[type=submit]')`,
    );
    assert.equal(
      await tab.evaluate(
        `document.activeElement===${formAt()}.querySelector('[type=submit]')`,
      ),
      true,
      "Closing the confirmation returns focus to its submitting control",
    );
    await fill(tab, fixture);
    intercept = true;
    await submit(tab);
    for (let i = 0; held.length < 3 && i < 100; i++)
      await new Promise((resolve) => setTimeout(resolve, 25));
    assert.equal(held.length, 3);
    // Moving elsewhere while waiting must invalidate the old focus fallback.
    await tab.evaluate(
      "(() => {const link=document.querySelector('header a[href]');link.focus();link.blur();})()",
    );
    intercept = false;
    await tab.send("Fetch.continueRequest", { requestId: held[2].requestId });
    await tab.waitFor(`!!${dialog}`);
    await tab.evaluate(
      `(() => {globalThis.confirmationClosed=false;${dialog}.addEventListener('close',()=>{globalThis.confirmationClosed=true;},{once:true});})()`,
    );
    await key(tab, "Escape");
    await tab.waitFor("globalThis.confirmationClosed");
    assert.equal(await tab.evaluate("document.activeElement.tagName"), "BODY");
  },
);

test("concurrent enquiries retain keyboard focus through every confirmation", async (t) => {
  const tab = await browser(t, 1280);
  const enquiries = forms.filter((fixture) =>
    fixture.form.startsWith("study_abroad_"),
  );
  await visit(tab, enquiries[0]);
  const held = [];
  let saved = 0;
  tab.on("Fetch.requestPaused", (event) => held.push(event));
  tab.on("Network.responseReceived", ({ response }) => {
    if (
      response.url === `${context.origin}/api/submissions` &&
      response.status === 201
    )
      saved++;
  });
  await tab.send("Fetch.enable", {
    patterns: [
      {
        urlPattern: `${context.origin}/api/submissions`,
        requestStage: "Request",
      },
    ],
  });
  for (const fixture of enquiries) {
    await fill(tab, fixture);
    await tab.evaluate(
      `${formAt(fixture)}.querySelector('[type=submit]').focus()`,
    );
    await key(tab, "Enter");
  }
  for (let i = 0; held.length < 2 && i < 100; i++)
    await new Promise((resolve) => setTimeout(resolve, 25));
  assert.equal(held.length, 2);
  // Release in submission order so each real response has its own confirmation.
  for (const [index, request] of held.entries()) {
    await tab.send("Fetch.continueRequest", { requestId: request.requestId });
    for (let i = 0; saved <= index && i < 100; i++)
      await new Promise((resolve) => setTimeout(resolve, 25));
    assert.equal(saved, index + 1);
  }
  await tab.waitFor(`!!${dialog}`);
  const first = await tab.evaluate(`${dialog}.textContent`);
  await key(tab, "Escape");
  await tab.waitFor(
    `${dialog} && ${dialog}.textContent!==${JSON.stringify(first)}`,
  );
  assert.equal(
    await tab.evaluate(`${dialog}.contains(document.activeElement)`),
    true,
  );
  await key(tab, "Tab");
  assert.equal(
    await tab.evaluate(`${dialog}.contains(document.activeElement)`),
    true,
  );
  await key(tab, "Escape");
  await tab.waitFor(`!${dialog}`);
  await tab.waitFor(
    `document.activeElement===${formAt(enquiries[1])}.querySelector('[type=submit]')`,
  );
  assert.equal(
    await tab.evaluate(
      `document.activeElement===${formAt(enquiries[1])}.querySelector('[type=submit]')`,
    ),
    true,
  );
});

test("score/percentile and Other selections produce actionable validation", async (t) => {
  const tab = await browser(t);
  const fixture = forms[1];
  await visit(tab, fixture);
  await fill(tab, fixture, {
    "exams[0][exam]": "other",
    "exams[0][score]": "0",
  });
  await submit(tab);
  assert.equal(
    await tab.evaluate("document.activeElement.name"),
    "exams[0][otherExamName]",
  );
  await fill(tab, fixture, {
    "exams[0][exam]": "other",
    "exams[0][otherExamName]": "Synthetic Exam",
    "exams[0][percentile]": "101",
  });
  await submit(tab);
  assert.equal(
    await tab.evaluate("document.activeElement.name"),
    "exams[0][percentile]",
  );
  await fill(tab, fixture, {
    "exams[0][exam]": "other",
    "exams[0][otherExamName]": "Synthetic Exam",
    "exams[0][percentile]": "0",
  });
  await submit(tab);
  await tab.waitFor(`!!${dialog}`);
});

test("mobile navigation works with the keyboard, Escape restores focus, and browser history works", async (t) => {
  const tab = await browser(t);
  await tab.navigate(context.origin + "/");
  const trigger =
    "[...document.querySelectorAll('header button[aria-expanded][aria-controls]')].find(e=>e.getBoundingClientRect().width>0)";
  await tab.evaluate(`(${trigger}).focus()`);
  await key(tab, "Enter");
  await tab.waitFor(`(${trigger}).getAttribute('aria-expanded')==='true'`);
  await key(tab, "Escape");
  await tab.waitFor(`(${trigger}).getAttribute('aria-expanded')==='false'`);
  assert.equal(
    await tab.evaluate(`document.activeElement===(${trigger})`),
    true,
  );
  await key(tab, "Enter");
  await tab.waitFor(`(${trigger}).getAttribute('aria-expanded')==='true'`);
  await tab.evaluate(
    "[...document.querySelectorAll('a[href=\"/about\"]')].find(e=>e.getBoundingClientRect().width>0).focus()",
  );
  await key(tab, "Enter");
  await tab.waitFor(
    "location.pathname==='/about' && !!document.querySelector('h1')",
  );
  await tab.evaluate("history.back()");
  await tab.waitFor("location.pathname==='/'");
  await tab.evaluate("history.forward()");
  await tab.waitFor("location.pathname==='/about'");
});

test("article anchors and FAQ disclosures are usable with the keyboard", async (t) => {
  const tab = await browser(t, 1280);
  await tab.navigate(context.origin + "/explore/education-loan");
  const anchor =
    "[...document.querySelectorAll('main a[href^=\"#\"]')].find(e=>document.getElementById(e.hash.slice(1)))";
  const hash = await tab.evaluate(
    `(() => {const e=${anchor};if(!e)throw Error('No article anchor');const d=e.closest('details');if(d)d.open=true;e.focus();return e.hash;})()`,
  );
  await key(tab, "Enter");
  await tab.waitFor(`location.hash===${JSON.stringify(hash)}`);
  await tab.waitFor(
    `(() => {const r=document.getElementById(${JSON.stringify(hash.slice(1))}).getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;})()`,
  );
  await tab.navigate(context.origin + "/explore/faqs");
  const disclosure =
    "[...document.querySelectorAll('main details summary')].find(e=>e.getBoundingClientRect().width>0)";
  const wasOpen = await tab.evaluate(
    `(() => {const e=${disclosure};e.focus();return e.closest('details').open;})()`,
  );
  await key(tab, "Enter");
  await tab.waitFor(`(${disclosure}).closest('details').open!==${wasOpen}`);
});

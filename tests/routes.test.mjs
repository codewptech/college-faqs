import assert from "node:assert/strict";
import { test } from "node:test";
import { context } from "./helpers/context.mjs";
import { routes } from "./fixtures.mjs";

test("all public routes server-render usable content and navigation without JavaScript", async () => {
  for (const path of routes) {
    const response = await fetch(context.origin + path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type"), /text\/html/);
    const html = await response.text();
    assert.match(html, /<h1\b[^>]*>[^]*?\S[^]*?<\/h1>/i, path);
    assert.match(html, /<main\b[^>]*>[^]*?\S[^]*?<\/main>/i, path);
    assert.match(html, /<title>[^<]+<\/title>/i, path);
    assert.match(html, /<a\b[^>]*href="\//i, path);
  }
});

test("an unknown nested route returns an actual 404 and safe HTML", async () => {
  const response = await fetch(
    `${context.origin}/programs/unknown/not-a-route`,
    { headers: { accept: "text/html" } },
  );
  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.doesNotMatch(await response.text(), /DATABASE_URL|postgresql:\/\//);
});

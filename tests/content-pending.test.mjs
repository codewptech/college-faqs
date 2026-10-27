/** Render the actual Vue templates with in-memory fixtures; public data stays empty. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { after, test } from "node:test";
import { build } from "esbuild";
import { compileScript, parse } from "@vue/compiler-sfc";
import { createSSRApp, defineComponent, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import {
  hasCountryGuideContent,
  hasCtaContent,
  hasLegalPageContent,
  hasSectionContent,
} from "../app/data/content/helpers.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const routes = [
  ["about", "about", "aboutContent", "About"],
  [
    "explore/admission-guide",
    "explore/admissionGuide",
    "admissionGuideContent",
    "Admission Guide",
  ],
  [
    "explore/education-loan",
    "explore/educationLoan",
    "educationLoanContent",
    "Education Loan",
  ],
  ["explore/faqs", "explore/faqs", "faqContent", "FAQs"],
  ["privacy-policy", "legal/privacy", "privacyContent", "Privacy Policy"],
  ["terms-and-conditions", "legal/terms", "termsContent", "Terms & Conditions"],
  ...[
    ["usa", "United States"],
    ["uk", "United Kingdom"],
    ["canada", "Canada"],
    ["australia", "Australia"],
    ["france", "France"],
    ["germany", "Germany"],
    ["malaysia", "Malaysia"],
    ["uae", "United Arab Emirates"],
    ["georgia", "Georgia"],
  ].map(([slug, country]) => [
    `programs/study-abroad/${slug}`,
    `studyAbroad/${slug}`,
    `${slug}Guide`,
    `${country} Study Guide`,
  ]),
];

// Nuxt normally supplies the alias and Vue auto-imports. This small test adapter
// supplies only those compile-time conveniences, using existing dependencies.
const compiled = await build({
  stdin: {
    contents: [
      ...routes.flatMap(([route, data, name], index) => [
        `import page${index} from "./app/pages/${route}.vue";`,
        `import { ${name} as data${index} } from "./app/data/content/${data}";`,
      ]),
      `export const pages = [${routes.map((_, index) => `{ component: page${index}, content: data${index} }`).join(",")}];`,
      'export { default as EmptyState } from "./app/components/ui/EmptyState.vue";',
      'export { default as Coupons } from "./app/pages/programs/mba/coupons.vue";',
      'export { default as Updates } from "./app/pages/programs/mba/college-updates.vue";',
      'export { default as StudyAbroad } from "./app/pages/programs/study-abroad/index.vue";',
      'export { studyAbroadContent } from "./app/data/content/studyAbroad";',
    ].join("\n"),
    resolveDir: root,
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
  plugins: [
    {
      name: "vue-ssr-test",
      setup(builder) {
        builder.onResolve(
          { filter: /^vue(?:\/server-renderer)?$/ },
          ({ path }) => ({
            path: import.meta.resolve(path),
            external: true,
          }),
        );
        builder.onResolve({ filter: /^~~\// }, ({ path }) =>
          builder.resolve(resolve(root, path.slice(3)), {
            resolveDir: root,
            kind: "import-statement",
          }),
        );
        builder.onLoad({ filter: /\.vue$/ }, async ({ path }) => {
          const source = await readFile(path, "utf8");
          const { descriptor } = parse(
            source.includes("<script")
              ? source
              : `<script setup>defineOptions({});</script>${source}`,
            { filename: path },
          );
          const script = compileScript(descriptor, {
            id: createHash("sha256").update(path).digest("hex").slice(0, 8),
            inlineTemplate: true,
            templateOptions: { ssr: true },
          });
          return {
            contents: `import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";\n${script.content}`,
            loader: "ts",
            resolveDir: dirname(path),
          };
        });
      },
    },
  ],
});
const { pages, EmptyState, Coupons, Updates, StudyAbroad, studyAbroadContent } =
  await import(
    `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`
  );

const NuxtLink = defineComponent({
  props: ["to"],
  setup:
    (props, { slots }) =>
    () =>
      h("a", { href: props.to }, slots.default?.()),
});
let metadata;
const previousSeo = globalThis.useSeoMeta;
globalThis.useSeoMeta = (value) => {
  metadata = value;
};
after(() => {
  if (previousSeo === undefined) delete globalThis.useSeoMeta;
  else globalThis.useSeoMeta = previousSeo;
});

async function render(component, props, slots) {
  metadata = undefined;
  const app = createSSRApp({ render: () => h(component, props, slots) });
  app.component("NuxtLink", NuxtLink);
  const html = await renderToString(app);
  return {
    html,
    robots:
      typeof metadata?.robots === "function"
        ? metadata.robots()
        : metadata?.robots,
  };
}

const paragraph = { type: "paragraph", text: "Test body content" };
const section = { title: "Test section", blocks: [paragraph] };
const emptySection = { title: "Test empty section", blocks: [] };

function assertIdentity(html, title) {
  const headings = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/g) ?? [];
  assert.equal(headings.length, 1);
  assert.ok(
    headings[0].includes(title.replaceAll("&", "&amp;")),
    `Missing page identity: ${title}`,
  );
}

function assertPending(html, title) {
  assertIdentity(html, title);
  assert.match(html, /class="content-pending"/);
  assert.match(html, /being prepared\./);
  assert.doesNotMatch(
    html,
    /<h2\b|class="empty-state"|role="(?:alert|status)"|aria-live=/,
  );
  assert.doesNotMatch(
    html,
    /Test body content|Test empty section|Last updated:/,
  );
}

for (const [index, [route, , , title]] of routes.entries()) {
  test(`/${route}: pending and published content replace each other automatically`, async () => {
    const { component, content } = pages[index];
    const original = structuredClone(content);
    const reset = () => Object.assign(content, structuredClone(original));
    try {
      let result = await render(component);
      assertPending(result.html, title);
      assert.equal(result.robots, "noindex, follow");

      // A ready flag, subtitle, date, and section headings cannot publish an empty body.
      content.ready = true;
      if ("subtitle" in content) content.subtitle = "Test subtitle";
      if ("lastUpdated" in content) content.lastUpdated = "Test date";
      if ("sections" in content) content.sections = [emptySection];
      if ("cta" in content)
        content.cta = { title: "Test CTA heading", links: [] };
      result = await render(component);
      assertPending(result.html, title);
      assert.equal(result.robots, "noindex, follow");

      reset();
      if (route === "explore/faqs") {
        content.items = [
          { question: "Test empty question", answer: [] },
          { question: "Test question", answer: [paragraph] },
        ];
      } else content.sections = [emptySection, section];

      // Publication control still hides substantive content until the owner opts in.
      result = await render(component);
      assertPending(result.html, title);
      assert.equal(result.robots, "noindex, follow");

      content.ready = true;
      result = await render(component);
      assertIdentity(result.html, title);
      assert.match(result.html, /Test body content/);
      assert.doesNotMatch(
        result.html,
        /content-pending|being prepared\.|Test empty section|Test empty question/,
      );
      assert.equal(result.robots, "index, follow");

      if (route.startsWith("programs/study-abroad/")) {
        assert.match(result.html, /href="\/programs\/study-abroad"/);
        assert.match(result.html, /Back to Study Abroad/);
      }
    } finally {
      reset();
    }
  });
}

test("Study Abroad keeps its forms and destination navigation while editorial content is pending", async () => {
  const original = structuredClone(studyAbroadContent);
  const assertStructure = (html) => {
    assertIdentity(html, "Study Abroad");
    assert.equal((html.match(/<form\b/g) ?? []).length, 2);
    assert.doesNotMatch(html, /class="empty-state"/);
    for (const [route] of routes.filter(([route]) =>
      route.startsWith("programs/study-abroad/"),
    )) {
      assert.ok(
        html.includes(`href="/${route}"`),
        `Missing destination link: ${route}`,
      );
    }
  };
  try {
    let result = await render(StudyAbroad);
    assertStructure(result.html);
    assert.equal(result.robots, "noindex, follow");

    studyAbroadContent.ready = true;
    studyAbroadContent.sections = [emptySection];
    result = await render(StudyAbroad);
    assertStructure(result.html);
    assert.doesNotMatch(result.html, /Test empty section/);
    assert.equal(result.robots, "noindex, follow");

    studyAbroadContent.sections = [emptySection, section];
    result = await render(StudyAbroad);
    assertStructure(result.html);
    assert.match(result.html, /Test body content/);
    assert.doesNotMatch(result.html, /Test empty section/);
    assert.equal(result.robots, "index, follow");
  } finally {
    Object.assign(studyAbroadContent, original);
  }
});

test("default record empty states retain their headings, actions, and slot", async () => {
  const { html } = await render(
    EmptyState,
    { title: "Test records", message: "Test no records" },
    { default: () => h("a", { href: "/" }, "Test action") },
  );
  assert.match(html, /class="empty-state"/);
  assert.match(html, /<h2\b[^>]*>Test records<\/h2>/);
  assert.match(html, /href="\/"[^>]*>Test action<\/a>/);
  for (const component of [Coupons, Updates]) {
    const result = await render(component);
    assert.match(result.html, /class="empty-state"/);
    assert.doesNotMatch(result.html, /content-pending/);
  }
});

test("readiness helpers reject heading-only sections and CTA shells", () => {
  assert.equal(hasSectionContent(emptySection), false);
  assert.equal(
    hasSectionContent({ eyebrow: "Test eyebrow", blocks: [] }),
    false,
  );
  assert.equal(
    hasSectionContent({ blocks: [{ type: "list", items: [" "] }] }),
    false,
  );
  assert.equal(hasSectionContent(section), true);
  assert.equal(hasCtaContent({ title: "Test heading", links: [] }), false);
  assert.equal(
    hasCtaContent({ links: [{ label: "Test", to: "javascript:void(0)" }] }),
    false,
  );
  assert.equal(
    hasCtaContent({ links: [{ label: "Test link", to: "/about" }] }),
    true,
  );
  assert.equal(
    hasLegalPageContent({ intro: [], sections: [emptySection] }),
    false,
  );
  const guide = structuredClone(pages[6].content);
  guide.subtitle = "Test subtitle";
  assert.equal(hasCountryGuideContent(guide), false);
  guide.sections = [section];
  assert.equal(hasCountryGuideContent(guide), true);
});

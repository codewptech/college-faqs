/** Vue-aware semantic validation using the existing pinned Golar checker.
 * Nuxt declarations are prepared by the package command; installs nothing.
 */
import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
async function sources(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sources(path)));
    else if (/\.(ts|vue)$/.test(entry.name)) files.push(path);
  }
  return files;
}
const include = (
  await Promise.all(
    ["app", "server", "shared"].map((name) => sources(join(root, name))),
  )
).flat();
include.push(join(root, "nuxt.config.ts"));
const workspace = await mkdtemp(join(tmpdir(), "college-typecheck-"));
try {
  const plugin = pathToFileURL(
    join(root, "node_modules/@golar/vue/dist/index.js"),
  ).href;
  await writeFile(
    join(workspace, "golar.config.mjs"),
    `import ${JSON.stringify(plugin)};\nexport default ${JSON.stringify({ typecheck: { include } })};\n`,
  );
  const result = spawnSync(
    process.execPath,
    [join(root, "node_modules/golar/dist/bin.js"), "typecheck"],
    { cwd: workspace, stdio: "inherit", timeout: 120_000 },
  );
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  await rm(workspace, { recursive: true, force: true });
}

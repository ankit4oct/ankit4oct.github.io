import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const builtHtml = existsSync(path.join(dist, "index.html"))
  ? path.join(dist, "index.html")
  : path.join(dist, "index.template.html");

if (!existsSync(builtHtml)) {
  console.error("Build output is missing. Expected dist/index.html.");
  process.exit(1);
}

for (const dir of ["assets", "landing-pages"]) {
  rmSync(path.join(root, dir), { recursive: true, force: true });
}

cpSync(builtHtml, path.join(root, "index.html"));
cpSync(builtHtml, path.join(root, "404.html"));
cpSync(path.join(dist, "assets"), path.join(root, "assets"), { recursive: true });
cpSync(path.join(dist, "landing-pages"), path.join(root, "landing-pages"), { recursive: true });
writeFileSync(path.join(root, ".nojekyll"), "");

console.log("Published GitHub Pages files:");
for (const name of readdirSync(path.join(root, "assets"))) {
  console.log("  assets/" + name);
}
console.log("  index.html");
console.log("  404.html");
console.log("  landing-pages/");
console.log("  .nojekyll");

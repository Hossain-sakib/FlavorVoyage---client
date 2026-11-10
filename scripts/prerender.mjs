import { build } from "../../FlavorVoyage-server/node_modules/esbuild/lib/main.js";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
const output = path.resolve(".cache/prerender.cjs");
await mkdir(".cache", { recursive: true });
const { execFileSync } = await import("node:child_process");
execFileSync("python3", ["scripts/catalog-snapshot.py"], { stdio: "inherit" });
await build({
  entryPoints: ["scripts/prerender-entry.jsx"],
  outfile: output,
  bundle: true,
  jsx: "automatic",
  platform: "node",
  format: "cjs",
  packages: "external",
  loader: { ".css": "empty" },
  logLevel: "silent",
});
const { pages } = createRequire(import.meta.url)(output);
const template = await readFile("dist/index.html", "utf8");
const escape = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const base = "https://flavor-voyage.netlify.app";
for (const page of pages) {
  const canonical = base + page.path;
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(
      /<meta\s+name="description"[^>]*>/,
      `<meta name="description" content="${escape(page.description)}" />`,
    )
    .replace(
      /<link\s+rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${canonical}" />`,
    )
    .replace(
      /<meta\s+property="og:title"[^>]*>/,
      `<meta property="og:title" content="${escape(page.title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escape(page.description)}" />`,
    )
    .replace(
      /<meta\s+property="og:url"[^>]*>/,
      `<meta property="og:url" content="${canonical}" />`,
    )
    .replace('<div id="root"></div>', `<div id="root">${page.html}</div>`);
  if (page.image)
    html = html.replace(
      /<meta\s+property="og:image"[^>]*>/,
      `<meta property="og:image" content="${escape(page.image)}" />`,
    );
  if (page.schema)
    html = html.replace(
      "</head>",
      `<script id="product-schema" type="application/ld+json">${JSON.stringify(page.schema).replaceAll("<", "\\u003c")}</script></head>`,
    );
  const folder = page.path === "/" ? "dist" : "dist" + page.path;
  await mkdir(folder, { recursive: true });
  await writeFile(folder + "/index.html", html);
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((p) => `<url><loc>${base}${p.path}</loc></url>`).join("")}</urlset>`,
);
await rm(output);
console.log(
  `Prerendered ${pages.length} public pages and sitemap. Sample prices and demo reviews are excluded from structured offers/ratings.`,
);

/** Browser enforcement test using live HTTPS bodies and headers.
 * Node uses the environment's trusted proxy/CA; Chromium receives those exact
 * security headers via request interception. No TLS or CSP checks are disabled.
 * Parent DOM changes exist only in this test browser, never on the portfolio.
 */
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const target = (process.argv[2] || "https://flavor-voyage.netlify.app").replace(
  /\/$/,
  "",
);
const portfolio = "https://sakib-studio.netlify.app";
const cache = new Map();
async function live(url) {
  if (!cache.has(url))
    cache.set(
      url,
      (async () => {
        const response = await fetch(url, { redirect: "follow" });
        const headers = Object.fromEntries(response.headers);
        for (const name of [
          "content-encoding",
          "content-length",
          "transfer-encoding",
          "connection",
        ])
          delete headers[name];
        return {
          status: response.status,
          headers,
          body: Buffer.from(await response.arrayBuffer()),
        };
      })(),
    );
  return cache.get(url);
}
const checks = [];
for (const path of [
  "/",
  "/dashboard",
  "/admin",
  "/?view=admin",
  "/products/bd-mojo",
  "/credits",
  "/api/health",
]) {
  const response = await live(target + path);
  assert.equal(response.status, 200, path);
  assert.equal(response.headers["x-frame-options"], undefined, path);
  const csp = response.headers["content-security-policy"] || "";
  assert.equal(
    csp.match(/(?:^|;)\s*frame-ancestors\s+([^;]+)/)?.[1],
    portfolio,
    path,
  );
  checks.push({ path, portfolioOnly: true, conflictingXfo: false });
}
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
});
const embedding = [];
try {
  for (const parent of [portfolio, "https://example.com"]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const origins = new Set([
      new URL(target).origin,
      portfolio,
      "https://example.com",
      "https://res.cloudinary.com",
    ]);
    await page.route("**/*", async (route) => {
      const request = route.request();
      if (
        !["GET", "HEAD"].includes(request.method()) ||
        !origins.has(new URL(request.url()).origin)
      )
        return route.abort();
      try {
        return await route.fulfill(await live(request.url()));
      } catch {
        return route.abort();
      }
    });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(parent, { waitUntil: "domcontentloaded" });
    await page.evaluate((src) => {
      const frame = document.createElement("iframe");
      frame.title = "FlavorVoyage framing verification";
      frame.src = src;
      frame.width = "1200";
      frame.height = "900";
      document.body.prepend(frame);
    }, target + "/");
    const heading = page
      .frameLocator('iframe[title="FlavorVoyage framing verification"]')
      .getByRole("heading", { level: 1, name: /Your next/ })
      .first();
    if (parent === portfolio) {
      await heading.waitFor({ state: "visible", timeout: 30000 });
      assert.match(await heading.textContent(), /Your next/);
      embedding.push({ parent, rendered: true });
    } else {
      const until = Date.now() + 10000;
      while (
        !errors.some((message) => message.includes("frame-ancestors")) &&
        Date.now() < until
      )
        await new Promise((resolve) => setTimeout(resolve, 100));
      assert(
        errors.some((message) => message.includes("frame-ancestors")),
        "Expected browser framing rejection",
      );
      assert.equal(await heading.count(), 0);
      embedding.push({
        parent,
        rendered: false,
        blockedByFrameAncestors: true,
      });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
const report = {
  target,
  liveHeaders: checks,
  browserEmbedding: embedding,
  tlsVerificationDisabled: false,
};
if (process.env.FRAME_REPORT)
  await writeFile(process.env.FRAME_REPORT, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));

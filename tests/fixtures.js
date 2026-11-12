import { test as base, expect } from "@playwright/test";
import path from "node:path";
import { readFileSync } from "node:fs";
const images = JSON.parse(
  readFileSync(new URL("../scripts/site-images.json", import.meta.url), "utf8"),
);
const originals = new Map(
  Object.entries(images).map(([file, url]) => [url, file]),
);
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("https://res.cloudinary.com/**", (route) => {
      const original = originals.get(route.request().url());
      return original
        ? route.fulfill({ path: path.resolve("public", "." + original) })
        : route.continue();
    });
    await use(page);
  },
});
export { expect };

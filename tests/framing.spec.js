import { readFileSync } from "node:fs";
import { test, expect } from "./fixtures";
const allowed = "https://sakib-studio.netlify.app";
const child = "https://flavor-voyage.netlify.app/frame-policy-test";
const rules = readFileSync("public/_headers", "utf8");
const policies = [
  ...rules.matchAll(/Content-Security-Policy:\s*([^\n]+)/g),
].map((match) => match[1]);
for (const origin of [
  allowed,
  "https://example.com",
  "https://sakib-studio.netlify.app.evil.example",
]) {
  test(`framing policy ${origin === allowed ? "allows" : "blocks"} ${origin}`, async ({
    page,
  }) => {
    expect(rules.toLowerCase()).not.toContain("x-frame-options");
    expect(policies.length).toBeGreaterThan(0);
    for (const policy of policies)
      expect(policy.match(/(?:^|;)\s*frame-ancestors\s+([^;]+)/)?.[1]).toBe(
        allowed,
      );
    await page.route(origin + "/frame-policy-parent", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<iframe title="Preview" src="${child}" width="800" height="600"></iframe>`,
      }),
    );
    await page.route(child, (route) =>
      route.fulfill({
        contentType: "text/html",
        headers: { "Content-Security-Policy": policies[0] },
        body: "<h1>Portfolio preview</h1>",
      }),
    );
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(origin + "/frame-policy-parent");
    if (origin === allowed)
      await expect(
        page
          .frameLocator('iframe[title="Preview"]')
          .getByRole("heading", { name: "Portfolio preview" }),
      ).toBeVisible();
    else {
      await expect
        .poll(() => errors.some((message) => /frame-ancestors/.test(message)))
        .toBe(true);
      await expect(
        page
          .frameLocator('iframe[title="Preview"]')
          .getByRole("heading", { name: "Portfolio preview" }),
      ).toHaveCount(0);
    }
  });
}

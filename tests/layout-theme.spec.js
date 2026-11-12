import { setTheme } from "./theme";
import { test, expect } from "./fixtures";
const widths = [320, 390, 768, 1024, 1440, 1920];
async function fits(page, context) {
  const overflow = await page.evaluate(() => ({
    containers: [
      ...document.querySelectorAll(
        "html, body, #root, .app-shell, .main-shell, main, .inventory-panel, .table-scroll",
      ),
    ].map((e) => ({
      tag: e.tagName,
      class: e.className,
      width: e.clientWidth,
      scroll: e.scrollWidth,
      overflow: getComputedStyle(e).overflow,
      display: getComputedStyle(e).display,
    })),
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll("main *, header *")]
      .filter((e) => e.getBoundingClientRect().right > innerWidth + 2)
      .slice(0, 8)
      .map((e) => ({ tag: e.tagName, classes: e.className })),
  }));
  expect(
    overflow.scroll,
    `${context}: ${JSON.stringify(overflow)}`,
  ).toBeLessThanOrEqual(overflow.width);
}
test("public pages and account views fit six widths in both themes", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?view=overview");
  await page
    .getByRole("button", { name: "Try as retailer", exact: true })
    .click();
  for (const theme of ["light", "dark"]) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await setTheme(page, theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      for (const route of [
        "/",
        "/products/bd-mojo",
        "/credits",
        "/?view=overview",
        "/?view=catalog",
        "/?view=orders",
        "/?view=quotes",
        "/?view=suppliers",
        "/?view=messages",
        "/?view=addresses",
      ]) {
        await page.goto(route);
        await expect(page.locator("main")).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await fits(page, `${theme} ${width} ${route}`);
        if (
          process.env.FV_CAPTURE_DIR &&
          [390, 1440].includes(width) &&
          ["/", "/products/bd-mojo", "/?view=overview"].includes(route)
        )
          await page.screenshot({
            path: `${process.env.FV_CAPTURE_DIR}/audit-${theme}-${width}-${route === "/" ? "home" : route.includes("products") ? "product" : "dashboard"}.png`,
            fullPage: true,
          });
      }
    }
  }
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await setTheme(page, "light");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors).toEqual([]);
});
test("supplier inventory, settings and notifications are usable at small widths", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto("/?view=overview");
  await page
    .getByRole("button", { name: "Try as supplier", exact: true })
    .click();
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const view of [
      "overview",
      "inventory",
      "shop",
      "orders",
      "quotes",
      "messages",
    ]) {
      await page.goto(`/?view=${view}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await fits(page, `supplier ${width} ${view}`);
    }
  }
  await page.setViewportSize({ width: 320, height: 700 });
  await page.getByRole("button", { name: /Notifications, \d+ unread/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await fits(page, "notification dialog");
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

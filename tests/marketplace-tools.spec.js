import { test, expect } from "./fixtures";
const headers = { Origin: "http://127.0.0.1:5174" };
test("company, distributor, size and ingredient filters work together and comparisons show real pack details", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText("Refine your search", { exact: false }).first().click();
  await page.getByLabel("Company / brand search").fill("Akij");
  await expect(page.locator(".fv-drink-card")).not.toHaveCount(0);
  await page.getByLabel("Distributor search").fill("Uttara");
  await page.getByLabel("Pack / unit size").selectOption("500 ml");
  await expect(page.locator(".fv-drink-card").first()).toBeVisible();
  await expect(
    page.locator(".fv-drink-card").filter({ hasText: "Mojo Cola" }),
  ).toContainText("500 ml");
  await page
    .getByRole("button", { name: "Reset refinements", exact: true })
    .click();
  await page.getByLabel("Flavor or ingredient keyword").fill("tea");
  await expect(page.locator(".fv-drink-card")).not.toHaveCount(0);
  await page
    .getByRole("button", { name: "Reset refinements", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Compare Mojo Cola", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Compare Clemon Lemon", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Compare picks", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Minimum subtotal");
  await expect(page.getByRole("dialog")).toContainText("24 × 250 ml");
  await page.getByRole("button", { name: "Close comparison" }).click();
});
test("customer addresses and reviews persist and administration stays protected", async ({
  page,
}) => {
  const stamp = Date.now();
  await page.request.post("/api/auth/register", {
    headers,
    data: {
      name: "Review customer",
      business: "Sample shop",
      email: `review-${stamp}@example.test`,
      password: "Testing-password-2026",
      role: "retailer",
      location: "Dhaka",
    },
  });
  await page.goto("/?view=addresses");
  await page.getByLabel("Address label").fill("Warehouse");
  await page
    .getByLabel("Full delivery address")
    .fill("Sample warehouse, Dhaka");
  await page.getByLabel("Phone number").fill("01700000000");
  await page.getByRole("button", { name: "Save address", exact: true }).click();
  await expect(page.locator(".address-card")).toContainText("Warehouse");
  await page.goto("/products/bd-mojo");
  await page.getByLabel("Your rating").selectOption("4");
  await page
    .getByLabel("Your experience")
    .fill("Clear case sizes and useful dealer comparison.");
  await page
    .getByRole("button", { name: "Publish review", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Your review is saved.");
  await page.reload();
  await expect(page.locator(".review-card")).toContainText([
    "Clear case sizes and useful dealer comparison.",
    "Demo review:",
  ]);
  const denied = await page.request.get("/api/admin/data");
  expect(denied.status()).toBe(403);
  await page.goto("/?view=admin");
  await expect(
    page.getByRole("heading", { name: "Administrator sign-in required" }),
  ).toBeVisible();
});

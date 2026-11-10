import { test, expect } from "@playwright/test";

test("public website opens before the marketplace; drinks, favorites and details work without login", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your next",
  );
  await expect(page.locator(".sidebar")).toHaveCount(0);
  await expect(page.locator(".fv-drink-card")).toHaveCount(8);
  await page
    .getByRole("textbox", { name: "Search drinks", exact: true })
    .fill("frutika");
  await expect(page.locator(".fv-drink-card")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Save Frutika Mango", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Discover Frutika Mango", exact: true })
    .click();
  await expect(page).toHaveURL(/products\/bd-frutika/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Frutika Mango" }),
  ).toBeVisible();
  await expect(
    page.getByText("Choose your pack size", { exact: true }),
  ).toBeVisible();
  await page.goBack();
  await page
    .getByRole("textbox", { name: "Search drinks", exact: true })
    .fill("frutika");
  await page.locator(".fv-favorite-filter").click();
  await expect(page.locator(".fv-drink-card")).toHaveCount(1);
  await page.reload();
  await page
    .getByRole("textbox", { name: "Search drinks", exact: true })
    .fill("mojo");
  await page
    .locator(".fv-footer")
    .getByRole("button", { name: "Your favorites", exact: true })
    .click();
  await expect(page.locator(".fv-drink-card")).toHaveCount(1);
  await page.locator(".fv-business-actions .fv-button").click();
  await expect(page.locator(".sidebar")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "The wholesale marketplace.",
  );
  await page
    .getByRole("button", { name: "Back to the website", exact: true })
    .click();
  await expect(page.locator(".fv-website")).toBeVisible();
  expect(errors).toEqual([]);
});

test("public mobile navigation, category discovery and FAQs are usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".fv-drink-card")).toHaveCount(8);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name: "Explore drinks", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Open menu", exact: true }),
  ).toBeVisible();
  await page
    .locator(".fv-filter-tabs")
    .getByRole("button", { name: "Water", exact: true })
    .click();
  await expect(page.locator(".fv-drink-card")).toHaveCount(3);
  await page
    .locator("summary")
    .filter({ hasText: "Can I buy a single bottle here?" })
    .click();
  await expect(
    page.getByText("Individual-bottle delivery is not available yet.", {
      exact: false,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

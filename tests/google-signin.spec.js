import { test, expect } from "@playwright/test";

test("Google is offered on sign-in and sign-up and handles an unavailable Google service without submitting the email form", async ({
  page,
}) => {
  await page.route("https://apis.google.com/js/api.js*", (route) =>
    route.abort("failed"),
  );
  await page.goto("/?view=overview");
  await page
    .getByRole("button", { name: "Sign in", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  const google = dialog.getByRole("button", {
    name: "Continue with Google",
    exact: true,
  });
  await expect(google).toHaveAttribute("type", "button");
  await google.click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Google sign-in could not be completed",
    { timeout: 15000 },
  );
  await dialog
    .getByRole("button", { name: "Create an account", exact: true })
    .click();
  await page.getByLabel("Your name", { exact: true }).fill("Demo dealer");
  await page.getByLabel("I am a").selectOption("supplier");
  await google.click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Google sign-in could not be completed",
    { timeout: 15000 },
  );
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "Demo dealer",
  );
  await expect(page.getByLabel("I am a")).toHaveValue("supplier");
  const session = await (await page.request.get("/api/session")).json();
  expect(session.user).toBeNull();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

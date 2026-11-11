import { setTheme } from "./theme";
import { test, expect } from "@playwright/test";
test("all discoverable packshots and company logos load without cropping", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Explore all \d+ drinks/ }).click();
  await expect(page.locator(".fv-drink-card")).toHaveCount(56);
  await page
    .locator("img")
    .evaluateAll((images) =>
      images.forEach((image) => (image.loading = "eager")),
    );
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll(
          (images) =>
            images.filter(
              (image) => !image.complete || image.naturalWidth === 0,
            ).length,
        ),
    )
    .toBe(0);
  await expect(
    page.getByRole("img", { name: /photo unavailable/ }),
  ).toHaveCount(0);
  expect(
    await page
      .locator(".drink-packshot")
      .evaluateAll((images) =>
        images.every(
          (image) => getComputedStyle(image).objectFit === "contain",
        ),
      ),
  ).toBe(true);
  for (const mode of ["light", "dark"]) {
    await setTheme(page, mode);
    expect(
      await page
        .locator("#companies img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              getComputedStyle(image).backgroundColor === "rgb(255, 255, 255)",
          ),
        ),
    ).toBe(true);
  }
});

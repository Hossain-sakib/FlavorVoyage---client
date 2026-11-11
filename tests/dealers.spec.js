import { test, expect } from "@playwright/test";
const headers = { Origin: "http://127.0.0.1:5174" };
test("variant prices, nearest dealer and chosen pack carry through to an order", async ({
  page,
}) => {
  await page.request.post("/api/auth/demo", {
    headers,
    data: { role: "retailer" },
  });
  await page.goto("/?view=product&product=bd-mojo");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mojo Cola");
  await page.getByRole("button", { name: "500 ml", exact: true }).click();
  await expect(page.locator(".detail-specs")).toContainText("12 × 500 ml");
  await page.getByLabel("Your area", { exact: true }).selectOption("0");
  const first = page.locator(".nearby-card").first();
  await expect(first).toContainText("Cosmobit Drinks — Dhanmondi");
  await expect(first).toContainText("0 km away");
  await expect(first).toContainText("720");
  await first.getByRole("button", { name: "Add 2 cases" }).click();
  await page.getByRole("button", { name: "Your order", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("12 × 500 ml");
  await expect(page.getByRole("dialog")).toContainText("1,440");
  await page.getByRole("button", { name: "Continue to order" }).click();
  await page.getByLabel("Delivery address").fill("Demo shop, Dhanmondi, Dhaka");
  await page.getByLabel("Contact number").fill("01700000000");
  await page.getByRole("button", { name: "Place order", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Every order, in one place.",
  );
  const orders = await (await page.request.get("/api/orders")).json();
  const order = orders.find((o) => o.supplierId === "s-cosmobit-dhaka");
  expect(order.total).toBe(1440);
  expect(order.items[0].pack).toBe("12 × 500 ml");
});

test("customer and demo dealer exchange persistent messages through their dashboards", async ({
  browser,
}) => {
  const buyerContext = await browser.newContext();
  const dealerContext = await browser.newContext();
  const buyer = await buyerContext.newPage();
  const dealer = await dealerContext.newPage();
  await buyer.request.post("/api/auth/demo", {
    headers,
    data: { role: "retailer" },
  });
  await buyer.goto("/?view=suppliers");
  await buyer.getByLabel("Your area", { exact: true }).selectOption("1");
  await expect(buyer.locator(".nearby-card").first()).toContainText(
    "Cosmobit Beverage Hub — Uttara",
  );
  await buyer
    .locator(".nearby-card")
    .first()
    .getByRole("button", { name: "Message dealer" })
    .click();
  await expect(
    buyer.getByRole("heading", {
      name: "Cosmobit Beverage Hub — Uttara",
      exact: true,
    }),
  ).toBeVisible();
  await buyer
    .getByLabel("Your message")
    .fill("Can you deliver two cases tomorrow?");
  await buyer.getByRole("button", { name: "Send", exact: true }).click();
  await expect(buyer.locator(".message-history")).toContainText(
    "Can you deliver two cases tomorrow?",
  );
  await dealer.goto("/?view=messages");
  await dealer
    .getByRole("button", { name: "Sign in", exact: true })
    .first()
    .click();
  await dealer
    .getByText("Preview a Cosmobit demo dealer inbox", { exact: true })
    .click();
  await dealer
    .getByRole("button", {
      name: "Cosmobit Beverage Hub — Uttara",
      exact: true,
    })
    .click();
  await dealer.locator(".conversation-item").first().click();
  await expect(dealer.locator(".message-history")).toContainText(
    "Can you deliver two cases tomorrow?",
  );
  await dealer
    .getByLabel("Your message")
    .fill("Yes. Please confirm your delivery area.");
  await dealer.getByRole("button", { name: "Send", exact: true }).click();
  await expect(buyer.locator(".message-history")).toContainText(
    "Yes. Please confirm your delivery area.",
    { timeout: 10000 },
  );
  await dealer
    .getByRole("button", { name: "Shop settings", exact: true })
    .click();
  await dealer
    .getByRole("button", { name: "Save shop location", exact: true })
    .click();
  await expect(dealer.getByRole("status")).toContainText(
    "Shop location saved.",
  );
  await buyer.reload();
  await buyer.locator(".conversation-item").first().click();
  await expect(buyer.locator(".message-history")).toContainText(
    "Yes. Please confirm your delivery area.",
  );
  await buyer
    .getByRole("button", { name: /Notifications, \d+ unread/ })
    .click();
  await expect(buyer.getByRole("dialog")).toContainText(
    "Open your private conversation to read and reply.",
  );
  await buyer
    .getByRole("dialog")
    .getByRole("button", { name: /Message from/ })
    .first()
    .click();
  await expect(buyer).toHaveURL(/view=messages/);
  await expect(buyer.getByRole("dialog")).toHaveCount(0);
  await buyer.setViewportSize({ width: 390, height: 844 });
  expect(
    await buyer.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await buyerContext.close();
  await dealerContext.close();
});

test("mobile product deep link, variant switching and location fallback work", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?view=product&product=bd-mojo");
  await page.getByRole("button", { name: "500 ml", exact: true }).click();
  await page.evaluate(() => {
    navigator.geolocation.getCurrentPosition = (_, fail) => fail({ code: 1 });
  });
  await page.getByRole("button", { name: "Use my location" }).click();
  await expect(page.getByRole("alert")).toContainText("Choose an area");
  await page.getByLabel("Your area", { exact: true }).selectOption("4");
  await expect(page.locator(".nearby-card").first()).toContainText(
    "Cosmobit Drinks — Chattogram",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Mojo Cola");
});

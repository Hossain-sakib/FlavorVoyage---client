import { test, expect } from "@playwright/test";

// Exercise checkout, quote and inventory dialogs with the system dark preference.
test.use({ colorScheme: "dark" });

test("retailer browsing, direct order, cancellation, quote request, and mobile navigation", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?view=overview");
  await page.getByRole("button", { name: "Add Mojo Cola to order" }).click();
  await page.getByRole("button", { name: "Try as retailer" }).click();
  await expect(
    page.getByRole("button", { name: "Try as retailer" }),
  ).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Open order basket, 1 products" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Open order basket/ }).click();
  await page.getByRole("button", { name: "Continue to order" }).click();
  await page
    .getByLabel("Delivery address")
    .fill("Shop 12, Dhanmondi, Dhaka 1209");
  await page.getByLabel("Contact number").fill("+8801700000000");
  await page.getByRole("button", { name: "Place order", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Every order, in one place." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Pay online", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Details", exact: false })
    .first()
    .click();
  await page.getByRole("button", { name: "Cancel order", exact: true }).click();
  await expect(
    page.getByText("cancelled", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Marketplace", exact: true }).click();
  await page.getByRole("textbox", { name: "Search products" }).fill("frooto");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Add PRAN Frooto Mango to order" })
    .click();
  await page.getByRole("button", { name: /Open order basket/ }).click();
  await page
    .getByRole("button", { name: "Request a quote", exact: true })
    .click();
  await page
    .getByLabel("Tell your suppliers what you need")
    .fill("Please quote your best price for weekly orders.");
  await page.getByRole("button", { name: "Send quote requests" }).click();
  await expect(page.getByText("requested", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(page.locator(".sidebar")).not.toHaveClass(/mobile-open/);
  await page.waitForTimeout(250);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  expect(errors).toEqual([]);
});

test("supplier catalog, retailer negotiation, offer acceptance and private order management", async ({
  browser,
}) => {
  const supplierContext = await browser.newContext();
  const retailerContext = await browser.newContext();
  const stamp = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const seller = await supplierContext.newPage();
  const buyer = await retailerContext.newPage();
  async function signUp(page, role) {
    await page.goto("/?view=overview");
    await page
      .getByRole("button", { name: "Sign in", exact: false })
      .first()
      .click();
    await page
      .getByRole("button", { name: "Create an account", exact: true })
      .click();
    await page.getByLabel("Your name", { exact: true }).fill(`Test ${role}`);
    await page
      .getByLabel("Name / shop name", { exact: true })
      .fill(`Test ${role} ${stamp}`);
    await page.getByLabel("I am a").selectOption(role);
    await page
      .getByLabel("Email address")
      .fill(`${role}-${stamp}@example.test`);
    await page
      .getByLabel("Password", { exact: true })
      .fill("Test-password-2026");
    await page.getByRole("button", { name: "Create business account" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
  }
  await signUp(seller, "supplier");
  await seller
    .getByRole("button", { name: "My inventory", exact: true })
    .click();
  await seller
    .getByRole("button", { name: "Add product", exact: true })
    .first()
    .click();
  await seller
    .getByLabel("Product name", { exact: true })
    .fill(`Test rice ${stamp}`);
  await seller.getByLabel("Brand", { exact: true }).fill("Test Harvest");
  await seller.getByLabel("Pack size", { exact: true }).fill("10 kg");
  await seller.getByLabel("Case price (BDT)", { exact: true }).fill("1000");
  await seller.getByLabel("Minimum cases", { exact: true }).fill("2");
  await seller.getByLabel("Available cases", { exact: true }).fill("50");
  await seller
    .getByRole("button", { name: "Save product", exact: true })
    .click();
  await expect(
    seller.getByText(`Test rice ${stamp}`, { exact: true }),
  ).toBeVisible();
  await signUp(buyer, "retailer");
  await buyer.getByRole("button", { name: "Marketplace", exact: true }).click();
  await buyer
    .getByRole("textbox", { name: "Search products" })
    .fill(`Test rice ${stamp}`);
  await buyer
    .getByRole("button", { name: `Add Test rice ${stamp} to order` })
    .click();
  await buyer.getByRole("button", { name: /Open order basket/ }).click();
  await buyer
    .getByRole("button", { name: "Request a quote", exact: true })
    .click();
  await buyer
    .getByLabel("Tell your suppliers what you need")
    .fill("Please offer 900 BDT per case.");
  await buyer.getByRole("button", { name: "Send quote requests" }).click();
  await expect(buyer.getByText("requested", { exact: true })).toBeVisible();
  await seller.reload();
  await seller
    .getByRole("button", { name: "Quotes & requests", exact: true })
    .click();
  await seller
    .getByRole("button", { name: "Prepare offer", exact: false })
    .click();
  await seller.getByRole("spinbutton").fill("900");
  await seller.getByRole("button", { name: "Send offer" }).click();
  await expect(seller.getByText("offered", { exact: true })).toBeVisible();
  await buyer.reload();
  await buyer
    .getByRole("button", { name: "Accept offer", exact: false })
    .click();
  await buyer.getByLabel("Delivery address").fill("A test store in Dhaka");
  await buyer.getByLabel("Contact number").fill("01700000000");
  await buyer.getByRole("button", { name: "Place order", exact: true }).click();
  await expect(
    buyer.getByRole("heading", { name: "Every order, in one place." }),
  ).toBeVisible();
  await expect(buyer.locator(".order-footer strong")).toHaveText(/1,800/);
  await seller.reload();
  await seller.getByRole("button", { name: "Orders", exact: true }).click();
  await seller
    .getByRole("button", { name: "Confirm order", exact: true })
    .click();
  await expect(seller.getByText("confirmed", { exact: true })).toBeVisible();
  await seller
    .getByRole("button", { name: "Mark shipped", exact: true })
    .click();
  await expect(seller.getByText("shipped", { exact: true })).toBeVisible();
  await seller
    .getByRole("button", { name: "Mark delivered", exact: true })
    .click();
  await expect(seller.getByText("delivered", { exact: true })).toBeVisible();
  await seller
    .getByRole("button", { name: "My inventory", exact: true })
    .click();
  await expect(
    seller.getByRole("cell", { name: "48", exact: true }),
  ).toBeVisible();
  await supplierContext.close();
  await retailerContext.close();
});

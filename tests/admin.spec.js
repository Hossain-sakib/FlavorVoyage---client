import { test, expect } from "@playwright/test";

test("authorized admin UI saves catalog changes and exposes CRM, dealer and CMS controls", async ({
  page,
}) => {
  const product = {
    id: "admin-fixture",
    name: "Sample product",
    brand: "Sample brand",
    pack: "12 × 500 ml",
    servingSize: "500 ml",
    price: 600,
    stock: 20,
    moq: 2,
    active: true,
    supplierId: "dealer-1",
    image: "/images/drinks/mojo-photo.png",
  };
  const data = {
    users: [],
    products: [product],
    suppliers: [{ id: "dealer-1", name: "Demo dealer", location: "Dhaka" }],
    orders: [],
    quotes: [
      {
        id: "quote-1",
        reference: "RFQ-DEMO",
        retailerName: "Example shop",
        supplierName: "Demo dealer",
        items: [{ name: "Sample product", quantity: 4 }],
        status: "requested",
        note: "Morning delivery preferred",
      },
    ],
    content: {},
    notes: [],
    auditLog: [],
    metrics: { users: 1, products: 1, activeOrders: 0, totalOrderValue: 0 },
  };
  await page.route("**/api/session", (route) =>
    route.fulfill({
      json: {
        user: {
          id: "admin-user",
          name: "Administrator",
          business: "Admin",
          role: "retailer",
          isAdmin: true,
          googleLinked: true,
        },
        demo: false,
      },
    }),
  );
  for (const path of ["orders", "quotes", "addresses", "conversations"])
    await page.route(`**/api/${path}`, (route) => route.fulfill({ json: [] }));
  await page.route("**/api/admin/data", (route) =>
    route.fulfill({ json: data }),
  );
  let saved;
  await page.route("**/api/admin/products/admin-fixture", async (route) => {
    saved = route.request().postDataJSON();
    Object.assign(product, saved);
    await route.fulfill({ json: product });
  });
  let created;
  await page.route("**/api/admin/products", async (route) => {
    created = route.request().postDataJSON();
    const result = { ...created, id: "created-product", active: true };
    data.products.push(result);
    await route.fulfill({ status: 201, json: result });
  });
  await page.goto("/?view=admin");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await page.getByLabel("Filter admin stock").selectOption("low");
  await expect(
    page.getByText("No listings match. Try another search or stock filter."),
  ).toBeVisible();
  await page.getByLabel("Filter admin stock").selectOption("all");
  await page.getByLabel("Case price", { exact: true }).fill("700");
  await page.getByRole("button", { name: "Save product", exact: true }).click();
  await expect.poll(() => saved?.price).toBe(700);
  await page
    .getByText("Add a new product or pack variant", { exact: true })
    .click();
  await page
    .getByLabel("New product name", { exact: true })
    .fill("New example drink");
  await page
    .getByLabel("New product brand", { exact: true })
    .fill("Example brand");
  await page
    .getByLabel("New case packaging", { exact: true })
    .fill("12 × 500 ml");
  await page.getByLabel("New unit size", { exact: true }).fill("500 ml");
  await page
    .getByRole("combobox", { name: "Dealer for new product", exact: true })
    .selectOption("dealer-1");
  await page.getByLabel("New case price (BDT)", { exact: true }).fill("650");
  await page.getByLabel("New available stock", { exact: true }).fill("25");
  await page.getByLabel("New minimum cases", { exact: true }).fill("2");
  await page
    .getByRole("button", { name: "Create product", exact: true })
    .click();
  await expect.poll(() => created?.name).toBe("New example drink");
  expect(created.supplierId).toBe("dealer-1");
  await page.getByRole("button", { name: "Dealers", exact: true }).click();
  await expect(page.getByRole("button", { name: "Save dealer" })).toBeVisible();
  await page.getByRole("button", { name: "Quotes", exact: true }).click();
  await expect(page.getByText("RFQ-DEMO", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Sample product (4 cases)", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Content", exact: true }).click();
  await expect(page.getByLabel("Announcement", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Audit log", exact: true }).click();
  await expect(
    page.getByRole("columnheader", { name: "Administrator", exact: true }),
  ).toBeVisible();
});

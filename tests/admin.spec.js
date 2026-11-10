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
    quotes: [],
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
  await page.goto("/?view=admin");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await page.getByLabel("Case price", { exact: true }).fill("700");
  await page.getByRole("button", { name: "Save product", exact: true }).click();
  await expect.poll(() => saved?.price).toBe(700);
  await page.getByRole("button", { name: "Dealers", exact: true }).click();
  await expect(page.getByRole("button", { name: "Save dealer" })).toBeVisible();
  await page.getByRole("button", { name: "Content", exact: true }).click();
  await expect(page.getByLabel("Announcement", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Audit log", exact: true }).click();
  await expect(
    page.getByRole("columnheader", { name: "Administrator", exact: true }),
  ).toBeVisible();
});

import { setTheme } from "./theme";
import { test, expect } from "./fixtures";

test("authorized admin UI saves catalog changes and exposes CRM, dealer and CMS controls", async ({
  page,
}) => {
  test.setTimeout(120000);
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
  await page.route("**/api/admin/reports*", (route) =>
    route.fulfill({
      json: {
        from: "2026-11-01",
        to: "2026-11-11",
        includeDemo: false,
        summary: { orders: 0, orderValue: 0, openOrders: 0, cases: 0 },
        daily: [],
        dealers: [],
        products: [],
      },
    }),
  );
  await page.route("**/api/admin/operations", (route) =>
    route.fulfill({
      json: {
        checkedAt: new Date().toISOString(),
        storage: "netlify-blobs",
        demoEnabled: true,
        backups: { enabled: true, count: 1, latest: { date: "2026-11-11" } },
        checks: [{ label: "Workspace available", ok: true }],
      },
    }),
  );
  let tasks = [];
  await page.route("**/api/admin/tasks", async (route) => {
    if (route.request().method() === "POST") {
      const task = {
        ...route.request().postDataJSON(),
        id: "task-1",
        status: "open",
      };
      tasks.push(task);
      await route.fulfill({ status: 201, json: task });
    } else await route.fulfill({ json: tasks });
  });
  await page.route("**/api/admin/tasks/task-1", async (route) => {
    Object.assign(tasks[0], route.request().postDataJSON());
    await route.fulfill({ json: tasks[0] });
  });
  await page.route("**/api/admin/exports/*", (route) =>
    route.fulfill({
      headers: {
        "content-type": "text/csv",
        "content-disposition": "attachment; filename=flavorvoyage-orders.csv",
      },
      body: "Reference,Value\r\nORD-1,100",
    }),
  );
  await page.route("**/api/admin/backups", (route) =>
    route.fulfill({ status: 201, json: { created: true } }),
  );
  async function section(name) {
    if (await page.getByLabel("Admin section", { exact: true }).isVisible())
      await page
        .getByLabel("Admin section", { exact: true })
        .selectOption(name);
    else
      await page
        .getByRole("region", { name: "Admin dashboard", exact: true })
        .getByRole("button", { name, exact: true })
        .click();
  }
  await page.goto("/?view=admin");
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await page.getByLabel("Filter admin stock").selectOption("low");
  await expect(
    page.getByText("No listings match. Try another search or stock filter."),
  ).toBeVisible();
  await page.getByLabel("Filter admin stock").selectOption("all");
  await page.getByText("Edit Sample product", { exact: true }).click();
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
  await section("Reports");
  const downloading = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export orders CSV", exact: true })
    .click();
  const downloaded = await downloading;
  expect(downloaded.suggestedFilename()).toBe("flavorvoyage-orders.csv");
  await downloaded.delete();
  await section("Follow-ups");
  await page.getByText("Add a follow-up task", { exact: true }).click();
  await page
    .getByLabel("Task title", { exact: true })
    .fill("Confirm dealer delivery");
  await page.getByLabel("Due date", { exact: true }).fill("2026-11-20");
  await page
    .getByRole("button", { name: "Create follow-up", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Confirm dealer delivery", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mark complete", exact: true })
    .click();
  await page.getByLabel("Task view", { exact: true }).selectOption("done");
  await expect(
    page.getByRole("button", { name: "Reopen task", exact: true }),
  ).toBeVisible();
  await section("Operations");
  await page
    .getByRole("button", { name: "Create private backup", exact: true })
    .click();
  await expect(
    page.getByText(
      "Private backup created. Restore access is restricted to the operator tool.",
    ),
  ).toBeVisible();
  for (const theme of ["light", "dark"]) {
    await setTheme(page, theme);
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const name of [
        "Overview",
        "Products",
        "Dealers",
        "Customers & CRM",
        "Orders",
        "Quotes",
        "Content",
        "Audit log",
        "Reports",
        "Follow-ups",
        "Operations",
      ]) {
        await section(name);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
          `${theme} admin ${name} ${width}`,
        ).toBeLessThanOrEqual(width);
        if (
          process.env.FV_CAPTURE_DIR &&
          [
            "Overview",
            "Reports",
            "Follow-ups",
            "Operations",
            "Products",
          ].includes(name)
        ) {
          if (name === "Follow-ups")
            await page
              .getByText("Add a follow-up task", { exact: true })
              .click();
          await page.screenshot({
            path: `${process.env.FV_CAPTURE_DIR}/admin-${name.toLowerCase()}-${theme}-${width}.png`,
            fullPage: true,
          });
        }
      }
    }
  }
});

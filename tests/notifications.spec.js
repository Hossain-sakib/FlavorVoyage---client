import { setTheme } from "./theme";
import { test, expect } from "@playwright/test";
test("notification unread state, mark all and navigation work in dark mode", async ({
  page,
}) => {
  const item = {
    id: "message:demo",
    title: "Message from Dealer",
    description: "Open your private conversation to read and reply.",
    view: "messages",
    conversationId: "thread-demo",
    createdAt: "2026-11-11T06:00:00Z",
    read: false,
  };
  await page.route("**/api/notifications", (route) =>
    route.fulfill({ json: [item] }),
  );
  await page.route("**/api/notifications/read", (route) => {
    item.read = true;
    return route.fulfill({ json: [item] });
  });
  await page.goto("/?view=overview");
  await page
    .getByRole("button", { name: "Try as retailer", exact: true })
    .click();
  await setTheme(page, "dark");
  await page
    .getByRole("button", { name: "Notifications, 1 unread", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Mark all as read", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Notifications, 0 unread", exact: true }),
  ).toHaveCount(1);
  await page.getByRole("button", { name: /Message from Dealer/ }).click();
  await expect(page).toHaveURL(/view=messages/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("guests see a theme button and no notification bell or feed requests", async ({
  page,
}) => {
  const feedRequests = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/notifications"))
      feedRequests.push(request.url());
  });
  await page.emulateMedia({ colorScheme: "dark" });
  for (const route of ["/", "/products/bd-mojo", "/?view=overview"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(
      page.getByRole("button", { name: "Switch to dark mode", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Notifications,/ }),
    ).toHaveCount(0);
  }
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Switch to light mode", exact: true }),
  ).toBeVisible();
  expect(feedRequests).toEqual([]);
});

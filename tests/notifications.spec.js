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
  await page.getByLabel("Color theme", { exact: true }).selectOption("dark");
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

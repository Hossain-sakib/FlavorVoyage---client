export async function setTheme(page, theme) {
  if ((await page.locator("html").getAttribute("data-theme")) !== theme)
    await page
      .getByRole("button", { name: `Switch to ${theme} mode`, exact: true })
      .click();
}

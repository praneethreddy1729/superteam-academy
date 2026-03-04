import { test, expect } from "@playwright/test";

test.describe("Internationalization", () => {
  test("English locale loads", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", /en/);
  });

  test("Portuguese locale loads", async ({ page }) => {
    await page.goto("/pt-BR");
    await page.waitForLoadState("networkidle");
    await expect(page).not.toHaveURL(/error|404/);
    const html = page.locator("html");
    const lang = await html.getAttribute("lang");
    expect(lang).toMatch(/pt/i);
  });

  test("Spanish locale loads", async ({ page }) => {
    await page.goto("/es");
    await page.waitForLoadState("networkidle");
    await expect(page).not.toHaveURL(/error|404/);
  });

  test("language switcher exists", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    // Look for locale switcher (globe icon or language buttons)
    const switcher = page.locator('[aria-label*="language" i], [aria-label*="locale" i], button:has-text("EN"), button:has-text("PT")');
    await expect(switcher.first()).toBeVisible();
  });
});

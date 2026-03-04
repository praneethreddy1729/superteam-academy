import { test, expect } from "@playwright/test";

test.describe("Theme", () => {
  test("dark theme is default", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const html = page.locator("html");
    const className = await html.getAttribute("class") ?? "";
    const dataTheme = await html.getAttribute("data-theme") ?? "";
    expect(className + dataTheme).toMatch(/dark/i);
  });

  test("theme toggle exists", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const toggle = page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]');
    await expect(toggle.first()).toBeVisible();
  });
});

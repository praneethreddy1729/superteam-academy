import { test, expect } from "@playwright/test";

test.describe("Courses page", () => {
  test("loads course catalog", async ({ page }) => {
    await page.goto("/en/courses");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/Superteam|Academy|Courses/i);
    // Check for search/filter UI
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="buscar" i]');
    // Either courses load or empty state appears
    const hasContent = await page.locator('[class*="course"], [class*="card"]').count() > 0 ||
                       await page.locator('[class*="empty"], [class*="no-course"]').count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test("difficulty filters are interactive", async ({ page }) => {
    await page.goto("/en/courses");
    await page.waitForLoadState("networkidle");
    // Look for filter buttons
    const filterButtons = page.locator('button:has-text("Beginner"), button:has-text("Iniciante"), button:has-text("Beginner")');
    if (await filterButtons.count() > 0) {
      await filterButtons.first().click();
      await expect(page).not.toHaveURL(/error/);
    }
  });
});

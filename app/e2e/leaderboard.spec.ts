import { test, expect } from "@playwright/test";

test.describe("Leaderboard", () => {
  test("leaderboard page loads", async ({ page }) => {
    await page.goto("/en/leaderboard");
    await page.waitForLoadState("networkidle");
    await expect(page).not.toHaveURL(/error|404/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("time filter tabs exist", async ({ page }) => {
    await page.goto("/en/leaderboard");
    await page.waitForLoadState("networkidle");
    // Look for All Time / Weekly / Monthly tabs
    const tabs = page.locator('button:has-text("All"), button:has-text("Weekly"), button:has-text("Monthly"), [role="tab"]');
    expect(await tabs.count()).toBeGreaterThan(0);
  });

  test("clicking time filter tab does not error", async ({ page }) => {
    await page.goto("/en/leaderboard");
    await page.waitForLoadState("networkidle");
    const tabs = page.locator('[role="tab"]');
    if (await tabs.count() > 1) {
      await tabs.nth(1).click();
      await expect(page).not.toHaveURL(/error/);
    }
  });
});

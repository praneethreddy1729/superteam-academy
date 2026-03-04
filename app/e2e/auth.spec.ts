import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("signin page loads", async ({ page }) => {
    await page.goto("/en/auth/signin");
    await page.waitForLoadState("networkidle");
    await expect(page).not.toHaveURL(/error/);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("Google sign-in option exists", async ({ page }) => {
    await page.goto("/en/auth/signin");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('button:has-text("Google"), [aria-label*="Google" i]').first()).toBeVisible();
  });

  test("GitHub sign-in option exists", async ({ page }) => {
    await page.goto("/en/auth/signin");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('button:has-text("GitHub"), [aria-label*="GitHub" i]').first()).toBeVisible();
  });

  test("wallet connect option exists on signin page", async ({ page }) => {
    await page.goto("/en/auth/signin");
    await page.waitForLoadState("networkidle");
    const walletBtn = page.locator('button:has-text("Wallet"), button:has-text("Connect"), button:has-text("Solana")');
    await expect(walletBtn.first()).toBeVisible();
  });
});

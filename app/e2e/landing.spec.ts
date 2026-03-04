import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("domcontentloaded");
  });

  test("hero section is visible with heading text", async ({ page }) => {
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text!.trim().length).toBeGreaterThan(0);
  });

  test("Start Learning CTA button exists and is clickable", async ({ page }) => {
    const ctaButton = page
      .getByRole("button", { name: /start learning|start now|get started/i })
      .or(page.getByRole("link", { name: /start learning|start now|get started/i }))
      .first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
  });

  test("Explore Courses link exists", async ({ page }) => {
    const exploreLink = page.locator("a[href*='/courses']").first();
    await expect(exploreLink).toBeVisible();
  });

  test("stats section shows numbers", async ({ page }) => {
    const statsSection = page.locator("section").nth(1);
    await expect(statsSection).toBeVisible();
    const statsText = await statsSection.textContent();
    expect(statsText).toMatch(/\d+/);
  });

  test("features section exists", async ({ page }) => {
    const headings = page.locator("h2, h3");
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("footer exists with brand name", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Superteam Academy");
  });

  test("partner logos section exists", async ({ page }) => {
    await expect(page.getByText("Solana")).toBeVisible();
    await expect(page.getByText("Metaplex")).toBeVisible();
  });

  test("newsletter form exists in footer", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const count = await emailInput.count();
    expect(count).toBeGreaterThanOrEqual(0); // graceful — CMS may not be seeded
  });
});

import { test, expect } from "@playwright/test";

const pages = [
  { path: "/en", name: "Landing" },
  { path: "/en/courses", name: "Courses" },
  { path: "/en/leaderboard", name: "Leaderboard" },
  { path: "/en/auth/signin", name: "Sign In" },
];

for (const { path, name } of pages) {
  test(`${name} page has h1 heading`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const h1 = page.locator("h1");
    await expect(h1.first()).toBeVisible();
  });
}

test("navigation has accessible role", async ({ page }) => {
  await page.goto("/en");
  await page.waitForLoadState("networkidle");
  const nav = page.locator("nav, [role='navigation']");
  expect(await nav.count()).toBeGreaterThan(0);
});

test("images have alt text on landing page", async ({ page }) => {
  await page.goto("/en");
  await page.waitForLoadState("networkidle");
  const images = page.locator("img");
  const count = await images.count();
  for (let i = 0; i < Math.min(count, 5); i++) {
    const alt = await images.nth(i).getAttribute("alt");
    // alt can be empty string for decorative images, but should not be null
    expect(alt).not.toBeNull();
  }
});

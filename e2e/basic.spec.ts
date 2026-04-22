import { test, expect } from "@playwright/test";

declare global {
  interface Window {
    ultratypedInstance?: any;
  }
}

test.describe("UltraTyped.js Cross-Browser Tests", () => {
  test("should render typing animation", async ({ page }) => {
    await page.goto("/");

    // Wait for element to be present
    const typedElement = page.locator("[data-ultratyped]");
    await expect(typedElement).toBeVisible();

    // Check that typing has started (element should have some content)
    await expect(typedElement).not.toHaveText("");
  });

  test("should show cursor when showCursor is true", async ({ page }) => {
    await page.goto("/");

    const cursor = page.locator(".ultratyped-cursor");
    await expect(cursor).toBeVisible();
  });

  test("should handle multiple strings", async ({ page }) => {
    await page.goto("/");

    const typedElement = page.locator("[data-ultratyped]");

    // Wait for at least one string to be typed
    await expect(typedElement).not.toHaveText("");

    // Wait a bit to see if it cycles (with loop enabled)
    await page.waitForTimeout(3000);

    // Element should still be visible
    await expect(typedElement).toBeVisible();
  });

  test("should handle window visibility changes", async ({ page }) => {
    await page.goto("/");

    const typedElement = page.locator("[data-ultratyped]");
    await expect(typedElement).toBeVisible();

    // Simulate visibility change by dispatching visibilitychange event
    await page.evaluate(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(1000);

    // Animation should still work
    await expect(typedElement).toBeVisible();
  });

  test("should handle rapid stop/start calls", async ({ page }) => {
    await page.goto("/");

    const typedElement = page.locator("[data-ultratyped]");
    await expect(typedElement).toBeVisible();

    // Simulate rapid stop/start via page actions
    await page.evaluate(() => {
      if (window.ultratypedInstance) {
        window.ultratypedInstance.stop();
        window.ultratypedInstance.start();
        window.ultratypedInstance.stop();
        window.ultratypedInstance.start();
      }
    });

    await page.waitForTimeout(500);
    await expect(typedElement).toBeVisible();
  });

  test("should handle reset functionality", async ({ page }) => {
    await page.goto("/");

    const typedElement = page.locator("[data-ultratyped]");
    await expect(typedElement).toBeVisible();

    // Click reset button
    await page.click("button");
    await page.waitForTimeout(500);

    // Animation should still work after reset
    await expect(typedElement).toBeVisible();
  });
});

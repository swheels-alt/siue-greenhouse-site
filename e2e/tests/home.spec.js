// Flow 1: find hours and location from the home page (QA plan 3.3, issue #3).
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Run axe on the current page and return only the violations that block a merge (M14).
 * @param {import("@playwright/test").Page} page The page under test.
 * @returns {Promise<object[]>} Serious and critical WCAG 2.1 A and AA violations.
 */
export async function blockingViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations.filter((v) => ["serious", "critical"].includes(v.impact));
}

test("home page has the site heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "SIUE Greenhouse" })).toBeVisible();
});

test("hours and location are on the home page, with no clicks", async ({ page }) => {
  await page.goto("/");
  const visit = page.getByRole("region", { name: "Visit the greenhouse" });
  await expect(visit).toBeVisible();
  await expect(visit.getByText("Monday")).toBeVisible();
  await expect(visit.getByText("Closed").first()).toBeVisible();
  await expect(visit.getByRole("link", { name: /Get directions/ })).toHaveAttribute(
    "target",
    "_blank",
  );
});

test("keyboard users can reach Get directions and see where focus is", async ({ page }) => {
  await page.goto("/");
  const directions = page.getByRole("link", { name: /Get directions/ });
  for (let presses = 0; presses < 10; presses += 1) {
    await page.keyboard.press("Tab");
    if (await directions.evaluate((el) => el === document.activeElement)) break;
  }
  await expect(directions).toBeFocused();
  const outline = await directions.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe("none");
});

test("home page has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto("/");
  expect(await blockingViolations(page)).toEqual([]);
});

test("home page fits a phone screen without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

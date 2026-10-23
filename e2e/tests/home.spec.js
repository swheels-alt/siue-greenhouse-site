// Flow 1 starts here: find hours and location from the home page (QA plan 3.3).
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home page has the site heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "SIUE Greenhouse" })).toBeVisible();
});

test("home page has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const blocking = results.violations.filter((v) => ["serious", "critical"].includes(v.impact));
  expect(blocking).toEqual([]);
});

// Shared accessibility check for the browser flows (QA plan Q2, M14).
import AxeBuilder from "@axe-core/playwright";

/**
 * Run axe on the current page and return only the violations that block a merge (M14).
 * @param {import("@playwright/test").Page} page The page under test.
 * @returns {Promise<object[]>} Serious and critical WCAG 2.0 and 2.1 A and AA violations.
 */
export async function blockingViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations.filter((v) => ["serious", "critical"].includes(v.impact));
}

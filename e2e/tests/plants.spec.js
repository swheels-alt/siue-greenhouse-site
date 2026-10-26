// Flow 2: search plants (QA plan 3.3). Plant search is within 3 clicks of the home page (Q2).
import { expect, test } from "@playwright/test";
import { blockingViolations } from "./axe.js";

test("a visitor finds a plant by name in one click from the home page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Browse plants" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Plant inventory" })).toBeVisible();
  await page.getByLabel("Search by name").fill("flytrap");
  await expect(page.getByText("Showing 1 of 13 plants")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Venus flytrap" })).toBeVisible();
});

test("a visitor filters plants by type", async ({ page }) => {
  await page.goto("/#/plants");
  await page.getByLabel("Type of plant").selectOption("Carnivorous");
  await expect(page.getByText("Showing 3 of 13 plants")).toBeVisible();
});

test("the plants page marks itself as current in the navigation", async ({ page }) => {
  await page.goto("/#/plants");
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: "Plants" })).toHaveAttribute("aria-current", "page");
});

test("plants page has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto("/#/plants");
  await page.getByLabel("Search by name").waitFor();
  expect(await blockingViolations(page)).toEqual([]);
});

test("plants page fits a phone screen without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto("/#/plants");
  await page.getByLabel("Search by name").waitFor();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

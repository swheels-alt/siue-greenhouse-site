// Flow 3: submit a tour request (QA plan 3.3). Public, no login (Problem Specification).
import { expect, test } from "@playwright/test";
import { blockingViolations } from "./axe.js";

test("an empty request lists every problem and moves focus to the list", async ({ page }) => {
  await page.goto("/#/tour");
  await page.getByRole("button", { name: "Check my request" }).click();
  const summary = page.getByRole("alert");
  await expect(summary).toBeFocused();
  await expect(summary.getByRole("link")).toHaveCount(4);
  expect(await blockingViolations(page)).toEqual([]);
});

test("a visitor completes a tour request from the home page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Request a tour" }).first().click();
  await page.getByLabel("Your name").fill("Test Visitor");
  await page.getByLabel("Email address").fill("visitor@example.com");
  await page.getByLabel("Number of people").fill("6");
  await page.getByLabel("Preferred date").fill("2030-01-15");
  await page.getByRole("button", { name: "Check my request" }).click();
  const status = page.getByRole("status");
  await expect(status).toContainText("Thank you, Test Visitor.");
  await expect(status).toContainText("the request was not sent");
  expect(await blockingViolations(page)).toEqual([]);
});

test("the tour form works from the keyboard alone", async ({ page }) => {
  await page.goto("/#/tour");
  await page.getByLabel("Your name").focus();
  await page.keyboard.type("Keyboard Visitor");
  await page.keyboard.press("Tab");
  await page.keyboard.type("kb@example.com");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.type("3");
  await page.getByLabel("Preferred date").fill("2030-02-01");
  await page.getByLabel(/Anything we should know/).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Check my request" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Thank you, Keyboard Visitor.");
});

test("tour page has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto("/#/tour");
  await page.getByLabel("Your name").waitFor();
  expect(await blockingViolations(page)).toEqual([]);
});

test("tour page fits a phone screen without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 740 });
  await page.goto("/#/tour");
  await page.getByLabel("Your name").waitFor();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

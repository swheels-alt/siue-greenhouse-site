// Browser tests for the 6 core flows (QA plan 3.3) with axe accessibility checks (Q2, M14).
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // Never retry: a test that passes on a second try hides a real problem. A flaky test is
  // quarantined the same day and fixed or deleted within 7 days (QA plan 4.3, M12).
  retries: 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:4173",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm --prefix ../frontend run build && npm --prefix ../frontend run preview",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
      },
});

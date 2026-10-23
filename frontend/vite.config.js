// Vite build and Vitest settings. Coverage is reported, never a gate (QA plan 3.3 and 7.1).
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/main.jsx", "src/test/**", "**/*.test.{js,jsx}"],
      reporter: ["text", "json-summary", "cobertura"],
    },
  },
});

import { defineConfig } from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const dataDirectory =
  process.env.FV_E2E_DATA_DIR ||
  mkdtempSync(path.join(tmpdir(), "flavorvoyage-e2e-"));
process.env.FV_E2E_DATA_DIR = dataDirectory;
export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  workers: 1,
  globalTeardown: "./tests/teardown.js",
  use: {
    baseURL: "http://127.0.0.1:5174",
    headless: true,
    launchOptions: process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {},
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "node ../FlavorVoyage-server/scripts/start-test-server.cjs",
      url: "http://127.0.0.1:5003/api/health",
      reuseExistingServer: false,
      env: {
        PORT: "5003",
        NODE_ENV: "development",
        APP_ORIGIN: "http://127.0.0.1:5174",
        DATA_FILE: path.join(dataDirectory, "store.json"),
        ENABLE_DEMO: "true",
      },
    },
    {
      command: "npm run dev -- --host 127.0.0.1 --port 5174 --strictPort",
      url: "http://127.0.0.1:5174",
      reuseExistingServer: false,
      env: { API_TARGET: "http://127.0.0.1:5003" },
    },
  ],
});

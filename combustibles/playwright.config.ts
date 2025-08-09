import { defineConfig, devices } from '@playwright/test';

const E2E_PORT = 5176;
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${E2E_PORT}/combustibles/`;

export default defineConfig({
  testDir: './tests-e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run dev -- --port=5176',
    url: `http://localhost:${E2E_PORT}/combustibles/`,
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});

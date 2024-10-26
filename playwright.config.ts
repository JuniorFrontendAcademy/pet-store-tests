import { defineConfig, devices } from '@playwright/test';

// This should be no less than the minimal viewport
// that your app supports.
// The default viewport varies by browsers:
// https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json
const VIEWPORT = { width: 1300, height: 900 };

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  workers: 6,
  reporter: [['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
  },
  retries: 1,
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: VIEWPORT,
      },
      timeout: 60 * 1000,
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: VIEWPORT,
      },
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        viewport: VIEWPORT,
      },
    },
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: VIEWPORT,
      },
    },
  ],
});

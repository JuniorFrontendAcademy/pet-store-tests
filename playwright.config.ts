import { defineConfig, devices } from '@playwright/test';

// This should be no less than the minimal viewport
// that your app supports.
// The default viewport varies by browsers:
// https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json
const VIEWPORT = { width: 1300, height: 900 };
const WORKERS = 4;

export default defineConfig({
  testDir: './src/tests',
  fullyParallel: true,
  workers: WORKERS,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: {
      mode: 'on',
      size: VIEWPORT,
    },
  },
  retries: 1,
  webServer: {
    // We go one level upwards because the transpiled version
    // will be inside `/tests-out`.
    command: 'npx vite preview --outDir=dist-e2e',
    stdout: 'pipe',
    stderr: 'pipe',
    url: 'http://localhost:3000',
    cwd: '../mock-app',
  },
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

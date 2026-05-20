const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:8765',
    headless: true,
    viewport: { width: 1024, height: 768 },
    actionTimeout: 5_000,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  webServer: {
    command: 'npx http-server docs -p 8765 -s -c-1',
    url: 'http://127.0.0.1:8765/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});

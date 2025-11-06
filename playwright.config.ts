import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 0,
  workers: 4,
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: true,
    viewport: { width: 1920, height: 1080 },
  },
  reporter: [
    ['html', { open: 'never' }], // HTML report
    ['junit', { outputFile: 'results/junit-report.xml' }], // JUnit report
    ['@reportportal/agent-js-playwright', {
      endpoint: 'https://reportportal.epam.com/api/v2',
      project: 'camilo_barajas_personal',
      apiKey: 'camilo-key-epam_W2-R5zc0RpmVIiZc1kin0fLQPQWDLQ_uZnH3jOEe55z6elJ8O6Rp68IWPGfU9IVf',
      launch: 'CloudCalculatorTests',
      description: 'Playwright Cloud Calculator test run',
      attributes: [{ key: 'env', value: 'ci' }]
    }]
  ],
});
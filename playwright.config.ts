import { defineConfig, devices } from '@playwright/test';

/* Plays the real built game (npm run build, then vite preview) at phone, small-phone and desktop sizes. */
export default defineConfig({
  testDir: 'e2e',
  timeout: 120_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:4173', trace: 'off' },
  webServer: { command: 'npm run build && npm run preview', port: 4173, reuseExistingServer: !process.env.CI, timeout: 180_000 },
  projects: [
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: 'small-phone', use: { viewport: { width: 320, height: 568 }, hasTouch: true } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 860 } } },
  ],
});

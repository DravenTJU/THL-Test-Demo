import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Load environment variables.
 * Priority: .env.local > .env
 */
dotenv.config();

/**
 * Playwright configuration file
 *
 * Enterprise-ready testing setup supporting:
 * - Cross-browser testing (Chrome, Firefox, Safari)
 * - Mobile testing (iOS Safari, Android Chrome)
 * - Parallel execution
 * - Retry handling
 * - Visual regression testing
 * - API testing
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Test file matching pattern
  testMatch: '**/*.spec.ts',

  // Timeout configuration
  timeout: 30 * 1000, // 30s per test
  expect: {
    timeout: 10 * 1000, // 10s for assertions
  },

  // Retry configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  // Reporters
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true
    }],
  ],

  // Global configuration
  use: {
    baseURL: process.env.BASE_URL || 'https://booking.maui-rentals.com',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30 * 1000,
    actionTimeout: 10 * 1000,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    userAgent: 'THL-Test-Automation/1.0',
  },

  // Project-specific configuration
  projects: [
    /**
     * Desktop browsers
     */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
          ],
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            'security.fileuri.strict_origin_policy': false,
          },
        },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      },
    },

    /**
     * Mobile browsers
     */
    // {
    //   name: 'mobile-chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //     isMobile: true,
    //     hasTouch: true,
    //   },
    // },

    // {
    //   name: 'mobile-safari',
    //   use: {
    //     ...devices['iPhone 13'],
    //     isMobile: true,
    //     hasTouch: true,
    //   },
    // },

    /**
     * Tablet
     */
    // {
    //   name: 'tablet',
    //   use: {
    //     ...devices['iPad Pro'],
    //     isMobile: true,
    //     hasTouch: true,
    //   },
    // },

    /**
     * API-only tests
     */
    // {
    //   name: 'api',
    //   testMatch: '**/api/**/*.spec.ts',
    //   use: {
    //     baseURL: process.env.API_BASE_URL || 'https://booking.maui-rentals.com',
    //   },
    // },
  ],

  /**
   * Global setup and teardown
   */
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),

  /**
   * Local dev server
   */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});

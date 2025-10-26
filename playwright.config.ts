import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * 加载环境变量
 * 优先级：.env.local > .env
 */
dotenv.config();

/**
 * Playwright配置文件
 *
 * 企业级测试框架配置，支持：
 * - 多浏览器测试（Chrome, Firefox, Safari）
 * - 移动端测试（iOS Safari, Android Chrome）
 * - 并行测试执行
 * - 失败重试机制
 * - 视觉回归测试
 * - API测试
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 测试目录
  testDir: './tests',

  // 测试文件匹配模式
  testMatch: '**/*.spec.ts',

  // 超时配置
  timeout: 30 * 1000, // 单个测试30秒
  expect: {
    timeout: 10 * 1000, // 断言超时10秒
  },

  // 失败重试配置
  fullyParallel: true, // 完全并行执行
  forbidOnly: !!process.env.CI, // CI环境禁止test.only
  retries: process.env.CI ? 2 : 0, // CI环境失败重试2次
  workers: process.env.CI ? 2 : undefined, // CI环境2个worker，本地自动检测

  // 测试报告配置
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'], // 控制台输出
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true
    }],
  ],

  // 全局配置
  use: {
    // 基础URL配置
    baseURL: process.env.BASE_URL || 'https://booking.maui-rentals.com',

    // 浏览器上下文配置
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // 导航超时
    navigationTimeout: 30 * 1000,
    actionTimeout: 10 * 1000,

    // 视觉测试配置
    viewport: { width: 1280, height: 720 },

    // 忽略HTTPS错误
    ignoreHTTPSErrors: true,

    // 用户代理
    userAgent: 'THL-Test-Automation/1.0',
  },

  // 测试项目配置
  projects: [
    /**
     * Desktop浏览器测试
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
     * 移动端测试
     */
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        isMobile: true,
        hasTouch: true,
      },
    },

    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
        isMobile: true,
        hasTouch: true,
      },
    },

    /**
     * Tablet测试
     */
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
        isMobile: true,
        hasTouch: true,
      },
    },

    /**
     * API测试项目（无需浏览器）
     */
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://booking.maui-rentals.com',
      },
    },
  ],

  /**
   * 全局设置和清理
   */
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),

  /**
   * 开发服务器配置（如果需要本地服务器）
   */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});

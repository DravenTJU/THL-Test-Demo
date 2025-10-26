import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';
import { getFutureDate } from '../../utils/helpers';

/**
 * 视觉回归测试套件
 *
 * 使用Playwright的视觉对比功能检测UI变化：
 * - 页面初始状态截图
 * - 表单填充后的状态
 * - 不同浏览器的视觉一致性
 * - 响应式断点
 *
 * @group e2e
 * @group visual
 */

test.describe('Visual Regression Tests', () => {
  test.describe('Desktop Visual Tests @visual @desktop', () => {
    test('should match initial search page layout', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz' });
      await searchPage.waitForPageLoad();

      // 等待所有图片加载
      await page.waitForLoadState('networkidle');

      // 截图对比
      await expect(page).toHaveScreenshot('search-page-initial.png', {
        fullPage: true,
        maxDiffPixels: 100, // 允许100像素差异
      });
    });

    test('should match filled search form', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz' });

      const pickupDate = getFutureDate(30);
      const dropoffDate = getFutureDate(37);

      // 填写表单
      await searchPage.selectPickupLocation('Auckland');
      await searchPage.selectDropoffLocation('Christchurch');
      await searchPage.selectPickupDate(pickupDate);
      await searchPage.selectDropoffDate(dropoffDate);

      // 等待UI更新
      await page.waitForTimeout(1000);

      // 截图对比
      await expect(page).toHaveScreenshot('search-form-filled.png', {
        fullPage: false,
        maxDiffPixelRatio: 0.05, // 允许5%差异
      });
    });

    test('should match search button hover state', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz' });

      // 查找搜索按钮
      const searchButton = page.locator(
        'button[type="submit"]:has-text("Search"), button:has-text("Find")'
      ).first();

      // Hover到按钮上
      await searchButton.hover();
      await page.waitForTimeout(500);

      // 截图对比
      await expect(searchButton).toHaveScreenshot('search-button-hover.png');
    });
  });

  test.describe('Mobile Visual Tests @visual @mobile', () => {
    test.use({
      viewport: { width: 375, height: 667 },
      isMobile: true,
    });

    test('should match mobile layout', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForPageLoad();

      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('search-page-mobile.png', {
        fullPage: true,
        maxDiffPixels: 150,
      });
    });

    test('should match mobile form filled', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      const pickupDate = getFutureDate(30);
      const dropoffDate = getFutureDate(37);

      try {
        await searchPage.performSearch({
          pickupLocation: 'Auckland',
          dropoffLocation: 'Christchurch',
          pickupDate,
          dropoffDate,
        });
      } catch (error) {
        console.log('Search form interaction skipped:', error);
      }

      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('search-form-mobile-filled.png', {
        fullPage: true,
        maxDiffPixels: 150,
      });
    });
  });

  test.describe('Responsive Breakpoint Tests @visual @responsive', () => {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'large', width: 1920, height: 1080 },
    ];

    breakpoints.forEach(({ name, width, height }) => {
      test(`should match ${name} layout (${width}x${height})`, async ({ page }) => {
        await page.setViewportSize({ width, height });

        const searchPage = new SearchPage(page);
        await searchPage.navigateToSearchPage({ cc: 'nz' });
        await searchPage.waitForPageLoad();

        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot(`search-page-${name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.1,
        });
      });
    });
  });

  test.describe('Component Visual Tests @visual @component', () => {
    test('should match location input component', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz' });

      const pickupInput = page.locator(
        'input[name="pickupLocation"], [data-testid="pickup-location"]'
      ).first();

      await expect(pickupInput).toHaveScreenshot('location-input.png');
    });

    test('should match date picker component', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz' });

      const dateInput = page.locator(
        'input[name="pickupDate"], [data-testid="pickup-date"]'
      ).first();

      // 点击打开日期选择器
      await dateInput.click();
      await page.waitForTimeout(1000);

      // 检查日期选择器是否出现
      const datePicker = page.locator('.date-picker, .calendar, [role="dialog"]');
      const isVisible = await datePicker.isVisible().catch(() => false);

      if (isVisible) {
        await expect(datePicker).toHaveScreenshot('date-picker.png', {
          maxDiffPixels: 200,
        });
      }
    });
  });

  test.describe('Cross-Browser Visual Consistency @visual @crossbrowser', () => {
    test('should look consistent across browsers', async ({ page, browserName }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz' });
      await searchPage.waitForPageLoad();

      await page.waitForLoadState('networkidle');

      console.log(`Testing visual consistency in: ${browserName}`);

      // 每个浏览器独立的baseline
      await expect(page).toHaveScreenshot(`search-page-${browserName}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.1,
      });
    });
  });

  test.describe('Dark Mode Visual Tests @visual @theme', () => {
    test('should match dark mode if supported', async ({ page }) => {
      // 设置深色模式偏好
      await page.emulateMedia({ colorScheme: 'dark' });

      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz' });
      await searchPage.waitForPageLoad();

      await page.waitForLoadState('networkidle');

      // 检查是否应用了深色模式
      const isDarkMode = await page.evaluate(() => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      });

      console.log('Dark mode applied:', isDarkMode);

      await expect(page).toHaveScreenshot('search-page-dark.png', {
        fullPage: true,
        maxDiffPixels: 200,
      });
    });
  });

  test.describe('Animation States @visual @animation', () => {
    test('should capture loading state', async ({ page }) => {
      const searchPage = new SearchPage(page);

      // 不等待完全加载，捕获加载状态
      await page.goto('https://booking.maui-rentals.com/?cc=nz', {
        waitUntil: 'domcontentloaded',
      });

      // 快速截图（可能捕获到加载动画）
      await page.waitForTimeout(500);

      const loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]');
      const isVisible = await loadingIndicator.isVisible().catch(() => false);

      if (isVisible) {
        await expect(loadingIndicator).toHaveScreenshot('loading-spinner.png');
      }
    });
  });

  test.describe('Error State Visual Tests @visual @error', () => {
    test('should match error message display', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz' });

      // 尝试触发验证错误
      await searchPage.clickSearch();
      await page.waitForTimeout(1000);

      // 检查错误消息
      const errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
      const hasError = await errorMessage.isVisible().catch(() => false);

      if (hasError) {
        await expect(errorMessage).toHaveScreenshot('error-message.png');
      }
    });
  });
});

/**
 * 可访问性视觉对比
 * 确保高对比度模式下的可读性
 */
test.describe('Accessibility Visual Tests @visual @a11y', () => {
  test('should be readable in high contrast mode', async ({ page }) => {
    // 强制高对比度模式
    await page.emulateMedia({ forcedColors: 'active' });

    const searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForPageLoad();

    await expect(page).toHaveScreenshot('search-page-high-contrast.png', {
      fullPage: true,
      maxDiffPixels: 300,
    });
  });

  test('should maintain layout with large fonts', async ({ page }) => {
    // 增大字体
    await page.addStyleTag({
      content: '* { font-size: 200% !important; }',
    });

    const searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForPageLoad();

    await expect(page).toHaveScreenshot('search-page-large-fonts.png', {
      fullPage: true,
      maxDiffPixels: 500,
    });
  });
});

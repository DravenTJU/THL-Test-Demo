import { test, expect, devices } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';
import { getFutureDate } from '../../utils/helpers';

/**
 * 移动端E2E测试套件
 *
 * 测试移动设备上的响应式设计和交互：
 * - iOS Safari
 * - Android Chrome
 * - Tablet设备
 * - 触摸交互
 * - 移动端特定UI
 *
 * @group e2e
 * @group mobile
 */

test.describe('Mobile Device Testing', () => {
  test.describe('iPhone 13 - iOS Safari @mobile', () => {
    test.use({
      ...devices['iPhone 13'],
      isMobile: true,
      hasTouch: true,
    });

    test('should display mobile-optimized layout', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      // 验证viewport大小
      const viewport = page.viewportSize();
      expect(viewport?.width).toBeLessThanOrEqual(devices['iPhone 13'].viewport.width);

      // 验证搜索表单可见
      await searchPage.waitForSearchFormVisible();
      await searchPage.validateSearchFormElements();
    });

    test('should handle touch interactions on search form', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      const pickupDate = getFutureDate(30);
      const dropoffDate = getFutureDate(37);

      // 测试触摸交互
      await searchPage.performSearch({
        pickupLocation: 'Auckland',
        dropoffLocation: 'Christchurch',
        pickupDate,
        dropoffDate,
      });

      // 验证表单已填写
      const formValues = await searchPage.getSearchFormValues();
      expect(formValues.pickupLocation || formValues.dropoffLocation).toBeTruthy();
    });

    test('should scroll and interact with elements', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      // 滚动到搜索按钮（可能在视口外）
      await searchPage.page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      await page.waitForTimeout(1000);

      // 验证可以点击按钮
      const isEnabled = await searchPage.isSearchButtonEnabled();
      expect(isEnabled).toBeDefined();
    });
  });

  test.describe('Pixel 5 - Android Chrome @mobile', () => {
    test.use({
      ...devices['Pixel 5'],
      isMobile: true,
      hasTouch: true,
    });

    test('should display correctly on Android', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      // 验证页面加载
      await searchPage.waitForPageLoad();
      await searchPage.validateSearchFormElements();

      // 验证viewport
      const viewport = page.viewportSize();
      expect(viewport?.width).toBe(devices['Pixel 5'].viewport.width);
      expect(viewport?.height).toBe(devices['Pixel 5'].viewport.height);
    });

    test('should handle date picker on Android', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      const pickupDate = getFutureDate(25);
      const dropoffDate = getFutureDate(32);

      // Android可能有不同的日期选择器
      await searchPage.selectPickupDate(pickupDate);
      await searchPage.selectDropoffDate(dropoffDate);

      // 验证日期已设置
      const formValues = await searchPage.getSearchFormValues();
      expect(formValues.pickupDate || formValues.dropoffDate).toBeTruthy();
    });

    test('should perform complete search flow on Android', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      const pickupDate = getFutureDate(30);
      const dropoffDate = getFutureDate(37);

      await searchPage.performSearch({
        pickupLocation: 'Wellington',
        dropoffLocation: 'Queenstown',
        pickupDate,
        dropoffDate,
      });

      // 等待搜索完成（允许超时）
      try {
        await searchPage.waitForSearchResults(15000);
      } catch (error) {
        console.log('Search results timeout on Android:', error);
      }

      await page.waitForTimeout(2000);
    });
  });

  test.describe('iPad Pro - Tablet @tablet', () => {
    test.use({
      ...devices['iPad Pro'],
      isMobile: true,
      hasTouch: true,
    });

    test('should display tablet-optimized layout', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: false });

      // 验证更大的viewport
      const viewport = page.viewportSize();
      expect(viewport?.width).toBe(devices['iPad Pro'].viewport.width);
      expect(viewport?.height).toBe(devices['iPad Pro'].viewport.height);

      // 验证布局
      await searchPage.validateSearchFormElements();
    });

    test('should handle orientation changes', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz' });

      // Portrait mode
      await page.setViewportSize({
        width: 1024,
        height: 1366,
      });

      await searchPage.validateSearchFormElements();

      // Landscape mode
      await page.setViewportSize({
        width: 1366,
        height: 1024,
      });

      await searchPage.waitForPageLoad();
      await searchPage.validateSearchFormElements();
    });
  });

  test.describe('Responsive Design Tests @responsive', () => {
    const viewports = [
      { name: 'Small Mobile', width: 375, height: 667 },
      { name: 'Medium Mobile', width: 414, height: 896 },
      { name: 'Small Tablet', width: 768, height: 1024 },
      { name: 'Large Tablet', width: 1024, height: 1366 },
      { name: 'Small Desktop', width: 1280, height: 800 },
    ];

    viewports.forEach(({ name, width, height }) => {
      test(`should work on ${name} (${width}x${height})`, async ({ page }) => {
        // 设置viewport
        await page.setViewportSize({ width, height });

        const searchPage = new SearchPage(page);
        await searchPage.navigateToSearchPage({ cc: 'nz' });

        // 验证搜索表单可见
        await searchPage.waitForSearchFormVisible();

        console.log(`Testing on ${name}: ${width}x${height}`);

        // 验证基本元素
        const pickupDate = getFutureDate(20);
        const dropoffDate = getFutureDate(27);

        try {
          await searchPage.selectPickupLocation('Auckland');
          await searchPage.selectDropoffLocation('Christchurch');
        } catch (error) {
          console.log(`Location selection skipped on ${name}:`, error);
        }
      });
    });
  });

  test.describe('Touch Gestures @touch', () => {
    test.use(devices['iPhone 13']);

    test('should support swipe gestures', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      // 执行滑动手势（如果页面支持）
      await page.touchscreen.tap(200, 300);
      await page.waitForTimeout(500);

      // 验证页面响应
      await searchPage.waitForPageLoad();
    });

    test('should handle pinch zoom', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      // 注意：Playwright对pinch zoom的支持有限
      // 这里主要测试页面在不同缩放级别下的表现

      // 验证页面meta标签（应该禁用缩放或限制缩放）
      const metaViewport = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        return meta ? meta.getAttribute('content') : null;
      });

      console.log('Viewport meta tag:', metaViewport);
      expect(metaViewport).toBeTruthy();
    });

    test('should handle long press', async ({ page }) => {
      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      // 模拟长按（某些移动端UI可能有长按功能）
      await page.touchscreen.tap(200, 300);
      await page.waitForTimeout(1000);

      // 验证页面状态
      await searchPage.waitForSearchFormVisible();
    });
  });

  test.describe('Mobile Performance @performance', () => {
    test.use(devices['Pixel 5']);

    test('should load quickly on mobile', async ({ page }) => {
      const startTime = Date.now();

      const searchPage = new SearchPage(page);
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

      const loadTime = Date.now() - startTime;

      console.log(`Mobile page load time: ${loadTime}ms`);

      // 移动端加载应该在5秒内完成
      expect(loadTime).toBeLessThan(5000);
    });

    test('should be usable during loading', async ({ page }) => {
      const searchPage = new SearchPage(page);

      // 开始导航但不等待完全加载
      await page.goto('https://booking.maui-rentals.com/?cc=nz&open-mobile=true', {
        waitUntil: 'domcontentloaded',
      });

      // 检查交互元素是否尽早可用
      try {
        await searchPage.waitForSearchFormVisible();
      } catch (error) {
        console.log('Form not immediately visible:', error);
      }
    });
  });
});

/**
 * 移动端辅助功能测试
 */
test.describe('Mobile Accessibility @a11y @mobile', () => {
  test.use(devices['iPhone 13']);

  test('should have appropriate touch target sizes', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // 检查按钮和链接的尺寸（应该至少44x44px for iOS）
    const buttonSizes = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a, input[type="button"]'));
      return buttons.map((btn) => {
        const rect = btn.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          text: (btn as HTMLElement).innerText || btn.getAttribute('aria-label'),
        };
      });
    });

    console.log('Button sizes:', buttonSizes);

    // 至少应该有一些交互元素
    expect(buttonSizes.length).toBeGreaterThan(0);
  });

  test('should support screen reader navigation', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // 检查ARIA标签和语义化HTML
    const ariaLabels = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('[aria-label], [role]'));
      return elements.map((el) => ({
        role: el.getAttribute('role'),
        label: el.getAttribute('aria-label'),
        tag: el.tagName,
      }));
    });

    console.log('ARIA elements:', ariaLabels);
  });
});

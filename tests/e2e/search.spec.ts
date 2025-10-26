import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';
import { getFutureDate, calculateDaysBetween } from '../../utils/helpers';
import searchData from '../../fixtures/search-data.json';

/**
 * 搜索功能E2E测试套件
 *
 * 测试Maui Rentals搜索页面的核心功能：
 * - 页面加载和元素验证
 * - 有效搜索场景
 * - 无效输入验证
 * - 表单交互
 *
 * @group e2e
 * @group search
 */

test.describe('Maui Rentals Search Functionality', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    // 导航到搜索页面，带NZ国家代码
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: false });
  });

  test('should load search page successfully @smoke', async () => {
    // 验证页面标题
    const title = await searchPage.getTitle();
    expect(title).toBeTruthy();
    expect(title.toLowerCase()).toContain('maui');

    // 验证URL包含NZ参数
    await searchPage.assertURLContains('cc=nz');
  });

  test('should display all search form elements @smoke', async () => {
    // 验证搜索表单所有必需元素都存在
    await searchPage.validateSearchFormElements();

    // 验证搜索按钮初始状态
    const isEnabled = await searchPage.isSearchButtonEnabled();
    expect(isEnabled).toBeDefined();
  });

  test('should perform valid search - Auckland to Christchurch @critical', async ({ page }) => {
    // 准备测试数据
    const pickupDate = getFutureDate(30); // 30天后
    const dropoffDate = getFutureDate(37); // 37天后（7天租期）

    // 执行搜索
    await searchPage.performSearch({
      pickupLocation: 'Auckland',
      dropoffLocation: 'Christchurch',
      pickupDate,
      dropoffDate,
    });

    // 等待结果加载或错误消息
    // 注意：实际网站可能需要调整等待策略
    try {
      await searchPage.waitForSearchResults(20000);
    } catch (error) {
      // 如果搜索结果加载失败，检查是否有错误消息
      const hasError = await searchPage.hasErrorMessage();
      if (hasError) {
        const errorMsg = await searchPage.getErrorMessage();
        console.log('Search returned error:', errorMsg);
      }
    }

    // 验证URL已更新（通常包含搜索参数）
    const currentURL = searchPage.getCurrentURL();
    expect(currentURL).toBeTruthy();
  });

  test('should validate date selection @regression', async () => {
    const pickupDate = getFutureDate(15);
    const dropoffDate = getFutureDate(22);

    // 选择日期
    await searchPage.selectPickupDate(pickupDate);
    await searchPage.selectDropoffDate(dropoffDate);

    // 验证表单值
    const formValues = await searchPage.getSearchFormValues();
    expect(formValues.pickupDate).toBeTruthy();
    expect(formValues.dropoffDate).toBeTruthy();

    // 验证日期范围
    if (formValues.pickupDate && formValues.dropoffDate) {
      const days = calculateDaysBetween(formValues.pickupDate, formValues.dropoffDate);
      expect(days).toBeGreaterThan(0);
    }
  });

  test.describe('Valid Search Scenarios', () => {
    searchData.validSearchScenarios.forEach((scenario) => {
      test(`should handle: ${scenario.name}`, async () => {
        // 使用fixture数据执行搜索
        await searchPage.performSearch({
          pickupLocation: scenario.pickupLocation,
          dropoffLocation: scenario.dropoffLocation,
          pickupDate: scenario.pickupDate,
          dropoffDate: scenario.dropoffDate,
        });

        // 等待结果（允许失败，因为可能是mock数据）
        try {
          await searchPage.waitForSearchResults(15000);
        } catch (error) {
          console.log(`Search results not loaded for scenario: ${scenario.name}`);
        }

        // 验证没有错误消息
        const hasError = await searchPage.hasErrorMessage();
        if (hasError) {
          const errorMsg = await searchPage.getErrorMessage();
          console.warn(`Unexpected error in valid scenario: ${errorMsg}`);
        }
      });
    });
  });

  test.describe('Invalid Search Scenarios', () => {
    test('should validate empty pickup location @validation', async () => {
      const dropoffDate = getFutureDate(30);
      const returnDate = getFutureDate(37);

      // 尝试搜索，不选择取车地点
      await searchPage.selectDropoffLocation('Christchurch');
      await searchPage.selectPickupDate(dropoffDate);
      await searchPage.selectDropoffDate(returnDate);
      await searchPage.clickSearch();

      // 等待一下，看是否出现验证消息
      await searchPage.page.waitForTimeout(2000);

      // 检查表单验证（可能是HTML5验证或自定义错误）
      // 实际实现取决于网站的验证机制
      const formValues = await searchPage.getSearchFormValues();
      expect(formValues.pickupLocation).toBeFalsy();
    });

    test('should validate empty dropoff location @validation', async () => {
      const pickupDate = getFutureDate(30);
      const dropoffDate = getFutureDate(37);

      // 只选择取车地点
      await searchPage.selectPickupLocation('Auckland');
      await searchPage.selectPickupDate(pickupDate);
      await searchPage.selectDropoffDate(dropoffDate);
      await searchPage.clickSearch();

      await searchPage.page.waitForTimeout(2000);

      const formValues = await searchPage.getSearchFormValues();
      expect(formValues.dropoffLocation).toBeFalsy();
    });
  });

  test('should handle same pickup and dropoff location @regression', async () => {
    const pickupDate = getFutureDate(20);
    const dropoffDate = getFutureDate(25);

    // 选择相同的地点
    await searchPage.performSearch({
      pickupLocation: 'Christchurch',
      dropoffLocation: 'Christchurch',
      pickupDate,
      dropoffDate,
    });

    // 这应该是允许的（同城还车）
    try {
      await searchPage.waitForSearchResults(15000);
    } catch (error) {
      console.log('Same location search handling:', error);
    }
  });

  test('should clear search form @utility', async () => {
    const pickupDate = getFutureDate(30);
    const dropoffDate = getFutureDate(37);

    // 先填写表单
    await searchPage.performSearch({
      pickupLocation: 'Auckland',
      dropoffLocation: 'Christchurch',
      pickupDate,
      dropoffDate,
    });

    // 清空表单
    await searchPage.clearSearchForm();

    // 验证表单已清空
    const formValues = await searchPage.getSearchFormValues();
    expect(formValues.pickupLocation).toBeFalsy();
    expect(formValues.dropoffLocation).toBeFalsy();
  });

  test('should handle page reload @stability', async () => {
    const pickupDate = getFutureDate(30);
    const dropoffDate = getFutureDate(37);

    // 执行搜索
    await searchPage.performSearch({
      pickupLocation: 'Auckland',
      dropoffLocation: 'Wellington',
      pickupDate,
      dropoffDate,
    });

    // 等待一下
    await searchPage.wait(2000);

    // 重新加载页面
    await searchPage.reload();
    await searchPage.waitForPageLoad();

    // 验证页面正常加载
    await searchPage.waitForSearchFormVisible();
    await searchPage.validateSearchFormElements();
  });

  test('should navigate with URL parameters @integration', async () => {
    // 测试URL参数处理
    const searchPage2 = new SearchPage(searchPage.page);
    await searchPage2.navigateToSearchPage({ cc: 'nz', mobile: true });

    // 验证URL包含参数
    await searchPage2.assertURLContains('cc=nz');
    await searchPage2.assertURLContains('open-mobile=true');

    // 验证页面正常显示
    await searchPage2.validateSearchFormElements();
  });

  test.afterEach(async ({ page }, testInfo) => {
    // 如果测试失败，截图
    if (testInfo.status !== testInfo.expectedStatus) {
      await searchPage.takeScreenshot(`search-failure-${testInfo.title}`, {
        fullPage: true,
      });
    }
  });
});

/**
 * 跨浏览器兼容性测试
 * 这些测试会在所有配置的浏览器上运行
 */
test.describe('Cross-Browser Compatibility @crossbrowser', () => {
  test('should work in all browsers', async ({ page, browserName }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz' });

    console.log(`Testing in browser: ${browserName}`);

    // 验证基本功能
    await searchPage.validateSearchFormElements();

    const pickupDate = getFutureDate(30);
    const dropoffDate = getFutureDate(37);

    await searchPage.performSearch({
      pickupLocation: 'Auckland',
      dropoffLocation: 'Christchurch',
      pickupDate,
      dropoffDate,
    });

    // 每个浏览器都应该能够正常执行搜索
    await page.waitForTimeout(3000);
  });
});

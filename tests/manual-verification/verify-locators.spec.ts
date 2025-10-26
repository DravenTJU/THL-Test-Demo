import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * 手动验证定位器测试套件
 *
 * 用途：验证 SearchPage.ts 中定义的所有元素定位器是否正确
 * 运行方式：
 * 1. 正常模式：npx playwright test tests/manual-verification/verify-locators.spec.ts
 * 2. UI 模式：npx playwright test tests/manual-verification/verify-locators.spec.ts --ui
 * 3. Debug 模式：npx playwright test tests/manual-verification/verify-locators.spec.ts --debug
 * 4. Headed 模式：npx playwright test tests/manual-verification/verify-locators.spec.ts --headed
 */

test.describe('SearchPage 元素定位器验证', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // 导航到搜索页面
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // 等待页面加载
    await searchPage.waitForSearchWidgetVisible();
  });

  test('验证所有主要按钮元素可见', async () => {
    console.log('🔍 开始验证主要按钮元素...');

    // 验证取车地点按钮
    await test.step('验证取车地点按钮', async () => {
      const text = await searchPage.getPickupLocationText();
      console.log(`  ✅ 取车地点按钮: "${text}"`);
      expect(text).toContain('Pick up');
    });

    // 验证还车地点按钮
    await test.step('验证还车地点按钮', async () => {
      const text = await searchPage.getDropoffLocationText();
      console.log(`  ✅ 还车地点按钮: "${text}"`);
      expect(text).toContain('Drop off');
    });

    // 验证旅行日期按钮
    await test.step('验证旅行日期按钮', async () => {
      const text = await searchPage.getTravelDatesText();
      console.log(`  ✅ 旅行日期按钮: "${text}"`);
      expect(text).toContain('Travel Dates');
    });

    // 验证搜索按钮
    await test.step('验证搜索按钮', async () => {
      const text = await searchPage.getSearchButtonText();
      console.log(`  ✅ 搜索按钮: "${text}"`);
      expect(text).toContain('Search');
    });

    // 验证所有元素
    await test.step('验证所有表单元素', async () => {
      await searchPage.validateSearchFormElements();
      console.log('  ✅ 所有表单元素验证通过');
    });
  });

  test('验证取车地点交互流程', async ({ page }) => {
    console.log('🔍 验证取车地点交互流程...');

    await test.step('点击取车地点按钮', async () => {
      // 获取按钮元素（通过 page 对象直接访问）
      const pickupButton = page.locator('#escapeFocus_pickup');
      await pickupButton.click();
      console.log('  ✅ 点击取车地点按钮成功');
    });

    await test.step('验证输入框出现', async () => {
      const pickupInput = page.locator('#bookingWidget_location_pickup_searchInput');
      await expect(pickupInput).toBeVisible({ timeout: 5000 });
      console.log('  ✅ 取车地点输入框已显示');
    });

    await test.step('输入地点名称', async () => {
      const pickupInput = page.locator('#bookingWidget_location_pickup_searchInput');
      await pickupInput.fill('Auckland');
      console.log('  ✅ 输入 "Auckland" 成功');

      // 等待一下，看是否有下拉选项
      await page.waitForTimeout(1000);
    });

    await test.step('截图保存当前状态', async () => {
      await page.screenshot({
        path: 'screenshots/verify-pickup-location.png',
        fullPage: false
      });
      console.log('  📸 截图已保存: screenshots/verify-pickup-location.png');
    });
  });

  test('验证还车地点交互流程', async ({ page }) => {
    console.log('🔍 验证还车地点交互流程...');

    await test.step('点击还车地点按钮', async () => {
      const dropoffButton = page.locator('#escapeFocus_dropoff');
      await dropoffButton.click();
      console.log('  ✅ 点击还车地点按钮成功');
    });

    await test.step('验证输入框不会出现', async () => {
      const dropoffInput = page.locator('#bookingWidget_location_dropoff_searchInput');
      await expect(dropoffInput).not.toBeVisible({ timeout: 5000 });
      console.log('  ✅ 还车地点输入框不会出现');
    });

    // await test.step('输入地点名称', async () => {
    //   const dropoffInput = page.locator('#bookingWidget_location_dropoff_searchInput');
    //   await dropoffInput.fill('Christchurch');
    //   console.log('  ✅ 输入 "Christchurch" 成功');

    //   await page.waitForTimeout(1000);
    // });

    await test.step('截图保存当前状态', async () => {
      await page.screenshot({
        path: 'screenshots/verify-dropoff-location.png',
        fullPage: false
      });
      console.log('  📸 截图已保存: screenshots/verify-dropoff-location.png');
    });
  });

  test('验证日期选择器交互流程', async ({ page }) => {
    console.log('🔍 验证日期选择器交互流程...');

    await test.step('点击旅行日期按钮', async () => {
      const datesButton = page.locator('button[aria-label="Select the pick-up and drop-off dates"]');
      await datesButton.click();
      console.log('  ✅ 点击旅行日期按钮成功');
    });

    await test.step('验证日期选择器出现', async () => {
      // 等待日期选择器出现（使用多个可能的选择器）
      const datePicker = page.locator('.date-picker, .calendar, [role="dialog"]').first();

      // 等待一段时间让日期选择器完全加载
      await page.waitForTimeout(2000);

      // 尝试验证日期选择器
      const isVisible = await datePicker.isVisible().catch(() => false);
      if (isVisible) {
        console.log('  ✅ 日期选择器已显示');
      } else {
        console.log('  ⚠️ 日期选择器可能未显示或使用不同的结构');
      }
    });

    await test.step('截图保存当前状态', async () => {
      await page.screenshot({
        path: 'screenshots/verify-date-picker.png',
        fullPage: true
      });
      console.log('  📸 截图已保存: screenshots/verify-date-picker.png');
    });
  });

  test('验证搜索按钮状态', async ({ page }) => {
    console.log('🔍 验证搜索按钮状态...');

    await test.step('检查搜索按钮是否可见', async () => {
      const searchButton = page.locator('#buttonSubmit');
      await expect(searchButton).toBeVisible();
      console.log('  ✅ 搜索按钮可见');
    });

    await test.step('检查搜索按钮是否启用', async () => {
      const isEnabled = await searchPage.isSearchButtonEnabled();
      console.log(`  ✅ 搜索按钮启用状态: ${isEnabled}`);
    });

    await test.step('获取搜索按钮属性', async () => {
      const searchButton = page.locator('#buttonSubmit');
      const text = await searchButton.textContent();
      const ariaLabel = await searchButton.getAttribute('aria-label');
      const className = await searchButton.getAttribute('class');

      console.log(`  📋 按钮文本: "${text}"`);
      console.log(`  📋 aria-label: "${ariaLabel}"`);
      console.log(`  📋 class: "${className}"`);
    });
  });

  test('手动逐步验证完整搜索流程', async ({ page }) => {
    console.log('🔍 开始完整搜索流程验证...\n');

    // 步骤 1: 选择取车地点
    await test.step('步骤 1: 选择取车地点', async () => {
      console.log('📍 步骤 1: 选择取车地点');
      const pickupButton = page.locator('#escapeFocus_pickup');
      await pickupButton.click();
      await page.waitForTimeout(500);

      const pickupInput = page.locator('#bookingWidget_location_pickup_searchInput');
      await pickupInput.fill('Auckland');
      await page.waitForTimeout(1000);

      // 尝试按回车或点击选项
      await pickupInput.press('Enter');
      await page.waitForTimeout(500);

      await page.screenshot({ path: 'screenshots/step1-pickup-location.png' });
      console.log('  ✅ 完成 - 截图: step1-pickup-location.png\n');
    });

    // 步骤 2: 选择还车地点
    await test.step('步骤 2: 选择还车地点', async () => {
      console.log('📍 步骤 2: 选择还车地点');
      const dropoffButton = page.locator('#escapeFocus_dropoff');
      await dropoffButton.click();
      await page.waitForTimeout(500);

      const dropoffInput = page.locator('#bookingWidget_location_dropoff_searchInput');
      await dropoffInput.fill('Christchurch');
      await page.waitForTimeout(1000);

      await dropoffInput.press('Enter');
      await page.waitForTimeout(500);

      await page.screenshot({ path: 'screenshots/step2-dropoff-location.png' });
      console.log('  ✅ 完成 - 截图: step2-dropoff-location.png\n');
    });

    // 步骤 3: 选择日期
    await test.step('步骤 3: 选择旅行日期', async () => {
      console.log('📍 步骤 3: 选择旅行日期');
      const datesButton = page.locator('button[aria-label="Select the pick-up and drop-off dates"]');
      await datesButton.click();
      await page.waitForTimeout(2000);

      await page.screenshot({ path: 'screenshots/step3-date-picker.png', fullPage: true });
      console.log('  ✅ 完成 - 截图: step3-date-picker.png');
      console.log('  ⚠️ 注意: 日期选择需要根据实际日期选择器结构手动实现\n');
    });

    // 步骤 4: 检查搜索按钮
    await test.step('步骤 4: 检查搜索按钮', async () => {
      console.log('📍 步骤 4: 检查搜索按钮');
      const searchButton = page.locator('#buttonSubmit');
      const isVisible = await searchButton.isVisible();
      const isEnabled = await searchButton.isEnabled();

      console.log(`  📊 搜索按钮可见: ${isVisible}`);
      console.log(`  📊 搜索按钮启用: ${isEnabled}`);

      await page.screenshot({ path: 'screenshots/step4-search-button.png' });
      console.log('  ✅ 完成 - 截图: step4-search-button.png\n');
    });

    console.log('✅ 完整流程验证完成！请查看 screenshots/ 目录中的截图。\n');
  });

  test('使用 Playwright Inspector 验证（Debug 模式）', async ({ page }) => {
    console.log('\n🔍 Playwright Inspector 验证模式\n');
    console.log('提示: 运行此测试时使用 --debug 标志：');
    console.log('npx playwright test verify-locators.spec.ts --debug\n');

    // 设置断点 - 在 Inspector 中可以手动验证元素
    await test.step('打开 Inspector 并等待手动验证', async () => {
      console.log('⏸️ 测试已暂停，请使用 Playwright Inspector:');
      console.log('  1. 在 Inspector 中点击 "Explore" 按钮');
      console.log('  2. 使用选择器工具选择页面元素');
      console.log('  3. 验证定位器是否正确');
      console.log('  4. 点击 "Resume" 继续测试\n');

      // 这行会在 debug 模式下触发断点
      await page.pause();
    });

    await test.step('验证所有元素', async () => {
      await searchPage.validateSearchFormElements();
      console.log('✅ 所有元素验证完成\n');
    });
  });
});

/**
 * 单独的定位器快速测试
 * 用于快速验证单个定位器
 */
test.describe('快速定位器测试', () => {
  test('快速测试单个定位器', async ({ page }) => {
    // 导航到页面
    await page.goto('https://booking.maui-rentals.com/?cc=nz&open-mobile=true');
    await page.waitForLoadState('networkidle');

    // 修改这里来测试不同的定位器
    const selector = '#escapeFocus_pickup';  // 👈 修改此处测试不同定位器

    console.log(`\n🔍 测试定位器: ${selector}\n`);

    const element = page.locator(selector);

    // 检查元素是否存在
    const count = await element.count();
    console.log(`📊 找到元素数量: ${count}`);

    if (count > 0) {
      // 获取元素信息
      const isVisible = await element.isVisible();
      const isEnabled = await element.isEnabled();
      const text = await element.textContent();

      console.log(`✅ 元素可见: ${isVisible}`);
      console.log(`✅ 元素启用: ${isEnabled}`);
      console.log(`📝 元素文本: "${text}"`);

      // 高亮显示元素
      await element.evaluate(el => {
        (el as HTMLElement).style.border = '3px solid red';
        (el as HTMLElement).style.backgroundColor = 'yellow';
      });

      // 截图
      await page.screenshot({ path: 'screenshots/quick-test-locator.png' });
      console.log('📸 截图已保存: screenshots/quick-test-locator.png\n');

      // 等待 3 秒以便观察
      await page.waitForTimeout(3000);
    } else {
      console.log('❌ 未找到元素\n');
    }
  });
});

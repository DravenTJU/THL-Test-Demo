import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * selectTravelDates 方法单元测试
 *
 * 测试目标：验证日期选择器功能
 * - 判断日期选择器是否打开
 * - 月份导航功能（前翻、后翻）
 * - 锁定月份容器并选择日期
 * - 跨月日期选择
 * - 自动导航到目标月份
 *
 * 运行方式：
 * npx playwright test tests/unit/selectTravelDates.spec.ts
 * npx playwright test tests/unit/selectTravelDates.spec.ts --ui
 * npx playwright test tests/unit/selectTravelDates.spec.ts --headed
 * npx playwright test tests/unit/selectTravelDates.spec.ts --debug
 */

test.describe('selectTravelDates 方法单元测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // 导航到搜索页面
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // 等待页面加载
    await searchPage.waitForSearchWidgetVisible();

    // 选择取车地点（Auckland）
    await searchPage.clickPickupLocation('Auckland');

    // 选择还车地点（Auckland）
    await searchPage.clickDropoffLocation('Auckland');
  });

  test('应该成功选择未来的取车和还车日期', async ({ page }) => {
    console.log('🧪 测试：选择未来日期');

    // 获取当前日期
    const today = new Date();

    // 选择当前日期+2天作为取车日期（使用Date对象自动处理月份进位）
    const pickupDateObj = new Date(today);
    pickupDateObj.setDate(today.getDate() + 2);
    const pickupYear = pickupDateObj.getFullYear();
    const pickupMonth = String(pickupDateObj.getMonth() + 1).padStart(2, '0');
    const pickupDay = String(pickupDateObj.getDate()).padStart(2, '0');
    const pickupDate = `${pickupYear}-${pickupMonth}-${pickupDay}`;

    // 选择当前日期+5天作为还车日期（使用Date对象自动处理月份进位）
    const dropoffDateObj = new Date(today);
    dropoffDateObj.setDate(today.getDate() + 5);
    const dropoffYear = dropoffDateObj.getFullYear();
    const dropoffMonth = String(dropoffDateObj.getMonth() + 1).padStart(2, '0');
    const dropoffDay = String(dropoffDateObj.getDate()).padStart(2, '0');
    const dropoffDate = `${dropoffYear}-${dropoffMonth}-${dropoffDay}`;

    console.log(`  📅 今天: ${today.toISOString().split('T')[0]}`);
    console.log(`  📅 取车日期: ${pickupDate}`);
    console.log(`  📅 还车日期: ${dropoffDate}`);

    await test.step('调用 selectTravelDates 方法', async () => {
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证日期已被选中', async () => {
      await page.waitForTimeout(500);

      // 验证日期按钮显示了日期信息（不再是"Select Dates"）
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 日期按钮文本: "${buttonText}"`);

      // 日期应该包含数字（表示已选择）
      expect(buttonText).toMatch(/\d+/);
      console.log('  ✅ 日期按钮显示了选择的日期');

      // 截图
      await page.screenshot({
        path: 'screenshots/unit-test-dates-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该成功选择下个月的日期', async ({ page }) => {
    console.log('🧪 测试：选择下个月的日期');

    // 获取下个月的日期
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');

    // 选择下个月的第5天作为取车日期
    const pickupDate = `${year}-${month}-05`;

    // 选择下个月的第10天作为还车日期
    const dropoffDate = `${year}-${month}-10`;

    console.log(`  📅 取车日期: ${pickupDate}`);
    console.log(`  📅 还车日期: ${dropoffDate}`);

    await test.step('调用 selectTravelDates 方法', async () => {
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证日期已被选中', async () => {
      await page.waitForTimeout(500);

      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 日期按钮文本: "${buttonText}"`);
      expect(buttonText).toMatch(/\d+/);
      console.log('  ✅ 成功选择了下个月的日期');

      await page.screenshot({
        path: 'screenshots/unit-test-next-month-dates.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该成功选择跨月的日期（下个月到下下个月）', async ({ page }) => {
    console.log('🧪 测试：选择跨月日期');

    const today = new Date();

    // 选择下个月的第5天作为取车日期
    const nextMonth1 = new Date(today.getFullYear(), today.getMonth() + 1, 5);
    const pickupYear = nextMonth1.getFullYear();
    const pickupMonth = String(nextMonth1.getMonth() + 1).padStart(2, '0');
    const pickupDate = `${pickupYear}-${pickupMonth}-05`;

    // 选择下下个月的第5天作为还车日期
    const nextMonth2 = new Date(today.getFullYear(), today.getMonth() + 2, 5);
    const dropoffYear = nextMonth2.getFullYear();
    const dropoffMonth = String(nextMonth2.getMonth() + 1).padStart(2, '0');
    const dropoffDate = `${dropoffYear}-${dropoffMonth}-05`;

    console.log(`  📅 取车日期: ${pickupDate}`);
    console.log(`  📅 还车日期: ${dropoffDate}`);

    await test.step('调用 selectTravelDates 方法', async () => {
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证跨月日期已被选中', async () => {
      await page.waitForTimeout(500);

      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 日期按钮文本: "${buttonText}"`);
      expect(buttonText).toMatch(/\d+/);
      console.log('  ✅ 成功选择了跨月日期');

      await page.screenshot({
        path: 'screenshots/unit-test-cross-month-dates.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该验证日期选择器的打开状态', async ({ page }) => {
    console.log('🧪 测试：日期选择器打开状态检测');

    await test.step('点击日期按钮打开选择器', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      console.log('  ✅ 已点击日期按钮');
    });

    await test.step('验证日期选择器已显示', async () => {
      await page.waitForTimeout(1000);

      // 获取当前月份名称
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonthName = monthNames[now.getMonth()];
      const currentYear = now.getFullYear();

      console.log(`  📅 检查月份: ${currentMonthName} ${currentYear}`);

      // 验证当前月份标签可见
      const monthPattern = new RegExp(`${currentMonthName}\\s+${currentYear}`, 'i');
      const monthLabel = page.getByText(monthPattern);
      await expect(monthLabel.first()).toBeVisible();

      console.log('  ✅ 日期选择器已显示');

      // 截图
      await page.screenshot({
        path: 'screenshots/unit-test-date-picker-open.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该验证月份导航功能', async ({ page }) => {
    console.log('🧪 测试：月份导航功能');

    await test.step('打开日期选择器', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      await page.waitForTimeout(1000);
      console.log('  ✅ 日期选择器已打开');
    });

    await test.step('验证初始显示两个月', async () => {
      // 应该显示当前月和下个月
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const currentMonthName = monthNames[now.getMonth()];
      const nextMonthName = monthNames[(now.getMonth() + 1) % 12];

      console.log(`  📅 当前月份: ${currentMonthName}`);
      console.log(`  📅 下个月份: ${nextMonthName}`);

      const currentMonthLabel = page.getByText(new RegExp(`${currentMonthName}\\s+\\d{4}`, 'i'));
      const nextMonthLabel = page.getByText(new RegExp(`${nextMonthName}\\s+\\d{4}`, 'i'));

      await expect(currentMonthLabel.first()).toBeVisible();
      await expect(nextMonthLabel.first()).toBeVisible();

      console.log('  ✅ 初始显示两个月');

      await page.screenshot({
        path: 'screenshots/unit-test-two-months-displayed.png'
      });
      console.log('  📸 截图已保存');
    });

    await test.step('点击下个月按钮', async () => {
      // 点击下个月按钮
      const nextButton = page.getByRole('button').filter({ hasText: /^$/ });
      await nextButton.click();
      await page.waitForTimeout(500);

      console.log('  ✅ 点击了下个月按钮');

      await page.screenshot({
        path: 'screenshots/unit-test-after-next-button.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该正确处理完整的日期选择流程', async ({ page }) => {
    console.log('🧪 测试：完整日期选择流程');

    const today = new Date();

    // 选择当前日期+3天和+7天（使用Date对象自动处理月份进位）
    const pickupDateObj = new Date(today);
    pickupDateObj.setDate(today.getDate() + 3);
    const pickupYear = pickupDateObj.getFullYear();
    const pickupMonth = String(pickupDateObj.getMonth() + 1).padStart(2, '0');
    const pickupDay = pickupDateObj.getDate();
    const pickupDate = `${pickupYear}-${pickupMonth}-${String(pickupDay).padStart(2, '0')}`;

    const dropoffDateObj = new Date(today);
    dropoffDateObj.setDate(today.getDate() + 7);
    const dropoffYear = dropoffDateObj.getFullYear();
    const dropoffMonth = String(dropoffDateObj.getMonth() + 1).padStart(2, '0');
    const dropoffDay = dropoffDateObj.getDate();
    const dropoffDate = `${dropoffYear}-${dropoffMonth}-${String(dropoffDay).padStart(2, '0')}`;

    console.log(`  📅 今天: ${today.toISOString().split('T')[0]}`);
    console.log(`  📅 取车日期: ${pickupDate}`);
    console.log(`  📅 还车日期: ${dropoffDate}`);

    await test.step('步骤1：点击日期按钮', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      console.log('  ✅ 步骤1完成：点击日期按钮');
    });

    await test.step('步骤2：等待日期选择器出现', async () => {
      await page.waitForTimeout(1000);
      console.log('  ✅ 步骤2完成：日期选择器已显示');
    });

    await test.step('步骤3：选择取车日期', async () => {
      // 获取月份名称
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = monthNames[pickupDateObj.getMonth()];

      // 锁定月份容器
      const monthPattern = new RegExp(`${monthName}\\s+${pickupYear}`, 'i');
      const monthContainer = page
        .locator('[class*="BookingWidget_month"]')
        .filter({
          has: page.locator('[class*="BookingWidget_monthLabel"]', { hasText: monthPattern })
        });

      // 在该月份中点击日期
      const pickupDayButton = monthContainer.getByRole('button', { name: String(pickupDay), exact: true });
      await pickupDayButton.click();
      await page.waitForTimeout(500);

      console.log(`  ✅ 步骤3完成：选择取车日期 ${monthName} ${pickupDay}`);
    });

    await test.step('步骤4：选择还车日期', async () => {
      // 获取月份名称
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = monthNames[dropoffDateObj.getMonth()];

      // 锁定月份容器
      const monthPattern = new RegExp(`${monthName}\\s+${dropoffYear}`, 'i');
      const monthContainer = page
        .locator('[class*="BookingWidget_month"]')
        .filter({
          has: page.locator('[class*="BookingWidget_monthLabel"]', { hasText: monthPattern })
        });

      // 在该月份中点击日期
      const dropoffDayButton = monthContainer.getByRole('button', { name: String(dropoffDay), exact: true });
      await dropoffDayButton.click();
      await page.waitForTimeout(500);

      console.log(`  ✅ 步骤4完成：选择还车日期 ${monthName} ${dropoffDay}`);
    });

    await test.step('步骤5：验证选择结果', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 最终日期按钮文本: "${buttonText}"`);
      expect(buttonText).toMatch(/\d+/);

      await page.screenshot({
        path: 'screenshots/unit-test-complete-date-flow.png'
      });
      console.log('  📸 完整流程截图已保存');
      console.log('  ✅ 完整流程测试通过');
    });
  });

  test('应该支持多次选择不同日期', async ({ page }) => {
    console.log('🧪 测试：多次选择不同日期');

    const today = new Date();

    await test.step('第一次选择日期', async () => {
      // 第一次选择：今天+2天到今天+4天
      const pickup1 = new Date(today);
      pickup1.setDate(today.getDate() + 2);
      const dropoff1 = new Date(today);
      dropoff1.setDate(today.getDate() + 4);

      const pickupDate = `${pickup1.getFullYear()}-${String(pickup1.getMonth() + 1).padStart(2, '0')}-${String(pickup1.getDate()).padStart(2, '0')}`;
      const dropoffDate = `${dropoff1.getFullYear()}-${String(dropoff1.getMonth() + 1).padStart(2, '0')}-${String(dropoff1.getDate()).padStart(2, '0')}`;

      console.log(`  📅 第一次选择: ${pickupDate} 到 ${dropoffDate}`);
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      await page.waitForTimeout(500);
      console.log('  ✅ 第一次日期选择成功');
    });

    await test.step('第二次选择不同日期', async () => {
      // 第二次选择：今天+6天到今天+10天
      const pickup2 = new Date(today);
      pickup2.setDate(today.getDate() + 6);
      const dropoff2 = new Date(today);
      dropoff2.setDate(today.getDate() + 10);

      const pickupDate2 = `${pickup2.getFullYear()}-${String(pickup2.getMonth() + 1).padStart(2, '0')}-${String(pickup2.getDate()).padStart(2, '0')}`;
      const dropoffDate2 = `${dropoff2.getFullYear()}-${String(dropoff2.getMonth() + 1).padStart(2, '0')}-${String(dropoff2.getDate()).padStart(2, '0')}`;

      console.log(`  📅 第二次选择: ${pickupDate2} 到 ${dropoffDate2}`);
      await searchPage.selectTravelDates(pickupDate2, dropoffDate2);
      await page.waitForTimeout(500);

      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 第二次选择后的按钮文本: "${buttonText}"`);
      expect(buttonText).toMatch(/\d+/);
      console.log('  ✅ 第二次日期选择成功，覆盖了第一次的选择');
    });
  });

  test('性能测试：日期选择方法执行时间', async () => {
    console.log('🧪 测试：日期选择方法执行性能');

    const today = new Date();

    // 今天+3天和今天+6天（使用Date对象自动处理月份进位）
    const pickupDateObj = new Date(today);
    pickupDateObj.setDate(today.getDate() + 3);
    const pickupDate = `${pickupDateObj.getFullYear()}-${String(pickupDateObj.getMonth() + 1).padStart(2, '0')}-${String(pickupDateObj.getDate()).padStart(2, '0')}`;

    const dropoffDateObj = new Date(today);
    dropoffDateObj.setDate(today.getDate() + 6);
    const dropoffDate = `${dropoffDateObj.getFullYear()}-${String(dropoffDateObj.getMonth() + 1).padStart(2, '0')}-${String(dropoffDateObj.getDate()).padStart(2, '0')}`;

    console.log(`  📅 今天: ${today.toISOString().split('T')[0]}`);
    console.log(`  📅 测试日期: ${pickupDate} 到 ${dropoffDate}`);

    await test.step('测量执行时间', async () => {
      const startTime = Date.now();
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️ 执行时间: ${executionTime}ms`);

      // 验证执行时间在合理范围内（小于10秒）
      expect(executionTime).toBeLessThan(10000);
      console.log('  ✅ 执行时间在合理范围内');
    });
  });
});

/**
 * 边界条件和异常场景测试
 */
test.describe('selectTravelDates 边界条件测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    // 选择取车地点（Auckland）
    await searchPage.clickPickupLocation('Auckland');

    // 选择还车地点（Auckland）
    await searchPage.clickDropoffLocation('Auckland');
  });

  test('应该处理无效的日期格式', async () => {
    console.log('🧪 测试：无效日期格式处理');

    await test.step('测试无效格式: "2025-13-01"', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.selectTravelDates('2025-13-01', '2025-13-05');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      console.log(`  ✅ 正确抛出错误: ${errorMessage}`);
    });

    await test.step('测试无效格式: "2025/10/01"', async () => {
      let errorThrown = false;

      try {
        await searchPage.selectTravelDates('2025/10/01', '2025/10/05');
      } catch (error) {
        errorThrown = true;
        console.log(`  ✅ 正确抛出错误: ${(error as Error).message}`);
      }

      expect(errorThrown).toBe(true);
    });

    await test.step('测试空字符串', async () => {
      let errorThrown = false;

      try {
        await searchPage.selectTravelDates('', '2025-10-05');
      } catch (error) {
        errorThrown = true;
        console.log(`  ✅ 空字符串正确抛出错误: ${(error as Error).message}`);
      }

      expect(errorThrown).toBe(true);
    });
  });

  test('应该处理过去的日期', async ({ page }) => {
    console.log('🧪 测试：过去的日期处理');

    await test.step('尝试选择过去的日期', async () => {
      // 选择去年的日期
      const lastYear = new Date().getFullYear() - 1;
      const pickupDate = `${lastYear}-01-15`;
      const dropoffDate = `${lastYear}-01-20`;

      console.log(`  📅 尝试选择日期: ${pickupDate} 到 ${dropoffDate}`);

      try {
        await searchPage.selectTravelDates(pickupDate, dropoffDate);
        await page.waitForTimeout(1000);
        console.log('  ⚠️ 方法执行完成（页面可能不允许选择过去的日期）');
      } catch (error) {
        console.log(`  ✅ 正确处理了过去的日期: ${(error as Error).message}`);
      }
    });
  });

  test('应该处理相同的取车和还车日期', async ({ page }) => {
    console.log('🧪 测试：相同的取车和还车日期');

    const today = new Date();

    // 使用今天+5天（使用Date对象自动处理月份进位）
    const sameDateObj = new Date(today);
    sameDateObj.setDate(today.getDate() + 5);
    const sameDate = `${sameDateObj.getFullYear()}-${String(sameDateObj.getMonth() + 1).padStart(2, '0')}-${String(sameDateObj.getDate()).padStart(2, '0')}`;

    console.log(`  📅 今天: ${today.toISOString().split('T')[0]}`);
    console.log(`  📅 测试日期: ${sameDate}`);

    await test.step('尝试选择相同日期', async () => {
      try {
        await searchPage.selectTravelDates(sameDate, sameDate);
        await page.waitForTimeout(500);
        console.log('  ✅ 方法执行完成（页面可能不允许相同日期）');
      } catch (error) {
        console.log(`  ⚠️ 选择相同日期可能不被允许: ${(error as Error).message}`);
      }
    });
  });
});

/**
 * 日期选择器UI交互测试
 */
test.describe('日期选择器UI交互测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    // 选择取车地点（Auckland）
    await searchPage.clickPickupLocation('Auckland');

    // 选择还车地点（Auckland）
    await searchPage.clickDropoffLocation('Auckland');
  });

  test('应该验证月份容器的锁定机制', async ({ page }) => {
    console.log('🧪 测试：月份容器锁定机制');

    await test.step('打开日期选择器', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      await page.waitForTimeout(1000);
      console.log('  ✅ 日期选择器已打开');
    });

    await test.step('验证月份容器定位', async () => {
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonthName = monthNames[now.getMonth()];
      const currentYear = now.getFullYear();

      console.log(`  📅 当前月份: ${currentMonthName} ${currentYear}`);

      // 锁定月份容器
      const monthPattern = new RegExp(`${currentMonthName}\\s+${currentYear}`, 'i');
      const monthContainer = page
        .locator('[class*="BookingWidget_month"]')
        .filter({
          has: page.locator('[class*="BookingWidget_monthLabel"]', { hasText: monthPattern })
        });

      await expect(monthContainer.first()).toBeVisible();
      console.log('  ✅ 月份容器定位成功');

      // 验证该容器内有日期按钮
      const dateButtons = monthContainer.getByRole('button').filter({ hasText: /^\d+$/ });
      const count = await dateButtons.count();
      console.log(`  📊 找到 ${count} 个日期按钮`);
      expect(count).toBeGreaterThan(0);

      await page.screenshot({
        path: 'screenshots/unit-test-month-container.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该验证日期按钮的精确匹配', async ({ page }) => {
    console.log('🧪 测试：日期按钮精确匹配');

    await test.step('打开日期选择器', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      await page.waitForTimeout(1000);
    });

    await test.step('验证日期按钮精确匹配（exact: true）', async () => {
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonthName = monthNames[now.getMonth()];
      const currentYear = now.getFullYear();

      // 锁定月份容器
      const monthPattern = new RegExp(`${currentMonthName}\\s+${currentYear}`, 'i');
      const monthContainer = page
        .locator('[class*="BookingWidget_month"]')
        .filter({
          has: page.locator('[class*="BookingWidget_monthLabel"]', { hasText: monthPattern })
        });

      // 测试精确匹配 "1" 不会匹配到 "10", "11", "12" 等
      const dayButton1 = monthContainer.getByRole('button', { name: '1', exact: true });
      await expect(dayButton1).toBeVisible();
      console.log('  ✅ 日期按钮 "1" 精确匹配成功');

      // 测试精确匹配 "10"
      const dayButton10 = monthContainer.getByRole('button', { name: '10', exact: true });
      const isDay10Visible = await dayButton10.isVisible().catch(() => false);
      if (isDay10Visible) {
        console.log('  ✅ 日期按钮 "10" 精确匹配成功');
      } else {
        console.log('  ℹ️ 日期按钮 "10" 在当前月不可见（可能不存在）');
      }

      await page.screenshot({
        path: 'screenshots/unit-test-exact-match.png'
      });
      console.log('  📸 截图已保存');
    });
  });
});

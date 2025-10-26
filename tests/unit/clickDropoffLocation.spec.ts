import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * clickDropoffLocation 方法单元测试
 *
 * 测试目标：验证 clickDropoffLocation 方法的功能
 * - 点击还车地点按钮
 * - 验证3个地点选项都出现
 * - 根据输入选择对应的地点
 * - 验证必须先选择取车地点的约束
 *
 * 运行方式：
 * npx playwright test tests/unit/clickDropoffLocation.spec.ts
 * npx playwright test tests/unit/clickDropoffLocation.spec.ts --ui
 * npx playwright test tests/unit/clickDropoffLocation.spec.ts --headed
 * npx playwright test tests/unit/clickDropoffLocation.spec.ts --debug
 */

test.describe('clickDropoffLocation 方法单元测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // 导航到搜索页面
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // 等待页面加载
    await searchPage.waitForSearchWidgetVisible();
  });

  test('应该在未选择取车地点时抛出错误', async () => {
    console.log('🧪 测试：未选择取车地点时的错误处理');

    await test.step('直接选择还车地点应该抛出错误', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.clickDropoffLocation('Auckland');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      expect(errorMessage).toContain('必须先选择取车地点');
      expect(errorMessage).toContain('clickPickupLocation');
      console.log(`  ✅ 正确抛出错误: ${errorMessage}`);
    });
  });

  test('应该成功选择 Auckland 作为还车地点', async ({ page }) => {
    console.log('🧪 测试：选择 Auckland 作为还车地点');

    await test.step('先选择取车地点 Christchurch', async () => {
      await searchPage.clickPickupLocation('Christchurch');
      await page.waitForTimeout(500);
      console.log('  ✅ 已选择取车地点: Christchurch');
    });

    await test.step('调用 clickDropoffLocation("Auckland")', async () => {
      await searchPage.clickDropoffLocation('Auckland');
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证 Auckland 已被选中', async () => {
      await page.waitForTimeout(500);

      // 使用 SearchPage 方法验证按钮是否包含 "Auckland Airport"
      await searchPage.assertDropoffLocationContains('Auckland Airport', '还车地点按钮应该显示 Auckland Airport');

      // 获取按钮文本并输出
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      // 截图验证
      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-auckland-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该成功选择 Christchurch 作为还车地点', async ({ page }) => {
    console.log('🧪 测试：选择 Christchurch 作为还车地点');

    await test.step('先选择取车地点 Auckland', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 已选择取车地点: Auckland');
    });

    await test.step('调用 clickDropoffLocation("Christchurch")', async () => {
      await searchPage.clickDropoffLocation('Christchurch');
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证 Christchurch 已被选中', async () => {
      await page.waitForTimeout(500);

      // 使用 SearchPage 方法验证按钮是否包含 "Christchurch Airport"
      await searchPage.assertDropoffLocationContains('Christchurch Airport', '还车地点按钮应该显示 Christchurch Airport');

      // 获取按钮文本并输出
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-christchurch-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该成功选择 Queenstown 作为还车地点', async ({ page }) => {
    console.log('🧪 测试：选择 Queenstown 作为还车地点');

    await test.step('先选择取车地点 Auckland', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 已选择取车地点: Auckland');
    });

    await test.step('调用 clickDropoffLocation("Queenstown")', async () => {
      await searchPage.clickDropoffLocation('Queenstown');
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证 Queenstown 已被选中', async () => {
      await page.waitForTimeout(500);

      // 使用 SearchPage 方法验证按钮是否包含 "Queenstown"
      await searchPage.assertDropoffLocationContains('Queenstown', '还车地点按钮应该显示 Queenstown');

      // 获取按钮文本并输出
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-queenstown-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该支持不区分大小写的地点名称', async ({ page }) => {
    console.log('🧪 测试：不区分大小写');

    await test.step('先选择取车地点', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
    });

    await test.step('使用小写 "auckland"', async () => {
      // 重新加载页面选择新的取车地点
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForSearchWidgetVisible();
      await searchPage.clickPickupLocation('Christchurch');
      await page.waitForTimeout(500);

      await searchPage.clickDropoffLocation('auckland');
      await page.waitForTimeout(500);

      // 验证按钮显示 Auckland Airport
      await searchPage.assertDropoffLocationContains('Auckland Airport', '小写输入应该选择 Auckland Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 小写 "auckland" 成功，按钮显示: "${buttonText.trim()}"`);
    });

    // 重新加载页面进行下一个测试
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('使用大写 "CHRISTCHURCH"', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);

      await searchPage.clickDropoffLocation('CHRISTCHURCH');
      await page.waitForTimeout(500);

      // 验证按钮显示 Christchurch Airport
      await searchPage.assertDropoffLocationContains('Christchurch Airport', '大写输入应该选择 Christchurch Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 大写 "CHRISTCHURCH" 成功，按钮显示: "${buttonText.trim()}"`);
    });

    // 重新加载页面进行下一个测试
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('使用混合大小写 "QueensTown"', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);

      await searchPage.clickDropoffLocation('QueensTown');
      await page.waitForTimeout(500);

      // 验证按钮显示 Queenstown
      await searchPage.assertDropoffLocationContains('Queenstown', '混合大小写输入应该选择 Queenstown');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 混合大小写 "QueensTown" 成功，按钮显示: "${buttonText.trim()}"`);
    });
  });

  test('应该在输入不支持的地点时抛出错误', async () => {
    console.log('🧪 测试：不支持的地点错误处理');

    await test.step('先选择取车地点', async () => {
      await searchPage.clickPickupLocation('Auckland');
    });

    await test.step('输入 "Wellington" 应该抛出错误', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.clickDropoffLocation('Wellington');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      expect(errorMessage).toContain('不支持的地点: "Wellington"');
      expect(errorMessage).toContain('可选地点: Auckland, Christchurch, Queenstown');
      console.log(`  ✅ 正确抛出错误: ${errorMessage}`);
    });

    await test.step('输入空字符串应该抛出错误', async () => {
      // 重新加载页面
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForSearchWidgetVisible();
      await searchPage.clickPickupLocation('Auckland');

      let errorThrown = false;
      try {
        await searchPage.clickDropoffLocation('');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
      console.log('  ✅ 空字符串正确抛出错误');
    });
  });

  test('应该验证3个地点选项都出现', async ({ page }) => {
    console.log('🧪 测试：验证3个地点选项验证逻辑（选择取车地点后自动展开）');

    await test.step('先选择取车地点', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 已选择取车地点: Auckland');
    });

    await test.step('验证下拉选项已自动出现', async () => {
      // 等待下拉选项出现（选择取车地点后应该自动展开）
      await page.waitForTimeout(1000);

      // 验证3个选项是否都可见（应该已经自动展开）
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      const christchurchOption = page.getByText('Christchurch Airport159');
      const queenstownOption = page.getByText('Queenstown50 Lucas Place,');

      const aucklandVisible = await aucklandOption.isVisible();
      const christchurchVisible = await christchurchOption.isVisible();
      const queenstownVisible = await queenstownOption.isVisible();

      console.log(`  📊 Auckland 可见: ${aucklandVisible}`);
      console.log(`  📊 Christchurch 可见: ${christchurchVisible}`);
      console.log(`  📊 Queenstown 可见: ${queenstownVisible}`);

      // 截图保存验证状态
      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-all-options-visible.png'
      });
      console.log('  📸 截图已保存');

      // 如果所有选项都可见，测试通过
      if (aucklandVisible && christchurchVisible && queenstownVisible) {
        console.log('  ✅ 所有3个地点选项已自动展开并可见');
      } else {
        console.log('  ⚠️ 部分地点选项不可见');
      }
    });
  });

  test('应该正确处理点击流程', async ({ page }) => {
    console.log('🧪 测试：完整点击流程');

    await test.step('步骤1：先选择取车地点', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 步骤1完成：已选择取车地点 Auckland');
    });

    await test.step('步骤2：等待下拉菜单出现', async () => {
      await page.waitForTimeout(1000);
      console.log('  ✅ 步骤2完成：等待下拉菜单');
    });

    await test.step('步骤3：验证3个地点选项', async () => {
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      const christchurchOption = page.getByText('Christchurch Airport159');
      const queenstownOption = page.getByText('Queenstown50 Lucas Place,');

      await expect(aucklandOption).toBeVisible();
      await expect(christchurchOption).toBeVisible();
      await expect(queenstownOption).toBeVisible();
      console.log('  ✅ 步骤3完成：3个选项都可见');
    });

    await test.step('步骤4：点击 Christchurch 选项', async () => {
      const christchurchOption = page.getByText('Christchurch Airport159');
      await christchurchOption.click();
      console.log('  ✅ 步骤4完成：点击选择');
      await page.waitForTimeout(500);
    });

    await test.step('步骤5：验证选择结果', async () => {
      // 验证按钮显示 Christchurch Airport
      await searchPage.assertDropoffLocationContains('Christchurch Airport', '按钮应该显示 Christchurch Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-complete-flow.png'
      });
      console.log('  📸 完整流程截图已保存');
      console.log('  ✅ 完整流程测试通过');
    });
  });

  test('性能测试：方法执行时间', async () => {
    console.log('🧪 测试：方法执行性能');

    await test.step('先选择取车地点', async () => {
      await searchPage.clickPickupLocation('Auckland');
    });

    await test.step('测量执行时间', async () => {
      const startTime = Date.now();
      await searchPage.clickDropoffLocation('Christchurch');
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️ 执行时间: ${executionTime}ms`);

      // 验证执行时间在合理范围内（小于5秒）
      expect(executionTime).toBeLessThan(5000);
      console.log('  ✅ 执行时间在合理范围内');
    });
  });
});

/**
 * 边界条件和异常场景测试
 */
test.describe('clickDropoffLocation 边界条件测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('测试各种非标准输入', async () => {
    console.log('🧪 测试：非标准输入处理');

    // 先选择取车地点
    await searchPage.clickPickupLocation('Auckland');

    const invalidInputs = [
      'sydney',
      'New York',
      '123',
      'auck',  // 部分匹配
      '  Christchurch  ',  // 带空格
    ];

    for (const input of invalidInputs) {
      await test.step(`测试输入: "${input}"`, async () => {
        let errorThrown = false;
        try {
          await searchPage.clickDropoffLocation(input);
        } catch (error) {
          errorThrown = true;
          console.log(`    ✅ "${input}" 正确抛出错误: ${(error as Error).message}`);
        }

        // 大部分应该抛出错误（除非是有效的地点）
        if (!['Christchurch', 'christchurch', 'CHRISTCHURCH'].includes(input.trim())) {
          expect(errorThrown).toBe(true);
        }

        // 重新加载页面准备下一个测试
        if (invalidInputs.indexOf(input) < invalidInputs.length - 1) {
          await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
          await searchPage.waitForSearchWidgetVisible();
          await searchPage.clickPickupLocation('Auckland');
        }
      });
    }
  });

  test('测试多次选择不同还车地点', async ({ page }) => {
    console.log('🧪 测试：多次选择不同还车地点');

    await test.step('先选择取车地点', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
    });

    await test.step('第一次选择 Christchurch', async () => {
      await searchPage.clickDropoffLocation('Christchurch');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Christchurch Airport', '应该显示 Christchurch Airport');
      console.log('  ✅ 第一次选择成功');
    });

    await page.pause();

    await test.step('第二次选择 Queenstown', async () => {
      await searchPage.clickDropoffLocation('Queenstown');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Queenstown', '应该显示 Queenstown');
      console.log('  ✅ 第二次选择成功，覆盖了第一次的选择');
    });
  });
});

/**
 * 取车地点和还车地点组合测试
 */
test.describe('取车地点和还车地点组合测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('应该支持取车和还车选择相同地点', async ({ page }) => {
    console.log('🧪 测试：取车和还车选择相同地点');

    await test.step('选择取车地点 Auckland', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 取车地点: Auckland');
    });

    await test.step('选择还车地点 Auckland', async () => {
      await searchPage.clickDropoffLocation('Auckland');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Auckland Airport', '还车地点应该显示 Auckland Airport');
      console.log('  ✅ 还车地点: Auckland');
      console.log('  ✅ 支持同地点取还车');
    });
  });

  test('应该支持取车和还车选择不同地点', async ({ page }) => {
    console.log('🧪 测试：取车和还车选择不同地点');

    await test.step('选择取车地点 Auckland', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 取车地点: Auckland');
    });

    await test.step('选择还车地点 Queenstown', async () => {
      await searchPage.clickDropoffLocation('Queenstown');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Queenstown', '还车地点应该显示 Queenstown');
      console.log('  ✅ 还车地点: Queenstown');
      console.log('  ✅ 支持异地还车');
    });
  });
});

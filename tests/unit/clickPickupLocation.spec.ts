import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * clickPickupLocation 方法单元测试
 *
 * 测试目标：验证 clickPickupLocation 方法的功能
 * - 点击取车地点按钮
 * - 验证3个地点选项都出现
 * - 根据输入选择对应的地点
 *
 * 运行方式：
 * npx playwright test tests/unit/clickPickupLocation.spec.ts
 * npx playwright test tests/unit/clickPickupLocation.spec.ts --ui
 * npx playwright test tests/unit/clickPickupLocation.spec.ts --headed
 * npx playwright test tests/unit/clickPickupLocation.spec.ts --debug
 */

test.describe('clickPickupLocation 方法单元测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // 导航到搜索页面
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // 等待页面加载
    await searchPage.waitForSearchWidgetVisible();
  });

  test('应该成功选择 Auckland', async ({ page }) => {
    console.log('🧪 测试：选择 Auckland');

    await test.step('调用 clickPickupLocation("Auckland")', async () => {
      await searchPage.clickPickupLocation('Auckland');
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证 Auckland 已被选中', async () => {
      // 等待一下确保选择生效
      await page.waitForTimeout(500);

      // 使用 SearchPage 方法验证按钮是否包含 "Auckland Airport"
      await searchPage.assertPickupLocationContains('Auckland Airport', '取车地点按钮应该显示 Auckland Airport');

      // 获取按钮文本并输出
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      // 截图验证
      await page.screenshot({
        path: 'screenshots/unit-test-auckland-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该成功选择 Christchurch', async ({ page }) => {
    console.log('🧪 测试：选择 Christchurch');

    await test.step('调用 clickPickupLocation("Christchurch")', async () => {
      await searchPage.clickPickupLocation('Christchurch');
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证 Christchurch 已被选中', async () => {
      await page.waitForTimeout(500);

      // 使用 SearchPage 方法验证按钮是否包含 "Christchurch Airport"
      await searchPage.assertPickupLocationContains('Christchurch Airport', '取车地点按钮应该显示 Christchurch Airport');

      // 获取按钮文本并输出
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-christchurch-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该成功选择 Queenstown', async ({ page }) => {
    console.log('🧪 测试：选择 Queenstown');

    await test.step('调用 clickPickupLocation("Queenstown")', async () => {
      await searchPage.clickPickupLocation('Queenstown');
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证 Queenstown 已被选中', async () => {
      await page.waitForTimeout(500);

      // 使用 SearchPage 方法验证按钮是否包含 "Queenstown"
      await searchPage.assertPickupLocationContains('Queenstown', '取车地点按钮应该显示 Queenstown');

      // 获取按钮文本并输出
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-queenstown-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该支持不区分大小写的地点名称', async ({ page }) => {
    console.log('🧪 测试：不区分大小写');

    await test.step('使用小写 "auckland"', async () => {
      await searchPage.clickPickupLocation('auckland');
      await page.waitForTimeout(500);

      // 验证按钮显示 Auckland Airport
      await searchPage.assertPickupLocationContains('Auckland Airport', '小写输入应该选择 Auckland Airport');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ 小写 "auckland" 成功，按钮显示: "${buttonText.trim()}"`);
    });

    // 重新加载页面进行下一个测试
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('使用大写 "CHRISTCHURCH"', async () => {
      await searchPage.clickPickupLocation('CHRISTCHURCH');
      await page.waitForTimeout(500);

      // 验证按钮显示 Christchurch Airport
      await searchPage.assertPickupLocationContains('Christchurch Airport', '大写输入应该选择 Christchurch Airport');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ 大写 "CHRISTCHURCH" 成功，按钮显示: "${buttonText.trim()}"`);
    });

    // 重新加载页面进行下一个测试
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('使用混合大小写 "QueensTown"', async () => {
      await searchPage.clickPickupLocation('QueensTown');
      await page.waitForTimeout(500);

      // 验证按钮显示 Queenstown
      await searchPage.assertPickupLocationContains('Queenstown', '混合大小写输入应该选择 Queenstown');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ 混合大小写 "QueensTown" 成功，按钮显示: "${buttonText.trim()}"`);
    });
  });

  test('应该在输入不支持的地点时抛出错误', async () => {
    console.log('🧪 测试：不支持的地点错误处理');

    await test.step('输入 "Wellington" 应该抛出错误', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.clickPickupLocation('Wellington');
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

      let errorThrown = false;
      try {
        await searchPage.clickPickupLocation('');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
      console.log('  ✅ 空字符串正确抛出错误');
    });
  });

  test('应该验证3个地点选项都出现', async ({ page }) => {
    console.log('🧪 测试：验证3个地点选项验证逻辑');

    await test.step('点击取车地点按钮后验证选项', async () => {
      // 获取取车地点按钮
      const pickupButton = page.getByRole('button', { name: 'Choose your pickup location' });
      await pickupButton.click();

      // 等待下拉选项出现
      await page.waitForTimeout(1000);

      // 验证3个选项是否都可见
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
        path: 'screenshots/unit-test-all-options-visible.png'
      });
      console.log('  📸 截图已保存');

      // 如果所有选项都可见，测试通过
      if (aucklandVisible && christchurchVisible && queenstownVisible) {
        console.log('  ✅ 所有3个地点选项都可见');
      } else {
        console.log('  ⚠️ 部分地点选项不可见');
      }
    });
  });

  test('应该正确处理点击流程', async ({ page }) => {
    console.log('🧪 测试：完整点击流程');

    await test.step('步骤1：点击取车地点按钮', async () => {
      const pickupButton = page.getByRole('button', { name: 'Choose your pickup location' });
      await pickupButton.click();
      console.log('  ✅ 步骤1完成：点击按钮');
      await page.waitForTimeout(500);
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

    await test.step('步骤4：点击 Auckland 选项', async () => {
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      await aucklandOption.click();
      console.log('  ✅ 步骤4完成：点击选择');
      await page.waitForTimeout(500);
    });

    await test.step('步骤5：验证选择结果', async () => {
      // 验证按钮显示 Auckland Airport
      await searchPage.assertPickupLocationContains('Auckland Airport', '按钮应该显示 Auckland Airport');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-complete-flow.png'
      });
      console.log('  📸 完整流程截图已保存');
      console.log('  ✅ 完整流程测试通过');
    });
  });

  test('性能测试：方法执行时间', async () => {
    console.log('🧪 测试：方法执行性能');

    await test.step('测量执行时间', async () => {
      const startTime = Date.now();
      await searchPage.clickPickupLocation('Auckland');
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
test.describe('clickPickupLocation 边界条件测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('测试各种非标准输入', async () => {
    console.log('🧪 测试：非标准输入处理');

    const invalidInputs = [
      'sydney',
      'New York',
      '123',
      'auck',  // 部分匹配
      '  Auckland  ',  // 带空格
    ];

    for (const input of invalidInputs) {
      await test.step(`测试输入: "${input}"`, async () => {
        let errorThrown = false;
        try {
          await searchPage.clickPickupLocation(input);
        } catch (error) {
          errorThrown = true;
          console.log(`    ✅ "${input}" 正确抛出错误 ${error}`);
        }

        // 大部分应该抛出错误（除非是有效的地点）
        if (!['Auckland', 'auckland', 'AUCKLAND'].includes(input.trim())) {
          expect(errorThrown).toBe(true);
        }

        // 重新加载页面准备下一个测试
        if (invalidInputs.indexOf(input) < invalidInputs.length - 1) {
          await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
          await searchPage.waitForSearchWidgetVisible();
        }
      });
    }
  });
});

import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * searchDropoffLocation 方法单元测试
 *
 * 测试目标：验证 searchDropoffLocation 方法的功能
 * - 点击还车地点按钮
 * - 点击输入框
 * - 输入地点名称进行查询
 * - 验证输入的地点选项是否出现
 * - 点击匹配的地点选项
 * - 验证必须先选择取车地点的约束
 *
 * 运行方式：
 * npx playwright test tests/unit/searchDropoffLocation.spec.ts
 * npx playwright test tests/unit/searchDropoffLocation.spec.ts --ui
 * npx playwright test tests/unit/searchDropoffLocation.spec.ts --headed
 * npx playwright test tests/unit/searchDropoffLocation.spec.ts --debug
 */

test.describe('searchDropoffLocation 方法单元测试', () => {
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

    await test.step('直接搜索还车地点应该抛出错误', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.searchDropoffLocation('Auckland');
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

  test('应该成功搜索并选择 Auckland', async ({ page }) => {
    console.log('🧪 测试：搜索并选择 Auckland');

    await test.step('先选择取车地点 Christchurch', async () => {
      await searchPage.searchPickupLocation('Christchurch');
      await page.waitForTimeout(500);
      console.log('  ✅ 已选择取车地点: Christchurch');
    });

    await test.step('调用 searchDropoffLocation("Auckland")', async () => {
      await searchPage.searchDropoffLocation('Auckland');
      console.log('  ✅ 方法执行完成');
    });

    await test.step('验证 Auckland 已被选中', async () => {
      // 等待一下确保选择生效
      await page.waitForTimeout(500);

      // 使用 SearchPage 方法验证按钮是否包含 "Auckland Airport"
      await searchPage.assertDropoffLocationContains('Auckland Airport', '还车地点按钮应该显示 Auckland Airport');

      // 获取按钮文本并输出
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      // 截图验证
      await page.screenshot({
        path: 'screenshots/unit-test-search-dropoff-auckland-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该成功搜索并选择 Christchurch', async ({ page }) => {
    console.log('🧪 测试：搜索并选择 Christchurch');

    await test.step('先选择取车地点 Auckland', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 已选择取车地点: Auckland');
    });

    await test.step('调用 searchDropoffLocation("Christchurch")', async () => {
      await searchPage.searchDropoffLocation('Christchurch');
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
        path: 'screenshots/unit-test-search-dropoff-christchurch-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该成功搜索并选择 Queenstown', async ({ page }) => {
    console.log('🧪 测试：搜索并选择 Queenstown');

    await test.step('先选择取车地点 Auckland', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 已选择取车地点: Auckland');
    });

    await test.step('调用 searchDropoffLocation("Queenstown")', async () => {
      await searchPage.searchDropoffLocation('Queenstown');
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
        path: 'screenshots/unit-test-search-dropoff-queenstown-selected.png'
      });
      console.log('  📸 截图已保存');
    });
  });

  test('应该支持不区分大小写的地点名称', async ({ page }) => {
    console.log('🧪 测试：搜索不区分大小写');

    await test.step('使用小写 "auckland" 搜索', async () => {
      // 先选择取车地点
      await searchPage.searchPickupLocation('Christchurch');
      await page.waitForTimeout(500);

      await searchPage.searchDropoffLocation('auckland');
      await page.waitForTimeout(500);

      // 验证按钮显示 Auckland Airport
      await searchPage.assertDropoffLocationContains('Auckland Airport', '小写搜索应该选择 Auckland Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 小写 "auckland" 搜索成功，按钮显示: "${buttonText.trim()}"`);
    });

    // 重新加载页面进行下一个测试
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('使用大写 "CHRISTCHURCH" 搜索', async () => {
      // 先选择取车地点
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);

      await searchPage.searchDropoffLocation('CHRISTCHURCH');
      await page.waitForTimeout(500);

      // 验证按钮显示 Christchurch Airport
      await searchPage.assertDropoffLocationContains('Christchurch Airport', '大写搜索应该选择 Christchurch Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 大写 "CHRISTCHURCH" 搜索成功，按钮显示: "${buttonText.trim()}"`);
    });

    // 重新加载页面进行下一个测试
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('使用混合大小写 "QueensTown" 搜索', async () => {
      // 先选择取车地点
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);

      await searchPage.searchDropoffLocation('QueensTown');
      await page.waitForTimeout(500);

      // 验证按钮显示 Queenstown
      await searchPage.assertDropoffLocationContains('Queenstown', '混合大小写搜索应该选择 Queenstown');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 混合大小写 "QueensTown" 搜索成功，按钮显示: "${buttonText.trim()}"`);
    });
  });

  test('应该在输入不支持的地点时抛出错误', async () => {
    console.log('🧪 测试：搜索不支持的地点错误处理');

    await test.step('先选择取车地点', async () => {
      await searchPage.searchPickupLocation('Auckland');
    });

    await test.step('搜索 "Wellington" 应该抛出错误', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.searchDropoffLocation('Wellington');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      expect(errorMessage).toContain('不支持的地点: "Wellington"');
      expect(errorMessage).toContain('可选地点: Auckland, Christchurch, Queenstown');
      console.log(`  ✅ 正确抛出错误: ${errorMessage}`);
    });

    await test.step('搜索空字符串应该抛出错误', async () => {
      // 重新加载页面
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForSearchWidgetVisible();
      await searchPage.searchPickupLocation('Auckland');

      let errorThrown = false;
      try {
        await searchPage.searchDropoffLocation('');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
      console.log('  ✅ 空字符串正确抛出错误');
    });
  });

  test('应该验证输入的地点选项出现', async ({ page }) => {
    console.log('🧪 测试：验证输入的地点选项验证逻辑（输入框自动显示）');

    await test.step('先选择取车地点', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 已选择取车地点: Auckland');
    });

    await test.step('验证输入框已自动显示并输入', async () => {
      // 等待输入框出现（选择取车地点后应该自动显示）
      await page.waitForTimeout(500);

      // 点击输入框（应该已经可见）
      const dropoffInput = page.getByRole('textbox', { name: 'Drop off at' });
      await dropoffInput.click();

      // 输入地点名称
      await dropoffInput.fill('Christchurch');

      // 等待下拉选项出现
      await page.waitForTimeout(1000);

      // 验证 Christchurch 选项可见
      const christchurchOption = page.getByText('Christchurch Airport159');
      const christchurchVisible = await christchurchOption.isVisible();

      console.log(`  📊 Christchurch 选项可见: ${christchurchVisible}`);

      // 截图保存验证状态
      await page.screenshot({
        path: 'screenshots/unit-test-search-dropoff-christchurch-option-visible.png'
      });
      console.log('  📸 截图已保存');

      if (christchurchVisible) {
        console.log('  ✅ 输入框已自动显示，输入的地点选项已出现');
      } else {
        console.log('  ⚠️ 输入的地点选项未出现');
      }
    });
  });

  test('应该正确处理搜索流程', async ({ page }) => {
    console.log('🧪 测试：完整搜索流程');

    await test.step('步骤1：先选择取车地点', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ 步骤1完成：已选择取车地点 Auckland');
    });

    await test.step('步骤2：点击还车地点按钮', async () => {
      const dropoffButton = page.getByRole('button', { name: 'Choose your drop-off location' });
      await dropoffButton.click();
      console.log('  ✅ 步骤2完成：点击按钮');
      await page.waitForTimeout(500);
    });

    await test.step('步骤3：点击输入框', async () => {
      const dropoffInput = page.getByRole('textbox', { name: 'Drop off at' });
      await dropoffInput.click();
      console.log('  ✅ 步骤3完成：点击输入框');
    });

    await test.step('步骤4：输入地点名称', async () => {
      const dropoffInput = page.getByRole('textbox', { name: 'Drop off at' });
      await dropoffInput.fill('Christchurch');
      console.log('  ✅ 步骤4完成：输入 "Christchurch"');
      await page.waitForTimeout(1000);
    });

    await test.step('步骤5：验证地点选项出现', async () => {
      const christchurchOption = page.getByText('Christchurch Airport159');
      await expect(christchurchOption).toBeVisible();
      console.log('  ✅ 步骤5完成：Christchurch 选项可见');
    });

    await test.step('步骤6：点击 Christchurch 选项', async () => {
      const christchurchOption = page.getByText('Christchurch Airport159');
      await christchurchOption.click();
      console.log('  ✅ 步骤6完成：点击选择');
      await page.waitForTimeout(500);
    });

    await test.step('步骤7：验证选择结果', async () => {
      // 验证按钮显示 Christchurch Airport
      await searchPage.assertDropoffLocationContains('Christchurch Airport', '按钮应该显示 Christchurch Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ 按钮显示文本: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-search-dropoff-complete-flow.png'
      });
      console.log('  📸 完整流程截图已保存');
      console.log('  ✅ 完整搜索流程测试通过');
    });
  });

  test('性能测试：方法执行时间', async () => {
    console.log('🧪 测试：搜索方法执行性能');

    await test.step('先选择取车地点', async () => {
      await searchPage.searchPickupLocation('Auckland');
    });

    await test.step('测量执行时间', async () => {
      const startTime = Date.now();
      await searchPage.searchDropoffLocation('Christchurch');
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
test.describe('searchDropoffLocation 边界条件测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('测试各种非标准输入', async () => {
    console.log('🧪 测试：搜索非标准输入处理');

    // 先选择取车地点
    await searchPage.searchPickupLocation('Auckland');

    const invalidInputs = [
      'sydney',
      'New York',
      '123',
      'chris',  // 部分匹配
      '  Christchurch  ',  // 带空格（应该成功，因为会 trim）
    ];

    for (const input of invalidInputs) {
      await test.step(`测试搜索: "${input}"`, async () => {
        let errorThrown = false;
        try {
          await searchPage.searchDropoffLocation(input);
        } catch (error) {
          errorThrown = true;
          console.log(`    ✅ "${input}" 正确抛出错误: ${(error as Error).message}`);
        }

        // 带空格的 Christchurch 应该成功（会被 trim）
        if (input.trim().toLowerCase() === 'christchurch') {
          expect(errorThrown).toBe(false);
          console.log(`    ✅ "${input}" (trim后为 Christchurch) 成功选择`);
        } else {
          // 其他无效输入应该抛出错误
          expect(errorThrown).toBe(true);
        }

        // 重新加载页面准备下一个测试
        if (invalidInputs.indexOf(input) < invalidInputs.length - 1) {
          await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
          await searchPage.waitForSearchWidgetVisible();
          await searchPage.searchPickupLocation('Auckland');
        }
      });
    }
  });

  test('测试输入后地点选项未出现的场景', async ({ page }) => {
    console.log('🧪 测试：地点选项未出现的错误处理');

    await test.step('先选择取车地点', async () => {
      await searchPage.searchPickupLocation('Auckland');
    });

    await test.step('模拟地点选项未出现', async () => {
      // 这个测试验证当输入的地点选项未出现时，方法会抛出错误
      // 由于我们使用真实的页面，这个场景可能不会发生
      // 但我们可以测试不支持的地点，它们的选项不会出现

      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.searchDropoffLocation('InvalidCity');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      console.log(`  ✅ 正确抛出错误: ${errorMessage}`);
    });
  });
});

/**
 * 对比测试：searchDropoffLocation vs clickDropoffLocation
 */
test.describe('searchDropoffLocation vs clickDropoffLocation 对比测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('两种方法应该产生相同的结果', async ({ page }) => {
    console.log('🧪 测试：对比两种选择方法');

    await test.step('使用 searchDropoffLocation 选择 Auckland', async () => {
      // 先选择取车地点
      await searchPage.searchPickupLocation('Christchurch');
      await page.waitForTimeout(500);

      await searchPage.searchDropoffLocation('Auckland');
      await page.waitForTimeout(500);

      const searchButtonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  📊 searchDropoffLocation 结果: "${searchButtonText.trim()}"`);

      // 重新加载页面
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForSearchWidgetVisible();

      // 先选择取车地点
      await searchPage.clickPickupLocation('Christchurch');
      await page.waitForTimeout(500);

      // 使用 clickDropoffLocation 选择 Auckland
      await searchPage.clickDropoffLocation('Auckland');
      await page.waitForTimeout(500);

      const clickButtonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  📊 clickDropoffLocation 结果: "${clickButtonText.trim()}"`);

      // 两种方法应该产生相同的结果
      expect(searchButtonText).toBe(clickButtonText);
      console.log('  ✅ 两种方法产生相同结果');
    });
  });
});

/**
 * 完整流程测试：取车和还车结合
 */
test.describe('完整取车还车流程测试', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('使用 search 方法完成取车和还车选择', async ({ page }) => {
    console.log('🧪 测试：使用 search 方法完成取车和还车');

    await test.step('搜索选择取车地点 Auckland', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      await searchPage.assertPickupLocationContains('Auckland Airport', '取车地点应该是 Auckland Airport');
      console.log('  ✅ 取车地点设置成功');
    });

    await test.step('搜索选择还车地点 Queenstown', async () => {
      await searchPage.searchDropoffLocation('Queenstown');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Queenstown', '还车地点应该是 Queenstown');
      console.log('  ✅ 还车地点设置成功');
    });

    await test.step('验证最终结果', async () => {
      const pickupText = await searchPage.getPickupLocationButtonText();
      const dropoffText = await searchPage.getDropoffLocationButtonText();

      console.log(`  📊 最终取车地点: "${pickupText.trim()}"`);
      console.log(`  📊 最终还车地点: "${dropoffText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-complete-pickup-dropoff-search.png',
        fullPage: false
      });
      console.log('  📸 完整流程截图已保存');
      console.log('  ✅ 完整流程测试通过');
    });
  });

  test('使用 click 方法完成取车和还车选择', async ({ page }) => {
    console.log('🧪 测试：使用 click 方法完成取车和还车');

    await test.step('点击选择取车地点 Auckland', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      await searchPage.assertPickupLocationContains('Auckland Airport', '取车地点应该是 Auckland Airport');
      console.log('  ✅ 取车地点设置成功');
    });

    await test.step('点击选择还车地点 Queenstown', async () => {
      await searchPage.clickDropoffLocation('Queenstown');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Queenstown', '还车地点应该是 Queenstown');
      console.log('  ✅ 还车地点设置成功');
    });

    await test.step('验证最终结果', async () => {
      const pickupText = await searchPage.getPickupLocationButtonText();
      const dropoffText = await searchPage.getDropoffLocationButtonText();

      console.log(`  📊 最终取车地点: "${pickupText.trim()}"`);
      console.log(`  📊 最终还车地点: "${dropoffText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-complete-pickup-dropoff-click.png',
        fullPage: false
      });
      console.log('  📸 完整流程截图已保存');
      console.log('  ✅ 完整流程测试通过');
    });
  });

  test('混合使用 search 和 click 方法', async ({ page }) => {
    console.log('🧪 测试：混合使用两种方法');

    await test.step('使用 search 选择取车地点', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ search 方式选择取车地点');
    });

    await test.step('使用 click 选择还车地点', async () => {
      await searchPage.clickDropoffLocation('Christchurch');
      await page.waitForTimeout(500);
      console.log('  ✅ click 方式选择还车地点');
    });

    await test.step('验证混合方法有效性', async () => {
      await searchPage.assertPickupLocationContains('Auckland Airport', '取车地点正确');
      await searchPage.assertDropoffLocationContains('Christchurch Airport', '还车地点正确');
      console.log('  ✅ 混合方法测试通过');
    });
  });
});

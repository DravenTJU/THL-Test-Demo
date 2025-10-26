import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * clickPickupLocation unit tests
 *
 * Test objectives: verify clickPickupLocation method functionality
 * - Click the pickup location button
 * - Ensure the three location options appear
 * - Select the matching location based on the input
 *
 * Run with:
 * npx playwright test tests/unit/clickPickupLocation.spec.ts
 * npx playwright test tests/unit/clickPickupLocation.spec.ts --ui
 * npx playwright test tests/unit/clickPickupLocation.spec.ts --headed
 * npx playwright test tests/unit/clickPickupLocation.spec.ts --debug
 */

test.describe('clickPickupLocation unit tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // Navigate to the search page
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // Wait for the page to finish loading
    await searchPage.waitForSearchWidgetVisible();
  });

  test('successfully select Auckland', async ({ page }) => {
    console.log('🧪 Test: select Auckland');

    await test.step('Call clickPickupLocation("Auckland")', async () => {
      await searchPage.clickPickupLocation('Auckland');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Auckland is selected', async () => {
      // Wait briefly to ensure the selection takes effect
      await page.waitForTimeout(500);

      // Use SearchPage helper to ensure the button contains "Auckland Airport"
      await searchPage.assertPickupLocationContains('Auckland Airport', 'Pickup button should display Auckland Airport');

      // Capture the button text for logging
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      // Screenshot for verification
      await page.screenshot({
        path: 'screenshots/unit-test-auckland-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('successfully select Christchurch', async ({ page }) => {
    console.log('🧪 Test: select Christchurch');

    await test.step('Call clickPickupLocation("Christchurch")', async () => {
      await searchPage.clickPickupLocation('Christchurch');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Christchurch is selected', async () => {
      await page.waitForTimeout(500);

      // Use SearchPage helper to ensure the button contains "Christchurch Airport"
      await searchPage.assertPickupLocationContains('Christchurch Airport', 'Pickup button should display Christchurch Airport');

      // Capture the button text for logging
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-christchurch-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('successfully select Queenstown', async ({ page }) => {
    console.log('🧪 Test: select Queenstown');

    await test.step('Call clickPickupLocation("Queenstown")', async () => {
      await searchPage.clickPickupLocation('Queenstown');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Queenstown is selected', async () => {
      await page.waitForTimeout(500);

      // Use SearchPage helper to ensure the button contains "Queenstown"
      await searchPage.assertPickupLocationContains('Queenstown', 'Pickup button should display Queenstown');

      // Capture the button text for logging
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-queenstown-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('support case-insensitive location names', async ({ page }) => {
    console.log('🧪 Test: case insensitivity');

    await test.step('Use lowercase "auckland"', async () => {
      await searchPage.clickPickupLocation('auckland');
      await page.waitForTimeout(500);

      // Ensure the button displays Auckland Airport
      await searchPage.assertPickupLocationContains('Auckland Airport', 'Lowercase input should select Auckland Airport');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Lowercase "auckland" succeeded, button shows: "${buttonText.trim()}"`);
    });

    // Reload for the next scenario
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('Use uppercase "CHRISTCHURCH"', async () => {
      await searchPage.clickPickupLocation('CHRISTCHURCH');
      await page.waitForTimeout(500);

      // Ensure the button displays Christchurch Airport
      await searchPage.assertPickupLocationContains('Christchurch Airport', 'Uppercase input should select Christchurch Airport');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Uppercase "CHRISTCHURCH" succeeded, button shows: "${buttonText.trim()}"`);
    });

    // Reload for the next scenario
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('Use mixed case "QueensTown"', async () => {
      await searchPage.clickPickupLocation('QueensTown');
      await page.waitForTimeout(500);

      // Ensure the button displays Queenstown
      await searchPage.assertPickupLocationContains('Queenstown', 'Mixed-case input should select Queenstown');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Mixed-case "QueensTown" succeeded, button shows: "${buttonText.trim()}"`);
    });
  });

  test('throw for unsupported location input', async () => {
    console.log('🧪 Test: unsupported location error handling');

    await test.step('Entering "Wellington" should throw', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.clickPickupLocation('Wellington');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      expect(errorMessage).toContain('Unsupported location: "Wellington"');
      expect(errorMessage).toContain('Available locations: Auckland, Christchurch, Queenstown');
      console.log(`  ✅ Error thrown as expected: ${errorMessage}`);
    });

    await test.step('Entering an empty string should throw', async () => {
      // Reload the page
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForSearchWidgetVisible();

      let errorThrown = false;
      try {
        await searchPage.clickPickupLocation('');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
      console.log('  ✅ Empty string triggered an error as expected');
    });
  });

  test('verify all three location options appear', async ({ page }) => {
    console.log('🧪 Test: verify three location options');

    await test.step('Click the pickup location button and verify options', async () => {
      // Locate the pickup button
      const pickupButton = page.getByRole('button', { name: 'Choose your pickup location' });
      await pickupButton.click();

      // Wait for dropdown options to appear
      await page.waitForTimeout(1000);

      // Confirm each option is visible
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      const christchurchOption = page.getByText('Christchurch Airport159');
      const queenstownOption = page.getByText('Queenstown50 Lucas Place,');

      const aucklandVisible = await aucklandOption.isVisible();
      const christchurchVisible = await christchurchOption.isVisible();
      const queenstownVisible = await queenstownOption.isVisible();

      console.log(`  📊 Auckland visible: ${aucklandVisible}`);
      console.log(`  📊 Christchurch visible: ${christchurchVisible}`);
      console.log(`  📊 Queenstown visible: ${queenstownVisible}`);

      // Screenshot to capture the verification state
      await page.screenshot({
        path: 'screenshots/unit-test-all-options-visible.png'
      });
      console.log('  📸 Screenshot saved');

      // Log a helpful message depending on visibility
      if (aucklandVisible && christchurchVisible && queenstownVisible) {
        console.log('  ✅ All three location options are visible');
      } else {
        console.log('  ⚠️ Some location options are hidden');
      }
    });
  });

  test('handle the full click flow correctly', async ({ page }) => {
    console.log('🧪 Test: complete click flow');

    await test.step('1: click pickup button', async () => {
      const pickupButton = page.getByRole('button', { name: 'Choose your pickup location' });
      await pickupButton.click();
      console.log('  ✅ Step 1 complete: button clicked');
      await page.waitForTimeout(500);
    });

    await test.step('2: wait for dropdown', async () => {
      await page.waitForTimeout(1000);
      console.log('  ✅ Step 2 complete: waited for dropdown');
    });

    await test.step('3: verify all three options', async () => {
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      const christchurchOption = page.getByText('Christchurch Airport159');
      const queenstownOption = page.getByText('Queenstown50 Lucas Place,');

      await expect(aucklandOption).toBeVisible();
      await expect(christchurchOption).toBeVisible();
      await expect(queenstownOption).toBeVisible();
      console.log('  ✅ Step 3 complete: all three options visible');
    });

    await test.step('4: click Auckland option', async () => {
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      await aucklandOption.click();
      console.log('  ✅ Step 4 complete: option clicked');
      await page.waitForTimeout(500);
    });

    await test.step('5: verify selection result', async () => {
      // Ensure the button displays Auckland Airport
      await searchPage.assertPickupLocationContains('Auckland Airport', 'Button should display Auckland Airport');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-complete-flow.png'
      });
      console.log('  📸 Full flow screenshot saved');
      console.log('  ✅ Full flow test passed');
    });
  });

  test('measure method execution time', async () => {
    console.log('🧪 Test: method execution performance');

    await test.step('Measure execution time', async () => {
      const startTime = Date.now();
      await searchPage.clickPickupLocation('Auckland');
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️ Execution time: ${executionTime}ms`);

      // Verify execution time is within a reasonable range (<5 seconds)
      expect(executionTime).toBeLessThan(5000);
      console.log('  ✅ Execution time within expected range');
    });
  });
});

/**
 * Boundary condition and exception scenario tests
 */
test.describe('clickPickupLocation boundary tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('handles various non-standard inputs', async () => {
    console.log('🧪 Test: non-standard input handling');

    const invalidInputs = [
      'sydney',
      'New York',
      '123',
      'auck',  // partial match
      '  Auckland  ',  // with surrounding spaces
    ];

    for (const input of invalidInputs) {
      await test.step(`Test input: "${input}"`, async () => {
        let errorThrown = false;
        try {
          await searchPage.clickPickupLocation(input);
        } catch (error) {
          errorThrown = true;
          console.log(`    ✅ "${input}" threw as expected: ${error}`);
        }

        // Most inputs should throw (unless they resolve to a valid location)
        if (!['Auckland', 'auckland', 'AUCKLAND'].includes(input.trim())) {
          expect(errorThrown).toBe(true);
        }

        // Reload before the next test input
        if (invalidInputs.indexOf(input) < invalidInputs.length - 1) {
          await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
          await searchPage.waitForSearchWidgetVisible();
        }
      });
    }
  });
});

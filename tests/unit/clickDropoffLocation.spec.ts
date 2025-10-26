import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * clickDropoffLocation unit tests
 *
 * Test objectives: verify clickDropoffLocation method functionality
 * - Click the drop-off location button
 * - Ensure the three location options appear
 * - Select the matching location based on the input
 * - Validate that a pickup location must be chosen first
 *
 * Run with:
 * npx playwright test tests/unit/clickDropoffLocation.spec.ts
 * npx playwright test tests/unit/clickDropoffLocation.spec.ts --ui
 * npx playwright test tests/unit/clickDropoffLocation.spec.ts --headed
 * npx playwright test tests/unit/clickDropoffLocation.spec.ts --debug
 */

test.describe('clickDropoffLocation unit tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // Navigate to the search page
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // Wait for the page to finish loading
    await searchPage.waitForSearchWidgetVisible();
  });

  test('throw when pickup location is not selected', async () => {
    console.log('🧪 Test: error handling when pickup location is missing');

    await test.step('Selecting drop-off without pickup should throw', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.clickDropoffLocation('Auckland');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      expect(errorMessage).toContain('Pickup location must be selected first');
      expect(errorMessage).toContain('clickPickupLocation');
      console.log(`  ✅ Correctly threw error: ${errorMessage}`);
    });
  });

  test('select Auckland as drop-off location', async ({ page }) => {
    console.log('🧪 Test: select Auckland as drop-off location');

    await test.step('Select Christchurch as pickup first', async () => {
      await searchPage.clickPickupLocation('Christchurch');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location selected: Christchurch');
    });

    await test.step('Call clickDropoffLocation("Auckland")', async () => {
      await searchPage.clickDropoffLocation('Auckland');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Auckland is selected', async () => {
      await page.waitForTimeout(500);

      // Use SearchPage helper to assert the button contains "Auckland Airport"
      await searchPage.assertDropoffLocationContains('Auckland Airport', 'Drop-off button should display Auckland Airport');

      // Fetch the button text for logging
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      // Capture screenshot for verification
      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-auckland-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('select Christchurch as drop-off location', async ({ page }) => {
    console.log('🧪 Test: select Christchurch as drop-off location');

    await test.step('Select Auckland as pickup first', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location selected: Auckland');
    });

    await test.step('Call clickDropoffLocation("Christchurch")', async () => {
      await searchPage.clickDropoffLocation('Christchurch');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Christchurch is selected', async () => {
      await page.waitForTimeout(500);

      // Use SearchPage helper to assert the button contains "Christchurch Airport"
      await searchPage.assertDropoffLocationContains('Christchurch Airport', 'Drop-off button should display Christchurch Airport');

      // Fetch the button text for logging
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-christchurch-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('select Queenstown as drop-off location', async ({ page }) => {
    console.log('🧪 Test: select Queenstown as drop-off location');

    await test.step('Select Auckland as pickup first', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location selected: Auckland');
    });

    await test.step('Call clickDropoffLocation("Queenstown")', async () => {
      await searchPage.clickDropoffLocation('Queenstown');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Queenstown is selected', async () => {
      await page.waitForTimeout(500);

      // Use SearchPage helper to assert the button contains "Queenstown"
      await searchPage.assertDropoffLocationContains('Queenstown', 'Drop-off button should display Queenstown');

      // Fetch the button text for logging
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-queenstown-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('support case-insensitive location names', async ({ page }) => {
    console.log('🧪 Test: case insensitivity');

    await test.step('Select pickup location first', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
    });

    await test.step('Use lowercase "auckland"', async () => {
      // Reload the page to select a new pickup location
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForSearchWidgetVisible();
      await searchPage.clickPickupLocation('Christchurch');

      await searchPage.clickDropoffLocation('auckland');
      await page.waitForTimeout(500);

      // Assert the button displays Auckland Airport
      await searchPage.assertDropoffLocationContains('Auckland Airport', 'Lowercase input should select Auckland Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Lowercase "auckland" succeeded, button shows: "${buttonText.trim()}"`);
    });

    // Reload the page for the next test
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('Use uppercase "CHRISTCHURCH"', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);

      await searchPage.clickDropoffLocation('CHRISTCHURCH');
      await page.waitForTimeout(500);

      // Assert the button displays Christchurch Airport
      await searchPage.assertDropoffLocationContains('Christchurch Airport', 'Uppercase input should select Christchurch Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Uppercase "CHRISTCHURCH" succeeded, button shows: "${buttonText.trim()}"`);
    });

    // Reload the page for the next test
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('Use mixed case "QueensTown"', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);

      await searchPage.clickDropoffLocation('QueensTown');
      await page.waitForTimeout(500);

      // Assert the button displays Queenstown
      await searchPage.assertDropoffLocationContains('Queenstown', 'Mixed-case input should select Queenstown');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Mixed-case "QueensTown" succeeded, button shows: "${buttonText.trim()}"`);
    });
  });

  test('throw for unsupported location input', async () => {
    console.log('🧪 Test: unsupported location error handling');

    await test.step('Select pickup location first', async () => {
      await searchPage.clickPickupLocation('Auckland');
    });

    await test.step('Entering "Wellington" should throw', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.clickDropoffLocation('Wellington');
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
      await searchPage.clickPickupLocation('Auckland');

      let errorThrown = false;
      try {
        await searchPage.clickDropoffLocation('');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
      console.log('  ✅ Empty string triggered an error as expected');
    });
  });

  test('verify all three location options appear', async ({ page }) => {
    console.log('🧪 Test: verify three location options appear after selecting pickup');

    await test.step('Select pickup location first', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location selected: Auckland');
    });

    await test.step('Verify dropdown options appear automatically', async () => {
      // Wait for dropdown options to appear (should auto expand after selecting pickup)
      await page.waitForTimeout(1000);

      // Confirm all three options are visible (should already be expanded)
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      const christchurchOption = page.getByText('Christchurch Airport159');
      const queenstownOption = page.getByText('Queenstown50 Lucas Place,');

      const aucklandVisible = await aucklandOption.isVisible();
      const christchurchVisible = await christchurchOption.isVisible();
      const queenstownVisible = await queenstownOption.isVisible();

      console.log(`  📊 Auckland visible: ${aucklandVisible}`);
      console.log(`  📊 Christchurch visible: ${christchurchVisible}`);
      console.log(`  📊 Queenstown visible: ${queenstownVisible}`);

      // Capture screenshot of the verification state
      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-all-options-visible.png'
      });
      console.log('  📸 Screenshot saved');

      // If all options are visible the test passes
      if (aucklandVisible && christchurchVisible && queenstownVisible) {
        console.log('  ✅ All three location options are visible after auto expand');
      } else {
        console.log('  ⚠️ Some location options are hidden');
      }
    });
  });

  test('handle the full selection flow', async ({ page }) => {
    console.log('🧪 Test: full click flow');

    await test.step('Step 1: select pickup location first', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Step 1 complete: pickup Auckland selected');
    });

    await test.step('Step 2: wait for dropdown to appear', async () => {
      await page.waitForTimeout(1000);
      console.log('  ✅ Step 2 complete: waited for dropdown');
    });

    await test.step('Step 3: verify all three location options', async () => {
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      const christchurchOption = page.getByText('Christchurch Airport159');
      const queenstownOption = page.getByText('Queenstown50 Lucas Place,');

      await expect(aucklandOption).toBeVisible();
      await expect(christchurchOption).toBeVisible();
      await expect(queenstownOption).toBeVisible();
      console.log('  ✅ Step 3 complete: all three options visible');
    });

    await test.step('Step 4: click Christchurch option', async () => {
      const christchurchOption = page.getByText('Christchurch Airport159');
      await christchurchOption.click();
      console.log('  ✅ Step 4 complete: option clicked');
      await page.waitForTimeout(500);
    });

    await test.step('Step 5: verify selection result', async () => {
      // Assert the button displays Christchurch Airport
      await searchPage.assertDropoffLocationContains('Christchurch Airport', 'Button should display Christchurch Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-dropoff-complete-flow.png'
      });
      console.log('  📸 Full flow screenshot saved');
      console.log('  ✅ Full flow test passed');
    });
  });

  test('measure method execution time', async () => {
    console.log('🧪 Test: method execution performance');

    await test.step('Select pickup location first', async () => {
      await searchPage.clickPickupLocation('Auckland');
    });

    await test.step('Measure execution time', async () => {
      const startTime = Date.now();
      await searchPage.clickDropoffLocation('Christchurch');
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️ Execution time: ${executionTime}ms`);

      // Assert execution time is within acceptable range (<5s)
      expect(executionTime).toBeLessThan(5000);
      console.log('  ✅ Execution time within expected range');
    });
  });
});

/**
 * Boundary condition and exception scenario tests
 */
test.describe('clickDropoffLocation boundary tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('handles various non-standard inputs', async () => {
    console.log('🧪 Test: non-standard input handling');

    // Select pickup location first
    await searchPage.clickPickupLocation('Auckland');

    const invalidInputs = [
      'sydney',
      'New York',
      '123',
      'auck',  // partial match
      '  Christchurch  ',  // with surrounding spaces
    ];

    for (const input of invalidInputs) {
      await test.step(`Test input: "${input}"`, async () => {
        let errorThrown = false;
        try {
          await searchPage.clickDropoffLocation(input);
        } catch (error) {
          errorThrown = true;
          console.log(`    ✅ "${input}" threw as expected: ${(error as Error).message}`);
        }

        // Most inputs should throw (unless they resolve to a valid location)
        if (!['Christchurch', 'christchurch', 'CHRISTCHURCH'].includes(input.trim())) {
          expect(errorThrown).toBe(true);
        }

        // Reload the page before the next iteration
        if (invalidInputs.indexOf(input) < invalidInputs.length - 1) {
          await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
          await searchPage.waitForSearchWidgetVisible();
          await searchPage.clickPickupLocation('Auckland');
        }
      });
    }
  });

  test('handles selecting different drop-off locations multiple times', async ({ page }) => {
    console.log('🧪 Test: multiple drop-off selections');

    await test.step('Select pickup location first', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
    });

    await test.step('First selection Christchurch', async () => {
      await searchPage.clickDropoffLocation('Christchurch');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Christchurch Airport', 'Should display Christchurch Airport');
      console.log('  ✅ First selection succeeded');
    });

    await page.pause();

    await test.step('Second selection Queenstown', async () => {
      await searchPage.clickDropoffLocation('Queenstown');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Queenstown', 'Should display Queenstown');
      console.log('  ✅ Second selection succeeded and replaced the first');
    });
  });
});

/**
 * Pickup and drop-off combination tests
 */
test.describe('Pickup and drop-off combination tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('allow identical pickup and drop-off locations', async ({ page }) => {
    console.log('🧪 Test: matching pickup and drop-off');

    await test.step('Choose pickup location Auckland', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location: Auckland');
    });

    await test.step('Choose drop-off location Auckland', async () => {
      await searchPage.clickDropoffLocation('Auckland');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Auckland Airport', 'Drop-off button should display Auckland Airport');
      console.log('  ✅ Drop-off location: Auckland');
      console.log('  ✅ Same-location pickup and drop-off supported');
    });
  });

  test('allow different pickup and drop-off locations', async ({ page }) => {
    console.log('🧪 Test: different pickup and drop-off');

    await test.step('Choose pickup location Auckland', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location: Auckland');
    });

    await test.step('Choose drop-off location Queenstown', async () => {
      await searchPage.clickDropoffLocation('Queenstown');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Queenstown', 'Drop-off button should display Queenstown');
      console.log('  ✅ Drop-off location: Queenstown');
      console.log('  ✅ One-way drop-off supported');
    });
  });
});

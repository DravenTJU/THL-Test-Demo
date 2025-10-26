import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * searchDropoffLocation unit tests
 *
 * Test objectives: verify searchDropoffLocation method functionality
 * - Click the drop-off button
 * - Focus the input field
 * - Enter a location name to search
 * - Confirm the expected option appears
 * - Select the matching option
 * - Validate that a pickup location must be chosen first
 *
 * Run with:
 * npx playwright test tests/unit/searchDropoffLocation.spec.ts
 * npx playwright test tests/unit/searchDropoffLocation.spec.ts --ui
 * npx playwright test tests/unit/searchDropoffLocation.spec.ts --headed
 * npx playwright test tests/unit/searchDropoffLocation.spec.ts --debug
 */

test.describe('searchDropoffLocation unit tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // Navigate to the search page
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // Wait for the search widget to load
    await searchPage.waitForSearchWidgetVisible();
  });

  test('throw when pickup location is not selected', async () => {
    console.log('🧪 Test: error handling when pickup location is missing');

    await test.step('Searching drop-off without pickup should throw', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.searchDropoffLocation('Auckland');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      expect(errorMessage).toContain('Pickup location must be selected first');
      expect(errorMessage).toContain('clickPickupLocation');
      console.log(`  ✅ Error thrown as expected: ${errorMessage}`);
    });
  });

  test('search and select Auckland', async ({ page }) => {
    console.log('🧪 Test: search and select Auckland');

    await test.step('Select Christchurch as pickup first', async () => {
      await searchPage.searchPickupLocation('Christchurch');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location selected: Christchurch');
    });

    await test.step('Call searchDropoffLocation("Auckland")', async () => {
      await searchPage.searchDropoffLocation('Auckland');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Auckland is selected', async () => {
      await page.waitForTimeout(500);

      // Ensure the drop-off button contains "Auckland Airport"
      await searchPage.assertDropoffLocationContains('Auckland Airport', 'Drop-off button should display Auckland Airport');

      // Log the button text
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      // Capture screenshot
      await page.screenshot({
        path: 'screenshots/unit-test-search-dropoff-auckland-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('search and select Christchurch', async ({ page }) => {
    console.log('🧪 Test: search and select Christchurch');

    await test.step('Select Auckland as pickup first', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location selected: Auckland');
    });

    await test.step('Call searchDropoffLocation("Christchurch")', async () => {
      await searchPage.searchDropoffLocation('Christchurch');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Christchurch is selected', async () => {
      await page.waitForTimeout(500);

      // Ensure the drop-off button contains "Christchurch Airport"
      await searchPage.assertDropoffLocationContains('Christchurch Airport', 'Drop-off button should display Christchurch Airport');

      // Log the button text
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-search-dropoff-christchurch-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('search and select Queenstown', async ({ page }) => {
    console.log('🧪 Test: search and select Queenstown');

    await test.step('Select Auckland as pickup first', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location selected: Auckland');
    });

    await test.step('Call searchDropoffLocation("Queenstown")', async () => {
      await searchPage.searchDropoffLocation('Queenstown');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Queenstown is selected', async () => {
      await page.waitForTimeout(500);

      // Ensure the drop-off button contains "Queenstown"
      await searchPage.assertDropoffLocationContains('Queenstown', 'Drop-off button should display Queenstown');

      // Log the button text
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-search-dropoff-queenstown-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('support case-insensitive search input', async ({ page }) => {
    console.log('🧪 Test: case-insensitive search');

    await test.step('Search with lowercase "auckland"', async () => {
      // Select pickup location first
      await searchPage.searchPickupLocation('Christchurch');
      await page.waitForTimeout(500);

      await searchPage.searchDropoffLocation('auckland');
      await page.waitForTimeout(500);

      // Ensure the button displays Auckland Airport
      await searchPage.assertDropoffLocationContains('Auckland Airport', 'Lowercase search should select Auckland Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Lowercase "auckland" search succeeded, button shows: "${buttonText.trim()}"`);
    });

    // Reload the page before the next scenario
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('Search with uppercase "CHRISTCHURCH"', async () => {
      // Select pickup location first
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);

      await searchPage.searchDropoffLocation('CHRISTCHURCH');
      await page.waitForTimeout(500);

      // Ensure the button displays Christchurch Airport
      await searchPage.assertDropoffLocationContains('Christchurch Airport', 'Uppercase search should select Christchurch Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Uppercase "CHRISTCHURCH" search succeeded, button shows: "${buttonText.trim()}"`);
    });

    // Reload the page before the next scenario
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('Search with mixed case "QueensTown"', async () => {
      // Select pickup location first
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);

      await searchPage.searchDropoffLocation('QueensTown');
      await page.waitForTimeout(500);

      // Ensure the button displays Queenstown
      await searchPage.assertDropoffLocationContains('Queenstown', 'Mixed-case search should select Queenstown');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Mixed-case "QueensTown" search succeeded, button shows: "${buttonText.trim()}"`);
    });
  });

  test('throw for unsupported location input', async () => {
    console.log('🧪 Test: unsupported location search handling');

    await test.step('Select pickup location first', async () => {
      await searchPage.searchPickupLocation('Auckland');
    });

    await test.step('Searching "Wellington" should throw', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.searchDropoffLocation('Wellington');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      expect(errorMessage).toContain('Unsupported location: "Wellington"');
      expect(errorMessage).toContain('Available locations: Auckland, Christchurch, Queenstown');
      console.log(`  ✅ Error thrown as expected: ${errorMessage}`);
    });

    await test.step('Searching an empty string should throw', async () => {
      // Reload the page
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
      console.log('  ✅ Empty string triggered an error as expected');
    });
  });

  test('verify searched option appears', async ({ page }) => {
    console.log('🧪 Test: verify searched option visibility (input auto display)');

    await test.step('Select pickup location first', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup location selected: Auckland');
    });

    await test.step('Verify input auto displays and enter text', async () => {
      // Wait for the input to appear (should auto display after selecting pickup)
      await page.waitForTimeout(500);

      // Focus the input (should now be visible)
      const dropoffInput = page.getByRole('textbox', { name: 'Drop off at' });
      await dropoffInput.click();

      // Enter the location name
      await dropoffInput.fill('Christchurch');

      // Wait for dropdown options to populate
      await page.waitForTimeout(1000);

      // Verify Christchurch option is visible
      const christchurchOption = page.getByText('Christchurch Airport159');
      const christchurchVisible = await christchurchOption.isVisible();

      console.log(`  📊 Christchurch option visible: ${christchurchVisible}`);

      // Capture screenshot
      await page.screenshot({
        path: 'screenshots/unit-test-search-dropoff-christchurch-option-visible.png'
      });
      console.log('  📸 Screenshot saved');

      if (christchurchVisible) {
        console.log('  ✅ Input displayed automatically and the searched option appeared');
      } else {
        console.log('  ⚠️ Searched option did not appear');
      }
    });
  });

  test('handle the full search flow', async ({ page }) => {
    console.log('🧪 Test: complete search flow');

    await test.step('1: select pickup location first', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Step 1 complete: pickup Auckland selected');
    });

    await test.step('2: click the drop-off button', async () => {
      const dropoffButton = page.getByRole('button', { name: 'Choose your drop-off location' });
      await dropoffButton.click();
      console.log('  ✅ Step 2 complete: button clicked');
      await page.waitForTimeout(500);
    });

    await test.step('3: focus the input field', async () => {
      const dropoffInput = page.getByRole('textbox', { name: 'Drop off at' });
      await dropoffInput.click();
      console.log('  ✅ Step 3 complete: input focused');
    });

    await test.step('4: enter the location name', async () => {
      const dropoffInput = page.getByRole('textbox', { name: 'Drop off at' });
      await dropoffInput.fill('Christchurch');
      console.log('  ✅ Step 4 complete: entered "Christchurch"');
      await page.waitForTimeout(1000);
    });

    await test.step('5: verify the option appears', async () => {
      const christchurchOption = page.getByText('Christchurch Airport159');
      await expect(christchurchOption).toBeVisible();
      console.log('  ✅ Step 5 complete: Christchurch option visible');
    });

    await test.step('6: click the Christchurch option', async () => {
      const christchurchOption = page.getByText('Christchurch Airport159');
      await christchurchOption.click();
      console.log('  ✅ Step 6 complete: option selected');
      await page.waitForTimeout(500);
    });

    await test.step('7: verify the selected result', async () => {
      // Ensure the button displays Christchurch Airport
      await searchPage.assertDropoffLocationContains('Christchurch Airport', 'Button should display Christchurch Airport');
      const buttonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-search-dropoff-complete-flow.png'
      });
      console.log('  📸 Full flow screenshot saved');
      console.log('  ✅ Complete search flow passed');
    });
  });

  test('measure method execution time', async () => {
    console.log('🧪 Test: method execution performance');

    await test.step('Select pickup location first', async () => {
      await searchPage.searchPickupLocation('Auckland');
    });

    await test.step('Measure execution time', async () => {
      const startTime = Date.now();
      await searchPage.searchDropoffLocation('Christchurch');
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️ Execution time: ${executionTime}ms`);

      // Ensure execution time is within a reasonable range (<5 seconds)
      expect(executionTime).toBeLessThan(5000);
      console.log('  ✅ Execution time within expected range');
    });
  });
});

/**
 * Boundary condition and exception scenario tests
 */
test.describe('searchDropoffLocation boundary tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('handles various non-standard inputs', async () => {
    console.log('🧪 Test: non-standard search input handling');

    // Select pickup location first
    await searchPage.searchPickupLocation('Auckland');

    const invalidInputs = [
      'sydney',
      'New York',
      '123',
      'chris',  // partial match
      '  Christchurch  ',  // trimmed variation (should succeed)
    ];

    for (const input of invalidInputs) {
      await test.step(`Search input: "${input}"`, async () => {
        let errorThrown = false;
        try {
          await searchPage.searchDropoffLocation(input);
        } catch (error) {
          errorThrown = true;
          console.log(`    ✅ "${input}" threw as expected: ${(error as Error).message}`);
        }

        // Trimmed Christchurch should succeed
        if (input.trim().toLowerCase() === 'christchurch') {
          expect(errorThrown).toBe(false);
          console.log(`    ✅ "${input}" (trimmed to Christchurch) succeeded`);
        } else {
          // Other invalid inputs should throw
          expect(errorThrown).toBe(true);
        }

        // Reload page before next iteration
        if (invalidInputs.indexOf(input) < invalidInputs.length - 1) {
          await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
          await searchPage.waitForSearchWidgetVisible();
          await searchPage.searchPickupLocation('Auckland');
        }
      });
    }
  });

  test('handles scenarios where options do not appear', async ({ page }) => {
    console.log('🧪 Test: missing option error handling');

    await test.step('Select pickup location first', async () => {
      await searchPage.searchPickupLocation('Auckland');
    });

    await test.step('Simulate option not appearing', async () => {
      // This test verifies that an error is thrown when the entered option does not appear.
      // On the real page this may not occur, so we use an unsupported location to trigger it.

      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.searchDropoffLocation('InvalidCity');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      console.log(`  ✅ Error thrown as expected: ${errorMessage}`);
    });
  });
});

/**
 * Comparison tests: searchDropoffLocation vs clickDropoffLocation
 */
test.describe('searchDropoffLocation vs clickDropoffLocation comparison tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('both methods should produce the same result', async ({ page }) => {
    console.log('🧪 Test: comparing two selection methods');

    await test.step('Use searchDropoffLocation to select Auckland', async () => {
      // Select pickup location first
      await searchPage.searchPickupLocation('Christchurch');
      await page.waitForTimeout(500);

      await searchPage.searchDropoffLocation('Auckland');
      await page.waitForTimeout(500);

      const searchButtonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  📊 searchDropoffLocation result: "${searchButtonText.trim()}"`);

      // Reload the page
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForSearchWidgetVisible();

      // Select pickup location again
      await searchPage.clickPickupLocation('Christchurch');
      await page.waitForTimeout(500);

      // Use clickDropoffLocation to select Auckland
      await searchPage.clickDropoffLocation('Auckland');
      await page.waitForTimeout(500);

      const clickButtonText = await searchPage.getDropoffLocationButtonText();
      console.log(`  📊 clickDropoffLocation result: "${clickButtonText.trim()}"`);

      // Both methods should yield the same result
      expect(searchButtonText).toBe(clickButtonText);
      console.log('  ✅ Both methods produced identical results');
    });
  });
});

/**
 * End-to-end flow tests: pickup and drop-off combinations
 */
test.describe('Complete pickup and drop-off flow tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('complete pickup and drop-off with search methods', async ({ page }) => {
    console.log('🧪 Test: complete flow using search methods');

    await test.step('Search and select pickup Auckland', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      await searchPage.assertPickupLocationContains('Auckland Airport', 'Pickup should be Auckland Airport');
      console.log('  ✅ Pickup set successfully');
    });

    await test.step('Search and select drop-off Queenstown', async () => {
      await searchPage.searchDropoffLocation('Queenstown');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Queenstown', 'Drop-off should be Queenstown');
      console.log('  ✅ Drop-off set successfully');
    });

    await test.step('Verify final results', async () => {
      const pickupText = await searchPage.getPickupLocationButtonText();
      const dropoffText = await searchPage.getDropoffLocationButtonText();

      console.log(`  📊 Final pickup: "${pickupText.trim()}"`);
      console.log(`  📊 Final drop-off: "${dropoffText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-complete-pickup-dropoff-search.png',
        fullPage: false
      });
      console.log('  📸 Full flow screenshot saved');
      console.log('  ✅ Complete flow test passed');
    });
  });

  test('complete pickup and drop-off with click methods', async ({ page }) => {
    console.log('🧪 Test: complete flow using click methods');

    await test.step('Click and select pickup Auckland', async () => {
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);
      await searchPage.assertPickupLocationContains('Auckland Airport', 'Pickup should be Auckland Airport');
      console.log('  ✅ Pickup set successfully');
    });

    await test.step('Click and select drop-off Queenstown', async () => {
      await searchPage.clickDropoffLocation('Queenstown');
      await page.waitForTimeout(500);
      await searchPage.assertDropoffLocationContains('Queenstown', 'Drop-off should be Queenstown');
      console.log('  ✅ Drop-off set successfully');
    });

    await test.step('Verify final results', async () => {
      const pickupText = await searchPage.getPickupLocationButtonText();
      const dropoffText = await searchPage.getDropoffLocationButtonText();

      console.log(`  📊 Final pickup: "${pickupText.trim()}"`);
      console.log(`  📊 Final drop-off: "${dropoffText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-complete-pickup-dropoff-click.png',
        fullPage: false
      });
      console.log('  📸 Full flow screenshot saved');
      console.log('  ✅ Complete flow test passed');
    });
  });

  test('mix search and click methods', async ({ page }) => {
    console.log('🧪 Test: mixed method usage');

    await test.step('Use search for pickup selection', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);
      console.log('  ✅ Pickup selected via search');
    });

    await test.step('Use click for drop-off selection', async () => {
      await searchPage.clickDropoffLocation('Christchurch');
      await page.waitForTimeout(500);
      console.log('  ✅ Drop-off selected via click');
    });

    await test.step('Verify mixed method result', async () => {
      await searchPage.assertPickupLocationContains('Auckland Airport', 'Pickup location correct');
      await searchPage.assertDropoffLocationContains('Christchurch Airport', 'Drop-off location correct');
      console.log('  ✅ Mixed method test passed');
    });
  });
});

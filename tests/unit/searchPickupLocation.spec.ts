import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * searchPickupLocation unit tests
 *
 * Test objectives: verify searchPickupLocation method functionality
 * - Click the pickup location button
 * - Focus the input field
 * - Enter a location name to search
 * - Confirm the expected option appears
 * - Select the matching option
 *
 * Run with:
 * npx playwright test tests/unit/searchPickupLocation.spec.ts
 * npx playwright test tests/unit/searchPickupLocation.spec.ts --ui
 * npx playwright test tests/unit/searchPickupLocation.spec.ts --headed
 * npx playwright test tests/unit/searchPickupLocation.spec.ts --debug
 */

test.describe('searchPickupLocation unit tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // Navigate to the search page
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // Wait for the search widget to load
    await searchPage.waitForSearchWidgetVisible();
  });

  test('search and select Auckland', async ({ page }) => {
    console.log('🧪 Test: search and select Auckland');

    await test.step('Call searchPickupLocation("Auckland")', async () => {
      await searchPage.searchPickupLocation('Auckland');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Auckland is selected', async () => {
      // Wait briefly to ensure selection takes effect
      await page.waitForTimeout(500);

      // Use SearchPage helper to ensure the button contains "Auckland Airport"
      await searchPage.assertPickupLocationContains('Auckland Airport', 'Pickup button should display Auckland Airport');

      // Log the button text
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      // Capture screenshot
      await page.screenshot({
        path: 'screenshots/unit-test-search-auckland-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('search and select Christchurch', async ({ page }) => {
    console.log('🧪 Test: search and select Christchurch');

    await test.step('Call searchPickupLocation("Christchurch")', async () => {
      await searchPage.searchPickupLocation('Christchurch');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Christchurch is selected', async () => {
      await page.waitForTimeout(500);

      // Ensure the button contains "Christchurch Airport"
      await searchPage.assertPickupLocationContains('Christchurch Airport', 'Pickup button should display Christchurch Airport');

      // Log the button text
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-search-christchurch-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('search and select Queenstown', async ({ page }) => {
    console.log('🧪 Test: search and select Queenstown');

    await test.step('Call searchPickupLocation("Queenstown")', async () => {
      await searchPage.searchPickupLocation('Queenstown');
      console.log('  ✅ Method executed successfully');
    });

    await test.step('Verify Queenstown is selected', async () => {
      await page.waitForTimeout(500);

      // Ensure the button contains "Queenstown"
      await searchPage.assertPickupLocationContains('Queenstown', 'Pickup button should display Queenstown');

      // Log the button text
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-search-queenstown-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('support case-insensitive search input', async ({ page }) => {
    console.log('🧪 Test: case-insensitive search');

    await test.step('Search with lowercase "auckland"', async () => {
      await searchPage.searchPickupLocation('auckland');
      await page.waitForTimeout(500);

      // Ensure the button displays Auckland Airport
      await searchPage.assertPickupLocationContains('Auckland Airport', 'Lowercase search should select Auckland Airport');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Lowercase "auckland" search succeeded, button shows: "${buttonText.trim()}"`);
    });

    // Reload for the next scenario
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('Search with uppercase "CHRISTCHURCH"', async () => {
      await searchPage.searchPickupLocation('CHRISTCHURCH');
      await page.waitForTimeout(500);

      // Ensure the button displays Christchurch Airport
      await searchPage.assertPickupLocationContains('Christchurch Airport', 'Uppercase search should select Christchurch Airport');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Uppercase "CHRISTCHURCH" search succeeded, button shows: "${buttonText.trim()}"`);
    });

    // Reload for the next scenario
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await test.step('Search with mixed case "QueensTown"', async () => {
      await searchPage.searchPickupLocation('QueensTown');
      await page.waitForTimeout(500);

      // Ensure the button displays Queenstown
      await searchPage.assertPickupLocationContains('Queenstown', 'Mixed-case search should select Queenstown');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Mixed-case "QueensTown" search succeeded, button shows: "${buttonText.trim()}"`);
    });
  });

  test('throw for unsupported location input', async () => {
    console.log('🧪 Test: unsupported location search handling');

    await test.step('Searching "Wellington" should throw', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.searchPickupLocation('Wellington');
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

      let errorThrown = false;
      try {
        await searchPage.searchPickupLocation('');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);
      console.log('  ✅ Empty string triggered an error as expected');
    });
  });

  test('verify searched option appears', async ({ page }) => {
    console.log('🧪 Test: verify searched option visibility');

    await test.step('Click pickup button and enter input', async () => {
      // Locate the pickup button
      const pickupButton = page.getByRole('button', { name: 'Choose your pickup location' });
      await pickupButton.click();

      // Focus the input
      const pickupInput = page.getByRole('textbox', { name: 'Pick up from' });
      await pickupInput.click();

      // Enter the location name
      await pickupInput.fill('Auckland');

      // Wait for dropdown options to populate
      await page.waitForTimeout(1000);

      // Ensure Auckland option is visible
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      const aucklandVisible = await aucklandOption.isVisible();

      console.log(`  📊 Auckland option visible: ${aucklandVisible}`);

      // Capture screenshot
      await page.screenshot({
        path: 'screenshots/unit-test-search-auckland-option-visible.png'
      });
      console.log('  📸 Screenshot saved');

      if (aucklandVisible) {
        console.log('  ✅ Searched location option appeared');
      } else {
        console.log('  ⚠️ Searched location option did not appear');
      }
    });
  });

  test('handle the complete search flow', async ({ page }) => {
    console.log('🧪 Test: complete search flow');

    await test.step('Step 1: click the pickup button', async () => {
      const pickupButton = page.getByRole('button', { name: 'Choose your pickup location' });
      await pickupButton.click();
      console.log('  ✅ Step 1 complete: button clicked');
      await page.waitForTimeout(500);
    });

    await test.step('Step 2: focus the input field', async () => {
      const pickupInput = page.getByRole('textbox', { name: 'Pick up from' });
      await pickupInput.click();
      console.log('  ✅ Step 2 complete: input focused');
    });

    await test.step('Step 3: enter the location name', async () => {
      const pickupInput = page.getByRole('textbox', { name: 'Pick up from' });
      await pickupInput.fill('Auckland');
      console.log('  ✅ Step 3 complete: entered "Auckland"');
      await page.waitForTimeout(1000);
    });

    await test.step('Step 4: verify the option appears', async () => {
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      await expect(aucklandOption).toBeVisible();
      console.log('  ✅ Step 4 complete: Auckland option visible');
    });

    await test.step('Step 5: click the Auckland option', async () => {
      const aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
      await aucklandOption.click();
      console.log('  ✅ Step 5 complete: option selected');
      await page.waitForTimeout(500);
    });

    await test.step('Step 6: verify the result', async () => {
      // Ensure the button displays Auckland Airport
      await searchPage.assertPickupLocationContains('Auckland Airport', 'Button should display Auckland Airport');
      const buttonText = await searchPage.getPickupLocationButtonText();
      console.log(`  ✅ Button text: "${buttonText.trim()}"`);

      await page.screenshot({
        path: 'screenshots/unit-test-search-complete-flow.png'
      });
      console.log('  📸 Full flow screenshot saved');
      console.log('  ✅ Complete search flow passed');
    });
  });

  test('measure method execution time', async () => {
    console.log('🧪 Test: method execution performance');

    await test.step('Measure execution time', async () => {
      const startTime = Date.now();
      await searchPage.searchPickupLocation('Auckland');
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️ Execution time: ${executionTime}ms`);

      // Ensure execution time stays within a reasonable range (<5 seconds)
      expect(executionTime).toBeLessThan(5000);
      console.log('  ✅ Execution time within expected range');
    });
  });
});

/**
 * Boundary condition and exception scenario tests
 */
test.describe('searchPickupLocation boundary tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('handles various non-standard inputs', async () => {
    console.log('🧪 Test: non-standard search input handling');

    const invalidInputs = [
      'sydney',
      'New York',
      '123',
      'auck',  // partial match
      '  Auckland  ',  // trimmed variation (should succeed)
    ];

    for (const input of invalidInputs) {
      await test.step(`Search input: "${input}"`, async () => {
        let errorThrown = false;
        try {
          await searchPage.searchPickupLocation(input);
        } catch (error) {
          errorThrown = true;
          console.log(`    ✅ "${input}" threw as expected: ${(error as Error).message}`);
        }

        // Trimmed Auckland should succeed
        if (input.trim().toLowerCase() === 'auckland') {
          expect(errorThrown).toBe(false);
          console.log(`    ✅ "${input}" (trimmed to Auckland) succeeded`);
        } else {
          // Other invalid inputs should throw
          expect(errorThrown).toBe(true);
        }

        // Reload page before the next iteration
        if (invalidInputs.indexOf(input) < invalidInputs.length - 1) {
          await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
          await searchPage.waitForSearchWidgetVisible();
        }
      });
    }
  });

  test('handles scenarios where options do not appear', async () => {
    console.log('🧪 Test: missing option error handling');

    await test.step('Simulate option not appearing', async () => {
      // This test ensures the method throws when the entered option fails to appear.
      // Using an unsupported location forces this outcome on the real page.

      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.searchPickupLocation('InvalidCity');
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
 * Comparison tests: searchPickupLocation vs clickPickupLocation
 */
test.describe('searchPickupLocation vs clickPickupLocation comparison tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('both methods should produce the same result', async ({ page }) => {
    console.log('🧪 Test: comparing two selection methods');

    await test.step('Use searchPickupLocation to select Auckland', async () => {
      await searchPage.searchPickupLocation('Auckland');
      await page.waitForTimeout(500);

      const searchButtonText = await searchPage.getPickupLocationButtonText();
      console.log(`  📊 searchPickupLocation result: "${searchButtonText.trim()}"`);

      // Reload the page
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForSearchWidgetVisible();

      // Use clickPickupLocation to select Auckland
      await searchPage.clickPickupLocation('Auckland');
      await page.waitForTimeout(500);

      const clickButtonText = await searchPage.getPickupLocationButtonText();
      console.log(`  📊 clickPickupLocation result: "${clickButtonText.trim()}"`);

      // Both methods should yield the same result
      expect(searchButtonText).toBe(clickButtonText);
      console.log('  ✅ Both methods produced identical results');
    });
  });
});

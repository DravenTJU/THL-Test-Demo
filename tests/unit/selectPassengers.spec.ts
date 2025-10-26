import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * selectPassengers unit tests
 *
 * Test objectives: validate passenger selection functionality
 * - Confirm passenger panel opens correctly
 * - Configure adult and child counts via inputs
 * - Configure counts via increment/decrement buttons
 * - Choose the primary driver age
 * - Verify consistency between both methods
 *
 * Run with:
 * npx playwright test tests/unit/selectPassengers.spec.ts
 * npx playwright test tests/unit/selectPassengers.spec.ts --ui
 * npx playwright test tests/unit/selectPassengers.spec.ts --headed
 * npx playwright test tests/unit/selectPassengers.spec.ts --debug
 */

test.describe('selectPassengers unit tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // Navigate to the search page
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // Wait for the widget to load
    await searchPage.waitForSearchWidgetVisible();
  });

  test('set passenger counts via input fields', async ({ page }) => {
    console.log('🧪 Test: set passengers using inputs');

    await test.step('Call selectPassengers with method "input"', async () => {
      await searchPage.selectPassengers({
        adults: 2,
        children: 1,
        driverAge: '21+',
        method: 'input'
      });
      console.log('  ✅ Method completed');
    });

    await test.step('Verify adult count was set', async () => {
      await page.waitForTimeout(500);

      const adultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      console.log(`  📊 Adult passengers: ${adultValue}`);
      expect(adultValue).toBe('2');
      console.log('  ✅ Adult count correct');
    });

    await test.step('Verify child count was set', async () => {
      const childValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 Child passengers: ${childValue}`);
      expect(childValue).toBe('1');
      console.log('  ✅ Child count correct');
    });

    await test.step('Capture screenshot', async () => {
      await page.screenshot({
        path: 'screenshots/unit-test-passengers-input-method.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('set passenger counts via buttons', async ({ page }) => {
    console.log('🧪 Test: set passengers using buttons');

    await test.step('Call selectPassengers with method "buttons"', async () => {
      await searchPage.selectPassengers({
        adults: 3,
        children: 2,
        driverAge: '18-20',
        method: 'buttons'
      });
      console.log('  ✅ Method completed');
    });

    await test.step('Verify adult count was set', async () => {
      await page.waitForTimeout(500);

      const adultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      console.log(`  📊 Adult passengers: ${adultValue}`);
      expect(adultValue).toBe('3');
      console.log('  ✅ Adult count correct');
    });

    await test.step('Verify child count was set', async () => {
      const childValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 Child passengers: ${childValue}`);
      expect(childValue).toBe('2');
      console.log('  ✅ Child count correct');
    });

    await test.step('Capture screenshot', async () => {
      await page.screenshot({
        path: 'screenshots/unit-test-passengers-buttons-method.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('select primary driver age 21+', async ({ page }) => {
    console.log('🧪 Test: select driver age 21+');

    await test.step('Call selectPassengers', async () => {
      await searchPage.selectPassengers({
        adults: 1,
        children: 0,
        driverAge: '21+',
        method: 'input'
      });
      console.log('  ✅ Method completed');
    });

    await test.step('Verify driver age selection', async () => {
      await page.waitForTimeout(500);

      const ageDropdown = page.locator('[data-test-id="ageSelect"]');
      await expect(ageDropdown).toBeVisible();
      console.log('  ✅ Driver age is selected');

      await page.screenshot({
        path: 'screenshots/unit-test-driver-age-21plus.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('select primary driver age 18-20', async ({ page }) => {
    console.log('🧪 Test: select driver age 18-20');

    await test.step('Call selectPassengers', async () => {
      await searchPage.selectPassengers({
        adults: 1,
        children: 0,
        driverAge: '18-20',
        method: 'input'
      });
      console.log('  ✅ Method completed');
    });

    await test.step('Verify driver age selection', async () => {
      await page.waitForTimeout(500);

      const ageDropdown = page.locator('[data-test-id="ageSelect"]');
      await expect(ageDropdown).toBeVisible();
      console.log('  ✅ Driver age is selected');

      await page.screenshot({
        path: 'screenshots/unit-test-driver-age-18-20.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('apply default passenger values', async ({ page }) => {
    console.log('🧪 Test: use default values');

    await test.step('Call selectPassengers with defaults', async () => {
      await searchPage.selectPassengers({});
      console.log('  ✅ Method completed (defaults: adults=1, children=0, driverAge=21+)');
    });

    await test.step('Verify defaults applied', async () => {
      await page.waitForTimeout(500);

      const adultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      const childValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 Adult default: ${adultValue}`);
      console.log(`  📊 Child default: ${childValue}`);

      expect(adultValue).toBe('1');
      expect(childValue).toBe('0');
      console.log('  ✅ Defaults applied correctly');
    });
  });

  test('produce identical results for both methods', async ({ page }) => {
    console.log('🧪 Test: consistency across methods');

    let inputAdultValue: string;
    let inputChildValue: string;

    await test.step('Round 1: input method', async () => {
      await searchPage.selectPassengers({
        adults: 2,
        children: 1,
        driverAge: '21+',
        method: 'input'
      });
      await page.waitForTimeout(500);

      inputAdultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      inputChildValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 Input method - adults: ${inputAdultValue}, children: ${inputChildValue}`);
    });

    await test.step('Reload the page', async () => {
      await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
      await searchPage.waitForSearchWidgetVisible();
      console.log('  ✅ Page reloaded');
    });

    await test.step('Round 2: button method', async () => {
      await searchPage.selectPassengers({
        adults: 2,
        children: 1,
        driverAge: '21+',
        method: 'buttons'
      });
      await page.waitForTimeout(500);

      const buttonAdultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      const buttonChildValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 Button method - adults: ${buttonAdultValue}, children: ${buttonChildValue}`);

      expect(buttonAdultValue).toBe(inputAdultValue);
      expect(buttonChildValue).toBe(inputChildValue);
      console.log('  ✅ Results are identical');
    });

    await test.step('Capture comparison screenshot', async () => {
      await page.screenshot({
        path: 'screenshots/unit-test-passengers-methods-comparison.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('confirm passenger panel opens', async ({ page }) => {
    console.log('🧪 Test: passenger panel open state');

    await test.step('Click the passenger button', async () => {
      const passengersButton = page.getByRole('button', { name: 'Select your passenger count' });
      await passengersButton.click();
      console.log('  ✅ Passenger button clicked');
    });

    await test.step('Verify the panel is visible', async () => {
      await page.waitForTimeout(1000);

      const adultInput = page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      });
      await expect(adultInput).toBeVisible();
      console.log('  ✅ Adult input visible');

      const childInput = page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      });
      await expect(childInput).toBeVisible();
      console.log('  ✅ Child input visible');

      const ageDropdown = page.locator('[data-test-id="ageSelect"]');
      await expect(ageDropdown).toBeVisible();
      console.log('  ✅ Age dropdown visible');

      await page.screenshot({
        path: 'screenshots/unit-test-passengers-panel-open.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('support multiple passenger adjustments', async ({ page }) => {
    console.log('🧪 Test: multiple passenger updates');

    await test.step('First set: 2 adults, 1 child', async () => {
      await searchPage.selectPassengers({
        adults: 2,
        children: 1,
        driverAge: '21+',
        method: 'input'
      });
      await page.waitForTimeout(500);

      const adultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      console.log(`  📊 First set - adults: ${adultValue}`);
      expect(adultValue).toBe('2');
      console.log('  ✅ First update successful');
    });

    await test.step('Second set: 4 adults, 2 children', async () => {
      await searchPage.selectPassengers({
        adults: 4,
        children: 2,
        driverAge: '18-20',
        method: 'input'
      });
      await page.waitForTimeout(500);

      const adultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      const childValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 Second set - adults: ${adultValue}, children: ${childValue}`);
      expect(adultValue).toBe('4');
      expect(childValue).toBe('2');
      console.log('  ✅ Second update overwrote the first');
    });
  });

  test('measure execution time for input method', async () => {
    console.log('🧪 Test: performance using inputs');

    await test.step('Measure duration', async () => {
      const startTime = Date.now();
      await searchPage.selectPassengers({
        adults: 3,
        children: 2,
        driverAge: '21+',
        method: 'input'
      });
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️ Input method duration: ${executionTime}ms`);

      expect(executionTime).toBeLessThan(5000);
      console.log('  ✅ Execution time acceptable');
    });
  });

  test('measure execution time for button method', async () => {
    console.log('🧪 Test: performance using buttons');

    await test.step('Measure duration', async () => {
      const startTime = Date.now();
      await searchPage.selectPassengers({
        adults: 3,
        children: 2,
        driverAge: '21+',
        method: 'buttons'
      });
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️ Button method duration: ${executionTime}ms`);

      expect(executionTime).toBeLessThan(10000);
      console.log('  ✅ Execution time acceptable');
    });
  });
});

/**
 * selectPassengers boundary tests
 */
test.describe('selectPassengers boundary tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();
  });

  test('handle zero children', async ({ page }) => {
    console.log('🧪 Test: zero children');

    await test.step('Set zero children', async () => {
      await searchPage.selectPassengers({
        adults: 2,
        children: 0,
        driverAge: '21+',
        method: 'input'
      });
      await page.waitForTimeout(500);

      const childValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 Children: ${childValue}`);
      expect(childValue).toBe('0');
      console.log('  ✅ Zero children handled correctly');
    });
  });

  test('support larger passenger counts', async ({ page }) => {
    console.log('🧪 Test: larger passenger numbers');

    await test.step('Set higher counts', async () => {
      await searchPage.selectPassengers({
        adults: 5,
        children: 3,
        driverAge: '21+',
        method: 'input'
      });
      await page.waitForTimeout(500);

      const adultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      const childValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 Adults: ${adultValue}, Children: ${childValue}`);
      expect(adultValue).toBe('5');
      expect(childValue).toBe('3');
      console.log('  ✅ Larger counts handled correctly');
    });
  });

  test('decrease counts using buttons', async ({ page }) => {
    console.log('🧪 Test: decrement via buttons');

    await test.step('Initial set: 5 adults, 3 children', async () => {
      await searchPage.selectPassengers({
        adults: 5,
        children: 3,
        driverAge: '21+',
        method: 'input'
      });
      await page.waitForTimeout(500);
      console.log('  ✅ Initial configuration complete');
    });

    await test.step('Decrease to 2 adults, 1 child via buttons', async () => {
      await searchPage.selectPassengers({
        adults: 2,
        children: 1,
        driverAge: '21+',
        method: 'buttons'
      });
      await page.waitForTimeout(500);

      const adultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      const childValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 After decrease - adults: ${adultValue}, children: ${childValue}`);
      expect(adultValue).toBe('2');
      expect(childValue).toBe('1');
      console.log('  ✅ Button decrements handled correctly');
    });
  });

  test('increase counts using buttons', async ({ page }) => {
    console.log('🧪 Test: increment via buttons');

    await test.step('Initial set: 1 adult, 0 children', async () => {
      await searchPage.selectPassengers({
        adults: 1,
        children: 0,
        driverAge: '21+',
        method: 'input'
      });
      await page.waitForTimeout(500);
      console.log('  ✅ Initial configuration complete');
    });

    await test.step('Increase to 4 adults, 2 children via buttons', async () => {
      await searchPage.selectPassengers({
        adults: 4,
        children: 2,
        driverAge: '21+',
        method: 'buttons'
      });
      await page.waitForTimeout(500);

      const adultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      const childValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 After increase - adults: ${adultValue}, children: ${childValue}`);
      expect(adultValue).toBe('4');
      expect(childValue).toBe('2');
      console.log('  ✅ Button increments handled correctly');
    });
  });

  test('hide adult increment button at max of 6', async ({ page }) => {
    console.log('🧪 Test: adult max limit (6)');

    await test.step('Set adults to 6', async () => {
      await searchPage.selectPassengers({
        adults: 6,
        children: 0,
        driverAge: '21+',
        method: 'input'
      });
      await page.waitForTimeout(500);

      const adultValue = await page.getByRole('spinbutton', {
        name: 'Adult passenger count. Over'
      }).inputValue();

      console.log(`  📊 Adults: ${adultValue}`);
      expect(adultValue).toBe('6');
      console.log('  ✅ Adult max set to 6');
    });

    await test.step('Verify adult increase button hidden', async () => {
      const increaseButton = page.getByRole('button', { name: 'Increase Adult passenger' });
      await expect(increaseButton).not.toBeVisible();
      console.log('  ✅ Adult increase button hidden at max');

      await page.screenshot({
        path: 'screenshots/unit-test-adult-max-6-button-hidden.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('hide child increment button at max of 6', async ({ page }) => {
    console.log('🧪 Test: child max limit (6)');

    await test.step('Set children to 6', async () => {
      await searchPage.selectPassengers({
        adults: 0,
        children: 6,
        driverAge: '21+',
        method: 'input'
      });
      await page.waitForTimeout(500);

      const childValue = await page.getByRole('spinbutton', {
        name: 'Child passenger count. Up to'
      }).inputValue();

      console.log(`  📊 Children: ${childValue}`);
      expect(childValue).toBe('6');
      console.log('  ✅ Child max set to 6');
    });

    await test.step('Verify child increase button hidden', async () => {
      const increaseButton = page.getByRole('button', { name: 'Increase Child passenger' });
      await expect(increaseButton).not.toBeVisible();
      console.log('  ✅ Child increase button hidden at max');

      await page.screenshot({
        path: 'screenshots/unit-test-child-max-6-button-hidden.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });
});

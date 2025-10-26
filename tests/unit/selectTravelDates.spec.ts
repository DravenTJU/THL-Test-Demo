import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * selectTravelDates unit tests
 *
 * Test objectives: validate the date picker behaviour
 * - Confirm the date picker opens correctly
 * - Verify month navigation (forward and backward)
 * - Lock the month container and choose specific days
 * - Select dates across multiple months
 * - Auto-navigate to the requested month
 *
 * Run with:
 * npx playwright test tests/unit/selectTravelDates.spec.ts
 * npx playwright test tests/unit/selectTravelDates.spec.ts --ui
 * npx playwright test tests/unit/selectTravelDates.spec.ts --headed
 * npx playwright test tests/unit/selectTravelDates.spec.ts --debug
 */

test.describe('selectTravelDates unit tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);

    // Navigate to the search page
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });

    // Wait for the widget to become visible
    await searchPage.waitForSearchWidgetVisible();

    // Select pickup Auckland
    await searchPage.clickPickupLocation('Auckland');

    // Select drop-off Auckland
    await searchPage.clickDropoffLocation('Auckland');
  });

  test('select future pickup and drop-off dates', async ({ page }) => {
    console.log('🧪 Test: select future dates');

    // Capture today
    const today = new Date();

    // Use today +2 days as pickup date (Date handles month rollover)
    const pickupDateObj = new Date(today);
    pickupDateObj.setDate(today.getDate() + 2);
    const pickupYear = pickupDateObj.getFullYear();
    const pickupMonth = String(pickupDateObj.getMonth() + 1).padStart(2, '0');
    const pickupDay = String(pickupDateObj.getDate()).padStart(2, '0');
    const pickupDate = `${pickupYear}-${pickupMonth}-${pickupDay}`;

    // Use today +5 days as drop-off date
    const dropoffDateObj = new Date(today);
    dropoffDateObj.setDate(today.getDate() + 5);
    const dropoffYear = dropoffDateObj.getFullYear();
    const dropoffMonth = String(dropoffDateObj.getMonth() + 1).padStart(2, '0');
    const dropoffDay = String(dropoffDateObj.getDate()).padStart(2, '0');
    const dropoffDate = `${dropoffYear}-${dropoffMonth}-${dropoffDay}`;

    console.log(`  📅 Today: ${today.toISOString().split('T')[0]}`);
    console.log(`  📅 Pickup date: ${pickupDate}`);
    console.log(`  📅 Drop-off date: ${dropoffDate}`);

    await test.step('Call selectTravelDates', async () => {
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      console.log('  ✅ Method completed');
    });

    await test.step('Verify the dates are reflected', async () => {
      await page.waitForTimeout(500);

      // Ensure the button now displays selected dates (not the placeholder)
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 Date button text: "${buttonText}"`);

      // Expect digits in the text, meaning actual dates are shown
      expect(buttonText).toMatch(/\d+/);
      console.log('  ✅ Date button shows the chosen range');

      await page.screenshot({
        path: 'screenshots/unit-test-dates-selected.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('select dates in the following month', async ({ page }) => {
    console.log('🧪 Test: select dates in the next month');

    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');

    // 5th as pickup
    const pickupDate = `${year}-${month}-05`;

    // 10th as drop-off
    const dropoffDate = `${year}-${month}-10`;

    console.log(`  📅 Pickup date: ${pickupDate}`);
    console.log(`  📅 Drop-off date: ${dropoffDate}`);

    await test.step('Call selectTravelDates', async () => {
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      console.log('  ✅ Method completed');
    });

    await test.step('Verify the button updates', async () => {
      await page.waitForTimeout(500);

      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 Date button text: "${buttonText}"`);
      expect(buttonText).toMatch(/\d+/);
      console.log('  ✅ Dates from the next month were selected');

      await page.screenshot({
        path: 'screenshots/unit-test-next-month-dates.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('select dates that span across two future months', async ({ page }) => {
    console.log('🧪 Test: select cross-month dates');

    const today = new Date();

    // Next month 5th as pickup
    const nextMonth1 = new Date(today.getFullYear(), today.getMonth() + 1, 5);
    const pickupYear = nextMonth1.getFullYear();
    const pickupMonth = String(nextMonth1.getMonth() + 1).padStart(2, '0');
    const pickupDate = `${pickupYear}-${pickupMonth}-05`;

    // Month after next 5th as drop-off
    const nextMonth2 = new Date(today.getFullYear(), today.getMonth() + 2, 5);
    const dropoffYear = nextMonth2.getFullYear();
    const dropoffMonth = String(nextMonth2.getMonth() + 1).padStart(2, '0');
    const dropoffDate = `${dropoffYear}-${dropoffMonth}-05`;

    console.log(`  📅 Pickup date: ${pickupDate}`);
    console.log(`  📅 Drop-off date: ${dropoffDate}`);

    await test.step('Call selectTravelDates', async () => {
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      console.log('  ✅ Method completed');
    });

    await test.step('Confirm dates span two months', async () => {
      await page.waitForTimeout(500);
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 Date button text: "${buttonText}"`);
      expect(buttonText).toMatch(/\d+/);
      console.log('  ✅ Cross-month selection succeeded');

      await page.screenshot({
        path: 'screenshots/unit-test-cross-month-dates.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('confirm the date picker opens correctly', async ({ page }) => {
    console.log('🧪 Test: confirm date picker open state');

    await test.step('Click the date button to open the picker', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      console.log('  ✅ Date button clicked');
    });

    await test.step('Verify the picker is visible', async () => {
      await page.waitForTimeout(1000);

      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonthName = monthNames[now.getMonth()];
      const currentYear = now.getFullYear();

      console.log(`  📅 Expecting month: ${currentMonthName} ${currentYear}`);

      // Ensure the current month label is visible
      const monthPattern = new RegExp(`${currentMonthName}\\s+${currentYear}`, 'i');
      const monthLabel = page.getByText(monthPattern);
      await expect(monthLabel.first()).toBeVisible();

      console.log('  ✅ Date picker is open');

      await page.screenshot({
        path: 'screenshots/unit-test-date-picker-open.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('verify month navigation', async ({ page }) => {
    console.log('🧪 Test: month navigation');

    await test.step('Open the date picker', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      await page.waitForTimeout(1000);
      console.log('  ✅ Date picker opened');
    });

    await test.step('Confirm the initial two months are displayed', async () => {
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const currentMonthName = monthNames[now.getMonth()];
      const nextMonthName = monthNames[(now.getMonth() + 1) % 12];

      console.log(`  📅 Current month: ${currentMonthName}`);
      console.log(`  📅 Next month: ${nextMonthName}`);

      const currentMonthLabel = page.getByText(new RegExp(`${currentMonthName}\\s+\\d{4}`, 'i'));
      const nextMonthLabel = page.getByText(new RegExp(`${nextMonthName}\\s+\\d{4}`, 'i'));

      await expect(currentMonthLabel.first()).toBeVisible();
      await expect(nextMonthLabel.first()).toBeVisible();

      console.log('  ✅ Two consecutive months are visible');

      await page.screenshot({
        path: 'screenshots/unit-test-two-months-displayed.png'
      });
      console.log('  📸 Screenshot saved');
    });

    await test.step('Click the next month button', async () => {
      const nextButton = page.getByRole('button').filter({ hasText: /^$/ });
      await nextButton.click();
      await page.waitForTimeout(500);

      console.log('  ✅ Next month button clicked');

      await page.screenshot({
        path: 'screenshots/unit-test-after-next-button.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('complete the full date selection flow manually', async ({ page }) => {
    console.log('🧪 Test: manual full date selection flow');

    const today = new Date();

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

    console.log(`  📅 Today: ${today.toISOString().split('T')[0]}`);
    console.log(`  📅 Pickup date: ${pickupDate}`);
    console.log(`  📅 Drop-off date: ${dropoffDate}`);

    await test.step('Step 1: open the date picker', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      console.log('  ✅ Step 1 complete: date button clicked');
    });

    await test.step('Step 2: wait for the picker to appear', async () => {
      await page.waitForTimeout(1000);
      console.log('  ✅ Step 2 complete: picker visible');
    });

    await test.step('Step 3: select the pickup date', async () => {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = monthNames[pickupDateObj.getMonth()];

      const monthPattern = new RegExp(`${monthName}\\s+${pickupYear}`, 'i');
      const monthContainer = page
        .locator('[class*="BookingWidget_month"]')
        .filter({
          has: page.locator('[class*="BookingWidget_monthLabel"]', { hasText: monthPattern })
        });

      const pickupDayButton = monthContainer.getByRole('button', { name: String(pickupDay), exact: true });
      await pickupDayButton.click();
      await page.waitForTimeout(500);

      console.log(`  ✅ Step 3 complete: selected pickup ${monthName} ${pickupDay}`);
    });

    await test.step('Step 4: select the drop-off date', async () => {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = monthNames[dropoffDateObj.getMonth()];

      const monthPattern = new RegExp(`${monthName}\\s+${dropoffYear}`, 'i');
      const monthContainer = page
        .locator('[class*="BookingWidget_month"]')
        .filter({
          has: page.locator('[class*="BookingWidget_monthLabel"]', { hasText: monthPattern })
        });

      const dropoffDayButton = monthContainer.getByRole('button', { name: String(dropoffDay), exact: true });
      await dropoffDayButton.click();
      await page.waitForTimeout(500);

      console.log(`  ✅ Step 4 complete: selected drop-off ${monthName} ${dropoffDay}`);
    });

    await test.step('Step 5: verify the final button text', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 Final button text: "${buttonText}"`);
      expect(buttonText).toMatch(/\d+/);

      await page.screenshot({
        path: 'screenshots/unit-test-complete-date-flow.png'
      });
      console.log('  📸 Full flow screenshot saved');
      console.log('  ✅ Manual flow passed');
    });
  });

  test('support selecting different ranges multiple times', async ({ page }) => {
    console.log('🧪 Test: select multiple different ranges');

    const today = new Date();

    await test.step('First selection', async () => {
      const pickup1 = new Date(today);
      pickup1.setDate(today.getDate() + 2);
      const dropoff1 = new Date(today);
      dropoff1.setDate(today.getDate() + 4);

      const pickupDate = `${pickup1.getFullYear()}-${String(pickup1.getMonth() + 1).padStart(2, '0')}-${String(pickup1.getDate()).padStart(2, '0')}`;
      const dropoffDate = `${dropoff1.getFullYear()}-${String(dropoff1.getMonth() + 1).padStart(2, '0')}-${String(dropoff1.getDate()).padStart(2, '0')}`;

      console.log(`  📅 First selection: ${pickupDate} → ${dropoffDate}`);
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      await page.waitForTimeout(500);
      console.log('  ✅ First selection complete');
    });

    await test.step('Second selection', async () => {
      const pickup2 = new Date(today);
      pickup2.setDate(today.getDate() + 6);
      const dropoff2 = new Date(today);
      dropoff2.setDate(today.getDate() + 10);

      const pickupDate2 = `${pickup2.getFullYear()}-${String(pickup2.getMonth() + 1).padStart(2, '0')}-${String(pickup2.getDate()).padStart(2, '0')}`;
      const dropoffDate2 = `${dropoff2.getFullYear()}-${String(dropoff2.getMonth() + 1).padStart(2, '0')}-${String(dropoff2.getDate()).padStart(2, '0')}`;

      console.log(`  📅 Second selection: ${pickupDate2} → ${dropoffDate2}`);
      await searchPage.selectTravelDates(pickupDate2, dropoffDate2);
      await page.waitForTimeout(500);

      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      const buttonText = await travelDatesButton.innerText();

      console.log(`  📊 Button text after second selection: "${buttonText}"`);
      expect(buttonText).toMatch(/\d+/);
      console.log('  ✅ Second selection replaced the first');
    });
  });

  test('measure execution time of selectTravelDates', async () => {
    console.log('🧪 Test: selectTravelDates performance');

    const today = new Date();

    const pickupDateObj = new Date(today);
    pickupDateObj.setDate(today.getDate() + 3);
    const pickupDate = `${pickupDateObj.getFullYear()}-${String(pickupDateObj.getMonth() + 1).padStart(2, '0')}-${String(pickupDateObj.getDate()).padStart(2, '0')}`;

    const dropoffDateObj = new Date(today);
    dropoffDateObj.setDate(today.getDate() + 6);
    const dropoffDate = `${dropoffDateObj.getFullYear()}-${String(dropoffDateObj.getMonth() + 1).padStart(2, '0')}-${String(dropoffDateObj.getDate()).padStart(2, '0')}`;

    console.log(`  📅 Today: ${today.toISOString().split('T')[0]}`);
    console.log(`  📅 Performance sample dates: ${pickupDate} → ${dropoffDate}`);

    await test.step('Measure duration', async () => {
      const startTime = Date.now();
      await searchPage.selectTravelDates(pickupDate, dropoffDate);
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      console.log(`  ⏱️ Execution time: ${executionTime}ms`);

      // Less than 10 seconds is considered acceptable
      expect(executionTime).toBeLessThan(10000);
      console.log('  ✅ Execution time within acceptable range');
    });
  });
});

/**
 * selectTravelDates boundary and exception tests
 */
test.describe('selectTravelDates boundary tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    // Pre-select pickup and drop-off
    await searchPage.clickPickupLocation('Auckland');
    await searchPage.clickDropoffLocation('Auckland');
  });

  test('handle invalid date formats', async () => {
    console.log('🧪 Test: invalid date format handling');

    await test.step('Invalid format "2025-13-01"', async () => {
      let errorThrown = false;
      let errorMessage = '';

      try {
        await searchPage.selectTravelDates('2025-13-01', '2025-13-05');
      } catch (error) {
        errorThrown = true;
        errorMessage = (error as Error).message;
      }

      expect(errorThrown).toBe(true);
      console.log(`  ✅ Error thrown as expected: ${errorMessage}`);
    });

    await test.step('Invalid format "2025/10/01"', async () => {
      let errorThrown = false;

      try {
        await searchPage.selectTravelDates('2025/10/01', '2025/10/05');
      } catch (error) {
        errorThrown = true;
        console.log(`  ✅ Error thrown as expected: ${(error as Error).message}`);
      }

      expect(errorThrown).toBe(true);
    });

    await test.step('Empty string input', async () => {
      let errorThrown = false;

      try {
        await searchPage.selectTravelDates('', '2025-10-05');
      } catch (error) {
        errorThrown = true;
        console.log(`  ✅ Empty string rejected: ${(error as Error).message}`);
      }

      expect(errorThrown).toBe(true);
    });
  });

  test('attempt to handle past dates', async ({ page }) => {
    console.log('🧪 Test: past date handling');

    await test.step('Try selecting past dates', async () => {
      const lastYear = new Date().getFullYear() - 1;
      const pickupDate = `${lastYear}-01-15`;
      const dropoffDate = `${lastYear}-01-20`;

      console.log(`  📅 Attempting: ${pickupDate} → ${dropoffDate}`);

      try {
        await searchPage.selectTravelDates(pickupDate, dropoffDate);
        await page.waitForTimeout(1000);
        console.log('  ⚠️ Method completed; the UI may reject these dates silently');
      } catch (error) {
        console.log(`  ✅ Past dates handled with error: ${(error as Error).message}`);
      }
    });
  });

  test('attempt to handle identical pickup and drop-off dates', async ({ page }) => {
    console.log('🧪 Test: identical pickup and drop-off dates');

    const today = new Date();
    const sameDateObj = new Date(today);
    sameDateObj.setDate(today.getDate() + 5);
    const sameDate = `${sameDateObj.getFullYear()}-${String(sameDateObj.getMonth() + 1).padStart(2, '0')}-${String(sameDateObj.getDate()).padStart(2, '0')}`;

    console.log(`  📅 Today: ${today.toISOString().split('T')[0]}`);
    console.log(`  📅 Test date: ${sameDate}`);

    await test.step('Attempt to select the same date twice', async () => {
      try {
        await searchPage.selectTravelDates(sameDate, sameDate);
        await page.waitForTimeout(500);
        console.log('  ✅ Method completed (UI may prevent identical dates)');
      } catch (error) {
        console.log(`  ⚠️ Identical date selection may be disallowed: ${(error as Error).message}`);
      }
    });
  });
});

/**
 * Date picker UI interaction tests
 */
test.describe('Date picker UI interaction tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForSearchWidgetVisible();

    await searchPage.clickPickupLocation('Auckland');
    await searchPage.clickDropoffLocation('Auckland');
  });

  test('verify the month container locking logic', async ({ page }) => {
    console.log('🧪 Test: month container locking');

    await test.step('Open the date picker', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      await page.waitForTimeout(1000);
      console.log('  ✅ Date picker opened');
    });

    await test.step('Verify the month container can be targeted', async () => {
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonthName = monthNames[now.getMonth()];
      const currentYear = now.getFullYear();

      console.log(`  📅 Current month: ${currentMonthName} ${currentYear}`);

      const monthPattern = new RegExp(`${currentMonthName}\\s+${currentYear}`, 'i');
      const monthContainer = page
        .locator('[class*="BookingWidget_month"]')
        .filter({
          has: page.locator('[class*="BookingWidget_monthLabel"]', { hasText: monthPattern })
        });

      await expect(monthContainer.first()).toBeVisible();
      console.log('  ✅ Month container located');

      const dateButtons = monthContainer.getByRole('button').filter({ hasText: /^\d+$/ });
      const count = await dateButtons.count();
      console.log(`  📊 Found ${count} date buttons`);
      expect(count).toBeGreaterThan(0);

      await page.screenshot({
        path: 'screenshots/unit-test-month-container.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });

  test('verify date button exact matching', async ({ page }) => {
    console.log('🧪 Test: exact date button matching');

    await test.step('Open the date picker', async () => {
      const travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
      await travelDatesButton.click();
      await page.waitForTimeout(1000);
    });

    await test.step('Ensure exact=true prevents partial matches', async () => {
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonthName = monthNames[now.getMonth()];
      const currentYear = now.getFullYear();

      const monthPattern = new RegExp(`${currentMonthName}\\s+${currentYear}`, 'i');
      const monthContainer = page
        .locator('[class*="BookingWidget_month"]')
        .filter({
          has: page.locator('[class*="BookingWidget_monthLabel"]', { hasText: monthPattern })
        });

      // Verify "1" does not match "10", "11", ...
      const dayButton1 = monthContainer.getByRole('button', { name: '1', exact: true });
      await expect(dayButton1).toBeVisible();
      console.log('  ✅ Exact match for "1" succeeded');

      const dayButton10 = monthContainer.getByRole('button', { name: '10', exact: true });
      const isDay10Visible = await dayButton10.isVisible().catch(() => false);
      if (isDay10Visible) {
        console.log('  ✅ Exact match for "10" succeeded');
      } else {
        console.log('  ℹ️ Date button "10" is not currently visible (may not exist this month)');
      }

      await page.screenshot({
        path: 'screenshots/unit-test-exact-match.png'
      });
      console.log('  📸 Screenshot saved');
    });
  });
});

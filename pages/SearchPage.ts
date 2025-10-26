import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SearchPage class - Maui Rentals search page object
 *
 * Encapsulates all element locators and actions for the search page
 * Provides clear business operation interfaces
 *
 * @class SearchPage
 * @extends BasePage
 */
export class SearchPage extends BasePage {
  // ============ Pickup ============

  /** Pickup location button */
  private readonly pickupLocationButton: Locator;

  /** Pickup location input */
  private readonly pickupLocationInput: Locator;

  // ============ Dropoff ============

  /** Dropoff location button */
  private readonly dropoffLocationButton: Locator;

  /** Dropoff location input */
  private readonly dropoffLocationInput: Locator;

  // ============ Location dropdown options ============

  /** Choose a different location button */
  private readonly chooseDifferentLocationButton: Locator;

  /** Auckland option */
  private readonly aucklandOption: Locator;

  /** Christchurch option */
  private readonly christchurchOption: Locator;

  /** Queenstown option */
  private readonly queenstownOption: Locator;

  // ============ Dates ============

  /** Travel dates button */
  private readonly travelDatesButton: Locator;

  /** Next month button (initial state) */
  private readonly nextMonthButton1: Locator;

  /** Next month button (after one click) */
  private readonly nextMonthButton2: Locator;

  /** Previous month button (appears after clicking next month) */
  private readonly lastMonthButton: Locator;

  // ============ Passengers ============

  /** Passenger selector button */
  private readonly passengersButton: Locator;

  /** Adult passenger input */
  private readonly adultPassengersInput: Locator;

  /** Child passenger input */
  private readonly childPassengersInput: Locator;

  /** Adult passenger increase button */
  private readonly adultPassengersIncreaseButton: Locator;

  /** Adult passenger decrease button */
  private readonly adultPassengersDecreaseButton: Locator;

  /** Child passenger increase button */
  private readonly childPassengersIncreaseButton: Locator;

  /** Child passenger decrease button */
  private readonly childPassengersDecreaseButton: Locator;

  // ============ Driver age ============

  /** Driver age dropdown */
  private readonly driverAgeDropdown: Locator;

  /** Age option 18-20 */
  private readonly driverAgeOption18_20: Locator;

  /** Age option 21+ */
  private readonly driverAgeOption21: Locator;

  // ============ Licence ============

  /** Licence country button */
  private readonly licenceButton: Locator;

  /** Licence country option New Zealand */
  private readonly licenceOptionNewZealand: Locator;

  /** Licence country option Australia */
  private readonly licenceOptionAustralia: Locator;

  /** Licence country option France */
  private readonly licenceOptionFrance: Locator;

  /** Licence country option United Kingdom */
  private readonly licenceOptionUnitedKingdom: Locator;

  // ============ Promo code ============

  /** Promo code button */
  private readonly promoCodeButton: Locator;

  /** Promo code input */
  private readonly promoCodeInput: Locator;

  // ============ Search ============

  /** Search button */
  private readonly searchButton: Locator;

  // ============ Results and messages ============

  /** Results container */
  private readonly resultsContainer: Locator;

  /** Error message */
  private readonly errorMessage: Locator;

  /** Loading indicator */
  private readonly loadingIndicator: Locator;

  /** Pickup location missing notice */
  private readonly pickupLocationNotice: Locator;

  /** Dropoff location missing notice */
  private readonly dropoffLocationNotice: Locator;

  /** Travel dates missing notice */
  private readonly travelDatesNotice: Locator;

  /** Passenger selection missing notice */
  private readonly passengersNotice: Locator;

  /** Passenger count exceeds maximum notice */
  private readonly passengersMaxNotice: Locator;

  /** Driver age missing notice */
  private readonly driverAgeNotice: Locator;

  /** Licence missing notice */
  private readonly licenceNotice: Locator;

  constructor(page: Page) {
    super(page);

    // ============ Initialize interactive elements ============

    // ============ Pickup ============

    this.pickupLocationButton = page.getByRole('button', { name: 'Choose your pickup location' });
    this.pickupLocationInput = page.getByRole('textbox', { name: 'Pick up from' });

    // ============ Dropoff ============

    this.dropoffLocationButton = page.getByRole('button', { name: 'Choose your dropoff location' });
    this.dropoffLocationInput = page.getByRole('textbox', { name: 'Drop off to' });

    // ============ Location dropdown options ============

    this.chooseDifferentLocationButton = page.getByRole('button', { name: 'Choose a different location' });
    this.aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
    this.christchurchOption = page.getByText('Christchurch Airport159');
    this.queenstownOption = page.getByText('Queenstown50 Lucas Place,');

    // ============ Dates ============

    this.travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
    this.nextMonthButton1 = page.getByRole('button').filter({ hasText: /^$/ });
    this.nextMonthButton2 = page.getByRole('button').nth(4);
    this.lastMonthButton = page.getByRole('button').nth(3);

    // ============ Passengers ============

    this.passengersButton = page.getByRole('button', { name: 'Select your passenger count' });
    this.adultPassengersInput = page.getByRole('spinbutton', { name: 'Adult passenger count. Over' });
    this.childPassengersInput = page.getByRole('spinbutton', { name: 'Child passenger count. Up to' });
    this.adultPassengersIncreaseButton = page.getByRole('button', { name: 'Increase Adult passenger' });
    this.adultPassengersDecreaseButton = page.getByRole('button', { name: 'Decrease Adult passenger' });
    this.childPassengersIncreaseButton = page.getByRole('button', { name: 'Increase Child passenger' });
    this.childPassengersDecreaseButton = page.getByRole('button', { name: 'Decrease Child passenger' });

    // ============ Driver age ============

    this.driverAgeDropdown = page.locator('[data-test-id="ageSelect"]');
    this.driverAgeOption18_20 = page.getByRole('button', { name: '-20' });
    this.driverAgeOption21 = page.getByRole('button', { name: '+' });

    // ============ Licence ============
    this.licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
    this.licenceOptionNewZealand = page.locator('button').filter({ hasText: 'New Zealand' });
    this.licenceOptionAustralia = page.locator('button').filter({ hasText: 'Australia' });
    this.licenceOptionFrance = page.locator('button').filter({ hasText: 'France' });
    this.licenceOptionUnitedKingdom = page.locator('button').filter({ hasText: 'United Kingdom' });

    // ============ Promo code ============
    this.promoCodeButton = page.getByText('Promo codeSearch');
    this.promoCodeInput = page.getByRole('textbox', { name: 'promo code optional' });

    // ============ Search ============
    this.searchButton = page.getByRole('button', { name: 'Start your search' });

    // ============ Results and messages ============
    this.resultsContainer = page.locator('[data-testid="search-results"]');
    this.errorMessage = page.locator('[role="alert"]');
    this.loadingIndicator = page.locator('[data-testid="loading"]');
    this.pickupLocationNotice = page.getByText('Please select your Pick up');
    this.dropoffLocationNotice = page.getByText('Please select your Drop off');
    this.travelDatesNotice = page.getByText('PICK-UP DATE');
    this.passengersNotice = page.getByText('Increase Adult passengers');
    this.passengersMaxNotice = page.getByText('Max total passengers is');
    this.driverAgeNotice = page.getByText('Please select the Main Driver');
    this.licenceNotice = page.getByText('Please select Drivers licence');
  }

  // ============================================
  // Page navigation methods
  // ============================================

  /**
   * Navigate to the search page
   * @param options - URL parameter options
   * @param options.cc - Country code (for example 'nz' for New Zealand)
   * @param options.mobile - Whether to open the mobile view
   */
  async navigateToSearchPage(options?: { cc?: string; mobile?: boolean }): Promise<void> {
    let path = '/';
    const params = new URLSearchParams();

    if (options?.cc) {
      params.append('cc', options.cc);
    }
    if (options?.mobile) {
      params.append('open-mobile', 'true');
    }

    if (params.toString()) {
      path += `?${params.toString()}`;
    }

    await this.navigate(path);
    await this.waitForPageLoad();
    await this.waitForSearchWidgetVisible();
  }

  /**
   * Wait for the search widget to be visible
   * Verify that key buttons have loaded
   */
  async waitForSearchWidgetVisible(): Promise<void> {
    await this.waitForVisible(this.pickupLocationButton, 15000);
    await this.waitForVisible(this.searchButton, 15000);
  }

  // ============================================
  // Location selection methods
  // ============================================

  /**
   * Click to choose the pickup location (select directly from the dropdown)
   *
   * Interaction steps:
   * 1. Click the pickup location button
   * 2. Check whether the "Choose a different location" button appears (shown when a location is already selected)
   * 3. If the button appears, click it to expand the full location list
   * 4. Ensure all three location options appear in the dropdown
   * 5. Select the matching location option based on the input
   *
   * @param location - Location name (for example "Auckland", "Christchurch", "Queenstown")
   * @throws If the three options are not all visible or the location is not supported
   */
  async clickPickupLocation(location: string): Promise<void> {
    // Click the button to open the location selector
    await this.click(this.pickupLocationButton);

    // Wait for the dropdown options or the "Choose a different location" button
    await this.page.waitForTimeout(1000);

    // Check if the "Choose a different location" button appears
    const isDifferentLocationButtonVisible = await this.isVisible(this.chooseDifferentLocationButton);
    if (isDifferentLocationButtonVisible) {
      // Click "Choose a different location" to expand the full list
      await this.click(this.chooseDifferentLocationButton);
      await this.page.waitForTimeout(500);
    }

    // Verify that all three location options appear
    const aucklandVisible = await this.isVisible(this.aucklandOption);
    const christchurchVisible = await this.isVisible(this.christchurchOption);
    const queenstownVisible = await this.isVisible(this.queenstownOption);

    if (!aucklandVisible || !christchurchVisible || !queenstownVisible) {
      throw new Error(
        `Not all location options are visible. Auckland: ${aucklandVisible}, Christchurch: ${christchurchVisible}, Queenstown: ${queenstownVisible}`
      );
    }

    // Select the matching option based on the input
    let selectedOption: Locator;
    switch (location.toLowerCase().trim()) {
      case 'auckland':
        selectedOption = this.aucklandOption;
        break;
      case 'christchurch':
        selectedOption = this.christchurchOption;
        break;
      case 'queenstown':
        selectedOption = this.queenstownOption;
        break;
      default:
        throw new Error(
          `Unsupported location: "${location}". Available options: Auckland, Christchurch, Queenstown`
        );
    }

    // Click the selected location option
    await this.click(selectedOption);
  }

  /**
   * Search and choose a pickup location (type then select)
   *
   * Interaction steps:
   * 1. Click the pickup location button
   * 2. Click the input field
   * 3. Enter the location name to search
   * 4. Ensure the searched option appears
   * 5. Click the matching location option
   *
   * @param location - Location name (for example "Auckland", "Christchurch", "Queenstown")
   * @throws If the searched option does not appear or is not supported
   */
  async searchPickupLocation(location: string): Promise<void> {
    // Click the button to open the location selector
    await this.click(this.pickupLocationButton);

    // Click the input field
    await this.click(this.pickupLocationInput);

    // Enter the location name to search
    await this.fill(this.pickupLocationInput, location);

    // Wait for options to appear
    await this.page.waitForTimeout(1000);

    // Resolve the matching location option based on the input
    let selectedOption: Locator;
    switch (location.toLowerCase()) {
      case 'auckland':
        selectedOption = this.aucklandOption;
        break;
      case 'christchurch':
        selectedOption = this.christchurchOption;
        break;
      case 'queenstown':
        selectedOption = this.queenstownOption;
        break;
      default:
        throw new Error(
          `Unsupported location: "${location}". Available options: Auckland, Christchurch, Queenstown`
        );
    }

    // Ensure the selected option becomes visible
    const isLocationVisible = await this.isVisible(selectedOption);
    if (!isLocationVisible) {
      throw new Error(
        `Location option "${location}" did not appear in the dropdown`
      );
    }

    // Click the selected location option
    await this.click(selectedOption);
  }

  /**
   * Click to choose the dropoff location (select directly from the dropdown)
   *
   * Interaction steps:
   * 1. Check whether the dropdown is already open (it may auto-expand after selecting pickup)
   * 2. If it is not open, click the dropoff location button
   * 3. Check for a "Please select your pickup location" notice
   * 4. Check whether the "Choose a different location" button appears (when a location is already selected)
   * 5. If the button appears, click it to show the full list
   * 6. Ensure all three dropdown options are visible
   * 7. Select the matching option based on the input
   *
   * @param location - Location name (for example "Auckland", "Christchurch", "Queenstown")
   * @throws If no pickup location is selected, the options are missing, or the location is unsupported
   */
  async clickDropoffLocation(location: string): Promise<void> {
    // Check whether the dropdown is already visible (it may auto-expand after selecting pickup)
    let aucklandVisible = await this.isVisible(this.aucklandOption);
    let christchurchVisible = await this.isVisible(this.christchurchOption);
    let queenstownVisible = await this.isVisible(this.queenstownOption);

    // If not, click the button to open it
    if (!aucklandVisible && !christchurchVisible && !queenstownVisible) {
      await this.click(this.dropoffLocationButton);
      await this.page.waitForTimeout(1000);

      // Check for the "Please select your pickup location" notice
      const isNoticeVisible = await this.isVisible(this.pickupLocationNotice);
      if (isNoticeVisible) {
        throw new Error(
          'Pickup location must be selected before choosing a dropoff location. Invoke clickPickupLocation() or searchPickupLocation() first'
        );
      }
    }

    // Check if the "Choose a different location" button appears
    const isDifferentLocationButtonVisible = await this.isVisible(this.chooseDifferentLocationButton);
    if (isDifferentLocationButtonVisible) {
      // Click "Choose a different location" to expand the full list
      await this.click(this.chooseDifferentLocationButton);
      await this.page.waitForTimeout(500);
    }

    // Check option visibility again
    aucklandVisible = await this.isVisible(this.aucklandOption);
    christchurchVisible = await this.isVisible(this.christchurchOption);
    queenstownVisible = await this.isVisible(this.queenstownOption);

    // Verify that all three location options appear
    if (!aucklandVisible || !christchurchVisible || !queenstownVisible) {
      throw new Error(
        `Not all location options are visible. Auckland: ${aucklandVisible}, Christchurch: ${christchurchVisible}, Queenstown: ${queenstownVisible}`
      );
    }

    // Select the matching option based on the input
    let selectedOption: Locator;
    switch (location.toLowerCase().trim()) {
      case 'auckland':
        selectedOption = this.aucklandOption;
        break;
      case 'christchurch':
        selectedOption = this.christchurchOption;
        break;
      case 'queenstown':
        selectedOption = this.queenstownOption;
        break;
      default:
        throw new Error(
          `Unsupported location: "${location}". Available options: Auckland, Christchurch, Queenstown`
        );
    }

    // Click the selected location option
    await this.click(selectedOption);
  }

  /**
   * Search and choose the dropoff location (type then select)
   *
   * Interaction steps:
   * 1. Check whether the input box is already visible (it may appear after selecting pickup)
   * 2. If it is not visible, click the dropoff location button
   * 3. Check for a "Please select your pickup location" notice
   * 4. Click the input field
   * 5. Enter the location name to search
   * 6. Ensure the searched option appears
   * 7. Click the matching option
   *
   * @param location - Location name (for example "Auckland", "Christchurch", "Queenstown")
   * @throws If no pickup is selected, the option does not appear, or the location is unsupported
   */
  async searchDropoffLocation(location: string): Promise<void> {
    // Check whether the input box is already visible (may appear after selecting pickup)
    let isInputVisible = await this.isVisible(this.dropoffLocationInput);

    // If the input is hidden, click the button to reveal it
    if (!isInputVisible) {
      await this.click(this.dropoffLocationButton);
      await this.page.waitForTimeout(1000);

      // Check for the "Please select your pickup location" notice
      const isNoticeVisible = await this.isVisible(this.pickupLocationNotice);
      if (isNoticeVisible) {
        throw new Error(
          'Pickup location must be selected before choosing a dropoff location. Invoke clickPickupLocation() or searchPickupLocation() first'
        );
      }

      // Check the input field visibility again
      isInputVisible = await this.isVisible(this.dropoffLocationInput);
    }

    // Click the input field
    await this.click(this.dropoffLocationInput);

    // Enter the location name to search
    await this.fill(this.dropoffLocationInput, location);

    // Wait for options to appear
    await this.page.waitForTimeout(1000);

    // Resolve the matching location option based on the input
    let selectedOption: Locator;
    switch (location.toLowerCase().trim()) {
      case 'auckland':
        selectedOption = this.aucklandOption;
        break;
      case 'christchurch':
        selectedOption = this.christchurchOption;
        break;
      case 'queenstown':
        selectedOption = this.queenstownOption;
        break;
      default:
        throw new Error(
          `Unsupported location: "${location}". Available options: Auckland, Christchurch, Queenstown`
        );
    }

    // Ensure the selected option becomes visible
    const isLocationVisible = await this.isVisible(selectedOption);
    if (!isLocationVisible) {
      throw new Error(
        `Location option "${location}" did not appear in the dropdown`
      );
    }

    // Click the selected location option
    await this.click(selectedOption);
  }

  // ============================================
  // Date selection methods
  // ============================================

  /**
   * Select travel dates (pickup and dropoff)
   *
   * Note: pickup and dropoff locations must be selected before the date picker works
   *
   * @param pickupDate - Pickup date (format: YYYY-MM-DD)
   * @param dropoffDate - Dropoff date (format: YYYY-MM-DD)
   */
  async selectTravelDates(pickupDate: string, dropoffDate: string): Promise<void> {
    // Check whether the date picker is open
    const isOpen = await this.isDatePickerOpen();

    if (!isOpen) {
      // If not, click the date button
      await this.click(this.travelDatesButton);

      // Wait for the date picker to appear
      await this.page.waitForTimeout(1000);

      // Check again if it is open
      const isNowOpen = await this.isDatePickerOpen();
      if (!isNowOpen) {
        throw new Error('Date picker failed to open');
      }
    }

    // Select the pickup date
    await this.selectDateFromPicker(pickupDate);

    // Select the dropoff date
    await this.selectDateFromPicker(dropoffDate);
  }

  /**
   * Select a date from the picker
   *
   * @param date - Date string (format: YYYY-MM-DD)
   * @private
   */
  private async selectDateFromPicker(date: string): Promise<void> {
    // Parse the date
    const parts = date.split('-');
    if (parts.length !== 3) {
      throw new Error(`Invalid date format: ${date}, expected format: YYYY-MM-DD`);
    }

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    if (!year || !month || !day) {
      throw new Error(`Invalid date format: ${date}, expected format: YYYY-MM-DD`);
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    // Get the month name
    const monthName = this.getMonthName(monthNum);

    // Navigate to the target month if needed
    await this.navigateToMonth(monthName, yearNum);

    // Select the date within the target month
    await this.selectDateInMonth(monthName, yearNum, dayNum.toString());

    // Wait for the page to update
    await this.page.waitForTimeout(500);
  }

  /**
   * Determine if the date picker is open
   *
   * @returns Whether it is open
   * @private
   */
  private async isDatePickerOpen(): Promise<boolean> {
    try {
      // Grab the current date
      const now = new Date();
      const currentMonthName = this.getMonthName(now.getMonth() + 1);
      const currentYear = now.getFullYear();

      // Check that the current month text exists (capitalized)
      const monthPattern = new RegExp(`${currentMonthName}\\s+${currentYear}`, 'i');
      const monthText = this.page.getByText(monthPattern);

      return await monthText.isVisible({ timeout: 1000 });
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the container for a specific month
   *
   * @param monthName - Month name (for example "October")
   * @param year - Year
   * @returns Locator for the month container
   * @private
   */
  private getMonthContainer(monthName: string, year: number): Locator {
    const monthPattern = new RegExp(`${monthName}\\s+${year}`, 'i');

    return this.page
      .locator('[class*="BookingWidget_month"]')
      .filter({
        has: this.page.locator('[class*="BookingWidget_monthLabel"]', { hasText: monthPattern })
      });
  }

  /**
   * Navigate to the specified month
   *
   * @param monthName - Month name (for example "October")
   * @param year - Year
   * @private
   */
  private async navigateToMonth(monthName: string, year: number): Promise<void> {
    // Check whether the target month is already visible
    const targetMonth = this.getMonthContainer(monthName, year);
    const isVisible = await targetMonth.isVisible({ timeout: 1000 }).catch(() => false);

    if (isVisible) {
      // Target month is already visible, no navigation required
      return;
    }

    // Read the currently displayed months
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // Calculate the offset between target and current month
    const targetMonthNum = this.getMonthNumber(monthName);
    const monthDiff = (year - currentYear) * 12 + (targetMonthNum - currentMonth);

    // Click navigation buttons according to the difference
    if (monthDiff > 0) {
      // Need to move forward
      await this.navigateForward(monthDiff);
    } else if (monthDiff < 0) {
      // Need to move backward
      await this.navigateBackward(Math.abs(monthDiff));
    }
  }

  /**
   * Navigate forward (to future months)
   *
   * @param clicks - Number of clicks required
   * @private
   */
  private async navigateForward(clicks: number): Promise<void> {
    for (let i = 0; i < clicks; i++) {
      if (i === 0) {
        // Use nextMonthButton1 for the first click
        await this.click(this.nextMonthButton1);
      } else {
        // Use nextMonthButton2 for later clicks
        await this.click(this.nextMonthButton2);
      }
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Navigate backward (to past months)
   *
   * @param clicks - Number of clicks required
   * @private
   */
  private async navigateBackward(clicks: number): Promise<void> {
    for (let i = 0; i < clicks; i++) {
      await this.click(this.lastMonthButton);
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Select a date within the specified month
   *
   * @param monthName - Month name (for example "October")
   * @param year - Year
   * @param day - Day value (for example "28")
   * @private
   */
  private async selectDateInMonth(monthName: string, year: number, day: string): Promise<void> {
    // Fetch the month container
    const monthContainer = this.getMonthContainer(monthName, year);

    // Locate the day button inside that container
    const dayButton = monthContainer.getByRole('button', { name: day, exact: true });

    // Wait for the button to appear and click it
    await this.waitForVisible(dayButton, 5000);
    await this.click(dayButton);
  }

  /**
   * Get the month name
   *
   * @param monthNumber - Month number (1-12)
   * @returns Month name with capitalization
   * @private
   */
  private getMonthName(monthNumber: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (monthNumber < 1 || monthNumber > 12) {
      throw new Error(`Invalid month number: ${monthNumber}, expected range: 1-12`);
    }

    const monthName = months[monthNumber - 1];
    if (!monthName) {
      throw new Error(`Unable to resolve month name: ${monthNumber}`);
    }

    return monthName;
  }

  /**
   * Get the month number
   *
   * @param monthName - Month name (for example "October")
   * @returns Month number (1-12)
   * @private
   */
  private getMonthNumber(monthName: string): number {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const index = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
    if (index === -1) {
      throw new Error(`Invalid month name: ${monthName}`);
    }
    return index + 1;
  }

  // ============================================
  // Additional selection methods
  // ============================================

  /**
   * Set adult passenger count via input
   *
   * Fill the spinbutton input directly
   *
   * @param count - Target adult passenger count (must be >= 0)
   * @throws If the target count is negative
   * @private
   */
  private async setAdultPassengersByInput(count: number): Promise<void> {
    if (count < 0) {
      throw new Error(`Adult passenger count cannot be negative: ${count}`);
    }

    // Click the adult passenger input
    await this.click(this.adultPassengersInput);

    // Fill the value directly
    await this.fill(this.adultPassengersInput, count.toString());

    // Wait for the value to apply
    await this.page.waitForTimeout(300);
  }

  /**
   * Set adult passenger count via buttons
   *
   * Adjust adult passengers by clicking increase or decrease
   *
   * @param count - Target adult passenger count (must be >= 0)
   * @throws If the target count is negative
   * @private
   */
  private async setAdultPassengersByButtons(count: number): Promise<void> {
    if (count < 0) {
      throw new Error(`Adult passenger count cannot be negative: ${count}`);
    }

    // Read the current adult passenger count
    const currentCountText = await this.adultPassengersInput.inputValue().catch(() => '0');
    const currentCount = parseInt(currentCountText, 10) || 0;

    const diff = count - currentCount;

    if (diff > 0) {
      // Need to increase
      for (let i = 0; i < diff; i++) {
        await this.click(this.adultPassengersIncreaseButton);
        await this.page.waitForTimeout(300);
      }
    } else if (diff < 0) {
      // Need to decrease
      for (let i = 0; i < Math.abs(diff); i++) {
        await this.click(this.adultPassengersDecreaseButton);
        await this.page.waitForTimeout(300);
      }
    }
    // No action required if diff === 0
  }

  /**
   * Set child passenger count via input
   *
   * Fill the spinbutton input directly
   *
   * @param count - Target child passenger count (must be >= 0)
   * @throws If the target count is negative
   * @private
   */
  private async setChildPassengersByInput(count: number): Promise<void> {
    if (count < 0) {
      throw new Error(`Child passenger count cannot be negative: ${count}`);
    }

    // Click the child passenger input
    await this.click(this.childPassengersInput);

    // Fill the value directly
    await this.fill(this.childPassengersInput, count.toString());

    // Wait for the value to apply
    await this.page.waitForTimeout(300);
  }

  /**
   * Set child passenger count via buttons
   *
   * Adjust child passengers by clicking increase or decrease
   *
   * @param count - Target child passenger count (must be >= 0)
   * @throws If the target count is negative
   * @private
   */
  private async setChildPassengersByButtons(count: number): Promise<void> {
    if (count < 0) {
      throw new Error(`Child passenger count cannot be negative: ${count}`);
    }

    // Read the current child passenger count
    const currentCountText = await this.childPassengersInput.inputValue().catch(() => '0');
    const currentCount = parseInt(currentCountText, 10) || 0;

    const diff = count - currentCount;

    if (diff > 0) {
      // Need to increase
      for (let i = 0; i < diff; i++) {
        await this.click(this.childPassengersIncreaseButton);
        await this.page.waitForTimeout(300);
      }
    } else if (diff < 0) {
      // Need to decrease
      for (let i = 0; i < Math.abs(diff); i++) {
        await this.click(this.childPassengersDecreaseButton);
        await this.page.waitForTimeout(300);
      }
    }
    // No action required if diff === 0
  }

  /**
   * Select the primary driver age
   *
   * @param age - Age range ('18-20' or '21+')
   * @throws If the age range is unsupported
   * @private
   */
  private async selectDriverAge(age: '18-20' | '21+'): Promise<void> {
    // Click the age dropdown
    await this.click(this.driverAgeDropdown);

    // Wait for options to appear
    await this.page.waitForTimeout(500);

    // Choose the option matching the age range
    let selectedOption: Locator;
    switch (age) {
      case '18-20':
        selectedOption = this.driverAgeOption18_20;
        break;
      case '21+':
        selectedOption = this.driverAgeOption21;
        break;
      default:
        throw new Error(
          `Unsupported age range: "${age}". Available: 18-20, 21+`
        );
    }

    // Ensure the option is visible
    const isOptionVisible = await this.isVisible(selectedOption);
    if (!isOptionVisible) {
      throw new Error(`Age option "${age}" did not appear in the dropdown`);
    }

    // Click the selected age option
    await this.click(selectedOption);
  }

  /**
   * Select passenger counts and primary driver age
   *
   * Interaction steps:
   * 1. Click the passenger count button
   * 2. Adjust adult passengers (via input or buttons)
   * 3. Adjust child passengers (via input or buttons)
   * 4. Choose the primary driver age (from the dropdown)
   *
   * @param options - Passenger configuration options
   * @param options.adults - Adult passengers (default: 1)
   * @param options.children - Child passengers (default: 0)
   * @param options.driverAge - Primary driver age ('18-20' or '21+', default: '21+')
   * @param options.method - Entry method ('input': fill the field, 'buttons': use increment/decrement, default: 'input')
   */
  async selectPassengers(options: {
    adults?: number;
    children?: number;
    driverAge?: '18-20' | '21+';
    method?: 'input' | 'buttons';
  }): Promise<void> {
    const {
      adults = 1,
      children = 0,
      driverAge = '21+',
      method = 'input'
    } = options;

    // Click the passenger button to open the panel
    await this.click(this.passengersButton);

    // Wait for the passenger panel to appear
    await this.page.waitForTimeout(1000);

    // Ensure the adult input is visible (panel open)
    const isAdultInputVisible = await this.isVisible(this.adultPassengersInput);
    if (!isAdultInputVisible) {
      throw new Error('Passenger selection panel failed to open');
    }

    // Set adult count according to the chosen method
    if (method === 'input') {
      await this.setAdultPassengersByInput(adults);
    } else {
      await this.setAdultPassengersByButtons(adults);
    }

    // Set child count according to the chosen method
    if (method === 'input') {
      await this.setChildPassengersByInput(children);
    } else {
      await this.setChildPassengersByButtons(children);
    }

    // Select the primary driver age
    await this.selectDriverAge(driverAge);

    // Wait for the values to settle
    await this.page.waitForTimeout(500);
  }

  /**
   * Select the licence issuing country
   *
   * Interaction steps:
   * 1. Click the licence country button
   * 2. Wait for the dropdown to appear
   * 3. Choose the matching country option
   * 4. Ensure the option is visible
   * 5. Click the selected country option
   *
   * @param country - Country name (for example "New Zealand", "Australia", "France", "United Kingdom")
   * @throws If the dropdown fails to open or the option is hidden
   */
  async selectLicenceCountry(country: string): Promise<void> {
    // Click the button to open the licence country dropdown
    await this.click(this.licenceButton);

    // Wait for the dropdown to appear
    await this.page.waitForTimeout(1000);

    // Resolve the option based on the country name
    let selectedOption: Locator;
    const normalizedCountry = country.toLowerCase().trim();

    switch (normalizedCountry) {
      case 'new zealand':
      case 'newzealand':
      case 'nz':
        selectedOption = this.licenceOptionNewZealand;
        break;
      case 'australia':
      case 'au':
        selectedOption = this.licenceOptionAustralia;
        break;
      case 'france':
      case 'fr':
        selectedOption = this.licenceOptionFrance;
        break;
      case 'united kingdom':
      case 'unitedkingdom':
      case 'uk':
        selectedOption = this.licenceOptionUnitedKingdom;
        break;
      default:
        // Use the generic locator for other countries
        selectedOption = this.page.locator('button').filter({ hasText: country });
        break;
    }

    // Ensure the option is visible
    const isOptionVisible = await this.isVisible(selectedOption);
    if (!isOptionVisible) {
      throw new Error(
        `Licence country option "${country}" did not appear. Available: New Zealand, Australia, France, United Kingdom`
      );
    }

    // Click the selected country option
    await this.click(selectedOption);

    // Wait for the selection to apply
    await this.page.waitForTimeout(500);
  }

  /**
   * Enter a promo code
   *
   * Interaction steps:
   * 1. Click the promo code button
   * 2. Wait for the promo code field to appear
   * 3. Ensure the field is visible
   * 4. Fill the promo code input
   * 5. Wait for the input to take effect
   *
   * @param promoCode - Promo code string
   * @throws If the promo code field fails to appear
   */
  async enterPromoCode(promoCode: string): Promise<void> {
    // Click the button to reveal the promo input
    await this.click(this.promoCodeButton);

    // Wait for the input to appear
    await this.page.waitForTimeout(1000);

    // Confirm the promo input is visible
    const isInputVisible = await this.isVisible(this.promoCodeInput);
    if (!isInputVisible) {
      throw new Error('Promo code input failed to display');
    }

    // Click the input field
    await this.click(this.promoCodeInput);

    // Fill the promo code
    await this.fill(this.promoCodeInput, promoCode);

    // Wait for the value to apply
    await this.page.waitForTimeout(500);
  }

  // ============================================
  // Search operations
  // ============================================

  /**
   * Click the search button
   */
  async clickSearch(): Promise<void> {
    await this.click(this.searchButton);
  }

  /**
   * Perform the complete search flow
   *
   * @param searchData - Complete search data
   */
  async performFullSearch(searchData: {
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    dropoffDate: string;
    adults?: number;
    children?: number;
    driverAge?: '18-20' | '21+';
    passengerMethod?: 'input' | 'buttons';
    licenceCountry?: string;
    promoCode?: string;
  }): Promise<void> {
    // Required fields
    await this.clickPickupLocation(searchData.pickupLocation);
    await this.clickDropoffLocation(searchData.dropoffLocation);
    await this.selectTravelDates(searchData.pickupDate, searchData.dropoffDate);

    // Optional fields - passenger information
    if (searchData.adults !== undefined || searchData.children !== undefined || searchData.driverAge !== undefined) {
      await this.selectPassengers({
        adults: searchData.adults,
        children: searchData.children,
        driverAge: searchData.driverAge,
        method: searchData.passengerMethod
      });
    }
    if (searchData.licenceCountry) {
      await this.selectLicenceCountry(searchData.licenceCountry);
    }
    if (searchData.promoCode) {
      await this.enterPromoCode(searchData.promoCode);
    }

    // Execute the search
    await this.clickSearch();
  }

  // ============================================
  // Result verification methods
  // ============================================

  /**
   * Wait for search results to load
   * @param timeout - Timeout in milliseconds
   */
  async waitForSearchResults(timeout: number = 15000): Promise<void> {
    // Wait for the loading indicator to disappear if present
    const isLoadingVisible = await this.isVisible(this.loadingIndicator);
    if (isLoadingVisible) {
      await this.waitForHidden(this.loadingIndicator, timeout);
    }

    // Wait for the results container to appear
    await this.waitForVisible(this.resultsContainer, timeout);
  }

  /**
   * Check whether an error message is shown
   * @returns Whether an error is displayed
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Get the error message text
   * @returns The error message content
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  // ============================================
  // Form validation methods
  // ============================================

  /**
   * Verify that all key search form elements exist
   */
  async validateSearchFormElements(): Promise<void> {
    await this.assertVisible(this.pickupLocationButton, 'Pickup location button should be visible');
    await this.assertVisible(this.dropoffLocationButton, 'Dropoff location button should be visible');
    await this.assertVisible(this.travelDatesButton, 'Travel dates button should be visible');
    await this.assertVisible(this.searchButton, 'Search button should be visible');
  }

  /**
   * Check whether the search button is enabled
   * @returns Whether it is enabled
   */
  async isSearchButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.searchButton);
  }

  // ============================================
  // Helper methods
  // ============================================

  /**
   * Get the pickup location button text
   * @returns Button text
   */
  async getPickupLocationButtonText(): Promise<string> {
    return await this.getText(this.pickupLocationButton);
  }

  /**
   * Ensure the pickup button contains the given text
   * @param text - Expected text
   * @param message - Assertion failure message
   */
  async assertPickupLocationContains(text: string, message?: string): Promise<void> {
    await this.assertContainsText(this.pickupLocationButton, text, message);
  }

  /**
   * Get the dropoff location button text
   * @returns Button text
   */
  async getDropoffLocationButtonText(): Promise<string> {
    return await this.getText(this.dropoffLocationButton);
  }

  /**
   * Ensure the dropoff button contains the given text
   * @param text - Expected text
   * @param message - Assertion failure message
   */
  async assertDropoffLocationContains(text: string, message?: string): Promise<void> {
    await this.assertContainsText(this.dropoffLocationButton, text, message);
  }

  /**
   * Capture a screenshot of the search form
   * @param filename - File name (without extension)
   */
  async takeSearchFormScreenshot(filename: string): Promise<void> {
    await this.takeScreenshot(`${filename}-search-form`);
  }
}

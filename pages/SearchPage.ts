import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SearchPage类 - Maui Rentals搜索页面对象
 *
 * 封装搜索页面的所有元素定位器和操作方法
 * 提供清晰的业务操作接口
 *
 * @class SearchPage
 * @extends BasePage
 */
export class SearchPage extends BasePage {
  // 页面元素定位器
  private readonly pickupLocationInput: Locator;
  private readonly dropoffLocationInput: Locator;
  private readonly pickupDateInput: Locator;
  private readonly dropoffDateInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchForm: Locator;
  private readonly resultsContainer: Locator;
  private readonly errorMessage: Locator;
  private readonly loadingIndicator: Locator;

  // 地点下拉选项
  private readonly locationDropdown: Locator;
  private readonly locationOption: (locationName: string) => Locator;

  // 日期选择器
  private readonly datePicker: Locator;
  private readonly datePickerNextMonth: Locator;
  private readonly datePickerDay: (day: string) => Locator;

  // 车辆筛选器
  private readonly vehicleTypeFilter: Locator;
  private readonly passengersFilter: Locator;

  constructor(page: Page) {
    super(page);

    // 初始化元素定位器
    // 注意：这些选择器需要根据实际网站DOM结构调整
    this.searchForm = page.locator('form[data-testid="search-form"], form.search-form, .booking-form');

    // 地点输入框（可能是input或select）
    this.pickupLocationInput = page.locator(
      'input[name="pickupLocation"], select[name="pickupLocation"], [data-testid="pickup-location"]'
    ).first();

    this.dropoffLocationInput = page.locator(
      'input[name="dropoffLocation"], select[name="dropoffLocation"], [data-testid="dropoff-location"]'
    ).first();

    // 日期输入框
    this.pickupDateInput = page.locator(
      'input[name="pickupDate"], input[type="date"][placeholder*="Pick"], [data-testid="pickup-date"]'
    ).first();

    this.dropoffDateInput = page.locator(
      'input[name="dropoffDate"], input[type="date"][placeholder*="Drop"], [data-testid="dropoff-date"]'
    ).first();

    // 搜索按钮
    this.searchButton = page.locator(
      'button[type="submit"]:has-text("Search"), button:has-text("Find"), [data-testid="search-button"]'
    ).first();

    // 结果和消息
    this.resultsContainer = page.locator('.search-results, [data-testid="search-results"], .vehicle-list');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
    this.loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]');

    // 地点下拉菜单
    this.locationDropdown = page.locator('.location-dropdown, [role="listbox"], .dropdown-menu');
    this.locationOption = (locationName: string) =>
      page.locator(`[role="option"]:has-text("${locationName}"), li:has-text("${locationName}")`).first();

    // 日期选择器
    this.datePicker = page.locator('.date-picker, .calendar, [role="dialog"]');
    this.datePickerNextMonth = page.locator('.next-month, button[aria-label*="next"]');
    this.datePickerDay = (day: string) =>
      page.locator(`[data-day="${day}"], button:has-text("${day}")`).first();

    // 筛选器
    this.vehicleTypeFilter = page.locator('select[name="vehicleType"], [data-testid="vehicle-type"]');
    this.passengersFilter = page.locator('select[name="passengers"], [data-testid="passengers"]');
  }

  /**
   * 导航到搜索页面
   * @param options - URL参数（如cc=nz, open-mobile=true）
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
    await this.waitForSearchFormVisible();
  }

  /**
   * 等待搜索表单可见
   */
  async waitForSearchFormVisible(): Promise<void> {
    await this.waitForVisible(this.searchForm, 15000);
  }

  /**
   * 选择取车地点
   * @param location - 地点名称（如"Auckland"）
   */
  async selectPickupLocation(location: string): Promise<void> {
    await this.click(this.pickupLocationInput);

    // 如果是下拉菜单，等待并点击选项
    const isDropdownVisible = await this.isVisible(this.locationDropdown);
    if (isDropdownVisible) {
      const option = this.locationOption(location);
      await this.click(option);
    } else {
      // 如果是输入框，直接填写
      await this.fill(this.pickupLocationInput, location);
    }
  }

  /**
   * 选择还车地点
   * @param location - 地点名称（如"Christchurch"）
   */
  async selectDropoffLocation(location: string): Promise<void> {
    await this.click(this.dropoffLocationInput);

    const isDropdownVisible = await this.isVisible(this.locationDropdown);
    if (isDropdownVisible) {
      const option = this.locationOption(location);
      await this.click(option);
    } else {
      await this.fill(this.dropoffLocationInput, location);
    }
  }

  /**
   * 选择取车日期
   * @param date - 日期字符串（格式：YYYY-MM-DD）
   */
  async selectPickupDate(date: string): Promise<void> {
    await this.click(this.pickupDateInput);

    // 尝试直接填写日期
    const inputType = await this.getAttribute(this.pickupDateInput, 'type');
    if (inputType === 'date') {
      await this.fill(this.pickupDateInput, date);
    } else {
      // 如果是日期选择器，需要点击日期
      await this.selectDateFromPicker(date);
    }
  }

  /**
   * 选择还车日期
   * @param date - 日期字符串（格式：YYYY-MM-DD）
   */
  async selectDropoffDate(date: string): Promise<void> {
    await this.click(this.dropoffDateInput);

    const inputType = await this.getAttribute(this.dropoffDateInput, 'type');
    if (inputType === 'date') {
      await this.fill(this.dropoffDateInput, date);
    } else {
      await this.selectDateFromPicker(date);
    }
  }

  /**
   * 从日期选择器中选择日期
   * @param date - 日期字符串（格式：YYYY-MM-DD）
   * @private
   */
  private async selectDateFromPicker(date: string): Promise<void> {
    const [year, month, day] = date.split('-');
    const dayNumber = parseInt(day, 10).toString(); // 移除前导零

    // 等待日期选择器出现
    const isPickerVisible = await this.isVisible(this.datePicker);
    if (isPickerVisible) {
      // 这里简化处理，实际需要根据具体日期选择器实现月份切换
      const dayElement = this.datePickerDay(dayNumber);
      await this.click(dayElement);
    } else {
      console.warn('Date picker not found, date may not be selected correctly');
    }
  }

  /**
   * 点击搜索按钮
   */
  async clickSearch(): Promise<void> {
    await this.click(this.searchButton);
  }

  /**
   * 执行完整搜索流程
   * @param searchData - 搜索数据
   */
  async performSearch(searchData: {
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    dropoffDate: string;
  }): Promise<void> {
    await this.selectPickupLocation(searchData.pickupLocation);
    await this.selectDropoffLocation(searchData.dropoffLocation);
    await this.selectPickupDate(searchData.pickupDate);
    await this.selectDropoffDate(searchData.dropoffDate);
    await this.clickSearch();
  }

  /**
   * 等待搜索结果加载
   * @param timeout - 超时时间（毫秒）
   */
  async waitForSearchResults(timeout: number = 15000): Promise<void> {
    // 先等待加载指示器消失
    const isLoadingVisible = await this.isVisible(this.loadingIndicator);
    if (isLoadingVisible) {
      await this.waitForHidden(this.loadingIndicator, timeout);
    }

    // 等待结果容器出现
    await this.waitForVisible(this.resultsContainer, timeout);
  }

  /**
   * 检查是否显示错误消息
   * @returns 是否显示错误
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * 获取错误消息文本
   * @returns 错误消息内容
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * 验证搜索表单所有元素存在
   */
  async validateSearchFormElements(): Promise<void> {
    await this.assertVisible(this.pickupLocationInput, 'Pickup location input should be visible');
    await this.assertVisible(this.dropoffLocationInput, 'Dropoff location input should be visible');
    await this.assertVisible(this.pickupDateInput, 'Pickup date input should be visible');
    await this.assertVisible(this.dropoffDateInput, 'Dropoff date input should be visible');
    await this.assertVisible(this.searchButton, 'Search button should be visible');
  }

  /**
   * 检查搜索按钮是否启用
   * @returns 是否启用
   */
  async isSearchButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.searchButton);
  }

  /**
   * 清空搜索表单
   */
  async clearSearchForm(): Promise<void> {
    await this.fill(this.pickupLocationInput, '', { clear: true });
    await this.fill(this.dropoffLocationInput, '', { clear: true });
    await this.fill(this.pickupDateInput, '', { clear: true });
    await this.fill(this.dropoffDateInput, '', { clear: true });
  }

  /**
   * 选择车辆类型
   * @param vehicleType - 车辆类型（如"2 Berth"）
   */
  async selectVehicleType(vehicleType: string): Promise<void> {
    const isVisible = await this.isVisible(this.vehicleTypeFilter);
    if (isVisible) {
      await this.page.selectOption(this.vehicleTypeFilter, vehicleType);
    }
  }

  /**
   * 选择乘客数量
   * @param passengers - 乘客数量
   */
  async selectPassengers(passengers: number): Promise<void> {
    const isVisible = await this.isVisible(this.passengersFilter);
    if (isVisible) {
      await this.page.selectOption(this.passengersFilter, passengers.toString());
    }
  }

  /**
   * 获取搜索表单的当前值
   * @returns 表单数据
   */
  async getSearchFormValues(): Promise<{
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    dropoffDate: string;
  }> {
    return {
      pickupLocation: (await this.pickupLocationInput.inputValue()) || '',
      dropoffLocation: (await this.dropoffLocationInput.inputValue()) || '',
      pickupDate: (await this.pickupDateInput.inputValue()) || '',
      dropoffDate: (await this.dropoffDateInput.inputValue()) || '',
    };
  }
}

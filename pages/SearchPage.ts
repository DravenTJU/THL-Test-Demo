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
  // ============ 主要交互按钮 ============

  /** 取车地点选择按钮 */
  private readonly pickupLocationButton: Locator;

  /** 还车地点选择按钮 */
  private readonly dropoffLocationButton: Locator;

  /** 旅行日期选择按钮（同时处理取车和还车日期） */
  private readonly travelDatesButton: Locator;

  /** 乘客数量选择按钮 */
  private readonly passengersButton: Locator;

  /** 驾照国家选择按钮 */
  private readonly licenceButton: Locator;

  /** 优惠码按钮 */
  private readonly promoCodeButton: Locator;

  /** 搜索按钮 */
  private readonly searchButton: Locator;

  // ============ 输入框（点击按钮后出现） ============

  /** 取车地点输入框 */
  private readonly pickupLocationInput: Locator;

  /** 还车地点输入框 */
  private readonly dropoffLocationInput: Locator;

  // ============ 表单容器 ============

  /** 取车地点表单容器 */
  private readonly pickupForm: Locator;

  /** 还车地点表单容器 */
  private readonly dropoffForm: Locator;

  // ============ 结果和消息 ============

  /** 结果容器 */
  private readonly resultsContainer: Locator;

  /** 错误消息 */
  private readonly errorMessage: Locator;

  /** 加载指示器 */
  private readonly loadingIndicator: Locator;

  // ============ 下拉选项（动态生成） ============

  /** 地点下拉菜单 */
  private readonly locationDropdown: Locator;

  /** 地点选项生成器 */
  private readonly locationOption: (locationName: string) => Locator;

  // ============ 日期选择器（动态生成） ============

  /** 日期选择器容器 */
  private readonly datePicker: Locator;

  /** 日期选择器下个月按钮 */
  private readonly datePickerNextMonth: Locator;

  /** 日期选择器日期按钮生成器 */
  private readonly datePickerDay: (day: string) => Locator;

  constructor(page: Page) {
    super(page);

    // ============ 初始化主要交互按钮（使用 ID 和 aria-label） ============

    // 使用 ID 定位（最稳定）
    this.pickupLocationButton = page.locator('#escapeFocus_pickup');
    this.dropoffLocationButton = page.locator('#escapeFocus_dropoff');
    this.searchButton = page.locator('#buttonSubmit');

    // 使用 aria-label 定位（语义化，更易维护）
    this.travelDatesButton = page.locator('button[aria-label="Select the pick-up and drop-off dates"]');
    this.passengersButton = page.locator('button[aria-label="Select your passenger count"]');
    this.licenceButton = page.locator('button[aria-label="Select your drivers licence country of origin"]');

    // 优惠码按钮（使用文本内容定位）
    this.promoCodeButton = page.locator('button:has-text("Promo code")').first();

    // ============ 初始化输入框（使用 ID） ============

    this.pickupLocationInput = page.locator('#bookingWidget_location_pickup_searchInput');
    this.dropoffLocationInput = page.locator('#bookingWidget_location_dropoff_searchInput');

    // ============ 初始化表单容器（使用 ID） ============

    this.pickupForm = page.locator('#bookingWidget_location_pickup_searchForm');
    this.dropoffForm = page.locator('#bookingWidget_location_dropoff_searchForm');

    // ============ 初始化结果和消息元素 ============

    this.resultsContainer = page.locator('.search-results, [data-testid="search-results"], .vehicle-list').first();
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]').first();
    this.loadingIndicator = page.locator('.loading, .spinner, [data-testid="loading"]').first();

    // ============ 初始化下拉选项（动态元素） ============

    this.locationDropdown = page.locator('.location-dropdown, [role="listbox"], .dropdown-menu').first();
    this.locationOption = (locationName: string) =>
      page.locator(`[role="option"]:has-text("${locationName}"), li:has-text("${locationName}")`).first();

    // ============ 初始化日期选择器（动态元素） ============

    this.datePicker = page.locator('.date-picker, .calendar, [role="dialog"]').first();
    this.datePickerNextMonth = page.locator('.next-month, button[aria-label*="next"]').first();
    this.datePickerDay = (day: string) =>
      page.locator(`[data-day="${day}"], button:has-text("${day}")`).first();
  }

  // ============================================
  // 页面导航方法
  // ============================================

  /**
   * 导航到搜索页面
   * @param options - URL参数配置
   * @param options.cc - 国家代码（如 'nz' 表示新西兰）
   * @param options.mobile - 是否打开移动端视图
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
   * 等待搜索组件可见
   * 验证关键按钮是否已加载
   */
  async waitForSearchWidgetVisible(): Promise<void> {
    await this.waitForVisible(this.pickupLocationButton, 15000);
    await this.waitForVisible(this.searchButton, 15000);
  }

  // ============================================
  // 地点选择方法
  // ============================================

  /**
   * 选择取车地点
   *
   * 交互流程：
   * 1. 点击取车地点按钮
   * 2. 等待输入框出现
   * 3. 输入地点名称
   * 4. 等待下拉选项出现（如果有）
   * 5. 点击匹配的选项
   *
   * @param location - 地点名称（如 "Auckland"）
   */
  async selectPickupLocation(location: string): Promise<void> {
    // 点击按钮触发地点选择器
    await this.click(this.pickupLocationButton);

    // 等待输入框出现
    await this.waitForVisible(this.pickupLocationInput, 5000);

    // 输入地点名称
    await this.fill(this.pickupLocationInput, location);

    // 等待并点击下拉选项（如果存在）
    const isDropdownVisible = await this.isVisible(this.locationDropdown);
    if (isDropdownVisible) {
      const option = this.locationOption(location);
      await this.waitForVisible(option, 3000);
      await this.click(option);
    } else {
      // 如果没有下拉菜单，按回车确认
      await this.pickupLocationInput.press('Enter');
    }
  }

  /**
   * 选择还车地点
   *
   * 交互流程同 selectPickupLocation
   *
   * @param location - 地点名称（如 "Christchurch"）
   */
  async selectDropoffLocation(location: string): Promise<void> {
    // 点击按钮触发地点选择器
    await this.click(this.dropoffLocationButton);

    // 等待输入框出现
    await this.waitForVisible(this.dropoffLocationInput, 5000);

    // 输入地点名称
    await this.fill(this.dropoffLocationInput, location);

    // 等待并点击下拉选项（如果存在）
    const isDropdownVisible = await this.isVisible(this.locationDropdown);
    if (isDropdownVisible) {
      const option = this.locationOption(location);
      await this.waitForVisible(option, 3000);
      await this.click(option);
    } else {
      // 如果没有下拉菜单，按回车确认
      await this.dropoffLocationInput.press('Enter');
    }
  }

  // ============================================
  // 日期选择方法
  // ============================================

  /**
   * 选择旅行日期（取车和还车日期）
   *
   * 注意：实际页面使用单个按钮同时选择取车和还车日期
   *
   * @param pickupDate - 取车日期（格式：YYYY-MM-DD）
   * @param dropoffDate - 还车日期（格式：YYYY-MM-DD）
   */
  async selectTravelDates(pickupDate: string, dropoffDate: string): Promise<void> {
    // 点击日期按钮
    await this.click(this.travelDatesButton);

    // 等待日期选择器出现
    await this.waitForVisible(this.datePicker, 5000);

    // 选择取车日期
    await this.selectDateFromPicker(pickupDate);

    // 选择还车日期
    await this.selectDateFromPicker(dropoffDate);
  }

  /**
   * 从日期选择器中选择日期
   *
   * 注意：此方法是简化实现，实际使用时可能需要处理月份切换
   *
   * @param date - 日期字符串（格式：YYYY-MM-DD）
   * @private
   */
  private async selectDateFromPicker(date: string): Promise<void> {
    const [year, month, day] = date.split('-');
    const dayNumber = parseInt(day, 10).toString(); // 移除前导零

    // 等待日期选择器可见
    const isPickerVisible = await this.isVisible(this.datePicker);
    if (!isPickerVisible) {
      console.warn('Date picker not visible, date may not be selected correctly');
      return;
    }

    // 点击对应的日期
    // 注意：这里简化了实现，实际可能需要处理月份切换逻辑
    const dayElement = this.datePickerDay(dayNumber);
    await this.waitForVisible(dayElement, 3000);
    await this.click(dayElement);
  }

  // ============================================
  // 其他选择方法
  // ============================================

  /**
   * 选择乘客数量
   * @param passengers - 乘客数量
   */
  async selectPassengers(passengers: number): Promise<void> {
    await this.click(this.passengersButton);

    // 等待下拉菜单出现并选择选项
    // 注意：实际实现需要根据具体的下拉菜单结构调整
    const passengerOption = this.page.locator(`[role="option"]:has-text("${passengers}")`).first();
    await this.waitForVisible(passengerOption, 3000);
    await this.click(passengerOption);
  }

  /**
   * 选择驾照签发国家
   * @param country - 国家名称（如 "New Zealand"）
   */
  async selectLicenceCountry(country: string): Promise<void> {
    await this.click(this.licenceButton);

    // 等待下拉菜单出现并选择选项
    const countryOption = this.page.locator(`[role="option"]:has-text("${country}")`).first();
    await this.waitForVisible(countryOption, 3000);
    await this.click(countryOption);
  }

  /**
   * 输入优惠码
   * @param promoCode - 优惠码
   */
  async enterPromoCode(promoCode: string): Promise<void> {
    await this.click(this.promoCodeButton);

    // 等待输入框出现
    const promoInput = this.page.locator('input[placeholder*="code" i], input[name*="promo" i]').first();
    await this.waitForVisible(promoInput, 3000);
    await this.fill(promoInput, promoCode);
  }

  // ============================================
  // 搜索操作方法
  // ============================================

  /**
   * 点击搜索按钮
   */
  async clickSearch(): Promise<void> {
    await this.click(this.searchButton);
  }

  /**
   * 执行完整搜索流程（基础版本）
   *
   * @param searchData - 搜索数据
   * @param searchData.pickupLocation - 取车地点
   * @param searchData.dropoffLocation - 还车地点
   * @param searchData.pickupDate - 取车日期（YYYY-MM-DD）
   * @param searchData.dropoffDate - 还车日期（YYYY-MM-DD）
   */
  async performSearch(searchData: {
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    dropoffDate: string;
  }): Promise<void> {
    await this.selectPickupLocation(searchData.pickupLocation);
    await this.selectDropoffLocation(searchData.dropoffLocation);
    await this.selectTravelDates(searchData.pickupDate, searchData.dropoffDate);
    await this.clickSearch();
  }

  /**
   * 执行完整搜索流程（增强版本）
   *
   * @param searchData - 完整搜索数据
   */
  async performFullSearch(searchData: {
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    dropoffDate: string;
    passengers?: number;
    licenceCountry?: string;
    promoCode?: string;
  }): Promise<void> {
    // 必填字段
    await this.selectPickupLocation(searchData.pickupLocation);
    await this.selectDropoffLocation(searchData.dropoffLocation);
    await this.selectTravelDates(searchData.pickupDate, searchData.dropoffDate);

    // 可选字段
    if (searchData.passengers) {
      await this.selectPassengers(searchData.passengers);
    }
    if (searchData.licenceCountry) {
      await this.selectLicenceCountry(searchData.licenceCountry);
    }
    if (searchData.promoCode) {
      await this.enterPromoCode(searchData.promoCode);
    }

    // 执行搜索
    await this.clickSearch();
  }

  // ============================================
  // 结果验证方法
  // ============================================

  /**
   * 等待搜索结果加载
   * @param timeout - 超时时间（毫秒）
   */
  async waitForSearchResults(timeout: number = 15000): Promise<void> {
    // 先等待加载指示器消失（如果存在）
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

  // ============================================
  // 表单验证方法
  // ============================================

  /**
   * 验证搜索表单所有关键元素是否存在
   */
  async validateSearchFormElements(): Promise<void> {
    await this.assertVisible(this.pickupLocationButton, 'Pickup location button should be visible');
    await this.assertVisible(this.dropoffLocationButton, 'Dropoff location button should be visible');
    await this.assertVisible(this.travelDatesButton, 'Travel dates button should be visible');
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
   * 获取搜索按钮的文本
   * @returns 按钮文本
   */
  async getSearchButtonText(): Promise<string> {
    return await this.getText(this.searchButton);
  }

  // ============================================
  // 辅助方法
  // ============================================

  /**
   * 获取取车地点按钮的显示文本
   * @returns 按钮显示的文本
   */
  async getPickupLocationText(): Promise<string> {
    return await this.getText(this.pickupLocationButton);
  }

  /**
   * 获取还车地点按钮的显示文本
   * @returns 按钮显示的文本
   */
  async getDropoffLocationText(): Promise<string> {
    return await this.getText(this.dropoffLocationButton);
  }

  /**
   * 获取旅行日期按钮的显示文本
   * @returns 按钮显示的文本
   */
  async getTravelDatesText(): Promise<string> {
    return await this.getText(this.travelDatesButton);
  }

  /**
   * 截取搜索表单的截图
   * @param filename - 文件名（不含扩展名）
   */
  async takeSearchFormScreenshot(filename: string): Promise<void> {
    await this.takeScreenshot(`${filename}-search-form`);
  }
}

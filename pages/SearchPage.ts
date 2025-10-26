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
  // ============ 取车 ============

  /** 取车地点选择按钮 */
  private readonly pickupLocationButton: Locator;

  /** 取车地点输入框 */
  private readonly pickupLocationInput: Locator;

  // ============ 还车 ============

  /** 还车地点选择按钮 */
  private readonly dropoffLocationButton: Locator;

  /** 还车地点输入框 */
  private readonly dropoffLocationInput: Locator;

  // ============ 地点下拉选项 ============

  /** Auckland选项 */
  private readonly aucklandOption: Locator;

  /** Christchurch选项 */
  private readonly christchurchOption: Locator;

  /** Queenstown选项 */
  private readonly queenstownOption: Locator;

  // ============ 日期 ============

  /** 日期选择按钮 */
  private readonly travelDatesButton: Locator;

  /** 下个月按钮 */
  private readonly nextMonthButton: Locator;

  /** 具体日期按钮 */
  private readonly dayButton: Locator;

  // ============ 乘客 ============

  /** 乘客数量选择按钮 */
  private readonly passengersButton: Locator;

  /** 成人乘客数量增加按钮 */
  private readonly adultPassengersIncreaseButton: Locator;

  /** 成人乘客数量减少按钮 */
  private readonly adultPassengersDecreaseButton: Locator;

  /** 儿童乘客数量增加按钮 */
  private readonly childPassengersIncreaseButton: Locator;

  /** 儿童乘客数量减少按钮 */
  private readonly childPassengersDecreaseButton: Locator;

  // ============ 年龄 ============

  /** 年龄下拉菜单 */
  private readonly driverAgeDropdown: Locator;

  /** 年龄选项18-20 */
  private readonly driverAgeOption18_20: Locator;

  /** 年龄选项21+ */
  private readonly driverAgeOption21: Locator;

  // ============ 驾照 ============

  /** 驾照国家选择按钮 */
  private readonly licenceButton: Locator;

  /** 驾照国家选项新西兰 */
  private readonly licenceOptionNewZealand: Locator;

  /** 驾照国家选项澳大利亚 */
  private readonly licenceOptionAustralia: Locator;

  /** 驾照国家选项法国 */
  private readonly licenceOptionFrance: Locator;

  /** 驾照国家选项英国 */
  private readonly licenceOptionUnitedKingdom: Locator;

  // ============ 优惠码 ============

  /** 优惠码按钮 */
  private readonly promoCodeButton: Locator;

  /** 优惠码输入框 */
  private readonly promoCodeInput: Locator;

  // ============ 搜索 ============

  /** 搜索按钮 */
  private readonly searchButton: Locator;

  // ============ 结果和消息 ============

  /** 结果容器 */
  private readonly resultsContainer: Locator;

  /** 错误消息 */
  private readonly errorMessage: Locator;

  /** 加载指示器 */
  private readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // ============ 初始化交互元素 ============

    // ============ 取车 ============

    this.pickupLocationButton = page.getByRole('button', { name: 'Choose your pickup location' });
    this.pickupLocationInput = page.getByRole('textbox', { name: 'Pick up from' });

    // ============ 还车 ============

    this.dropoffLocationButton = page.getByRole('button', { name: 'Choose your dropoff location' });
    this.dropoffLocationInput = page.getByRole('textbox', { name: 'Drop off to' });

    // ============ 地点下拉选项 ============

    this.aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
    this.christchurchOption = page.getByText('Christchurch Airport159');
    this.queenstownOption = page.getByText('Queenstown50 Lucas Place,');

    // ============ 日期 ============

    this.travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
    this.nextMonthButton = page.getByRole('button').filter({ hasText: /^$/ });
    this.dayButton = page.getByRole('button', { name: 'Day' }); // TODO: 需要根据具体日期选择器结构调整

    // ============ 乘客 ============

    this.passengersButton = page.getByRole('button', { name: 'Select your passenger count' });
    this.adultPassengersIncreaseButton = page.getByRole('button', { name: 'Increase Adult passenger' });
    this.adultPassengersDecreaseButton = page.getByRole('button', { name: 'Decrease Adult passenger' });
    this.childPassengersIncreaseButton = page.getByRole('button', { name: 'Increase Child passenger' });
    this.childPassengersDecreaseButton = page.getByRole('button', { name: 'Decrease Child passenger' });

    // ============ 年龄 ============

    this.driverAgeDropdown = page.locator('[data-test-id="ageSelect"]');
    this.driverAgeOption18_20 = page.getByRole('button', { name: '-20' });
    this.driverAgeOption21 = page.getByRole('button', { name: '+' });

    // ============ 驾照 ============
    this.licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
    this.licenceOptionNewZealand = page.locator('button').filter({ hasText: 'New Zealand' });
    this.licenceOptionAustralia = page.locator('button').filter({ hasText: 'Australia' });
    this.licenceOptionFrance = page.locator('button').filter({ hasText: 'France' });
    this.licenceOptionUnitedKingdom = page.locator('button').filter({ hasText: 'United Kingdom' });

    // ============ 优惠码 ============
    this.promoCodeButton = page.getByText('Promo codeSearch');
    this.promoCodeInput = page.getByRole('textbox', { name: 'promo code optional' });

    // ============ 搜索 ============
    this.searchButton = page.getByRole('button', { name: 'Start your search' });

    // ============ 结果和消息 ============
    this.resultsContainer = page.locator('[data-testid="search-results"]');
    this.errorMessage = page.locator('[role="alert"]');
    this.loadingIndicator = page.locator('[data-testid="loading"]');
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
   * 点击选择取车地点（从下拉菜单直接选择）
   *
   * 交互流程：
   * 1. 点击取车地点按钮
   * 2. 验证3个地点下拉选项是否都出现
   * 3. 根据输入选择对应的地点选项
   *
   * @param location - 地点名称（如 "Auckland", "Christchurch", "Queenstown"）
   * @throws 如果3个地点选项未全部出现，或输入的地点不在可选范围内
   */
  async clickPickupLocation(location: string): Promise<void> {
    // 点击按钮触发地点选择器
    await this.click(this.pickupLocationButton);

    // 等待下拉选项出现
    await this.page.waitForTimeout(1000);

    // 验证3个地点选项是否都出现
    const aucklandVisible = await this.isVisible(this.aucklandOption);
    const christchurchVisible = await this.isVisible(this.christchurchOption);
    const queenstownVisible = await this.isVisible(this.queenstownOption);

    if (!aucklandVisible || !christchurchVisible || !queenstownVisible) {
      throw new Error(
        `并非所有地点选项都出现。Auckland: ${aucklandVisible}, Christchurch: ${christchurchVisible}, Queenstown: ${queenstownVisible}`
      );
    }

    // 根据输入选择对应的地点选项
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
          `不支持的地点: "${location}"。可选地点: Auckland, Christchurch, Queenstown`
        );
    }

    // 点击选中的地点选项
    await this.click(selectedOption);
  }

  /**
   * 搜索选择取车地点（输入查询后选择）
   *
   * 交互流程：
   * 1. 点击取车地点按钮
   * 2. 点击输入框
   * 3. 输入地点名称进行查询
   * 4. 验证输入的地点选项是否出现
   * 5. 点击匹配的地点选项
   *
   * @param location - 地点名称（如 "Auckland", "Christchurch", "Queenstown"）
   * @throws 如果输入的地点选项未出现，或输入的地点不在可选范围内
   */
  async searchPickupLocation(location: string): Promise<void> {
    // 点击按钮触发地点选择器
    await this.click(this.pickupLocationButton);

    // 点击输入框
    await this.click(this.pickupLocationInput);

    // 输入地点名称进行查询
    await this.fill(this.pickupLocationInput, location);

    // 等待下拉选项出现
    await this.page.waitForTimeout(1000);

    // 根据输入获取对应的地点选项
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
          `不支持的地点: "${location}"。可选地点: Auckland, Christchurch, Queenstown`
        );
    }

    // 验证输入的地点选项是否出现
    const isLocationVisible = await this.isVisible(selectedOption);
    if (!isLocationVisible) {
      throw new Error(
        `地点选项 "${location}" 未出现在下拉菜单中`
      );
    }

    // 点击选中的地点选项
    await this.click(selectedOption);
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

  // ============================================
  // 辅助方法
  // ============================================

  /**
   * 获取取车地点按钮的文本
   * @returns 按钮文本内容
   */
  async getPickupLocationButtonText(): Promise<string> {
    return await this.getText(this.pickupLocationButton);
  }

  /**
   * 验证取车地点按钮是否包含指定文本
   * @param text - 期望的文本
   * @param message - 断言失败消息
   */
  async assertPickupLocationContains(text: string, message?: string): Promise<void> {
    await this.assertContainsText(this.pickupLocationButton, text, message);
  }

  /**
   * 截取搜索表单的截图
   * @param filename - 文件名（不含扩展名）
   */
  async takeSearchFormScreenshot(filename: string): Promise<void> {
    await this.takeScreenshot(`${filename}-search-form`);
  }
}

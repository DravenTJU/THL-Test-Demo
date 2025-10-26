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

  /** 选择不同地点按钮 */
  private readonly chooseDifferentLocationButton: Locator;

  /** Auckland选项 */
  private readonly aucklandOption: Locator;

  /** Christchurch选项 */
  private readonly christchurchOption: Locator;

  /** Queenstown选项 */
  private readonly queenstownOption: Locator;

  // ============ 日期 ============

  /** 日期选择按钮 */
  private readonly travelDatesButton: Locator;

  /** 下个月按钮（初始状态） */
  private readonly nextMonthButton1: Locator;

  /** 下个月按钮（点击过一次后） */
  private readonly nextMonthButton2: Locator;

  /** 上个月按钮（点击过下个月按钮后出现） */
  private readonly lastMonthButton: Locator;

  // ============ 乘客 ============

  /** 乘客数量选择按钮 */
  private readonly passengersButton: Locator;

  /** 成人乘客数量输入框 */
  private readonly adultPassengersInput: Locator;

  /** 儿童乘客数量输入框 */
  private readonly childPassengersInput: Locator;

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

  /** 取车地点未选择提示 */
  private readonly pickupLocationNotice: Locator;

  /** 还车地点未选择提示 */
  private readonly dropoffLocationNotice: Locator;

  /** 日期未选择提示 */
  private readonly travelDatesNotice: Locator;

  /** 乘客未选择提示 */
  private readonly passengersNotice: Locator;

  /** 乘客数量超过最大值提示 */
  private readonly passengersMaxNotice: Locator;

  /** 年龄未选择提示 */
  private readonly driverAgeNotice: Locator;

  /** 驾照未选择提示 */
  private readonly licenceNotice: Locator;

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

    this.chooseDifferentLocationButton = page.getByRole('button', { name: 'Choose a different location' });
    this.aucklandOption = page.getByText('Auckland Airport470 Oruarangi');
    this.christchurchOption = page.getByText('Christchurch Airport159');
    this.queenstownOption = page.getByText('Queenstown50 Lucas Place,');

    // ============ 日期 ============

    this.travelDatesButton = page.getByRole('button', { name: 'Select the pick-up and drop-' });
    this.nextMonthButton1 = page.getByRole('button').filter({ hasText: /^$/ });
    this.nextMonthButton2 = page.getByRole('button').nth(4);
    this.lastMonthButton = page.getByRole('button').nth(3);

    // ============ 乘客 ============

    this.passengersButton = page.getByRole('button', { name: 'Select your passenger count' });
    this.adultPassengersInput = page.getByRole('spinbutton', { name: 'Adult passenger count. Over' });
    this.childPassengersInput = page.getByRole('spinbutton', { name: 'Child passenger count. Up to' });
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
    this.pickupLocationNotice = page.getByText('Please select your Pick up');
    this.dropoffLocationNotice = page.getByText('Please select your Drop off');
    this.travelDatesNotice = page.getByText('PICK-UP DATE');
    this.passengersNotice = page.getByText('Increase Adult passengers');
    this.passengersMaxNotice = page.getByText('Max total passengers is');
    this.driverAgeNotice = page.getByText('Please select the Main Driver');
    this.licenceNotice = page.getByText('Please select Drivers licence');
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
   * 2. 检查是否出现"Choose a different location"按钮（已选择地点时会出现）
   * 3. 如果出现该按钮，点击它以展开完整地点列表
   * 4. 验证3个地点下拉选项是否都出现
   * 5. 根据输入选择对应的地点选项
   *
   * @param location - 地点名称（如 "Auckland", "Christchurch", "Queenstown"）
   * @throws 如果3个地点选项未全部出现，或输入的地点不在可选范围内
   */
  async clickPickupLocation(location: string): Promise<void> {
    // 点击按钮触发地点选择器
    await this.click(this.pickupLocationButton);

    // 等待下拉选项或"Choose a different location"按钮出现
    await this.page.waitForTimeout(1000);

    // 检查是否出现"Choose a different location"按钮
    const isDifferentLocationButtonVisible = await this.isVisible(this.chooseDifferentLocationButton);
    if (isDifferentLocationButtonVisible) {
      // 点击"Choose a different location"按钮以展开完整地点列表
      await this.click(this.chooseDifferentLocationButton);
      await this.page.waitForTimeout(500);
    }

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
   * 点击选择还车地点（从下拉菜单直接选择）
   *
   * 交互流程：
   * 1. 检查下拉菜单是否已自动展开（选择取车地点后会自动展开）
   * 2. 如果未展开，点击还车地点按钮
   * 3. 检查是否有"请选择取车地点"的错误提示
   * 4. 检查是否出现"Choose a different location"按钮（已选择地点时会出现）
   * 5. 如果出现该按钮，点击它以展开完整地点列表
   * 6. 验证3个地点下拉选项是否都出现
   * 7. 根据输入选择对应的地点选项
   *
   * @param location - 地点名称（如 "Auckland", "Christchurch", "Queenstown"）
   * @throws 如果未选择取车地点、3个地点选项未全部出现，或输入的地点不在可选范围内
   */
  async clickDropoffLocation(location: string): Promise<void> {
    // 检查下拉菜单是否已经可见（选择取车地点后可能自动展开）
    let aucklandVisible = await this.isVisible(this.aucklandOption);
    let christchurchVisible = await this.isVisible(this.christchurchOption);
    let queenstownVisible = await this.isVisible(this.queenstownOption);

    // 如果下拉菜单未展开，点击按钮触发
    if (!aucklandVisible && !christchurchVisible && !queenstownVisible) {
      await this.click(this.dropoffLocationButton);
      await this.page.waitForTimeout(1000);

      // 检查是否有"请选择取车地点"的错误提示
      const isNoticeVisible = await this.isVisible(this.pickupLocationNotice);
      if (isNoticeVisible) {
        throw new Error(
          '必须先选择取车地点才能选择还车地点。请先调用 clickPickupLocation() 或 searchPickupLocation()'
        );
      }
    }

    // 检查是否出现"Choose a different location"按钮
    const isDifferentLocationButtonVisible = await this.isVisible(this.chooseDifferentLocationButton);
    if (isDifferentLocationButtonVisible) {
      // 点击"Choose a different location"按钮以展开完整地点列表
      await this.click(this.chooseDifferentLocationButton);
      await this.page.waitForTimeout(500);
    }

    // 重新检查选项可见性
    aucklandVisible = await this.isVisible(this.aucklandOption);
    christchurchVisible = await this.isVisible(this.christchurchOption);
    queenstownVisible = await this.isVisible(this.queenstownOption);

    // 验证3个地点选项是否都出现
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
   * 搜索选择还车地点（输入查询后选择）
   *
   * 交互流程：
   * 1. 检查输入框是否已自动显示（选择取车地点后会自动显示）
   * 2. 如果未显示，点击还车地点按钮
   * 3. 检查是否有"请选择取车地点"的错误提示
   * 4. 点击输入框
   * 5. 输入地点名称进行查询
   * 6. 验证输入的地点选项是否出现
   * 7. 点击匹配的地点选项
   *
   * @param location - 地点名称（如 "Auckland", "Christchurch", "Queenstown"）
   * @throws 如果未选择取车地点、输入的地点选项未出现，或输入的地点不在可选范围内
   */
  async searchDropoffLocation(location: string): Promise<void> {
    // 检查输入框是否已经可见（选择取车地点后可能自动显示）
    let isInputVisible = await this.isVisible(this.dropoffLocationInput);

    // 如果输入框未显示，点击按钮触发
    if (!isInputVisible) {
      await this.click(this.dropoffLocationButton);
      await this.page.waitForTimeout(1000);

      // 检查是否有"请选择取车地点"的错误提示
      const isNoticeVisible = await this.isVisible(this.pickupLocationNotice);
      if (isNoticeVisible) {
        throw new Error(
          '必须先选择取车地点才能选择还车地点。请先调用 clickPickupLocation() 或 searchPickupLocation()'
        );
      }

      // 重新检查输入框可见性
      isInputVisible = await this.isVisible(this.dropoffLocationInput);
    }

    // 点击输入框
    await this.click(this.dropoffLocationInput);

    // 输入地点名称进行查询
    await this.fill(this.dropoffLocationInput, location);

    // 等待下拉选项出现
    await this.page.waitForTimeout(1000);

    // 根据输入获取对应的地点选项
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

  // ============================================
  // 日期选择方法
  // ============================================

  /**
   * 选择旅行日期（取车和还车日期）
   *
   * 注意：需要先选择取车和还车地点，日期选择器才能正常使用
   *
   * @param pickupDate - 取车日期（格式：YYYY-MM-DD）
   * @param dropoffDate - 还车日期（格式：YYYY-MM-DD）
   */
  async selectTravelDates(pickupDate: string, dropoffDate: string): Promise<void> {
    // 检查日期选择器是否已打开
    const isOpen = await this.isDatePickerOpen();

    if (!isOpen) {
      // 如果未打开，点击日期按钮
      await this.click(this.travelDatesButton);

      // 等待日期选择器出现
      await this.page.waitForTimeout(1000);

      // 再次检查是否打开
      const isNowOpen = await this.isDatePickerOpen();
      if (!isNowOpen) {
        throw new Error('日期选择器未能成功打开');
      }
    }

    // 选择取车日期
    await this.selectDateFromPicker(pickupDate);

    // 选择还车日期
    await this.selectDateFromPicker(dropoffDate);
  }

  /**
   * 从日期选择器中选择日期
   *
   * @param date - 日期字符串（格式：YYYY-MM-DD）
   * @private
   */
  private async selectDateFromPicker(date: string): Promise<void> {
    // 解析日期
    const parts = date.split('-');
    if (parts.length !== 3) {
      throw new Error(`无效的日期格式: ${date}，期望格式: YYYY-MM-DD`);
    }

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    if (!year || !month || !day) {
      throw new Error(`无效的日期格式: ${date}，期望格式: YYYY-MM-DD`);
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    // 获取月份英文名称
    const monthName = this.getMonthName(monthNum);

    // 导航到目标月份（如果需要）
    await this.navigateToMonth(monthName, yearNum);

    // 在指定月份中选择日期
    await this.selectDateInMonth(monthName, yearNum, dayNum.toString());

    // 等待页面更新
    await this.page.waitForTimeout(500);
  }

  /**
   * 判断日期选择器是否已打开
   *
   * @returns 是否打开
   * @private
   */
  private async isDatePickerOpen(): Promise<boolean> {
    try {
      // 获取当前日期
      const now = new Date();
      const currentMonthName = this.getMonthName(now.getMonth() + 1);
      const currentYear = now.getFullYear();

      // 检查是否存在当前月份的文本（首字母大写）
      const monthPattern = new RegExp(`${currentMonthName}\\s+${currentYear}`, 'i');
      const monthText = this.page.getByText(monthPattern);

      return await monthText.isVisible({ timeout: 1000 });
    } catch (e) {
      return false;
    }
  }

  /**
   * 获取指定月份的容器
   *
   * @param monthName - 月份英文名称（如 "October"）
   * @param year - 年份
   * @returns 月份容器 Locator
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
   * 导航到指定月份
   *
   * @param monthName - 月份英文名称（如 "October"）
   * @param year - 年份
   * @private
   */
  private async navigateToMonth(monthName: string, year: number): Promise<void> {
    // 检查目标月份是否已经可见
    const targetMonth = this.getMonthContainer(monthName, year);
    const isVisible = await targetMonth.isVisible({ timeout: 1000 }).catch(() => false);

    if (isVisible) {
      // 目标月份已经可见，无需导航
      return;
    }

    // 获取当前显示的月份信息
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // 计算目标月份与当前月份的差距
    const targetMonthNum = this.getMonthNumber(monthName);
    const monthDiff = (year - currentYear) * 12 + (targetMonthNum - currentMonth);

    // 根据差距点击翻页按钮
    if (monthDiff > 0) {
      // 需要向后翻页
      await this.navigateForward(monthDiff);
    } else if (monthDiff < 0) {
      // 需要向前翻页
      await this.navigateBackward(Math.abs(monthDiff));
    }
  }

  /**
   * 向后导航（翻到未来的月份）
   *
   * @param clicks - 需要点击的次数
   * @private
   */
  private async navigateForward(clicks: number): Promise<void> {
    for (let i = 0; i < clicks; i++) {
      if (i === 0) {
        // 第一次点击使用 nextMonthButton1
        await this.click(this.nextMonthButton1);
      } else {
        // 后续点击使用 nextMonthButton2
        await this.click(this.nextMonthButton2);
      }
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * 向前导航（翻到过去的月份）
   *
   * @param clicks - 需要点击的次数
   * @private
   */
  private async navigateBackward(clicks: number): Promise<void> {
    for (let i = 0; i < clicks; i++) {
      await this.click(this.lastMonthButton);
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * 在指定月份中选择日期
   *
   * @param monthName - 月份英文名称（如 "October"）
   * @param year - 年份
   * @param day - 日期（如 "28"）
   * @private
   */
  private async selectDateInMonth(monthName: string, year: number, day: string): Promise<void> {
    // 获取月份容器
    const monthContainer = this.getMonthContainer(monthName, year);

    // 在该月份容器中查找日期按钮
    const dayButton = monthContainer.getByRole('button', { name: day, exact: true });

    // 等待按钮可见并点击
    await this.waitForVisible(dayButton, 5000);
    await this.click(dayButton);
  }

  /**
   * 获取月份英文名称
   *
   * @param monthNumber - 月份数字（1-12）
   * @returns 月份英文名称（首字母大写）
   * @private
   */
  private getMonthName(monthNumber: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (monthNumber < 1 || monthNumber > 12) {
      throw new Error(`无效的月份数字: ${monthNumber}，期望范围: 1-12`);
    }

    const monthName = months[monthNumber - 1];
    if (!monthName) {
      throw new Error(`无法获取月份名称: ${monthNumber}`);
    }

    return monthName;
  }

  /**
   * 获取月份数字
   *
   * @param monthName - 月份英文名称（如 "October"）
   * @returns 月份数字（1-12）
   * @private
   */
  private getMonthNumber(monthName: string): number {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const index = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
    if (index === -1) {
      throw new Error(`无效的月份名称: ${monthName}`);
    }
    return index + 1;
  }

  // ============================================
  // 其他选择方法
  // ============================================

  /**
   * 通过输入框设置成人乘客数量
   *
   * 直接在 spinbutton 输入框中填充数量
   *
   * @param count - 目标成人乘客数量（必须 >= 0）
   * @throws 如果目标数量小于0
   * @private
   */
  private async setAdultPassengersByInput(count: number): Promise<void> {
    if (count < 0) {
      throw new Error(`成人乘客数量不能为负数: ${count}`);
    }

    // 点击成人乘客输入框
    await this.click(this.adultPassengersInput);

    // 直接填充数量
    await this.fill(this.adultPassengersInput, count.toString());

    // 等待输入生效
    await this.page.waitForTimeout(300);
  }

  /**
   * 通过增减按钮设置成人乘客数量
   *
   * 通过点击增加或减少按钮来调整成人乘客数量
   *
   * @param count - 目标成人乘客数量（必须 >= 0）
   * @throws 如果目标数量小于0
   * @private
   */
  private async setAdultPassengersByButtons(count: number): Promise<void> {
    if (count < 0) {
      throw new Error(`成人乘客数量不能为负数: ${count}`);
    }

    // 获取当前成人乘客数量
    const currentCountText = await this.adultPassengersInput.inputValue().catch(() => '0');
    const currentCount = parseInt(currentCountText, 10) || 0;

    const diff = count - currentCount;

    if (diff > 0) {
      // 需要增加
      for (let i = 0; i < diff; i++) {
        await this.click(this.adultPassengersIncreaseButton);
        await this.page.waitForTimeout(300);
      }
    } else if (diff < 0) {
      // 需要减少
      for (let i = 0; i < Math.abs(diff); i++) {
        await this.click(this.adultPassengersDecreaseButton);
        await this.page.waitForTimeout(300);
      }
    }
    // diff === 0 时无需操作
  }

  /**
   * 通过输入框设置儿童乘客数量
   *
   * 直接在 spinbutton 输入框中填充数量
   *
   * @param count - 目标儿童乘客数量（必须 >= 0）
   * @throws 如果目标数量小于0
   * @private
   */
  private async setChildPassengersByInput(count: number): Promise<void> {
    if (count < 0) {
      throw new Error(`儿童乘客数量不能为负数: ${count}`);
    }

    // 点击儿童乘客输入框
    await this.click(this.childPassengersInput);

    // 直接填充数量
    await this.fill(this.childPassengersInput, count.toString());

    // 等待输入生效
    await this.page.waitForTimeout(300);
  }

  /**
   * 通过增减按钮设置儿童乘客数量
   *
   * 通过点击增加或减少按钮来调整儿童乘客数量
   *
   * @param count - 目标儿童乘客数量（必须 >= 0）
   * @throws 如果目标数量小于0
   * @private
   */
  private async setChildPassengersByButtons(count: number): Promise<void> {
    if (count < 0) {
      throw new Error(`儿童乘客数量不能为负数: ${count}`);
    }

    // 获取当前儿童乘客数量
    const currentCountText = await this.childPassengersInput.inputValue().catch(() => '0');
    const currentCount = parseInt(currentCountText, 10) || 0;

    const diff = count - currentCount;

    if (diff > 0) {
      // 需要增加
      for (let i = 0; i < diff; i++) {
        await this.click(this.childPassengersIncreaseButton);
        await this.page.waitForTimeout(300);
      }
    } else if (diff < 0) {
      // 需要减少
      for (let i = 0; i < Math.abs(diff); i++) {
        await this.click(this.childPassengersDecreaseButton);
        await this.page.waitForTimeout(300);
      }
    }
    // diff === 0 时无需操作
  }

  /**
   * 选择主驾驶员年龄
   *
   * @param age - 年龄范围（'18-20' 或 '21+'）
   * @throws 如果年龄范围不在可选范围内
   * @private
   */
  private async selectDriverAge(age: '18-20' | '21+'): Promise<void> {
    // 点击年龄下拉菜单
    await this.click(this.driverAgeDropdown);

    // 等待下拉选项出现
    await this.page.waitForTimeout(500);

    // 根据年龄范围选择对应选项
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
          `不支持的年龄范围: "${age}"。可选范围: 18-20, 21+`
        );
    }

    // 验证选项是否可见
    const isOptionVisible = await this.isVisible(selectedOption);
    if (!isOptionVisible) {
      throw new Error(`年龄选项 "${age}" 未出现在下拉菜单中`);
    }

    // 点击选中的年龄选项
    await this.click(selectedOption);
  }

  /**
   * 选择乘客数量和主驾驶员年龄
   *
   * 交互流程：
   * 1. 点击乘客数量选择按钮
   * 2. 调整成人乘客数量（可通过输入框或增减按钮）
   * 3. 调整儿童乘客数量（可通过输入框或增减按钮）
   * 4. 选择主驾驶员年龄（从下拉菜单）
   *
   * @param options - 乘客配置选项
   * @param options.adults - 成人乘客数量（默认: 1）
   * @param options.children - 儿童乘客数量（默认: 0）
   * @param options.driverAge - 主驾驶员年龄范围（'18-20' 或 '21+'，默认: '21+'）
   * @param options.method - 设置方式（'input': 直接输入框填充, 'buttons': 增减按钮，默认: 'input'）
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

    // 点击乘客按钮打开乘客选择面板
    await this.click(this.passengersButton);

    // 等待乘客选择面板出现
    await this.page.waitForTimeout(1000);

    // 验证成人乘客输入框是否可见（确认面板已打开）
    const isAdultInputVisible = await this.isVisible(this.adultPassengersInput);
    if (!isAdultInputVisible) {
      throw new Error('乘客选择面板未能成功打开');
    }

    // 根据选择的方式设置成人乘客数量
    if (method === 'input') {
      await this.setAdultPassengersByInput(adults);
    } else {
      await this.setAdultPassengersByButtons(adults);
    }

    // 根据选择的方式设置儿童乘客数量
    if (method === 'input') {
      await this.setChildPassengersByInput(children);
    } else {
      await this.setChildPassengersByButtons(children);
    }

    // 选择主驾驶员年龄
    await this.selectDriverAge(driverAge);

    // 等待设置生效
    await this.page.waitForTimeout(500);
  }

  /**
   * 选择驾照签发国家
   *
   * 交互流程：
   * 1. 点击驾照国家选择按钮
   * 2. 等待下拉菜单出现
   * 3. 根据输入的国家名称选择对应的选项
   * 4. 验证选项是否可见
   * 5. 点击选中的国家选项
   *
   * @param country - 国家名称（如 "New Zealand", "Australia", "France", "United Kingdom"）
   * @throws 如果下拉菜单未能成功打开或选项不可见
   */
  async selectLicenceCountry(country: string): Promise<void> {
    // 点击按钮打开驾照国家选择下拉菜单
    await this.click(this.licenceButton);

    // 等待下拉菜单出现
    await this.page.waitForTimeout(1000);

    // 根据国家名称获取对应的选项
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
        // 对于其他国家，使用通用 locator
        selectedOption = this.page.locator('button').filter({ hasText: country });
        break;
    }

    // 验证选项是否可见
    const isOptionVisible = await this.isVisible(selectedOption);
    if (!isOptionVisible) {
      throw new Error(
        `驾照国家选项 "${country}" 未出现在下拉菜单中。可选国家: New Zealand, Australia, France, United Kingdom`
      );
    }

    // 点击选中的国家选项
    await this.click(selectedOption);

    // 等待选择生效
    await this.page.waitForTimeout(500);
  }

  /**
   * 输入优惠码
   *
   * 交互流程：
   * 1. 点击优惠码按钮
   * 2. 等待优惠码输入框出现
   * 3. 验证输入框是否可见
   * 4. 在输入框中填充优惠码
   * 5. 等待输入生效
   *
   * @param promoCode - 优惠码字符串
   * @throws 如果优惠码输入框未能成功显示
   */
  async enterPromoCode(promoCode: string): Promise<void> {
    // 点击按钮打开优惠码输入区域
    await this.click(this.promoCodeButton);

    // 等待输入框出现
    await this.page.waitForTimeout(1000);

    // 验证优惠码输入框是否可见
    const isInputVisible = await this.isVisible(this.promoCodeInput);
    if (!isInputVisible) {
      throw new Error('优惠码输入框未能成功显示');
    }

    // 点击输入框
    await this.click(this.promoCodeInput);

    // 填充优惠码
    await this.fill(this.promoCodeInput, promoCode);

    // 等待输入生效
    await this.page.waitForTimeout(500);
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
    await this.clickPickupLocation(searchData.pickupLocation);
    await this.clickDropoffLocation(searchData.dropoffLocation);
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
    adults?: number;
    children?: number;
    driverAge?: '18-20' | '21+';
    passengerMethod?: 'input' | 'buttons';
    licenceCountry?: string;
    promoCode?: string;
  }): Promise<void> {
    // 必填字段
    await this.clickPickupLocation(searchData.pickupLocation);
    await this.clickDropoffLocation(searchData.dropoffLocation);
    await this.selectTravelDates(searchData.pickupDate, searchData.dropoffDate);

    // 可选字段 - 乘客信息
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
   * 获取还车地点按钮的文本
   * @returns 按钮文本内容
   */
  async getDropoffLocationButtonText(): Promise<string> {
    return await this.getText(this.dropoffLocationButton);
  }

  /**
   * 验证还车地点按钮是否包含指定文本
   * @param text - 期望的文本
   * @param message - 断言失败消息
   */
  async assertDropoffLocationContains(text: string, message?: string): Promise<void> {
    await this.assertContainsText(this.dropoffLocationButton, text, message);
  }

  /**
   * 截取搜索表单的截图
   * @param filename - 文件名（不含扩展名）
   */
  async takeSearchFormScreenshot(filename: string): Promise<void> {
    await this.takeScreenshot(`${filename}-search-form`);
  }
}

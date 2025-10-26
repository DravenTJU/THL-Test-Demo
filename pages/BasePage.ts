import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage类 - 所有页面对象的基类
 *
 * 提供通用的页面操作方法和工具函数
 * 遵循Page Object Model设计模式
 *
 * @class BasePage
 */
export class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://booking.maui-rentals.com';
  }

  /**
   * 导航到指定URL
   * @param path - URL路径（相对或绝对）
   * @param options - 导航选项
   */
  async navigate(path: string = '', options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    await this.page.goto(url, {
      waitUntil: options?.waitUntil || 'domcontentloaded',
      timeout: 30000,
    });
  }

  /**
   * 等待页面完全加载
   * 等待网络空闲和DOM加载完成
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.warn('Network idle timeout, continuing...');
    });
  }

  /**
   * 获取页面标题
   * @returns 页面标题
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * 获取当前URL
   * @returns 当前页面URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * 等待元素可见
   * @param locator - 元素定位器
   * @param timeout - 超时时间（毫秒）
   */
  async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * 等待元素隐藏
   * @param locator - 元素定位器
   * @param timeout - 超时时间（毫秒）
   */
  async waitForHidden(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * 点击元素（带智能等待）
   * @param locator - 元素定位器
   * @param options - 点击选项
   */
  async click(locator: Locator, options?: { force?: boolean; delay?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.click({
      force: options?.force,
      delay: options?.delay,
      timeout: 10000,
    });
  }

  /**
   * 填写输入框
   * @param locator - 元素定位器
   * @param text - 要填写的文本
   * @param options - 填写选项
   */
  async fill(locator: Locator, text: string, options?: { clear?: boolean; delay?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    if (options?.clear) {
      await locator.clear();
    }
    await locator.fill(text, { timeout: 10000 });
  }

  /**
   * 获取元素文本
   * @param locator - 元素定位器
   * @returns 元素文本内容
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    return (await locator.textContent()) || '';
  }

  /**
   * 检查元素是否可见
   * @param locator - 元素定位器
   * @returns 是否可见
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 检查元素是否启用
   * @param locator - 元素定位器
   * @returns 是否启用
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * 截图
   * @param name - 截图文件名
   * @param options - 截图选项
   */
  async takeScreenshot(name: string, options?: { fullPage?: boolean }): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: options?.fullPage || false,
    });
  }

  /**
   * 滚动到元素位置
   * @param locator - 元素定位器
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * 等待指定时间（尽量避免使用）
   * @param milliseconds - 等待毫秒数
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * 执行JavaScript代码
   * @param script - JavaScript代码
   * @param args - 参数
   * @returns 执行结果
   */
  async evaluate<T>(script: string | ((arg: unknown) => T), args?: unknown): Promise<T> {
    return await this.page.evaluate(script, args);
  }

  /**
   * 获取元素属性值
   * @param locator - 元素定位器
   * @param attributeName - 属性名
   * @returns 属性值
   */
  async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    return await locator.getAttribute(attributeName);
  }

  /**
   * 验证元素可见
   * @param locator - 元素定位器
   * @param message - 断言失败消息
   */
  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  /**
   * 验证元素包含文本
   * @param locator - 元素定位器
   * @param text - 期望的文本
   * @param message - 断言失败消息
   */
  async assertContainsText(locator: Locator, text: string, message?: string): Promise<void> {
    await expect(locator, message).toContainText(text);
  }

  /**
   * 验证页面URL包含指定文本
   * @param urlPart - URL部分
   */
  async assertURLContains(urlPart: string): Promise<void> {
    expect(this.page.url()).toContain(urlPart);
  }

  /**
   * 刷新页面
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * 返回上一页
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * 前进到下一页
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }
}

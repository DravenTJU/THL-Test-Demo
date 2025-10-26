import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage class – shared foundation for all page objects.
 *
 * Provides reusable helpers that follow the Page Object Model pattern.
 */
export class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://booking.maui-rentals.com';
  }

  /**
   * Navigate to a specific URL.
   * @param path Relative or absolute URL.
   * @param options Navigation options.
   * @returns Promise that resolves when navigation completes.
   */
  async navigate(path: string = '', options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    await this.page.goto(url, {
      waitUntil: options?.waitUntil || 'domcontentloaded',
      timeout: 30000,
    });
  }

  /**
   * Wait until the page finishes loading (load + network idle).
   * @returns Promise that resolves when the page is ready.
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      console.warn('Network idle timeout, continuing...');
    });
  }

  /**
   * Retrieve the current page title.
   * @returns Page title string.
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Retrieve the current page URL.
   * @returns Current URL string.
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Wait for an element to become visible.
   * @param locator Target locator.
   * @param timeout Timeout in milliseconds.
   * @returns Promise that resolves when the element is visible.
   */
  async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to become hidden.
   * @param locator Target locator.
   * @param timeout Timeout in milliseconds.
   * @returns Promise that resolves when the element is hidden.
   */
  async waitForHidden(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click an element with an optional forced click.
   * @param locator Target locator.
   * @param options Click options.
   * @returns Promise that resolves after the click succeeds.
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
   * Fill a text input.
   * @param locator Target locator.
   * @param text Text to enter.
   * @param options Fill options (clear and delay).
   * @returns Promise that resolves after the input is filled.
   */
  async fill(locator: Locator, text: string, options?: { clear?: boolean; delay?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    if (options?.clear) {
      await locator.clear();
    }
    await locator.fill(text, { timeout: 10000 });
  }

  /**
   * Get visible text from an element.
   * @param locator Target locator.
   * @returns Text content or an empty string.
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    return (await locator.textContent()) || '';
  }

  /**
   * Determine whether an element is visible within the timeout.
   * @param locator Target locator.
   * @returns True if the element becomes visible.
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
   * Determine whether an element is enabled.
   * @param locator Target locator.
   * @returns True if the element is enabled.
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Capture a screenshot.
   * @param name File name without extension.
   * @param options Screenshot options.
   * @returns Promise that resolves after the screenshot is written.
   */
  async takeScreenshot(name: string, options?: { fullPage?: boolean }): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: options?.fullPage || false,
    });
  }

  /**
   * Scroll to an element.
   * @param locator Target locator.
   * @returns Promise that resolves after scrolling.
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for a specific duration.
   * Prefer explicit waits when possible.
   * @param milliseconds Duration in milliseconds.
   * @returns Promise that resolves after the timeout.
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  /**
   * Execute JavaScript in the page context.
   * @param script Script function or string to execute.
   * @param args Arguments passed to the script.
   * @returns Result returned by the script.
   */
  async evaluate<T>(script: string | ((arg: unknown) => T), args?: unknown): Promise<T> {
    return await this.page.evaluate(script, args);
  }

  /**
   * Retrieve an attribute value from an element.
   * @param locator Target locator.
   * @param attributeName Attribute name.
   * @returns Attribute value or null.
   */
  async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    return await locator.getAttribute(attributeName);
  }

  /**
   * Assert that an element is visible.
   * @param locator Target locator.
   * @param message Optional error message.
   * @returns Promise that resolves when the assertion passes.
   */
  async assertVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  /**
   * Assert that an element contains specific text.
   * @param locator Target locator.
   * @param text Expected text.
   * @param message Optional error message.
   * @returns Promise that resolves when the assertion passes.
   */
  async assertContainsText(locator: Locator, text: string, message?: string): Promise<void> {
    await expect(locator, message).toContainText(text);
  }

  /**
   * Assert that the current URL includes the provided substring.
   * @param urlPart Substring expected in the URL.
   * @returns void
   */
  async assertURLContains(urlPart: string): Promise<void> {
    expect(this.page.url()).toContain(urlPart);
  }

  /**
   * Reload the current page.
   * @returns Promise that resolves after the reload completes.
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Navigate back to the previous page.
   * @returns Promise that resolves after navigation completes.
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Navigate forward to the next page.
   * @returns Promise that resolves after navigation completes.
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }
}

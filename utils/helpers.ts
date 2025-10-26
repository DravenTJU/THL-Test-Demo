/**
 * 通用辅助函数
 * 提供常用的工具方法
 */

/**
 * 生成未来日期
 * @param daysFromNow - 从今天开始的天数
 * @returns 日期字符串（YYYY-MM-DD格式）
 */
export function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDate(date);
}

/**
 * 格式化日期为YYYY-MM-DD
 * @param date - Date对象
 * @returns 格式化的日期字符串
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 计算两个日期之间的天数
 * @param startDate - 开始日期字符串（YYYY-MM-DD）
 * @param endDate - 结束日期字符串（YYYY-MM-DD）
 * @returns 天数差
 */
export function calculateDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 生成随机字符串
 * @param length - 字符串长度
 * @returns 随机字符串
 */
export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 等待指定时间（Promise版本）
 * @param ms - 毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 重试函数（带指数退避）
 * @param fn - 要重试的函数
 * @param maxRetries - 最大重试次数
 * @param delayMs - 初始延迟（毫秒）
 * @returns 函数执行结果
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const backoffDelay = delayMs * Math.pow(2, i);
        console.warn(`Retry ${i + 1}/${maxRetries} after ${backoffDelay}ms:`, error);
        await sleep(backoffDelay);
      }
    }
  }

  throw lastError;
}

/**
 * 格式化价格
 * @param amount - 金额
 * @param currency - 货币代码
 * @returns 格式化的价格字符串
 */
export function formatPrice(amount: number, currency: string = 'NZD'): string {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 深度克隆对象
 * @param obj - 要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * 生成测试数据ID
 * @param prefix - 前缀
 * @returns 唯一ID
 */
export function generateTestId(prefix: string = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * 验证日期格式（YYYY-MM-DD）
 * @param dateString - 日期字符串
 * @returns 是否有效
 */
export function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 获取环境变量（带默认值）
 * @param key - 环境变量键
 * @param defaultValue - 默认值
 * @returns 环境变量值或默认值
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * 将查询参数对象转换为URL字符串
 * @param params - 参数对象
 * @returns URL查询字符串
 */
export function buildQueryString(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
}

/**
 * 从URL中提取查询参数
 * @param url - URL字符串
 * @returns 参数对象
 */
export function parseQueryString(url: string): Record<string, string> {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

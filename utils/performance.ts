import { Page } from '@playwright/test';

/**
 * 性能监控工具类
 * 收集和分析页面性能指标
 */

export interface PerformanceMetrics {
  // 页面加载时间
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;

  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift

  // 资源加载
  resourceCount: number;
  totalResourceSize: number;
  scriptCount: number;
  styleCount: number;
  imageCount: number;

  // 网络
  responseStart: number;
  responseEnd: number;
}

export interface ResourceTiming {
  name: string;
  type: string;
  duration: number;
  size: number;
  startTime: number;
}

/**
 * 性能监控类
 */
export class PerformanceMonitor {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * 收集页面性能指标
   * @returns 性能指标对象
   */
  async collectMetrics(): Promise<PerformanceMetrics> {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      // 计算基本性能指标
      const result: Partial<PerformanceMetrics> = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        responseStart: navigation.responseStart - navigation.requestStart,
        responseEnd: navigation.responseEnd - navigation.requestStart,
        firstPaint: 0,
        firstContentfulPaint: 0,
        resourceCount: 0,
        totalResourceSize: 0,
        scriptCount: 0,
        styleCount: 0,
        imageCount: 0,
      };

      // First Paint 和 First Contentful Paint
      const fp = paint.find((entry) => entry.name === 'first-paint');
      const fcp = paint.find((entry) => entry.name === 'first-contentful-paint');

      if (fp) result.firstPaint = fp.startTime;
      if (fcp) result.firstContentfulPaint = fcp.startTime;

      // 资源统计
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      result.resourceCount = resources.length;

      resources.forEach((resource) => {
        result.totalResourceSize = (result.totalResourceSize || 0) + (resource.transferSize || 0);

        if (resource.initiatorType === 'script') result.scriptCount = (result.scriptCount || 0) + 1;
        if (resource.initiatorType === 'css' || resource.initiatorType === 'link')
          result.styleCount = (result.styleCount || 0) + 1;
        if (resource.initiatorType === 'img') result.imageCount = (result.imageCount || 0) + 1;
      });

      return result;
    });

    // 收集 Core Web Vitals
    const webVitals = await this.collectWebVitals();

    return {
      ...metrics,
      ...webVitals,
    } as PerformanceMetrics;
  }

  /**
   * 收集 Core Web Vitals
   * @returns Web Vitals指标
   */
  async collectWebVitals(): Promise<{ lcp?: number; fid?: number; cls?: number }> {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: { lcp?: number; fid?: number; cls?: number } = {};

        // LCP - Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
            renderTime?: number;
            loadTime?: number;
          };
          vitals.lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        });

        try {
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.warn('LCP observer not supported');
        }

        // FID - First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const firstInput = entries[0] as PerformanceEntry & {
            processingStart?: number;
            startTime?: number;
          };
          vitals.fid = (firstInput.processingStart || 0) - (firstInput.startTime || 0);
        });

        try {
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.warn('FID observer not supported');
        }

        // CLS - Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const layoutShiftEntry = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value || 0;
            }
          }
          vitals.cls = clsValue;
        });

        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.warn('CLS observer not supported');
        }

        // 等待一段时间收集数据
        setTimeout(() => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
          resolve(vitals);
        }, 3000);
      });
    });
  }

  /**
   * 获取资源加载详情
   * @returns 资源列表
   */
  async getResourceTimings(): Promise<ResourceTiming[]> {
    return await this.page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources.map((resource) => ({
        name: resource.name,
        type: resource.initiatorType,
        duration: resource.duration,
        size: resource.transferSize || 0,
        startTime: resource.startTime,
      }));
    });
  }

  /**
   * 获取最慢的资源
   * @param count - 返回数量
   * @returns 最慢的资源列表
   */
  async getSlowestResources(count: number = 10): Promise<ResourceTiming[]> {
    const resources = await this.getResourceTimings();
    return resources.sort((a, b) => b.duration - a.duration).slice(0, count);
  }

  /**
   * 获取最大的资源
   * @param count - 返回数量
   * @returns 最大的资源列表
   */
  async getLargestResources(count: number = 10): Promise<ResourceTiming[]> {
    const resources = await this.getResourceTimings();
    return resources.sort((a, b) => b.size - a.size).slice(0, count);
  }

  /**
   * 验证性能指标是否符合标准
   * @param metrics - 性能指标
   * @param thresholds - 阈值配置
   * @returns 验证结果
   */
  static validateMetrics(
    metrics: PerformanceMetrics,
    thresholds: {
      loadTime?: number;
      lcp?: number;
      fid?: number;
      cls?: number;
      fcp?: number;
    }
  ): { passed: boolean; failures: string[] } {
    const failures: string[] = [];

    // 页面加载时间
    if (thresholds.loadTime && metrics.loadTime > thresholds.loadTime) {
      failures.push(`Load time ${metrics.loadTime}ms exceeds threshold ${thresholds.loadTime}ms`);
    }

    // LCP - 应该小于2.5秒
    if (thresholds.lcp && metrics.lcp && metrics.lcp > thresholds.lcp) {
      failures.push(`LCP ${metrics.lcp}ms exceeds threshold ${thresholds.lcp}ms`);
    }

    // FID - 应该小于100毫秒
    if (thresholds.fid && metrics.fid && metrics.fid > thresholds.fid) {
      failures.push(`FID ${metrics.fid}ms exceeds threshold ${thresholds.fid}ms`);
    }

    // CLS - 应该小于0.1
    if (thresholds.cls && metrics.cls && metrics.cls > thresholds.cls) {
      failures.push(`CLS ${metrics.cls} exceeds threshold ${thresholds.cls}`);
    }

    // FCP - 应该小于1.8秒
    if (thresholds.fcp && metrics.firstContentfulPaint > thresholds.fcp) {
      failures.push(
        `FCP ${metrics.firstContentfulPaint}ms exceeds threshold ${thresholds.fcp}ms`
      );
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  /**
   * 生成性能报告
   * @param metrics - 性能指标
   * @returns 格式化的报告字符串
   */
  static generateReport(metrics: PerformanceMetrics): string {
    return `
Performance Metrics Report
==========================

Page Load Metrics:
- Load Time: ${metrics.loadTime.toFixed(2)}ms
- DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms
- First Paint: ${metrics.firstPaint.toFixed(2)}ms
- First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms

Core Web Vitals:
- LCP (Largest Contentful Paint): ${metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A'}
- FID (First Input Delay): ${metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A'}
- CLS (Cumulative Layout Shift): ${metrics.cls ? metrics.cls.toFixed(4) : 'N/A'}

Resource Statistics:
- Total Resources: ${metrics.resourceCount}
- Total Size: ${(metrics.totalResourceSize / 1024).toFixed(2)}KB
- Scripts: ${metrics.scriptCount}
- Stylesheets: ${metrics.styleCount}
- Images: ${metrics.imageCount}

Network:
- Response Start: ${metrics.responseStart.toFixed(2)}ms
- Response End: ${metrics.responseEnd.toFixed(2)}ms
    `.trim();
  }
}

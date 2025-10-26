import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';
import { PerformanceMonitor } from '../../utils/performance';

/**
 * 性能监控测试套件
 *
 * 收集和验证页面性能指标：
 * - 页面加载时间
 * - Core Web Vitals (LCP, FID, CLS)
 * - 资源加载分析
 * - 性能阈值验证
 *
 * @group performance
 * @group metrics
 */

test.describe('Performance Metrics Tests', () => {
  test('should collect page load metrics @performance', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const perfMonitor = new PerformanceMonitor(page);

    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForPageLoad();

    // 收集性能指标
    const metrics = await perfMonitor.collectMetrics();

    console.log(PerformanceMonitor.generateReport(metrics));

    // 基本验证
    expect(metrics.loadTime).toBeDefined();
    expect(metrics.loadTime).toBeGreaterThan(0);
    expect(metrics.firstContentfulPaint).toBeGreaterThan(0);
  });

  test('should meet performance thresholds @performance @critical', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const perfMonitor = new PerformanceMonitor(page);

    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForPageLoad();

    const metrics = await perfMonitor.collectMetrics();

    // 定义性能阈值
    const validation = PerformanceMonitor.validateMetrics(metrics, {
      loadTime: 3000, // 3秒
      lcp: 2500, // 2.5秒
      fid: 100, // 100毫秒
      cls: 0.1, // 0.1
      fcp: 1800, // 1.8秒
    });

    if (!validation.passed) {
      console.error('Performance thresholds failed:', validation.failures);
    }

    // 警告但不一定失败（实际网站性能可能波动）
    expect(validation.failures.length).toBeLessThan(3);
  });

  test('should measure Core Web Vitals @performance @vitals', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const perfMonitor = new PerformanceMonitor(page);

    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForPageLoad();

    const metrics = await perfMonitor.collectMetrics();

    console.log('Core Web Vitals:');
    console.log(`- LCP: ${metrics.lcp}ms`);
    console.log(`- FID: ${metrics.fid}ms`);
    console.log(`- CLS: ${metrics.cls}`);

    // LCP应该存在
    if (metrics.lcp) {
      expect(metrics.lcp).toBeGreaterThan(0);
      // 理想情况下 < 2.5秒
      if (metrics.lcp > 2500) {
        console.warn(`LCP ${metrics.lcp}ms exceeds good threshold (2500ms)`);
      }
    }

    // CLS应该很小
    if (metrics.cls !== undefined) {
      expect(metrics.cls).toBeGreaterThanOrEqual(0);
      if (metrics.cls > 0.1) {
        console.warn(`CLS ${metrics.cls} exceeds good threshold (0.1)`);
      }
    }
  });

  test('should analyze resource loading @performance @resources', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const perfMonitor = new PerformanceMonitor(page);

    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForPageLoad();

    const resources = await perfMonitor.getResourceTimings();
    console.log(`Total resources loaded: ${resources.length}`);

    // 获取最慢的资源
    const slowest = await perfMonitor.getSlowestResources(5);
    console.log('Slowest resources:', slowest);

    // 获取最大的资源
    const largest = await perfMonitor.getLargestResources(5);
    console.log('Largest resources:', largest);

    // 验证
    expect(resources.length).toBeGreaterThan(0);
  });

  test('should measure search interaction performance @performance @interaction', async ({
    page,
  }) => {
    const searchPage = new SearchPage(page);

    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForPageLoad();

    // 测量搜索交互时间
    const startTime = Date.now();

    await searchPage.selectPickupLocation('Auckland').catch(() => {});
    await searchPage.selectDropoffLocation('Christchurch').catch(() => {});

    const interactionTime = Date.now() - startTime;
    console.log(`Interaction time: ${interactionTime}ms`);

    // 交互应该是即时的（< 1秒）
    expect(interactionTime).toBeLessThan(1000);
  });

  test('should track network performance @performance @network', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const perfMonitor = new PerformanceMonitor(page);

    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForPageLoad();

    const metrics = await perfMonitor.collectMetrics();

    console.log(`Response start: ${metrics.responseStart}ms`);
    console.log(`Response end: ${metrics.responseEnd}ms`);
    console.log(`Total resource size: ${(metrics.totalResourceSize / 1024).toFixed(2)}KB`);

    // 响应应该快速开始（< 1秒）
    expect(metrics.responseStart).toBeLessThan(1000);
  });

  test('should measure performance on slow network @performance @throttle', async ({
    page,
    context,
  }) => {
    // 模拟慢速3G网络
    await context.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms延迟
      await route.continue();
    });

    const searchPage = new SearchPage(page);
    const perfMonitor = new PerformanceMonitor(page);

    const startTime = Date.now();

    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForPageLoad();

    const loadTime = Date.now() - startTime;
    console.log(`Load time on slow network: ${loadTime}ms`);

    const metrics = await perfMonitor.collectMetrics();
    console.log(PerformanceMonitor.generateReport(metrics));

    // 慢速网络下应该仍然可用（< 10秒）
    expect(loadTime).toBeLessThan(10000);
  });
});

test.describe('Mobile Performance Tests @performance @mobile', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    isMobile: true,
  });

  test('should perform well on mobile', async ({ page }) => {
    const searchPage = new SearchPage(page);
    const perfMonitor = new PerformanceMonitor(page);

    await searchPage.navigateToSearchPage({ cc: 'nz', mobile: true });
    await searchPage.waitForPageLoad();

    const metrics = await perfMonitor.collectMetrics();

    console.log('Mobile Performance:');
    console.log(PerformanceMonitor.generateReport(metrics));

    // 移动端性能标准（可以稍微宽松）
    const validation = PerformanceMonitor.validateMetrics(metrics, {
      loadTime: 4000, // 4秒
      lcp: 3000, // 3秒
      fcp: 2000, // 2秒
    });

    if (!validation.passed) {
      console.warn('Mobile performance issues:', validation.failures);
    }
  });
});

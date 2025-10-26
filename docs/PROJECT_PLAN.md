# THL Test Engineer Demo - 项目计划

## 📌 项目背景

**应聘职位**: Tourism Holdings Limited (THL) - Test Engineer
**测试目标**: Maui Rentals 房车租赁搜索页面
**测试URL**: https://booking.maui-rentals.com/?cc=nz&open-mobile=true

## 🎯 项目目标

创建一个**企业级Playwright自动化测试框架**，全面展示Job Description中要求的技术能力，包括：

### ✅ 必须技能覆盖

1. **Playwright自动化测试**
   - 使用TypeScript编写测试脚本
   - Page Object Model (POM) 设计模式
   - 多浏览器测试支持（Chromium, Firefox, WebKit）
   - 移动端响应式测试
   - 视觉回归测试

2. **JavaScript/TypeScript能力**
   - TypeScript严格模式
   - 现代ES6+语法
   - 异步编程（async/await）
   - 类型安全和接口定义

3. **API测试**
   - 使用Playwright API Testing功能
   - HTTP请求拦截和验证
   - Mock Server实现
   - API响应断言

4. **CI/CD集成**
   - GitHub Actions workflow配置
   - 自动化测试执行
   - 多环境配置管理
   - 测试报告自动生成和发布

5. **注重细节和团队协作**
   - 完整的代码注释
   - ESLint + Prettier代码规范
   - Git commit规范
   - 详细的README文档

### ⭐ 加分技能覆盖

6. **性能测试**
   - k6负载测试脚本
   - Playwright性能指标收集
   - Core Web Vitals监控（LCP, FID, CLS）
   - 页面加载时间分析

7. **Docker容器化**
   - Dockerfile创建隔离测试环境
   - Docker Compose服务编排
   - 容器化CI/CD集成

8. **测试数据管理和Mocking**
   - JSON格式测试数据管理
   - 环境变量配置（.env）
   - 测试数据工厂模式
   - API响应Mock策略

---

## 🗂️ 项目结构

```
THL-Test-Demo/
├── .github/
│   └── workflows/
│       └── ci.yml                      # GitHub Actions CI/CD配置
│
├── tests/
│   ├── e2e/                            # 端到端测试
│   │   ├── search.spec.ts              # 搜索功能测试
│   │   ├── mobile.spec.ts              # 移动端测试
│   │   ├── visual.spec.ts              # 视觉回归测试
│   │   └── accessibility.spec.ts       # 可访问性测试
│   │
│   ├── api/                            # API测试
│   │   ├── search-api.spec.ts          # 搜索API测试
│   │   └── locations-api.spec.ts       # 地点API测试
│   │
│   └── performance/                    # 性能测试
│       ├── metrics.spec.ts             # 性能指标收集
│       └── core-web-vitals.spec.ts     # Web Vitals测试
│
├── pages/                              # Page Object Model
│   ├── BasePage.ts                     # 基础页面类
│   └── SearchPage.ts                   # 搜索页面对象
│
├── fixtures/                           # 测试数据
│   ├── search-data.json                # 搜索测试数据
│   ├── locations.json                  # 地点数据
│   └── mock-responses.json             # Mock API响应
│
├── utils/                              # 工具类
│   ├── api-client.ts                   # API请求封装
│   ├── performance.ts                  # 性能监控工具
│   ├── data-factory.ts                 # 测试数据工厂
│   └── helpers.ts                      # 通用辅助函数
│
├── k6/                                 # k6性能测试
│   └── load-test.js                    # 负载测试脚本
│
├── docker/                             # Docker配置
│   ├── Dockerfile                      # 测试环境镜像
│   └── docker-compose.yml              # 服务编排配置
│
├── docs/                               # 项目文档
│   ├── PROJECT_PLAN.md                 # 项目计划（本文件）
│   ├── ARCHITECTURE.md                 # 架构设计文档
│   └── TEST_STRATEGY.md                # 测试策略文档
│
├── playwright.config.ts                # Playwright配置
├── tsconfig.json                       # TypeScript配置
├── .eslintrc.json                      # ESLint配置
├── .prettierrc.json                    # Prettier配置
├── .env.example                        # 环境变量模板
├── .gitignore                          # Git忽略文件
├── package.json                        # 项目依赖
└── README.md                           # 项目说明
```

---

## 🧪 测试场景设计

### 1. E2E功能测试 (tests/e2e/)

#### 搜索功能测试 (search.spec.ts)
- ✅ 验证页面加载和关键元素存在
- ✅ 取车地点选择功能
- ✅ 还车地点选择功能
- ✅ 取车日期选择（日期选择器交互）
- ✅ 还车日期选择（日期选择器交互）
- ✅ 日期验证（还车日期必须晚于取车日期）
- ✅ 搜索按钮点击和结果展示
- ✅ 表单验证（空值、无效输入）
- ✅ URL参数处理（cc=nz, open-mobile=true）

#### 移动端测试 (mobile.spec.ts)
- ✅ iOS Safari视口测试
- ✅ Android Chrome视口测试
- ✅ 响应式布局验证
- ✅ 触摸交互测试
- ✅ 移动端特定UI元素

#### 视觉回归测试 (visual.spec.ts)
- ✅ 搜索页面初始状态截图对比
- ✅ 表单填充后截图对比
- ✅ 错误状态截图对比
- ✅ 跨浏览器视觉一致性

#### 可访问性测试 (accessibility.spec.ts)
- ✅ WCAG 2.1 AA标准检查
- ✅ 键盘导航测试
- ✅ 屏幕阅读器支持
- ✅ 色彩对比度检查

### 2. API测试 (tests/api/)

#### 搜索API测试 (search-api.spec.ts)
- ✅ 搜索请求参数验证
- ✅ API响应状态码检查
- ✅ 响应数据结构验证
- ✅ 边界条件测试
- ✅ 错误处理测试

#### 地点API测试 (locations-api.spec.ts)
- ✅ 获取可用地点列表
- ✅ 地点数据格式验证
- ✅ 新西兰地区筛选

### 3. 性能测试 (tests/performance/ + k6/)

#### Playwright性能测试 (metrics.spec.ts)
- ✅ 页面加载时间监控
- ✅ 资源加载时间分析
- ✅ JavaScript执行时间
- ✅ 网络请求性能

#### Core Web Vitals (core-web-vitals.spec.ts)
- ✅ LCP (Largest Contentful Paint) < 2.5s
- ✅ FID (First Input Delay) < 100ms
- ✅ CLS (Cumulative Layout Shift) < 0.1

#### k6负载测试 (k6/load-test.js)
- ✅ 50并发用户模拟
- ✅ 持续5分钟压力测试
- ✅ 响应时间P95 < 3s
- ✅ 错误率 < 1%

---

## 🛠️ 技术实现细节

### Page Object Model设计

```typescript
// BasePage.ts - 基础页面类
export class BasePage {
  constructor(protected page: Page) {}

  async navigate(url: string): Promise<void>
  async waitForPageLoad(): Promise<void>
  async takeScreenshot(name: string): Promise<void>
}

// SearchPage.ts - 搜索页面对象
export class SearchPage extends BasePage {
  // 定位器
  private pickupLocationSelector: Locator
  private dropoffLocationSelector: Locator
  private pickupDateSelector: Locator
  private dropoffDateSelector: Locator
  private searchButton: Locator

  // 业务方法
  async selectPickupLocation(location: string): Promise<void>
  async selectDropoffLocation(location: string): Promise<void>
  async selectDates(pickup: string, dropoff: string): Promise<void>
  async clickSearch(): Promise<void>
  async validateSearchForm(): Promise<void>
}
```

### API测试实现

```typescript
// 使用Playwright的request context
test('Search API returns valid results', async ({ request }) => {
  const response = await request.get('/api/search', {
    params: {
      pickupLocation: 'Auckland',
      dropoffLocation: 'Christchurch',
      pickupDate: '2025-12-01',
      dropoffDate: '2025-12-10'
    }
  });

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data).toHaveProperty('vehicles');
});
```

### 性能监控实现

```typescript
// 使用Performance API
test('Page load performance', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.evaluate(() => {
    const perf = performance.getEntriesByType('navigation')[0];
    return {
      loadTime: perf.loadEventEnd - perf.loadEventStart,
      domContentLoaded: perf.domContentLoadedEventEnd,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime
    };
  });

  expect(metrics.loadTime).toBeLessThan(3000);
});
```

---

## 🚀 CI/CD流程设计

### GitHub Actions Workflow

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * *'  # 每日定时执行

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - Checkout代码
      - 安装Node.js
      - 安装依赖
      - 安装Playwright浏览器
      - 运行测试
      - 上传测试报告
      - 发布Allure报告到GitHub Pages
```

### 测试报告

1. **HTML Reporter** - Playwright内置报告
2. **Allure Report** - 详细的测试执行报告
3. **失败截图/视频** - 自动捕获失败场景
4. **性能报告** - k6测试结果

---

## 📊 预期交付成果

### 代码质量

- ✅ TypeScript严格模式，100%类型覆盖
- ✅ ESLint零警告
- ✅ Prettier格式化一致性
- ✅ 完整的JSDoc注释

### 测试覆盖

- ✅ 15+ E2E测试用例
- ✅ 5+ API测试用例
- ✅ 3+ 性能测试场景
- ✅ 跨浏览器测试覆盖
- ✅ 移动端测试覆盖

### 自动化能力

- ✅ GitHub Actions自动化执行
- ✅ Docker一键运行测试
- ✅ 自动化测试报告生成
- ✅ 失败自动重试机制

### 文档完整性

- ✅ 详细的README.md
- ✅ 架构设计文档
- ✅ 测试策略文档
- ✅ 代码内注释

---

## 🎓 技术亮点

### 1. 企业级架构
- Page Object Model分离关注点
- TypeScript类型安全
- 配置集中管理

### 2. 最佳实践
- 并行测试执行
- 测试隔离和清理
- 智能等待和重试策略
- 敏感数据保护

### 3. 可扩展性
- 易于添加新测试用例
- 支持多环境配置
- 模块化组件设计

### 4. 可维护性
- 清晰的目录结构
- 统一的命名规范
- 完整的错误处理

---

## ⏱️ 实施时间线

| 阶段 | 任务 | 预计时间 |
|------|------|----------|
| 1 | 项目初始化和配置 | 30分钟 |
| 2 | Page Object Model实现 | 45分钟 |
| 3 | E2E测试用例编写 | 1.5小时 |
| 4 | API测试实现 | 45分钟 |
| 5 | 性能测试集成 | 1小时 |
| 6 | Docker容器化 | 30分钟 |
| 7 | CI/CD配置 | 45分钟 |
| 8 | 文档编写 | 1小时 |
| **总计** | | **约6.5小时** |

---

## 📝 注意事项

1. **网站访问限制**: 目标网站可能有防爬虫机制，需要适当的等待和重试策略
2. **动态内容**: 日期选择器等动态元素需要稳定的定位策略
3. **测试数据**: 使用新西兰实际地点数据（Auckland, Christchurch, Queenstown等）
4. **环境配置**: 确保.env文件不提交到Git仓库

---

## 🎯 JD技能对照表

| JD要求 | 实现方式 | 文件位置 |
|--------|----------|----------|
| Playwright | TypeScript + POM | tests/, pages/ |
| JavaScript | TypeScript (superset) | 所有.ts文件 |
| API Testing | Playwright API Testing | tests/api/ |
| CI/CD | GitHub Actions | .github/workflows/ |
| Performance Testing | k6 + Playwright | k6/, tests/performance/ |
| Docker | 容器化测试环境 | docker/ |
| Test Data Management | JSON + Factory Pattern | fixtures/, utils/ |

---

**项目状态**: 🚧 进行中
**最后更新**: 2025-10-26

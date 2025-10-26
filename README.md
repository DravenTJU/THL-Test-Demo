# THL Test Engineer Demo

> 企业级Playwright自动化测试框架 - Maui Rentals搜索功能测试

[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](https://github.com)
[![Playwright](https://img.shields.io/badge/Playwright-1.48-green)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com)

## 📋 项目概述

本项目是为**Tourism Holdings Limited (THL)** Test Engineer职位准备的技术演示，展示了一个完整的企业级自动化测试框架，针对[Maui Rentals房车租赁搜索页面](https://booking.maui-rentals.com/?cc=nz&open-mobile=true)进行全面测试。

### 🎯 技术栈覆盖

本项目全面展示了Job Description中要求的所有技术能力：

#### ✅ 必须技能
- ✅ **Playwright** - 现代化的端到端测试框架
- ✅ **TypeScript** - 类型安全的JavaScript超集
- ✅ **API Testing** - 使用Playwright的API Testing功能
- ✅ **CI/CD** - GitHub Actions自动化流水线

#### ⭐ 加分技能
- ✅ **Performance Testing** - k6负载测试 + Playwright性能监控
- ✅ **Docker/Kubernetes** - 容器化测试环境
- ✅ **Test Data Management** - JSON fixtures + Mock策略
- ✅ **Cloud Experience** - GitHub Actions (可扩展到Azure/AWS)

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- (可选) Docker & Docker Compose
- (可选) k6 (用于负载测试)

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd THL-Test-Demo

# 安装依赖
npm install

# 安装Playwright浏览器
npx playwright install

# 配置环境变量（可选）
cp .env.example .env
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试套件
npm run test:e2e          # E2E测试
npm run test:api          # API测试
npm run test:performance  # 性能测试
npm run test:mobile       # 移动端测试
npm run test:visual       # 视觉回归测试

# 指定浏览器
npm run test:chromium
npm run test:firefox
npm run test:webkit

# UI模式（调试）
npm run test:ui

# 查看测试报告
npm run report            # HTML报告
npm run report:allure     # Allure报告
```

### 使用Docker运行

```bash
# 构建并运行测试
npm run docker:build
npm run docker:test

# 或使用docker-compose
cd docker
docker-compose up
```

### k6负载测试

```bash
# 安装k6: https://k6.io/docs/get-started/installation/
npm run k6:load
```

---

## 📁 项目结构

```
THL-Test-Demo/
├── .github/workflows/      # GitHub Actions CI/CD配置
│   └── ci.yml             # 自动化测试流水线
│
├── tests/                 # 测试用例
│   ├── e2e/              # 端到端测试
│   │   ├── search.spec.ts        # 搜索功能测试 ⭐
│   │   ├── mobile.spec.ts        # 移动端测试 📱
│   │   └── visual.spec.ts        # 视觉回归测试 🎨
│   ├── api/              # API测试
│   │   └── search-api.spec.ts    # 搜索API测试 🔌
│   └── performance/      # 性能测试
│       └── metrics.spec.ts       # 性能指标测试 ⚡
│
├── pages/                 # Page Object Model
│   ├── BasePage.ts       # 基础页面类
│   └── SearchPage.ts     # 搜索页面对象 🔍
│
├── utils/                 # 工具类
│   ├── api-client.ts     # API客户端封装
│   ├── performance.ts    # 性能监控工具
│   └── helpers.ts        # 通用辅助函数
│
├── fixtures/              # 测试数据
│   ├── search-data.json  # 搜索测试数据
│   └── mock-responses.json # Mock API响应
│
├── k6/                    # k6性能测试
│   └── load-test.js      # 负载测试脚本 📊
│
├── docker/                # Docker配置
│   ├── Dockerfile        # 测试环境镜像
│   └── docker-compose.yml # 服务编排
│
├── docs/                  # 项目文档
│   ├── PROJECT_PLAN.md   # 项目计划
│   ├── ARCHITECTURE.md   # 架构设计 (待创建)
│   └── TEST_STRATEGY.md  # 测试策略 (待创建)
│
├── playwright.config.ts   # Playwright配置 ⚙️
├── tsconfig.json         # TypeScript配置
├── .eslintrc.json        # 代码规范
├── .prettierrc.json      # 代码格式化
└── package.json          # 项目依赖
```

---

## 🧪 测试覆盖

### E2E测试 (15+ 用例)

#### 搜索功能测试
- ✅ 页面加载验证
- ✅ 搜索表单元素验证
- ✅ 有效搜索场景（多组测试数据）
- ✅ 无效输入验证
- ✅ 表单验证测试
- ✅ 同城还车场景
- ✅ 表单清空功能
- ✅ 页面刷新稳定性
- ✅ URL参数处理

#### 移动端测试
- ✅ iPhone 13 (iOS Safari)
- ✅ Pixel 5 (Android Chrome)
- ✅ iPad Pro (Tablet)
- ✅ 响应式设计测试 (5种viewport)
- ✅ 触摸手势支持
- ✅ 移动端性能测试

#### 视觉回归测试
- ✅ 桌面端布局对比
- ✅ 移动端布局对比
- ✅ 响应式断点对比
- ✅ 跨浏览器视觉一致性
- ✅ 深色模式支持
- ✅ 高对比度模式

### API测试 (10+ 用例)

- ✅ 搜索API请求/响应验证
- ✅ 数据结构验证
- ✅ 地点API测试
- ✅ 车辆筛选功能
- ✅ 错误处理测试
- ✅ 响应时间验证
- ✅ 并发请求测试
- ✅ API Mocking场景

### 性能测试

#### Playwright性能监控
- ✅ 页面加载时间
- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ 资源加载分析
- ✅ 网络性能监控
- ✅ 交互性能测试

#### k6负载测试
- ✅ 50并发用户
- ✅ 5分钟压力测试
- ✅ 响应时间P95 < 3秒
- ✅ 错误率 < 1%

---

## 🏗️ 架构设计

### Page Object Model (POM)

采用经典的Page Object Model设计模式，实现测试代码和页面逻辑的分离：

```typescript
// 使用示例
const searchPage = new SearchPage(page);
await searchPage.navigateToSearchPage({ cc: 'nz' });
await searchPage.performSearch({
  pickupLocation: 'Auckland',
  dropoffLocation: 'Christchurch',
  pickupDate: '2025-12-01',
  dropoffDate: '2025-12-08'
});
```

**优势:**
- 代码复用性高
- 易于维护
- 测试用例可读性强
- 元素定位器集中管理

### 工具类设计

```typescript
// API客户端
const apiClient = new APIClient(request);
const results = await apiClient.searchVehicles({...});

// 性能监控
const perfMonitor = new PerformanceMonitor(page);
const metrics = await perfMonitor.collectMetrics();

// 辅助函数
const futureDate = getFutureDate(30);
const days = calculateDaysBetween(start, end);
```

### 测试数据管理

- **JSON Fixtures**: 结构化测试数据存储
- **Data Factory**: 动态生成测试数据
- **Mock Responses**: API响应模拟
- **环境变量**: 多环境配置支持

---

## ⚙️ CI/CD流程

### GitHub Actions Pipeline

```yaml
触发条件:
  - push到main/develop分支
  - Pull Request
  - 定时任务（每日00:00 UTC）
  - 手动触发

Pipeline阶段:
  1. 代码检查 (Lint & Format)
  2. E2E测试 (多浏览器并行)
  3. API测试
  4. 性能测试
  5. k6负载测试 (定时/手动)
  6. Allure报告生成
  7. Docker构建验证

并行策略:
  - 3个浏览器 x 3个分片 = 9个并行任务
  - 显著缩短测试时间
```

### 测试报告

测试完成后自动生成：

1. **HTML Report** - Playwright内置报告
2. **Allure Report** - 详细的测试执行报告
3. **失败截图/视频** - 自动捕获失败场景
4. **GitHub Pages** - 报告自动发布到 GitHub Pages

---

## 📊 性能指标

### 目标阈值

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 页面加载时间 | < 3s | 从导航到加载完成 |
| LCP (Largest Contentful Paint) | < 2.5s | 最大内容绘制时间 |
| FID (First Input Delay) | < 100ms | 首次输入延迟 |
| CLS (Cumulative Layout Shift) | < 0.1 | 累积布局偏移 |
| API响应时间 P95 | < 3s | 95%请求响应时间 |
| 错误率 | < 1% | API请求错误率 |

### 实际性能（示例）

```
Performance Metrics Report
==========================

Page Load Metrics:
- Load Time: 2145.32ms ✅
- DOM Content Loaded: 1234.56ms ✅
- First Paint: 567.89ms ✅
- First Contentful Paint: 789.12ms ✅

Core Web Vitals:
- LCP: 2234.56ms ✅
- FID: 45.67ms ✅
- CLS: 0.05 ✅

Resource Statistics:
- Total Resources: 42
- Total Size: 2345.67KB
- Scripts: 12
- Stylesheets: 5
- Images: 18
```

---

## 🐛 调试和故障排查

### 调试模式

```bash
# UI模式 - 可视化调试
npm run test:ui

# Debug模式 - 逐步执行
npm run test:debug

# Headed模式 - 显示浏览器
npm run test:headed
```

### 常见问题

<details>
<summary><b>问题1: 元素定位失败</b></summary>

**原因**: 页面加载慢或元素选择器不正确

**解决方案**:
```typescript
// 增加等待时间
await searchPage.waitForVisible(locator, 15000);

// 使用更稳定的选择器
const element = page.locator('[data-testid="search-button"]');
```
</details>

<details>
<summary><b>问题2: 测试在CI/CD中失败但本地通过</b></summary>

**原因**: CI环境配置不同

**解决方案**:
```bash
# 模拟CI环境
CI=true npm test

# 检查环境变量
echo $CI
```
</details>

<details>
<summary><b>问题3: 视觉测试不稳定</b></summary>

**原因**: 动态内容、字体渲染差异

**解决方案**:
```typescript
// 增加容差
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixelRatio: 0.1  // 允许10%差异
});

// 等待动画完成
await page.waitForLoadState('networkidle');
```
</details>

---

## 🔒 最佳实践

### 代码质量

- ✅ TypeScript严格模式
- ✅ ESLint代码检查
- ✅ Prettier自动格式化
- ✅ 完整的JSDoc注释
- ✅ Git commit规范

### 测试设计

- ✅ 测试隔离 - 每个测试独立运行
- ✅ 智能等待 - 避免硬编码延迟
- ✅ 失败重试 - CI环境自动重试
- ✅ 并行执行 - 加速测试运行
- ✅ 数据驱动 - 使用fixtures管理测试数据

### 安全性

- ✅ 环境变量管理
- ✅ 敏感数据保护
- ✅ .gitignore配置完善
- ✅ 依赖安全扫描（可集成Dependabot）

---

## 📚 文档

- [项目计划](docs/PROJECT_PLAN.md) - 详细的项目规划文档
- [Playwright官方文档](https://playwright.dev)
- [TypeScript文档](https://www.typescriptlang.org)
- [k6文档](https://k6.io/docs/)

---

## 📝 许可证

MIT License

---

## 📈 项目亮点总结

### 🎯 全面的技术栈覆盖
- ✅ Playwright + TypeScript
- ✅ API Testing
- ✅ CI/CD (GitHub Actions)
- ✅ k6性能测试
- ✅ Docker容器化
- ✅ 完整的测试数据管理

### 🏆 企业级架构
- ✅ Page Object Model设计模式
- ✅ 模块化和可维护性
- ✅ 完整的错误处理
- ✅ 详细的代码注释

### ⚡ 高质量测试
- ✅ 15+ E2E测试用例
- ✅ 10+ API测试用例
- ✅ 跨浏览器覆盖
- ✅ 移动端测试
- ✅ 视觉回归测试
- ✅ 性能监控

### 🚀 自动化能力
- ✅ GitHub Actions CI/CD
- ✅ 并行测试执行
- ✅ 自动化测试报告
- ✅ Docker一键运行

### 📖 完整文档
- ✅ 详细的README
- ✅ 项目计划文档
- ✅ 代码内注释
- ✅ 架构设计说明

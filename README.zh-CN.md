# THL Test Engineer Demo

**中文** | [English](./README.md)

> 企业级 Playwright 自动化测试框架 - Maui Rentals 搜索功能测试

[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](https://github.com)
[![Playwright](https://img.shields.io/badge/Playwright-1.56-green)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com)

## 📋 项目概述

本项目是一个自动化测试框架，针对 [Maui Rentals 房车租赁搜索页面](https://booking.maui-rentals.com/?cc=nz&open-mobile=true) 进行全面测试。

![Image](https://github.com/user-attachments/assets/cf39f9b2-6e51-48df-87b5-089f1c70c5ec)

### 🎯 技术栈覆盖

- ✅ **Playwright** - 现代化的端到端测试框架
- ✅ **TypeScript** - 类型安全的 JavaScript 超集
- ✅ **API Testing** - 使用 Playwright 的 API Testing 功能
- ✅ **CI/CD** - GitHub Actions 自动化流水线
- ✅ **Docker** - 容器化测试环境

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- (可选) Docker & Docker Compose

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd THL-Test-Demo

# 安装依赖
npm install

# 安装 Playwright 浏览器
npx playwright install

# 配置环境变量（可选）
cp .env.example .env
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试套件
npm run test:e2e          # E2E 测试
npm run test:api          # API 测试
npm run test:unit         # 单元测试

# 指定浏览器
npm run test:chromium
npm run test:firefox
npm run test:webkit

# UI 模式（调试）
npm run test:ui

# 查看测试报告
npm run report            # HTML 报告
npm run report:allure     # Allure 报告
```

### 使用 Docker 运行

```bash
# 构建并运行测试
npm run docker:build
npm run docker:test

# 或直接使用 docker-compose
docker-compose -f docker/docker-compose.yml up --build --abort-on-container-exit

# 查看 Allure 报告
docker-compose -f docker/docker-compose.yml up allure
# 访问 http://localhost:5050
```

> 💡 **提示**: 查看 [docker/README.zh-CN.md](./docker/README.zh-CN.md) 了解详细的 Docker 使用说明

---

## 📁 项目结构

```
THL-Test-Demo/
├── .github/workflows/      # GitHub Actions CI/CD 配置
│   └── ci.yml             # 自动化测试流水线
│
├── tests/                 # 测试用例
│   ├── e2e/              # 端到端测试
│   │   └── complete-search-flow.spec.ts  # 完整搜索流程测试
│   ├── api/              # API 测试
│   │   └── availability-api.spec.ts      # Cosmos Availability API 测试
│   └── unit/             # 单元测试（SearchPage 方法）
│       ├── clickPickupLocation.spec.ts
│       ├── selectPassengers.spec.ts
│       ├── selectTravelDates.spec.ts
│       └── ...（针对每个核心方法的测试）
│
├── pages/                 # Page Object Model
│   ├── BasePage.ts       # 基础页面类
│   └── SearchPage.ts     # 搜索页面对象
│
├── docker/                # Docker 配置
│   ├── Dockerfile        # 测试环境镜像
│   ├── docker-compose.yml # 服务编排
│   ├── README.md         # Docker 英文文档
│   └── README.zh-CN.md   # Docker 中文文档
│
├── playwright.config.ts   # Playwright 配置
├── tsconfig.json         # TypeScript 配置
├── CLAUDE.md             # Claude Code 开发指南
├── README.md             # 本文件（英文版）
└── README.zh-CN.md       # 本文件（中文版）
```

---

## 🧪 测试覆盖

### E2E 测试

#### 完整搜索流程测试
- ✅ 完整搜索流程（所有字段）
- ✅ 取车/还车地点选择（点击和搜索两种方式）
- ✅ 日期选择（支持跨月份）
- ✅ 乘客选择（输入和按钮两种方式）
- ✅ 驾照国家选择
- ✅ 优惠码输入
- ✅ 搜索结果验证

### API 测试

- ✅ Cosmos Availability API 请求/响应验证
- ✅ 数据结构验证（locations, stations, vehicles）
- ✅ 搜索参数验证（dates, locations, passengers）
- ✅ 错误处理测试
- ✅ 响应时间验证
- ✅ 幂等性测试

### Unit 测试

针对 SearchPage 的每个核心方法：
- ✅ `clickPickupLocation` - 取车地点选择
- ✅ `searchPickupLocation` - 取车地点搜索
- ✅ `clickDropoffLocation` - 还车地点选择
- ✅ `searchDropoffLocation` - 还车地点搜索
- ✅ `selectTravelDates` - 日期选择
- ✅ `selectPassengers` - 乘客选择
- ✅ `selectLicenceCountry` - 驾照国家选择
- ✅ `enterPromoCode` - 优惠码输入

---

## 🏗️ 架构设计

### Page Object Model (POM)

采用经典的 Page Object Model 设计模式，实现测试代码和页面逻辑的分离：

```typescript
// 使用示例
const searchPage = new SearchPage(page);
await searchPage.navigateToSearchPage({ cc: 'nz' });
await searchPage.performFullSearch({
  pickupLocation: 'Auckland',
  dropoffLocation: 'Christchurch',
  pickupDate: '2025-12-01',
  dropoffDate: '2025-12-08',
  adults: 2,
  children: 1,
  driverAge: '21+',
  licenceCountry: 'New Zealand'
});
```

**优势**:
- 代码复用性高
- 易于维护
- 测试用例可读性强
- 元素定位器集中管理

### 关键设计特点

1. **智能等待机制**: 所有交互方法都包含自动等待，避免 flaky 测试
2. **Role-based 选择器**: 优先使用 Playwright 推荐的 `getByRole` 选择器
3. **详细的 JSDoc 文档**: 每个方法都有完整的交互流程说明
4. **多种交互方式**: 支持不同的用户交互模式（如输入 vs 按钮）

---

## ⚙️ CI/CD 流程

### GitHub Actions Pipeline

```yaml
触发条件:
  - push 到 main/develop 分支
  - Pull Request
  - 定时任务（每日 00:00 UTC）
  - 手动触发

Pipeline 阶段:
  1. 代码检查 (Lint & Format)
  2. E2E 测试 (多浏览器并行)
  3. API 测试
  4. Unit 测试
  5. Allure 报告生成

并行策略:
  - 3 个浏览器 x 并行执行
  - 显著缩短测试时间
```

### 测试报告

测试完成后自动生成：

1. **HTML Report** - Playwright 内置报告
2. **Allure Report** - 详细的测试执行报告
3. **失败截图/视频** - 自动捕获失败场景
4. **GitHub Actions Artifacts** - 报告作为构建产物保存

---

## 📊 性能指标

### 目标阈值

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 页面加载时间 | < 3s | 从导航到加载完成 |
| API 响应时间 | < 3s | Cosmos Availability API |
| 测试执行时间 | < 5 min | 完整测试套件 |

---

## 🐛 调试和故障排查

### 调试模式

```bash
# UI 模式 - 可视化调试（推荐）
npm run test:ui

# Debug 模式 - 逐步执行
npm run test:debug

# Headed 模式 - 显示浏览器
npm run test:headed
```

### 常见问题

<details>
<summary><b>问题 1: 元素定位失败</b></summary>

**原因**: 页面加载慢或元素选择器不正确

**解决方案**:
```typescript
// 使用 waitForSearchWidgetVisible 确保页面加载完成
await searchPage.waitForSearchWidgetVisible();

// 使用更稳定的选择器
const element = page.getByRole('button', { name: 'Search' });
```
</details>

<details>
<summary><b>问题 2: 日期选择失败</b></summary>

**原因**: 日期格式不正确或日期已过期

**解决方案**:
- 确认日期格式为 `YYYY-MM-DD`
- 确认是未来日期
- 支持的地点: Auckland, Christchurch, Queenstown
</details>

<details>
<summary><b>问题 3: Docker 测试失败</b></summary>

**原因**: Docker 配置或资源问题

**解决方案**:
- 查看 [docker/README.zh-CN.md](./docker/README.zh-CN.md) 故障排查章节
- 检查 Docker 资源限制（内存 >= 4GB）
</details>

---

## 🔒 最佳实践

### 代码质量

- ✅ TypeScript 严格模式
- ✅ ESLint 代码检查
- ✅ Prettier 自动格式化
- ✅ 完整的 JSDoc 注释

### 测试设计

- ✅ 测试隔离 - 每个测试独立运行
- ✅ 智能等待 - 避免硬编码延迟
- ✅ 失败重试 - CI 环境自动重试
- ✅ 并行执行 - 加速测试运行

### 安全性

- ✅ 环境变量管理
- ✅ 敏感数据保护
- ✅ .gitignore 配置完善

---

## 📚 文档

### 项目文档
- [CLAUDE.md](./CLAUDE.md) - Claude Code 开发指南
- [Docker 配置说明](./docker/README.zh-CN.md) - Docker 详细使用文档

### 外部资源
- [Playwright 官方文档](https://playwright.dev)
- [TypeScript 文档](https://www.typescriptlang.org)

---

## 📝 许可证

MIT License

---

## 📈 项目亮点总结

### 🎯 全面的技术栈覆盖
- ✅ Playwright + TypeScript
- ✅ API Testing
- ✅ CI/CD (GitHub Actions)
- ✅ Docker 容器化

### 🏆 企业级架构
- ✅ Page Object Model 设计模式
- ✅ 模块化和可维护性
- ✅ 完整的错误处理
- ✅ 详细的代码注释

### ⚡ 高质量测试
- ✅ E2E 测试（完整流程）
- ✅ API 测试（Cosmos Availability）
- ✅ Unit 测试（每个核心方法）
- ✅ 跨浏览器覆盖

### 🚀 自动化能力
- ✅ GitHub Actions CI/CD
- ✅ 并行测试执行
- ✅ 自动化测试报告
- ✅ Docker 一键运行

### 📖 完整文档
- ✅ 详细的 README（中英文）
- ✅ Docker 使用文档（中英文）
- ✅ 代码内注释

---

**项目维护者**: Draven
**最后更新**: 2025-10-27
**Playwright 版本**: 1.56.1
**TypeScript 版本**: 5.6.3

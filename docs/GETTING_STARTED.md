# 快速入门指南

本指南将帮助您快速上手THL Test Demo项目。

## 🚀 5分钟快速开始

### 1. 环境准备

```bash
# 检查Node.js版本（需要 >= 18）
node --version

# 检查npm版本（需要 >= 9）
npm --version
```

### 2. 克隆和安装

```bash
# 克隆项目（替换为实际地址）
git clone <your-repo-url>
cd THL-Test-Demo

# 安装依赖
npm install

# 安装Playwright浏览器
npx playwright install chromium firefox webkit
```

### 3. 运行第一个测试

```bash
# 运行单个测试文件
npx playwright test tests/e2e/search.spec.ts

# 查看测试报告
npx playwright show-report
```

## 📋 常用命令速查

### 测试执行

```bash
# 运行所有测试
npm test

# 运行特定测试套件
npm run test:e2e          # E2E测试
npm run test:api          # API测试
npm run test:mobile       # 移动端测试

# 指定浏览器运行
npm run test:chromium
npm run test:firefox
npm run test:webkit

# UI模式（推荐用于调试）
npm run test:ui

# Debug模式
npm run test:debug

# Headed模式（显示浏览器）
npm run test:headed
```

### 代码质量

```bash
# 运行ESLint检查
npm run lint

# 自动修复ESLint问题
npm run lint:fix

# 检查代码格式
npm run format:check

# 自动格式化代码
npm run format
```

### 测试报告

```bash
# HTML报告
npm run report

# Allure报告
npm run report:allure
```

## 🐳 使用Docker

```bash
# 构建Docker镜像
npm run docker:build

# 运行测试容器
npm run docker:test

# 使用docker-compose
cd docker
docker-compose up
```

## 🔧 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件
nano .env
```

常用环境变量：
- `BASE_URL`: 测试目标URL
- `HEADLESS`: 无头模式（true/false）
- `CI`: CI环境标识

## 📝 编写第一个测试

### 1. 创建测试文件

在 `tests/e2e/` 目录下创建新文件：

```typescript
// tests/e2e/my-test.spec.ts
import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

test.describe('My Test Suite', () => {
  test('should do something', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz' });

    // 你的测试逻辑
    await searchPage.validateSearchFormElements();
  });
});
```

### 2. 运行测试

```bash
npx playwright test tests/e2e/my-test.spec.ts
```

## 🎯 学习路径

### 初学者

1. ✅ 阅读 [README.md](../README.md)
2. ✅ 运行示例测试：`npm run test:chromium -- tests/e2e/search.spec.ts`
3. ✅ 查看测试报告：`npm run report`
4. ✅ 使用UI模式：`npm run test:ui`

### 进阶

1. ✅ 学习Page Object Model: 查看 `pages/SearchPage.ts`
2. ✅ 了解测试数据管理: 查看 `fixtures/search-data.json`
3. ✅ 学习API测试: 运行 `npm run test:api`
4. ✅ 研究性能测试: 查看 `tests/performance/metrics.spec.ts`

### 高级

1. ✅ 配置CI/CD: 查看 `.github/workflows/ci.yml`
2. ✅ Docker容器化: 查看 `docker/Dockerfile`
3. ✅ k6负载测试: 运行 `npm run k6:load`
4. ✅ 自定义报告: 研究Allure集成

## ❓ 常见问题

### Q: 测试运行很慢怎么办？

**A**: 使用并行执行和减少测试范围

```bash
# 只运行一个浏览器
npm run test:chromium

# 并行执行
npx playwright test --workers=4
```

### Q: 如何调试失败的测试？

**A**: 使用以下调试工具

```bash
# UI模式 - 最推荐
npm run test:ui

# Debug模式
npm run test:debug

# 查看失败截图
ls test-results/
```

### Q: 如何跳过某些测试？

**A**: 使用test.skip

```typescript
test.skip('test to skip', async ({ page }) => {
  // ...
});
```

### Q: 如何只运行带特定标签的测试？

**A**: 使用grep参数

```bash
# 只运行@smoke标签的测试
npx playwright test --grep @smoke

# 排除@slow标签的测试
npx playwright test --grep-invert @slow
```

## 📚 更多资源

- [Playwright文档](https://playwright.dev)
- [项目计划](PROJECT_PLAN.md)
- [主README](../README.md)

## 🤝 获取帮助

如果遇到问题：

1. 查看 [常见问题](../README.md#-调试和故障排查)
2. 检查 [GitHub Issues](https://github.com/your-repo/issues)
3. 联系项目作者

---

祝您测试愉快！🚀

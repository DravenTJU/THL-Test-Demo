# THL Test Demo Docker 配置

**中文** | [English](./README.md)

本目录包含用于在容器化环境中运行 Playwright 测试的 Docker 配置文件。

---

## 📋 概述

Docker 配置提供：
- **一致的测试环境** - 跨不同机器和 CI/CD 平台
- **Playwright 1.48.0** - 预装浏览器（Chrome、Firefox、Safari）
- **Allure 报告服务** - 可视化查看测试结果
- **自动报告同步** - 容器与宿主机之间自动同步测试报告

---

## 🚀 快速开始

### 前置要求

- Docker Engine 20.10+
- Docker Compose 1.29+

### 运行测试

```bash
# 从项目根目录执行
npm run docker:build
npm run docker:test

# 或直接使用 docker-compose
docker-compose -f docker/docker-compose.yml build
docker-compose -f docker/docker-compose.yml up --abort-on-container-exit

# 从 docker 目录执行
cd docker
docker-compose up --build --abort-on-container-exit
```

### 查看 Allure 报告

```bash
# 启动 Allure 服务（需要先运行测试生成结果）
docker-compose -f docker/docker-compose.yml up allure

# 访问 http://localhost:5050
```

---

## 📁 文件结构

```
docker/
├── Dockerfile           # 测试环境镜像定义
├── docker-compose.yml   # 多服务编排配置
├── README.md           # 英文文档
└── README.zh-CN.md     # 本文件（中文）
```

---

## 🔧 配置详解

### Dockerfile

**基础镜像**: `mcr.microsoft.com/playwright:v1.48.0-jammy`
- Microsoft 官方 Playwright 镜像
- 基于 Ubuntu 22.04 (Jammy)
- 预装 Chrome、Firefox 和 WebKit 浏览器
- 针对 CI/CD 环境优化

**关键配置**:
```dockerfile
ENV CI=true                              # 启用 CI 模式
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1   # 使用预装浏览器
RUN npm ci                               # 安装所有依赖
```

**镜像大小**: ~2.5GB（包含所有浏览器和依赖）

---

### docker-compose.yml

#### 服务：`playwright-tests`

主要的测试执行服务。

**配置说明**:
```yaml
build:
  context: ..                  # 从项目根目录构建
  dockerfile: docker/Dockerfile
volumes:
  - ../:/app                   # 挂载源代码
  - /app/node_modules          # 保留容器的 node_modules
  - ../playwright-report:/app/playwright-report
  - ../test-results:/app/test-results
  - ../allure-results:/app/allure-results
environment:
  - CI=true
  - BASE_URL=https://booking.maui-rentals.com
```

**卷挂载策略**:
- **源代码挂载**: 开发时支持实时代码更新
- **报告目录**: 同步到宿主机便于查看
- **node_modules 隔离**: 防止宿主机/容器依赖冲突

#### 服务：`allure`

Allure 报告查看服务（可选）。

**配置说明**:
```yaml
image: frankescobar/allure-docker-service:2.23.1
ports:
  - "5050:5050"
environment:
  - CHECK_RESULTS_EVERY_SECONDS=3  # 自动刷新间隔
  - KEEP_HISTORY=1                 # 保留历史报告
```

**访问地址**: http://localhost:5050

---

## 💻 使用示例

### 基本测试执行

```bash
# 构建并运行测试（推荐）
npm run docker:build
npm run docker:test

# 不重新构建直接运行
docker-compose -f docker/docker-compose.yml up --abort-on-container-exit

# 后台运行
docker-compose -f docker/docker-compose.yml up -d
docker-compose -f docker/docker-compose.yml logs -f playwright-tests
```

### 运行特定测试套件

```bash
# 仅运行 E2E 测试
docker-compose -f docker/docker-compose.yml run --rm playwright-tests npm run test:e2e

# 仅运行 API 测试
docker-compose -f docker/docker-compose.yml run --rm playwright-tests npm run test:api

# 指定浏览器
docker-compose -f docker/docker-compose.yml run --rm playwright-tests npm run test:chromium

# 调试模式
docker-compose -f docker/docker-compose.yml run --rm playwright-tests npm run test:headed
```

### 自定义环境变量

```bash
# 使用自定义 BASE_URL
BASE_URL=https://staging.example.com docker-compose -f docker/docker-compose.yml up

# 或创建 .env 文件
echo "BASE_URL=https://staging.example.com" > docker/.env
docker-compose -f docker/docker-compose.yml up
```

### 清理资源

```bash
# 停止所有服务
docker-compose -f docker/docker-compose.yml down

# 删除容器和卷
docker-compose -f docker/docker-compose.yml down -v

# 删除镜像
docker-compose -f docker/docker-compose.yml down --rmi all
```

---

## 🐛 故障排查

### 问题："Cannot find module" 错误

**原因**: 宿主机和容器的 node_modules 冲突

**解决方案**:
```bash
# 删除宿主机 node_modules 并重新构建
rm -rf node_modules
docker-compose -f docker/docker-compose.yml build --no-cache
```

### 问题：容器中测试超时

**原因**: 容器资源不足

**解决方案**:
```bash
# 增加 Docker 内存限制（Docker Desktop）
# 设置 → 资源 → 内存：4GB+

# 或修改 docker-compose.yml：
services:
  playwright-tests:
    mem_limit: 4g
    cpus: 2
```

### 问题：Allure 服务显示"未找到结果"

**原因**: 尚未运行测试，或结果未同步

**解决方案**:
```bash
# 先运行测试生成结果
docker-compose -f docker/docker-compose.yml up playwright-tests

# 然后启动 Allure 服务
docker-compose -f docker/docker-compose.yml up allure
```

### 问题：Linux 上权限被拒绝

**原因**: 容器和宿主机之间的文件所有权冲突

**解决方案**:
```bash
# 使用当前用户运行（在 docker-compose.yml 中添加）
services:
  playwright-tests:
    user: "${UID}:${GID}"

# 或运行后修复权限
sudo chown -R $USER:$USER playwright-report test-results allure-results
```

---

## 🎯 最佳实践

### 开发环境

1. **使用卷挂载** 实现实时代码更新
2. **保持容器运行** 使用 `-d` 参数加快迭代速度
3. **使用 test:ui 模式** 本地调试（需要 X11 转发）

### CI/CD 环境

1. **禁用卷挂载** 使用容器内置代码
2. **使用 `--abort-on-container-exit`** 自动清理
3. **缓存 Docker 层** 加速构建

### 生产环境

1. **固定镜像版本** 避免使用 `latest` 标签
2. **设置资源限制** 防止资源耗尽
3. **使用健康检查** 监控容器状态

---

## 📚 额外资源

- [Playwright 文档](https://playwright.dev/docs/docker)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Allure Docker Service](https://github.com/fescobar/allure-docker-service)

---

## 🔄 更新配置

### 升级 Playwright 版本

1. 更新 `package.json`:
   ```json
   "@playwright/test": "^1.49.0"
   ```

2. 更新 `Dockerfile`:
   ```dockerfile
   FROM mcr.microsoft.com/playwright:v1.49.0-jammy
   ```

3. 重新构建镜像:
   ```bash
   docker-compose -f docker/docker-compose.yml build --no-cache
   ```

### 添加新环境变量

1. 更新 `docker-compose.yml`:
   ```yaml
   environment:
     - NEW_VAR=${NEW_VAR}
   ```

2. 如需要，创建 `.env` 文件:
   ```bash
   echo "NEW_VAR=value" >> docker/.env
   ```

---

## 📝 注意事项

- 容器时区默认为 UTC
- Playwright 浏览器已预装在基础镜像中
- 测试报告在容器删除后仍保留在宿主机
- 网络模式默认为 `bridge`（容器间可互相通信）

---

## 🤝 贡献指南

修改 Docker 配置时：

1. 先在本地测试更改
2. 如需要，同时更新 Dockerfile 和 docker-compose.yml
3. 更新本 README 文档说明配置变更
4. 验证 CI/CD 兼容性

---

**最后更新**: 2025-10-27
**Playwright 版本**: 1.48.0
**Docker Compose 版本**: 3.8

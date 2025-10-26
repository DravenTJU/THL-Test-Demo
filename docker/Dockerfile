# THL Test Demo - Dockerfile
# 用于运行Playwright测试的Docker镜像

FROM mcr.microsoft.com/playwright:v1.48.0-jammy

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV CI=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && \
    npm install --only=dev

# 复制项目文件
COPY . .

# 安装Playwright浏览器（如果需要）
# RUN npx playwright install --with-deps

# 设置默认命令
CMD ["npm", "test"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# 元数据
LABEL maintainer="THL Test Engineer Candidate"
LABEL description="Playwright test environment for Maui Rentals"
LABEL version="1.0.0"

# THL Test Demo - Dockerfile
# Docker image for running Playwright tests

FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Set working directory
WORKDIR /app

# Set environment variables
ENV CI=true
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy project files
COPY . .

# Install Playwright browsers (if needed)
# RUN npx playwright install --with-deps

# Set default command
CMD ["npm", "test"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node --version || exit 1

# Metadata
LABEL maintainer="THL Test Engineer Candidate"
LABEL description="Playwright test environment for Maui Rentals"
LABEL version="1.0.0"

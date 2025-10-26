# Docker Configuration for THL Test Demo

[中文文档](./README.zh-CN.md) | **English**

This directory contains Docker configuration files for running Playwright tests in a containerized environment.

---

## 📋 Overview

The Docker setup provides:
- **Consistent test environment** across different machines and CI/CD platforms
- **Playwright 1.56.1** with pre-installed browsers (Chrome, Firefox, Safari)
- **Allure reporting service** for viewing test results
- **Automatic test report synchronization** between container and host

---

## 🚀 Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 1.29+

### Running Tests

```bash
# From project root
npm run docker:build
npm run docker:test

# Or use docker-compose directly
docker-compose -f docker/docker-compose.yml build
docker-compose -f docker/docker-compose.yml up --abort-on-container-exit

# From docker directory
cd docker
docker-compose up --build --abort-on-container-exit
```

### Viewing Allure Reports

```bash
# Start Allure service (requires test results)
docker-compose -f docker/docker-compose.yml up allure

# Access at http://localhost:5050
```

---

## 📁 File Structure

```
docker/
├── Dockerfile           # Test environment image definition
├── docker-compose.yml   # Multi-service orchestration
├── README.md           # This file (English)
└── README.zh-CN.md     # Chinese documentation
```

---

## 🔧 Configuration Details

### Dockerfile

**Base Image**: `mcr.microsoft.com/playwright:v1.56.1-jammy`
- Official Microsoft Playwright image
- Ubuntu 22.04 (Jammy) based
- Pre-installed Chrome, Firefox, and WebKit browsers
- Optimized for CI/CD environments

**Key Configuration**:
```dockerfile
ENV CI=true                              # Enable CI mode
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1   # Use pre-installed browsers
RUN npm ci                               # Install all dependencies
```

**Image Size**: ~2.5GB (includes all browsers and dependencies)

---

### docker-compose.yml

#### Service: `playwright-tests`

The main test execution service.

**Configuration**:
```yaml
build:
  context: ..                  # Build from project root
  dockerfile: docker/Dockerfile
volumes:
  - ../:/app                   # Mount source code
  - /app/node_modules          # Preserve container node_modules
  - ../playwright-report:/app/playwright-report
  - ../test-results:/app/test-results
  - ../allure-results:/app/allure-results
environment:
  - CI=true
  - BASE_URL=https://booking.maui-rentals.com
```

**Volume Strategy**:
- **Source code mounting**: Allows real-time code updates during development
- **Report directories**: Synchronized to host for easy access
- **node_modules isolation**: Prevents host/container dependency conflicts

#### Service: `allure`

Allure report viewing service (optional).

**Configuration**:
```yaml
image: frankescobar/allure-docker-service:2.23.1
ports:
  - "5050:5050"
environment:
  - CHECK_RESULTS_EVERY_SECONDS=3  # Auto-refresh interval
  - KEEP_HISTORY=1                 # Retain historical reports
```

**Access**: http://localhost:5050

---

## 💻 Usage Examples

### Basic Test Execution

```bash
# Build and run tests (recommended)
npm run docker:build
npm run docker:test

# Run tests without rebuilding
docker-compose -f docker/docker-compose.yml up --abort-on-container-exit

# Run tests in detached mode
docker-compose -f docker/docker-compose.yml up -d
docker-compose -f docker/docker-compose.yml logs -f playwright-tests
```

### Running Specific Test Suites

```bash
# E2E tests only
docker-compose -f docker/docker-compose.yml run --rm playwright-tests npm run test:e2e

# API tests only
docker-compose -f docker/docker-compose.yml run --rm playwright-tests npm run test:api

# Specific browser
docker-compose -f docker/docker-compose.yml run --rm playwright-tests npm run test:chromium

# Debug mode
docker-compose -f docker/docker-compose.yml run --rm playwright-tests npm run test:headed
```

### Custom Environment Variables

```bash
# Use custom BASE_URL
BASE_URL=https://staging.example.com docker-compose -f docker/docker-compose.yml up

# Or create .env file in docker directory
echo "BASE_URL=https://staging.example.com" > docker/.env
docker-compose -f docker/docker-compose.yml up
```

### Cleanup

```bash
# Stop all services
docker-compose -f docker/docker-compose.yml down

# Remove containers and volumes
docker-compose -f docker/docker-compose.yml down -v

# Remove images
docker-compose -f docker/docker-compose.yml down --rmi all
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Cause**: node_modules conflict between host and container

**Solution**:
```bash
# Remove host node_modules and rebuild
rm -rf node_modules
docker-compose -f docker/docker-compose.yml build --no-cache
```

### Issue: Tests timeout in container

**Cause**: Insufficient container resources

**Solution**:
```bash
# Increase Docker memory limit (Docker Desktop)
# Settings → Resources → Memory: 4GB+

# Or modify docker-compose.yml:
services:
  playwright-tests:
    mem_limit: 4g
    cpus: 2
```

### Issue: Allure service shows "No results found"

**Cause**: Tests haven't been run yet, or results not synchronized

**Solution**:
```bash
# Run tests first to generate results
docker-compose -f docker/docker-compose.yml up playwright-tests

# Then start Allure service
docker-compose -f docker/docker-compose.yml up allure
```

### Issue: Permission denied on Linux

**Cause**: File ownership conflicts between container and host

**Solution**:
```bash
# Run with current user (add to docker-compose.yml)
services:
  playwright-tests:
    user: "${UID}:${GID}"

# Or fix permissions after running
sudo chown -R $USER:$USER playwright-report test-results allure-results
```

---

## 🎯 Best Practices

### For Development

1. **Use volume mounting** for real-time code updates
2. **Keep container running** with `-d` flag for faster iterations
3. **Use test:ui mode** locally for debugging (requires X11 forwarding)

### For CI/CD

1. **Disable volume mounting** to use container's built-in code
2. **Use `--abort-on-container-exit`** for automatic cleanup
3. **Cache Docker layers** to speed up builds

### For Production

1. **Pin specific image versions** (avoid `latest` tag)
2. **Set resource limits** to prevent resource exhaustion
3. **Use health checks** for container monitoring

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/docker)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Allure Docker Service](https://github.com/fescobar/allure-docker-service)

---

## 🔄 Updating Configuration

### Upgrade Playwright Version

1. Update `package.json`:
   ```json
   "@playwright/test": "1.56.1"
   ```

2. Update `Dockerfile`:
   ```dockerfile
   FROM mcr.microsoft.com/playwright:v1.56.1-jammy
   ```

3. Rebuild image:
   ```bash
   docker-compose -f docker/docker-compose.yml build --no-cache
   ```

### Add New Environment Variables

1. Update `docker-compose.yml`:
   ```yaml
   environment:
     - NEW_VAR=${NEW_VAR}
   ```

2. Create `.env` file if needed:
   ```bash
   echo "NEW_VAR=value" >> docker/.env
   ```

---

## 📝 Notes

- Container timezone is UTC by default
- Playwright browsers are pre-installed in the base image
- Test reports persist on host even after container removal
- Network mode is `bridge` by default (containers can communicate)

---

## 🤝 Contributing

When modifying Docker configuration:

1. Test changes locally first
2. Update both Dockerfile and docker-compose.yml if needed
3. Update this README with configuration changes
4. Verify CI/CD compatibility

---

**Last Updated**: 2025-10-27
**Playwright Version**: 1.56.1
**Docker Compose Version**: 3.8

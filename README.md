# THL Test Engineer Demo

**English** | [中文](./README.zh-CN.md)

> Enterprise-grade Playwright Testing Framework for Maui Rentals Search Functionality

[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](https://github.com)
[![Playwright](https://img.shields.io/badge/Playwright-1.56-green)](https://playwright.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com)

## 📋 Project Overview

This project is a technical demonstration for the automated testing framework targeting the [Maui Rentals motorhome booking search page](https://booking.maui-rentals.com/?cc=nz&open-mobile=true).

### 🎯 Technology Stack

- ✅ **Playwright** - Modern end-to-end testing framework
- ✅ **TypeScript** - Type-safe JavaScript superset
- ✅ **API Testing** - Using Playwright's API Testing capabilities
- ✅ **CI/CD** - GitHub Actions automation pipeline
- ✅ **Docker** - Containerized testing environment

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- (Optional) Docker & Docker Compose

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd THL-Test-Demo

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Configure environment variables (optional)
cp .env.example .env
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:e2e          # E2E tests
npm run test:api          # API tests
npm run test:unit         # Unit tests

# Run by browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# UI mode (debugging)
npm run test:ui

# View test reports
npm run report            # HTML report
npm run report:allure     # Allure report
```

### Running with Docker

```bash
# Build and run tests
npm run docker:build
npm run docker:test

# Or use docker-compose directly
docker-compose -f docker/docker-compose.yml up --build --abort-on-container-exit

# View Allure reports
docker-compose -f docker/docker-compose.yml up allure
# Access at http://localhost:5050
```

> 💡 **Tip**: See [docker/README.md](./docker/README.md) for detailed Docker usage instructions

---

## 📁 Project Structure

```
THL-Test-Demo/
├── .github/workflows/      # GitHub Actions CI/CD configuration
│   └── ci.yml             # Automated testing pipeline
│
├── tests/                 # Test cases
│   ├── e2e/              # End-to-end tests
│   │   └── complete-search-flow.spec.ts  # Complete search flow tests
│   ├── api/              # API tests
│   │   └── availability-api.spec.ts      # Cosmos Availability API tests
│   └── unit/             # Unit tests (SearchPage methods)
│       ├── clickPickupLocation.spec.ts
│       ├── selectPassengers.spec.ts
│       ├── selectTravelDates.spec.ts
│       └── ...(tests for each core method)
│
├── pages/                 # Page Object Model
│   ├── BasePage.ts       # Base page class
│   └── SearchPage.ts     # Search page object
│
├── docker/                # Docker configuration
│   ├── Dockerfile        # Test environment image
│   ├── docker-compose.yml # Service orchestration
│   ├── README.md         # Docker documentation (English)
│   └── README.zh-CN.md   # Docker documentation (Chinese)
│
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json         # TypeScript configuration
├── CLAUDE.md             # Claude Code development guide
├── README.md             # This file (English)
└── README.zh-CN.md       # This file (Chinese)
```

---

## 🧪 Test Coverage

### E2E Tests

#### Complete Search Flow Tests
- ✅ Complete search flow (all fields)
- ✅ Pickup/dropoff location selection (click and search methods)
- ✅ Date selection (cross-month support)
- ✅ Passenger selection (input and button methods)
- ✅ Licence country selection
- ✅ Promo code input
- ✅ Search results validation

### API Tests

- ✅ Cosmos Availability API request/response validation
- ✅ Data structure validation (locations, stations, vehicles)
- ✅ Search parameter validation (dates, locations, passengers)
- ✅ Error handling tests
- ✅ Response time validation
- ✅ Idempotency tests

### Unit Tests

For each core SearchPage method:
- ✅ `clickPickupLocation` - Pickup location selection
- ✅ `searchPickupLocation` - Pickup location search
- ✅ `clickDropoffLocation` - Dropoff location selection
- ✅ `searchDropoffLocation` - Dropoff location search
- ✅ `selectTravelDates` - Date selection
- ✅ `selectPassengers` - Passenger selection
- ✅ `selectLicenceCountry` - Licence country selection
- ✅ `enterPromoCode` - Promo code input

---

## 🏗️ Architecture Design

### Page Object Model (POM)

Implements the classic Page Object Model design pattern, separating test code from page logic:

```typescript
// Usage example
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

**Benefits**:
- High code reusability
- Easy to maintain
- Strong test case readability
- Centralized element locator management

### Key Design Features

1. **Smart waiting mechanisms**: All interaction methods include automatic waits to avoid flaky tests
2. **Role-based selectors**: Prioritizes Playwright's recommended `getByRole` selectors
3. **Detailed JSDoc documentation**: Each method has complete interaction flow descriptions
4. **Multiple interaction methods**: Supports different user interaction patterns (e.g., input vs buttons)

---

## ⚙️ CI/CD Pipeline

### GitHub Actions Pipeline

```yaml
Triggers:
  - Push to main/develop branches
  - Pull Requests
  - Scheduled (daily at 00:00 UTC)
  - Manual dispatch

Pipeline Stages:
  1. Code checks (Lint & Format)
  2. E2E tests (parallel multi-browser)
  3. API tests
  4. Unit tests
  5. Allure report generation

Parallel Strategy:
  - 3 browsers x parallel execution
  - Significantly reduces test time
```

### Test Reports

Automatically generated after test completion:

1. **HTML Report** - Playwright built-in report
2. **Allure Report** - Detailed test execution report
3. **Failure Screenshots/Videos** - Automatically captures failed scenarios
4. **GitHub Actions Artifacts** - Reports saved as build artifacts

---

## 📊 Performance Metrics

### Target Thresholds

| Metric | Target | Description |
|--------|--------|-------------|
| Page Load Time | < 3s | From navigation to load complete |
| API Response Time | < 3s | Cosmos Availability API |
| Test Execution Time | < 5 min | Complete test suite |

---

## 🐛 Debugging and Troubleshooting

### Debug Modes

```bash
# UI mode - Visual debugging (recommended)
npm run test:ui

# Debug mode - Step-by-step execution
npm run test:debug

# Headed mode - Display browser
npm run test:headed
```

### Common Issues

<details>
<summary><b>Issue 1: Element locator failure</b></summary>

**Cause**: Slow page load or incorrect element selector

**Solution**:
```typescript
// Use waitForSearchWidgetVisible to ensure page is loaded
await searchPage.waitForSearchWidgetVisible();

// Use more stable selectors
const element = page.getByRole('button', { name: 'Search' });
```
</details>

<details>
<summary><b>Issue 2: Date selection failure</b></summary>

**Cause**: Incorrect date format or expired date

**Solution**:
- Confirm date format is `YYYY-MM-DD`
- Confirm date is in the future
- Supported locations: Auckland, Christchurch, Queenstown
</details>

<details>
<summary><b>Issue 3: Docker test failure</b></summary>

**Cause**: Docker configuration or resource issues

**Solution**:
- See [docker/README.md](./docker/README.md) troubleshooting section
- Check Docker resource limits (memory >= 4GB)
</details>

---

## 🔒 Best Practices

### Code Quality

- ✅ TypeScript strict mode
- ✅ ESLint code checking
- ✅ Prettier auto-formatting
- ✅ Complete JSDoc comments

### Test Design

- ✅ Test isolation - Each test runs independently
- ✅ Smart waits - Avoid hard-coded delays
- ✅ Failure retries - Automatic retries in CI environment
- ✅ Parallel execution - Accelerate test runs

### Security

- ✅ Environment variable management
- ✅ Sensitive data protection
- ✅ Comprehensive .gitignore configuration

---

## 📚 Documentation

### Project Documentation
- [CLAUDE.md](./CLAUDE.md) - Claude Code development guide
- [Docker Configuration](./docker/README.md) - Detailed Docker usage documentation

### External Resources
- [Playwright Official Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

## 📝 License

MIT License

---

## 📈 Project Highlights

### 🎯 Comprehensive Technology Stack
- ✅ Playwright + TypeScript
- ✅ API Testing
- ✅ CI/CD (GitHub Actions)
- ✅ Docker containerization

### 🏆 Enterprise-Grade Architecture
- ✅ Page Object Model design pattern
- ✅ Modularity and maintainability
- ✅ Complete error handling
- ✅ Detailed code comments

### ⚡ High-Quality Testing
- ✅ E2E tests (complete flows)
- ✅ API tests (Cosmos Availability)
- ✅ Unit tests (each core method)
- ✅ Cross-browser coverage

### 🚀 Automation Capabilities
- ✅ GitHub Actions CI/CD
- ✅ Parallel test execution
- ✅ Automated test reporting
- ✅ One-click Docker execution

### 📖 Complete Documentation
- ✅ Detailed README (bilingual)
- ✅ Docker usage documentation (bilingual)
- ✅ Inline code comments

---

**Project Maintainer**: Draven
**Last Updated**: 2025-10-27
**Playwright Version**: 1.56.1
**TypeScript Version**: 5.6.3

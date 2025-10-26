import { test } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * Complete Search Flow E2E Tests
 *
 * Test objectives: validate end-to-end search functionality
 * - Test complete search flow with all fields
 * - Test user journey from landing to search execution
 *
 * Run with:
 * npx playwright test tests/e2e/complete-search-flow.spec.ts
 * npx playwright test tests/e2e/complete-search-flow.spec.ts --ui
 * npx playwright test tests/e2e/complete-search-flow.spec.ts --headed
 * npx playwright test tests/e2e/complete-search-flow.spec.ts --debug
 */

test.describe('Complete Search Flow E2E Tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await searchPage.waitForSearchWidgetVisible();
  });

  test.describe('Complete Search Flow - All Fields', () => {
    test('should complete full search with all optional fields', async ({ page }) => {
      console.log('🧪 E2E Test: Complete search flow with all fields');

      await test.step('Select pickup location', async () => {
        await searchPage.clickPickupLocation('Auckland');
        console.log('  ✅ Pickup location selected: Auckland');
      });

      await test.step('Select dropoff location', async () => {
        await searchPage.clickDropoffLocation('Christchurch');
        console.log('  ✅ Dropoff location selected: Christchurch');
      });

      await test.step('Select travel dates', async () => {
        await searchPage.selectTravelDates('2025-11-15', '2025-11-20');
        console.log('  ✅ Travel dates selected: 2025-11-15 to 2025-11-20');
      });

      await test.step('Select passengers', async () => {
        await searchPage.selectPassengers({
          adults: 2,
          children: 1,
          driverAge: '21+',
          method: 'input'
        });
        console.log('  ✅ Passengers selected: 2 adults, 1 child, driver age 21+');
      });

      await test.step('Select licence country', async () => {
        await searchPage.selectLicenceCountry('New Zealand');
        console.log('  ✅ Licence country selected: New Zealand');
      });

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode('SUMMER2025');
        console.log('  ✅ Promo code entered: SUMMER2025');
      });

      await test.step('Click search button', async () => {
        await searchPage.clickSearch();
        console.log('  ✅ Search button clicked');
      });

      await test.step('Wait for search results page to load', async () => {
        // Wait for search results page by checking for "Sort by:" text
        await page.getByText('Sort by:').waitFor({ state: 'visible', timeout: 15000 });
        console.log('  ✅ Search results page loaded successfully');
      });
    });

    test('should complete full search using button method for passengers', async ({ page }) => {
      console.log('🧪 E2E Test: Complete search flow using button method');

      await test.step('Select pickup location', async () => {
        await searchPage.clickPickupLocation('Queenstown');
        console.log('  ✅ Pickup location selected: Queenstown');
      });

      await test.step('Select dropoff location', async () => {
        await searchPage.clickDropoffLocation('Auckland');
        console.log('  ✅ Dropoff location selected: Auckland');
      });

      await test.step('Select travel dates', async () => {
        await searchPage.selectTravelDates('2025-11-10', '2025-11-15');
        console.log('  ✅ Travel dates selected: 2025-11-10 to 2025-11-15');
      });

      await test.step('Select passengers using buttons', async () => {
        await searchPage.selectPassengers({
          adults: 3,
          children: 2,
          driverAge: '18-20',
          method: 'buttons'
        });
        console.log('  ✅ Passengers selected using buttons: 3 adults, 2 children, driver age 18-20');
      });

      await test.step('Select licence country', async () => {
        await searchPage.selectLicenceCountry('Australia');
        console.log('  ✅ Licence country selected: Australia');
      });

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode('WINTER2025');
        console.log('  ✅ Promo code entered: WINTER2025');
      });

      await test.step('Click search button', async () => {
        await searchPage.clickSearch();
        console.log('  ✅ Search button clicked');
      });

      await test.step('Wait for search results page to load', async () => {
        await page.getByText('Sort by:').waitFor({ state: 'visible', timeout: 15000 });
        console.log('  ✅ Search results page loaded successfully');
      });
    });

    test('should complete search using performFullSearch method', async ({ page }) => {
      console.log('🧪 E2E Test: Using performFullSearch helper method');

      await test.step('Execute full search using performFullSearch', async () => {
        await searchPage.performFullSearch({
          pickupLocation: 'Queenstown',
          dropoffLocation: 'Auckland',
          pickupDate: '2026-09-15',
          dropoffDate: '2026-09-22',
          adults: 2,
          children: 1,
          driverAge: '21+',
          passengerMethod: 'input',
          licenceCountry: 'New Zealand',
          promoCode: 'SPRING2026'
        });
        console.log('  ✅ Full search executed using performFullSearch method');
      });

      await test.step('Wait for search results page to load', async () => {
        await page.getByText('Sort by:').waitFor({ state: 'visible', timeout: 15000 });
        console.log('  ✅ Search results page loaded successfully');
      });
    });
  });

  test.describe('Search Flow - Real User Scenarios', () => {
    test('should handle typical family vacation search', async ({ page }) => {
      console.log('🧪 E2E Test: Family vacation search scenario');

      await test.step('Family selects Auckland to Queenstown', async () => {
        await searchPage.clickPickupLocation('Auckland');
        await searchPage.clickDropoffLocation('Queenstown');
        console.log('  ✅ Family vacation route selected');
      });

      await test.step('Family plans 2-week holiday', async () => {
        await searchPage.selectTravelDates('2025-12-15', '2025-12-29');
        console.log('  ✅ 2-week vacation dates selected');
      });

      await test.step('Family of 5 (2 adults, 3 children)', async () => {
        await searchPage.selectPassengers({
          adults: 2,
          children: 3,
          driverAge: '21+',
          method: 'input'
        });
        console.log('  ✅ Family passengers configured');
      });

      await test.step('Family has NZ licence', async () => {
        await searchPage.selectLicenceCountry('New Zealand');
        console.log('  ✅ NZ licence selected');
      });

      await test.step('Family uses holiday promo code', async () => {
        await searchPage.enterPromoCode('HOLIDAY2025');
        console.log('  ✅ Promo code applied');
      });

      await test.step('Execute family search', async () => {
        await searchPage.clickSearch();
        await page.getByText('Sort by:').waitFor({ state: 'visible', timeout: 15000 });
        console.log('  ✅ Family vacation search completed - results page loaded');
      });
    });

    test('should handle business traveler search', async ({ page }) => {
      console.log('🧪 E2E Test: Business traveler search scenario');

      await test.step('Business traveler books Auckland same location', async () => {
        await searchPage.clickPickupLocation('Auckland');
        await searchPage.clickDropoffLocation('Auckland');
        console.log('  ✅ Business location selected');
      });

      await test.step('Short business trip (3 days)', async () => {
        await searchPage.selectTravelDates('2025-11-10', '2025-11-13');
        console.log('  ✅ Business trip dates selected');
      });

      await test.step('Solo traveler', async () => {
        await searchPage.selectPassengers({
          adults: 1,
          children: 0,
          driverAge: '21+',
          method: 'input'
        });
        console.log('  ✅ Solo traveler configured');
      });

      await test.step('International licence (UK)', async () => {
        await searchPage.selectLicenceCountry('UK');
        console.log('  ✅ UK licence selected');
      });

      await test.step('Corporate promo code', async () => {
        await searchPage.enterPromoCode('CORP2025');
        console.log('  ✅ Corporate promo code applied');
      });

      await test.step('Execute business search', async () => {
        await searchPage.clickSearch();
        await page.getByText('Sort by:').waitFor({ state: 'visible', timeout: 15000 });
        console.log('  ✅ Business traveler search completed - results page loaded');
      });
    });

    test('should handle young driver search', async ({ page }) => {
      console.log('🧪 E2E Test: Young driver search scenario');

      await test.step('Young driver plans road trip', async () => {
        await searchPage.clickPickupLocation('Christchurch');
        await searchPage.clickDropoffLocation('Queenstown');
        console.log('  ✅ Road trip route selected');
      });

      await test.step('Weekend road trip', async () => {
        await searchPage.selectTravelDates('2025-11-28', '2025-11-30');
        console.log('  ✅ Weekend dates selected');
      });

      await test.step('Two young travelers', async () => {
        await searchPage.selectPassengers({
          adults: 2,
          children: 0,
          driverAge: '18-20',
          method: 'buttons'
        });
        console.log('  ✅ Young driver age selected (18-20)');
      });

      await test.step('Local NZ licence', async () => {
        await searchPage.selectLicenceCountry('NZ');
        console.log('  ✅ NZ licence selected using short code');
      });

      await test.step('Youth discount code', async () => {
        await searchPage.enterPromoCode('YOUTH2025');
        console.log('  ✅ Youth discount code applied');
      });

      await test.step('Execute young driver search', async () => {
        await searchPage.clickSearch();
        await page.getByText('Sort by:').waitFor({ state: 'visible', timeout: 15000 });
        console.log('  ✅ Young driver search completed - results page loaded');
      });
    });
  });
});

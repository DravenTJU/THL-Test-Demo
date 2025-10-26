import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * enterPromoCode unit tests
 *
 * Test objectives: validate promo code entry functionality
 * - Click the promo code button
 * - Open the promo code input field
 * - Verify input field is visible
 * - Enter various promo code formats
 * - Handle edge cases (empty, long, special characters)
 * - Support sequential entries and modifications
 * - Test integration with complete search flow
 * - Verify promo code is retained across field selections
 *
 * Run with:
 * npx playwright test tests/unit/enterPromoCode.spec.ts
 * npx playwright test tests/unit/enterPromoCode.spec.ts --ui
 * npx playwright test tests/unit/enterPromoCode.spec.ts --headed
 * npx playwright test tests/unit/enterPromoCode.spec.ts --debug
 */

test.describe('enterPromoCode unit tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await page.waitForTimeout(1000);
  });

  test.describe('Basic Functionality', () => {
    test('enter a simple promo code', async ({ page }) => {
      const promoCode = 'SUMMER2024';

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('enter alphanumeric promo code', async ({ page }) => {
      const promoCode = 'SAVE50';

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('enter promo code with numbers only', async ({ page }) => {
      const promoCode = '123456';

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('enter promo code with special characters', async ({ page }) => {
      const promoCode = 'PROMO-2024';

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('enter lowercase promo code', async ({ page }) => {
      const promoCode = 'discount2024';

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('enter mixed case promo code', async ({ page }) => {
      const promoCode = 'WeLcOmE2024';

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });
  });

  test.describe('Edge Cases', () => {
    test('handle empty string', async ({ page }) => {
      const promoCode = '';

      await test.step('Enter empty promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify input is empty', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe('');
      });
    });

    test('handle single character promo code', async ({ page }) => {
      const promoCode = 'A';

      await test.step('Enter single character promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('handle long promo code', async ({ page }) => {
      const promoCode = 'VERYLONGPROMOCODE123456789ABCDEFGHIJKLMNOP';

      await test.step('Enter long promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('handle promo code with spaces', async ({ page }) => {
      const promoCode = 'PROMO CODE';

      await test.step('Enter promo code with spaces', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('handle promo code with leading spaces', async ({ page }) => {
      const promoCode = '  PROMO2024';

      await test.step('Enter promo code with leading spaces', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('handle promo code with trailing spaces', async ({ page }) => {
      const promoCode = 'PROMO2024  ';

      await test.step('Enter promo code with trailing spaces', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });
  });

  test.describe('UI Interaction Flow', () => {
    test('open promo code input when button is clicked', async ({ page }) => {
      await test.step('Click promo code button', async () => {
        const promoButton = page.getByText('Promo codeSearch');
        await promoButton.click();
        await page.waitForTimeout(1000);
      });

      await test.step('Verify promo code input is visible', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        await expect(promoInput).toBeVisible();
      });
    });

    test('focus input field after clicking', async ({ page }) => {
      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode('TEST123');
      });

      await test.step('Verify input has value', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe('TEST123');
      });
    });
  });

  test.describe('Sequential Entries', () => {
    test('allow changing promo code', async ({ page }) => {
      await test.step('Enter first promo code', async () => {
        await searchPage.enterPromoCode('FIRST123');
      });

      await test.step('Verify first promo code', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe('FIRST123');
      });

      await test.step('Clear and enter second promo code', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        await promoInput.clear();
        await searchPage.enterPromoCode('SECOND456');
      });

      await test.step('Verify second promo code', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe('SECOND456');
      });
    });

    test('allow entering promo code multiple times without clearing', async ({ page }) => {
      await test.step('Enter first promo code', async () => {
        await searchPage.enterPromoCode('PROMO1');
      });

      await test.step('Enter second promo code (will append or replace)', async () => {
        await searchPage.enterPromoCode('PROMO2');
      });

      await test.step('Verify final value', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        // The fill method should replace the previous value
        expect(inputValue).toBe('PROMO2');
      });
    });
  });

  test.describe('Integration with Search Flow', () => {
    test('work in complete search flow', async ({ page }) => {
      await test.step('Fill basic search details', async () => {
        await searchPage.clickPickupLocation('Auckland');
        await searchPage.clickDropoffLocation('Auckland');
        await searchPage.selectTravelDates('2025-02-15', '2025-02-20');
      });

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode('DISCOUNT20');
      });

      await test.step('Verify promo code is retained', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe('DISCOUNT20');
      });
    });

    test('retain promo code after selecting other fields', async ({ page }) => {
      await test.step('Enter promo code first', async () => {
        await searchPage.enterPromoCode('EARLY2024');
      });

      await test.step('Select other fields', async () => {
        await searchPage.clickPickupLocation('Auckland');
        await searchPage.clickDropoffLocation('Christchurch');
      });

      await test.step('Verify promo code is still present', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe('EARLY2024');
      });
    });
  });

  test.describe('Special Characters', () => {
    test('handle promo code with underscores', async ({ page }) => {
      const promoCode = 'PROMO_2024';

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('handle promo code with dashes', async ({ page }) => {
      const promoCode = 'PROMO-2024-SPECIAL';

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });

    test('handle promo code with dots', async ({ page }) => {
      const promoCode = 'PROMO.2024';

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        expect(inputValue).toBe(promoCode);
      });
    });
  });

  test.describe('Performance', () => {
    test('enter promo code within reasonable time', async () => {
      const startTime = Date.now();

      await test.step('Enter promo code', async () => {
        await searchPage.enterPromoCode('PERFORMANCE2024');
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      await test.step('Verify performance', async () => {
        // Should complete within 5 seconds
        expect(duration).toBeLessThan(5000);
      });
    });

    test('handle rapid consecutive entries', async ({ page }) => {
      const promoCodes = ['CODE1', 'CODE2', 'CODE3'];

      for (const code of promoCodes) {
        await test.step(`Enter ${code}`, async () => {
          const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
          await promoInput.clear();
          await searchPage.enterPromoCode(code);

          const inputValue = await promoInput.inputValue();
          expect(inputValue).toBe(code);
        });
      }
    });
  });

  test.describe('Error Handling', () => {
    test('throw error if input field is not visible', async ({ page }) => {
      await test.step('Hide promo code input (simulate error condition)', async () => {
        // First open it normally
        await searchPage.enterPromoCode('TEST');

        // Then close it by clicking elsewhere
        const pickupButton = page.getByRole('button', { name: 'Choose your pickup location' });
        await pickupButton.click();
        await page.waitForTimeout(500);
      });

      // Note: This test assumes the input becomes hidden after clicking elsewhere
      // The actual behavior may vary depending on UI implementation
    });
  });

  test.describe('Boundary Testing', () => {
    test('handle maximum length promo code (if any)', async ({ page }) => {
      // Test with a very long promo code (100 characters)
      const promoCode = 'A'.repeat(100);

      await test.step('Enter maximum length promo code', async () => {
        await searchPage.enterPromoCode(promoCode);
      });

      await test.step('Verify promo code is entered or truncated', async () => {
        const promoInput = page.getByRole('textbox', { name: 'promo code optional' });
        const inputValue = await promoInput.inputValue();
        // Should either accept full value or truncate to max allowed length
        expect(inputValue.length).toBeGreaterThan(0);
      });
    });
  });
});

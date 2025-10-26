import { test, expect } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * selectLicenceCountry unit tests
 *
 * Test objectives: validate licence country selection functionality
 * - Click the licence country button
 * - Open the licence country dropdown menu
 * - Verify all country options are visible
 * - Select the matching country based on input
 * - Support multiple input formats (full name, short code, case variations)
 * - Handle whitespace and case insensitivity
 * - Verify sequential selections work correctly
 *
 * Run with:
 * npx playwright test tests/unit/selectLicenceCountry.spec.ts
 * npx playwright test tests/unit/selectLicenceCountry.spec.ts --ui
 * npx playwright test tests/unit/selectLicenceCountry.spec.ts --headed
 * npx playwright test tests/unit/selectLicenceCountry.spec.ts --debug
 */

test.describe('selectLicenceCountry unit tests', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.navigateToSearchPage({ cc: 'nz' });
    await page.waitForTimeout(1000);
  });

  test.describe('Basic Functionality', () => {
    test('select New Zealand as licence country', async ({ page }) => {
      await test.step('Select licence country', async () => {
        await searchPage.selectLicenceCountry('New Zealand');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('New Zealand');
      });
    });

    test('select Australia as licence country', async ({ page }) => {
      await test.step('Select licence country', async () => {
        await searchPage.selectLicenceCountry('Australia');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('Australia');
      });
    });

    test('select France as licence country', async ({ page }) => {
      await test.step('Select licence country', async () => {
        await searchPage.selectLicenceCountry('France');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('France');
      });
    });

    test('select United Kingdom as licence country', async ({ page }) => {
      await test.step('Select licence country', async () => {
        await searchPage.selectLicenceCountry('United Kingdom');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('United Kingdom');
      });
    });
  });

  test.describe('Input Variations', () => {
    test('handle "NZ" as input for New Zealand', async ({ page }) => {
      await test.step('Select licence country with short code', async () => {
        await searchPage.selectLicenceCountry('NZ');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('New Zealand');
      });
    });

    test('handle "newzealand" (no space) as input', async ({ page }) => {
      await test.step('Select licence country with no space', async () => {
        await searchPage.selectLicenceCountry('newzealand');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('New Zealand');
      });
    });

    test('handle "AU" as input for Australia', async ({ page }) => {
      await test.step('Select licence country with short code', async () => {
        await searchPage.selectLicenceCountry('AU');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('Australia');
      });
    });

    test('handle "UK" as input for United Kingdom', async ({ page }) => {
      await test.step('Select licence country with short code', async () => {
        await searchPage.selectLicenceCountry('UK');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('United Kingdom');
      });
    });

    test('handle "unitedkingdom" (no space) as input', async ({ page }) => {
      await test.step('Select licence country with no space', async () => {
        await searchPage.selectLicenceCountry('unitedkingdom');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('United Kingdom');
      });
    });

    test('handle "FR" as input for France', async ({ page }) => {
      await test.step('Select licence country with short code', async () => {
        await searchPage.selectLicenceCountry('FR');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('France');
      });
    });
  });

  test.describe('Case Insensitivity', () => {
    test('handle uppercase "NEW ZEALAND"', async ({ page }) => {
      await test.step('Select licence country with uppercase', async () => {
        await searchPage.selectLicenceCountry('NEW ZEALAND');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('New Zealand');
      });
    });

    test('handle mixed case "AuStRaLiA"', async ({ page }) => {
      await test.step('Select licence country with mixed case', async () => {
        await searchPage.selectLicenceCountry('AuStRaLiA');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('Australia');
      });
    });

    test('handle lowercase "france"', async ({ page }) => {
      await test.step('Select licence country with lowercase', async () => {
        await searchPage.selectLicenceCountry('france');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('France');
      });
    });
  });

  test.describe('Whitespace Handling', () => {
    test('handle leading whitespace " New Zealand"', async ({ page }) => {
      await test.step('Select licence country with leading whitespace', async () => {
        await searchPage.selectLicenceCountry(' New Zealand');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('New Zealand');
      });
    });

    test('handle trailing whitespace "Australia "', async ({ page }) => {
      await test.step('Select licence country with trailing whitespace', async () => {
        await searchPage.selectLicenceCountry('Australia ');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('Australia');
      });
    });

    test('handle both leading and trailing whitespace " France "', async ({ page }) => {
      await test.step('Select licence country with surrounding whitespace', async () => {
        await searchPage.selectLicenceCountry(' France ');
      });

      await test.step('Verify selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('France');
      });
    });
  });

  test.describe('UI Interaction Flow', () => {
    test('open dropdown when button is clicked', async ({ page }) => {
      await test.step('Click licence button', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        await licenceButton.click();
        await page.waitForTimeout(1000);
      });

      await test.step('Verify dropdown options are visible', async () => {
        const newZealandOption = page.locator('button').filter({ hasText: 'New Zealand' });
        const australiaOption = page.locator('button').filter({ hasText: 'Australia' });
        const franceOption = page.locator('button').filter({ hasText: 'France' });
        const ukOption = page.locator('button').filter({ hasText: 'United Kingdom' });

        await expect(newZealandOption).toBeVisible();
        await expect(australiaOption).toBeVisible();
        await expect(franceOption).toBeVisible();
        await expect(ukOption).toBeVisible();
      });
    });

    test('close dropdown after selection', async ({ page }) => {
      await test.step('Select licence country', async () => {
        await searchPage.selectLicenceCountry('New Zealand');
      });

      await test.step('Verify dropdown is closed', async () => {
        const newZealandOption = page.locator('button').filter({ hasText: 'New Zealand' });
        // After selection, the dropdown should close
        // We can check if the option is no longer visible or if only one instance is visible (in the button text)
        const count = await newZealandOption.count();
        expect(count).toBeLessThanOrEqual(1);
      });
    });
  });

  test.describe('Sequential Selections', () => {
    test('allow changing licence country selection', async ({ page }) => {
      await test.step('Select New Zealand first', async () => {
        await searchPage.selectLicenceCountry('New Zealand');
      });

      await test.step('Verify first selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('New Zealand');
      });

      await test.step('Change to Australia', async () => {
        await searchPage.selectLicenceCountry('Australia');
      });

      await test.step('Verify second selection', async () => {
        const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });
        const buttonText = await licenceButton.textContent();
        expect(buttonText).toContain('Australia');
      });
    });

    test('allow multiple changes', async ({ page }) => {
      const countries = ['New Zealand', 'Australia', 'France', 'United Kingdom'];
      const licenceButton = page.getByRole('button', { name: 'Select your drivers licence' });

      for (const country of countries) {
        await test.step(`Select ${country}`, async () => {
          await searchPage.selectLicenceCountry(country);
          const buttonText = await licenceButton.textContent();
          expect(buttonText).toContain(country);
        });
      }
    });
  });

  test.describe('Error Handling', () => {
    test('throw error for non-existent country', async () => {
      await test.step('Attempt to select non-existent country', async () => {
        await expect(async () => {
          await searchPage.selectLicenceCountry('InvalidCountry');
        }).rejects.toThrow();
      });
    });
  });

  test.describe('Performance', () => {
    test('select licence country within reasonable time', async () => {
      const startTime = Date.now();

      await test.step('Select licence country', async () => {
        await searchPage.selectLicenceCountry('New Zealand');
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      await test.step('Verify performance', async () => {
        // Should complete within 5 seconds
        expect(duration).toBeLessThan(5000);
      });
    });
  });
});

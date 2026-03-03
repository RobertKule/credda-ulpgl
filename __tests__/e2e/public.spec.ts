import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Public Pages End-to-End', () => {

  test('Homepage loads correctly and has expected title', async ({ page }) => {
    await page.goto('/fr');
    await expect(page).toHaveTitle(/CREDDA/);
    
    // Check main sections exist
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('Navigation works between main pages', async ({ page }) => {
    await page.goto('/fr');
    
    // Go to Research
    await page.getByRole('link', { name: /Recherche/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/research/);
    
    // Go to Clinical
    await page.getByRole('link', { name: /Clinique/i }).first().click();
    await expect(page).toHaveURL(/\/fr\/clinical/);
  });

  test('Homepage should pass basic accessibility checks', async ({ page }) => {
    await page.goto('/fr');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

});

import { test, expect } from '@playwright/test';

test.describe('Public Interface & Navigation', () => {
  test('should load the homepage in default locale (French) and display main CTAs', async ({ page }) => {
    await page.goto('/fr');
    
    // Check if the title sets correctly (CREDDA doesn't crash)
    await expect(page).toHaveTitle(/CREDDA/i);
    
    // Verify navigation links exist
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    
    // Look for contact link across the site
    const contactLinks = page.locator('a[href*="/contact"]');
    expect(await contactLinks.count()).toBeGreaterThan(0);
  });

  test('should display 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/fr/this-path-does-not-exist');
    
    // Assuming 404 contains "404" or localized equivalent
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(page.locator('text=404').first()).toBeVisible();
  });
});

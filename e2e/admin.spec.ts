import { test, expect } from '@playwright/test';

test.describe('Admin Security & Dashboard', () => {
  test('should prevent unauthorized access to the admin dashboard', async ({ page }) => {
    // Attempting to visit /admin without session should redirect to /admin/login
    await page.goto('/fr/admin/dashboard');
    
    // We expect the URL to switch to login
    await expect(page).toHaveURL(/.*\/admin\/login/);
  });

  test('admin login page should render login form and reject bad credentials', async ({ page }) => {
    await page.goto('/fr/admin/login');
    
    // Fill credentials
    await page.fill('input[type="email"]', 'hacker@example.com');
    await page.fill('input[type="password"]', 'badpassword123');
    
    await page.click('button[type="submit"]');

    // Display error message (Toast or inline)
    const errorToast = page.locator('text=Email ou mot de passe incorrect').first();
    await expect(errorToast).toBeVisible({ timeout: 5000 });
  });
});

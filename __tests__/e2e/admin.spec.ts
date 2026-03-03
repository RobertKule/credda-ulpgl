import { test, expect } from '@playwright/test';

test.describe('Admin Authentication and Pages', () => {
  
  test('Should redirect unauthenticated user from admin dashboard', async ({ page }) => {
    await page.goto('/fr/admin');
    // Default next-auth redirect to login page
    await expect(page).toHaveURL(/.*login.*/); 
  });

  test('Admin login page renders correctly', async ({ page }) => {
    await page.goto('/fr/login');
    await expect(page.getByRole('heading', { name: /connexion/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/mot de passe/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible();
  });

});

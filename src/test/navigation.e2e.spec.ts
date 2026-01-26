import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PickSpy/);
    await expect(page.locator('h1')).toContainText('AI Product Research');
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Pricing');
    await expect(page).toHaveURL(/.*pricing/);
    await expect(page.locator('h1')).toContainText(/Pick the plan/i);
  });

  test('should navigate to how it works', async ({ page }) => {
    await page.goto('/');
    await page.click('text=How It Works');
    await expect(page.locator('id=how-it-works')).toBeVisible();
  });
});

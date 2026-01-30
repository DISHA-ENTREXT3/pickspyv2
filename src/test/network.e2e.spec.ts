import { test, expect } from '@playwright/test';

test.describe('Network Resilience', () => {
  test('should handle slow network gracefully', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', async route => {
      await new Promise(f => setTimeout(f, 100)); // 100ms latency
      await route.continue();
    });

    await page.goto('/');
    await expect(page).toHaveTitle(/PickSpy/);
    
    // Check if loading indicators or content eventually appears
    // Assuming there's a skeleton or loading spinner initially if data fetch is slow
    // But for now, just verifying the page loads without crashing
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle offline/API failure gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/refresh', route => route.abort('failed'));
    
    await page.goto('/');
    // Should still show the shell application
    await expect(page.locator('header')).toBeVisible();
    // Might show an error toast or message
    // Note: Exact error UI depends on implementation, but page shouldn't crash
  });
});

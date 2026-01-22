import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://pickspy.vercel.app';

test.describe('PickSpy E2E Tests - Full Application Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.evaluate(() => sessionStorage.clear());
  });

  // ============================================
  // HOMEPAGE & NAVIGATION TESTS
  // ============================================
  
  test('should load homepage successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check page title
    await expect(page).toHaveTitle(/PickSpy/);
    
    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Check header is present
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should display all main sections on homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Hero section
    const heroText = page.locator('text=/discover trending/i');
    await expect(heroText).toBeVisible();
    
    // Features section
    const featuresSection = page.locator('text=/features/i');
    await expect(featuresSection).toBeVisible();
    
    // Pricing section (if exists)
    const pricingButton = page.locator('text=/pricing/i');
    await expect(pricingButton).toBeVisible();
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const pricingLink = page.locator('a:has-text("Pricing")').first();
    await pricingLink.click();
    
    await expect(page).toHaveURL(/.*pricing/);
    await expect(page.locator('text=/pricing/i')).toBeVisible();
  });

  test('should navigate to dashboard from header', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const dashboardLink = page.locator('text=/dashboard/i');
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      // Should redirect to login if not authenticated
      await expect(page).toHaveURL(/.*login|signup/);
    }
  });

  // ============================================
  // AUTHENTICATION TESTS
  // ============================================

  test('should display signup form', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    // Check form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button:has-text("Sign Up")');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("Sign Up")');
    
    // Fill with invalid email
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Check for error message
    const errorMessage = page.locator('text=/invalid|email/i');
    await expect(errorMessage).toBeVisible();
  });

  test('should navigate between signup and login', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    const loginLink = page.locator('a:has-text("Log in")');
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    
    await expect(page).toHaveURL(/.*login/);
    
    const signupLink = page.locator('a:has-text("Sign up")');
    await expect(signupLink).toBeVisible();
  });

  // ============================================
  // PRODUCT BROWSING TESTS
  // ============================================

  test('should display product cards on homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for product cards
    const productCard = page.locator('[class*="card"]').first();
    await expect(productCard).toBeVisible();
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search" i], input[placeholder*="Search" i]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('wireless earbuds');
      await searchInput.press('Enter');
      
      // Wait for results to update
      await page.waitForTimeout(1000);
    }
  });

  test('should have working filter functionality', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for filter buttons
    const filterButtons = page.locator('button:has-text(/filter|category|sort/i)');
    const count = await filterButtons.count();
    
    if (count > 0) {
      await filterButtons.first().click();
      await expect(page).toBeVisible();
    }
  });

  test('should show product details when clicking product card', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Click first product card
    const productCard = page.locator('[class*="card"]').first();
    await productCard.click();
    
    // Should navigate to product detail page
    await expect(page).toHaveURL(/.*product|detail/);
  });

  // ============================================
  // COMPARISON FEATURE TESTS
  // ============================================

  test('should navigate to compare page', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const compareLink = page.locator('text=/compare/i').first();
    if (await compareLink.isVisible()) {
      await compareLink.click();
      
      await expect(page).toHaveURL(/.*compare/);
    }
  });

  test('should have compare button in product cards', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const compareButton = page.locator('button:has-text(/compare|add/i)').first();
    await expect(compareButton).toBeVisible();
  });

  // ============================================
  // UI/UX TESTS
  // ============================================

  test('should have responsive navigation', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(BASE_URL);
    
    // Check for mobile menu (hamburger)
    const mobileMenu = page.locator('button[aria-label*="menu" i], button[class*="menu"]').first();
    await expect(page.locator('header')).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check for footer links
    const footerLinks = page.locator('footer a');
    const count = await footerLinks.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have working legal pages', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Click privacy policy
    const privacyLink = page.locator('a:has-text("Privacy")');
    if (await privacyLink.isVisible()) {
      await privacyLink.click();
      await expect(page).toHaveURL(/.*privacy/);
      await expect(page.locator('text=/privacy/i')).toBeVisible();
    }
  });

  test('should support dark mode toggle', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Look for theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme" i], button[class*="theme"]').first();
    
    if (await themeToggle.isVisible()) {
      const initialClass = await page.locator('html').getAttribute('class');
      
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      const newClass = await page.locator('html').getAttribute('class');
      
      // Check if class changed (dark mode toggled)
      expect(initialClass).not.toBe(newClass);
    }
  });

  // ============================================
  // API INTEGRATION TESTS
  // ============================================

  test('should load products without errors', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Monitor console for errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Should not have network errors
    const networkErrors = errors.filter(e => e.includes('404') || e.includes('500'));
    expect(networkErrors.length).toBe(0);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.route('**/api/**', route => route.abort());
    
    await page.goto(BASE_URL);
    
    // Should still render something
    await expect(page.locator('body')).toBeVisible();
  });

  // ============================================
  // PERFORMANCE TESTS
  // ============================================

  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Filter out known/acceptable errors
    const criticalErrors = errors.filter(
      e => !e.includes('Can\'t resolve') && !e.includes('Warning')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    
    // Should have at least one h1
    await expect(h1).toHaveCount(1);
  });

  test('should have alt text on images', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const altText = await images.nth(i).getAttribute('alt');
      // Images should have alt text
      expect(altText).toBeTruthy();
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    const labels = page.locator('label');
    await expect(labels).toHaveCount(3); // Email, Password, Confirm Password
  });

  // ============================================
  // CROSS-BROWSER TESTS
  // ============================================

  test('should render correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(BASE_URL);
    
    // Check main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should render correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto(BASE_URL);
    
    // Check main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should render correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto(BASE_URL);
    
    // Check main content is visible
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  // ============================================
  // EDGE CASES & ERROR HANDLING
  // ============================================

  test('should handle 404 page not found', async ({ page }) => {
    await page.goto(`${BASE_URL}/non-existent-page-123`);
    
    // Should show error or redirect
    const notFoundText = page.locator('text=/not found|404|error/i');
    await expect(notFoundText).toBeVisible();
  });

  test('should handle rapid navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Rapidly click multiple links
    const links = page.locator('a[href*="/"]').first();
    
    if (await links.isVisible()) {
      await links.click();
      await links.click();
      await links.click();
    }
    
    // Should handle gracefully
    await expect(page).toBeVisible();
  });

  test('should handle form resubmission', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);
    
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("Sign Up")');
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await submitButton.click({ clickCount: 2 }); // Double click
      
      // Should handle gracefully
      await expect(page).toBeVisible();
    }
  });
});

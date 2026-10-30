import { test, expect } from '../fixtures';

// BONUS: visual regression. Baselines are kept for Chromium only.
// First run: npm run test:visual:update   (creates baselines)   then: npm run test:visual
test.describe('Visual regression', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Baselines maintained for Chromium only');

  // Fixed viewport => screenshot size is always identical; small tolerance absorbs anti-aliasing noise.
  test.use({ viewport: { width: 1280, height: 720 } });

  const options = { maxDiffPixelRatio: 0.03, animations: 'disabled' as const };

  test('login page layout', { tag: '@visual' }, async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    await expect(page).toHaveScreenshot('login-page.png', options);
  });

  test('contact us page layout', { tag: '@visual' }, async ({ page }) => {
    await page.goto('/contact_us');
    await expect(page.getByTestId('submit-button')).toBeVisible();
    await expect(page).toHaveScreenshot('contact-page.png', options);
  });
});

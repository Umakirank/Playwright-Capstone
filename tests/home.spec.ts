import { test, expect } from '../fixtures';

test('TC00 - home page loads and primary navigation works', { tag: '@smoke' },
  async ({ homePage, navBar, page }) => {
    await homePage.goto();
    await homePage.expectLoaded();
    await navBar.products.click();
    await expect(page).toHaveURL(/\/products/);
  });

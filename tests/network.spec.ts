import { test, expect } from '../fixtures';
import products from '../testdata/products.json';

test.describe('Network interception & mocking', () => {
  test('TC07a - modify a real response (route.fetch + fulfill)', { tag: '@network' },
    async ({ page, productsPage }) => {
      const { originalName, mockedName } = products.mock;

      await page.route('**/products', async (route) => {
        const response = await route.fetch();
        const body = (await response.text()).replaceAll(originalName, mockedName);
        const headers = { ...response.headers() };
        delete headers['content-length']; // body length changed
        delete headers['content-encoding']; // route.fetch() already decompressed it
        await route.fulfill({ response, body, headers });
      });

      await productsPage.goto();
      await expect(productsPage.cards.filter({ hasText: mockedName }).first()).toBeVisible();
      await expect(productsPage.cards.filter({ hasText: originalName })).toHaveCount(0);
    });

  test('TC07b - fully mock a JSON API and assert the contract the UI would consume', { tag: '@network' },
    async ({ page }) => {
      await page.route('**/api/productsList', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ responseCode: 200, products: [{ id: 999, name: 'Mock Item', price: 'Rs. 1' }] }),
        }),
      );

      await page.goto('/');
      const data = await page.evaluate(async () => (await fetch('/api/productsList')).json());
      expect(data.products).toHaveLength(1);
      expect(data.products[0].name).toBe('Mock Item');
    });

  test('TC07c - simulate a failing backend (HTTP 500) and make sure the page is not left blank', { tag: '@network' },
    async ({ page }) => {
      await page.route('**/products', (route) =>
        route.fulfill({ status: 500, contentType: 'text/html', body: '<h1>Simulated outage</h1>' }),
      );
      const response = await page.goto('/products');
      expect(response?.status()).toBe(500);
      await expect(page.getByRole('heading', { name: 'Simulated outage' })).toBeVisible();
    });
});

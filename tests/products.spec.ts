import { test, expect } from '../fixtures';
import products from '../testdata/products.json';

test.describe('Product search (data-driven)', () => {
  for (const s of products.searches) {
    test(`TC03 - search "${s.term}"`, { tag: ['@smoke', '@search'] }, async ({ productsPage }) => {
      await productsPage.goto();
      await productsPage.search(s.term);

      if (s.expectEmpty) {
        await expect(productsPage.cards).toHaveCount(0);
        return;
      }

      expect(await productsPage.cards.count()).toBeGreaterThanOrEqual(s.minResults);
      if (s.nameContains) {
        for (const name of await productsPage.productNames()) {
          expect(name.toLowerCase()).toContain(s.nameContains);
        }
      }
    });
  }
});

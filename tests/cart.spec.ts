import { test, expect } from '../fixtures';

test.describe('Cart', () => {
  test('TC04 - add products to cart, validate totals, remove products', { tag: ['@smoke', '@cart'] },
    async ({ productsPage, cartPage }) => {
      await productsPage.goto();
      const first = await productsPage.addProductToCart(0);
      const second = await productsPage.addProductToCart(1);

      await cartPage.goto();
      expect((await cartPage.productNames()).sort()).toEqual([first, second].sort());

      // Business rule: line total = unit price x quantity
      for (const line of await cartPage.lines()) {
        expect(line.total).toBe(line.price * line.quantity);
      }

      await cartPage.removeProduct(first);
      expect(await cartPage.productNames()).toEqual([second]);

      await cartPage.removeProduct(second);
      await cartPage.expectEmpty();
    });
});

import { test, expect } from '../fixtures';
import payment from '../testdata/payment.json';

test.describe('Checkout & order placement', () => {
  test('TC05 - logged-in user checks out and the order is confirmed', { tag: ['@e2e', '@checkout'] },
    async ({ loggedInUser, productsPage, cartPage, checkoutPage, paymentPage }) => {
      await productsPage.goto();
      const items = [await productsPage.addProductToCart(0), await productsPage.addProductToCart(2)];

      await cartPage.goto();
      expect((await cartPage.productNames()).sort()).toEqual([...items].sort());
      await cartPage.proceedToCheckout();

      // Checkout review: address + items must match what we set up / selected
      await expect(checkoutPage.deliveryAddress).toBeVisible();
      await checkoutPage.expectAddressMatches(loggedInUser);
      await checkoutPage.expectReviewContains(items);

      await checkoutPage.placeOrder('Automated order - please do not ship.');
      await paymentPage.pay(payment);

      // Order placement validation
      await paymentPage.expectOrderConfirmed();
    });
});

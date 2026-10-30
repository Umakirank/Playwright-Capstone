import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../utils/dataFactory';

export class CheckoutPage extends BasePage {
  readonly path = '/checkout';

  readonly deliveryAddress = this.page.locator('#address_delivery');
  readonly billingAddress = this.page.locator('#address_invoice');
  readonly orderComment = this.page.locator('textarea[name="message"]');
  readonly placeOrderLink = this.page.getByRole('link', { name: 'Place Order' });

  async expectAddressMatches(u: UserData): Promise<void> {
    for (const block of [this.deliveryAddress, this.billingAddress]) {
      await expect(block).toContainText(`${u.firstName} ${u.lastName}`);
      await expect(block).toContainText(u.address1);
      await expect(block).toContainText(u.city);
      await expect(block).toContainText(u.country);
      await expect(block).toContainText(u.mobile);
    }
  }

  async expectReviewContains(productNames: string[]): Promise<void> {
    const names = await this.page.locator('#cart_info .cart_description h4 a').allTextContents();
    expect(names.map((n) => n.trim()).sort()).toEqual([...productNames].sort());
  }

  async placeOrder(comment: string): Promise<void> {
    await this.orderComment.fill(comment);
    await this.placeOrderLink.click();
  }
}

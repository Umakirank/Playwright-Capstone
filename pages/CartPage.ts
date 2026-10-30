import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { parseRs } from '../utils/helpers';

export interface CartLine {
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export class CartPage extends BasePage {
  readonly path = '/view_cart';

  readonly rows = this.page.locator('#cart_info_table tbody tr');
  readonly emptyMessage = this.page.locator('#empty_cart');
  readonly proceedToCheckoutButton = this.page.locator('.check_out');

  rowFor(productName: string): Locator {
    return this.rows.filter({ hasText: productName });
  }

  async productNames(): Promise<string[]> {
    const names = await this.page.locator('#cart_info_table .cart_description h4 a').allTextContents();
    return names.map((n) => n.trim());
  }

  async lines(): Promise<CartLine[]> {
    const count = await this.rows.count();
    const lines: CartLine[] = [];
    for (let i = 0; i < count; i++) {
      const row = this.rows.nth(i);
      lines.push({
        name: (await row.locator('.cart_description h4 a').innerText()).trim(),
        price: parseRs(await row.locator('.cart_price p').innerText()),
        quantity: Number((await row.locator('.cart_quantity button').innerText()).trim()),
        total: parseRs(await row.locator('.cart_total_price').innerText()),
      });
    }
    return lines;
  }

  async removeProduct(productName: string): Promise<void> {
    const row = this.rowFor(productName);
    await row.locator('.cart_quantity_delete').click();
    await expect(row).toHaveCount(0);
  }

  async expectEmpty(): Promise<void> {
    await expect(this.emptyMessage).toContainText('Cart is empty');
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}

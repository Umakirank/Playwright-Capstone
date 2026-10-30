import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly path = '/products';

  readonly searchInput = this.page.locator('#search_product');
  readonly searchButton = this.page.locator('#submit_search');
  readonly searchedHeading = this.page.getByRole('heading', { name: 'Searched Products' });
  readonly cards = this.page.locator('.features_items .product-image-wrapper');
  readonly cartModal = this.page.locator('#cartModal');

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await expect(this.searchedHeading).toBeVisible();
  }

  async productNames(): Promise<string[]> {
    const names = await this.cards.locator('.productinfo p').allTextContents();
    return names.map((n) => n.trim());
  }

  /** Adds the nth product to the cart, dismisses the modal and returns the product name. */
  async addProductToCart(index: number): Promise<string> {
    const card = this.cards.nth(index);
    const name = (await card.locator('.productinfo p').innerText()).trim();
    await card.hover(); // the hover overlay hosts the clickable "Add to cart"
    await card.locator('.product-overlay .add-to-cart').click();
    await expect(this.cartModal).toBeVisible();
    await this.cartModal.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(this.cartModal).toBeHidden();
    return name;
  }
}

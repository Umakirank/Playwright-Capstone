import { Locator, Page } from '@playwright/test';

/** Header navigation shared by every page (composition instead of inheritance). */
export class NavBar {
  private readonly header: Locator;
  readonly home: Locator;
  readonly products: Locator;
  readonly cart: Locator;
  readonly signupLogin: Locator;
  readonly contactUs: Locator;
  readonly logout: Locator;
  readonly deleteAccountLink: Locator;
  readonly loggedInAs: Locator;

  constructor(page: Page) {
    this.header = page.locator('header#header');
    this.home = this.header.getByRole('link', { name: 'Home' });
    this.products = this.header.getByRole('link', { name: 'Products' });
    this.cart = this.header.getByRole('link', { name: 'Cart' });
    this.signupLogin = this.header.getByRole('link', { name: 'Signup / Login' });
    this.contactUs = this.header.getByRole('link', { name: 'Contact us' });
    this.logout = this.header.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = this.header.getByRole('link', { name: 'Delete Account' });
    this.loggedInAs = this.header.locator('li', { hasText: 'Logged in as' });
  }
}

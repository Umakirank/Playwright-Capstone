import { test as base, expect } from '@playwright/test';
import { NavBar } from '../pages/components/NavBar';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ContactUsPage } from '../pages/ContactUsPage';
import { UserApi } from '../utils/apiClient';
import { buildUser, UserData } from '../utils/dataFactory';
import { blockThirdParty } from '../utils/thirdParty';

type PageFixtures = {
  navBar: NavBar;
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  contactUsPage: ContactUsPage;
};

type DataFixtures = {
  userApi: UserApi;
  /** A fresh account created through the API; deleted automatically after the test. */
  testUser: UserData;
  /** Same as testUser, but already logged in through the UI. */
  loggedInUser: UserData;
};

type AutoFixtures = { blockThirdPartyRequests: void };

export const test = base.extend<PageFixtures & DataFixtures & AutoFixtures>({
  // Auto fixture: runs for every test without being requested.
  blockThirdPartyRequests: [
    async ({ page }, use) => {
      await blockThirdParty(page);
      await use();
    },
    { auto: true },
  ],

  navBar: async ({ page }, use) => { await use(new NavBar(page)); },
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  signupPage: async ({ page }, use) => { await use(new SignupPage(page)); },
  productsPage: async ({ page }, use) => { await use(new ProductsPage(page)); },
  cartPage: async ({ page }, use) => { await use(new CartPage(page)); },
  checkoutPage: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  paymentPage: async ({ page }, use) => { await use(new PaymentPage(page)); },
  contactUsPage: async ({ page }, use) => { await use(new ContactUsPage(page)); },

  userApi: async ({ request }, use) => { await use(new UserApi(request)); },

  testUser: async ({ userApi }, use) => {
    const user = buildUser();
    await userApi.createAccount(user); // setup
    await use(user);
    await userApi.deleteAccount(user.email, user.password); // teardown, even if the test failed
  },

  loggedInUser: async ({ testUser, loginPage, navBar }, use) => {
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await expect(navBar.loggedInAs).toContainText(testUser.name);
    await use(testUser);
  },
});

export { expect };

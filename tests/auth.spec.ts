import { test, expect } from '../fixtures';
import { buildUser } from '../utils/dataFactory';
import auth from '../testdata/auth.json';

test.describe('Authentication', () => {
  test('TC01 - register a new user, verify session, delete account',
    { tag: ['@smoke', '@auth'] },
    async ({ loginPage, signupPage, navBar, userApi }) => {
      const user = buildUser();
      try {
        await loginPage.goto();
        await loginPage.expectVisible();
        await loginPage.startSignup(user.name, user.email);

        await expect(signupPage.heading).toBeVisible();
        await signupPage.completeRegistration(user);
        await signupPage.expectAccountCreated();
        await signupPage.continueButton.click();

        await expect(navBar.loggedInAs).toContainText(user.name);

        await navBar.deleteAccountLink.click();
        await signupPage.expectAccountDeleted();
      } finally {
        await userApi.deleteAccount(user.email, user.password); // guarantees cleanup if the test fails midway
      }
    });

  test('TC01b - registering with an existing email is rejected', { tag: '@auth' },
    async ({ loginPage, testUser }) => {
      await loginPage.goto();
      await loginPage.startSignup('another name', testUser.email);
      await loginPage.expectErrorText(auth.errors.duplicateEmail);
    });

  test('TC02 - login with valid credentials and logout', { tag: ['@smoke', '@auth'] },
    async ({ loginPage, navBar, testUser }) => {
      await loginPage.goto();
      await loginPage.login(testUser.email, testUser.password);
      await expect(navBar.loggedInAs).toContainText(testUser.name);

      await navBar.logout.click();
      await expect(loginPage.loginHeading).toBeVisible();
      await expect(navBar.loggedInAs).toHaveCount(0);
      await expect(navBar.signupLogin).toBeVisible();
    });

  test('TC02b - wrong password for an existing user is rejected', { tag: '@auth' },
    async ({ loginPage, testUser }) => {
      await loginPage.goto();
      await loginPage.login(testUser.email, 'Definitely-Wrong-1');
      await loginPage.expectErrorText(auth.errors.badLogin);
    });

  // Data-driven: one test per row in testdata/auth.json
  for (const row of auth.invalidLogins) {
    test(`TC02c - invalid login rejected [${row.id}]`, { tag: '@auth' }, async ({ loginPage, navBar }) => {
      await loginPage.goto();
      await loginPage.login(row.email, row.password);
      await loginPage.expectErrorText(auth.errors.badLogin);
      await expect(navBar.loggedInAs).toHaveCount(0);
    });
  }
});

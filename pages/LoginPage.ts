import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly path = '/login';

  readonly loginHeading = this.page.getByRole('heading', { name: 'Login to your account' });
  readonly signupHeading = this.page.getByRole('heading', { name: 'New User Signup!' });

  readonly loginEmail = this.page.getByTestId('login-email');
  readonly loginPassword = this.page.getByTestId('login-password');
  readonly loginButton = this.page.getByTestId('login-button');

  readonly signupName = this.page.getByTestId('signup-name');
  readonly signupEmail = this.page.getByTestId('signup-email');
  readonly signupButton = this.page.getByTestId('signup-button');

  async login(email: string, password: string): Promise<void> {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
  }

  async expectVisible(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.signupHeading).toBeVisible();
  }

  async expectErrorText(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }
}

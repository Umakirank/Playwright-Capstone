import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../utils/dataFactory';

export class SignupPage extends BasePage {
  readonly path = '/signup';

  readonly heading = this.page.getByRole('heading', { name: 'Enter Account Information' });
  readonly accountCreated = this.page.getByTestId('account-created');
  readonly accountDeleted = this.page.getByTestId('account-deleted');
  readonly continueButton = this.page.getByTestId('continue-button');

  async completeRegistration(u: UserData): Promise<void> {
    await this.page.locator(u.title === 'Mr' ? '#id_gender1' : '#id_gender2').check();
    await this.page.getByTestId('password').fill(u.password);
    await this.page.getByTestId('days').selectOption(u.birthDay);
    await this.page.getByTestId('months').selectOption({ label: u.birthMonth });
    await this.page.getByTestId('years').selectOption(u.birthYear);
    await this.page.locator('#newsletter').check();
    await this.page.getByTestId('first_name').fill(u.firstName);
    await this.page.getByTestId('last_name').fill(u.lastName);
    await this.page.getByTestId('company').fill(u.company);
    await this.page.getByTestId('address').fill(u.address1);
    await this.page.getByTestId('address2').fill(u.address2);
    await this.page.getByTestId('country').selectOption(u.country);
    await this.page.getByTestId('state').fill(u.state);
    await this.page.getByTestId('city').fill(u.city);
    await this.page.getByTestId('zipcode').fill(u.zipcode);
    await this.page.getByTestId('mobile_number').fill(u.mobile);
    await this.page.getByTestId('create-account').click();
  }

  async expectAccountCreated(): Promise<void> {
    await expect(this.accountCreated).toHaveText(/account created!/i);
  }

  async expectAccountDeleted(): Promise<void> {
    await expect(this.accountDeleted).toHaveText(/account deleted!/i);
  }
}

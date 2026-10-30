import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactUsPage extends BasePage {
  readonly path = '/contact_us';

  readonly nameInput = this.page.getByTestId('name');
  readonly emailInput = this.page.getByTestId('email');
  readonly subjectInput = this.page.getByTestId('subject');
  readonly messageInput = this.page.getByTestId('message');
  readonly fileInput = this.page.locator('input[name="upload_file"]');
  readonly submitButton = this.page.getByTestId('submit-button');
  readonly successAlert = this.page.locator('.status.alert-success');

  async fill(form: ContactForm): Promise<void> {
    await this.nameInput.fill(form.name);
    await this.emailInput.fill(form.email);
    await this.subjectInput.fill(form.subject);
    await this.messageInput.fill(form.message);
  }

  async attach(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
  }

  /** The site raises a native confirm() dialog on submit: register the handler BEFORE clicking. */
  async submitAcceptingDialog(): Promise<void> {
    this.page.once('dialog', (dialog) => dialog.accept());
    await this.submitButton.click();
  }

  async expectSuccess(): Promise<void> {
    await expect(this.successAlert).toContainText('Your details have been submitted successfully');
  }

  async isInvalid(field: 'name' | 'email' | 'subject' | 'message'): Promise<boolean> {
    const locator = { name: this.nameInput, email: this.emailInput, subject: this.subjectInput, message: this.messageInput }[field];
    return locator.evaluate((el) => !(el as HTMLInputElement).checkValidity());
  }
}

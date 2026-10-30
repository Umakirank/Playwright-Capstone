import path from 'path';
import { test, expect } from '../fixtures';
import contact from '../testdata/contact.json';

test.describe('Contact Us', () => {
  test('TC06 - submit the form with an attachment and see the success message', { tag: ['@smoke', '@contact'] },
    async ({ contactUsPage }) => {
      await contactUsPage.goto();
      await contactUsPage.fill(contact.valid);
      await contactUsPage.attach(path.resolve(__dirname, '../testdata/files/sample.txt'));
      await contactUsPage.submitAcceptingDialog();
      await contactUsPage.expectSuccess();
    });

  test('TC06b - cancelling the confirmation dialog does not submit the form', { tag: '@contact' },
    async ({ contactUsPage, page }) => {
      await contactUsPage.goto();
      await contactUsPage.fill(contact.valid);

      // The site asks "Press OK to proceed!" - dismissing it must NOT submit
      page.once('dialog', (dialog) => dialog.dismiss());
      await contactUsPage.submitButton.click();

      await expect(contactUsPage.successAlert).toBeHidden();
      await expect(contactUsPage.nameInput).toHaveValue(contact.valid.name); // form data still there
    });

  for (const email of contact.invalidEmails) {
    test(`TC06c - malformed email rejected [${email}]`, { tag: '@contact' }, async ({ contactUsPage }) => {
      await contactUsPage.goto();
      await contactUsPage.fill({ ...contact.valid, email });
      expect(await contactUsPage.isInvalid('email')).toBe(true);
    });
  }
});

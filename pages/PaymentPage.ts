import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CardDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class PaymentPage extends BasePage {
  readonly path = '/payment';

  readonly orderPlacedHeading = this.page.getByTestId('order-placed');
  readonly confirmation = this.page.getByText('Congratulations! Your order has been confirmed!');
  readonly downloadInvoice = this.page.getByRole('link', { name: 'Download Invoice' });

  async pay(card: CardDetails): Promise<void> {
    await this.page.getByTestId('name-on-card').fill(card.nameOnCard);
    await this.page.getByTestId('card-number').fill(card.cardNumber);
    await this.page.getByTestId('cvc').fill(card.cvc);
    await this.page.getByTestId('expiry-month').fill(card.expiryMonth);
    await this.page.getByTestId('expiry-year').fill(card.expiryYear);
    await this.page.getByTestId('pay-button').click();
  }

  async expectOrderConfirmed(): Promise<void> {
    await expect(this.page).toHaveURL(/payment_done/);
    await expect(this.orderPlacedHeading).toHaveText(/order placed!/i);
    await expect(this.confirmation).toBeVisible();
    await expect(this.downloadInvoice).toHaveAttribute('href', /download_invoice/);
  }
}

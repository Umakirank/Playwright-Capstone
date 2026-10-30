import { APIRequestContext } from '@playwright/test';
import { UserData } from './dataFactory';

/**
 * Thin wrapper over the AUT's public REST API.
 * Used for fast, reliable test setup/teardown so UI tests only exercise the flow under test.
 * NOTE: the AUT returns HTTP 200 with the "real" status inside the JSON body (responseCode),
 * and a text/html content-type, so we parse the text manually.
 */
export class UserApi {
  constructor(private readonly request: APIRequestContext) {}

  private async parse(res: { text(): Promise<string> }) {
    return JSON.parse(await res.text()) as { responseCode: number; message: string };
  }

  async createAccount(u: UserData): Promise<void> {
    const res = await this.request.post('/api/createAccount', {
      form: {
        name: u.name,
        email: u.email,
        password: u.password,
        title: u.title,
        birth_date: u.birthDay,
        birth_month: u.birthMonth,
        birth_year: u.birthYear,
        firstname: u.firstName,
        lastname: u.lastName,
        company: u.company,
        address1: u.address1,
        address2: u.address2,
        country: u.country,
        zipcode: u.zipcode,
        state: u.state,
        city: u.city,
        mobile_number: u.mobile,
      },
    });
    const body = await this.parse(res);
    if (body.responseCode !== 201) {
      throw new Error(`createAccount failed: ${body.responseCode} ${body.message}`);
    }
  }

  /** Tolerant on purpose: used in teardown, the account may already be deleted by the test. */
  async deleteAccount(email: string, password: string): Promise<boolean> {
    try {
      const res = await this.request.delete('/api/deleteAccount', { form: { email, password } });
      return (await this.parse(res)).responseCode === 200;
    } catch {
      return false;
    }
  }
}

import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

type Impact = 'minor' | 'moderate' | 'serious' | 'critical';

/** Single source of truth for environment-driven settings. */
export const env = {
  baseURL: process.env.BASE_URL ?? 'https://automationexercise.com',
  isCI: !!process.env.CI,
  a11yFailOn: (process.env.A11Y_FAIL_ON ?? 'critical')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean) as Impact[],
};

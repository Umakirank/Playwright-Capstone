import { Page } from '@playwright/test';

/**
 * The AUT embeds Google ads / analytics that inject full-page vignettes and iframes,
 * which are the #1 cause of flakiness on this site. We abort those requests at the network layer.
 */
const THIRD_PARTY =
  /(googlesyndication|doubleclick|googleadservices|adservice\.google|googletagmanager|google-analytics|pagead)/i;

export async function blockThirdParty(page: Page): Promise<void> {
  await page.route(THIRD_PARTY, (route) => route.abort());
}

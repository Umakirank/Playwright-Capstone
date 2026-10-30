import { test, expect } from '../fixtures';
import { runAxe, summarize } from '../utils/a11y';
import { env } from '../config/env';

const pages = [
  { name: 'home', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'products', path: '/products' },
  { name: 'contact-us', path: '/contact_us' },
];

test.describe('Accessibility (axe-core, WCAG 2.x A/AA)', () => {
  for (const p of pages) {
    test(`TC08 - ${p.name}: no NEW ${env.a11yFailOn.join('/')} violations`, { tag: '@a11y' },
      async ({ page }, testInfo) => {
        await page.goto(p.path);
        await page.waitForLoadState('domcontentloaded');

        const { totalRules, known, blocking } = await runAxe(page, testInfo, p.name);

        // Known defects are surfaced in the report as annotations, but don't fail the build
        for (const k of known) {
          testInfo.annotations.push({ type: 'known-a11y-defect', description: `${k.rule} @ ${k.target}` });
        }
        console.log(`[a11y] ${p.name}: ${totalRules} rule types, ${known.length} known defects, ${blocking.length} NEW blocking`);

        expect(blocking, summarize(blocking)).toEqual([]);
      });
  }
});

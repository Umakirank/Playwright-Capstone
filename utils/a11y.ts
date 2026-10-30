import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';
import { env } from '../config/env';
import baseline from '../testdata/a11y-baseline.json';

export interface A11yIssue {
  rule: string;
  impact: string;
  target: string;
  help: string;
}

const KNOWN = new Set(baseline.knownIssues.map((i) => `${i.rule}|${i.target}`));

/**
 * Runs axe-core and splits findings (at the configured impact levels) into:
 *  - known:    documented defects listed in testdata/a11y-baseline.json (reported, not failing)
 *  - blocking: NEW defects -> these fail the test (regression gate)
 * The full raw axe result is attached to the HTML report.
 */
export async function runAxe(page: Page, testInfo: TestInfo, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .exclude('.adsbygoogle')
    .analyze();

  await testInfo.attach(`axe-${label}.json`, {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  const known: A11yIssue[] = [];
  const blocking: A11yIssue[] = [];

  for (const v of results.violations) {
    if (!v.impact || !env.a11yFailOn.includes(v.impact)) continue;
    for (const node of v.nodes) {
      const issue: A11yIssue = { rule: v.id, impact: v.impact, target: node.target.join(' '), help: v.help };
      (KNOWN.has(`${issue.rule}|${issue.target}`) ? known : blocking).push(issue);
    }
  }
  return { totalRules: results.violations.length, known, blocking };
}

export function summarize(issues: A11yIssue[]): string {
  return issues.map((i) => `[${i.impact}] ${i.rule} @ ${i.target}: ${i.help}`).join('\n');
}

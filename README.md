# Enterprise E-Commerce Automation Framework — Playwright + TypeScript

Capstone for the Perficient Playwright programme. Application under test: <https://automationexercise.com>.

## 1. What this delivers

| Requirement | Where |
|---|---|
| Page Object Model | `pages/` (one class per page + `components/NavBar`) |
| Custom fixtures | `fixtures/index.ts` (page objects, API client, `testUser`, `loggedInUser`, auto ad-blocking) |
| Data-driven testing | `testdata/*.json` drives search, invalid-login and invalid-email tests |
| Network interception & mocking | `tests/network.spec.ts`, `utils/thirdParty.ts` |
| Trace Viewer & debugging | trace/screenshot/video retained on failure, see §6 |
| Cross-browser | `chromium`, `firefox`, `webkit` projects in `playwright.config.ts` |
| Accessibility (axe-core) | `tests/accessibility.spec.ts`, `utils/a11y.ts` |
| Visual regression | `tests/visual.spec.ts` |
| AI-assisted creation (Copilot/MCP) | `.vscode/mcp.json`, `docs/AI_ASSISTED_LOG.md` |
| Config management | `config/env.ts`, `.env`, `playwright.config.ts` |
| Reporting | HTML, JUnit, JSON → `reports/` |
| CI | `.github/workflows/playwright.yml` (matrix per browser) |

### Test scenarios (8 core + 1 bonus)

| ID | Scenario | File |
|---|---|---|
| TC01 | Register new user → verify session → delete account (+ duplicate email negative) | `auth.spec.ts` |
| TC02 | Login / logout (+ wrong password, data-driven invalid logins) | `auth.spec.ts` |
| TC03 | Product search, data-driven (hit, partial, no-result) | `products.spec.ts` |
| TC04 | Add / remove products, line-total business rule | `cart.spec.ts` |
| TC05 | Checkout flow + order placement validation (E2E) | `checkout.spec.ts` |
| TC06 | Contact Us: success w/ upload + native dialog, dialog cancel, email format validation | `contact.spec.ts` |
| TC07 | Network: modify response, mock JSON API, simulate 500 | `network.spec.ts` |
| TC08 | Accessibility scans of 4 key pages | `accessibility.spec.ts` |
| Bonus | Visual regression of login/signup/contact forms | `visual.spec.ts` |

(`TC00` in `home.spec.ts` is a smoke test.)

## 2. Folder structure

```
pages/        Page objects (locators + actions + page-level assertions)
  components/ Reusable UI pieces (NavBar)
fixtures/     Custom test object: DI of page objects, test users, auto fixtures
tests/        Specs only — no selectors, no raw waits
utils/        API client, data factory, a11y helper, third-party blocker, helpers
testdata/     JSON test data (+ upload file)
config/       Environment configuration
reports/      HTML / JUnit / JSON reports, traces, screenshots, videos (git-ignored)
docs/         Presentation outline, AI-assisted development log
```

## 3. Setup & run

```bash
npm install
npx playwright install --with-deps
cp .env.example .env            # optional

npm test                        # all browsers
npm run test:chromium           # one browser
npm run test:smoke              # @smoke tag
npm run test:a11y               # accessibility
npm run test:visual:update      # create visual baselines (first run only)
npm run test:visual
npm run test:ui                 # Playwright UI mode
npm run report                  # open reports/html-report
```

## 4. Design decisions (talking points)

**Locator strategy** (priority order): `getByTestId` (configured to `data-qa`, which the AUT provides) → `getByRole` with accessible name → `getByText` for messages → CSS/ID only when nothing semantic exists (e.g. `#search_product`, `.cart_quantity_delete`). No XPath, no index-based selectors except deliberate "nth product" actions.

**Synchronization**: zero `waitForTimeout`. Everything relies on Playwright auto-waiting and web-first assertions (`expect(locator).toBeVisible()`, `toHaveCount(0)`), which retry. Modals are waited on by state (`toBeVisible` / `toBeHidden`). Native `confirm()` dialogs are handled by registering `page.once('dialog')` *before* the click.

**POM**: page objects expose locators as `readonly` fields and intent-level methods (`login`, `addProductToCart`). Assertions about page state live in the page (`expectAccountCreated`), assertions about *business outcomes* stay in the test. Shared UI (header) is a composed component, not a base-class inheritance chain.

**Fixtures**: `testUser` creates an account via the REST API and deletes it afterwards (teardown runs even on failure); `loggedInUser` builds on it. Tests therefore start from a known state in ~1s instead of repeating the registration UI, and run safely in parallel (unique emails). An *auto* fixture blocks Google ads/analytics requests, the main source of flakiness on this site.

**Test data**: static data in JSON, dynamic data from `buildUser()`. Nothing hard-coded in specs.

**Reporting & debugging**: see §6.

**Network mocking**: three patterns — modify a real response, fully stub an API, and simulate a backend failure.

**Accessibility**: axe-core with WCAG 2.0/2.1 A+AA tags. The first run found 3 real critical defects on the AUT (icon-only `#subscribe` and `#submit_search` buttons with no accessible name, and an unlabeled file input on Contact Us). They are recorded in `testdata/a11y-baseline.json` and shown as annotations in the report; the suite fails only on NEW violations (regression gate). The failing threshold is configurable (`A11Y_FAIL_ON=critical` by default); remove baseline entries as the client fixes them.

**Visual regression**: fixed-viewport (1280x720) page screenshots of static pages, animations disabled, 3% pixel tolerance, Chromium only. Element-level screenshots were tried first and rejected: a 1px height jitter between runs fails on size before tolerance is applied. Carousels are intentionally not snapshotted.

**Cross-browser**: one config, three engines; CI runs them as a matrix.

## 5. Trade-offs / known limitations

- The AUT is a public, shared site: it can be slow, and ads can still occasionally appear; third-party calls are blocked, but this is a mitigation, not a guarantee.
- The AUT's API returns HTTP 200 with the real status in the body, so `UserApi` checks `responseCode`.
- Visual baselines are OS/browser specific. Generate and update them in the same environment CI uses (Docker/Linux), not on a laptop.
- Login is done via UI in `loggedInUser` because the AUT has no login API; if it did, we'd save `storageState` once and reuse it.

## 6. Debugging failures

1. `npm run report` — the HTML report shows the error, screenshot, video, trace and axe attachments per test.
2. `npx playwright show-trace reports/test-results/<test>/trace.zip` — step-by-step DOM snapshots, network calls, console logs, source.
3. `npm run test:debug` or `PWDEBUG=1` — Inspector, step through, use *Pick locator*.
4. `npx playwright codegen https://automationexercise.com` — explore selectors.
5. For flaky tests: `npx playwright test --repeat-each=10 --project=chromium <file>`; in CI traces are also kept on retry.

## 7. AI-assisted testing (Copilot + Playwright MCP)

`.vscode/mcp.json` registers the Playwright MCP server so Copilot/Claude agent mode can drive a real browser, inspect the accessibility tree and propose locators. Workflow used: (1) let the agent explore a flow, (2) have it draft a spec, (3) refactor into POM + fixtures, (4) replace brittle selectors, remove sleeps, add assertions on business outcomes. Record your own prompts and what you changed in `docs/AI_ASSISTED_LOG.md`; you must be able to explain every line.

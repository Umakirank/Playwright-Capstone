# AI-Assisted Development Log

> Fill this in with YOUR real prompts and observations. Reviewers will ask what the AI got wrong and how you fixed it.

| # | Prompt (Copilot / MCP) | What the AI produced | What I changed and why |
|---|---|---|---|
| 1 | "Using Playwright MCP, explore the checkout flow on automationexercise.com and draft a TypeScript test." | Single long script with CSS selectors and `waitForTimeout(2000)` | Split into POM; replaced sleeps with web-first assertions; used `data-qa` test ids |
| 2 | "Write a fixture that creates a user via API." | Used `response.json()` | AUT returns `text/html` with status in the body → parse text and check `responseCode` |
| 3 | "Add axe-core tests for key pages." | Failed on every violation | Made impact threshold configurable; attach full JSON; exclude ad containers |
| 4 | _your prompt_ | | |

## Guardrails I applied
- Never commit AI output I could not explain.
- Run each generated test 10x (`--repeat-each=10`) before accepting it.
- Review for hard-coded data, sleeps, duplicated locators, weak assertions (e.g. "element exists" instead of "value is correct").

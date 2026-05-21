# Shift-Left Testing for Small Engineering Teams

Companion code for the Autonoma blog post 'Shift-Left Testing for Small Engineering Teams'. Includes a GitHub Actions workflow that runs Playwright against Vercel preview URLs, a Sentry alert rule that routes production errors to Slack, and a Claude Code-generated Playwright checkout test with annotated coverage gaps.

> Companion code for the Autonoma blog post: **[Shift-Left Testing for Small Engineering Teams](https://getautonoma.com/blog/shift-left-testing-for-small-engineering-teams)**

## Requirements

Node 20+, npm, Playwright. For the workflow: a GitHub repo linked to Vercel. For the Sentry rule: a Sentry project with the Slack integration installed.

## Quickstart

```bash
git clone https://github.com/Autonoma-Tools/shift-left-testing-for-small-engineering-teams.git
cd shift-left-testing-for-small-engineering-teams
npm install && npx playwright install --with-deps && PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/checkout.spec.ts
```

## Project structure

```
.
├── .github/
│   └── workflows/
│       └── e2e-on-preview.yml      # GitHub Actions: Playwright on Vercel previews
├── sentry/
│   └── alert-rule-slack.yml        # Sentry alert rule -> Slack
├── tests/
│   └── checkout.spec.ts            # Playwright checkout happy path + annotated gaps
├── package.json                    # @playwright/test devDep + scripts
├── LICENSE
└── README.md
```

- `.github/workflows/` — CI workflows. The included workflow triggers on Vercel `deployment_status` events and runs Playwright against the ephemeral preview URL.
- `sentry/` — Sentry alert-rule definitions kept in version control. The YAML is the source of truth you mirror into the Sentry UI (or apply via Terraform / Sentry API).
- `tests/` — Playwright specs. `checkout.spec.ts` was generated from a single Claude Code prompt and includes a top-of-file comment listing the two corner cases the prompt did NOT cover.

## About

This repository is maintained by [Autonoma](https://getautonoma.com) as reference material for the linked blog post. Autonoma builds autonomous AI agents that plan, execute, and maintain end-to-end tests directly from your codebase.

If something here is wrong, out of date, or unclear, please [open an issue](https://github.com/Autonoma-Tools/shift-left-testing-for-small-engineering-teams/issues/new).

## License

Released under the [MIT License](./LICENSE) © 2026 Autonoma Labs.

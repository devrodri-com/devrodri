# DevRodri

Personal portfolio and landing site for Rodrigo Opalo, available in Spanish and English.

[Español](README.es.md) · [English](README.en.md)

Production: [www.devrodri.com](https://www.devrodri.com)

## Stack

- React 18 and TypeScript
- Vite 8
- Tailwind CSS 3
- React Router 7
- Vitest 4
- Node.js 22 and npm 9.9.4

The public routes are `/` and `/portfolio`. Unknown routes render the application’s not-found view.

## Local development

No secret is required to run the site locally:

```bash
npm ci
npm run dev
```

`VITE_GA_ID` is optional and is documented in `.env.example`. Leave it empty to run without Google Analytics.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run typecheck` | Run strict TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run the test suite once |
| `npm run build` | Create the production build |
| `npm run ci` | Run typecheck, lint, tests, and build |

## Delivery and security

- GitHub Actions runs the `quality` and `dependency-review` jobs.
- The `Protect main` ruleset requires pull-request checks, Vercel, and CodeQL before the squash merge path.
- The canonical Vercel project is `minisitio-rodrigo`; production remains `www.devrodri.com`.
- Google Analytics is enabled only when `VITE_GA_ID` is configured and does not receive contact-form contents.
- Contact submissions are processed by FormSubmit.
- `vercel.json` owns the Content Security Policy, security headers, caching, and SPA rewrite.
- Vulnerability reporting guidance is in [SECURITY.md](SECURITY.md).

## Repository structure

```text
src/
  Components/        UI sections and shared components
  data/portfolio/    typed portfolio catalog
  i18n/              ES/EN locales and language state
  pages/             routed views
  test/              component and behavior tests
  __tests__/         repository and delivery policy tests
```

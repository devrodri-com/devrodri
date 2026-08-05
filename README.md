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

The site uses Vite + React and is prerendered at build time. It publishes
twelve static public routes:

- Spanish: `/`, `/portfolio`, `/portfolio/lem-box`, `/servicios`,
  `/servicios/sitios-web-para-empresas`, `/servicios/sistemas-a-medida`
- English: `/en`, `/en/portfolio`, `/en/portfolio/lem-box`, `/en/services`,
  `/en/services/business-websites`, `/en/services/custom-software`

Each route ships server-visible HTML and content, including its localized
`title`, description, canonical URL, `hreflang`, Open Graph, and Twitter
metadata. Structured data is scoped per route where applicable, and React
hydrates the client after the initial document loads. Unknown paths return a
real HTTP 404 localized in Spanish or English. The build also publishes
`robots.txt` and `sitemap.xml`, which lists the twelve public URLs.

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
- `vercel.json` owns the Content Security Policy, security headers, asset caching, and the explicit content types for `robots.txt` and `sitemap.xml`.
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

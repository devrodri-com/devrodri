# DevRodri

Personal portfolio and landing site for Rodrigo Opalo, available in Spanish and English.

Production: [www.devrodri.com](https://www.devrodri.com)

## Technology

- React 18, TypeScript, Vite 8, and Tailwind CSS 3
- React Router 7
- Vitest 4
- Node.js 22 and npm 9.9.4

The site uses Vite + React and is prerendered at build time. It publishes six
static public routes:

- Spanish: `/`, `/portfolio`, `/portfolio/lem-box`
- English: `/en`, `/en/portfolio`, `/en/portfolio/lem-box`

Each route ships server-visible HTML and content, including its localized
`title`, description, canonical URL, `hreflang`, Open Graph, and Twitter
metadata. Structured data is scoped per route where applicable, and React
hydrates the client after the initial document loads. Unknown paths return a
real HTTP 404 localized in Spanish or English. The build also publishes
`robots.txt` and `sitemap.xml`, which lists the six public URLs.

## Development

No secret is required for local development:

```bash
npm ci
npm run dev
```

`VITE_GA_ID` is optional; leave it empty to run without Google Analytics.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite server |
| `npm run typecheck` | Run strict TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run build` | Build the production bundle |
| `npm run ci` | Run typecheck, lint, tests, and build |

## Delivery and security

- GitHub Actions provides `quality` and `dependency-review`.
- The `Protect main` ruleset also requires Vercel and CodeQL before squash merge.
- The canonical Vercel project is `minisitio-rodrigo`; production is `www.devrodri.com`.
- Analytics is optional and does not receive form contents.
- FormSubmit processes contact submissions.
- The CSP, security headers, asset caching, and the explicit content types for `robots.txt` and `sitemap.xml` live in `vercel.json`.
- See [SECURITY.md](SECURITY.md) for private vulnerability reporting.

The main source boundaries are `src/i18n`, `src/data/portfolio`, `src/Components`, `src/pages`, and the two test directories.

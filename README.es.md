# DevRodri

Portfolio y landing personal de Rodrigo Opalo, disponible en español e inglés.

Producción: [www.devrodri.com](https://www.devrodri.com)

## Tecnología

- React 18, TypeScript, Vite 8 y Tailwind CSS 3
- React Router 7
- Vitest 4
- Node.js 22 y npm 9.9.4

El sitio usa Vite + React y se prerenderiza durante el build. Publica seis rutas
estáticas:

- Español: `/`, `/portfolio`, `/portfolio/lem-box`
- Inglés: `/en`, `/en/portfolio`, `/en/portfolio/lem-box`

Cada ruta entrega HTML y contenido visibles desde el servidor, incluidos su
`title`, descripción, URL canonical, `hreflang`, Open Graph y metadata de
Twitter localizados. Los datos estructurados se definen por ruta cuando
corresponde, y React hidrata el cliente después de cargar el documento inicial.
Las rutas desconocidas devuelven un HTTP 404 real localizado en español o
inglés. El build también publica `robots.txt` y `sitemap.xml`, que enumera las
seis URLs públicas.

## Desarrollo

El desarrollo local no requiere secretos:

```bash
npm ci
npm run dev
```

`VITE_GA_ID` es opcional; puede dejarse vacío para ejecutar el sitio sin Google Analytics.

| Comando | Propósito |
| --- | --- |
| `npm run dev` | Iniciar el servidor local de Vite |
| `npm run typecheck` | Ejecutar TypeScript estricto |
| `npm run lint` | Ejecutar ESLint |
| `npm run test` | Ejecutar Vitest en modo watch |
| `npm run test:run` | Ejecutar todos los tests una vez |
| `npm run build` | Generar el build de producción |
| `npm run ci` | Ejecutar typecheck, lint, tests y build |

## Entrega y seguridad

- GitHub Actions ejecuta `quality` y `dependency-review`.
- El ruleset `Protect main` también exige Vercel y CodeQL antes del squash merge.
- El proyecto canónico de Vercel es `minisitio-rodrigo`; producción es `www.devrodri.com`.
- Analytics es opcional y no recibe el contenido del formulario.
- FormSubmit procesa los envíos de contacto.
- La CSP, los headers de seguridad, el cache de assets y los tipos de contenido explícitos de `robots.txt` y `sitemap.xml` viven en `vercel.json`.
- Consultá [SECURITY.md](SECURITY.md) para reportar vulnerabilidades de forma privada.

Las fronteras principales del código son `src/i18n`, `src/data/portfolio`, `src/Components`, `src/pages` y los dos directorios de tests.

# DevRodri

Portfolio y landing personal de Rodrigo Opalo, disponible en español e inglés.

Producción: [www.devrodri.com](https://www.devrodri.com)

## Tecnología

- React 18, TypeScript, Vite 8 y Tailwind CSS 3
- React Router 7
- Vitest 4
- Node.js 22 y npm 9.9.4

Las rutas públicas son `/` y `/portfolio`. Las rutas desconocidas muestran la vista de página no encontrada.

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
- La CSP, los headers de seguridad, el cache y el rewrite SPA viven en `vercel.json`.
- Consultá [SECURITY.md](SECURITY.md) para reportar vulnerabilidades de forma privada.

Las fronteras principales del código son `src/i18n`, `src/data/portfolio`, `src/Components`, `src/pages` y los dos directorios de tests.

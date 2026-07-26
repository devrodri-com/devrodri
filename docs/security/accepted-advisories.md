# Accepted security advisories

## GHSA-qwww-vcr4-c8h2

- Package: react-router
- Severity: high
- Status: accepted as not applicable to the current architecture
- Current architecture: static declarative BrowserRouter SPA
- RSC used: no
- SSR used: no
- Server actions used: no
- Evidence date: 2026-07-26
- Owner: Rodrigo Opalo
- Compensating controls:
  - exact GHSA allowlist only;
  - CodeQL;
  - required quality and Dependency Review checks;
  - RSC policy test;
  - preview and production smoke;
- Removal triggers:
  - patched React Router version adopted;
  - any RSC/server architecture introduced;
  - v7 backport available;
  - migration to v8.3.0+ completed.
- Dependabot alert must remain visible.
- This is not a dismissal of the upstream vulnerability.

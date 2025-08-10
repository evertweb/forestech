# Functions SSR - Combustibles

Fase 0: Bootstrap mínimo para SSR con Firebase Hosting + Functions.

- Endpoint health: /combustibles/ssr-health (responde 200 + Server-Timing)
- Handler SSR: /combustibles/\*\* (placeholder React 19)
- Fallback a CSR se implementará más adelante con lectura de public/combustibles/index.html

## Scripts

- npm run serve: emuladores Hosting + Functions
- npm run deploy: deploy a Firebase (functions, hosting)

## Variables de entorno

Ver .env.example (no colocar secretos). Región por defecto: us-central1.

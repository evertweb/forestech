# Combustibles - Testing Guide

This guide explains how we test the Combustibles app.

## Stack

- Vitest + Testing Library (JSDOM) for unit/integration
- Playwright for E2E (planned)

## Commands

- npm run test --workspace=combustibles
- npm run test:coverage --workspace=combustibles

### E2E (Playwright)

- Instalar binarios una vez: `npm run e2e:install --workspace=combustibles`
- Ejecutar smoke (headless): `npm run e2e --workspace=combustibles`
- Ejecutar con navegador visible: `npm run e2e:headed --workspace=combustibles`

Notas:

- Playwright levanta Vite en puerto 5176 automáticamente para E2E (`webServer` en `playwright.config.ts`).
- También soporta `E2E_BASE_URL` para apuntar a una URL específica si ya hay un server corriendo.

## Structure

- src/components/\*_/**tests**/_.(test|int).jsx
- src/services/\*_/**tests**/_.test.js
- src/utils/\*_/**tests**/_.test.js

## Coverage targets

- Global >= 80%
- Critical services >= 90%

## Writing integration tests

- Prefer rendering component with withProviders wrapper
- Mock Firebase-facing services at module level
- Focus on visible user interactions and outcomes

## E2E (next phase)

- Playwright smoke: login, create movement, check inventory
- CI job to run headless against dev server

# Repository Guidelines

## Estructura del Proyecto y Módulos
- Monorepo con npm workspaces: `alimentacion/` y `combustibles/`.
- Código fuente por app en `alimentacion/src/` y `combustibles/src/`.
- Los builds se publican en `public/alimentacion/` y `public/combustibles/`.
- Configuración y activos compartidos: `firebase.json`, `firestore.rules`, `storage.rules`, `.husky/`, `.github/`, `shared/`.

## Comandos de Build, Test y Desarrollo
- Desarrollo: `npm run dev:alimentacion`, `npm run dev:combustibles` (Vite por app).
- Compilar todo: `npm run build:all` (secuencial) o `npm run build:parallel`.
- Lint general: `npm run lint:all` (ESLint en ambos workspaces).
- Despliegue: `npm run deploy` (compila ambas apps y ejecuta `firebase deploy`).
- Ejemplos por workspace: `npm run dev --workspace=combustibles`, `cd alimentacion && npm run preview`.

## Estilo de Código y Convenciones de Nombres
- Formato: Prettier (`.prettierrc.json`) — comillas simples, ancho 100, punto y coma, comas finales ES5; plugin de Tailwind habilitado.
- Editor: `.editorconfig` — fin de línea LF, nueva línea final, indentación de 2 espacios.
- Linter: ESLint con reglas para React Hooks/Refresh; `no-unused-vars` como error (constantes MAYÚSCULAS/_ permitidas).
- Nombres: componentes React en `PascalCase` (ej. `FuelTable.jsx`), hooks `useCamelCase`, archivos/variables `camelCase`.

## Guías de Pruebas
- CI ejecuta `npm run test:ci` en push; el `npm test` raíz es un stub. Si agregas pruebas en un workspace, define el script `test` allí para que CI las detecte.
- Ubicación sugerida: `src/**/*.test.jsx` o `src/**/*.test.js`.
- Mínimo para PRs sin pruebas: `npm run lint:all` y `npm run build:all`; usa `vite preview` para smoke tests manuales.

## Commits y Pull Requests
- Convenciones: Conventional Commits aplicadas con Husky + Commitlint. Scopes permitidos: `alimentacion`, `combustibles`, `shared`, `ci`, `docs`, `rules`, `repo`.
- Ejemplos: `feat(combustibles): exportar reporte de combustible a XLSX`, `fix(alimentacion): corregir fecha del tooltip de la gráfica`.
- PRs: descripción clara, issues vinculados, capturas de antes/después para UI, pasos de prueba. Deben pasar pre-commit (lint-staged) y pre-push (`lint:all`, `test:ci`).

## Seguridad y Configuración
- No publiques secretos. Usa `.env` local; las apps pueden leer variables vía `dotenv`/Vite. Ajusta Firebase en `firebase.json` y archivos de reglas.
- Revisa `cors.json` y `error-context.json` al modificar endpoints o manejo de errores.

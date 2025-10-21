# AGENTS.md - Guía para agentes

## Comandos disponibles

- **Instalar dependencias**: `npm install`
- **Verificar landing**: `npm run build`
- **Lint placeholder**: `npm run lint`
- **Tests placeholder**: `npm run test`
- **Despliegue**: Push a `main` o GitHub Actions → "🚀 Deploy Landing"

## Estilo y alcance

- El repositorio solo contiene contenido estático bajo `public/`.
- No modificar `public/index.html` ni `public/maintenance/` salvo instrucciones explícitas.
- No reintroducir React, Functions, ni dependencias complejas.
- Mantener los assets ligeros y optimizados para hosting estático.

# 🌲 Forestech de Colombia - Landing Corporativa

Repositorio oficial de la landing estática servida en Firebase Hosting. Las aplicaciones Combustibles y Alimentación fueron retiradas definitivamente; únicamente se mantienen páginas informativas de mantenimiento bajo `public/maintenance/`.

## � Estructura relevante

- `public/index.html`: landing principal (no modificar salvo requerimiento explícito).
- `public/legal/`: contenido legal publicado.
- `public/maintenance/`: mensajes para las rutas históricas `/combustibles` y `/alimentacion`.
- `firebase.json`: configuración de hosting sin funciones ni SSR.

## �️ Comandos disponibles

```bash
npm install      # Instala dependencias mínimas (husky)
npm run build    # Verifica que exista public/index.html
npm run lint     # Mensaje informativo, no ejecuta ESLint
npm run test     # Mensaje informativo, no hay suites activas
```

## 🚀 Despliegue

- Push a `main` despliega automáticamente cuando cambian `public/**`, `firebase.json`, `.github/workflows/release-deploy.yml` o `README.md`.
- También es posible ejecutar el workflow **"🚀 Deploy Landing"** manualmente desde GitHub Actions.

El despliegue publica:

- `hosting:forestechdecolombia` → [https://forestechdecolombia.com.co/](https://forestechdecolombia.com.co/)
- `hosting:combustibles-subdomain` → versión de mantenimiento del subdominio histórico.

## ✅ Buenas prácticas

- Mantener `public/index.html` sin modificaciones a menos que se solicite.
- No reintroducir frameworks, funciones, bases de datos ni dependencias adicionales.
- Conservar los rewrites de mantenimiento activos en `firebase.json`.
- Ejecutar `npm run build` antes de solicitar revisión o despliegue.

## 📄 Licencias y legal

Los documentos legales vigentes se encuentran en `public/legal/`. Actualízalos únicamente con aprobación explícita.

---

Última actualización: octubre 2025.

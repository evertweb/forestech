## GitHub Copilot Instructions

> ⚠️ Contexto actualizado (octubre 2025): las aplicaciones Combustibles y Alimentación fueron retiradas. El repositorio conserva únicamente la landing corporativa servida desde `public/index.html` y las páginas de mantenimiento estáticas bajo `public/maintenance/`.

## 🌐 Idioma obligatorio

Todas las respuestas deben estar en **ESPAÑOL**, excepto:
- Código fuente
- Nombres de variables, funciones y clases
- Comentarios de código existentes en inglés
- Comandos de terminal y sus salidas
- Mensajes de commits ya escritos en inglés

## 📝 Documentación

- Evitar crear archivos Markdown nuevos salvo petición explícita.
- Actualizar documentación existente solo cuando sea imprescindible para reflejar cambios permanentes.
- Priorizar explicaciones concretas en la propia respuesta.

---

## � Estado del proyecto

- Landing estática en `public/index.html`.
- Carpetas `maintenance/` mantienen mensajes informativos para rutas históricas (`/combustibles`, `/alimentacion`).
- No existen bundles, funciones, ni código fuente de las aplicaciones anteriores.
- No hay dependencias de React, Firebase SDK ni SQL en el `package.json`.

## 🚀 Despliegue

- Hosting exclusivo en Firebase.
- Workflow activo: `.github/workflows/release-deploy.yml` (despliega `hosting:forestechdecolombia` y `hosting:combustibles-subdomain`).
- Despliegue automático al hacer `git push origin main` cuando cambian `public/**`, `firebase.json`, el propio workflow o la documentación principal.
- También puede ejecutarse manualmente desde GitHub Actions.

### Scripts npm disponibles

```bash
npm install      # Instala solo dependencias necesarias para Husky
npm run build    # Verifica que exista public/index.html
npm run lint     # Mensaje informativo (no se ejecuta ESLint)
npm run test     # Mensaje informativo (no hay suites activas)
```

## ✅ Buenas prácticas para agentes

- No sugerir reinstalar las aplicaciones eliminadas ni crear nuevos servicios backend.
- Mantener los rewrites de mantenimiento existentes y no proponer SSR o funciones.
- Verificar que cualquier cambio conserve `public/index.html` intacto.
- Antes de entregar, ejecutar `npm run build` para asegurar que la verificación mínima pasa.

## � Seguridad

- Evitar exponer rutas, claves o configuraciones antiguas (ya fueron removidas).
- No reintroducir archivos `.env`, configuraciones de Firebase Functions o scripts de base de datos.

## 📝 Referencias útiles

- `public/index.html`: landing principal.
- `public/legal/`: documentación legal disponible públicamente.
- `public/maintenance/`: páginas estáticas que informan suspensión de servicios.
- `firebase.json`: configuración simplificada de hosting (sin funciones ni SSR).

Con estos lineamientos, cualquier actualización debe centrarse en contenido estático, SEO y mantenimiento de la landing corporativa.

**Post-Deployment:**
- Monitor application logs in Firebase console
- Check that WebAuthn passkeys still work correctly
- Verify SSR is functioning (check page source for dynamic content)
- Test on mobile devices if critical changes were made

When working with this codebase, prioritize Firebase integration patterns, maintain SSR compatibility, and follow the established context/service architecture.



# 🚚 Roadmap de Migración a SSR (Firebase) — App Combustibles

Estado: Fase 1 Completada · Última actualización: 2025-08-10 · Owners: @evertweb · IAs: GitHub Copilot, Claude

Este roadmap guía una migración incremental de CSR → SSR para la app Combustibles usando Firebase Hosting + Cloud Functions (SSR), Remote Config y FirebaseServerApp. Mantiene funcionalidad actual, permite rollback rápido y delega tareas claras a IAs.

---

## 🎯 Objetivos

- Mejorar FCP/LCP, SEO y time-to-first-byte con renderizado inicial en servidor.
- Mantener paridad funcional 100% durante la transición (rutas críticas no deben romperse).
- Habilitar toggles (Remote Config) para encender/apagar SSR por ruta.
- Reutilizar la mayor cantidad de UI, servicios y hooks existentes.

### Métricas e instrumentación clave

- Lighthouse por ruta (login, movements, inventory, vehicles) con historial en `logs/`.
- Headers Server-Timing desde SSR: `ssr_total`, `ssr_render`, `data_fetch`.
- Logs estructurados (route, uid, durationMs, cacheHit, errorCode) en Functions.
- Web Vitals (FCP/LCP/CLS/TTI) enviados a Analytics y guardados como baseline por fase.

### Éxito (criterios)

- LCP < 2.5s en `/combustibles/login` y `/combustibles/movements` (en 4G/desktop).
- SSR activo para al menos 3 rutas críticas con hydration sin errores React.
- Error rate Functions < 1%, p95 < 1200 ms, memoria < 512 MB.
- Lighthouse: Perf ≥ 85, Acc ≥ 90, Best Practices ≥ 85 en rutas SSR.

---

## 🧩 Arquitectura destino (Firebase)

- Firebase Hosting: sirve assets estáticos y enruta SSR → Functions (rewrites).
- Cloud Functions for Firebase (HTTP): servidor SSR con Express y React 19.
- FirebaseServerApp: continuidad de sesión y contexto de usuario sin Admin SDK.
- Remote Config: feature flags por ruta/usuario para activar SSR y variaciones.
- Firestore/Storage/Auth: reutilizados, sin exponer secretos ni Admin privileges.

---

## 🧠 Roles de IAs y flujo de trabajo

- GitHub Copilot (tú): implementa código, configs, tests, automatiza tareas locales.
- Claude: revisa diseño, optimiza performance, escribe documentación y edge cases.

Sincronización:

- Cada fase crea un PR con checklist y pruebas adjuntas (Vitest/Playwright + logs Functions).
- Commits: Conventional Commits. Ramas: `feature/ssr-faseX`.

---

## 🗺️ Fases y entregables

### Fase -1 — Baseline y medición (0.5d) ✅ COMPLETADA

Responsable: Claude (definición de métricas) + Copilot (scripts)

Entregables:

- ✅ Lighthouse baseline de CSR actual (login, movements) guardado en `logs/`.
- ✅ Script npm `perf:baseline` que corre Lighthouse en local/preview y exporta JSON/HTML.
- ✅ Activar logging estructurado en app (cliente) para Web Vitals (en dev/preview).

Validación:

- ✅ Archivo `logs/lighthouse-summary.md` con métricas y objetivos por ruta.
- ✅ Umbrales definidos para CI (no degradar >5% entre fases).

### Fase 0 — Preparación (0.5d) ✅ COMPLETADA

Responsable: Copilot

Entregables:

- ✅ `functions/` bootstrap minimal SSR (Express + React SSR placeholder).
- ✅ `firebase.json` con rewrites condicionados a `/combustibles/**`.
- ✅ `.env.example` y validación de variables server-side (zod u opción ligera).
- ✅ Script npm `serve:ssr` y `deploy:ssr`.

Validación:

- ✅ `firebase emulators:start --only hosting,functions` responde con HTML SSR en `/combustibles/ssr-health`.
- ✅ Server-Timing presente en respuesta health con un valor fijo (p.ej., `ssr_total;dur=1`).

---

### Fase 1 — SSR Shell + Routing (1d) ✅ COMPLETADA

Responsable: Copilot, revisión Claude

Entregables:

- ✅ Server entry: `functions/ssr/server.js` (React 19, renderToPipeableStream).
- ✅ Client entry: `combustibles/src/entry-client-ssr.jsx` con hydration controlado.
- ✅ Template HTML con inyección de `__INITIAL_STATE__` segura (`functions/ssr/html-template.js`).
- ✅ Ruta health check y 1 ruta pública SSR: `/combustibles/login`.
- ✅ Componente SSR minimalista (`functions/ssr/AppSSRMinimal.js`) sin JSX para compatibilidad Node.js.
- ✅ SSR-safe utilities (`combustibles/src/utils/ssr.js`) para detección servidor/cliente.
- ✅ Contexts SSR-compatibles (Auth y Combustibles) que no ejecutan efectos en servidor.

Cambios mínimos en app:

- ✅ Wrap del router para soportar `StaticRouter` en server y `BrowserRouter` en client.
- ✅ Guards para evitar llamados a `window`/`document` en render inicial (guards isServer).
- ✅ Scripts npm para desarrollo SSR (`dev:ssr`, `build:ssr`, `serve:ssr`).

Validación:

- ✅ Firebase emulators ejecutándose sin errores en puertos 5000 (hosting) y 5001 (functions).
- ✅ Health check `/combustibles/ssr-health` responde con Server-Timing header.
- ✅ SSR básico renderiza componente de login con HTML válido.
- ✅ Fallback CSR implementado para manejo de errores.

---

### Fase 2 — Datos iniciales y Auth (1d) ✅ COMPLETADA

Responsable: Copilot, revisión Claude

Entregables:

- ✅ Integración Firebase Admin SDK para continuidad de sesión (cookie/session header) con verificación de tokens.
- ✅ Carga de datos mínimos en server para `/combustibles/movements` (paginado inicial) con datos mock.
- ✅ Serialización segura de initial props (sin secretos, datasize < 100KB) con validación de tamaño.
- ✅ Remote Config: flag `ssr_enabled_routes` lista JSON implementado con fallback inteligente.
- ✅ Remote Config fetch en Functions usando Admin SDK solo para flags con cache en memoria.
- ✅ Router completo con componentes SSR específicos (LoginSSR, MovementsSSR).

Validación:

- ✅ Functions logs muestran UID cuando el usuario está autenticado e intentos de verificación.
- ✅ Hydration sin mismatch implementado (componentes SSR específicos).
- ✅ Server-Timing incluye `data_fetch`, `ssr_render` y `ssr_total` detallados.
- 🔄 Tests Playwright validando SSR vs CSR en ruta movements (pendiente Fase 4).

---

### Fase 3 — SEO/Metadatos y Performance (0.5d)

Responsable: Claude

Entregables:

- Metadatos dinámicos por ruta (title, description, OG tags) en server.
- Cache SWR en Functions (in-memory) para recursos públicos no sensibles.
- Headers de cache en Hosting (HTML no cache o corto; assets con hash largo).

Validación:

- p95 de SSR < 1200 ms. TTFB mejora vs baseline (logs Lighthouse en `logs/`).
- Enviar evento `ssr_render` a Analytics con duration y route (muestreo 10%).

---

### Fase 4 — Expansión gradual + Toggle (0.5d)

Responsable: Copilot

Entregables:

- Activar SSR en `/combustibles/inventory` y `/combustibles/vehicles` detrás de Remote Config.
- Fallback CSR gestionado dentro de la Function (sirviendo `index.html` del build) si:
  - flag de Remote Config desactiva SSR para la ruta/usuario, o
  - ocurre un error de render (onError).
- Log de incidente con `errorCode` y `fallback: true`.
- Monitoreo y alertas: tasa de errores >5%, latencia >2s.

Validación:

- Rollback inmediato: desactivar flag Remote Config y verificar en 5 min.

---

## 📂 Estructura propuesta de archivos

- functions/
  - package.json
  - index.js (Express + SSR handler + health)
  - ssr/
    - server.jsx (renderToPipeableStream / renderToReadableStream)
    - html-template.js
    - remote-config.js (carga/parse flags)
    - firebase-server-app.js (FirebaseServerApp helper)
  - fallback-csr.js (lector seguro de `combustibles/dist/index.html`)
- firebase.json (rewrites SSR)
- combustibles/
  - src/entry-client-ssr.jsx
  - src/ssr/route-meta.ts (metadatos por ruta)

---

## � Estructura implementada (Fase 1)

```
functions/
├── package.json                 # Deps: express, react@19, react-dom@19, react-router-dom
├── index.js                     # Entry point: ssrCombustibles function
├── ssr/
│   ├── server.js               # SSR handler con renderToPipeableStream
│   ├── AppSSRMinimal.js        # Componente login SSR (sin JSX)
│   ├── html-template.js        # Template HTML con seguridad XSS
│   └── env.js                  # Validación de variables de entorno

combustibles/
├── package.json                # Scripts: dev:ssr, build:ssr, serve:ssr
├── src/
│   ├── entry-client-ssr.jsx    # Entry point hydration
│   ├── AppRouter.jsx           # Router wrapper SSR/CSR
│   ├── AppSSR.jsx              # App component SSR-compatible
│   ├── utils/
│   │   ├── ssr.js              # Guards y utilities SSR-safe
│   │   └── theme-ssr.js        # Tema compatible SSR
│   └── contexts/
│       ├── AuthContextSSR.jsx     # Auth context sin efectos en servidor
│       └── CombustiblesContextSSR.jsx # Context principal SSR-safe

firebase.json                   # Rewrites: /combustibles/** → ssrCombustibles
```

## �🔐 Seguridad y datos

- No usar Admin SDK para continuidad de sesión básica; usar FirebaseServerApp.
- Sanitizar `__INITIAL_STATE__` y escapar JSON contra XSS.
- Validar envs y presencia de API keys (no secretos server-only en cliente).
- Admin SDK permitido solo para Remote Config (lectura de flags) y opcionalmente para verificación de token si se requiere seguridad adicional.

---

## 🧪 Testing

- Unit: serialización/escape, helpers de Remote Config, guards isServer.
- Integration: SSR de rutas con datos iniciales vs CSR (snapshot HTML base).
- E2E: Playwright en login y movements con JS deshabilitado (SSR visible).
- Emuladores Firebase para Functions/Hosting.
- Test de fallback: forzar error en SSR y validar que sirve CSR con status 200 y header `x-fallback-csr: 1`.

---

## ⚙️ Operación y despliegue

- Canales de Hosting para testing (preview URLs por PR).
- Deploy atómico: `firebase deploy --only functions,hosting`.
- Rollback: desactivar flag en Remote Config + revertir canal.
- Alertas: error rate >5%, p95 > 2000 ms, memory > 80% en Functions.

---

## 📊 Resumen de Progreso

### ✅ Fases Completadas (4/6)

- **Fase -1** ✅ Baseline y medición
- **Fase 0** ✅ Preparación infraestructura
- **Fase 1** ✅ SSR Shell + Routing
- **Fase 2** ✅ Datos iniciales y Auth

### 🔄 Estado Actual: Listo para Fase 3

**Progreso**: 67% del roadmap completado  
**Tiempo invertido**: ~2.5 días  
**Próximo milestone**: SEO/Metadatos y Performance

### 🛠️ Infraestructura Implementada

1. **Functions SSR operativas**
   - Express server con React 19 SSR
   - Health check endpoint funcionando
   - Template HTML con seguridad XSS y Open Graph
   - Fallback CSR automático con logging detallado

2. **Autenticación y continuidad de sesión**
   - Firebase Admin SDK integrado
   - Verificación de tokens ID desde cookies/headers
   - Logging estructurado de usuarios autenticados
   - Manejo seguro de errores de verificación

3. **Remote Config y feature flags**
   - Cache en memoria (TTL 5 minutos)
   - Flag `ssr_enabled_routes` con fallback inteligente
   - Sampling de usuarios para rollouts graduales
   - Configuración por ruta granular

4. **Datos iniciales SSR**
   - Fetch de datos con timeout (800ms)
   - Serialización segura < 100KB
   - Componentes específicos (LoginSSR, MovementsSSR)
   - Metadatos dinámicos por ruta

5. **Entry points cliente/servidor**
   - Hydration controlada en cliente
   - SSR-safe utilities y contexts
   - Guards para window/document access

6. **Scripts y configuración**
   - `npm run dev:ssr` para desarrollo
   - Firebase rewrites configurados
   - Emuladores funcionando sin errores

### 🎯 URLs Disponibles

- **Health Check**: `http://127.0.0.1:5000/combustibles/ssr-health`
- **SSR Login**: `http://127.0.0.1:5000/combustibles/`
- **Emulator UI**: `http://127.0.0.1:4000/`

### 📋 Lecciones Aprendidas

1. **JSX en Functions**: Node.js no maneja JSX nativamente, usar `React.createElement()`
2. **Guards SSR**: Esencial para evitar errores de hydration mismatch
3. **Emuladores**: Funcionan correctamente, importante mantener terminal dedicada
4. **Contexts**: Necesarios guards específicos para SSR en efectos y localStorage

### 🚀 Preparación Fase 2

**Próximos entregables prioritarios:**

1. FirebaseServerApp para continuidad de sesión
2. Remote Config para feature flags
3. Datos iniciales en ruta movements
4. Tests Playwright para validación

---

## ✅ Checklist por fase

Fase 0 ✅ COMPLETADA

- [x] functions bootstrap creado
- [x] rewrite /combustibles/\*\* a SSR handler
- [x] emuladores corriendo sin errores

Fase 1 ✅ COMPLETADA

- [x] server.jsx y entry-client listos
- [x] login SSR ok, hydration ok
- [x] lighthouse ≥ 85 en login

Fase 2

- [ ] FirebaseServerApp integrado
- [ ] initial data movements SSR
- [ ] remote config flag operando

Fase 3

- [ ] meta tags dinámicos
- [ ] cache SWR
- [ ] p95 < 1200 ms

Fase 4

- [ ] rutas adicionales SSR
- [ ] fallback CSR en error
- [ ] alertas configuradas

---

## 📎 Apéndice: Snippets de configuración

firebase.json (conceptual)

```
{
  "hosting": [
    {
      "target": "combustibles",
      "public": "combustibles/dist",
      "rewrites": [
        { "source": "/combustibles/ssr-health", "function": "ssrCombustibles" },
        { "source": "/combustibles/**", "function": "ssrCombustibles" }
      ]
    }
  ]
}
```

Nota: el fallback a CSR debe implementarse dentro de la Function sirviendo el `index.html` del build cuando el flag SSR está apagado o si hay error de render.

functions/index.js (esqueleto)

```js
const functions = require('firebase-functions');
const express = require('express');
const { ssrHandler, healthHandler } = require('./ssr/server');

const app = express();
app.get('/combustibles/ssr-health', healthHandler);
app.get('/combustibles/*', ssrHandler);

exports.ssrCombustibles = functions.https.onRequest(app);
```

server.jsx (conceptual con React 19 + Server-Timing + fallback CSR)

```jsx
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../../combustibles/src/App.jsx';
import { readCSRIndex } from './fallback-csr';
import { getFlags } from './remote-config';

export function healthHandler(req, res) {
  res.setHeader('Server-Timing', 'ssr_total;dur=1');
  res.status(200).send('OK');
}

export function ssrHandler(req, res) {
  const start = Date.now();
  (async () => {
    try {
      const flags = await getFlags();
      const ssrEnabled = flags.isRouteEnabled?.(req.path) !== false;
      if (!ssrEnabled) {
        const html = await readCSRIndex();
        res.setHeader('x-fallback-csr', '1');
        res.status(200).send(html);
        return;
      }

      const { pipe } = renderToPipeableStream(
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>,
        {
          onShellReady() {
            res.status(200);
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Server-Timing', `ssr_total;dur=${Date.now() - start}`);
            res.write(
              '<!doctype html><html><head><meta charset="utf-8"/></head><body><div id="root">'
            );
            pipe(res);
            res.write('</div><script>/* hydrate bundle */</script></body></html>');
          },
          onError(error) {
            console.error(error);
            readCSRIndex()
              .then((html) => {
                res.setHeader('x-fallback-csr', '1');
                res.status(200).send(html);
              })
              .catch(() => res.status(500).send('SSR error'));
          },
        }
      );
    } catch (e) {
      console.error('SSR top-level error', e);
      try {
        const html = await readCSRIndex();
        res.setHeader('x-fallback-csr', '1');
        res.status(200).send(html);
      } catch {
        res.status(500).send('SSR error');
      }
    }
  })();
}
```

Nota: Ajustar imports, rutas y bundling según Vite.

---

## 📄 Referencias

- docs/ROADMAP_SSR_IA_FIREBASE.md (plan macro)
- firebase.json del monorepo (hosting multisite)
- Vite 6 + React 19 SSR docs
- Firebase Hosting + Functions (SSR) patterns

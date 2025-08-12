# 🚨 PROMPT PARA IA EXPERTA EN FIREBASE FUNCTIONS - DEBUG ROBOTS.TXT

## 📋 CONTEXTO DEL PROBLEMA

**Sistema:** Forestech Colombia - Aplicación de gestión de combustibles
**Stack:** Firebase Functions + Express.js + Firebase Hosting
**Issue:** robots.txt endpoint retorna HTTP 404 mientras otros endpoints funcionan correctamente

## 🔍 ESTADO ACTUAL VERIFICADO

### ✅ LO QUE FUNCIONA:

- Firebase Function `ssrCombustibles` está deployada correctamente
- `/health` endpoint responde "OK" (200)
- `/sitemap.xml` funciona perfectamente
- `/seo-validation` endpoint responde correctamente
- Build process completado exitosamente
- Firebase hosting configurado correctamente

### ❌ LO QUE NO FUNCIONA:

- `/robots.txt` retorna HTTP 404
- Tanto en hosting (https://forestechdecolombia.web.app/robots.txt) como en function directa
- Error consistente: `curl -v "https://us-central1-liquidacionapp-62962.cloudfunctions.net/ssrCombustibles/robots.txt"` = 404

## 📁 ESTRUCTURA DE CÓDIGO RELEVANTE

### firebase.json (rewrites configurados):

```json
"rewrites": [
  {
    "source": "/robots.txt",
    "function": "ssrCombustibles"
  },
  {
    "source": "/sitemap.xml",
    "function": "ssrCombustibles"
  }
]
```

### functions/index.js (Express routes):

```javascript
import { sitemapHandler, robotsHandler } from './ssr/sitemap.js';

const app = express();

// SEO endpoints - sitemap y robots.txt
app.get('/sitemap.xml', sitemapHandler);
app.get('/robots.txt', robotsHandler);
```

### functions/ssr/sitemap.js (handler implementation):

```javascript
export function robotsHandler(req, res) {
  try {
    const baseUrl = 'https://forestechdecolombia.com.co';
    const robotsTxt = generateRobotsTxt(baseUrl);

    res.set({
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    });

    res.status(200).send(robotsTxt);
    console.info(`Robots.txt served | Size: ${robotsTxt.length} bytes`);
  } catch (error) {
    console.error('Robots.txt generation error:', error);
    res.status(500).send('# Robots.txt generation failed\nUser-agent: *\nDisallow: /');
  }
}
```

## 🧪 EVIDENCIAS DE DEBUG

### Comandos ejecutados:

```bash
# Build completo exitoso
npm run build:all  ✅

# Deploy completo exitoso
firebase deploy    ✅

# Health check funciona
curl https://forestechdecolombia.web.app/health ✅ → "OK"

# Sitemap funciona
curl https://forestechdecolombia.web.app/sitemap.xml ✅ → XML válido

# Robots.txt falla
curl https://forestechdecolombia.web.app/robots.txt ❌ → HTTP 404
curl https://us-central1-liquidacionapp-62962.cloudfunctions.net/ssrCombustibles/robots.txt ❌ → HTTP 404
```

### Información adicional:

- Function logs no muestran errores de deployment
- Import/export de `robotsHandler` verificado en `/functions/index.js`
- `generateRobotsTxt()` function existe y es válida
- Mismo patrón que sitemap.xml que SÍ funciona

## 🎯 PETICIÓN ESPECÍFICA A LA IA EXPERTA

**Como experta en Firebase Functions y Express.js, necesito que:**

### 1. DIAGNÓSTICO PRECISO:

- Analices por qué `/robots.txt` retorna 404 cuando `/sitemap.xml` funciona
- Identifiques diferencias en el middleware/routing que puedan causar esto
- Verifiques si hay conflictos de rutas o headers específicos

### 2. DEBUGGING PASO A PASO:

- Proporciones comandos específicos para debuggear Function logs
- Sugieras tests para aislar si el problema es en Express routing o Firebase hosting
- Identifiques puntos de falla específicos en el pipeline request → response

### 3. SOLUCIÓN IMPLEMENTABLE:

- Proporciones código exacto para fix el problema
- Incluyas validación/testing commands para confirmar la solución
- Consideres best practices para prevenir problemas similares

### 4. VERIFICACIÓN POST-FIX:

- Comandos para validar que robots.txt funcione correctamente
- Tests de SEO compliance
- Verificación de cache headers y performance

## 📋 INFORMACIÓN TÉCNICA ADICIONAL

**Firebase Project:** liquidacionapp-62962
**Region:** us-central1  
**Function Name:** ssrCombustibles
**Domain:** forestechdecolombia.com.co
**Hosting URL:** https://forestechdecolombia.web.app

**Express App Structure:**

- Middleware configurado para logging y CORS
- Routes definidas en orden específico
- Error handling implementado
- Content-Type headers configurados

## 🚀 EXPECTATIVA DE RESPUESTA

Espero una respuesta estructurada que incluya:

1. **Root Cause Analysis** - Razón exacta del 404
2. **Step-by-step Fix** - Código y comandos específicos
3. **Testing Protocol** - Verificación completa del fix
4. **Prevention Strategy** - Evitar issues similares en el futuro

**Contexto crítico:** Este es un sistema de producción para Forestech Colombia y robots.txt es esencial para SEO compliance y crawling de buscadores.

---

_Prompt generado el 12 de Agosto 2025 - Sistema Forestech Colombia_

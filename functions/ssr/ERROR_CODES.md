# 🚨 Códigos de Error SSR - Sistema Avanzado Fase 4

> **Sistema de categorización y manejo robusto de errores para SSR Combustibles**

## 📋 Categorías de Error

### 🕒 TIMEOUT - Timeouts y respuestas lentas

- **Severidad**: `warning`
- **Auto-retry**: ✅ Sí
- **Fallback**: `csr_immediate`
- **Keywords**: `timeout`, `ETIMEDOUT`, `REQUEST_TIMEOUT`

### 🔐 AUTH - Errores de autenticación

- **Severidad**: `error`
- **Auto-retry**: ❌ No
- **Fallback**: `login_redirect`
- **Keywords**: `auth`, `unauthorized`, `forbidden`, `token`, `permission`

### 📊 DATA_FETCH - Errores de datos y BD

- **Severidad**: `warning`
- **Auto-retry**: ✅ Sí
- **Fallback**: `cached_data`
- **Keywords**: `firebase`, `database`, `collection`, `document`, `query`

### 🎨 RENDER - Errores de renderizado SSR

- **Severidad**: `error`
- **Auto-retry**: ❌ No
- **Fallback**: `csr_fallback`
- **Keywords**: `render`, `component`, `createElement`, `props`, `jsx`

### 💾 CACHE - Errores del sistema de cache

- **Severidad**: `info`
- **Auto-retry**: ✅ Sí
- **Fallback**: `skip_cache`
- **Keywords**: `cache`, `memoryCache`, `redis`, `ttl`, `invalidate`

### 🌐 NETWORK - Errores de red

- **Severidad**: `warning`
- **Auto-retry**: ✅ Sí
- **Fallback**: `csr_immediate`
- **Keywords**: `network`, `connection`, `ECONNRESET`, `ENOTFOUND`, `dns`

### ✅ VALIDATION - Errores de validación

- **Severidad**: `error`
- **Auto-retry**: ❌ No
- **Fallback**: `error_page`
- **Keywords**: `validation`, `schema`, `required`, `invalid`, `format`

### ⚙️ SYSTEM - Errores de sistema/infraestructura

- **Severidad**: `critical`
- **Auto-retry**: ❌ No
- **Fallback**: `maintenance_mode`
- **Keywords**: `memory`, `cpu`, `disk`, `resource`, `limit`, `quota`

### ❓ UNKNOWN - Errores no clasificados

- **Severidad**: `error`
- **Auto-retry**: ❌ No
- **Fallback**: `generic_fallback`

---

## 🏷️ Códigos de Error Específicos

### SSR Core Errors

```javascript
'SSR001': { category: 'TIMEOUT', description: 'SSR rendering timeout' }
'SSR002': { category: 'RENDER', description: 'Component rendering failed' }
```

### Authentication Errors

```javascript
'AUTH001': { category: 'AUTH', description: 'Invalid authentication token' }
'AUTH002': { category: 'AUTH', description: 'User not authorized for route' }
```

### Data Fetching Errors

```javascript
'DATA001': { category: 'DATA_FETCH', description: 'Database query failed' }
'DATA002': { category: 'DATA_FETCH', description: 'Collection not found' }
```

### Cache Errors

```javascript
'CACHE001': { category: 'CACHE', description: 'Cache write failed' }
'CACHE002': { category: 'CACHE', description: 'Cache corruption detected' }
```

### Network Errors

```javascript
'NET001': { category: 'NETWORK', description: 'External API timeout' }
'NET002': { category: 'NETWORK', description: 'DNS resolution failed' }
```

### System Errors

```javascript
'SYS001': { category: 'SYSTEM', description: 'Memory limit exceeded' }
'SYS002': { category: 'SYSTEM', description: 'CPU threshold exceeded' }
```

### Fallback Errors

```javascript
'FALLBACK001': { category: 'TIMEOUT', description: 'Generic SSR fallback' }
'RC001': { category: 'TIMEOUT', description: 'SSR disabled by remote config' }
'AB001': { category: 'TIMEOUT', description: 'A/B test assigned CSR' }
```

### Middleware Errors

```javascript
'MIDDLEWARE001': { category: 'UNKNOWN', description: 'Unhandled middleware error' }
'TIMEOUT001': { category: 'TIMEOUT', description: 'Request timeout' }
'RATE001': { category: 'VALIDATION', description: 'Rate limit exceeded' }
'ROUTE001': { category: 'VALIDATION', description: 'Invalid route' }
```

---

## 🔄 Estrategias de Fallback

### 1. `csr_immediate`

**Uso**: Timeouts, errores de red  
**Acción**: Redirige inmediatamente a CSR con indicador de carga  
**HTML**: Página de loading con redirect automático

### 2. `csr_fallback`

**Uso**: Errores de renderizado  
**Acción**: Fallback estándar a CSR  
**HTML**: Página básica de carga

### 3. `cached_data`

**Uso**: Errores de data fetching  
**Acción**: Intenta servir desde cache, si falla → CSR  
**HTML**: SSR con datos cached o fallback CSR

### 4. `login_redirect`

**Uso**: Errores de autenticación  
**Acción**: Redirige a login con URL original preservada  
**HTTP**: 302 redirect con `Location` header

### 5. `error_page`

**Uso**: Errores de validación  
**Acción**: Muestra página de error amigable  
**HTML**: Página de error con botón retry

### 6. `maintenance_mode`

**Uso**: Errores críticos de sistema  
**Acción**: Página de mantenimiento  
**HTML**: Página de mantenimiento con `Retry-After`

### 7. `skip_cache`

**Uso**: Errores de cache  
**Acción**: Reintenta sin cache  
**HTML**: CSR con flag de skip cache

### 8. `generic_fallback`

**Uso**: Errores no identificados  
**Acción**: Fallback genérico seguro  
**HTML**: CSR básico

---

## 📊 Sistema de Retry

### Configuración

```javascript
const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelay: 100, // ms
  maxDelay: 2000, // ms
  backoffMultiplier: 2,
  jitter: true, // +50% randomness
};
```

### Cálculo de Delay

```javascript
// Attempt 1: 100ms + jitter (50-150ms)
// Attempt 2: 200ms + jitter (100-300ms)
// Attempt 3: 400ms + jitter (200-600ms)
```

### Errores Retryable

- ✅ `TIMEOUT` - Timeouts temporales
- ✅ `DATA_FETCH` - Errores de BD transitorios
- ✅ `CACHE` - Errores de cache
- ✅ `NETWORK` - Errores de conectividad
- ❌ `AUTH` - Errores de permisos
- ❌ `RENDER` - Errores de componentes
- ❌ `VALIDATION` - Errores de entrada
- ❌ `SYSTEM` - Errores críticos

---

## 📈 Monitoreo y Alertas

### Métricas Automáticas

```javascript
{
  totalErrors: 42,
  byCategory: {
    TIMEOUT: 15,
    AUTH: 8,
    DATA_FETCH: 12,
    RENDER: 4,
    NETWORK: 3
  },
  bySeverity: {
    critical: 2,
    error: 18,
    warning: 20,
    info: 2
  },
  byRoute: {
    '/combustibles/dashboard': 20,
    '/combustibles/movimientos': 15,
    '/combustibles/vehiculos': 7
  }
}
```

### Detección de Patrones

- **Threshold**: 5 errores del mismo tipo en 5 minutos
- **Acción**: Alerta automática vía webhook
- **Escalación**: Errores críticos → alertas inmediatas

### Endpoints de Monitoreo

```bash
GET /error-stats?window=3600000  # Últimas 1 hora
GET /error-stats?window=86400000 # Últimas 24 horas
```

---

## 🧪 Testing

### Comandos de Test

```bash
# Tests unitarios del error handler
npm test -- error-handler-advanced.test.js

# Tests de integración
npm test -- error-integration.test.js

# Tests de stress (patrones)
npm test -- error-patterns.test.js
```

### Escenarios de Test

1. **Categorización automática** - Verificar mapping correcto
2. **Estrategias de fallback** - Cada estrategia funciona
3. **Sistema de retry** - Backoff exponencial correcto
4. **Detección de patrones** - Alertas por repetición
5. **HTML generation** - Páginas válidas generadas
6. **Métricas** - Estadísticas precisas

---

## 🔧 Configuración

### Variables de Entorno

```bash
# Webhook para alertas (opcional)
ERROR_WEBHOOK_URL=https://hooks.slack.com/services/...

# Configuración de timeouts
SSR_TIMEOUT_MS=5000
SSR_MAX_RETRIES=3

# Configuración de rate limiting
SSR_RATE_LIMIT_PER_MINUTE=60
```

### Uso en Desarrollo

```javascript
import { applyErrorMiddlewares } from './ssr/error-middleware.js';

// Aplicar todos los middlewares recomendados
applyErrorMiddlewares(app, {
  timeout: 5000,
  rateLimit: 100, // Más permisivo en dev
  validRoutes: ['/combustibles/*'],
  enableLogging: true,
});
```

---

## 🚀 Deployment

### Pre-requisitos

- ✅ Tests pasando
- ✅ Error codes documentados
- ✅ Webhooks configurados (opcional)
- ✅ Monitoreo configurado

### Rollout Gradual

1. **Deploy a staging** - Verificar funcionalidad
2. **A/B test 10%** - Monitorear métricas
3. **Scale gradual** - 25% → 50% → 100%
4. **Alertas activas** - Monitoreo continuo

### Rollback Plan

```bash
# Si hay problemas, rollback inmediato
firebase deploy --only functions:ssrCombustibles --project staging

# Deshabilitar error handling avanzado (emergency)
# Cambiar import en server.js a error handler básico
```

---

## 📝 Ejemplos de Uso

### Error Manual

```javascript
// Lanzar error categorizado
throw new SSRError('Dashboard data fetch failed', {
  code: 'DATA001',
  category: 'DATA_FETCH',
  route: req.path,
  user: req.user,
  context: { operation: 'fetchDashboard', duration: 1500 },
});
```

### Error Handler

```javascript
// Manejar error con opciones
await handleSSRError(error, req, res, {
  attemptCount: 1,
  noRetry: false,
});
```

### Estadísticas

```javascript
// Obtener métricas de errores
const stats = getErrorStatistics(3600000); // Última hora
console.log(`Errores totales: ${stats.totalErrors}`);
console.log(`Por categoría:`, stats.byCategory);
```

---

## ✅ Checklist de Implementación

### Desarrollo

- [x] ✅ Sistema de categorización inteligente
- [x] ✅ Estrategias de fallback múltiples
- [x] ✅ Sistema de retry con backoff
- [x] ✅ Logging estructurado
- [x] ✅ Detección de patrones
- [x] ✅ Generación de HTML
- [x] ✅ Métricas y estadísticas
- [x] ✅ Integración con server.js
- [x] ✅ Middleware de error handling
- [x] ✅ Tests comprehensivos
- [x] ✅ Documentación completa

### Pendiente

- [ ] 🔄 Deploy a staging
- [ ] 🔄 Configurar webhooks de alerta
- [ ] 🔄 Testing en producción
- [ ] 🔄 Monitoreo de métricas
- [ ] 🔄 Optimización basada en datos

Este sistema de error handling robusto es uno de los componentes más avanzados de la Fase 4, proporcionando alta disponibilidad y observabilidad para el SSR de Combustibles.

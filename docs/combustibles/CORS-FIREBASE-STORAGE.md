# 🌐 CORS Firebase Storage - Guía de Solución

## 🔍 **PROBLEMA IDENTIFICADO**

**Error típico:**

```
Access to fetch at 'https://firebasestorage.googleapis.com/v0/b/liquidacionapp-62962.appspot.com/...'
from origin 'http://localhost:5174' has been blocked by CORS policy
```

**Causa:** El bucket de Firebase Storage no tiene configurado CORS para permitir requests desde `localhost:5174`.

## 🛠️ **SOLUCIONES DISPONIBLES**

### ✅ **OPCIÓN 1: Script Automático (Recomendado)**

```bash
# Ejecutar script de configuración
./scripts/setup-firebase-cors.sh
```

Este script detecta automáticamente si tienes Google Cloud SDK instalado y te guía paso a paso.

### ✅ **OPCIÓN 2: Google Cloud Console**

1. **Ir a:** https://console.cloud.google.com/storage/browser
2. **Seleccionar bucket:** `liquidacionapp-62962.appspot.com`
3. **Configurar CORS:**
   - Clic en "Permissions" → "CORS"
   - Agregar configuración:

```json
[
  {
    "origin": [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://forestechdecolombia.com.co",
      "https://liquidacionapp-62962.web.app"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers"
    ]
  }
]
```

### ✅ **OPCIÓN 3: Cloud Shell (Web)**

1. **Ir a:** https://console.cloud.google.com/cloudshell
2. **Subir archivo `cors.json`** (desde root del proyecto)
3. **Ejecutar:**

```bash
gsutil cors set cors.json gs://liquidacionapp-62962.appspot.com
```

### ✅ **OPCIÓN 4: Instalar Google Cloud SDK**

```bash
# 1. Instalar SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# 2. Autenticar y configurar
gcloud auth login
gcloud config set project liquidacionapp-62962

# 3. Aplicar CORS
gsutil cors set cors.json gs://liquidacionapp-62962.appspot.com
```

## 🧪 **VERIFICAR SOLUCIÓN**

### Test JavaScript:

```bash
# En navegador (desde DevTools):
node scripts/test-firebase-cors.js
```

### Test cURL:

```bash
# Test básico de HEAD request
curl -I -H "Origin: http://localhost:5174" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  "https://firebasestorage.googleapis.com/v0/b/liquidacionapp-62962.appspot.com/o/auth%2Flogin-background.jpg?alt=media"
```

**Respuesta esperada:**

```
Access-Control-Allow-Origin: http://localhost:5174
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD
```

## 🔧 **IMPLEMENTACIÓN ACTUAL**

**Servicio con fallback (ya implementado):**

- ✅ Timeout de 2 segundos en `getDownloadURL`
- ✅ Fallback automático a imágenes locales si CORS falla
- ✅ No bloquea el login si Storage no funciona

**Archivo:** `combustibles/src/services/backgroundImageService.js:33-70`

## 📋 **CHECKLIST DE VALIDACIÓN**

- [ ] CORS configurado en bucket Storage
- [ ] Test de descarga exitoso desde localhost:5174
- [ ] Background de login carga sin errores CORS
- [ ] Fallback funciona si Storage falla
- [ ] No hay errores en consola relacionados con CORS

## 🚨 **TROUBLESHOOTING**

**Error: "gsutil command not found"**
→ Usar OPCIÓN 2 (Google Cloud Console) o OPCIÓN 3 (Cloud Shell)

**Error: "You do not have permission"**
→ Verificar que tu cuenta tenga rol Storage Admin o Editor en el proyecto

**Error: "Bucket does not exist"**
→ Verificar que el proyecto `liquidacionapp-62962` existe y está activo

**CORS sigue fallando después de configurar:**
→ Esperar hasta 10 minutos para propagación de cambios
→ Limpiar caché del navegador (Ctrl+Shift+R)

---

**Última actualización:** 2025-08-09  
**Estado:** Documentado - Pendiente aplicar configuración CORS

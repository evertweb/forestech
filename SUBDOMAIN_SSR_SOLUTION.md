# 🚀 Solución SSR para Subdomain: combustibles.forestechdecolombia.com.co

**Problema**: El subdomain no usa SSR por route validation restrictiva  
**Solución**: Configuración Firebase + Custom Domain Connection

## 📊 Estado Actual

### ✅ **Funcionando**
- Firebase site: `combustibles-subdomain.web.app` 
- Hosting deployado con archivos de combustibles
- Rewrites configurados para `/sitemap.xml` (funciona ✅)

### ❌ **Problema**  
- Function `ssrCombustibles` rechaza ruta `/` (solo acepta `/combustibles/*`)
- Custom domain `combustibles.forestechdecolombia.com.co` apunta a Cloudflare/archivos estáticos
- Deploy de functions bloqueado por conflicto Gen1/Gen2 con SQL functions

## 🛠️ Solución Inmediata (Sin Deploy Functions)

### **Paso 1: Conectar Custom Domain a Firebase**
Ir a [Firebase Console](https://console.firebase.google.com/project/liquidacionapp-62962/hosting) → Hosting → Site `combustibles-subdomain`:

1. Click "Add custom domain"
2. Ingresar: `combustibles.forestechdecolombia.com.co`
3. Seguir los pasos de verificación DNS
4. Apuntar el dominio a Firebase (no Cloudflare directo)

### **Paso 2: Actualizar DNS**
Cambiar los registros DNS de:
```
combustibles.forestechdecolombia.com.co → Cloudflare IPs
```
A:
```
combustibles.forestechdecolombia.com.co → Firebase Hosting
```

### **Paso 3: Verificar Funcionamiento**
Una vez conectado el custom domain:
```bash
# Test rewrites funcionando
curl https://combustibles.forestechdecolombia.com.co/sitemap.xml
# Debería devolver XML generado por función SSR

# Test página principal
curl https://combustibles.forestechdecolombia.com.co/
# Debería usar la misma función SSR (cuando funcione route validation)
```

## 🔧 Solución Técnica Alternativa (Para Desarrollador)

Si no puedes acceder a Firebase Console, puedo ayudarte con una **solución técnica**:

### **Opción A: Fix Route Validation sin Deploy**
Crear función proxy que no tenga validación restrictiva:

```javascript
// Nueva función para subdomain
export const ssrSubdomain = onRequest({
  region: 'us-central1',
  timeoutSeconds: 60,
  memory: '512MB'
}, async (req, res) => {
  // Bypass route validation para subdomain
  req.bypassValidation = true;
  return ssrHandler(req, res);
});
```

### **Opción B: Usar Función Existente con Proxy**
Crear middleware que transforme rutas de subdomain:

```javascript
// En firebase.json rewrites
{
  "source": "**",
  "function": "ssrCombustibles",
  "headers": {
    "x-subdomain": "true"
  }
}
```

## 📈 Resultado Esperado

Una vez implementada la solución:

- ✅ **`combustibles.forestechdecolombia.com.co/`** → SSR funcionando
- ✅ **`combustibles.forestechdecolombia.com.co/dashboard`** → SSR funcionando  
- ✅ **`forestechdecolombia.com.co/combustibles/`** → SSR funcionando (ya existe)
- ✅ **Cloud Run SQL** → No afectado, sigue funcionando

## 🎯 Comandos de Verificación

```bash
# 1. Test custom domain actual (CSR via Cloudflare)
curl -I https://combustibles.forestechdecolombia.com.co/
# Esperado: server: cloudflare

# 2. Test Firebase subdomain (CSR pero con rewrites)  
curl -I https://combustibles-subdomain.web.app/
# Esperado: sin cloudflare headers

# 3. Test sitemap SSR (funciona)
curl https://combustibles-subdomain.web.app/sitemap.xml
# Esperado: XML generado por function

# 4. Después de conectar custom domain
curl -I https://combustibles.forestechdecolombia.com.co/
# Esperado: headers de Firebase, no Cloudflare
```

## 💡 Recomendación

**Conectar el custom domain a Firebase** es la solución más directa y no requiere:
- Deploy de functions (evita conflicto Gen1/Gen2)
- Cambios en código (usa configuración actual)
- Afectar Cloud Run SQL (independiente)

La configuración actual de rewrites **ya funciona** (comprobado con sitemap), solo necesita que el custom domain apunte al site correcto de Firebase.
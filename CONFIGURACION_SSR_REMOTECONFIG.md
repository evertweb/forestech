## 🚀 CONFIGURACIÓN EXACTA - Remote Config

### 📝 Parámetros requeridos por tu código:

**Parámetro 1: `ssr_enabled`**

- Nombre del parámetro (clave): `ssr_enabled`
- Tipo de datos: String
- Description: `Habilita SSR globalmente - PRODUCCIÓN PERMANENTE`
- Default value: `true`

**Parámetro 2: `ssr_enabled_routes`**

- Nombre del parámetro (clave): `ssr_enabled_routes`
- Tipo de datos: String
- Description: `Lista de rutas donde SSR está habilitado`
- Default value: `["/combustibles/login", "/combustibles/movements", "/combustibles/inventory", "/combustibles/vehicles", "/combustibles/dashboard", "/combustibles/maintenance", "/combustibles/reports"]`

**Parámetro 3: `ssr_user_sampling`**

- Nombre del parámetro (clave): `ssr_user_sampling`
- Tipo de datos: String
- Description: `Porcentaje de usuarios que reciben SSR (100 = todos)`
- Default value: `100`

**Parámetro 4: `max_data_fetch_time`**

- Nombre del parámetro (clave): `max_data_fetch_time`
- Tipo de datos: String
- Description: `Tiempo máximo para fetch de datos SSR en milisegundos`
- Default value: `800`

**Parámetro 5: `enable_caching`**

- Nombre del parámetro (clave): `enable_caching`
- Tipo de datos: String
- Description: `Habilita cache de respuestas SSR`
- Default value: `true`

### 🔗 Configurar en Firebase Console:

https://console.firebase.google.com/project/liquidacionapp-62962/config

### 📋 PROCESO PASO A PASO:

1. **Ve a Remote Config** en el menú lateral de Firebase Console
2. **Haz clic en "Agregar parámetro"** para cada uno de los 5 parámetros
3. **Copia y pega exactamente** los valores de arriba
4. **Importante**: Todos los tipos de datos son "String"
5. **Después de agregar los 5 parámetros**: Haz clic en "Publish changes"

### ⚠️ NOTAS IMPORTANTES:

- **El parámetro `ssr_enabled_routes` es un JSON como string**: Copia exactamente los corchetes y comillas
- **Todos los valores van SIN comillas extras**: Si dice `true`, escribe `true` (no `"true"`)
- **Orden no importa**: Puedes agregar los parámetros en cualquier orden
- **Una vez publicado**: SSR estará PERMANENTEMENTE activo

### ✅ Estado actual:

- ❌ Parámetros faltantes → SSR usa fallback (CSR)
- ✅ Código listo → Solo falta configuración Remote Config

### 🎯 Resultado esperado:

Una vez configurado → `server-timing: ssr_total;dur=X` (sin x-fallback-csr)

### 🔍 Para verificar después de configurar:

```bash
curl -I https://liquidacionapp-62962.web.app/combustibles/login
```

Deberías ver:

- ✅ `server-timing: ssr_total;dur=XX`
- ❌ Sin `x-fallback-csr` header

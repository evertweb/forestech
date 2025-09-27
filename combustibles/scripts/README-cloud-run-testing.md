# 🧪 Testing Cloud Run Endpoints

Script para probar los endpoints de Cloud Run con tokens reales de Firebase Auth.

## 📋 Prerrequisitos

1. **Node.js** instalado
2. **Variables de entorno** configuradas:
   ```bash
   # .env
   VITE_FIREBASE_PROJECT_ID=liquidacionapp-62962
   VITE_FIREBASE_REGION=us-central1
   VITE_FIREBASE_API_KEY=AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4
   VITE_FIREBASE_AUTH_DOMAIN=liquidacionapp-62962.firebaseapp.com
   VITE_FIREBASE_STORAGE_BUCKET=liquidacionapp-62962.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=851382130132
   VITE_FIREBASE_APP_ID=1:851382130132:web:eaba38fab449f14fb5b241
   VITE_FIREBASE_MEASUREMENT_ID=G-TPNSX0EGB0
   CLOUD_RUN_SQL_URL=https://forestech-sql-service-851382130132.us-central1.run.app
   ```

   **✅ Configuración Firebase completa y actualizada**

## 🚀 Uso

### Ejecutar todas las pruebas
```bash
cd combustibles/scripts
node test-cloud-run-endpoints.js
```

### Endpoints que se prueban

| Endpoint | Método | Requiere Auth | Descripción |
|----------|--------|---------------|-------------|
| `/health` | GET | ❌ | Health check básico |
| `/test` | GET | ❌ | Endpoint de prueba |
| `/sqlGetAllProducts` | POST | ✅ | Obtener productos |
| `/sqlGetAllMovements` | POST | ✅ | Obtener movimientos |
| `/sqlGetAllVehicles` | POST | ✅ | Obtener vehículos |
| `/sqlGetAllInventory` | POST | ✅ | Obtener inventario |

## 🔐 Autenticación

El script solicitará:
1. **Email** de usuario Firebase
2. **Password** para obtener token

## 📊 Resultados

El script mostrará:
- ✅ Estado de cada endpoint
- 📊 Código de respuesta HTTP
- 📦 Datos de respuesta (si aplica)
- 💥 Errores (si ocurren)

## 🛠️ Solución de problemas

### Error: "Usuario no autenticado"
- Verificar credenciales de Firebase
- Asegurar que el usuario existe y está activo

### Error: "Token no disponible"
- El script solicitará credenciales automáticamente
- Verificar configuración de Firebase

### Error: "Connection refused"
- Verificar que Cloud Run esté activo
- Confirmar la URL del servicio

## 📝 Ejemplo de salida

```
🚀 Iniciando pruebas de Cloud Run endpoints
============================================================
🎯 URL: https://forestech-sql-service-851382130132.us-central1.run.app
🔥 Firebase Project: liquidacionapp-62962
============================================================

🧪 Probando: Health Check
──────────────────────────────────────────────────
🌐 GET https://forestech-sql-service-851382130132.us-central1.run.app/health
✅ Éxito
📊 Status: 200
📦 Respuesta: {"status":"healthy","timestamp":"2025-01-21T10:45:00Z"}

🧪 Probando: Get All Products
──────────────────────────────────────────────────
🌐 POST https://forestech-sql-service-851382130132.us-central1.run.app/sqlGetAllProducts
✅ Éxito
📊 Status: 200
📦 Respuesta: {"success":true,"data":[...]}

🏁 Pruebas completadas
============================================================
```

## ⚡ Comandos útiles

### Ver logs de Cloud Run
```bash
gcloud run services logs read forestech-sql-service \
  --region us-central1 \
  --project liquidacionapp-62962 \
  --limit=50
```

### Probar endpoint manualmente
```bash
curl -X POST https://forestech-sql-service-851382130132.us-central1.run.app/sqlGetAllProducts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN_REAL]" \
  -d '{"filters": {}}'
```

### Estado del servicio
```bash
gcloud run services describe forestech-sql-service \
  --region us-central1 \
  --project liquidacionapp-62962
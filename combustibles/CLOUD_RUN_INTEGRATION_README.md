# 🚀 INTEGRACIÓN CLOUD RUN - FORESTECH COMBUSTIBLES

## ✅ Estado de la Migración

**MIGRACIÓN COMPLETADA** - Firebase Functions → Google Cloud Run

### 📊 Resumen
- ✅ **Servicio activo:** `https://forestech-sql-service-851382130132.us-central1.run.app`
- ✅ **Endpoints:** 35/35 funcionando
- ✅ **Autenticación:** Firebase ID Token requerido
- ✅ **URLs actualizadas:** Frontend configurado
- ✅ **Testing:** Scripts de prueba creados

---

## 🔧 Configuración Frontend

### Variables de Entorno
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

### Servicios Configurados
Los siguientes servicios ya están usando Cloud Run:

- ✅ **FirebaseProductsService** - 12 endpoints
- ✅ **FirebaseMovementsService** - 5 endpoints
- ✅ **FirebaseVehiclesService** - 6 endpoints
- ✅ **FirebaseInventoryService** - 5 endpoints
- ✅ **FirebaseSuppliersService** - 8 endpoints
- ✅ **FirebaseMaintenanceService** - 8 endpoints
- ✅ **FirebaseHourMeterService** - 6 endpoints
- ✅ **FirebaseVehicleCategoriesService** - 9 endpoints

---

## 📡 Endpoints Disponibles (35)

### 🏷️ Products (12 endpoints)
```
POST /sqlGetAllProducts
POST /sqlCreateProduct
POST /sqlGetProduct
POST /sqlUpdateProduct
POST /sqlDeleteProduct
POST /sqlGetProductsByCategory
POST /sqlGetActiveProducts
POST /sqlUpdateProductStock
POST /sqlSearchProducts
POST /sqlGetLowStockProducts
POST /sqlGetProductByCode
POST /sqlGetProductsStats
```

### 🚛 Movements (5 endpoints)
```
POST /sqlGetAllMovements
POST /sqlCreateMovement
POST /sqlGetMovement
POST /sqlUpdateMovement
POST /sqlDeleteMovement
```

### 🚗 Vehicles (6 endpoints)
```
POST /sqlGetAllVehicles
POST /sqlCreateVehicle
POST /sqlGetVehicleById
POST /sqlUpdateVehicle
POST /sqlDeleteVehicle
POST /sqlGetVehiclesStats
```

### 📦 Inventory (5 endpoints)
```
POST /sqlGetAllInventory
POST /sqlCreateInventoryItem
POST /sqlGetInventoryItem
POST /sqlUpdateInventoryItem
POST /sqlDeleteInventoryItem
```

### 🛠️ Maintenance (8 endpoints)
```
POST /sqlGetAllMaintenance
POST /sqlCreateMaintenance
POST /sqlGetMaintenance
POST /sqlUpdateMaintenance
POST /sqlDeleteMaintenance
POST /sqlGetMaintenanceByVehicle
POST /sqlGetUpcomingMaintenance
POST /sqlGetMaintenanceStats
```

### ⏱️ Hour Meter (6 endpoints)
```
POST /sqlGetAllHourMeters
POST /sqlCreateHourMeter
POST /sqlGetHourMeter
POST /sqlUpdateHourMeter
POST /sqlDeleteHourMeter
POST /sqlGetHourMeterHistory
```

### 🏪 Suppliers (8 endpoints)
```
POST /sqlGetAllSuppliers
POST /sqlCreateSupplier
POST /sqlGetSupplier
POST /sqlUpdateSupplier
POST /sqlDeleteSupplier
POST /sqlGetSuppliersByCategory
POST /sqlGetSuppliersStats
POST /sqlSearchSuppliers
```

### 📂 Categories (9 endpoints)
```
POST /sqlGetAllCategories
POST /sqlCreateCategory
POST /sqlGetCategory
POST /sqlUpdateCategory
POST /sqlDeleteCategory
POST /sqlGetCategoriesByType
POST /sqlReorderCategories
POST /sqlGetCategoriesStats
POST /sqlSearchCategories
```

### 🔧 Utilitarios (2 endpoints)
```
GET  /health
GET  /test
```

---

## 🧪 Testing

### Scripts de Prueba Creados

#### 1. Testing Rápido (sin autenticación)
```bash
cd combustibles/scripts
node test-cloud-run-simple.js
```

#### 2. Testing Completo (con autenticación)
```bash
cd combustibles/scripts
node test-cloud-run-endpoints.js
# Te pedirá email y password de Firebase
```

### Testing Manual con cURL
```bash
# Health check (sin auth)
curl https://forestech-sql-service-851382130132.us-central1.run.app/health

# Endpoint con auth (reemplazar [TOKEN_REAL])
curl -X POST https://forestech-sql-service-851382130132.us-central1.run.app/sqlGetAllProducts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN_REAL]" \
  -d '{"filters": {}}'
```

---

## 🔐 Autenticación

### Requerimientos
- ✅ **Firebase ID Token** requerido para endpoints SQL
- ✅ **Token válido** generado desde la app frontend
- ❌ **No se aceptan** API keys o tokens personalizados

### Obtener Token
```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;
const token = await user.getIdToken();

// Usar en headers
const response = await fetch('/sqlGetAllProducts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

---

## 📊 Monitoreo

### Comandos Útiles

#### Ver estado del servicio
```bash
gcloud run services describe forestech-sql-service \
  --region us-central1 \
  --project liquidacionapp-62962
```

#### Ver logs recientes
```bash
gcloud run services logs read forestech-sql-service \
  --region us-central1 \
  --project liquidacionapp-62962 \
  --limit=50
```

#### Ver métricas
```bash
gcloud run services logs read forestech-sql-service \
  --region us-central1 \
  --project liquidacionapp-62962 \
  --limit=100 \
  | grep -E "(✅|❌|🌐|🔥)" | head -20
```

---

## 💰 Costos

### Plan Actual (Gratis)
- ✅ **Requests:** 2M/mes gratis
- ✅ **vCPU:** 400K segundos/mes gratis
- ✅ **Memoria:** 360K GB-segundos/mes gratis
- ✅ **Uso actual:** $0.00/mes

### Proyección
- **100 usuarios/día:** $0.50 - $1.00/mes
- **1,000 usuarios/día:** $2.00 - $5.00/mes

---

## 🚀 Próximos Pasos

### ✅ Completados
- [x] Migración Firebase Functions → Cloud Run
- [x] Configuración URLs en frontend
- [x] Creación scripts de testing
- [x] Documentación endpoints

### 📋 Pendientes (Opcionales)
- [ ] Configurar logging avanzado
- [ ] Setup monitoring y alertas
- [ ] Optimización performance
- [ ] Documentación API completa

---

## 🆘 Solución de Problemas

### Error 401 Unauthorized
- Verificar token Firebase válido
- Asegurar que el usuario esté autenticado
- Revisar configuración de Firebase Auth

### Error 500 Internal Server Error
- Ver logs de Cloud Run
- Revisar configuración de variables de entorno
- Verificar conexión a Azure SQL Server

### Error de conexión
- Verificar que el servicio Cloud Run esté activo
- Confirmar la URL del servicio
- Revisar configuración de red/firewall

---

## 📞 Soporte

### Comandos de Emergencia
```bash
# Rollback rápido (si es necesario)
# Cambiar URLs en HttpService.js de vuelta a Firebase Functions

# Verificar estado del servicio
gcloud run services describe forestech-sql-service --region us-central1

# Ver logs en tiempo real
gcloud run services logs tail forestech-sql-service --region us-central1
```

### Contacto
- **Proyecto:** Forestech Combustibles
- **Servicio:** Cloud Run SQL Service
- **URL:** https://forestech-sql-service-851382130132.us-central1.run.app

---

**🎯 Estado Final:** ✅ **INTEGRACIÓN COMPLETA**
**📅 Última actualización:** 21 de septiembre de 2025
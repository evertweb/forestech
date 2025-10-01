# 📦 INVENTARIO DE SERVICIOS - COMBUSTIBLES

**Fecha:** 30 de septiembre de 2025  
**Total de servicios encontrados:** 44 archivos  
**Referencia:** [REFACTORIZACION_SEGUIMIENTO.md](./REFACTORIZACION_SEGUIMIENTO.md)

---

## 📊 RESUMEN EJECUTIVO

| Categoría | Cantidad | Acción |
|-----------|----------|--------|
| **Servicios Firebase (activos)** | 9 | ✅ MANTENER |
| **Servicios Legacy Firestore** | 8 | ❌ ELIMINAR (migrar a Firebase) |
| **Servicios SQL** | 3 | ❌ ELIMINAR |
| **Servicios de Migración** | 9 | ❌ ELIMINAR |
| **Servicios Base** | 4 | ✅ MANTENER |
| **Servicios Utilitarios** | 8 | 🔍 REVISAR |
| **Servicios de Auth** | 3 | ✅ MANTENER |

**Total a ELIMINAR:** ~20 archivos  
**Total a MANTENER:** ~24 archivos

---

## ✅ SERVICIOS A MANTENER (24 archivos)

### 1. Servicios Firebase Functions (9 archivos)
**Acción:** ✅ MANTENER - Son la base del backend

| Archivo | Propósito | Estado | Nota |
|---------|-----------|--------|------|
| `FirebaseMovementsService.js` | Movimientos | ✅ MANTENER | Simplificar tipos (solo ENTRADA/SALIDA) |
| `FirebaseInventoryService.js` | Inventario | ✅ MANTENER | - |
| `FirebaseVehiclesService.js` | Vehículos | ✅ MANTENER | Eliminar lógica de iconos |
| `FirebaseVehicleCategoriesService.js` | Categorías de vehículos | ✅ MANTENER | Simplificar campos personalizados |
| `FirebaseSuppliersService.js` | Proveedores | ✅ MANTENER | - |
| `FirebaseProductsService.js` | Productos (Combustibles) | ✅ MANTENER | Redefinir como tipos de combustibles |
| `FirebaseProductCategoriesService.js` | Categorías de productos | ✅ MANTENER | - |
| `FirebaseHourMeterService.js` | Horómetro | ✅ MANTENER | CRÍTICO |
| `FirebaseMaintenanceService.js` | Mantenimiento | ⚠️ COMENTAR | Para fase posterior |

### 2. Servicios Base (4 archivos)
**Acción:** ✅ MANTENER - Infraestructura core

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `base/BaseService.js` | Clase base | ✅ MANTENER |
| `base/CRUDService.js` | CRUD genérico | ✅ MANTENER |
| `base/HttpService.js` | HTTP client | ✅ MANTENER Y REFACTORIZAR |
| `base/FirebaseFunctionsService.js` | Firebase Functions wrapper | ✅ MANTENER |

### 3. Servicios de Autenticación (3 archivos)
**Acción:** ✅ MANTENER - Parte del core

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `firebasePasskeyService.js` | Passkeys | ✅ MANTENER |
| `firebaseFacialService.js` | Facial (Rekognition) | ✅ MANTENER |
| `simpleWebAuthnService.js` | WebAuthn helper | ✅ MANTENER |

### 4. Servicios Firebase Helpers (2 archivos)
**Acción:** ✅ MANTENER

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `firebase/userService.js` | Usuario Firebase | ✅ MANTENER |
| `firebase/invitationService.js` | Invitaciones | ✅ MANTENER |

### 5. Servicios Utilitarios CORE (6 archivos)
**Acción:** ✅ MANTENER

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `webhookService.js` | Notificaciones n8n/Telegram | ✅ MANTENER |
| `fuelPricesService.js` | Actualización de precios | ✅ MANTENER |
| `priceUpdateService.js` | Price update context | ✅ MANTENER |
| `backgroundImageService.js` | Imágenes de fondo | ✅ MANTENER |
| `firebaseErrorHandler.js` | Manejo de errores | ✅ MANTENER |
| `popupCommunication.js` | Popup communication | ✅ MANTENER |

---

## ❌ SERVICIOS A ELIMINAR (20 archivos)

### 1. Servicios Legacy Firestore (8 archivos)
**Razón:** Duplican funcionalidad de Firebase Functions  
**Acción:** Migrar componentes que los usan → Eliminar

| Archivo | Reemplazo | Prioridad |
|---------|-----------|-----------|
| `movementsService.js` | `FirebaseMovementsService.js` | 🔴 Alta |
| `inventoryService.js` | `FirebaseInventoryService.js` | 🔴 Alta |
| `vehiclesService.js` | `FirebaseVehiclesService.js` | 🔴 Alta |
| `vehicleCategoriesService.js` | `FirebaseVehicleCategoriesService.js` | 🔴 Alta |
| `suppliersService.js` | `FirebaseSuppliersService.js` | 🟡 Media |
| `productsService.js` | `FirebaseProductsService.js` | 🔴 Alta |
| `productCategoriesService.js` | `FirebaseProductCategoriesService.js` | 🟡 Media |
| `hourMeterService.js` | `FirebaseHourMeterService.js` | 🔴 Alta |
| `maintenanceService.js` | - | 🟢 Baja (posponer módulo) |

**Paso para eliminar:**
1. Buscar todos los imports de cada servicio
2. Reemplazar por servicio Firebase equivalente
3. Probar funcionalidad
4. Eliminar archivo

### 2. Servicios SQL (3 archivos)
**Razón:** Deprecated, ya no se usan  
**Acción:** ❌ ELIMINAR INMEDIATAMENTE

| Archivo | Estado |
|---------|--------|
| `base/SqlBaseService.js` | ❌ ELIMINAR |
| `base/SqlConnection.js` | ❌ ELIMINAR |
| `base/SqlCrudService.js` | ❌ ELIMINAR |

**Nota:** Cloud SQL se usa desde Firebase Functions en backend, no desde frontend.

### 3. Servicios de Migración (9 archivos)
**Razón:** Scripts temporales de migración, ya no necesarios  
**Acción:** ❌ ELIMINAR (conservar en branch backup)

| Archivo | Propósito | Eliminar |
|---------|-----------|----------|
| `migrationService.js` | Migración Firestore→SQL | ❌ SÍ |
| `realDataMigrationService.js` | Migración de datos reales | ❌ SÍ |
| `directMigrationService.js` | Migración directa | ❌ SÍ |
| `migrationManager.js` | Manager de migración | ❌ SÍ |
| `migrationManagerNew.js` | Manager nuevo | ❌ SÍ |
| `migrationValidator.js` | Validador migración | ❌ SÍ |
| `migration-example.js` | Ejemplo | ❌ SÍ |
| `aliasService.js` | Alias de migración | ❌ SÍ |
| `dataResetService.js` | Reset de datos (dev) | ⚠️ MOVER A /scripts |

### 4. Servicios de Utilidades Obsoletas
**Acción:** ❌ ELIMINAR o mover

| Archivo | Propósito | Acción |
|---------|-----------|--------|
| `resetVehicleCategoriesService.js` | Reset categorías | ❌ ELIMINAR |
| `fixInventoryAfterMovementDeletion.js` | Fix temporal | ❌ ELIMINAR |
| `verifyInventoryConsistency.js` | Verificación | ⚠️ MOVER A /scripts |
| `updateCapacitiesAdmin.js` | Update admin | ⚠️ MOVER A /scripts |

### 5. Servicios Dudosos / Revisar
**Acción:** 🔍 INVESTIGAR USO

| Archivo | Propósito | Acción |
|---------|-----------|--------|
| `externalMovementsService.js` | ¿Movimientos externos? | 🔍 VERIFICAR |
| `cardsService.js` | ¿Tarjetas? | 🔍 VERIFICAR |
| `locationsService.js` | Ubicaciones | 🔍 VERIFICAR si duplica inventario |
| `fileParsingService.js` | Parser de archivos | 🔍 VERIFICAR uso |
| `iconUploadService.jsx` | Upload iconos | ❌ ELIMINAR (no más iconos) |

---

## 📋 PLAN DE ACCIÓN

### Fase 1A: Eliminación Inmediata (1 día)
**Archivos obvios que NO se usan:**

```bash
# Servicios SQL (frontend)
rm src/services/base/SqlBaseService.js
rm src/services/base/SqlConnection.js
rm src/services/base/SqlCrudService.js

# Servicios de migración
rm src/services/migrationService.js
rm src/services/realDataMigrationService.js
rm src/services/directMigrationService.js
rm src/services/migrationManager.js
rm src/services/migrationManagerNew.js
rm src/services/migrationValidator.js
rm src/services/migration-example.js
rm src/services/aliasService.js

# Utilidades obsoletas
rm src/services/resetVehicleCategoriesService.js
rm src/services/fixInventoryAfterMovementDeletion.js
rm src/services/iconUploadService.jsx

# Total: 14 archivos eliminados
```

### Fase 1B: Migración de Servicios Legacy (3-4 días)
**Requiere cambiar imports en componentes:**

1. **Día 1:** Buscar y reemplazar imports de `movementsService` → `FirebaseMovementsService`
2. **Día 2:** Buscar y reemplazar imports de `vehiclesService` → `FirebaseVehiclesService`
3. **Día 3:** Buscar y reemplazar imports de `inventoryService` → `FirebaseInventoryService`
4. **Día 4:** Buscar y reemplazar resto (suppliers, products, hourMeter)

### Fase 1C: Investigación y Decisión (1 día)
**Archivos dudosos:**

- [ ] Investigar uso de `externalMovementsService.js`
- [ ] Investigar uso de `cardsService.js`
- [ ] Investigar uso de `locationsService.js`
- [ ] Investigar uso de `fileParsingService.js`
- [ ] Decidir qué hacer con cada uno

### Fase 1D: Limpieza Final (1 día)
- [ ] Eliminar servicios legacy después de migración
- [ ] Mover scripts a carpeta `/scripts`
- [ ] Actualizar imports rotos (si hay)
- [ ] Tests de regresión

---

## 🔍 ANÁLISIS DE DEPENDENCIAS

### ¿Qué componentes usan servicios legacy?

**Siguiente paso:** Ejecutar búsquedas para mapear dependencias:

```bash
# Buscar imports de servicios legacy
grep -r "from.*movementsService" src/components
grep -r "from.*vehiclesService" src/components
grep -r "from.*inventoryService" src/components
# etc.
```

Esto nos dirá exactamente qué componentes hay que actualizar.

---

## 📈 MÉTRICAS

### Antes
- **Total servicios:** 44 archivos
- **Duplicación:** ~60% (servicios legacy + Firebase)
- **Complejidad:** Alta

### Después (estimado)
- **Total servicios:** ~24 archivos (-45%)
- **Duplicación:** 0%
- **Complejidad:** Media

### Beneficios
- ✅ Menos archivos que mantener
- ✅ Un solo patrón (Firebase Functions)
- ✅ Código más limpio
- ✅ Más fácil de entender
- ✅ Menos bugs potenciales

---

## 🎯 PRÓXIMOS PASOS

1. **AHORA:** Validar este inventario
2. **Siguiente:** Ejecutar Fase 1A (eliminación inmediata)
3. **Después:** Buscar dependencias de servicios legacy
4. **Luego:** Ejecutar Fase 1B (migración)

---

**Última actualización:** 30 de septiembre de 2025  
**Responsable:** AI Assistant / Forestech Development Team



# SQL Services - Firebase Functions

## Overview
Este directorio contiene los servicios migrados de Azure SQL Server para la app Forestech Combustibles. La migración mueve la lógica de SQL del frontend a Firebase Functions para mantener la arquitectura React Frontend → Functions → Azure SQL.

### Estructura
- `config.js`: Configuración de conexión Azure SQL (server, database, user, password, options).
- `SqlConnection.js`: Clase singleton para conexión y operaciones básicas (query, execute, transaction).
- `movementsService.js`: Servicio para movimientos (CRUD + lógica de inventario).
- `testConnection.js`: Función de test para conexión SQL.

## Endpoints Disponibles (TASK-002: Movements)

Todos los endpoints son `onCall` functions, invocables desde frontend con `httpsCallable`.

### 1. `sqlCreateMovement`
- **Descripción:** Crea un nuevo movimiento con actualización automática de inventario.
- **Método:** POST (onCall)
- **Parámetros:** `{ movementData: { type, fuelType, quantity, unitPrice, vehicleId?, location?, destinationLocation?, description?, supplierName?, invoiceNumber?, purchaseOrderNumber? } }`
- **Autenticación:** Opcional (userInfo desde request.auth).
- **Respuesta:** `{ success: true, id, data }` o `{ success: false, error }`
- **Ejemplo de uso (frontend):**
  ```js
  const createMovement = httpsCallable(functions, 'sqlCreateMovement');
  const result = await createMovement({ movementData: { type: 'entrada', fuelType: 'GASOLINA', quantity: 100, unitPrice: 15000 } });
  ```
- **Lógica:** Valida datos, crea registro en `combustibles_movements`, actualiza `combustibles_inventory` en transacción.

### 2. `sqlGetAllMovements`
- **Descripción:** Obtiene lista de movimientos con filtros opcionales.
- **Método:** GET (onCall)
- **Parámetros:** `{ filters: { type?, status?, fuelType?, vehicleId? } }`
- **Respuesta:** `{ success: true, data: [], count }` o `{ success: false, error }`
- **Ejemplo:**
  ```js
  const getMovements = httpsCallable(functions, 'sqlGetAllMovements');
  const result = await getMovements({ filters: { type: 'entrada', fuelType: 'GASOLINA' } });
  ```
- **Lógica:** Query con WHERE dinámico, orden por createdAt DESC, timestamps en ISO.

### 3. `sqlUpdateMovement`
- **Descripción:** Actualiza un movimiento existente (recalcula totalValue si aplica).
- **Método:** PUT (onCall)
- **Parámetros:** `{ movementId, updateData: { quantity?, unitPrice?, description?, ... } }`
- **Autenticación:** Opcional.
- **Respuesta:** `{ success: true, id, rowsAffected }` o `{ success: false, error }`
- **Ejemplo:**
  ```js
  const updateMovement = httpsCallable(functions, 'sqlUpdateMovement');
  const result = await updateMovement({ movementId: '123', updateData: { quantity: 150 } });
  ```

### 4. `sqlDeleteMovement`
- **Descripción:** Elimina movimiento y revierte cambios en inventario.
- **Método:** DELETE (onCall)
- **Parámetros:** `{ movementId }`
- **Respuesta:** `{ success: true, message }` o `{ success: false, error }`
- **Ejemplo:**
  ```js
  const deleteMovement = httpsCallable(functions, 'sqlDeleteMovement');
  const result = await deleteMovement({ movementId: '123' });
  ```
- **Lógica:** Transacción para revertir inventario y hard delete.

## Testing
- **Local:** `firebase emulators:start --only functions` y llamar desde console.
- **Producción:** Firebase Console > Functions > Logs para monitoreo.
- **Verificación conexión:** Llamar `testSqlConnection()` desde console.

## Notas
- **Transacciones:** Todas las operaciones críticas usan transacciones mssql para atomicidad.
- **Errores:** Manejo robusto con try/catch, logs con prefijos (🚀, ✅, ❌).
- **Precisión:** Funciones preciseAdd/Subtract/Round para cálculos decimales.
- **Próximas migraciones:** Inventory, Vehicles, Suppliers (TASK-003+).

**Última actualización:** 20 septiembre 2025 - TASK-002 completada.
# 🔍 ANÁLISIS BUG MOVIMIENTOS TIPO ENTRADA

## ❌ Problema Reportado
Al crear movimientos tipo "entrada", algunos campos están enviando datos erróneos o valores NULL.

---

## 📊 DATOS QUE SE ENVÍAN EN UN MOVIMIENTO TIPO ENTRADA

### Campos OBLIGATORIOS ✅

```javascript
{
  type: 'entrada',                    // ✅ REQUERIDO: Tipo de movimiento
  fuelType: 'DIESEL',                 // ✅ REQUERIDO: Tipo de combustible (se normaliza a mayúsculas)
  quantity: 1000,                     // ✅ REQUERIDO: Cantidad en galones (debe ser > 0)
  unitPrice: 12500,                   // ✅ REQUERIDO: Precio por galón (debe ser >= 0)
  supplierName: 'Terpel S.A.',        // ✅ REQUERIDO: Nombre del proveedor
  destinationLocation: 'principal'    // ✅ REQUERIDO: Ubicación destino
}
```

### Campos OPCIONALES 🔵

```javascript
{
  invoiceNumber: 'FAC-2025-001',      // 🔵 OPCIONAL: Número de factura
  purchaseOrderNumber: 'PO-2025-100', // 🔵 OPCIONAL: Número de orden de compra
  description: 'Compra mensual',      // 🔵 OPCIONAL: Descripción del movimiento
  effectiveDate: '2025-10-07',        // 🔵 OPCIONAL: Fecha efectiva (por defecto: fecha actual)
  location: 'principal'               // 🔵 OPCIONAL: Ubicación origen (por defecto: 'principal')
}
```

### Campos que NO SE DEBEN ENVIAR ❌

```javascript
{
  vehicleId: 'xxx'  // ❌ NO enviar en entradas (solo para salidas/mantenimiento)
}
```

---

## 🗄️ TABLAS SQL SERVER REQUERIDAS

### 1. **combustibles_movements** (Tabla principal de movimientos)

```sql
CREATE TABLE combustibles_movements (
    -- Identificación
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    
    -- Datos del movimiento
    type NVARCHAR(50) NOT NULL,              -- 'entrada', 'salida', 'transferencia', etc.
    fuelType NVARCHAR(50) NOT NULL,          -- 'DIESEL', 'GASOLINA', etc.
    quantity DECIMAL(10, 2) NOT NULL,        -- Cantidad en galones
    unitPrice DECIMAL(10, 2) NOT NULL,       -- Precio por galón
    totalValue DECIMAL(15, 2),               -- Cantidad * unitPrice
    
    -- Ubicaciones
    location NVARCHAR(100),                  -- Ubicación origen (default: 'principal')
    destinationLocation NVARCHAR(100),       -- Ubicación destino (REQUERIDO para entradas)
    
    -- Información específica de ENTRADA
    supplierName NVARCHAR(255),              -- REQUERIDO para entradas
    invoiceNumber NVARCHAR(100),             -- Opcional
    purchaseOrderNumber NVARCHAR(100),       -- Opcional
    
    -- Información de salida/mantenimiento
    vehicleId NVARCHAR(100),                 -- Solo para salidas/mantenimiento
    
    -- Metadatos
    description NVARCHAR(MAX),               -- Descripción
    effectiveDate DATETIME2,                 -- Fecha efectiva
    status NVARCHAR(50),                     -- 'pendiente', 'completado', 'cancelado'
    
    -- Auditoría
    createdBy NVARCHAR(255),                 -- Email del usuario
    createdByUid NVARCHAR(255),              -- UID de Firebase
    createdByName NVARCHAR(255),             -- Nombre del usuario
    approvedBy NVARCHAR(255),                -- Usuario que aprobó
    approvedAt DATETIME2,                    -- Fecha de aprobación
    createdAt DATETIME2 DEFAULT GETDATE(),   -- Fecha de creación
    updatedAt DATETIME2 DEFAULT GETDATE()    -- Fecha de actualización
);
```

### 2. **combustibles_inventory** (Tabla de inventario)

```sql
CREATE TABLE combustibles_inventory (
    -- Identificación
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    
    -- Datos del inventario
    fuelType NVARCHAR(50) NOT NULL,          -- Tipo de combustible
    location NVARCHAR(100) NOT NULL,         -- Ubicación del tanque
    name NVARCHAR(255),                      -- Nombre del inventario
    
    -- Capacidades y niveles
    currentStock DECIMAL(10, 2) DEFAULT 0,   -- Stock actual
    maxCapacity DECIMAL(10, 2),              -- Capacidad máxima
    minThreshold DECIMAL(10, 2),             -- Umbral mínimo
    
    -- Precios
    pricePerUnit DECIMAL(10, 2),             -- Precio por unidad
    
    -- Estado
    status NVARCHAR(50) DEFAULT 'active',    -- 'active', 'inactive'
    
    -- Último movimiento
    lastMovementId NVARCHAR(255),            -- ID del último movimiento
    lastMovementType NVARCHAR(50),           -- Tipo del último movimiento
    lastMovementQuantity DECIMAL(10, 2),     -- Cantidad del último movimiento
    lastMovementDate DATETIME2,              -- Fecha del último movimiento
    
    -- Auditoría
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    
    -- Índice único por combustible y ubicación
    CONSTRAINT UQ_Inventory_FuelType_Location UNIQUE (fuelType, location)
);
```

### 3. **combustibles_vehicles** (Tabla de vehículos)

```sql
CREATE TABLE combustibles_vehicles (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    plate NVARCHAR(50) NOT NULL UNIQUE,
    vehicleType NVARCHAR(100),
    fuelType NVARCHAR(50),
    tankCapacity DECIMAL(10, 2),
    currentHourMeter DECIMAL(10, 2),
    categoryId NVARCHAR(255),
    categoryName NVARCHAR(255),
    status NVARCHAR(50) DEFAULT 'active',
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
```

---

## 🔄 FLUJO DE CREACIÓN DE MOVIMIENTO ENTRADA

### 1. **Frontend → Firebase Functions**

El frontend llama a la función Firebase:

```javascript
// combustibles/src/services/FirebaseMovementsService.js
const result = await httpsCallable(functions, 'combustiblesMovements')({
  action: 'create',
  data: {
    movementData: {
      type: 'entrada',
      fuelType: 'DIESEL',
      quantity: 1000,
      unitPrice: 12500,
      supplierName: 'Terpel S.A.',
      destinationLocation: 'principal',
      invoiceNumber: 'FAC-001',
      description: 'Compra mensual',
      createdBy: currentUser?.uid
    }
  }
});
```

### 2. **Firebase Functions → SQL Server**

La función `combustiblesMovements` procesa:

```javascript
// functions/src/sql/movementsService.js - createMovement()

// Paso 1: Validar datos requeridos
validateMovementData(movementData); // Verifica campos obligatorios

// Paso 2: Preparar objeto de movimiento
const movement = {
  type: movementData.type,
  fuelType: movementData.fuelType.toUpperCase(),  // Normaliza a mayúsculas
  quantity: preciseRound(movementData.quantity),
  unitPrice: preciseRound(movementData.unitPrice),
  totalValue: preciseRound(quantity * unitPrice),
  
  // Para ENTRADA
  supplierName: movementData.supplierName,
  destinationLocation: movementData.destinationLocation,
  invoiceNumber: movementData.invoiceNumber || null,
  
  // Ubicación origen
  location: movementData.location || 'principal',
  
  // Metadatos
  createdBy: userInfo?.email || 'unknown',
  createdByUid: userInfo?.uid || null,
  status: 'completed',
  approvedBy: userInfo?.email || 'system',
  approvedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
};

// Paso 3: Insertar en SQL Server
const result = await sqlConnection.transaction(async (transaction) => {
  // 3a. Insertar movimiento
  const insertQuery = `
    INSERT INTO combustibles_movements (...)
    OUTPUT INSERTED.*
    VALUES (...);
  `;
  
  // 3b. Actualizar inventario
  await updateInventoryFromMovement(transaction, movement, movementId);
});
```

### 3. **Actualización de Inventario**

Cuando se crea una ENTRADA:

```javascript
// Buscar inventario existente
const inventory = await findInventory({
  fuelType: 'DIESEL',
  location: 'principal'  // Usa destinationLocation
});

if (inventory existe) {
  // Sumar al stock existente
  newStock = currentStock + quantity;
  UPDATE combustibles_inventory SET currentStock = newStock;
} else {
  // Crear nuevo inventario automáticamente
  INSERT INTO combustibles_inventory (
    fuelType: 'DIESEL',
    location: 'principal',
    currentStock: 1000,
    maxCapacity: 1000,
    status: 'active'
  );
}
```

---

## 🐛 POSIBLES CAUSAS DEL BUG

### 1. **Campos NULL en `supplierName`**

**Causa:**
- Frontend no está enviando `supplierName` en el payload
- El componente de formulario no captura el campo correctamente

**Verificar en:**
- `combustibles/src/components/Movements/MovementWizard.jsx`
- `combustibles/src/components/Movements/WizardSteps/*`

### 2. **Campos NULL en `destinationLocation`**

**Causa:**
- Frontend envía `location` en lugar de `destinationLocation`
- Confusión entre ubicación origen y destino

**Verificar en:**
- El wizard de movimientos debe tener un campo para `destinationLocation`

### 3. **`vehicleId` enviado en entradas**

**Causa:**
- El formulario siempre envía `vehicleId` aunque no sea necesario
- Esto causa validación incorrecta

**Solución:**
- Asegurar que `vehicleId` NO se envíe en movimientos tipo ENTRADA

### 4. **`unitPrice` o `totalValue` con valor 0 o NULL**

**Causa:**
- Campo de precio no se está capturando
- Cálculo de `totalValue` incorrecto

**Verificar:**
- Que el campo de precio esté visible y funcional en el form
- Que el cálculo `quantity * unitPrice` se haga correctamente

---

## 🔍 PASOS DE DIAGNÓSTICO

### Paso 1: Ejecutar Script SQL de Diagnóstico

```bash
# Conectarse a SQL Server y ejecutar:
sqlcmd -S 24.199.89.134,1433 -d DBforestech -U sa -P <PASSWORD> -i diagnose-movements-bug.sql
```

El script generado verificará:
- ✅ Existencia de tablas requeridas
- 📊 Columnas y tipos de datos
- 🔍 Últimos movimientos tipo ENTRADA
- ❌ Campos con valores NULL
- 📦 Estado actual del inventario

### Paso 2: Verificar Frontend - Wizard de Movimientos

Buscar en:
```javascript
// combustibles/src/components/Movements/MovementWizard.jsx
// combustibles/src/components/Movements/WizardSteps/Step2_EntryDetails.jsx
```

Verificar que el form capture:
- ✅ `supplierName` (input de proveedor)
- ✅ `destinationLocation` (select de ubicación)
- ✅ `unitPrice` (input de precio)
- ✅ `quantity` (input de cantidad)
- ❌ `vehicleId` NO debe aparecer en entradas

### Paso 3: Verificar Payload Enviado

Agregar logs en:
```javascript
// combustibles/src/services/FirebaseMovementsService.js
console.log('📤 Payload enviado a Functions:', JSON.stringify(payload, null, 2));
```

### Paso 4: Verificar Logs de Firebase Functions

```bash
firebase functions:log --only combustiblesMovements
```

Buscar:
- 🔍 "CREATE MOVEMENT - START"
- ❌ Errores de validación
- 🔍 "Prepared movement object"

---

## 🚀 RECOMENDACIONES

### 1. **Ejecutar el script SQL primero**
```bash
# Este script te dirá exactamente qué columnas tienen NULL
sqlcmd -S 24.199.89.134,1433 -d DBforestech -U sa -i diagnose-movements-bug.sql
```

### 2. **Verificar el componente del wizard**
```bash
# Buscar el step de entrada
cat combustibles/src/components/Movements/WizardSteps/Step2_EntryDetails.jsx
```

### 3. **Agregar validación estricta en frontend**
```javascript
// Antes de enviar a Firebase
if (movementData.type === 'entrada') {
  if (!movementData.supplierName) {
    throw new Error('El proveedor es obligatorio para entradas');
  }
  if (!movementData.destinationLocation) {
    throw new Error('La ubicación destino es obligatoria para entradas');
  }
  // NO enviar vehicleId en entradas
  delete movementData.vehicleId;
}
```

### 4. **Revisar logs recientes**
```bash
# Ver últimos movimientos creados
firebase functions:log --only combustiblesMovements --limit 50
```

---

## 📝 PRÓXIMOS PASOS

1. **Ejecutar script SQL de diagnóstico** (ya creado: `diagnose-movements-bug.sql`)
2. **Revisar resultados** para identificar campos con NULL
3. **Verificar componente MovementWizard** en el frontend
4. **Corregir validaciones** según hallazgos
5. **Hacer prueba de movimiento** y verificar logs

---

## 📞 PARA MÁS AYUDA

Comparte conmigo:
- ✅ Resultados del script SQL
- ✅ Logs de Firebase Functions al crear un movimiento
- ✅ Screenshot del formulario de entrada
- ✅ Payload exacto que se está enviando

¡Con esa info puedo darte una solución exacta! 🎯

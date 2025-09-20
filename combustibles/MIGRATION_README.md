# 🚀 Migración Firestore → Azure SQL Server

## Descripción General

Esta guía documenta la migración completa de la aplicación **Forestech Combustibles** desde **Firestore** (Firebase) hacia **Azure SQL Server**. La migración mantiene la misma interfaz de servicios para una transición transparente.

## 📋 Estado del Proyecto

### ✅ Completado
- [x] Análisis de estructura actual de Firestore
- [x] Diseño de esquema SQL equivalente
- [x] Scripts SQL para crear tablas desde cero
- [x] Nueva capa de datos con conexión Azure SQL
- [x] Adaptadores de compatibilidad con servicios existentes
- [x] Ejemplo de migración (SqlMovementsService)

### 🔄 Pendiente
- [ ] Actualizar servicios restantes (vehicles, inventory, suppliers, etc.)
- [ ] Implementar pruebas de compatibilidad
- [ ] Actualizar configuración de conexión
- [ ] Despliegue en producción

## 🏗️ Arquitectura de la Solución

### Estructura de Archivos

```
combustibles/src/
├── config/
│   └── azureSqlConfig.js          # Configuración de conexión SQL
├── services/
│   ├── base/
│   │   ├── SqlConnection.js       # Conexión y operaciones básicas SQL
│   │   ├── SqlBaseService.js      # Clase base para servicios SQL
│   │   └── SqlCrudService.js      # Operaciones CRUD SQL
│   ├── SqlMovementsService.js     # Servicio de movimientos SQL
│   └── migration-example.js       # Ejemplos de migración
└── ...
```

### Componentes Principales

#### 1. **SqlConnection** (`SqlConnection.js`)
- Maneja la conexión a Azure SQL Server
- Pool de conexiones para rendimiento
- Manejo de errores y reconexión automática
- Soporte para transacciones

#### 2. **SqlBaseService** (`SqlBaseService.js`)
- Clase base para todos los servicios SQL
- Validación de datos
- Manejo de errores consistente
- Utilidades para construir consultas

#### 3. **SqlCrudService** (`SqlCrudService.js`)
- Implementa operaciones CRUD completas
- Compatible con interfaz Firestore
- Soporte para filtros, ordenamiento y paginación
- Transacciones SQL equivalentes

#### 4. **SqlMovementsService** (`SqlMovementsService.js`)
- Ejemplo completo de migración
- Mantiene la misma interfaz que el servicio original
- Lógica de negocio completa (inventario, validaciones, etc.)

## 📊 Esquema de Base de Datos

### Tablas Principales

| Tabla | Descripción | Campos Clave |
|-------|-------------|--------------|
| `combustibles_movements` | Movimientos de combustible | type, fuelType, quantity, vehicleId |
| `combustibles_inventory` | Inventario por ubicación | fuelType, location, currentStock |
| `combustibles_vehicles` | Flota de vehículos | vehicleId, fuelType, currentHourMeter |
| `combustibles_maintenance` | Registros de mantenimiento | vehicleId, type, hours |
| `combustibles_products` | Productos disponibles | code, name, category |
| `combustibles_suppliers` | Proveedores | name, taxId, fuelTypes |
| `combustibles_vehicle_categories` | Categorías de vehículos | name, type, icon |
| `product_categories` | Categorías de productos | name, parentId, level |

### Relaciones

```sql
-- Ejemplo de relaciones
combustibles_movements.vehicleId → combustibles_vehicles.vehicleId
combustibles_inventory.fuelType → combustibles_products.code
combustibles_vehicles.category → combustibles_vehicle_categories.id
```

## 🔧 Configuración

### Variables de Entorno

```bash
# .env.local
VITE_AZURE_SQL_SERVER=oilforestech.database.windows.net
VITE_AZURE_SQL_DATABASE=forestechCombus
VITE_AZURE_SQL_USER=oil
VITE_AZURE_SQL_PASSWORD=271202ev
```

### Dependencias Requeridas

```json
{
  "dependencies": {
    "mssql": "^10.0.1"
  }
}
```

## 🚀 Guía de Migración

### Paso 1: Instalar Dependencias

```bash
npm install mssql@^10.0.1
```

### Paso 2: Crear Base de Datos

Ejecutar los scripts SQL en Azure SQL Server:

```sql
-- Crear base de datos
CREATE DATABASE forestechCombus;
GO

USE forestechCombus;
GO

-- Ejecutar scripts de creación de tablas
-- [Copiar y pegar los CREATE TABLE statements]
```

### Paso 3: Configurar Conexión

Actualizar configuración en `azureSqlConfig.js` con tus credenciales.

### Paso 4: Migrar Servicios

#### Patrón de Migración

```javascript
// ❌ Servicio original (Firestore)
import { movementsService } from './movementsService.js';

// ✅ Servicio migrado (SQL)
import sqlMovementsService from './SqlMovementsService.js';

// Misma interfaz - solo cambiar import
const result = await sqlMovementsService.createMovement(data, userInfo);
```

#### Servicios a Migrar

1. **MovementsService** → `SqlMovementsService` ✅ (Completado)
2. **VehiclesService** → `SqlVehiclesService` 🔄 (Pendiente)
3. **InventoryService** → `SqlInventoryService` 🔄 (Pendiente)
4. **SuppliersService** → `SqlSuppliersService` 🔄 (Pendiente)
5. **ProductsService** → `SqlProductsService` 🔄 (Pendiente)

### Paso 5: Actualizar Componentes

```javascript
// En tus componentes React
import sqlMovementsService from '../services/SqlMovementsService.js';
// Reemplaza: import { movementsService } from '../services/movementsService.js';

// El resto del código permanece igual
const result = await sqlMovementsService.getAllMovements(filters);
```

## 🧪 Pruebas

### Pruebas de Compatibilidad

```javascript
// Archivo: src/services/__tests__/SqlMovementsService.test.js
import sqlMovementsService from '../SqlMovementsService.js';

describe('SqlMovementsService', () => {
  test('createMovement mantiene interfaz compatible', async () => {
    const movementData = {
      type: 'entrada',
      fuelType: 'DIESEL',
      quantity: 100,
      unitPrice: 1.5
    };

    const result = await sqlMovementsService.createMovement(movementData, {
      email: 'test@example.com'
    });

    expect(result.success).toBe(true);
    expect(result.id).toBeDefined();
  });
});
```

### Pruebas de Rendimiento

```javascript
// Comparar rendimiento Firestore vs SQL
const testPerformance = async () => {
  const start = Date.now();

  // SQL Query
  const sqlResult = await sqlMovementsService.getAllMovements({
    type: 'entrada',
    limit: 100
  });

  const sqlTime = Date.now() - start;
  console.log(`SQL Query: ${sqlTime}ms`);
};
```

## 📈 Beneficios de la Migración

### Técnicos
- ✅ **Consultas optimizadas**: SQL nativo vs NoSQL
- ✅ **ACID completo**: Transacciones consistentes
- ✅ **Relaciones nativas**: Joins eficientes
- ✅ **Índices avanzados**: Búsquedas complejas
- ✅ **Validaciones DB**: Constraints a nivel de base de datos

### Operativos
- ✅ **Costo potencialmente menor**: Azure SQL vs Firebase
- ✅ **Mejor control**: Backups y recuperación
- ✅ **Escalabilidad**: Horizontal y vertical
- ✅ **Monitoreo**: Azure Monitor integration
- ✅ **Integración**: Con herramientas Microsoft

### Desarrollo
- ✅ **Interfaz compatible**: Migración transparente
- ✅ **Debugging mejorado**: Queries SQL legibles
- ✅ **Transacciones robustas**: Rollbacks automáticos
- ✅ **Stored procedures**: Lógica compleja en DB
- ✅ **Tipos de datos**: Mejor definición de esquemas

## 🔄 Estrategia de Migración

### Fases Recomendadas

1. **Fase 1: Base de Datos** ✅
   - Crear tablas SQL
   - Configurar conexión
   - Probar conectividad

2. **Fase 2: Servicios Core** 🔄
   - Migrar MovementsService
   - Migrar InventoryService
   - Probar integración

3. **Fase 3: Servicios Adicionales** ⏳
   - Migrar VehiclesService
   - Migrar SuppliersService
   - Migrar ProductsService

4. **Fase 4: Optimización** ⏳
   - Crear índices adicionales
   - Implementar stored procedures
   - Optimizar queries

5. **Fase 5: Producción** ⏳
   - Despliegue gradual
   - Monitoreo de rendimiento
   - Plan de rollback

### Plan de Contingencia

- **Rollback**: Mantener servicios Firestore como backup
- **Paralelo**: Ejecutar ambos sistemas durante transición
- **Gradual**: Migrar usuarios/modulos progresivamente
- **Monitoreo**: Alertas automáticas por degradación

## 📞 Soporte

Para preguntas sobre la migración:

1. Revisar `migration-example.js` para ejemplos de uso
2. Verificar logs de conexión en `SqlConnection.js`
3. Consultar documentación de Azure SQL Server
4. Revisar issues en el repositorio del proyecto

## 🎯 Próximos Pasos

1. **Completar migración de servicios restantes**
2. **Implementar pruebas automatizadas**
3. **Configurar CI/CD para despliegue**
4. **Documentar procedimientos de mantenimiento**
5. **Entrenar equipo en nueva arquitectura**

---

**Estado**: 🚧 En Desarrollo
**Última actualización**: Diciembre 2024
**Versión**: 1.0.0
# 🔧 PROMPT PARA IMPLEMENTAR TAREA 4 - MÓDULO MANTENIMIENTO

## 📋 **CONTEXTO DEL PROYECTO**

Estás trabajando en **Forestech Combustibles**, un sistema de gestión de combustibles para empresa forestal. El proyecto está en **95% completado** y necesitas implementar el **último módulo principal: MANTENIMIENTO**.

## 📖 **ARCHIVOS CLAVE PARA LEER PRIMERO**

### 1. **Documentación Principal**
```bash
# Lee estos archivos en orden para entender el contexto completo:
git show HEAD:CLAUDE.md                                    # Documentación principal y estado actual
git show HEAD:docs/combustibles/README.md                 # Documentación específica combustibles
```

### 2. **Estructura del Proyecto**
```bash
# Para entender la arquitectura del monorepo:
git show HEAD:package.json                               # Scripts y configuración principal
git show HEAD:firebase.json                             # Configuración Firebase multi-app
git show HEAD:combustibles/package.json                 # Dependencias módulo combustibles
```

### 3. **Patrones de Implementación Existentes** 
```bash
# Estudia estos módulos para seguir los mismos patrones:

# MÓDULO VEHÍCULOS (referencia principal - recién actualizado TAREA 3):
git show HEAD:combustibles/src/services/vehiclesService.js        # Servicio completo con CRUD
git show HEAD:combustibles/src/components/Vehicles/VehiclesMain.jsx
git show HEAD:combustibles/src/components/Vehicles/VehicleModal.jsx  # Modal con múltiples secciones
git show HEAD:combustibles/src/components/Vehicles/Vehicles.css

# MÓDULO PROVEEDORES (referencia de estructura completa):
git show HEAD:combustibles/src/services/suppliersService.js
git show HEAD:combustibles/src/components/Suppliers/SuppliersMain.jsx
git show HEAD:combustibles/src/components/Suppliers/SupplierModal.jsx

# MÓDULO PRODUCTOS (referencia de sistema dinámico):
git show HEAD:combustibles/src/services/productsService.js
git show HEAD:combustibles/src/components/Products/ProductsMain.jsx
```

### 4. **Configuración Firebase y Servicios Base**
```bash
git show HEAD:combustibles/src/firebase/config.js              # Configuración Firebase
git show HEAD:combustibles/src/services/authService.js         # Patrones autenticación
git show HEAD:combustibles/src/utils/calculations.js           # Funciones utilitarias centralizadas
```

### 5. **Sistema de Permisos y Navegación**
```bash
git show HEAD:combustibles/src/components/Dashboard/Dashboard.jsx  # Integración navegación
git show HEAD:combustibles/src/hooks/useAuth.js                   # Sistema permisos
```

## 🎯 **ESPECIFICACIONES EXACTAS TAREA 4**

### **MÓDULO MANTENIMIENTO REQUERIDO:**

**Funcionalidad Principal:**
- Pestaña "Mantenimiento" en navegación principal
- **Sección Cambios de Aceite** con las columnas:
  - Fecha de cambio
  - Tractor u automóvil (dropdown vehículos)
  - Cantidad (galones aceite)
  - Horómetro de cambio (lectura actual)
  - Próximo cambio (calculado automáticamente)
  - Filtros o extras (textarea opcional)
- **Sección Cambios/Adquisición de Baterías**
  - Fecha
  - Vehículo
  - Tipo batería
  - Marca/modelo
  - Costo
  - Estado (nueva/usada/reparada)

### **Patrones Técnicos a Seguir:**

1. **Estructura de Archivos** (basada en módulos existentes):
```
combustibles/src/
├── components/Maintenance/
│   ├── MaintenanceMain.jsx          # Componente principal con tabs
│   ├── OilChangeSection.jsx         # Sección cambios aceite
│   ├── BatterySection.jsx           # Sección baterías
│   ├── MaintenanceModal.jsx         # Modal crear/editar
│   ├── MaintenanceStats.jsx         # Estadísticas
│   ├── MaintenanceFilters.jsx       # Filtros avanzados
│   └── Maintenance.css              # Estilos completos
├── services/
│   └── maintenanceService.js        # CRUD Firebase completo
```

2. **Integración Horómetro Tractores:**
   - Usar funciones existentes: `updateHourMeter()`, `getHourMeterHistory()`
   - Integrar con tractores TR1, TR2, TR3 (ya implementados)
   - Calcular próximo cambio: aceite cada 250 horas, filtros cada 500 horas

3. **Sistema de Permisos:**
   - Usar `canManageMaintenance` (patrón existente)
   - Roles: admin, supervisor pueden crear/editar
   - Operadores solo pueden ver

## 🔧 **ESPECIFICACIONES TÉCNICAS**

### **Campos del Modelo Mantenimiento:**
```javascript
// Cambio de Aceite
{
  id: string,
  type: 'oil_change',
  vehicleId: string,          // ID del vehículo
  vehicleName: string,        // Nombre para display
  date: timestamp,            // Fecha del cambio
  quantity: number,           // Galones aceite
  currentHours: number,       // Lectura horómetro actual
  nextChangeHours: number,    // Próximo cambio (actual + 250)
  filters: string,            // Filtros o extras opcional
  notes: string,              // Notas adicionales
  cost: number,               // Costo opcional
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string
}

// Cambio de Batería
{
  id: string,
  type: 'battery_change',
  vehicleId: string,
  vehicleName: string,
  date: timestamp,
  batteryType: string,        // Tipo de batería
  brand: string,              // Marca
  model: string,              // Modelo
  cost: number,               // Costo
  status: 'nueva' | 'usada' | 'reparada',
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: string
}
```

### **Funciones del Servicio Requeridas:**
```javascript
// maintenanceService.js
export const createMaintenanceRecord = async (data) => {...}
export const getAllMaintenanceRecords = async (filters) => {...}
export const updateMaintenanceRecord = async (id, data) => {...}
export const deleteMaintenanceRecord = async (id) => {...}
export const getMaintenanceByVehicle = async (vehicleId) => {...}
export const getUpcomingMaintenance = async () => {...}        // Próximos cambios
export const getMaintenanceStats = async (filters) => {...}
export const subscribeToMaintenance = (callback, filters) => {...}
```

## 🎨 **PATRONES DE DISEÑO**

### **Seguir UI/UX de Módulos Existentes:**
1. **Navegación:** Pestaña igual a "Vehículos", "Productos", etc.
2. **Layout:** Header con estadísticas + filtros + tabla/cards
3. **Modal:** Múltiples secciones con preview tiempo real
4. **Colores:** Tema verde forestal (#2d5a2d, #52c41a)
5. **Responsive:** Mobile-first design

### **Estados y Validaciones:**
- Validar horómetro: solo incrementales, no menor a actual
- Validar fechas: no futuras
- Calcular automáticamente próximos cambios
- Alertas visuales para mantenimientos vencidos

## 📊 **INTEGRACIÓN CON SISTEMA EXISTENTE**

### **Dashboard Principal:**
- Agregar widget "Próximos Mantenimientos"
- Mostrar alertas vehículos con mantenimiento vencido
- Estadísticas: total mantenimientos mes, costo promedio

### **Módulo Vehículos:**
- Mostrar último mantenimiento en detalles vehículo
- Alertas visuales para mantenimiento debido
- Historial completo de mantenimientos

### **Sistema de Reportes (futuro):**
- Preparar datos para reportes de costo mantenimiento
- Métricas de eficiencia por vehículo
- Proyecciones de gastos mantenimiento

## 🔍 **COMANDOS ÚTILES PARA DEBUGGING**

```bash
# Desarrollo local
npm run dev:combustibles        # Puerto 5174

# Testing
npm run lint:combustibles      # Verificar código
npm run build:combustibles     # Build para producción

# Base de datos
# Colección Firebase: 'combustibles_maintenance'
# Usar transacciones para operaciones críticas

# Git
git log --oneline -10          # Ver commits recientes
git show HEAD^                 # Ver último commit completo
```

## ✅ **CRITERIOS DE COMPLETITUD**

### **Funcionalmente Completo Cuando:**
1. ✅ Pestaña "Mantenimiento" funcional en navegación
2. ✅ CRUD completo para cambios aceite y baterías
3. ✅ Integración con horómetro tractores TR1, TR2, TR3
4. ✅ Cálculo automático próximos cambios (250h aceite)
5. ✅ Modal avanzado con validaciones robustas
6. ✅ Estadísticas y filtros funcionando
7. ✅ Sistema de permisos implementado
8. ✅ Responsive design mobile-first
9. ✅ Lint sin errores críticos
10. ✅ Build exitoso para producción

### **Archivos Esperados Nuevos:**
- `maintenanceService.js` (~600 líneas)
- `MaintenanceMain.jsx` (~400 líneas)
- `MaintenanceModal.jsx` (~500 líneas)
- `MaintenanceStats.jsx` (~250 líneas)
- `Maintenance.css` (~800 líneas)
- Total estimado: ~2,550 líneas nuevas

## 🚀 **PRÓXIMO PASO DESPUÉS TAREA 4**

Una vez completada TAREA 4, el sistema estará **98% terminado**. Solo faltará:
- **MÓDULO REPORTES**: Integrar todos los datos para reportes completos
- **OPTIMIZACIONES FINALES**: Performance, caching, etc.

---

**📌 IMPORTANTE:** Sigue EXACTAMENTE los patrones existentes. El proyecto tiene una arquitectura sólida y consistente. No inventes nuevos patrones, reutiliza lo que ya funciona.
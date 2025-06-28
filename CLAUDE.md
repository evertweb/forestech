# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) cuando trabaja con código en este repositorio.

## 🎯 **SELECTOR DE PROYECTO - IMPORTANTE**

**AL INICIAR CADA SESIÓN, CLAUDE DEBE PREGUNTAR:**
```
🔍 ¿En qué proyecto de Forestech trabajamos hoy?

🍽️  1. ALIMENTACION - App de liquidaciones de comidas
⛽  2. COMBUSTIBLES - App de gestión de combustibles  
🔧  3. SHARED - Recursos compartidos entre apps
📋  4. GENERAL - Configuración global del monorepo

Responde con el número (1-4) para establecer el contexto correcto.
```

**CONTEXTOS DE TRABAJO:**
- **[ALIMENTACION]**: Archivos en `forestech/alimentacion/src/...`
- **[COMBUSTIBLES]**: Archivos en `forestech/combustibles/src/...` 
- **[SHARED]**: Archivos en `forestech/shared/...`
- **[GENERAL]**: Configuración Firebase, hosting, documentación

## 📚 Documentación Modular

La documentación completa está organizada en módulos para mejor rendimiento:

### 🍽️ **ALIMENTACION** 
📖 **[Ver docs/alimentacion/](./docs/alimentacion/README.md)**
- Sistema de liquidaciones completamente funcional
- Firebase Analytics + FCM + Sistema roles
- Panel admin con invitaciones + notificaciones automáticas
- URL: https://forestechdecolombia.com.co/alimentacion/

### ⛽ **COMBUSTIBLES**
📖 **[Ver docs/combustibles/](./docs/combustibles/README.md)**
- **SISTEMA 83% COMPLETADO** (5/6 módulos) - Enero 2025
- ✅ Inventario, Movimientos, Vehículos, Proveedores, Auth/Admin
- ❌ Pendiente: Módulo Reportes (última funcionalidad)
- URL: https://forestechdecolombia.com.co/combustibles/

### 🔧 **SHARED**
📖 **[Ver docs/shared/](./docs/shared/README.md)**
- Firebase compartido entre apps
- Sistema roles y permisos unificado
- Componentes UI reutilizables (planificado)

### 📋 **GENERAL**
📖 **[Ver docs/general/](./docs/general/README.md)**
- Configuración monorepo completa
- Multi-app Firebase hosting
- Scripts desarrollo y deploy

## Estructura Monorepo

```
forestech/                      # Monorepo principal
├── alimentacion/               # 🍽️ App liquidaciones ✅ FUNCIONAL
├── combustibles/               # ⛽ App combustibles 🔄 EN DESARROLLO
├── shared/                     # 🔧 Recursos compartidos
├── docs/                       # 📚 Documentación modular ✅ NUEVA
├── public/                     # 🌐 Build output Firebase
├── firebase.json               # Multi-app routing ✅
└── package.json               # Scripts monorepo ✅
```

## Comandos Esenciales

```bash
# Desarrollo
npm run dev:alimentacion    # Puerto 5173
npm run dev:combustibles    # Puerto 5174

# Build
npm run build:all           # Build ambas apps
npm run deploy              # Deploy Firebase

# Linting
npm run lint:alimentacion
npm run lint:combustibles
```

## URLs Activas

- 🍽️ **Alimentación**: https://forestechdecolombia.com.co/alimentacion/
- ⛽ **Combustibles**: https://forestechdecolombia.com.co/combustibles/
- 📋 **Firebase**: https://liquidacionapp-62962.web.app/

## 🚀 Mejores Prácticas Claude

### Flujo de Trabajo Obligatorio
1. **TodoWrite** para tareas complejas (3+ pasos)
2. **Búsqueda contexto** antes de implementar  
3. **Anuncio del plan** antes de ejecutar
4. **Verificación automática** (lint, build)
5. **Commit automático** con mensaje descriptivo

### Advertencias Críticas
- **NUNCA** crear usuarios Firebase Auth desde frontend
- **USAR** sistema invitaciones para nuevos usuarios
- **SEGUIR** patrones existentes del proyecto
- **EJECUTAR** lint/build antes de commits

### Comunicación Proactiva
```
🔄 Implementando: [descripción]
💡 Decisión técnica: Uso [patrón] porque [justificación]
📁 Archivos modificados: [lista]
✅ Verificaciones: lint ✅ build ✅
```

## 🔍 **PROTOCOLO SUPERVISIÓN GEMINI CLI**

### 📋 **Claude CLI como Supervisor**
**RESPONSABILIDADES:**
- **Análisis técnico** de cada implementación de Gemini CLI
- **Revisión de código** y mejores prácticas  
- **Evaluación de patrones** del proyecto
- **Implementación de mejoras** cuando sea necesario
- **Commits de supervisión** explicando cambios aplicados

### 🔄 **Flujo de Supervisión**
1. **Gemini CLI** hace cambios al proyecto
2. **Claude CLI** analiza la implementación 
3. **Evaluación técnica** con criterios:
   - Calidad técnica (/10)
   - Seguimiento de patrones (/10)
   - Performance (/10)
   - Mantenibilidad (/10)
4. **Implementar mejoras** si es necesario
5. **Commit supervisión** con mensaje: `refactor: Superviso trabajo Gemini CLI - [motivo específico]`

### 📊 **Criterios de Evaluación**
- ✅ **Aprobar**: Implementación correcta, sin cambios necesarios
- ⚠️ **Mejorar**: Implementación funcional, optimizaciones aplicadas  
- ❌ **Rehacer**: Implementación problemática, cambios mayores requeridos

### 🤝 **Protocolo de Commits**
```bash
# Formato commit de supervisión
git commit -m "refactor: Superviso trabajo Gemini CLI - [específica el motivo]

- Motivo del cambio: [explicación]
- Mejora aplicada: [descripción técnica] 
- Patrón seguido: [justificación]

Hecho con Claude CLI (supervisando Gemini CLI)"
```

## 📅 **REGISTRO DE IMPLEMENTACIONES RECIENTES**

### 🔥 **Enero 28, 2025 - Mejoras Combustibles**
**Commit:** `feat(combustibles): Implementar mejoras completas en vehículos y movimientos`

#### ✅ **Funcionalidades Implementadas:**
1. **Botón "Agregar Vehículo"** - Ahora visible para todos los roles permitidos
2. **Tipos de vehículos expandidos** - 16 categorías (motosierra, excavadora, etc.)
3. **Creación libre de tipos personalizados** - UI intuitiva con Enter/Escape
4. **Selector dinámico de vehículos** - Para movimientos de salida con dropdown

#### 🔧 **Correcciones Técnicas:**
- Permisos `userProfile?.role` en VehiclesMain y MovementsMain
- Integración completa con `getAllVehicles()` service
- UI optimizada con estados de carga y validaciones específicas
- Compatibilidad completa con funcionalidades existentes

#### 🌐 **URLs Actualizadas:**
- ⛽ **Combustibles**: https://forestechdecolombia.com.co/combustibles/ ✅ DESPLEGADO

### 🔧 **Enero 28, 2025 - Corrección Función Crítica**
**Commit:** `fix(combustibles): Implementar función crítica revertInventoryChanges`

#### ✅ **Problema Crítico Resuelto:**
- **Función `revertInventoryChanges`** completamente implementada en `movementsService.js:508-586`
- **Eliminación de movimientos completados** ahora funciona correctamente
- **Operaciones inversas seguras** para todos los tipos de movimiento (entrada, salida, ajuste, transferencia)
- **Prevención de stock negativo** con warnings automáticos y ajuste a 0
- **Registro de auditoría** con tipo 'reversion' y notas descriptivas

#### 🔧 **Mejoras Técnicas:**
- Lógica de reversión robusta con manejo de errores completo
- Validación de inventario antes de revertir cambios
- Logging detallado para debugging y auditoría
- Transacciones seguras con rollback automático en caso de error

#### 📊 **Verificaciones:**
- ✅ **Lint**: 5 warnings menores (no errores críticos)
- ✅ **Build**: Exitoso (61KB CSS + 922KB JS)
- ✅ **Funcionalidad**: Eliminación de movimientos completados operativa

### 🛡️ **Enero 28, 2025 - Validación de Stock en Tiempo Real**
**Commit:** `feat(combustibles): Implementar validación de stock en tiempo real para movimientos`

#### ✅ **Sistema de Validación Crítica:**
- **Validación tiempo real** para movimientos SALIDA y TRANSFERENCIA
- **Feedback visual inteligente** con advertencias específicas por escenario
- **Bloqueo preventivo** de movimientos sin stock suficiente
- **Integración robusta** con inventario existente

#### 🔧 **Funcionalidades Implementadas:**
- **Validación automática** al cambiar cantidad/ubicación/combustible
- **Advertencias visuales** cuando stock < requerido
- **Alertas de stock bajo** cuando queda < 20% después del movimiento
- **Detección de inventario faltante** por ubicación específica
- **Corrección de imports** y manejo de respuestas del servicio

#### 🚫 **Prevención de Errores:**
- **Stock insuficiente**: Muestra disponible vs solicitado
- **Sin inventario**: Detecta cuando no existe el combustible en ubicación
- **Validación crítica**: Impide envío de formulario con errores
- **Manejo robusto**: Respuestas del servicio con formato `{success, data}`

#### 📊 **Verificaciones:**
- ✅ **Lint**: Solo warnings menores de dependencias useEffect
- ✅ **Build**: Exitoso (61KB CSS + 923KB JS)
- ✅ **Funcionalidad**: Validación de stock operativa en tiempo real

### 🏪 **Enero 28, 2025 - MÓDULO PROVEEDORES COMPLETO**
**Commit:** `feat(combustibles): Implementar módulo Proveedores completo con integración total`

#### ✅ **SISTEMA PROVEEDORES 100% IMPLEMENTADO (4,232+ líneas):**
- **suppliersService.js** (650+ líneas) - CRUD completo Firebase con validaciones
- **SuppliersMain.jsx** (340+ líneas) - Componente principal con real-time
- **SuppliersStats.jsx** (200+ líneas) - Estadísticas avanzadas e insights
- **SuppliersFilters.jsx** (275+ líneas) - Filtros avanzados y búsqueda
- **SuppliersCards.jsx** (325+ líneas) - Vista tarjetas con acciones rápidas
- **SuppliersTable.jsx** (450+ líneas) - Vista tabla con ordenamiento
- **SupplierModal.jsx** (550+ líneas) - Modal crear/editar con 4 tabs
- **Suppliers.css** (1,500+ líneas) - Estilos completos y responsive

#### 🔧 **FUNCIONALIDADES AVANZADAS:**
- **Modal con 4 tabs**: Básico, Contacto, Productos, Comercial
- **Filtros inteligentes**: Estado, Categoría, Tipo combustible, Búsqueda
- **Vista dual**: Cards y tabla con ordenamiento por columnas
- **Estadísticas por categoría**: Tipo y rating con insights automáticos
- **Sistema de rating**: 1-5 estrellas con evaluaciones
- **Proveedores preferidos**: Con badges y marcado especial
- **Validación precios**: Por tipo de combustible
- **Acciones rápidas**: Llamar, email directo desde interfaz

#### 🔗 **INTEGRACIÓN COMPLETA:**
- ✅ **Dashboard principal** integrado con navegación
- ✅ **Sistema de permisos** `canManageSuppliers` implementado
- ✅ **Real-time Firebase** con `onSnapshot` automático
- ✅ **Exportación CSV** funcional con todos los datos
- ✅ **Responsive design** mobile-first

#### 📊 **ESTADO ACTUAL COMBUSTIBLES (83% COMPLETADO):**
- ✅ **Inventario** (100%) - CRUD completo con validaciones
- ✅ **Movimientos** (100%) - 4 tipos + validación stock tiempo real
- ✅ **Vehículos** (100%) - Gestión completa maquinaria forestal
- ✅ **Proveedores** (100%) - **RECIÉN COMPLETADO**
- ✅ **Auth/Admin** (100%) - Sistema invitaciones + permisos
- ❌ **Reportes** (0%) - **ÚNICO MÓDULO PENDIENTE PARA 100%**

### 🔧 **Enero 28, 2025 - Mejoras UX y Workflow (NUEVAS)**
**Commit:** `feat(combustibles): Mejorar UX - deshabilitar inventario directo, unificar combustibles, integrar proveedores`

#### ✅ **Mejoras de Experiencia de Usuario Implementadas:**
1. **Inventario: Solo lectura por diseño**
   - Deshabilitado botón "Agregar Combustible" en pestaña Inventario
   - Mensaje guía: "Los combustibles se agregan automáticamente desde Movimientos"
   - Estado vacío redirige a pestaña Movimientos para crear ENTRADA
   - **Justificación**: Workflow más intuitivo y control de inventario centralizado

2. **Formulario Movimientos: Combustibles optimizados**
   - Unificado "Diesel" y "ACPM" como "Diesel/ACPM 🚛" (mismo precio)
   - Eliminado duplicado que confundía a usuarios
   - Solo 3 tipos: Diesel/ACPM, Gasolina, Lubricante
   - **Beneficio**: Menos opciones, decisiones más claras

3. **Movimientos ENTRADA: Integración con Proveedores**
   - Campo "Ubicación" cambia a "Proveedor *" para tipo ENTRADA
   - Dropdown con proveedores activos: "🏪 {nombre} - {ciudad}"
   - Validación requerida: selección obligatoria de proveedor
   - Auto-reset al cambiar tipo de movimiento
   - **Resultado**: Trazabilidad completa desde compra hasta consumo

#### 🔧 **Archivos Modificados:**
- `combustibles/src/components/Inventory/InventoryMain.jsx` - UX solo lectura
- `combustibles/src/components/Movements/MovementModal.jsx` - Integración proveedores

#### 📊 **Impacto en Workflow:**
- ✅ **Flujo simplificado**: Inventario → Movimientos → Proveedores
- ✅ **Menos errores**: Validaciones específicas por tipo movimiento  
- ✅ **Mejor trazabilidad**: Cada entrada vinculada a proveedor específico
- ✅ **UX consistente**: Labels dinámicos según contexto

### 🔧 **Enero 28, 2025 - Sistema Centralizado de Cálculos**
**Commit:** `feat(combustibles): Implementar sistema centralizado calculations.js con integración completa`

#### ✅ **Archivo Calculations.js Creado:**
- **Ubicación**: `combustibles/src/utils/calculations.js` (480+ líneas)
- **25+ funciones matemáticas** centralizadas para toda la aplicación
- **6 categorías principales**: Inventario, Movimientos, Vehículos, Financiero, Proveedores, Utilidades

#### 🔧 **Funcionalidades Centralizadas:**
1. **📊 Cálculos de Inventario (6 funciones)**
   - `calculateTotalInventoryValue()` - Valor total del inventario
   - `calculateAvailableStock()` - Stock disponible por tipo
   - `calculateCapacityPercentage()` - Porcentaje de capacidad
   - `calculateLowStockAlerts()` - Alertas de stock bajo
   - `calculateInventoryStats()` - Estadísticas completas

2. **🔄 Cálculos de Movimientos (4 funciones)**
   - `validateStockAvailability()` - Validación robusta de stock
   - `calculateResultingStock()` - Stock resultante después de movimiento
   - `calculateMovementCosts()` - Análisis de costos
   - `calculateMovementsStats()` - Estadísticas generales

3. **🚜 Métricas de Vehículos (4 funciones)**
   - `calculateVehicleConsumption()` - Consumo promedio por vehículo
   - `calculateFuelEfficiency()` - Eficiencia de combustible
   - `calculateOperationalCosts()` - Costos operacionales
   - `calculateVehiclesStats()` - Estadísticas generales

4. **📈 Cálculos Financieros y Reportes (3 funciones)**
   - `calculatePeriodValue()` - Valor por período
   - `calculateLocationCosts()` - Costos por ubicación  
   - `calculateConsumptionProjections()` - Proyecciones de consumo

5. **🏪 Funciones para Módulo Proveedores (1 función)**
   - `calculatePriceComparisons()` - Comparación de precios

6. **🔧 Funciones Utilitarias (5 funciones)**
   - `formatCurrency()` - Formato moneda colombiana
   - `formatNumber()` - Formato números con separadores
   - `formatPercentage()` - Formato porcentajes
   - `isValidPositiveNumber()` - Validación números positivos

#### ✅ **Integración Completa en Componentes:**
1. **InventoryStats.jsx**
   - ✅ Reemplazado `formatCurrency` y `formatNumber` locales
   - ✅ Código más limpio y consistente

2. **MovementsStats.jsx** 
   - ✅ Reemplazado `formatCurrency` y `formatNumber` locales
   - ✅ Integración exitosa con utils centralizadas

3. **VehiclesStats.jsx**
   - ✅ Reemplazado `formatNumber` local
   - ✅ Mantiene funciones específicas de vehículos

4. **MovementModal.jsx** 
   - ✅ Integrada validación de stock con `validateStockAvailability()`
   - ✅ Reemplazado `formatCurrency` local  
   - ✅ Validación más robusta y centralizada

#### 🚀 **Beneficios Implementados:**
- ✅ **Mantenimiento simplificado** - Un solo lugar para cambios
- ✅ **Consistencia garantizada** - Mismos cálculos en toda la app
- ✅ **Testing facilitado** - Funciones aisladas y testeable
- ✅ **Preparación futura** - Lista para módulos Proveedores/Reportes
- ✅ **Eliminado código duplicado** en 4 componentes principales
- ✅ **Validación de stock mejorada** con lógica unificada

#### 📊 **Verificaciones:**
- ✅ **Lint**: 5 warnings menores (no relacionados con integración)
- ✅ **Build**: Exitoso (61KB CSS + 924KB JS)
- ✅ **Funcionalidad**: Sistema calculations integrado y operativo
- ✅ **Preparación**: Lista para módulos Proveedores y Reportes

---

**📌 IMPORTANTE**: Esta documentación modular mejora el rendimiento de Claude Code. Cada módulo contiene detalles específicos para evitar sobrecargar el contexto principal.
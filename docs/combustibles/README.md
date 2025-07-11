# ⛽ COMBUSTIBLES - Sistema de Gestión de Combustibles

## Estado Actual: 100% COMPLETADO Y OPERATIVO (2025)

**URL en producción**: https://forestechdecolombia.com.co/combustibles/  
**Estado**: Sistema completo funcionando en producción

## Descripción

Sistema integral de gestión y control de inventario de combustibles para equipos forestales de Forestech Colombia.

## Comandos de Desarrollo

```bash
cd combustibles
npm run dev         # Servidor desarrollo (puerto 5174)
npm run build       # Build producción
npm run lint        # ESLint
```

## Arquitectura

- **Frontend**: React 19 + Vite 7
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Charts**: Chart.js + react-chartjs-2
- **Tema**: Verde forestal responsive
- **Deploy**: Automático con GitHub Actions

## Funcionalidades Implementadas

### 🛢️ Gestión de Inventario
- CRUD completo de combustibles (Diésel, Gasolina, ACPM, Lubricantes)
- Alertas automáticas de stock bajo
- Seguimiento en tiempo real de niveles

### 📊 Control de Movimientos
- 4 tipos: Entrada, Salida, Transferencia, Ajuste
- Validación de stock en tiempo real
- Wizard guiado para creación de movimientos
- Integración automática con inventario

### 🚜 Gestión de Vehículos
- Catálogo completo de 25 vehículos específicos
- Sistema de horómetros para tractores (TR1, TR2, TR3)
- Seguimiento de consumo y eficiencia
- Estados operativos y de mantenimiento

### 📦 Productos Dinámicos
- 9 productos predefinidos (ACPM, Gasolina, Aceites, etc.)
- Integración con sistema de precios
- Categorización automática

### 🏪 Proveedores
- Base de datos completa de proveedores
- Sistema de evaluación y rating
- Integración con movimientos de entrada
- Exportación de datos CSV

### 🔧 Mantenimiento
- Programación de mantenimientos por vehículo
- Seguimiento de horómetros
- Alertas automáticas
- Historial completo

### 🔐 Autenticación y Administración
- Sistema de invitaciones con códigos únicos
- Roles granulares (Admin, Empleado, Cliente)
- Panel de administración completo
- Seguridad Firebase integrada

### 📈 **MÓDULO REPORTES COMPLETO** ⭐ **COMPLETADO**
- Dashboard ejecutivo con KPIs en tiempo real
- Reportes de inventario y alertas de stock
- Análisis de vehículos y consumo por horómetro
- Reportes financieros y proyecciones
- Exportación CSV/JSON y filtros avanzados

### 🔄 **SISTEMA DE MIGRACIÓN REDISEÑADO** ⭐ **EN DESARROLLO - 43% COMPLETADO**

**Estado actual**: Rediseño completo del sistema de migración de datos históricos

#### ✅ **Componentes Completados (6/14 tareas)**

**🔧 Servicios Base (100%)**
- `fileParsingService.js` - Parsing universal Excel/CSV con fuzzy matching
- `aliasService.js` - Gestión persistente de alias con Firebase integration
- `migrationManager.js` - Orquestador de 5 pasos del wizard

**🎯 Componentes UI (40%)**
- `MigrationWizard.jsx` - Componente principal unificado
- `Step1_FileUpload.jsx` - Carga drag & drop con preview automático
- `Step2_ColumnMapping.jsx` - Mapeo inteligente con validación visual
- `MigrationWizard.css` - Estilos modernos y responsivos

#### 🔄 **Funcionalidades Implementadas**

**Wizard de 5 Pasos:**
1. **✅ File Upload**: Drag & drop, preview automático, validaciones de formato
2. **✅ Column Mapping**: Mapeo inteligente, sugerencias automáticas, validación visual
3. **🔄 Value Mapping**: Sistema de alias dinámico (en desarrollo)
4. **⏳ Validation**: Dry run y validación integral
5. **⏳ Execution**: Ejecución en lotes con progreso en tiempo real

**Características Técnicas:**
- **Parsing inteligente**: Detección automática Excel (.xlsx, .xls) y CSV
- **Fuzzy matching**: Algoritmo Levenshtein para sugerencias de mapeo
- **Sistema de alias**: Mapeos persistentes "Camioneta Amarilla" → "CA-001"
- **UI moderna**: Responsive, drag & drop, validaciones en tiempo real
- **Validación progresiva**: Verificación en cada paso del wizard

#### 📋 **Tareas Pendientes (8/14)**

**Alta Prioridad:**
- Crear colección Firebase `combustibles_migration_aliases`
- Implementar `Step3_ValueMapping.jsx` - sistema de alias dinámico
- Desarrollar `Step4_Validation.jsx` - dry run y validación integral
- Crear `Step5_Execution.jsx` - ejecución en lotes segura
- Integrar wizard en Dashboard (reemplazar componentes obsoletos)
- Testing con archivos reales del Google Sheets "COMBUSTIBLE 2025"

**Media Prioridad:**
- Limpiar código obsoleto (DirectMigrationPanel, HistoricalDataMigration)

#### 📁 **Estructura de Archivos Nueva**

```
combustibles/src/
├── components/
│   └── MigrationWizard/           # ⭐ NUEVO - Sistema rediseñado
│       ├── MigrationWizard.jsx    # ✅ Componente principal
│       ├── MigrationWizard.css    # ✅ Estilos modernos
│       ├── index.js               # ✅ Exportaciones
│       └── steps/
│           ├── Step1_FileUpload.jsx      # ✅ Carga archivos
│           ├── Step2_ColumnMapping.jsx   # ✅ Mapeo columnas
│           ├── Step3_ValueMapping.jsx    # 🔄 Sistema alias
│           ├── Step4_Validation.jsx      # ⏳ Validación
│           └── Step5_Execution.jsx       # ⏳ Ejecución
└── services/
    ├── migrationManager.js        # ✅ Orquestador principal
    ├── aliasService.js           # ✅ Gestión alias Firebase
    └── fileParsingService.js     # ✅ Parsing universal
```

#### 🎯 **Próximo Objetivo**
Implementar `Step3_ValueMapping.jsx` para sistema de alias dinámico que permita mapear nombres descriptivos del Google Sheets a códigos del sistema.

## Estructura de Archivos

```
combustibles/
├── src/
│   ├── components/
│   │   ├── Dashboard/          # Dashboard principal
│   │   ├── Inventory/          # Gestión inventario
│   │   ├── Movements/          # Control movimientos
│   │   ├── Vehicles/           # Gestión vehículos
│   │   ├── Products/           # Productos dinámicos
│   │   ├── Suppliers/          # Proveedores
│   │   ├── Maintenance/        # Mantenimiento
│   │   └── Admin/              # Panel administración
│   ├── services/               # Servicios Firebase
│   ├── contexts/               # Context providers
│   └── constants/              # Constantes del sistema
```

## URLs Operativas

- **Producción**: https://forestechdecolombia.com.co/combustibles/
- **Firebase**: https://liquidacionapp-62962.web.app/combustibles/

## Integración con Monorepo

- Comparte Firebase con aplicación de alimentación
- Deploy automático con GitHub Actions
- Configuración multi-app en `firebase.json`
- Sistema de roles unificado

---

**Última actualización**: Julio 2025 - Sistema 100% operativo en producción
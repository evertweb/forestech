# 🎯 PROMPT PARA COMPLETAR FASE 2 - FORESTECH COMBUSTIBLES

## 📋 CONTEXTO ACTUAL

### 🔄 ESTADO GENERAL

- **Proyecto**: FORESTECH COMBUSTIBLES - Refactoring arquitectural
- **Rama actual**: `feature/retro-styles`
- **Última sesión**: Sesión 4 - 6 agosto 2025
- **Progreso Fase 2**: **78% completado**

### ✅ YA COMPLETADO (NO TOCAR)

- **Task 2.1**: BaseModal component system ✅ **100%** (6 modales críticos)
- **Task 2.2**: Sistema de validaciones ✅ **100%** (validators.js - 336 líneas)
- **Task 2.3**: PageLayout - **56%** (5 de 9 componentes)

### 🎯 COMPONENTES YA REFACTORIZADOS CON PAGELAYOUT

- ✅ ProductsMain.jsx (usa PageLayout correctamente)
- ✅ VehiclesMain.jsx (usa PageLayout correctamente)
- ✅ SuppliersMain.jsx (usa PageLayout correctamente - recién completado)
- ✅ MovementsMain.jsx (usa PageLayout correctamente)
- 🔄 InventoryMain.jsx (import PageLayout agregado, PENDIENTE refactoring JSX)
- 🔄 MaintenanceMain.jsx (import PageLayout agregado, PENDIENTE refactoring JSX)

### 🚨 COMPONENTES PENDIENTES (TASK 2.3)

**OBJETIVO**: Refactorizar estos 4 componentes Main para usar PageLayout

1. **InventoryMain.jsx** - ALTA PRIORIDAD (import ya agregado)
   - Archivo: `src/components/Inventory/InventoryMain.jsx`
   - Estado: Import PageLayout ✅ pero JSX pendiente
   - Acción: Convertir return JSX para usar `<PageLayout>`

2. **MaintenanceMain.jsx** - ALTA PRIORIDAD (import ya agregado)
   - Archivo: `src/components/Maintenance/MaintenanceMain.jsx`
   - Estado: Import PageLayout ✅ pero JSX pendiente
   - Acción: Convertir return JSX para usar `<PageLayout>`

3. **DashboardMain.jsx** - MEDIA PRIORIDAD
   - Archivo: `src/components/Dashboard/DashboardMain.jsx`
   - Estado: No tiene import ni uso de PageLayout
   - Acción: Agregar import + refactorizar JSX completo

4. **ReportsMain.jsx** - MEDIA PRIORIDAD
   - Archivo: `src/components/Reports/ReportsMain.jsx`
   - Estado: No tiene import ni uso de PageLayout
   - Acción: Agregar import + refactorizar JSX completo

5. **AdminMain.jsx** - BAJA PRIORIDAD
   - Archivo: `src/components/Admin/AdminMain.jsx`
   - Estado: No tiene import ni uso de PageLayout
   - Acción: Agregar import + refactorizar JSX completo

## 🎯 INSTRUCCIONES ESPECÍFICAS

### 📐 PATRÓN PAGELAYOUT ESTABLECIDO

**Referencia exacta** (usar SuppliersMain.jsx como modelo):

```jsx
import { PageLayout } from '../shared';

// En el componente, reemplazar todo el return con:
return (
  <PageLayout
    title="Título Principal del Módulo"
    subtitle="Descripción breve del módulo"
    actions={
      <div className="header-actions sap-theme">
        {/* Botones de acciones principales */}
        <button className="btn btn-primary">Agregar</button>
        <button className="btn btn-secondary">Exportar</button>
        {/* Toggle de vista si aplica */}
      </div>
    }
    stats={estadisticas && <ComponenteStats stats={estadisticas} />}
    filters={
      <ComponenteFilters
      // Props de filtros existentes
      />
    }
  >
    {/* Contenido principal (tablas, cards, etc.) */}
    {error && <ErrorComponent />}
    {loading ? <LoadingComponent /> : <MainContent />}
  </PageLayout>
);
```

### 🔧 PROCESO DE REFACTORING

1. **Para InventoryMain.jsx y MaintenanceMain.jsx** (import ya existe):
   - Leer archivo completo
   - Identificar JSX actual del return
   - Extraer: título, subtítulo, acciones, stats, filtros, contenido principal
   - Reemplazar return completo con patrón PageLayout
   - Validar con `npm run lint`

2. **Para DashboardMain.jsx, ReportsMain.jsx, AdminMain.jsx**:
   - Agregar import: `import { PageLayout } from '../shared';`
   - Seguir mismo proceso de refactoring JSX
   - Validar con `npm run lint`

### ⚡ REGLAS OBLIGATORIAS

1. **VALIDACIÓN CONTINUA**: Ejecutar `npm run lint` después de cada componente
2. **ZERO REGRESSIONS**: No romper funcionalidad existente
3. **MANTENER ESTILOS**: Preservar clases CSS `sap-theme` existentes
4. **SEGUIR PATRÓN**: Usar exactamente la estructura de SuppliersMain.jsx
5. **IMPORTAR COMPONENTES**: Mantener todos los imports de Stats/Filters/etc.

### 📊 VALIDACIÓN DE COMPLETITUD

Al terminar, verificar que **TODOS** estos archivos usen PageLayout:

- [x] ProductsMain.jsx ✅
- [x] VehiclesMain.jsx ✅
- [x] SuppliersMain.jsx ✅
- [x] MovementsMain.jsx ✅
- [ ] InventoryMain.jsx → **PENDIENTE**
- [ ] MaintenanceMain.jsx → **PENDIENTE**
- [ ] DashboardMain.jsx → **PENDIENTE**
- [ ] ReportsMain.jsx → **PENDIENTE**
- [ ] AdminMain.jsx → **PENDIENTE**

### 🎯 RESULTADO ESPERADO

Al completar exitosamente:

- **Task 2.3**: PageLayout → 100% (9/9 componentes)
- **FASE 2 TOTAL**: → 100% completada
- **Progreso general**: ~40% del refactoring total
- **Lint errors**: 0 errores
- **Funcionalidad**: 100% preservada

### 📝 COMANDO INICIAL

```bash
# Verificar estado actual
npm run lint

# Ver componentes con PageLayout
grep -r "import.*PageLayout" src/components/*/

# Ver componentes usando PageLayout en JSX
grep -r "<PageLayout" src/components/*/
```

## 🚀 PROMPT PARA COPILOT

\*\*"Hola! Necesito completar la Fase 2 del refactoring de FORESTECH COMBUSTIBLES. Tengo 5 componentes Main pendientes de refactorizar para usar PageLayout. Ya tengo establecido el patrón en SuppliersMain.jsx.

Los componentes pendientes son:

1. InventoryMain.jsx (import ya agregado, falta JSX)
2. MaintenanceMain.jsx (import ya agregado, falta JSX)
3. DashboardMain.jsx (falta import + JSX)
4. ReportsMain.jsx (falta import + JSX)
5. AdminMain.jsx (falta import + JSX)

Usa SuppliersMain.jsx como referencia exacta del patrón PageLayout. Refactoriza uno por uno, ejecuta npm run lint después de cada cambio, y mantén toda la funcionalidad existente. El objetivo es completar Task 2.3 al 100% (9/9 componentes con PageLayout)."\*\*

---

## 📊 MÉTRICAS FINALES ESPERADAS

- **Componentes refactorizados**: 9/9 ✅
- **Tiempo estimado**: 30-45 minutos
- **Lint errors**: 0 ❌
- **Funcionalidad preservada**: 100% ✅
- **FASE 2 COMPLETADA**: 100% 🎉

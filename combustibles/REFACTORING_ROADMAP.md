# 🚀 REFACTORING ROADMAP - COMBUSTIBLES APP

## 📋 **REGLAS FUNDAMENTALES PARA AGENTES IA**

### ⚡ **PRINCIPIOS OBLIGATORIOS**
1. **🔄 VALIDACIÓN FRECUENTE**: Después de cada subtarea, ejecutar `npm run lint` y `npm run typecheck`
2. **✅ MARCADO AUTOMÁTICO**: Al completar exitosamente una tarea, marcar checkbox como `[x]`
3. **🛑 STOP ON ERROR**: Si hay errores, NO continuar hasta resolverlos
4. **📝 DOCUMENTAR CAMBIOS**: Actualizar sección "Cambios Realizados" al completar cada tarea
5. **🧪 TESTING FIRST**: Crear/actualizar tests antes de refactorizar código crítico
6. **📊 MÉTRICAS**: Registrar líneas de código eliminadas/optimizadas

### 🎯 **WORKFLOW DE VALIDACIÓN**
```bash
# Después de cada subtarea:
1. npm run lint           # Verificar estilo de código
2. npm run typecheck      # Verificar tipos TypeScript
3. npm run test           # Ejecutar tests (si existen)
4. git status             # Verificar cambios
5. Marcar checkbox [x]    # Solo si todo pasa
```

---

## 📅 **CRONOGRAMA DE REFACTORIZACIÓN**

### 🌊 **FASE 1: FUNDAMENTOS (2 semanas)**
**Objetivo**: Establecer bases arquitecturales sólidas

#### **📝 TASK 1.1: Custom Hook useFormData**
**Tiempo estimado**: 2 días | **Prioridad**: CRÍTICA | **Impacto**: Alto
**Responsable**: Agent-FormData

**📂 Archivos a crear:**
- [ ] `src/hooks/useFormData.js` - Hook principal
- [ ] `src/hooks/__tests__/useFormData.test.js` - Tests unitarios

**🔧 Archivos a refactorizar (11 archivos con handleInputChange):**
- [ ] `src/components/Products/ProductModal.jsx`
- [ ] `src/components/Vehicles/VehicleModal.jsx`
- [ ] `src/components/Suppliers/SupplierModal.jsx`
- [ ] `src/components/Maintenance/MaintenanceModal.jsx`
- [ ] `src/components/Inventory/InventoryModal.jsx`
- [ ] `src/components/Categories/CategoryModal.jsx`
- [ ] `src/components/Users/UserModal.jsx`
- [ ] `src/components/Reports/ReportConfigModal.jsx`
- [ ] `src/components/Settings/SettingsModal.jsx`
- [ ] `src/components/Dashboard/QuickAddModal.jsx`
- [ ] `src/components/Movements/MovementModal.jsx`

**✅ Validaciones obligatorias:**
- [ ] Validar que 116 ocurrencias de `handleInputChange` se reduzcan a 1
- [ ] Verificar que todos los modales usen el nuevo hook
- [ ] Tests con 95%+ cobertura
- [ ] Zero errores de lint/typecheck

**📊 Métricas esperadas:**
- Líneas eliminadas: ~400-500
- Archivos optimizados: 11
- Duplicación reducida: 90%

---

#### **📝 TASK 1.2: BaseService para CRUD**
**Tiempo estimado**: 3 días | **Prioridad**: CRÍTICA | **Impacto**: Alto
**Responsable**: Agent-Services

**📂 Archivos a crear:**
- [ ] `src/services/base/BaseService.js` - Clase base
- [ ] `src/services/base/CRUDService.js` - Operaciones CRUD genéricas
- [ ] `src/services/base/__tests__/BaseService.test.js` - Tests

**🔧 Servicios a refactorizar (15+ servicios):**
- [ ] `src/services/suppliersService.js`
- [ ] `src/services/vehiclesService.js`
- [ ] `src/services/inventoryService.js`
- [ ] `src/services/productsService.js`
- [ ] `src/services/categoriesService.js`
- [ ] `src/services/maintenanceService.js`
- [ ] `src/services/movementsService.js`
- [ ] `src/services/usersService.js`
- [ ] `src/services/reportsService.js`
- [ ] `src/services/configService.js`
- [ ] `src/services/analyticsService.js`
- [ ] `src/services/notificationsService.js`
- [ ] `src/services/backupService.js`
- [ ] `src/services/auditService.js`
- [ ] `src/services/integrationService.js`

**✅ Validaciones obligatorias:**
- [ ] Cada servicio hereda de BaseService correctamente
- [ ] Operaciones CRUD funcionan sin regresiones
- [ ] Validación de duplicados centralizada
- [ ] Manejo de errores unificado

**📊 Métricas esperadas:**
- Líneas eliminadas: ~1,500-2,000
- Servicios consolidados: 15 → BaseService + especializaciones
- Duplicación reducida: 70%

---

#### **📝 TASK 1.3: useStatusColors Hook**
**Tiempo estimado**: 2 horas | **Prioridad**: ALTA | **Impacto**: Medio
**Responsable**: Agent-StatusColors

**📂 Archivos a crear:**
- [ ] `src/hooks/useStatusColors.js` - Hook para colores de estado

**🔧 Archivos a refactorizar (7 archivos con getStatusColor):**
- [ ] `src/components/Vehicles/VehiclesStats.jsx`
- [ ] `src/components/Suppliers/SuppliersStats.jsx`
- [ ] `src/components/Products/ProductsStats.jsx`
- [ ] `src/components/Inventory/InventoryStats.jsx`
- [ ] `src/components/Maintenance/MaintenanceStats.jsx`
- [ ] `src/components/Movements/MovementsStats.jsx`
- [ ] `src/components/Dashboard/DashboardStats.jsx`

**✅ Validaciones obligatorias:**
- [ ] Función `getStatusColor` eliminada de todos los archivos
- [ ] Hook `useStatusColors` implementado correctamente
- [ ] CSS variables utilizadas apropiadamente
- [ ] Colores consistentes en toda la app

**📊 Métricas esperadas:**
- Líneas eliminadas: ~150-200
- Archivos optimizados: 7
- Tiempo implementación: 2 horas

---

### 🌊 **FASE 2: CONSOLIDACIÓN (2 semanas)**
**Objetivo**: Unificar patrones y componentes

#### **📝 TASK 2.1: BaseModal Component**
**Tiempo estimado**: 1 día | **Prioridad**: ALTA | **Impacto**: Alto
**Responsable**: Agent-Modals

**📂 Archivos a crear:**
- [ ] `src/components/shared/BaseModal.jsx` - Modal base
- [ ] `src/components/shared/ModalHeader.jsx` - Header reutilizable
- [ ] `src/components/shared/ModalFooter.jsx` - Footer reutilizable
- [ ] `src/components/shared/__tests__/BaseModal.test.js` - Tests

**🔧 Modales a refactorizar (23 modales):**
- [ ] Migrar ProductModal.jsx (438 líneas → ~200)
- [ ] Migrar VehicleModal.jsx (770 líneas → ~400)
- [ ] Migrar SupplierModal.jsx (534 líneas → ~250)
- [ ] Migrar MaintenanceModal.jsx (820 líneas → ~450)
- [ ] Migrar InventoryModal.jsx → BaseModal
- [ ] Migrar CategoryModal.jsx → BaseModal
- [ ] Migrar UserModal.jsx → BaseModal
- [ ] Migrar SettingsModal.jsx → BaseModal
- [ ] [... resto de modales]

**✅ Validaciones obligatorias:**
- [ ] Todos los modales usan BaseModal
- [ ] Funcionalidad preserved (no regresiones)
- [ ] UI/UX consistente
- [ ] Reducción significativa de líneas

**📊 Métricas esperadas:**
- Líneas eliminadas: ~5,000+
- Modales optimizados: 23
- Reducción promedio: 50% líneas por modal

---

#### **📝 TASK 2.2: Sistema de Validaciones**
**Tiempo estimado**: 4 horas | **Prioridad**: MEDIA | **Impacto**: Medio
**Responsable**: Agent-Validators

**📂 Archivos a crear:**
- [ ] `src/utils/validators.js` - Sistema centralizado
- [ ] `src/utils/__tests__/validators.test.js` - Tests completos

**🔧 Archivos a actualizar:**
- [ ] Integrar validadores en useFormData hook
- [ ] Actualizar todos los modales con validación centralizada
- [ ] Remover validaciones dispersas

**✅ Validaciones obligatorias:**
- [ ] Validaciones consistentes en toda la app
- [ ] Mensajes de error unificados
- [ ] Tests cubren todos los casos edge
- [ ] Performance sin regresiones

---

#### **📝 TASK 2.3: PageLayout Component**
**Tiempo estimado**: 1 semana | **Prioridad**: MEDIA | **Impacto**: Alto
**Responsable**: Agent-Layout

**📂 Archivos a crear:**
- [ ] `src/components/shared/PageLayout.jsx` - Layout base
- [ ] `src/components/shared/PageHeader.jsx` - Header de página
- [ ] `src/components/shared/StatsSection.jsx` - Sección estadísticas
- [ ] `src/components/shared/FiltersSection.jsx` - Sección filtros
- [ ] `src/components/shared/TableSection.jsx` - Sección tabla

**🔧 Componentes Main a refactorizar (37 archivos):**
- [ ] Migrar VehiclesMain.jsx → PageLayout
- [ ] Migrar SuppliersMain.jsx → PageLayout
- [ ] Migrar ProductsMain.jsx → PageLayout
- [ ] [... resto de componentes Main]

---

### 🌊 **FASE 3: OPTIMIZACIÓN (1 semana)**
**Objetivo**: Performance y documentación

#### **📝 TASK 3.1: Performance Optimization**
**Tiempo estimado**: 3 días | **Prioridad**: MEDIA | **Impacto**: Medio
**Responsable**: Agent-Performance

**🔧 Optimizaciones:**
- [ ] React.memo en componentes base
- [ ] useMemo para cálculos costosos
- [ ] useCallback para funciones
- [ ] Code splitting por módulos
- [ ] Lazy loading de componentes

**✅ Validaciones obligatorias:**
- [ ] Bundle size no aumenta
- [ ] Performance metrics mejorados
- [ ] Core Web Vitals optimizados

---

#### **📝 TASK 3.2: Testing y Documentación**
**Tiempo estimado**: 2 días | **Prioridad**: BAJA | **Impacto**: Alto
**Responsable**: Agent-Docs

**📂 Archivos a crear/actualizar:**
- [ ] Documentación arquitectural
- [ ] Tests de integración
- [ ] Guías de uso para nuevos componentes

---

## 📊 **MÉTRICAS Y TRACKING**

### **🎯 OBJETIVOS CUANTIFICABLES**
- **Líneas de código eliminadas**: Meta 7,000+ líneas
- **Duplicación reducida**: Meta 70%
- **Tiempo desarrollo nuevas features**: Meta ↓50%
- **Errores por duplicación**: Meta ↓80%

### **📈 MÉTRICAS POR FASE**
| Fase | Líneas Eliminadas | Archivos Optimizados | Duplicación ↓ | Tiempo |
|------|-------------------|---------------------|---------------|---------|
| 1    | ~2,000           | 33                  | 70%           | 2 sem   |
| 2    | ~4,000           | 60+                 | 80%           | 2 sem   |
| 3    | ~1,000           | All                 | 85%           | 1 sem   |

---

## 📝 **REGISTRO DE CAMBIOS**

### **✅ COMPLETADO**
- [x] **FASE 0**: Migración design tokens (90% completada)
  - **Fecha**: 2025-01-XX
  - **Agent**: Manual/Previous
  - **Archivos**: constants/designTokens.js, constants/index.js
  - **Métricas**: 472 líneas design tokens, 156 líneas exportación

### **🔄 EN PROGRESO**
- [ ] **TASK 1.1**: useFormData Hook
  - **Inicio**: YYYY-MM-DD
  - **Agent**: TBD
  - **Estado**: Pendiente

### **⏳ PENDIENTE**
- [ ] **TASK 1.2**: BaseService
- [ ] **TASK 1.3**: useStatusColors
- [... resto de tareas]

---

## 🚨 **ALERTS Y BLOCKERS**

### **⚠️ DEPENDENCIAS CRÍTICAS**
- TASK 1.1 (useFormData) debe completarse antes de TASK 2.1 (BaseModal)
- TASK 1.2 (BaseService) debe completarse antes de cualquier refactor de servicios
- TASK 2.2 (Validators) requiere TASK 1.1 completado

### **🛑 CRITERIOS DE STOP**
- Si tests fallan después de refactor → STOP y revertir
- Si lint/typecheck produce errores → STOP y corregir
- Si performance degrada >10% → STOP y optimizar

---

## 🏆 **SUCCESS CRITERIA**

### **✅ DEFINICIÓN DE "COMPLETADO"**
1. **Funcionalidad**: Zero regresiones detectadas
2. **Código**: Zero errores lint/typecheck  
3. **Tests**: 95%+ cobertura para nuevos componentes
4. **Performance**: Sin degradación medible
5. **Documentación**: Arquitectura documentada
6. **Métricas**: Objetivos cuantitativos alcanzados

### **🎉 ENTREGABLES FINALES**
- [ ] Codebase refactorizado según roadmap
- [ ] Documentación arquitectural actualizada
- [ ] Guías de desarrollo para nuevos desarrolladores
- [ ] Métricas de impacto documentadas
- [ ] Plan de mantenimiento continuo

---

**📌 Última actualización**: 2025-01-XX
**📌 Responsable del roadmap**: Claude Code + AI Agents
**📌 Review frecuencia**: Semanal
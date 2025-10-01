# 🔧 MÓDULO DE MANTENIMIENTO - POSPUESTO

**Fecha:** 30 de septiembre de 2025  
**Decisión:** ADR-002 - Simplificación de módulos  
**Estado:** ⏸️ Pospuesto para fase posterior

---

## 📋 RESUMEN

El módulo de Mantenimiento ha sido temporalmente deshabilitado como parte de la refactorización de la aplicación. Se conserva el código para su reactivación en una fase posterior.

---

## 🚫 CAMBIOS REALIZADOS

### Archivos Modificados:

#### 1. `/src/App.jsx`
- **Línea 24-25:** Comentado lazy import de `MaintenanceMain`
- **Línea 96-97:** Comentada ruta `/mantenimiento`

#### 2. `/src/AppSSR.jsx`
- **Línea 23-24:** Comentado lazy import de `MaintenanceMain`
- **Línea 120-121:** Comentada ruta `/mantenimiento`

#### 3. `/src/components/Dashboard/MainNavigation.jsx`
- **Líneas 51-58:** Comentado tab de navegación de Mantenimiento

#### 4. `/src/components/Dashboard/DashboardLayout.jsx`
- **Línea 27:** Comentado mapeo de ruta `/mantenimiento`

---

## 📦 COMPONENTES CONSERVADOS

Los siguientes componentes se mantienen intactos para reactivación futura:

### Directorio: `/src/components/Maintenance/`
- `MaintenanceMain.jsx` - Componente principal
- `MaintenanceCards.jsx` - Vista de tarjetas
- `MaintenanceFilters.jsx` - Filtros
- `MaintenanceList.jsx` - Lista
- `MaintenanceModal.jsx` - Modal de edición
- `MaintenanceStats.jsx` - Estadísticas
- `MaintenanceTable.jsx` - Vista de tabla
- `MaintenanceMain-SAP.css` - Estilos
- `__tests__/MaintenanceModal.int.test.jsx` - Test de integración

**Total:** 9 archivos conservados

---

## 🔄 SERVICIOS RELACIONADOS

### Servicios que quedan sin usar temporalmente:

#### Firebase Service:
- `/src/services/FirebaseMaintenanceService.js` - ✅ Conservado

#### Legacy Service (para eliminar en migración):
- `/src/services/maintenanceService.js` - ⚠️ Será eliminado en migración general

---

## 📊 FUNCIONALIDADES DESHABILITADAS

### Capacidades del módulo de Mantenimiento:

1. **Mantenimiento Preventivo**
   - Programación basada en horómetro
   - Alertas automáticas antes de vencimiento

2. **Mantenimiento Correctivo**
   - Registro de reparaciones
   - Historial completo por vehículo

3. **Inspecciones**
   - Inspecciones programadas
   - Checklist de inspección

4. **Costos y Piezas**
   - Cálculo automático de costos
   - Registro de piezas utilizadas
   - Control de inventario de repuestos

5. **Estadísticas**
   - Costos por vehículo
   - Frecuencia de mantenimientos
   - Análisis de piezas más usadas

---

## 🔜 PLAN DE REACTIVACIÓN

### Fase Posterior (TBD)

Cuando se decida reactivar el módulo de Mantenimiento:

#### 1. Descomentar código (5 min)
```bash
# En App.jsx
- Descomentar import de MaintenanceMain
- Descomentar ruta /mantenimiento

# En AppSSR.jsx  
- Descomentar import de MaintenanceMain
- Descomentar ruta /mantenimiento

# En MainNavigation.jsx
- Descomentar tab de mantenimiento

# En DashboardLayout.jsx
- Descomentar mapeo de ruta
```

#### 2. Migrar servicio legacy (30 min)
- Eliminar `maintenanceService.js`
- Actualizar componentes para usar `FirebaseMaintenanceService`
- Usar hook `useMainten

ance` (crear si no existe)

#### 3. Testing (1 hora)
- Verificar funcionalidad completa
- Ejecutar tests de integración
- Validar flujos principales

#### 4. Simplificar (opcional, 2-3 horas)
- Revisar si todas las funcionalidades son necesarias
- Simplificar UI si es muy compleja
- Optimizar flujos de trabajo

---

## 💡 CONSIDERACIONES

### ¿Por qué se pospuso?

1. **Enfoque en funcionalidades CORE:** Inventario, Movimientos, Vehículos son más críticos
2. **Simplificación:** Reducir complejidad durante refactorización
3. **Fase posterior:** Permitir evaluar si todas las capacidades son necesarias

### Impacto en la aplicación

- ✅ **Sin breaking changes:** El módulo simplemente no está disponible
- ✅ **Datos conservados:** Los datos de mantenimiento en BD se mantienen intactos
- ✅ **Servicios activos:** `FirebaseMaintenanceService` sigue funcionando
- ⚠️ **Usuarios:** No pueden acceder a mantenimientos hasta reactivación

---

## 🎯 DECISIÓN DE REACTIVACIÓN

El módulo se reactivará cuando:

1. ✅ Fase 1 de refactorización completada
2. ✅ Módulos CORE estables y funcionando
3. ✅ Equipo confirma necesidad de reactivar
4. ✅ Recursos disponibles para testing exhaustivo

**Estimación de reactivación:** 2-3 horas totales

---

## 📝 NOTAS ADICIONALES

### Alternativas consideradas

**Opción A:** Eliminar completamente
- ❌ Descartado: Puede ser útil en el futuro

**Opción B:** Posponer (elegida)
- ✅ Permite enfocar en CORE
- ✅ Conserva trabajo realizado
- ✅ Fácil reactivación

**Opción C:** Simplificar ahora
- ❌ Requiere tiempo que se necesita para CORE

---

## 📞 CONTACTO

**Para reactivación del módulo:**
- Ver este documento para pasos detallados
- Estimar 2-3 horas para reactivación completa
- Coordinar con equipo para testing

---

**Última actualización:** 30 de septiembre de 2025  
**Responsable:** Forestech Development Team  
**Referencias:**
- [REFACTORIZACION_SEGUIMIENTO.md](./REFACTORIZACION_SEGUIMIENTO.md)
- [ANALISIS_EXHAUSTIVO_Y_ROADMAP.md](./ANALISIS_EXHAUSTIVO_Y_ROADMAP.md)


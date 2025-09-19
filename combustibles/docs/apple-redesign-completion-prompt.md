# Prompt para Completar Rediseño Apple - Componentes Restantes

## 📋 Contexto

La aplicación de combustibles ya tiene implementado el **95% del rediseño Apple**. Todos los componentes principales han sido migrados exitosamente del tema SAP al sistema de diseño Apple.

## 🎯 Prompt para Nueva Sesión

```
Hola, necesito completar el rediseño Apple de la aplicación de combustibles. Ya está implementado el 95% del rediseño con todos los componentes principales migrados:

✅ COMPLETADO (95%):
- Sistema de design tokens Apple completo (apple-design-system.css, apple-components.css, etc.)
- Navegación principal estilo iOS/macOS (MainNavigation.jsx)
- Dashboard rediseñado (DashboardLayout.jsx, DashboardMain-SAP.jsx)
- Componentes compartidos (BaseModal.jsx, PageLayout.jsx, ModalHeader.jsx, ModalFooter.jsx)
- Pantalla de autenticación (AuthVisualEnhanced.jsx)
- TODOS los modales principales: VehicleModal.jsx, ProductModal.jsx, SupplierModal.jsx
- MovementWizard.jsx (componente crítico)
- Páginas principales: VehiclesMain.jsx, ProductsMain.jsx
- Tablas principales: InventoryTable.jsx, MovementsTable.jsx
- AdminMain.jsx y ReportsMain.jsx

🔄 PENDIENTE (5% restante) - Componentes auxiliares con clases "sap-theme":

WIZARD STEPS (Prioridad Media):
1. Step1_BasicInfo.jsx - Wizard de información básica
2. Step2_Category.jsx - Wizard de categorías
3. Step3_Technical.jsx - Wizard de especificaciones técnicas
4. Step4_Operational.jsx - Wizard operacional
5. Step5_Summary.jsx - Wizard de resumen

REPORTES DETALLADOS (Prioridad Baja):
6. InventoryReports.jsx - Reportes de inventario
7. VehicleReports.jsx - Reportes de vehículos
8. MovementReports.jsx - Reportes de movimientos
9. FinancialReports.jsx - Reportes financieros

COMPONENTES AUXILIARES (Prioridad Baja):
10. DashboardTable.jsx - Tabla del dashboard
11. VehicleFormSmart.jsx - Formulario inteligente de vehículos
12. VehiclesStats.jsx - Estadísticas de vehículos

INSTRUCCIONES:
- Usar las clases CSS Apple ya creadas (apple-button, apple-card, apple-input, apple-modal, etc.)
- Reemplazar TODAS las clases "sap-theme" por equivalentes Apple
- Mantener la funcionalidad exacta, solo cambiar estilos
- Seguir el patrón ya establecido en los componentes completados
- Usar los design tokens Apple definidos en apple-design-system.css

PATRÓN DE MIGRACIÓN ESTABLECIDO:

ANTES (SAP):
```jsx
<div className="modal-container sap-theme">
  <button className="btn btn-primary sap-theme">Guardar</button>
  <input className="form-input sap-theme" />
  <div className="stat-card sap-theme">
    <div className="stat-icon sap-theme">📊</div>
  </div>
</div>
```

DESPUÉS (Apple):
```jsx
<div className="apple-modal">
  <button className="apple-button apple-button-primary">Guardar</button>
  <input className="apple-form-input" />
  <div className="apple-stat-card">
    <div className="apple-stat-card-icon">📊</div>
  </div>
</div>
```

CLASES APPLE DISPONIBLES:

**Componentes Base:**
- apple-button, apple-button-primary, apple-button-secondary, apple-button-tertiary
- apple-card, apple-card-compact, apple-card-spacious
- apple-input, apple-form-input, apple-form-select, apple-form-textarea
- apple-modal, apple-modal-overlay, apple-modal-header, apple-modal-content

**Layout y Grid:**
- apple-dashboard-layout, apple-dashboard-main
- apple-stats-grid, apple-content-grid, apple-content-section
- apple-dashboard-header, apple-dashboard-title, apple-dashboard-subtitle

**Estados y Badges:**
- apple-status-badge, apple-progress-bar, apple-progress-fill
- apple-loading-state, apple-empty-state
- apple-action-buttons, apple-action-button

**Formularios:**
- apple-form-group, apple-form-label, apple-form-input
- apple-form-section, apple-form-actions
- apple-form-error, apple-form-success

**Navegación:**
- apple-navigation, apple-nav-item, apple-nav-container
- apple-nav-icon, apple-nav-label

**Tablas:**
- apple-table, apple-dashboard-table
- apple-stat-card, apple-stat-card-header, apple-stat-card-value

¿Puedes ayudarme a completar estos componentes restantes aplicando el estilo Apple consistentemente? El objetivo es alcanzar un rediseño Apple 100% completo eliminando todas las clases "sap-theme" restantes.
```

## 📚 Archivos de Referencia

### Sistema de Diseño Apple Implementado:
1. **`src/styles/apple-design-system.css`** - Design tokens completos
2. **`src/styles/apple-components.css`** - Componentes base
3. **`src/styles/apple-dashboard.css`** - Estilos específicos del dashboard
4. **`src/styles/apple-forms.css`** - Formularios estilo Apple
5. **`docs/apple-design-system.md`** - Especificaciones completas

### Componentes de Referencia Completados:
- **VehicleModal.jsx** - Ejemplo perfecto de migración de modal
- **ProductModal.jsx** - Formularios Apple implementados
- **VehiclesMain.jsx** - Navegación y layout Apple
- **InventoryTable.jsx** - Tablas Apple implementadas

## 🔧 Archivos Específicos Pendientes

### Wizard Steps (Ubicación: `src/components/Vehicles/WizardSteps/`)
```
Step1_BasicInfo.jsx
Step2_Category.jsx  
Step3_Technical.jsx
Step4_Operational.jsx
Step5_Summary.jsx
```

### Reportes (Ubicación: `src/components/Reports/`)
```
InventoryReports.jsx
VehicleReports.jsx
MovementReports.jsx
FinancialReports.jsx
```

### Componentes Auxiliares
```
src/components/Dashboard/DashboardTable.jsx
src/components/Vehicles/VehicleFormSmart.jsx
src/components/Vehicles/VehiclesStats.jsx
```

## 🎯 Variables CSS Apple Disponibles

```css
/* Colores */
--apple-blue: #007aff;
--apple-gray-100: #f5f5f7;
--bg-primary: var(--apple-white);
--text-primary: var(--apple-gray-800);
--interactive-primary: var(--apple-blue);
--interactive-success: var(--apple-green);
--interactive-warning: var(--apple-orange);
--interactive-error: var(--apple-red);

/* Espaciado */
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;

/* Tipografía */
--font-family-system: -apple-system, BlinkMacSystemFont, 'Inter', system-ui;
--font-size-body-medium: 14px;
--font-weight-medium: 500;

/* Bordes y Sombras */
--radius-card: 12px;
--radius-button: 8px;
--shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--shadow-modal: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## ✅ Resultado Esperado

Al completar estos componentes restantes, la aplicación tendrá un **rediseño Apple 100% completo** con:
- Eliminación total de clases "sap-theme"
- Consistencia visual completa en toda la aplicación
- Experiencia de usuario completamente transformada al estilo Apple
- Sistema de diseño unificado y elegante

El sistema de diseño Apple está completamente creado y probado. Solo falta aplicarlo a estos componentes auxiliares siguiendo el patrón ya establecido en los componentes principales.
# Prompt para Completar Rediseño Apple - Combustibles App

## 📋 Contexto

La aplicación de combustibles ya tiene implementado el **85% del rediseño Apple**. El sistema de diseño base, navegación, dashboard, componentes compartidos y pantalla de login están completamente rediseñados con estilo Apple.

## 🎯 Prompt para Nueva Sesión

```
Hola, necesito completar el rediseño Apple de la aplicación de combustibles. Ya está implementado el sistema de diseño base con:

✅ COMPLETADO:
- Sistema de design tokens Apple (apple-design-system.css, apple-components.css, apple-dashboard.css, apple-forms.css, apple-auth.css)
- Navegación principal estilo iOS/macOS (MainNavigation.jsx)
- Dashboard rediseñado (DashboardLayout.jsx, DashboardMain-SAP.jsx)
- Componentes compartidos (BaseModal.jsx, PageLayout.jsx, ModalHeader.jsx, ModalFooter.jsx)
- Pantalla de autenticación (AuthVisualEnhanced.jsx)

🔄 PENDIENTE - Necesito completar estos componentes con estilo Apple:

PRIORIDAD ALTA:
1. VehicleModal.jsx - Reemplazar clases "sap-theme" por "apple-*"
2. ProductModal.jsx - Aplicar formularios Apple
3. SupplierModal.jsx - Rediseñar con componentes Apple
4. MovementWizard.jsx - Wizard estilo Apple

PRIORIDAD MEDIA:
5. VehiclesMain.jsx - Página principal de vehículos
6. ProductsMain.jsx - Página principal de productos
7. InventoryTable.jsx - Tabla de inventario
8. MovementsTable.jsx - Tabla de movimientos

PRIORIDAD BAJA:
9. AdminMain.jsx - Panel de administración
10. ReportsMain.jsx - Página de reportes

INSTRUCCIONES:
- Usar las clases CSS Apple ya creadas (apple-button, apple-card, apple-input, apple-modal, etc.)
- Reemplazar todas las clases "sap-theme" por equivalentes Apple
- Mantener la funcionalidad exacta, solo cambiar estilos
- Seguir el patrón ya establecido en los componentes completados
- Usar los design tokens Apple definidos en apple-design-system.css

¿Puedes ayudarme a completar estos componentes faltantes aplicando el estilo Apple consistentemente?
```

## 📚 Documentación de Referencia

### Archivos de Referencia Creados:
1. **`docs/apple-design-system.md`** - Especificaciones completas del sistema Apple
2. **`docs/apple-design-tokens-implementation.md`** - Plan técnico detallado
3. **`docs/apple-redesign-architecture.md`** - Arquitectura y diagramas
4. **`docs/apple-redesign-status.md`** - Estado actual del rediseño

### Clases CSS Apple Disponibles:

**Componentes Base:**
```css
.apple-button, .apple-button-primary, .apple-button-secondary, .apple-button-tertiary
.apple-card, .apple-card-compact, .apple-card-spacious
.apple-input, .apple-form-input, .apple-form-select, .apple-form-textarea
.apple-modal, .apple-modal-overlay, .apple-modal-header, .apple-modal-content
.apple-navigation, .apple-nav-item, .apple-nav-container
```

**Layout y Grid:**
```css
.apple-dashboard-layout, .apple-dashboard-main
.apple-stats-grid, .apple-content-grid, .apple-content-section
.apple-dashboard-header, .apple-dashboard-title, .apple-dashboard-subtitle
```

**Estados y Badges:**
```css
.apple-status-badge, .apple-progress-bar, .apple-progress-fill
.apple-loading-state, .apple-empty-state
.apple-action-buttons, .apple-action-button
```

**Formularios:**
```css
.apple-form-group, .apple-form-label, .apple-form-input
.apple-form-section, .apple-form-actions
.apple-form-error, .apple-form-success
```

### Patrón de Migración:

**ANTES (SAP):**
```jsx
<div className="modal-container sap-theme">
  <button className="btn btn-primary sap-theme">Guardar</button>
  <input className="form-input sap-theme" />
</div>
```

**DESPUÉS (Apple):**
```jsx
<div className="apple-modal">
  <button className="apple-button apple-button-primary">Guardar</button>
  <input className="apple-form-input" />
</div>
```

## 🎯 Componentes Específicos Pendientes

### 1. VehicleModal.jsx
- **Ubicación**: `src/components/Vehicles/VehicleModal.jsx`
- **Cambios**: Reemplazar `sap-theme` por `apple-modal`, `apple-form-*`, `apple-button-*`
- **Prioridad**: ALTA (modal más usado)

### 2. ProductModal.jsx  
- **Ubicación**: `src/components/Products/ProductModal.jsx`
- **Cambios**: Formularios Apple, botones Apple
- **Prioridad**: ALTA

### 3. MovementWizard.jsx
- **Ubicación**: `src/components/Movements/MovementWizard.jsx`
- **Cambios**: Wizard steps con estilo Apple
- **Prioridad**: ALTA

### 4. Páginas Principales
- **VehiclesMain.jsx**: `src/components/Vehicles/VehiclesMain.jsx`
- **ProductsMain.jsx**: `src/components/Products/ProductsMain.jsx`
- **SuppliersMain.jsx**: `src/components/Suppliers/SuppliersMain.jsx`

### 5. Tablas
- **InventoryTable.jsx**: `src/components/Inventory/InventoryTable.jsx`
- **VehiclesTable.jsx**: `src/components/Vehicles/VehiclesTable.jsx`
- **MovementsTable.jsx**: `src/components/Movements/MovementsTable.jsx`

## 🔧 Instrucciones Técnicas

### Proceso de Migración:
1. **Identificar clases SAP**: Buscar `sap-theme`, `btn-primary`, `modal-*`, etc.
2. **Reemplazar por Apple**: Usar `apple-button-primary`, `apple-modal`, etc.
3. **Verificar funcionalidad**: Asegurar que la lógica no se afecte
4. **Probar responsive**: Verificar en móvil, tablet y desktop

### Variables CSS Disponibles:
```css
/* Colores */
--apple-blue: #007aff;
--apple-gray-100: #f5f5f7;
--bg-primary: var(--apple-white);
--text-primary: var(--apple-gray-800);

/* Espaciado */
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;

/* Tipografía */
--font-family-system: -apple-system, BlinkMacSystemFont, 'Inter', system-ui;
--font-size-body-medium: 14px;
--font-weight-medium: 500;
```

## ✅ Resultado Esperado

Al completar estos componentes, la aplicación tendrá un **rediseño Apple 100% completo** con:
- Todos los modales con estilo Apple
- Formularios consistentes
- Tablas elegantes
- Navegación fluida
- Experiencia visual completamente transformada

El sistema de diseño ya está creado, solo falta aplicarlo a los componentes restantes siguiendo el patrón establecido.
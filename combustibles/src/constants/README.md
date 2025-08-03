# 📚 Guía de Constantes - App Combustibles

## 🎯 **Propósito**

Este directorio centraliza todas las constantes de la aplicación para facilitar:
- ✅ **Mantenimiento**: Cambiar un valor en un solo lugar
- ✅ **Consistencia**: Mismos textos y estilos en toda la app
- ✅ **Escalabilidad**: Fácil localización y tematización
- ✅ **Developer Experience**: IntelliSense y autocompletado

## 📂 **Estructura de Archivos**

```
src/constants/
├── index.js                  ← 🎯 Exportación centralizada
├── uiLabels.js              ← 🏷️  Textos de interfaz
├── modalStyles.js           ← 🎨 Clases CSS de modales
├── designTokens.js          ← 🎭 Tokens de diseño
├── externalUrls.js          ← 🔗 URLs externas
├── fieldDefinitions.js      ← 📋 Definiciones de campos
└── README.md               ← 📖 Esta documentación
```

## 🚀 **Cómo Usar las Constantes**

### **1. Importación Básica**

```javascript
// ✅ Importar desde el índice principal
import { UI_ACTIONS, MODAL_PRESETS, COLORS } from '../../constants';

// ✅ Importar específicamente
import { UI_LABELS } from '../../constants/uiLabels';
```

### **2. Textos de Interfaz (uiLabels.js)**

```javascript
import { UI_ACTIONS, UI_FORM_LABELS, UI_MESSAGES } from '../../constants';

// En lugar de:
<button title="Editar">Edit</button>

// Usar:
<button title={UI_ACTIONS.EDIT}>{UI_ACTIONS.EDIT}</button>

// Labels de formularios
<label>{UI_FORM_LABELS.SUPPLIER}</label>
<input placeholder={UI_PLACEHOLDERS.SEARCH_SUPPLIERS} />

// Mensajes del sistema
alert(UI_MESSAGES.SUCCESS.SAVED);
```

### **3. Estilos de Modales (modalStyles.js)**

```javascript
import { MODAL_PRESETS, buildModalClasses } from '../../constants';

// Usar presets predefinidos
<div className={MODAL_PRESETS.INVENTORY_MODAL.overlay}>
  <div className={MODAL_PRESETS.INVENTORY_MODAL.content}>
    <div className={MODAL_PRESETS.INVENTORY_MODAL.header}>
      <button className={MODAL_PRESETS.INVENTORY_MODAL.close}>×</button>
    </div>
  </div>
</div>

// O construir dinámicamente
const modalClasses = buildModalClasses('vehicle', 'sap');
<div className={modalClasses.overlay}>
```

### **4. Design Tokens (designTokens.js)**

```javascript
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

// En CSS-in-JS
const styles = {
  backgroundColor: COLORS.PRIMARY.FORESTECH_GREEN,
  padding: SPACING.LG,
  fontSize: TYPOGRAPHY.FONT_SIZES.MD
};

// En componentes styled
const StyledButton = styled.button`
  background: ${COLORS.GRADIENTS.PRIMARY};
  border-radius: ${BORDERS.RADIUS.MD};
  transition: ${ANIMATIONS.TRANSITIONS.ALL};
`;
```

### **5. URLs Externas (externalUrls.js)**

```javascript
import { COMMUNICATION_URLS, buildWhatsAppURL } from '../../constants';

// URLs predefinidas
<a href={COMMUNICATION_URLS.WHATSAPP_SUPPORT}>
  Contactar Soporte
</a>

// URLs dinámicas
const customWhatsApp = buildWhatsAppURL(
  '573124559869', 
  'Necesito ayuda con el inventario'
);
```

### **6. Definiciones de Campos (fieldDefinitions.js)**

```javascript
import { FIELD_DEFINITIONS, getFieldDefinition } from '../../constants';

// Usar definiciones predefinidas
const plateField = FIELD_DEFINITIONS.VEHICLE.PLATE_NUMBER;

<input
  type={plateField.type}
  placeholder={plateField.placeholder}
  pattern={plateField.validation.pattern}
  maxLength={plateField.validation.maxLength}
/>

// O dinámicamente
const fieldDef = getFieldDefinition('plateNumber', 'vehicle');
<label>{fieldDef.label} {fieldDef.icon}</label>
```

## 📝 **Ejemplos Prácticos de Refactoring**

### **Antes (hardcodeado):**
```javascript
<div className="modal-overlay" onClick={onClose}>
  <div className="modal-content inventory-modal">
    <div className="modal-header">
      <h2>Editar Combustible</h2>
      <button className="modal-close">×</button>
    </div>
    <form className="modal-form">
      <label>Proveedor</label>
      <button title="Editar">Edit</button>
    </form>
  </div>
</div>
```

### **Después (usando constantes):**
```javascript
import { MODAL_PRESETS, UI_ACTIONS, UI_FORM_LABELS } from '../../constants';

<div className={MODAL_PRESETS.INVENTORY_MODAL.overlay} onClick={onClose}>
  <div className={MODAL_PRESETS.INVENTORY_MODAL.content}>
    <div className={MODAL_PRESETS.INVENTORY_MODAL.header}>
      <h2>{UI_ACTIONS.EDIT} Combustible</h2>
      <button className={MODAL_PRESETS.INVENTORY_MODAL.close}>×</button>
    </div>
    <form className={MODAL_PRESETS.INVENTORY_MODAL.form}>
      <label>{UI_FORM_LABELS.SUPPLIER}</label>
      <button title={UI_ACTIONS.EDIT}>{UI_ACTIONS.EDIT}</button>
    </form>
  </div>
</div>
```

## 🎨 **Tematización y Personalización**

### **Usar diferentes temas:**
```javascript
// Tema SAP Fiori
const sapModal = buildModalClasses('inventory', 'sap');

// Tema Retro 80s
const retroModal = buildModalClasses('inventory', 'retro');

// Tema por defecto
const defaultModal = buildModalClasses('inventory', 'default');
```

### **Design Tokens en CSS:**
```css
/* Usar CSS custom properties generadas desde JS */
:root {
  --forestech-primary: #2c5530;
  --forestech-spacing-lg: 1.5rem;
  --forestech-shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.custom-component {
  background: var(--forestech-primary);
  padding: var(--forestech-spacing-lg);
  box-shadow: var(--forestech-shadow-card);
}
```

## 🔧 **Utilidades Avanzadas**

### **Navegación por constantes:**
```javascript
import { getConstant, hasConstant, listConstantPaths } from '../../constants';

// Obtener una constante por ruta
const editLabel = getConstant('UI.LABELS.ACTIONS.EDIT');

// Verificar si existe
if (hasConstant('UI.MESSAGES.ERROR.SAVE_FAILED')) {
  // Usar la constante
}

// Listar todas las rutas disponibles
const allPaths = listConstantPaths();
console.log(allPaths); // ['UI.ACTIONS.EDIT', 'COLORS.PRIMARY.FORESTECH_GREEN', ...]
```

### **Validación de campos dinámica:**
```javascript
import { getFieldsByCategory } from '../../constants';

// Obtener todos los campos de vehículos
const vehicleFields = getFieldsByCategory('vehicle');

// Generar formulario dinámicamente
vehicleFields.forEach(field => {
  if (field.validation?.required) {
    // Aplicar validación requerida
  }
});
```

## 📈 **Migración Progresiva**

**Fase 1**: Componentes principales (modales, formularios)
```javascript
// Priorizar componentes con mayor repetición de strings
- SuppliersTable.jsx ✅
- InventoryModal.jsx ✅  
- VehicleFormSmart.jsx
- MovementWizard.jsx
```

**Fase 2**: Estilos y CSS
```css
/* Reemplazar valores hardcodeados por design tokens */
- Colores: #2c5530 → COLORS.PRIMARY.FORESTECH_GREEN
- Espaciado: 1.5rem → SPACING.LG
- Sombras: box-shadow values → SHADOWS.CARD
```

**Fase 3**: URLs y configuraciones
```javascript
// Centralizar URLs hardcodeadas
- WhatsApp links → COMMUNICATION_URLS.WHATSAPP_SUPPORT
- Google Fonts → CDN_URLS.FONTS.GOOGLE_FONTS_SAP
```

## 🚨 **Buenas Prácticas**

### **✅ Hacer:**
- Usar importaciones específicas para mejor tree-shaking
- Prefixar constantes por contexto (UI_, MODAL_, etc.)
- Documentar constantes complejas con comentarios
- Usar TypeScript para mayor type safety (futuro)

### **❌ Evitar:**
- Hardcodear strings que se repiten más de 2 veces
- Importar todo el objeto CONSTANTS si solo necesitas una constante
- Modificar constantes existentes sin actualizar la documentación
- Crear constantes para valores únicos que no se reutilizan

## 📞 **Soporte**

Si tienes dudas sobre cómo usar las constantes:
1. 📖 Consulta esta documentación
2. 💬 Revisa los ejemplos de refactoring en los commits
3. 🆘 Contacta al equipo de desarrollo

---

**🎉 ¡Con estas constantes, mantener y escalar la app combustibles será mucho más fácil!**
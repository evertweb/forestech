/**
 * Modal Styles y clases CSS centralizadas para la app combustibles
 * Unifica clases de modales, overlays y componentes de diálogo
 */

// ===================================================================
// CLASES BASE DE MODALES
// ===================================================================
export const MODAL_CLASSES = {
  // Estructura base del modal
  OVERLAY: 'modal-overlay',
  CONTENT: 'modal-content',
  CONTAINER: 'modal-container',
  
  // Partes del modal
  HEADER: 'modal-header',
  BODY: 'modal-body',
  FOOTER: 'modal-footer',
  ACTIONS: 'modal-actions',
  
  // Controles
  CLOSE: 'modal-close',
  CLOSE_BUTTON: 'modal-close-button',
  
  // Formularios en modales
  FORM: 'modal-form',
  FORM_GROUP: 'modal-form-group',
  FORM_ROW: 'modal-form-row'
};

// ===================================================================
// CLASES ESPECÍFICAS POR TIPO DE MODAL
// ===================================================================
export const MODAL_TYPES = {
  // Modales estándar
  STANDARD: 'modal-standard',
  SMALL: 'modal-small',
  LARGE: 'modal-large',
  FULLSCREEN: 'modal-fullscreen',
  
  // Modales especializados
  INVENTORY: 'modal-content inventory-modal',
  VEHICLE: 'modal-content vehicle-modal',
  SUPPLIER: 'modal-content supplier-modal',
  MAINTENANCE: 'modal-content maintenance-modal',
  PRODUCT: 'modal-content product-modal',
  
  // Wizards y formularios multi-paso
  WIZARD: 'modal-content wizard-modal',
  WIZARD_OVERLAY: 'modal-overlay wizard-overlay',
  SMART_FORM: 'modal-content smart-form-modal'
};

// ===================================================================
// CLASES PARA TEMAS Y ESTILOS
// ===================================================================
export const MODAL_THEMES = {
  // Tema SAP Fiori
  SAP: {
    OVERLAY: 'smart-modal-overlay sap-theme',
    CONTAINER: 'smart-modal-container sap-theme',
    CONTENT: 'modal-content sap-theme',
    HEADER: 'modal-header sap-theme',
    ACTIONS: 'modal-actions sap-theme'
  },
  
  // Tema Retro 80s
  RETRO: {
    OVERLAY: 'modal-overlay retro-theme',
    CONTAINER: 'modal-container retro-theme', 
    CONTENT: 'modal-content retro-theme',
    HEADER: 'modal-header retro-theme',
    ACTIONS: 'modal-actions retro-theme'
  },
  
  // Tema estándar/default
  DEFAULT: {
    OVERLAY: 'modal-overlay',
    CONTAINER: 'modal-container',
    CONTENT: 'modal-content', 
    HEADER: 'modal-header',
    ACTIONS: 'modal-actions'
  }
};

// ===================================================================
// CLASES DE BOTONES Y ACCIONES
// ===================================================================
export const MODAL_BUTTONS = {
  // Botones primarios
  PRIMARY: 'btn btn-primary',
  SECONDARY: 'btn btn-secondary',
  
  // Botones de acción
  SAVE: 'btn btn-save',
  CANCEL: 'btn btn-cancel',
  DELETE: 'btn btn-delete',
  EDIT: 'btn btn-edit',
  
  // Botones con temas
  SAP_PRIMARY: 'btn btn-primary sap-theme',
  SAP_SECONDARY: 'btn btn-secondary sap-theme',
  
  // Botones de navegación (wizards)
  NEXT: 'btn btn-next',
  PREVIOUS: 'btn btn-previous',
  FINISH: 'btn btn-finish'
};

// ===================================================================
// CLASES DE ESTADOS Y ANIMACIONES
// ===================================================================
export const MODAL_STATES = {
  // Estados de visibilidad
  SHOW: 'modal-show',
  HIDE: 'modal-hide',
  OPENING: 'modal-opening',
  CLOSING: 'modal-closing',
  
  // Estados de carga
  LOADING: 'modal-loading',
  READY: 'modal-ready',
  ERROR: 'modal-error',
  
  // Estados específicos
  MAXIMIZED: 'modal-maximized',
  MINIMIZED: 'modal-minimized',
  DRAGGING: 'modal-dragging'
};

// ===================================================================
// UTILIDADES PARA CONSTRUCCIÓN DE CLASES
// ===================================================================

/**
 * Construye la clase CSS completa para un modal según su tipo y tema
 * @param {string} type - Tipo de modal (inventory, vehicle, etc.)
 * @param {string} theme - Tema a aplicar (sap, retro, default)
 * @returns {object} Objeto con todas las clases del modal
 */
export const buildModalClasses = (type = 'standard', theme = 'default') => {
  const baseTheme = MODAL_THEMES[theme.toUpperCase()] || MODAL_THEMES.DEFAULT;
  const modalType = MODAL_TYPES[type.toUpperCase()] || MODAL_TYPES.STANDARD;
  
  return {
    overlay: baseTheme.OVERLAY,
    container: baseTheme.CONTAINER,
    content: `${baseTheme.CONTENT} ${modalType}`,
    header: baseTheme.HEADER,
    actions: baseTheme.ACTIONS,
    close: MODAL_CLASSES.CLOSE
  };
};

/**
 * Construye clases para botones según el tema
 * @param {string} action - Acción del botón (save, cancel, etc.)
 * @param {string} theme - Tema a aplicar
 * @returns {string} Clase CSS completa del botón
 */
export const buildButtonClass = (action = 'primary', theme = 'default') => {
  const baseClass = MODAL_BUTTONS[action.toUpperCase()] || MODAL_BUTTONS.PRIMARY;
  
  if (theme === 'sap') {
    return `${baseClass} sap-theme`;
  }
  
  if (theme === 'retro') {
    return `${baseClass} retro-theme`;
  }
  
  return baseClass;
};

// ===================================================================
// CONFIGURACIONES PREDEFINIDAS COMUNES
// ===================================================================
export const MODAL_PRESETS = {
  // Modal estándar de inventario
  INVENTORY_MODAL: {
    overlay: MODAL_CLASSES.OVERLAY,
    content: MODAL_TYPES.INVENTORY,
    header: MODAL_CLASSES.HEADER,
    close: MODAL_CLASSES.CLOSE,
    form: MODAL_CLASSES.FORM,
    actions: MODAL_CLASSES.ACTIONS
  },
  
  // Modal de vehículos inteligente
  VEHICLE_MODAL: {
    overlay: 'smart-modal-overlay',
    content: 'smart-modal-container',
    header: 'smart-modal-header',
    close: 'smart-btn-close',
    form: 'smart-form'
  },
  
  // Wizard de movimientos
  MOVEMENT_WIZARD: {
    overlay: MODAL_TYPES.WIZARD_OVERLAY,
    content: MODAL_TYPES.WIZARD,
    header: MODAL_CLASSES.HEADER,
    close: MODAL_CLASSES.CLOSE
  },
  
  // Modal SAP inteligente para vehículos
  VEHICLE_SMART_SAP: buildModalClasses('vehicle', 'sap'),
  
  // Modal de confirmación simple
  CONFIRMATION: {
    overlay: MODAL_CLASSES.OVERLAY,
    content: `${MODAL_CLASSES.CONTENT} ${MODAL_TYPES.SMALL}`,
    header: MODAL_CLASSES.HEADER,
    actions: MODAL_CLASSES.ACTIONS
  }
};

// ===================================================================
// EXPORTACIÓN PRINCIPAL
// ===================================================================
export const MODAL_STYLES = {
  CLASSES: MODAL_CLASSES,
  TYPES: MODAL_TYPES,
  THEMES: MODAL_THEMES,
  BUTTONS: MODAL_BUTTONS,
  STATES: MODAL_STATES,
  PRESETS: MODAL_PRESETS,
  
  // Utilidades
  buildModalClasses,
  buildButtonClass
};

export default MODAL_STYLES;
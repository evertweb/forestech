/**
 * Archivo de exportación centralizada para todas las constantes de la app combustibles
 * Punto único de acceso a todas las constantes del sistema
 */

// ===================================================================
// IMPORTACIONES DE CONSTANTES EXISTENTES
// ===================================================================
// Constantes de combustibles y productos
export * from './combustibleTypes.js';
export * from './productTypes.js';
export * from './locations.js';
export * from './roles.js';
export * from './vehicleTypes.js';

// ===================================================================
// IMPORTACIONES DE NUEVAS CONSTANTES
// ===================================================================
// Textos de interfaz y etiquetas
export * from './uiLabels.js';
export { default as UI_LABELS } from './uiLabels.js';

// Estilos de modales y componentes
export * from './modalStyles.js';
export { default as MODAL_STYLES } from './modalStyles.js';

// Tokens de diseño y valores visuales
export * from './designTokens.js';
export { default as DESIGN_TOKENS } from './designTokens.js';

// URLs externas y configuraciones de enlaces
export * from './externalUrls.js';
export { default as EXTERNAL_URLS } from './externalUrls.js';

// Definiciones de campos y formularios
export * from './fieldDefinitions.js';
export { default as FIELD_DEFINITIONS } from './fieldDefinitions.js';

// ===================================================================
// IMPORTACIONES DE DATOS ESPECÍFICOS
// ===================================================================
// Datos de categorías de vehículos
export * from '../data/vehicleCategories.js';

// ===================================================================
// EXPORTACIONES AGRUPADAS POR CATEGORÍA
// ===================================================================

// Constantes de interfaz de usuario
export {
  UI_ACTIONS,
  UI_TITLES,
  UI_STATUS,
  UI_FORM_LABELS,
  UI_MESSAGES,
  UI_PLACEHOLDERS,
  UI_TOOLTIPS,
  UI_TABS
} from './uiLabels.js';

// Constantes de estilos y modales
export {
  MODAL_CLASSES,
  MODAL_TYPES,
  MODAL_THEMES,
  MODAL_BUTTONS,
  MODAL_STATES,
  MODAL_PRESETS,
  buildModalClasses,
  buildButtonClass
} from './modalStyles.js';

// Tokens de diseño
export {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BREAKPOINTS,
  SHADOWS,
  BORDERS,
  ANIMATIONS,
  Z_INDEX,
  CACHE_CONFIG,
  THEME_TOKENS
} from './designTokens.js';

// URLs y enlaces
export {
  COMMUNICATION_URLS,
  CDN_URLS,
  API_URLS,
  DOCUMENTATION_URLS,
  INTERNAL_URLS,
  DEVELOPMENT_URLS,
  ENVIRONMENT_URLS,
  buildWhatsAppURL,
  getEnvironmentUrls,
  buildApiUrl
} from './externalUrls.js';

// Definiciones de campos
export {
  PRODUCT_FIELD_DEFINITIONS,
  VEHICLE_FIELD_DEFINITIONS,
  MOVEMENT_FIELD_DEFINITIONS,
  SUPPLIER_FIELD_DEFINITIONS,
  MAINTENANCE_FIELD_DEFINITIONS,
  COMMON_FIELD_DEFINITIONS,
  getFieldDefinition,
  getFieldsByCategory
} from './fieldDefinitions.js';

// Constantes de combustibles y productos (re-exportadas para claridad)
export {
  FUEL_TYPES,
  FUEL_INFO,
  STOCK_LEVELS,
  STOCK_ALERTS,
  getStockLevel
} from './combustibleTypes.js';

export {
  PRODUCT_TYPES,
  PRODUCT_INFO,
  PRODUCT_CATEGORIES,
  getProductsByCategory,
  getAllProducts,
  getProductInfo
} from './productTypes.js';

export {
  OPERATIONAL_LOCATIONS,
  STORAGE_LOCATIONS,
  formatLocationName
} from './locations.js';

// ===================================================================
// CONSTANTES GLOBALES COMBINADAS
// ===================================================================

/**
 * Objeto principal que contiene todas las constantes organizadas por categoría
 * Útil para importar todo el conjunto de constantes de una vez
 */
export const CONSTANTS = {
  // Interfaz de usuario
  UI: {
    LABELS: UI_LABELS,
    MODALS: MODAL_STYLES
  },
  
  // Diseño y estilos
  DESIGN: {
    TOKENS: DESIGN_TOKENS,
    COLORS,
    TYPOGRAPHY,
    SPACING,
    BREAKPOINTS
  },
  
  // URLs y configuración
  URLS: EXTERNAL_URLS,
  
  // Definiciones de datos
  FIELDS: FIELD_DEFINITIONS,
  
  // Tipos de negocio
  BUSINESS: {
    FUEL_TYPES,
    PRODUCT_TYPES,
    LOCATIONS: OPERATIONAL_LOCATIONS,
    STOCK_LEVELS
  }
};

// ===================================================================
// UTILIDADES GLOBALES
// ===================================================================

/**
 * Obtiene una constante por su ruta jerárquica
 * @param {string} path - Ruta a la constante (ej: 'UI.LABELS.ACTIONS.EDIT')
 * @returns {any} Valor de la constante o undefined
 */
export const getConstant = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], CONSTANTS);
};

/**
 * Verifica si existe una constante en la ruta especificada
 * @param {string} path - Ruta a verificar
 * @returns {boolean} True si la constante existe
 */
export const hasConstant = (path) => {
  return getConstant(path) !== undefined;
};

/**
 * Lista todas las rutas disponibles de constantes
 * @param {object} obj - Objeto a recorrer (por defecto CONSTANTS)
 * @param {string} prefix - Prefijo actual (uso interno)
 * @returns {string[]} Array de rutas disponibles
 */
export const listConstantPaths = (obj = CONSTANTS, prefix = '') => {
  const paths = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      paths.push(...listConstantPaths(value, currentPath));
    } else {
      paths.push(currentPath);
    }
  }
  
  return paths;
};

// ===================================================================
// EXPORTACIÓN POR DEFECTO
// ===================================================================
export default CONSTANTS;
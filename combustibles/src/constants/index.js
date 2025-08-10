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
import {
  UI_ACTIONS,
  UI_TITLES,
  UI_STATUS,
  UI_FORM_LABELS,
  UI_MESSAGES,
  UI_PLACEHOLDERS,
  UI_TOOLTIPS,
  UI_TABS,
  MOVEMENT_TYPES_UI,
  WIZARD_QUESTIONS,
  MODAL_TEXT,
} from './uiLabels.js';

// Design tokens y CSS variables
import { DESIGN_TOKENS, CSS_VARIABLES, PRODUCT_COLORS } from './designTokens.js';

// Estilos de modales
import { MODAL_PRESETS } from './modalStyles.js';

// ===================================================================
// IMPORTACIONES DE NUEVAS CONSTANTES
// -------------------------------------------------------------------
// Importa textos de interfaz, etiquetas, tokens de diseño, colores y utilidades responsivas
// para ser usados y reexportados desde este archivo central.
// ===================================================================
// Re-exportar design tokens
export * from './designTokens.js';
export * from './externalUrls.js';
export * from './modalStyles.js';
export { MODAL_PRESETS };

// Re-exportar constantes de interfaz de usuario
export {
  UI_ACTIONS,
  UI_TITLES,
  UI_STATUS,
  UI_FORM_LABELS,
  UI_MESSAGES,
  UI_PLACEHOLDERS,
  UI_TOOLTIPS,
  UI_TABS,
  MOVEMENT_TYPES_UI,
  WIZARD_QUESTIONS,
  MODAL_TEXT,
};

// ===================================================================
// IMPORTACIONES DE DATOS ESPECÍFICOS
// ===================================================================
// Datos de categorías de vehículos
export * from '../data/vehicleCategories.js';

// ===================================================================
// EXPORTACIONES AGRUPADAS POR CATEGORÍA
// ===================================================================

// Las constantes de interfaz de usuario ya están exportadas arriba con export *

// Constantes de combustibles y productos (re-exportadas para claridad)
export {
  FUEL_TYPES,
  FUEL_INFO,
  STOCK_LEVELS,
  STOCK_ALERTS,
  getStockLevel,
} from './combustibleTypes.js';
export {
  PRODUCT_TYPES,
  PRODUCT_INFO,
  PRODUCT_CATEGORIES,
  getProductsByCategory,
  getAllProducts,
  getProductInfo,
} from './productTypes.js';
export { OPERATIONAL_LOCATIONS, STORAGE_LOCATIONS, formatLocationName } from './locations.js';

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
    ACTIONS: UI_ACTIONS,
    TITLES: UI_TITLES,
    STATUS: UI_STATUS,
    FORM_LABELS: UI_FORM_LABELS,
    MESSAGES: UI_MESSAGES,
    PLACEHOLDERS: UI_PLACEHOLDERS,
    TOOLTIPS: UI_TOOLTIPS,
    TABS: UI_TABS,
    MOVEMENT_TYPES: MOVEMENT_TYPES_UI,
    WIZARD_QUESTIONS: WIZARD_QUESTIONS,
  },
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

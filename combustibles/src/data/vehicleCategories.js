/**
 * Sistema de categorías de vehículos personalizable por usuario
 * Permite crear, modificar y gestionar categorías dinámicamente
 */

// Categorías iniciales (totalmente editables por admin)
export const DEFAULT_VEHICLE_CATEGORIES = [];

// Estados de vehículos
export const VEHICLE_STATUS = {
  ACTIVO: 'activo',
  MANTENIMIENTO: 'mantenimiento',
  INACTIVO: 'inactivo',
  REPARACION: 'reparacion',
  FUERA_DE_SERVICIO: 'fuera_de_servicio',
};

// Tipos de combustible disponibles - Importados de la fuente única de verdad
import { FUEL_TYPES as COMBUSTIBLE_FUEL_TYPES } from '../constants/combustibleTypes';

export const FUEL_TYPES = {
  DIESEL: COMBUSTIBLE_FUEL_TYPES.DIESEL,
  GASOLINE: COMBUSTIBLE_FUEL_TYPES.GASOLINE, // Antes era GASOLINA
  MIXTO: COMBUSTIBLE_FUEL_TYPES.MIXED,
};

// Campos esenciales disponibles para categorías (simplificados)
export const AVAILABLE_FIELDS = [
  {
    key: 'plateNumber',
    label: 'Número de Placa',
    type: 'text',
    icon: '🏷️',
    required: true,
    description: 'Identificación única del vehículo',
  },
  {
    key: 'hasHourMeter',
    label: 'Verificación de Horómetro',
    type: 'boolean',
    icon: '⏰',
    required: false,
    description: 'Registro de horas de funcionamiento',
  },
  {
    key: 'uniqueCode',
    label: 'Código Único',
    type: 'text',
    icon: '🔢',
    required: true,
    description: 'Código interno de identificación',
  },
];

/**
 * Obtener categoría por ID
 * @param {string} categoryId - ID de la categoría
 * @param {Array} customCategories - Categorías personalizadas del usuario
 * @returns {Object|null} - Categoría encontrada
 */
export const getCategoryById = (categoryId, customCategories = []) => {
  // Buscar primero en categorías personalizadas
  const customCategory = customCategories.find((cat) => cat.id === categoryId);
  if (customCategory) return customCategory;

  // Buscar en categorías predeterminadas
  return DEFAULT_VEHICLE_CATEGORIES.find((cat) => cat.id === categoryId) || null;
};

/**
 * Obtener todas las categorías disponibles
 * @param {Array} customCategories - Categorías personalizadas del usuario
 * @returns {Array} - Lista combinada de categorías
 */
export const getAllCategories = (customCategories = []) => {
  const defaultIds = DEFAULT_VEHICLE_CATEGORIES.map((cat) => cat.id);
  const uniqueCustom = customCategories.filter((cat) => !defaultIds.includes(cat.id));

  return [...DEFAULT_VEHICLE_CATEGORIES, ...uniqueCustom];
};

/**
 * Validar estructura de categoría personalizada
 * @param {Object} category - Categoría a validar
 * @returns {Object} - {isValid: boolean, errors: Array}
 */
export const validateCategory = (category) => {
  const errors = [];

  if (!category.id || typeof category.id !== 'string') {
    errors.push('ID de categoría requerido y debe ser texto');
  }

  if (!category.name || typeof category.name !== 'string') {
    errors.push('Nombre de categoría requerido y debe ser texto');
  }

  if (category.name && category.name.length < 2) {
    errors.push('Nombre debe tener al menos 2 caracteres');
  }

  if (!category.uniqueCode || typeof category.uniqueCode !== 'string') {
    errors.push('Código único requerido y debe ser texto');
  }

  if (category.uniqueCode && category.uniqueCode.length < 3) {
    errors.push('Código único debe tener al menos 3 caracteres');
  }

  if (category.fuelTypes && !Array.isArray(category.fuelTypes)) {
    errors.push('Tipos de combustible debe ser un array');
  }

  if (category.fuelTypes && category.fuelTypes.length === 0) {
    errors.push('Debe seleccionar al menos un tipo de combustible');
  }

  if (category.fields && !Array.isArray(category.fields)) {
    errors.push('Campos debe ser un array');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generar ID único para nueva categoría
 * @param {string} name - Nombre de la categoría
 * @param {Array} existingCategories - Categorías existentes
 * @returns {string} - ID único
 */
export const generateCategoryId = (name, existingCategories = []) => {
  const baseId = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  let id = baseId;
  let counter = 1;

  while (existingCategories.some((cat) => cat.id === id)) {
    id = `${baseId}_${counter}`;
    counter++;
  }

  return id;
};

export default {
  DEFAULT_VEHICLE_CATEGORIES,
  VEHICLE_STATUS,
  FUEL_TYPES,
  AVAILABLE_FIELDS,
  getCategoryById,
  getAllCategories,
  validateCategory,
  generateCategoryId,
};

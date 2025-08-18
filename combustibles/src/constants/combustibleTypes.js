/**
 * Tipos de combustibles y constantes para la gestión de inventario forestal
 * IMPORTANTE: Los tipos de combustibles ahora se obtienen dinámicamente de Firebase
 * usando el hook useFuelTypes(). Estas constantes son solo fallbacks para tests
 * y compatibilidad cuando no hay conexión a Firebase.
 */

// -------------------------------------------------------------------
// FALLBACK: Tipos principales de combustibles - solo para tests y emergencias
// -------------------------------------------------------------------
export const FUEL_TYPES_FALLBACK = {
  ACPM: 'ACPM',
  GASOLINA_CORRIENTE: 'GASOLINA_CORRIENTE',
  GASOLINA_EXTRA: 'GASOLINA_EXTRA',
  JET_A1: 'JET_A1',
};

// Para compatibilidad temporal (DEPRECATED - usar useFuelTypes() hook)
export const FUEL_TYPES = FUEL_TYPES_FALLBACK;

// -------------------------------------------------------------------
// FALLBACK: Información detallada por tipo de combustible - solo para tests
// -------------------------------------------------------------------
export const FUEL_INFO_FALLBACK = {
  ACPM: {
    name: 'ACPM (Diesel)',
    icon: '⛽',
    unit: 'gal',
    density: 0.84,
    description: 'Aceite Combustible Para Motor - Diesel',
    color: '#2563EB',
  },
  GASOLINA_CORRIENTE: {
    name: 'Gasolina Corriente',
    icon: '⛽',
    unit: 'gal',
    density: 0.75,
    description: 'Gasolina Corriente - Octanaje 87',
    color: '#DC2626',
  },
  GASOLINA_EXTRA: {
    name: 'Gasolina Extra',
    icon: '⛽',
    unit: 'gal',
    density: 0.75,
    description: 'Gasolina Extra - Octanaje 95',
    color: '#7C3AED',
  },
  JET_A1: {
    name: 'Jet A-1',
    icon: '✈️',
    unit: 'gal',
    density: 0.8,
    description: 'Combustible para aeronaves',
    color: '#059669',
  },
};

// Para compatibilidad temporal (DEPRECATED - usar useFuelTypes() hook)
export const FUEL_INFO = FUEL_INFO_FALLBACK;

// Niveles de alerta de stock
export const STOCK_LEVELS = {
  CRITICAL: 'critical', // < 10%
  LOW: 'low', // 10-25%
  MEDIUM: 'medium', // 25-50%
  HIGH: 'high', // 50-75%
  FULL: 'full', // > 75%
};

// Información de alertas de stock
export const STOCK_ALERTS = {
  [STOCK_LEVELS.CRITICAL]: {
    label: 'Crítico',
    color: '#dc2626', // red-600
    icon: '🚨',
    threshold: 0.1,
  },
  [STOCK_LEVELS.LOW]: {
    label: 'Bajo',
    color: '#ea580c', // orange-600
    icon: '⚠️',
    threshold: 0.25,
  },
  [STOCK_LEVELS.MEDIUM]: {
    label: 'Medio',
    color: '#ca8a04', // yellow-600
    icon: '📊',
    threshold: 0.5,
  },
  [STOCK_LEVELS.HIGH]: {
    label: 'Alto',
    color: '#16a34a', // green-600
    icon: '✅',
    threshold: 0.75,
  },
  [STOCK_LEVELS.FULL]: {
    label: 'Completo',
    color: '#059669', // emerald-600
    icon: '🟢',
    threshold: 1.0,
  },
};

// Obtener nivel de stock basado en porcentaje
export const getStockLevel = (currentStock, maxCapacity) => {
  if (maxCapacity === 0) return STOCK_LEVELS.CRITICAL;

  const percentage = currentStock / maxCapacity;

  if (percentage < STOCK_ALERTS[STOCK_LEVELS.CRITICAL].threshold) return STOCK_LEVELS.CRITICAL;
  if (percentage < STOCK_ALERTS[STOCK_LEVELS.LOW].threshold) return STOCK_LEVELS.LOW;
  if (percentage < STOCK_ALERTS[STOCK_LEVELS.MEDIUM].threshold) return STOCK_LEVELS.MEDIUM;
  if (percentage < STOCK_ALERTS[STOCK_LEVELS.HIGH].threshold) return STOCK_LEVELS.HIGH;
  return STOCK_LEVELS.FULL;
};

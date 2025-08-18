/**
 * Tipos de combustibles y constantes para la gestión de inventario forestal
 * Incluye información detallada para cada tipo de combustible usado en operaciones forestales en Colombia.
 */

// -------------------------------------------------------------------
// Tipos principales de combustibles - estructura vacía para personalización
// -------------------------------------------------------------------
export const FUEL_TYPES = {
  // Los tipos se definirán cuando se agreguen combustibles desde la interfaz
};

// -------------------------------------------------------------------
// Información detallada por tipo de combustible - estructura vacía
// -------------------------------------------------------------------
export const FUEL_INFO = {
  // La información se llenará cuando se agreguen combustibles desde la interfaz
};

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

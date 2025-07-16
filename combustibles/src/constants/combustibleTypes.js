/**
 * Tipos de combustibles y constantes para la gestión de inventario forestal
 * Específico para operaciones forestales en Colombia
 */

// Tipos principales de combustibles
export const FUEL_TYPES = {
  DIESEL: 'diesel',
  GASOLINE: 'gasoline', 
  LUBRICANTS: 'lubricants',
  TWO_STROKE: 'two_stroke',
  MIXED: 'mixed'  // Agregado desde vehicleTypes.js para compatibilidad
};

// Información detallada por tipo de combustible
export const FUEL_INFO = {
  [FUEL_TYPES.DIESEL]: {
    name: 'Diésel',
    description: 'Combustible para maquinaria pesada',
    unit: 'galones',
    category: 'Combustible',
    color: '#fbbf24', // amber-400
    icon: '🚛',
    density: 0.85, // kg/L aproximado
    priceUnit: 'COP/galón'
  },
  [FUEL_TYPES.GASOLINE]: {
    name: 'Gasolina',
    description: 'Combustible para vehículos livianos',
    unit: 'galones',
    category: 'Combustible',
    color: '#ef4444', // red-500
    icon: '⛽',
    density: 0.75, // kg/L aproximado
    priceUnit: 'COP/galón'
  },
  [FUEL_TYPES.LUBRICANTS]: {
    name: 'Lubricantes',
    description: 'Aceites y lubricantes para mantenimiento',
    unit: 'litros',
    category: 'Mantenimiento',
    color: '#06b6d4', // cyan-500
    icon: '🛢️',
    density: 0.90, // kg/L aproximado
    priceUnit: 'COP/litro'
  },
  [FUEL_TYPES.TWO_STROKE]: {
    name: 'Mezcla 2T',
    description: 'Mezcla para motores de 2 tiempos (motosierras)',
    unit: 'litros',
    category: 'Especializado',
    color: '#10b981', // emerald-500
    icon: '🪚',
    density: 0.78, // kg/L aproximado
    priceUnit: 'COP/litro'
  },
  [FUEL_TYPES.MIXED]: {
    name: 'Mixto',
    description: 'Compatible con múltiples tipos de combustible',
    unit: 'galones',
    category: 'Flexible',
    color: '#64748b', // slate-500
    icon: '🔄',
    density: 0.80, // kg/L promedio
    priceUnit: 'COP/galón'
  }
};

// Niveles de alerta de stock
export const STOCK_LEVELS = {
  CRITICAL: 'critical',    // < 10%
  LOW: 'low',             // 10-25%
  MEDIUM: 'medium',       // 25-50%
  HIGH: 'high',           // 50-75%
  FULL: 'full'            // > 75%
};

// Información de alertas de stock
export const STOCK_ALERTS = {
  [STOCK_LEVELS.CRITICAL]: {
    label: 'Crítico',
    color: '#dc2626', // red-600
    icon: '🚨',
    threshold: 0.10
  },
  [STOCK_LEVELS.LOW]: {
    label: 'Bajo',
    color: '#ea580c', // orange-600
    icon: '⚠️',
    threshold: 0.25
  },
  [STOCK_LEVELS.MEDIUM]: {
    label: 'Medio',
    color: '#ca8a04', // yellow-600
    icon: '📊',
    threshold: 0.50
  },
  [STOCK_LEVELS.HIGH]: {
    label: 'Alto',
    color: '#16a34a', // green-600
    icon: '✅',
    threshold: 0.75
  },
  [STOCK_LEVELS.FULL]: {
    label: 'Completo',
    color: '#059669', // emerald-600
    icon: '🟢',
    threshold: 1.00
  }
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
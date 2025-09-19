/**
 * useStatusColors - Hook personalizado para gestión centralizada de colores de estado
 * Proporciona colores consistentes para diferentes estados en toda la aplicación
 *
 * Funcionalidades:
 * - Mapeo centralizado de estados a colores CSS variables
 * - Soporte para diferentes tipos de estados (vehículos, proveedores, movimientos, etc.)
 * - Función de fallback para estados no definidos
 * - Colores responsive que se adaptan al tema de la aplicación
 * - Utilidades para generar colores dinámicos
 *
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.3 useStatusColors Implementation
 * @date 2025-08-04
 */

import { useMemo } from 'react';

/**
 * Mapeos de estados a colores CSS variables
 */
const STATUS_COLOR_MAPS = {
  // Estados de vehículos - Nueva paleta
  vehicle: {
    activo: 'var(--color-teal)', // Teal para activo
    disponible: 'var(--color-teal-light)', // Teal claro para disponible
    en_uso: 'var(--color-verdigris)', // Verdigris para en uso
    mantenimiento: 'var(--color-warning)', // Naranja para mantenimiento
    reparacion: 'var(--color-rusty-red)', // Rusty Red para reparación
    inactivo: 'var(--color-rusty-red-light)', // Rusty Red claro para inactivo
    fuera_servicio: 'var(--color-rusty-red-dark)', // Rusty Red oscuro para fuera de servicio
    pendiente: 'var(--color-warning-light)', // Naranja claro para pendiente
  },

  // Estados de proveedores - Nueva paleta
  supplier: {
    active: 'var(--color-teal)',
    activo: 'var(--color-teal)',
    inactive: 'var(--color-neutral)',
    inactivo: 'var(--color-neutral)',
    suspended: 'var(--color-rusty-red)',
    suspendido: 'var(--color-rusty-red)',
    pending: 'var(--color-verdigris)',
    pendiente: 'var(--color-verdigris)',
    evaluation: 'var(--color-warning-light)',
    evaluacion: 'var(--color-warning-light)',
    preferred: 'var(--color-warning)', // Nuevo estado para proveedores preferidos
    preferido: 'var(--color-warning)',
  },

  // Estados de movimientos - Nueva paleta
  movement: {
    completed: 'var(--color-teal)',
    completado: 'var(--color-teal)',
    pending: 'var(--color-warning)',
    pendiente: 'var(--color-warning)',
    in_progress: 'var(--color-verdigris)',
    en_progreso: 'var(--color-verdigris)',
    cancelled: 'var(--color-rusty-red)',
    cancelado: 'var(--color-rusty-red)',
    error: 'var(--color-rusty-red-dark)',
    failed: 'var(--color-rusty-red-dark)',
    fallido: 'var(--color-rusty-red-dark)',
    entrada: 'var(--color-teal)', // Verde para entradas
    salida: 'var(--color-rusty-red)', // Rojo para salidas
    transferencia: 'var(--color-verdigris)', // Azul para transferencias
    ajuste: 'var(--color-warning)', // Naranja para ajustes
  },

  // Estados de inventario - Nueva paleta
  inventory: {
    available: 'var(--color-teal)',
    disponible: 'var(--color-teal)',
    low_stock: 'var(--color-warning)',
    stock_bajo: 'var(--color-warning)',
    out_of_stock: 'var(--color-rusty-red)',
    sin_stock: 'var(--color-rusty-red)',
    reserved: 'var(--color-verdigris)',
    reservado: 'var(--color-verdigris)',
    expired: 'var(--color-rusty-red-light)',
    vencido: 'var(--color-rusty-red-light)',
  },

  // Estados de mantenimiento - Nueva paleta
  maintenance: {
    scheduled: 'var(--color-verdigris)',
    programado: 'var(--color-verdigris)',
    in_progress: 'var(--color-warning)',
    en_progreso: 'var(--color-warning)',
    completed: 'var(--color-teal)',
    completado: 'var(--color-teal)',
    overdue: 'var(--color-rusty-red)',
    vencido: 'var(--color-rusty-red)',
    cancelled: 'var(--color-rusty-red-light)',
    cancelado: 'var(--color-rusty-red-light)',
  },

  // Estados de productos - Nueva paleta
  product: {
    active: 'var(--color-teal)',
    activo: 'var(--color-teal)',
    inactive: 'var(--color-neutral)',
    inactivo: 'var(--color-neutral)',
    discontinued: 'var(--color-rusty-red)',
    descontinuado: 'var(--color-rusty-red)',
    new: 'var(--color-verdigris)',
    nuevo: 'var(--color-verdigris)',
  },

  // Estados generales/por defecto - Nueva paleta
  general: {
    success: 'var(--color-teal)',
    exito: 'var(--color-teal)',
    warning: 'var(--color-warning)',
    advertencia: 'var(--color-warning)',
    error: 'var(--color-rusty-red)',
    info: 'var(--color-verdigris)',
    informacion: 'var(--color-verdigris)',
    neutral: 'var(--color-neutral)',
    primary: 'var(--forestech-primary)',
    principal: 'var(--forestech-primary)',
    secondary: 'var(--forestech-secondary)',
    secundario: 'var(--forestech-secondary)',
    accent: 'var(--forestech-accent)',
    acento: 'var(--forestech-accent)',
  },
};

/**
 * Colores de fallback para estados no definidos
 */
const FALLBACK_COLORS = {
  default: 'var(--text-muted)',
  positive: 'var(--color-teal)',
  negative: 'var(--color-rusty-red)',
  neutral: 'var(--color-verdigris)',
  warning: 'var(--color-warning)',
};

/**
 * Clasificar estado por positividad
 */
const classifyStatus = (status) => {
  const lowerStatus = status.toLowerCase();

  // Estados positivos
  const positiveStates = [
    'activo',
    'active',
    'disponible',
    'available',
    'completado',
    'completed',
    'exito',
    'success',
    'operativo',
    'operational',
    'nuevo',
    'new',
  ];

  // Estados negativos
  const negativeStates = [
    'inactivo',
    'inactive',
    'error',
    'fallido',
    'failed',
    'cancelado',
    'cancelled',
    'fuera_servicio',
    'out_of_service',
    'vencido',
    'expired',
    'sin_stock',
    'out_of_stock',
  ];

  // Estados de advertencia
  const warningStates = [
    'mantenimiento',
    'maintenance',
    'reparacion',
    'repair',
    'pendiente',
    'pending',
    'advertencia',
    'warning',
    'stock_bajo',
    'low_stock',
    'vencido',
    'overdue',
  ];

  if (positiveStates.some((state) => lowerStatus.includes(state))) {
    return 'positive';
  }

  if (negativeStates.some((state) => lowerStatus.includes(state))) {
    return 'negative';
  }

  if (warningStates.some((state) => lowerStatus.includes(state))) {
    return 'warning';
  }

  return 'neutral';
};

/**
 * Hook useStatusColors principal
 */
const useStatusColors = (type = 'general') => {
  // Memoizar mapas de colores para performance
  const colorMap = useMemo(() => {
    return STATUS_COLOR_MAPS[type] || STATUS_COLOR_MAPS.general;
  }, [type]);

  /**
   * Obtener color para un estado específico
   */
  const getStatusColor = useMemo(() => {
    return (status, fallbackType = 'neutral') => {
      if (!status) return FALLBACK_COLORS[fallbackType] || FALLBACK_COLORS.default;

      const normalizedStatus = status.toString().toLowerCase().trim();

      // Buscar color directo en el mapa
      const directColor = colorMap[normalizedStatus];
      if (directColor) return directColor;

      // Buscar en todos los mapas si no está en el tipo específico
      for (const mapType of Object.keys(STATUS_COLOR_MAPS)) {
        const color = STATUS_COLOR_MAPS[mapType][normalizedStatus];
        if (color) return color;
      }

      // Usar clasificación automática como fallback
      const classification = classifyStatus(normalizedStatus);
      return FALLBACK_COLORS[classification] || FALLBACK_COLORS.default;
    };
  }, [colorMap]);

  /**
   * Obtener múltiples colores de estado
   */
  const getMultipleStatusColors = useMemo(() => {
    return (statuses) => {
      if (!Array.isArray(statuses)) return {};

      return statuses.reduce((colors, status) => {
        colors[status] = getStatusColor(status);
        return colors;
      }, {});
    };
  }, [getStatusColor]);

  /**
   * Generar color dinámico basado en hash (para tipos no definidos)
   */
  const generateDynamicColor = useMemo(() => {
    return (text, colorPalette = 'default') => {
      if (!text) return FALLBACK_COLORS.default;

      // Paletas de colores predefinidas
      const palettes = {
        default: [
          'var(--color-primary)',
          'var(--color-secondary)',
          'var(--color-info)',
          'var(--color-warning)',
          'var(--color-success)',
        ],
        soft: [
          'var(--color-primary-light)',
          'var(--color-secondary-light)',
          'var(--color-info-light)',
          'var(--color-warning-light)',
          'var(--color-success-light)',
        ],
        vibrant: [
          'var(--color-primary-dark)',
          'var(--color-secondary-dark)',
          'var(--color-info-dark)',
          'var(--color-warning-dark)',
          'var(--color-success-dark)',
        ],
      };

      const colors = palettes[colorPalette] || palettes.default;

      // Generar hash simple pero consistente
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
      }

      return colors[Math.abs(hash) % colors.length];
    };
  }, []);

  /**
   * Verificar si un estado es positivo/negativo
   */
  const isPositiveStatus = useMemo(() => {
    return (status) => {
      const classification = classifyStatus(status);
      return classification === 'positive';
    };
  }, []);

  const isNegativeStatus = useMemo(() => {
    return (status) => {
      const classification = classifyStatus(status);
      return classification === 'negative';
    };
  }, []);

  const isWarningStatus = useMemo(() => {
    return (status) => {
      const classification = classifyStatus(status);
      return classification === 'warning';
    };
  }, []);

  /**
   * Obtener lista de estados disponibles para el tipo actual
   */
  const getAvailableStatuses = useMemo(() => {
    return Object.keys(colorMap);
  }, [colorMap]);

  /**
   * Obtener estadísticas de colores para un conjunto de datos
   */
  const getColorStats = useMemo(() => {
    return (data, statusField = 'status') => {
      if (!Array.isArray(data)) return {};

      const stats = {};

      data.forEach((item) => {
        const status = item[statusField];
        if (!status) return;

        if (!stats[status]) {
          stats[status] = {
            count: 0,
            color: getStatusColor(status),
            classification: classifyStatus(status),
          };
        }

        stats[status].count++;
      });

      return stats;
    };
  }, [getStatusColor]);

  return {
    // Función principal
    getStatusColor,

    // Funciones auxiliares
    getMultipleStatusColors,
    generateDynamicColor,

    // Funciones de clasificación
    isPositiveStatus,
    isNegativeStatus,
    isWarningStatus,

    // Utilidades
    getAvailableStatuses,
    getColorStats,

    // Colores de fallback
    fallbackColors: FALLBACK_COLORS,

    // Mapas completos (para debugging/desarrollo)
    colorMaps: STATUS_COLOR_MAPS,
    currentColorMap: colorMap,
  };
};

/**
 * Hook especializado para vehículos
 */
export const useVehicleStatusColors = () => {
  return useStatusColors('vehicle');
};

/**
 * Hook especializado para proveedores
 */
export const useSupplierStatusColors = () => {
  return useStatusColors('supplier');
};

/**
 * Hook especializado para movimientos
 */
export const useMovementStatusColors = () => {
  return useStatusColors('movement');
};

/**
 * Hook especializado para inventario
 */
export const useInventoryStatusColors = () => {
  return useStatusColors('inventory');
};

/**
 * Hook especializado para mantenimiento
 */
export const useMaintenanceStatusColors = () => {
  return useStatusColors('maintenance');
};

/**
 * Hook especializado para productos
 */
export const useProductStatusColors = () => {
  return useStatusColors('product');
};

// Export por defecto
export default useStatusColors;

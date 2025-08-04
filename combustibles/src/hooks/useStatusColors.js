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
  // Estados de vehículos
  vehicle: {
    'activo': 'var(--color-success)',
    'disponible': 'var(--color-success-light)',
    'en_uso': 'var(--color-info)',
    'mantenimiento': 'var(--color-warning)',
    'reparacion': 'var(--color-error)',
    'inactivo': 'var(--color-error-light)',
    'fuera_servicio': 'var(--color-error-dark)',
    'pendiente': 'var(--color-warning-light)'
  },

  // Estados de proveedores
  supplier: {
    'active': 'var(--color-success)',
    'activo': 'var(--color-success)',
    'inactive': 'var(--color-error)',
    'inactivo': 'var(--color-error)',
    'suspended': 'var(--color-warning)',
    'suspendido': 'var(--color-warning)',
    'pending': 'var(--color-info)',
    'pendiente': 'var(--color-info)',
    'evaluation': 'var(--color-warning-light)',
    'evaluacion': 'var(--color-warning-light)'
  },

  // Estados de movimientos
  movement: {
    'completed': 'var(--color-success)',
    'completado': 'var(--color-success)',
    'pending': 'var(--color-warning)',
    'pendiente': 'var(--color-warning)',
    'in_progress': 'var(--color-info)',
    'en_progreso': 'var(--color-info)',
    'cancelled': 'var(--color-error)',
    'cancelado': 'var(--color-error)',
    'error': 'var(--color-error-dark)',
    'failed': 'var(--color-error-dark)',
    'fallido': 'var(--color-error-dark)'
  },

  // Estados de inventario
  inventory: {
    'available': 'var(--color-success)',
    'disponible': 'var(--color-success)',
    'low_stock': 'var(--color-warning)',
    'stock_bajo': 'var(--color-warning)',
    'out_of_stock': 'var(--color-error)',
    'sin_stock': 'var(--color-error)',
    'reserved': 'var(--color-info)',
    'reservado': 'var(--color-info)',
    'expired': 'var(--color-error-light)',
    'vencido': 'var(--color-error-light)'
  },

  // Estados de mantenimiento
  maintenance: {
    'scheduled': 'var(--color-info)',
    'programado': 'var(--color-info)',
    'in_progress': 'var(--color-warning)',
    'en_progreso': 'var(--color-warning)',
    'completed': 'var(--color-success)',
    'completado': 'var(--color-success)',
    'overdue': 'var(--color-error)',
    'vencido': 'var(--color-error)',
    'cancelled': 'var(--color-error-light)',
    'cancelado': 'var(--color-error-light)'
  },

  // Estados de productos
  product: {
    'active': 'var(--color-success)',
    'activo': 'var(--color-success)',
    'inactive': 'var(--color-error-light)',
    'inactivo': 'var(--color-error-light)',
    'discontinued': 'var(--color-error)',
    'descontinuado': 'var(--color-error)',
    'new': 'var(--color-info)',
    'nuevo': 'var(--color-info)'
  },

  // Estados generales/por defecto
  general: {
    'success': 'var(--color-success)',
    'exito': 'var(--color-success)',
    'warning': 'var(--color-warning)',
    'advertencia': 'var(--color-warning)',
    'error': 'var(--color-error)',
    'info': 'var(--color-info)',
    'informacion': 'var(--color-info)',
    'neutral': 'var(--color-neutral)',
    'primary': 'var(--color-primary)',
    'principal': 'var(--color-primary)',
    'secondary': 'var(--color-secondary)',
    'secundario': 'var(--color-secondary)'
  }
};

/**
 * Colores de fallback para estados no definidos
 */
const FALLBACK_COLORS = {
  default: 'var(--text-muted)',
  positive: 'var(--color-success)',
  negative: 'var(--color-error)',
  neutral: 'var(--color-info)',
  warning: 'var(--color-warning)'
};

/**
 * Clasificar estado por positividad
 */
const classifyStatus = (status) => {
  const lowerStatus = status.toLowerCase();
  
  // Estados positivos
  const positiveStates = [
    'activo', 'active', 'disponible', 'available', 'completado', 'completed',
    'exito', 'success', 'operativo', 'operational', 'nuevo', 'new'
  ];
  
  // Estados negativos
  const negativeStates = [
    'inactivo', 'inactive', 'error', 'fallido', 'failed', 'cancelado', 'cancelled',
    'fuera_servicio', 'out_of_service', 'vencido', 'expired', 'sin_stock', 'out_of_stock'
  ];
  
  // Estados de advertencia
  const warningStates = [
    'mantenimiento', 'maintenance', 'reparacion', 'repair', 'pendiente', 'pending',
    'advertencia', 'warning', 'stock_bajo', 'low_stock', 'vencido', 'overdue'
  ];
  
  if (positiveStates.some(state => lowerStatus.includes(state))) {
    return 'positive';
  }
  
  if (negativeStates.some(state => lowerStatus.includes(state))) {
    return 'negative';
  }
  
  if (warningStates.some(state => lowerStatus.includes(state))) {
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
          'var(--color-success)'
        ],
        soft: [
          'var(--color-primary-light)',
          'var(--color-secondary-light)',
          'var(--color-info-light)',
          'var(--color-warning-light)',
          'var(--color-success-light)'
        ],
        vibrant: [
          'var(--color-primary-dark)',
          'var(--color-secondary-dark)',
          'var(--color-info-dark)',
          'var(--color-warning-dark)',
          'var(--color-success-dark)'
        ]
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
      
      data.forEach(item => {
        const status = item[statusField];
        if (!status) return;
        
        if (!stats[status]) {
          stats[status] = {
            count: 0,
            color: getStatusColor(status),
            classification: classifyStatus(status)
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
    currentColorMap: colorMap
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
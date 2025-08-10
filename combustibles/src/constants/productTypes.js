/**
 * Constantes para tipos de productos/combustibles
 * Sistema dinámico expandido con 9 productos predefinidos
 */

export const PRODUCT_TYPES = {
  DIESEL: 'DIESEL',
  GASOLINA: 'GASOLINA',
  /**
   * Constantes para tipos de productos/combustibles
   * Sistema dinámico expandido con 9 productos predefinidos.
   * Cada bloque está documentado para facilitar el mantenimiento y la extensión.
   */
  ACEITE_HIDRAULICO: 'ACEITE_HIDRAULICO',
  ACEITE_MOTOR_20W50: 'ACEITE_MOTOR_20W50',
  // Tipos de productos principales utilizados en la app
  VALVULINA: 'VALVULINA',
  LIQUIDO_FRENOS: 'LIQUIDO_FRENOS',
  // Información detallada de cada producto, incluyendo nombre, categoría, unidad, color, ícono y descripción
  ACEITE_TRACTORES_15W40: 'ACEITE_TRACTORES_15W40',
};

export const PRODUCT_INFO = {
  [PRODUCT_TYPES.DIESEL]: {
    name: 'DIESEL',
    displayName: 'Diesel 🚛',
    category: 'Combustible',
    unit: 'gal',
    defaultPrice: 12500,
    color: '#FF6B35',
    icon: '🚛',
    description: 'Combustible diesel para vehículos pesados',
  },
  [PRODUCT_TYPES.GASOLINA]: {
    name: 'GASOLINA',
    displayName: 'Gasolina 🚗',
    category: 'Combustible',
    unit: 'gal',
    defaultPrice: 14200,
    color: '#4CAF50',
    icon: '🚗',
    description: 'Gasolina corriente para vehículos livianos',
  },
  [PRODUCT_TYPES.ACEITE_HIDRAULICO]: {
    name: 'ACEITE_HIDRAULICO',
    displayName: 'Aceite Hidráulico 🔧',
    category: 'Aceite',
    unit: 'L',
    defaultPrice: 28000,
    color: '#2196F3',
    icon: '🔧',
    description: 'Aceite hidráulico para sistemas de maquinaria',
  },
  [PRODUCT_TYPES.ACEITE_MOTOR_20W50]: {
    name: 'ACEITE_MOTOR_20W50',
    displayName: 'Aceite Motor 20W50 🛢️',
    category: 'Aceite',
    unit: 'L',
    defaultPrice: 35000,
    color: '#FF9800',
    icon: '🛢️',
    description: 'Aceite multigrado para motores',
  },
  [PRODUCT_TYPES.GRASA_ROJA]: {
    name: 'GRASA_ROJA',
    displayName: 'Grasa Roja 🟥',
    category: 'Lubricante',
    unit: 'kg',
    defaultPrice: 12000,
    color: '#F44336',
    icon: '🟥',
    description: 'Grasa lubricante multipropósito',
  },
  [PRODUCT_TYPES.VALVULINA]: {
    name: 'VALVULINA',
    displayName: 'Valvulina ⚙️',
    category: 'Aceite',
    unit: 'L',
    defaultPrice: 25000,
    color: '#9C27B0',
    icon: '⚙️',
    description: 'Aceite para transmisiones y diferenciales',
  },
  [PRODUCT_TYPES.LIQUIDO_FRENOS]: {
    name: 'LIQUIDO_FRENOS',
    displayName: 'Líquido para Frenos 🛑',
    category: 'Fluido',
    unit: 'L',
    defaultPrice: 18000,
    color: '#E91E63',
    icon: '🛑',
    description: 'Líquido de frenos DOT 3/4',
  },
  [PRODUCT_TYPES.MISTURA_LIGA]: {
    name: 'MISTURA_LIGA',
    displayName: 'Mistura o Liga 🌿',
    category: 'Combustible',
    unit: 'L',
    defaultPrice: 8500,
    color: '#4CAF50',
    icon: '🌿',
    description: 'Mezcla de combustible para equipos menores',
  },
  [PRODUCT_TYPES.ACEITE_TRACTORES_15W40]: {
    name: 'ACEITE_TRACTORES_15W40',
    displayName: 'Aceite Tractores 15W40 🚜',
    category: 'Aceite',
    unit: 'L',
    defaultPrice: 32000,
    color: '#795548',
    icon: '🚜',
    description: 'Aceite especializado para tractores',
  },
};

export const PRODUCT_CATEGORIES = {
  COMBUSTIBLE: 'Combustible',
  ACEITE: 'Aceite',
  LUBRICANTE: 'Lubricante',
  FLUIDO: 'Fluido',
};

// Función helper para obtener productos por categoría
export const getProductsByCategory = (category) => {
  return Object.values(PRODUCT_INFO).filter((product) => product.category === category);
};

// Función helper para obtener todos los productos como array
export const getAllProducts = () => {
  return Object.values(PRODUCT_INFO);
};

// Función helper para obtener información de un producto
export const getProductInfo = (productType) => {
  return PRODUCT_INFO[productType] || null;
};

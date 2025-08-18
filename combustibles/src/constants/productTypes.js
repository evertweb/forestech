/**
 * Constantes para tipos de productos/combustibles
 * Sistema dinámico - estructura lista para crear productos personalizados
 */

// Contenedor vacío para tipos de productos - se llenarán dinámicamente
export const PRODUCT_TYPES = {
  // Los tipos se crearán cuando se agreguen productos desde la interfaz
};

// Contenedor vacío para información de productos - se llenará dinámicamente
export const PRODUCT_INFO = {
  // La información se creará cuando se agreguen productos desde la interfaz
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

/**
 * Tipos de vehículos y maquinaria forestal
 * Específico para operaciones forestales en Colombia.
 * Cada bloque está documentado para facilitar el mantenimiento y la extensión.
 */

// Categorías principales de vehículos utilizados en la app
export const VEHICLE_CATEGORIES = {
  HARVESTING: 'harvesting', // Cosecha
  TRANSPORT: 'transport', // Transporte
  MAINTENANCE: 'maintenance', // Mantenimiento
  SUPPORT: 'support', // Apoyo
};

// Tipos específicos de vehículos/maquinaria - estructura vacía para personalización
export const VEHICLE_TYPES = {
  // Los tipos se definirán cuando se agreguen vehículos desde la interfaz
};

// Información detallada por tipo de vehículo - estructura vacía para personalización
export const VEHICLE_INFO = {
  // La información se llenará cuando se agreguen vehículos desde la interfaz
};

// Configuración de compatibilidad de combustibles para vehículos
export const FUEL_COMPATIBILITY = {
  DIESEL: 'DIESEL',
  GASOLINE: 'GASOLINE',
  TWO_STROKE: 'TWO_STROKE', // Mezcla 2 tiempos
  MIXED: 'MIXED', // Compatible con múltiples combustibles
};

// Helper function para obtener información de un vehículo
export const getVehicleInfo = (vehicleType) => {
  return VEHICLE_INFO[vehicleType] || null;
};

// Helper function para obtener vehículos por categoría
export const getVehiclesByCategory = (category) => {
  return Object.entries(VEHICLE_INFO)
    .filter(([, info]) => info.category === category)
    .map(([type, info]) => ({ type, ...info }));
};

// Helper function para obtener vehículos por tipo de combustible
export const getVehiclesByFuelType = (fuelType) => {
  return Object.entries(VEHICLE_INFO)
    .filter(([, info]) => info.fuelType === fuelType)
    .map(([type, info]) => ({ type, ...info }));
};

// src/constants/locations.js

/**
 * Ubicaciones operativas predefinidas para la gestión de combustibles.
 * Centralizar esta lista previene inconsistencias y errores de tipeo.
 * Se normalizan a minúsculas para consistencia en la base de datos.
 */
export const OPERATIONAL_LOCATIONS = [
  'principal',
  'campamento austria',
  'campamento ilusion',
  'bodega austria',
  'bodega ilusion',
  'campo operativo',
  'estación móvil',
];

/**
 * Formatea un nombre de ubicación para mostrarlo en la UI.
 * @param {string} location - El nombre de la ubicación en minúsculas.
 * @returns {string} - El nombre formateado con mayúsculas.
 */
export const formatLocationName = (location) => {
  if (!location) return '';
  return location
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default OPERATIONAL_LOCATIONS;

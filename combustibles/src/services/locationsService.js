/**
 * locationsService.js - Servicio unificado para manejo de ubicaciones
 *
 * Este servicio unifica el manejo de ubicaciones que anteriormente estaban:
 * - Hardcodeadas en constants/locations.js
 * - Extraídas dinámicamente del inventario en reportes
 * - Usadas como texto libre en formularios
 *
 * Ahora centraliza todas las ubicaciones reales desde Firebase
 */

import { getAllInventoryItems } from './inventoryService';

/**
 * Obtener todas las ubicaciones únicas desde el inventario existente
 * @returns {Promise<Object>} - {success: boolean, data: string[], error?: string}
 */
export const getAllLocations = async () => {
  try {
    // Obtener inventario completo
    const inventoryResult = await getAllInventoryItems();

    if (!inventoryResult.success) {
      return {
        success: false,
        error: 'No se pudo obtener el inventario para extraer ubicaciones',
        data: [],
      };
    }

    // Extraer ubicaciones únicas del inventario
    const inventory = inventoryResult.data || [];
    const uniqueLocations = [
      ...new Set(
        inventory
          .map((item) => item.location)
          .filter((location) => location && location.trim().length > 0)
          .map((location) => location.toLowerCase().trim()) // Normalizar
      ),
    ];

    return {
      success: true,
      data: uniqueLocations.sort(), // Ordenar alfabéticamente
      count: uniqueLocations.length,
    };
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    return {
      success: false,
      error: error.message || 'Error al cargar ubicaciones',
      data: [],
    };
  }
};

/**
 * Obtener ubicaciones con información adicional (stock por ubicación)
 * @returns {Promise<Object>} - {success: boolean, data: Object[], error?: string}
 */
export const getLocationsWithDetails = async () => {
  try {
    const inventoryResult = await getAllInventoryItems();

    if (!inventoryResult.success) {
      return {
        success: false,
        error: 'No se pudo obtener el inventario',
        data: [],
      };
    }

    const inventory = inventoryResult.data || [];
    const locationDetails = {};

    // Agrupar por ubicación y calcular estadísticas
    inventory.forEach((item) => {
      const location = item.location?.toLowerCase()?.trim();
      if (!location) return;

      if (!locationDetails[location]) {
        locationDetails[location] = {
          name: location,
          displayName: formatLocationName(location),
          totalItems: 0,
          totalCurrentStock: 0,
          totalMaxCapacity: 0,
          fuelTypes: new Set(),
          items: [],
        };
      }

      const detail = locationDetails[location];
      detail.totalItems++;
      detail.totalCurrentStock += Number(item.currentStock) || 0;
      detail.totalMaxCapacity += Number(item.maxCapacity) || 0;
      detail.fuelTypes.add(item.fuelType);
      detail.items.push({
        id: item.id,
        fuelType: item.fuelType,
        currentStock: item.currentStock,
        maxCapacity: item.maxCapacity,
        status: item.status,
      });
    });

    // Convertir Set a Array y calcular porcentajes
    const locationsArray = Object.values(locationDetails).map((location) => ({
      ...location,
      fuelTypes: Array.from(location.fuelTypes),
      fillPercentage:
        location.totalMaxCapacity > 0
          ? (location.totalCurrentStock / location.totalMaxCapacity) * 100
          : 0,
      status: getLocationStatus(location.totalCurrentStock, location.totalMaxCapacity),
    }));

    return {
      success: true,
      data: locationsArray.sort((a, b) => a.name.localeCompare(b.name)),
      count: locationsArray.length,
    };
  } catch (error) {
    console.error('Error al obtener detalles de ubicaciones:', error);
    return {
      success: false,
      error: error.message || 'Error al cargar detalles de ubicaciones',
      data: [],
    };
  }
};

/**
 * Verificar si una ubicación tiene stock disponible para un tipo de combustible
 * @param {string} location - Nombre de la ubicación
 * @param {string} fuelType - Tipo de combustible
 * @returns {Promise<Object>} - {success: boolean, data: Object, error?: string}
 */
export const getLocationStock = async (location, fuelType) => {
  try {
    if (!location || !fuelType) {
      return {
        success: false,
        error: 'Ubicación y tipo de combustible son requeridos',
        data: { available: 0, maxCapacity: 0, status: 'empty' },
      };
    }

    const inventoryResult = await getAllInventoryItems();

    if (!inventoryResult.success) {
      return {
        success: false,
        error: 'No se pudo verificar el stock',
        data: { available: 0, maxCapacity: 0, status: 'empty' },
      };
    }

    const inventory = inventoryResult.data || [];

    // Buscar items que coincidan con ubicación y tipo de combustible
    const matchingItems = inventory.filter(
      (item) =>
        item.location?.toLowerCase()?.trim() === location.toLowerCase().trim() &&
        item.fuelType?.toUpperCase() === fuelType.toUpperCase() &&
        item.status === 'active'
    );

    const totalAvailable = matchingItems.reduce(
      (sum, item) => sum + (Number(item.currentStock) || 0),
      0
    );

    const totalCapacity = matchingItems.reduce(
      (sum, item) => sum + (Number(item.maxCapacity) || 0),
      0
    );

    const status = getLocationStatus(totalAvailable, totalCapacity);
    const percentage = totalCapacity > 0 ? (totalAvailable / totalCapacity) * 100 : 0;

    return {
      success: true,
      data: {
        available: totalAvailable,
        maxCapacity: totalCapacity,
        status,
        percentage,
        message: generateStockMessage(totalAvailable, status),
        itemsCount: matchingItems.length,
      },
    };
  } catch (error) {
    console.error('Error al verificar stock de ubicación:', error);
    return {
      success: false,
      error: error.message || 'Error al verificar stock',
      data: { available: 0, maxCapacity: 0, status: 'error' },
    };
  }
};

/**
 * Formatear nombre de ubicación para mostrar en UI
 * @param {string} location - Nombre de ubicación en minúsculas
 * @returns {string} - Nombre formateado
 */
export const formatLocationName = (location) => {
  if (!location || typeof location !== 'string') return '';

  return location
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Validar si una ubicación es válida
 * @param {string} location - Nombre de ubicación
 * @returns {Promise<Object>} - {isValid: boolean, exists: boolean, error?: string}
 */
export const validateLocation = async (location) => {
  try {
    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      return {
        isValid: false,
        exists: false,
        error: 'El nombre de ubicación es requerido',
      };
    }

    const locationsResult = await getAllLocations();

    if (!locationsResult.success) {
      return {
        isValid: true, // Permitir si no podemos verificar
        exists: false,
        error: 'No se pudo verificar si la ubicación existe',
      };
    }

    const normalizedInput = location.toLowerCase().trim();
    const exists = locationsResult.data.includes(normalizedInput);

    return {
      isValid: true,
      exists,
      suggestedName: exists ? normalizedInput : null,
    };
  } catch (error) {
    console.error('Error al validar ubicación:', error);
    return {
      isValid: true, // Permitir si hay error
      exists: false,
      error: error.message,
    };
  }
};

// Funciones auxiliares privadas

/**
 * Determinar el estado de una ubicación basado en stock
 */
const getLocationStatus = (currentStock, maxCapacity) => {
  if (currentStock === 0) return 'empty';
  if (maxCapacity === 0) return 'unknown';

  const percentage = (currentStock / maxCapacity) * 100;

  if (percentage < 20) return 'low';
  if (percentage < 50) return 'medium';
  if (percentage < 80) return 'good';
  return 'excellent';
};

/**
 * Generar mensaje descriptivo del stock
 */
const generateStockMessage = (available, status) => {
  if (available === 0) return 'Sin combustible disponible';

  const roundedStock = Math.floor(available);

  switch (status) {
    case 'low':
      return `${roundedStock} gal (stock bajo)`;
    case 'medium':
      return `${roundedStock} gal (stock medio)`;
    case 'good':
      return `${roundedStock} gal disponibles`;
    case 'excellent':
      return `${roundedStock} gal (excelente stock)`;
    default:
      return `${roundedStock} galones disponibles`;
  }
};

export default {
  getAllLocations,
  getLocationsWithDetails,
  getLocationStock,
  formatLocationName,
  validateLocation,
};

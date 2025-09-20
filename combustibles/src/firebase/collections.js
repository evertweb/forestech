/**
 * Constantes de colecciones Firebase para Forestech Combustibles
 */

// Colecciones principales
export const COLLECTIONS = {
  USERS: 'users',
  MOVEMENTS: 'combustibles_movements',
  INVENTORY: 'combustibles_inventory',
  VEHICLES: 'combustibles_vehicles',
  SUPPLIERS: 'combustibles_suppliers',
  VEHICLE_CATEGORIES: 'combustibles_vehicle_categories',
  FUEL_TYPES: 'combustibles_fuel_types',
  PRODUCT_CATEGORIES: 'product_categories',
  PRODUCTS: 'products',
  MAINTENANCE: 'combustibles_maintenance',
  HOUR_METER: 'combustibles_hour_meter',
  INVITATIONS: 'invitations',
};

// Rutas de documentos con variables de entorno
export const getCollectionPath = (collectionName) => {
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;
  return `artifacts/${appId}/${collectionName}`;
};

// Funciones específicas para cada colección
export const getUsersCollection = () => getCollectionPath(COLLECTIONS.USERS);
export const getMovementsCollection = () => getCollectionPath(COLLECTIONS.MOVEMENTS);
export const getInventoryCollection = () => getCollectionPath(COLLECTIONS.INVENTORY);
export const getVehiclesCollection = () => getCollectionPath(COLLECTIONS.VEHICLES);
export const getSuppliersCollection = () => getCollectionPath(COLLECTIONS.SUPPLIERS);
export const getVehicleCategoriesCollection = () => getCollectionPath(COLLECTIONS.VEHICLE_CATEGORIES);
export const getFuelTypesCollection = () => getCollectionPath(COLLECTIONS.FUEL_TYPES);
export const getProductCategoriesCollection = () => getCollectionPath(COLLECTIONS.PRODUCT_CATEGORIES);
export const getProductsCollection = () => getCollectionPath(COLLECTIONS.PRODUCTS);
export const getMaintenanceCollection = () => getCollectionPath(COLLECTIONS.MAINTENANCE);
export const getHourMeterCollection = () => getCollectionPath(COLLECTIONS.HOUR_METER);
export const getInvitationsCollection = () => getCollectionPath(COLLECTIONS.INVITATIONS);

export default COLLECTIONS;
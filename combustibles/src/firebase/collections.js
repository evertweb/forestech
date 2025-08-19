// Definición centralizada de nombres de colecciones de Firestore para la app Combustibles
// Mantener sincronizado con servicios como dataResetService y migraciones

export const COLLECTIONS = {
  VEHICLES: 'combustibles_vehicles',
  MOVEMENTS: 'combustibles_movements',
  PRODUCTS: 'combustibles_products',
  INVENTORY: 'combustibles_inventory',
  SUPPLIERS: 'combustibles_suppliers',
  MAINTENANCE: 'combustibles_maintenance',
  VEHICLE_CATEGORIES: 'combustibles_vehicle_categories',
  PRODUCT_CATEGORIES: 'productCategories',
  MIGRATION_ALIASES: 'combustibles_migration_aliases',
  MIGRATION_LOG: 'migration_logs',
};

export default COLLECTIONS;

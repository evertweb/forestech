import { onCall, HttpsError } from 'firebase-functions/v1/https';

import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  getVehicleByCode,
  updateVehicle,
  deleteVehicle,
  getVehiclesStats
} from './src/sql/vehiclesService.js';

import {
  recordHourMeterReading,
  getHourMeterHistory as fetchHourMeterHistory,
  getHourMeterSummary,
  initializeHourMeter,
  getHourMeterStats,
  validateHourMeterForMovement
} from './src/sql/hourMeterService.js';

import {
  createMaintenanceRecord,
  getAllMaintenanceRecords,
  getMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceByVehicle,
  getUpcomingMaintenance,
  getMaintenanceStats
} from './src/sql/maintenanceService.js';

import {
  createInventoryItem,
  getAllInventory,
  getInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryByLocation,
  updateStock as updateInventoryStock,
  getLowStockItems,
  getInventorySummary
} from './src/sql/inventoryService.js';

import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  updateSupplierStats,
  getPreferredSuppliers,
  getSuppliersStats
} from './src/sql/suppliersService.js';

import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getActiveProducts,
  updateProductStock,
  searchProducts,
  getLowStockProducts,
  getProductByCode
} from './src/sql/productsService.js';

import {
  createCategory,
  getAllCategories,
  getCategory,
  getCategoryByCode,
  updateCategory,
  deleteCategory,
  updateVehicleCount,
  reorderCategories,
  getActiveCategories,
  getCategoryStats
} from './src/sql/vehicleCategoriesService.js';

import {
  createMovement,
  getAllMovements,
  getMovement,
  updateMovement,
  deleteMovement,
  getMovementsStats
} from './src/sql/movementsService.js';

const unsupported = (action) => {
  return {
    success: false,
    error: `Acción "${action}" no implementada todavía en Firebase Functions`,
    code: 'NOT_IMPLEMENTED'
  };
};

const getUserContext = (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Se requiere un usuario autenticado para esta operación.');
  }

  const { uid, token } = request.auth;
  return {
    uid,
    email: token?.email || null,
    displayName: token?.name || token?.email || null,
    claims: token || {}
  };
};

const safeExecute = async (actionName, handler) => {
  try {
    return await handler();
  } catch (error) {
    console.error(`❌ Error en acción ${actionName}:`, error);

    if (error instanceof HttpsError) {
      throw error;
    }

    throw new HttpsError('internal', error.message || 'Error interno del servidor');
  }
};

export const combustiblesVehicles = onCall(async (request) => {
  const { action, data = {} } = request.data || {};

  if (!action) {
    throw new HttpsError('invalid-argument', 'El parámetro "action" es requerido.');
  }

  const user = getUserContext(request);

  switch (action) {
    case 'create':
      return safeExecute(action, async () => {
        const { vehicleData } = data;
        if (!vehicleData) {
          throw new HttpsError('invalid-argument', 'vehicleData es requerido.');
        }
        return await createVehicle(vehicleData, user);
      });

    case 'getAll':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getAllVehicles(filters);
      });

    case 'get':
    case 'getById':
      return safeExecute(action, async () => {
        const vehicleId = data.vehicleId || data.id;
        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }
        return await getVehicleById(vehicleId);
      });

    case 'getByCode':
      return safeExecute(action, async () => {
        const vehicleCode = data.vehicleCode || data.vehicleId || data.code;
        if (!vehicleCode) {
          throw new HttpsError('invalid-argument', 'vehicleCode es requerido.');
        }
        return await getVehicleByCode(vehicleCode);
      });

    case 'update':
      return safeExecute(action, async () => {
        const vehicleId = data.vehicleId || data.id;
        const updateData = data.updateData || data.updates;

        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }

        if (!updateData || typeof updateData !== 'object') {
          throw new HttpsError('invalid-argument', 'updateData es requerido.');
        }

        return await updateVehicle(vehicleId, updateData, user);
      });

    case 'delete':
      return safeExecute(action, async () => {
        const vehicleId = data.vehicleId || data.id;
        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }
        return await deleteVehicle(vehicleId);
      });

    case 'getStats':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getVehiclesStats(filters);
      });

    case 'updateHourMeter':
      return safeExecute(action, async () => {
        const vehicleCode = data.vehicleCode || data.vehicleId;
        const newHours = data.newHours;

        if (!vehicleCode) {
          throw new HttpsError('invalid-argument', 'vehicleCode es requerido.');
        }

        if (newHours === undefined || newHours === null) {
          throw new HttpsError('invalid-argument', 'newHours es requerido.');
        }

        return await recordHourMeterReading(vehicleCode, newHours, null, user);
      });

    case 'getHourMeterHistory':
      return safeExecute(action, async () => {
        const vehicleCode = data.vehicleCode || data.vehicleId;
        const limit = data.limit || 50;

        if (!vehicleCode) {
          throw new HttpsError('invalid-argument', 'vehicleCode es requerido.');
        }

        return await fetchHourMeterHistory(vehicleCode, limit);
      });

    case 'calculateConsumption':
      return safeExecute(action, async () => {
        const vehicleCode = data.vehicleCode || data.vehicleId;
        if (!vehicleCode) {
          throw new HttpsError('invalid-argument', 'vehicleCode es requerido.');
        }

        return await getHourMeterSummary(vehicleCode);
      });

    case 'registerMaintenance':
      return safeExecute(action, async () => {
        const { vehicleId, maintenanceData } = data;

        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }

        if (!maintenanceData || typeof maintenanceData !== 'object') {
          throw new HttpsError('invalid-argument', 'maintenanceData es requerido.');
        }

        return await createMaintenanceRecord({ ...maintenanceData, vehicleId }, user);
      });

    case 'updateMetrics':
    case 'countByCategory':
      return unsupported(action);

    default:
      throw new HttpsError('invalid-argument', `Acción no soportada: ${action}`);
  }
});

export const combustiblesMovements = onCall(async (request) => {
  const { action, data = {} } = request.data || {};

  if (!action) {
    throw new HttpsError('invalid-argument', 'El parámetro "action" es requerido.');
  }

  const user = getUserContext(request);

  switch (action) {
    case 'create':
      return safeExecute(action, async () => {
        const { movementData } = data;

        if (!movementData || typeof movementData !== 'object') {
          throw new HttpsError('invalid-argument', 'movementData es requerido.');
        }

        return await createMovement(movementData, user);
      });

    case 'getAll':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getAllMovements(filters);
      });

    case 'get':
    case 'getById':
      return safeExecute(action, async () => {
        const movementId = data.movementId || data.id;

        if (!movementId) {
          throw new HttpsError('invalid-argument', 'movementId es requerido.');
        }

        return await getMovement(movementId);
      });

    case 'update':
      return safeExecute(action, async () => {
        const movementId = data.movementId || data.id;
        const updateData = data.updateData || data.updates;

        if (!movementId) {
          throw new HttpsError('invalid-argument', 'movementId es requerido.');
        }

        if (!updateData || typeof updateData !== 'object') {
          throw new HttpsError('invalid-argument', 'updateData es requerido.');
        }

        return await updateMovement(movementId, updateData, user);
      });

    case 'delete':
      return safeExecute(action, async () => {
        const movementId = data.movementId || data.id;

        if (!movementId) {
          throw new HttpsError('invalid-argument', 'movementId es requerido.');
        }

        return await deleteMovement(movementId);
      });

    case 'getStats':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getMovementsStats(filters);
      });

    default:
      return unsupported(action);
  }
});

export const combustiblesInventory = onCall(async (request) => {
  const { action, data = {} } = request.data || {};

  if (!action) {
    throw new HttpsError('invalid-argument', 'El parámetro "action" es requerido.');
  }

  const user = getUserContext(request);

  switch (action) {
    case 'create':
      return safeExecute(action, async () => {
        const { inventoryData } = data;

        if (!inventoryData || typeof inventoryData !== 'object') {
          throw new HttpsError('invalid-argument', 'inventoryData es requerido.');
        }

        return await createInventoryItem(inventoryData, user);
      });

    case 'getAll':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getAllInventory(filters);
      });

    case 'get':
    case 'getById':
      return safeExecute(action, async () => {
        const itemId = data.inventoryId || data.itemId || data.id;

        if (!itemId) {
          throw new HttpsError('invalid-argument', 'inventoryId es requerido.');
        }

        return await getInventoryItem(itemId);
      });

    case 'update':
      return safeExecute(action, async () => {
        const itemId = data.inventoryId || data.itemId || data.id;
        const updateData = data.updateData || data.updates;

        if (!itemId) {
          throw new HttpsError('invalid-argument', 'inventoryId es requerido.');
        }

        if (!updateData || typeof updateData !== 'object') {
          throw new HttpsError('invalid-argument', 'updateData es requerido.');
        }

        return await updateInventoryItem(itemId, updateData, user);
      });

    case 'delete':
      return safeExecute(action, async () => {
        const itemId = data.inventoryId || data.itemId || data.id;

        if (!itemId) {
          throw new HttpsError('invalid-argument', 'inventoryId es requerido.');
        }

        return await deleteInventoryItem(itemId);
      });

    case 'getByLocation':
      return safeExecute(action, async () => {
        const location = data.location;

        if (!location) {
          throw new HttpsError('invalid-argument', 'location es requerido.');
        }

        return await getInventoryByLocation(location);
      });

    case 'updateStock':
      return safeExecute(action, async () => {
        const itemId = data.inventoryId || data.itemId || data.id;
        const quantity = data.quantity;
        const movementInfo = data.movementInfo || {};

        if (!itemId) {
          throw new HttpsError('invalid-argument', 'inventoryId es requerido.');
        }

        if (quantity === undefined || quantity === null) {
          throw new HttpsError('invalid-argument', 'quantity es requerido.');
        }

        return await updateInventoryStock(itemId, quantity, movementInfo);
      });

    case 'getLowStock':
      return safeExecute(action, async () => {
        return await getLowStockItems();
      });

    case 'getSummary':
      return safeExecute(action, async () => {
        return await getInventorySummary();
      });

    default:
      return unsupported(action);
  }
});

export const combustiblesSuppliers = onCall(async (request) => {
  const { action, data = {} } = request.data || {};

  if (!action) {
    throw new HttpsError('invalid-argument', 'El parámetro "action" es requerido.');
  }

  const user = getUserContext(request);

  switch (action) {
    case 'create':
      return safeExecute(action, async () => {
        const { supplierData } = data;

        if (!supplierData || typeof supplierData !== 'object') {
          throw new HttpsError('invalid-argument', 'supplierData es requerido.');
        }

        return await createSupplier(supplierData, user);
      });

    case 'getAll':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getAllSuppliers(filters);
      });

    case 'get':
    case 'getById':
      return safeExecute(action, async () => {
        const supplierId = data.supplierId || data.id;

        if (!supplierId) {
          throw new HttpsError('invalid-argument', 'supplierId es requerido.');
        }

        return await getSupplierById(supplierId);
      });

    case 'update':
      return safeExecute(action, async () => {
        const supplierId = data.supplierId || data.id;
        const updateData = data.updateData || data.updates;

        if (!supplierId) {
          throw new HttpsError('invalid-argument', 'supplierId es requerido.');
        }

        if (!updateData || typeof updateData !== 'object') {
          throw new HttpsError('invalid-argument', 'updateData es requerido.');
        }

        return await updateSupplier(supplierId, updateData, user);
      });

    case 'delete':
      return safeExecute(action, async () => {
        const supplierId = data.supplierId || data.id;

        if (!supplierId) {
          throw new HttpsError('invalid-argument', 'supplierId es requerido.');
        }

        return await deleteSupplier(supplierId);
      });

    case 'updateStats':
      return safeExecute(action, async () => {
        const supplierId = data.supplierId || data.id;
        const stats = data.stats;

        if (!supplierId) {
          throw new HttpsError('invalid-argument', 'supplierId es requerido.');
        }

        if (!stats || typeof stats !== 'object') {
          throw new HttpsError('invalid-argument', 'stats es requerido.');
        }

        return await updateSupplierStats(supplierId, stats);
      });

    case 'getPreferred':
      return safeExecute(action, async () => {
        return await getPreferredSuppliers();
      });

    case 'getStats':
      return safeExecute(action, async () => {
        return await getSuppliersStats();
      });

    default:
      return unsupported(action);
  }
});

export const combustiblesProducts = onCall(async (request) => {
  const { action, data = {} } = request.data || {};

  if (!action) {
    throw new HttpsError('invalid-argument', 'El parámetro "action" es requerido.');
  }

  const user = getUserContext(request);

  switch (action) {
    case 'create':
      return safeExecute(action, async () => {
        const { productData } = data;

        if (!productData || typeof productData !== 'object') {
          throw new HttpsError('invalid-argument', 'productData es requerido.');
        }

        return await createProduct(productData, user);
      });

    case 'getAll':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getAllProducts(filters);
      });

    case 'get':
    case 'getById':
      return safeExecute(action, async () => {
        const productId = data.productId || data.id;

        if (!productId) {
          throw new HttpsError('invalid-argument', 'productId es requerido.');
        }

        return await getProduct(productId);
      });

    case 'update':
      return safeExecute(action, async () => {
        const productId = data.productId || data.id;
        const updateData = data.updateData || data.updates;

        if (!productId) {
          throw new HttpsError('invalid-argument', 'productId es requerido.');
        }

        if (!updateData || typeof updateData !== 'object') {
          throw new HttpsError('invalid-argument', 'updateData es requerido.');
        }

        return await updateProduct(productId, updateData, user);
      });

    case 'delete':
      return safeExecute(action, async () => {
        const productId = data.productId || data.id;

        if (!productId) {
          throw new HttpsError('invalid-argument', 'productId es requerido.');
        }

        return await deleteProduct(productId);
      });

    case 'getByCategory':
      return safeExecute(action, async () => {
        const category = data.category;

        if (!category) {
          throw new HttpsError('invalid-argument', 'category es requerido.');
        }

        return await getProductsByCategory(category);
      });

    case 'getActive':
      return safeExecute(action, async () => {
        return await getActiveProducts();
      });

    case 'updateStock':
      return safeExecute(action, async () => {
        const productId = data.productId || data.id;
        const newStock = data.newStock;

        if (!productId) {
          throw new HttpsError('invalid-argument', 'productId es requerido.');
        }

        if (newStock === undefined || newStock === null) {
          throw new HttpsError('invalid-argument', 'newStock es requerido.');
        }

        return await updateProductStock(productId, newStock, user);
      });

    case 'search':
      return safeExecute(action, async () => {
        const searchTerm = data.searchTerm || data.query;

        if (!searchTerm) {
          throw new HttpsError('invalid-argument', 'searchTerm es requerido.');
        }

        return await searchProducts(searchTerm);
      });

    case 'getLowStock':
      return safeExecute(action, async () => {
        return await getLowStockProducts();
      });

    case 'getByCode':
      return safeExecute(action, async () => {
        const productCode = data.productCode || data.code;

        if (!productCode) {
          throw new HttpsError('invalid-argument', 'productCode es requerido.');
        }

        return await getProductByCode(productCode);
      });

    default:
      return unsupported(action);
  }
});

export const combustiblesMaintenance = onCall(async (request) => {
  const { action, data = {} } = request.data || {};

  if (!action) {
    throw new HttpsError('invalid-argument', 'El parámetro "action" es requerido.');
  }

  const user = getUserContext(request);

  switch (action) {
    case 'create':
      return safeExecute(action, async () => {
        const { maintenanceData } = data;

        if (!maintenanceData || typeof maintenanceData !== 'object') {
          throw new HttpsError('invalid-argument', 'maintenanceData es requerido.');
        }

        return await createMaintenanceRecord(maintenanceData, user);
      });

    case 'getAll':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getAllMaintenanceRecords(filters);
      });

    case 'get':
    case 'getById':
      return safeExecute(action, async () => {
        const maintenanceId = data.maintenanceId || data.id;

        if (!maintenanceId) {
          throw new HttpsError('invalid-argument', 'maintenanceId es requerido.');
        }

        return await getMaintenanceRecord(maintenanceId);
      });

    case 'update':
      return safeExecute(action, async () => {
        const maintenanceId = data.maintenanceId || data.id;
        const updateData = data.updateData || data.updates;

        if (!maintenanceId) {
          throw new HttpsError('invalid-argument', 'maintenanceId es requerido.');
        }

        if (!updateData || typeof updateData !== 'object') {
          throw new HttpsError('invalid-argument', 'updateData es requerido.');
        }

        return await updateMaintenanceRecord(maintenanceId, updateData, user);
      });

    case 'delete':
      return safeExecute(action, async () => {
        const maintenanceId = data.maintenanceId || data.id;

        if (!maintenanceId) {
          throw new HttpsError('invalid-argument', 'maintenanceId es requerido.');
        }

        return await deleteMaintenanceRecord(maintenanceId);
      });

    case 'getByVehicle':
      return safeExecute(action, async () => {
        const vehicleId = data.vehicleId;

        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }

        return await getMaintenanceByVehicle(vehicleId);
      });

    case 'getUpcoming':
      return safeExecute(action, async () => {
        return await getUpcomingMaintenance();
      });

    case 'getStats':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getMaintenanceStats(filters);
      });

    default:
      return unsupported(action);
  }
});

export const combustiblesHourMeter = onCall(async (request) => {
  const { action, data = {} } = request.data || {};

  if (!action) {
    throw new HttpsError('invalid-argument', 'El parámetro "action" es requerido.');
  }

  const user = getUserContext(request);

  switch (action) {
    case 'recordReading':
      return safeExecute(action, async () => {
        const vehicleId = data.vehicleId || data.vehicleCode;
        const newReading = data.newReading;
        const movementId = data.movementId || null;

        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }

        if (newReading === undefined || newReading === null) {
          throw new HttpsError('invalid-argument', 'newReading es requerido.');
        }

        return await recordHourMeterReading(vehicleId, newReading, movementId, user);
      });

    case 'getHistory':
      return safeExecute(action, async () => {
        const vehicleId = data.vehicleId || data.vehicleCode;
        const limit = data.limit || 50;

        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }

        return await fetchHourMeterHistory(vehicleId, limit);
      });

    case 'getSummary':
      return safeExecute(action, async () => {
        const vehicleId = data.vehicleId || data.vehicleCode;

        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }

        return await getHourMeterSummary(vehicleId);
      });

    case 'initialize':
      return safeExecute(action, async () => {
        const vehicleId = data.vehicleId || data.vehicleCode;
        const initialReading = data.initialReading;

        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }

        if (initialReading === undefined || initialReading === null) {
          throw new HttpsError('invalid-argument', 'initialReading es requerido.');
        }

        return await initializeHourMeter(vehicleId, initialReading, user);
      });

    case 'getStats':
      return safeExecute(action, async () => {
        const { filters = {} } = data;
        return await getHourMeterStats(filters);
      });

    case 'validateForMovement':
      return safeExecute(action, async () => {
        const vehicleId = data.vehicleId || data.vehicleCode;
        const requiredReading = data.requiredReading;

        if (!vehicleId) {
          throw new HttpsError('invalid-argument', 'vehicleId es requerido.');
        }

        if (requiredReading === undefined || requiredReading === null) {
          throw new HttpsError('invalid-argument', 'requiredReading es requerido.');
        }

        return await validateHourMeterForMovement(vehicleId, requiredReading);
      });

    default:
      return unsupported(action);
  }
});

export const combustiblesCategories = onCall(async (request) => {
  const { action, data = {} } = request.data || {};

  if (!action) {
    throw new HttpsError('invalid-argument', 'El parámetro "action" es requerido.');
  }

  const user = getUserContext(request);

  switch (action) {
    case 'create':
      return safeExecute(action, async () => {
        const { categoryData } = data;

        if (!categoryData || typeof categoryData !== 'object') {
          throw new HttpsError('invalid-argument', 'categoryData es requerido.');
        }

        return await createCategory(categoryData, user);
      });

    case 'getAll':
      return safeExecute(action, async () => {
        const { options = {} } = data;
        return await getAllCategories(options);
      });

    case 'get':
    case 'getById':
      return safeExecute(action, async () => {
        const categoryId = data.categoryId || data.id;

        if (!categoryId) {
          throw new HttpsError('invalid-argument', 'categoryId es requerido.');
        }

        return await getCategory(categoryId);
      });

    case 'getByCode':
      return safeExecute(action, async () => {
        const code = data.code || data.categoryCode;

        if (!code) {
          throw new HttpsError('invalid-argument', 'code es requerido.');
        }

        return await getCategoryByCode(code);
      });

    case 'update':
      return safeExecute(action, async () => {
        const categoryId = data.categoryId || data.id;
        const updateData = data.updateData || data.updates;

        if (!categoryId) {
          throw new HttpsError('invalid-argument', 'categoryId es requerido.');
        }

        if (!updateData || typeof updateData !== 'object') {
          throw new HttpsError('invalid-argument', 'updateData es requerido.');
        }

        return await updateCategory(categoryId, updateData, user);
      });

    case 'delete':
      return safeExecute(action, async () => {
        const categoryId = data.categoryId || data.id;

        if (!categoryId) {
          throw new HttpsError('invalid-argument', 'categoryId es requerido.');
        }

        return await deleteCategory(categoryId);
      });

    case 'updateVehicleCount':
      return safeExecute(action, async () => {
        const categoryId = data.categoryId || data.id;
        const increment = data.increment ?? 1;

        if (!categoryId) {
          throw new HttpsError('invalid-argument', 'categoryId es requerido.');
        }

        return await updateVehicleCount(categoryId, increment);
      });

    case 'reorder':
      return safeExecute(action, async () => {
        const { order } = data;

        if (!Array.isArray(order)) {
          throw new HttpsError('invalid-argument', 'order debe ser un arreglo de categorías.');
        }

        return await reorderCategories(order);
      });

    case 'getActive':
      return safeExecute(action, async () => {
        return await getActiveCategories();
      });

    case 'getStats':
      return safeExecute(action, async () => {
        return await getCategoryStats();
      });

    default:
      return unsupported(action);
  }
});
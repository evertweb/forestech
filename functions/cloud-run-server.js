// server.js - Servidor Express para Cloud Run (migración desde Firebase Functions)
// Maneja todos los endpoints SQL como HTTP POST con autenticación Firebase
// Puerto 8080 para Cloud Run

import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'liquidacionapp-62962',
    // En Cloud Run, usa credenciales por defecto de GCP
  });
  console.log('🔥 Firebase Admin inicializado para Cloud Run');
}

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware global
app.use(cors({
  origin: true, // Permitir todos para desarrollo77777777777; restringir en prod
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Límite para payloads grandes

// Health check endpoint (antes de autenticación)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint without authentication (antes de autenticación)
app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    service: 'forestech-sql-service',
    endpoints: 36
  });
});

// Endpoints de diagnóstico de sistema (sin autenticación para monitoreo)
app.get('/health/database', async (req, res) => {
  try {
    const { getDatabaseHealth } = await import('./src/sql/databaseHealthService.js');
    const healthResult = await getDatabaseHealth();
    
    if (healthResult.system?.status === 'error') {
      res.status(500).json(healthResult);
    } else {
      res.json(healthResult);
    }
  } catch (error) {
    console.error('❌ Error en /health/database:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString(),
      system: { status: 'error', score: 0 }
    });
  }
});

app.get('/system/status', async (req, res) => {
  try {
    const { getSystemStatus } = await import('./src/sql/databaseHealthService.js');
    const statusResult = await getSystemStatus();
    res.json(statusResult);
  } catch (error) {
    console.error('❌ Error en /system/status:', error);
    res.status(500).json({ 
      status: 'error', 
      score: 0, 
      message: 'Error al obtener estado del sistema',
      error: error.message 
    });
  }
});

// Middleware de autenticación Firebase ID Token (solo para endpoints SQL)
app.use(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autorización requerido' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || decodedToken.email,
    };
    console.log(`👤 Usuario autenticado: ${req.user.email}`);
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

// Importar todos los servicios SQL
import {
  createMovement, getAllMovements, updateMovement, deleteMovement, getMovementsStats
} from './src/sql/movementsService.js';

import {
  createInventoryItem, getAllInventory, updateInventoryItem, deleteInventoryItem, getInventoryByLocation
} from './src/sql/inventoryService.js';

import {
  createVehicle, getAllVehicles, getVehicleById, updateVehicle, deleteVehicle, getVehiclesStats
} from './src/sql/vehiclesService.js';

import {
  createSupplier, getAllSuppliers, getSupplierById, updateSupplier, deleteSupplier,
  updateSupplierStats, getPreferredSuppliers, getSuppliersStats
} from './src/sql/suppliersService.js';

import {
  createProduct, getAllProducts, getProduct, updateProduct, deleteProduct,
  getProductsByCategory, getActiveProducts, updateProductStock, searchProducts,
  getLowStockProducts, getProductByCode
} from './src/sql/productsService.js';

import {
  createMaintenanceRecord, getAllMaintenanceRecords, getMaintenanceRecord,
  updateMaintenanceRecord, deleteMaintenanceRecord, getMaintenanceByVehicle,
  getUpcomingMaintenance, getMaintenanceStats
} from './src/sql/maintenanceService.js';

import {
  recordHourMeterReading, validateHourMeterForMovement, getHourMeterHistory,
  initializeHourMeter, getHourMeterSummary, getHourMeterStats
} from './src/sql/hourMeterService.js';

import {
  createCategory, getAllCategories, getCategory, updateCategory, deleteCategory,
  getCategoryByCode, updateVehicleCount, reorderCategories, getActiveCategories, getCategoryStats
} from './src/sql/vehicleCategoriesService.js';

// Importar servicio de inicialización de base de datos
import {
  initializeDatabase, forceRecreateTables
} from './src/sql/databaseInitService.js';

// Importar servicio de diagnóstico de base de datos
// Rutas para Movements (6 endpoints)
app.post('/sqlCreateMovement', async (req, res) => {
  try {
    const { movementData } = req.body;
    const userInfo = req.user;
    const result = await createMovement(movementData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlCreateMovement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetAllMovements', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getAllMovements(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetAllMovements:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateMovement', async (req, res) => {
  try {
    const { movementId, updateData } = req.body;
    const userInfo = req.user;
    const result = await updateMovement(movementId, updateData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateMovement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlDeleteMovement', async (req, res) => {
  try {
    const { movementId } = req.body;
    const result = await deleteMovement(movementId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlDeleteMovement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetMovementsStats', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getMovementsStats(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetMovementsStats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas para Inventory (5 endpoints)
app.post('/sqlCreateInventoryItem', async (req, res) => {
  try {
    const { inventoryData } = req.body;
    const userInfo = req.user;
    const result = await createInventoryItem(inventoryData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlCreateInventoryItem:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetAllInventory', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getAllInventory(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetAllInventory:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateInventoryItem', async (req, res) => {
  try {
    const { itemId, updateData } = req.body;
    const userInfo = req.user;
    const result = await updateInventoryItem(itemId, updateData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateInventoryItem:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlDeleteInventoryItem', async (req, res) => {
  try {
    const { itemId } = req.body;
    const result = await deleteInventoryItem(itemId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlDeleteInventoryItem:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetInventoryByLocation', async (req, res) => {
  try {
    const { location } = req.body;
    const result = await getInventoryByLocation(location);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetInventoryByLocation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas para Vehicles (6 endpoints)
app.post('/sqlCreateVehicle', async (req, res) => {
  try {
    const { vehicleData } = req.body;
    const userInfo = req.user;
    const result = await createVehicle(vehicleData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlCreateVehicle:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetAllVehicles', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getAllVehicles(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetAllVehicles:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetVehicleById', async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const result = await getVehicleById(vehicleId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetVehicleById:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateVehicle', async (req, res) => {
  try {
    const { vehicleId, updateData } = req.body;
    const userInfo = req.user;
    const result = await updateVehicle(vehicleId, updateData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateVehicle:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlDeleteVehicle', async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const result = await deleteVehicle(vehicleId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlDeleteVehicle:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetVehiclesStats', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getVehiclesStats(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetVehiclesStats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas para Suppliers (8 endpoints)
app.post('/sqlCreateSupplier', async (req, res) => {
  try {
    const { supplierData } = req.body;
    const userInfo = req.user;
    const result = await createSupplier(supplierData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlCreateSupplier:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetAllSuppliers', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getAllSuppliers(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetAllSuppliers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetSupplierById', async (req, res) => {
  try {
    const { supplierId } = req.body;
    const result = await getSupplierById(supplierId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetSupplierById:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateSupplier', async (req, res) => {
  try {
    const { supplierId, updateData } = req.body;
    const userInfo = req.user;
    const result = await updateSupplier(supplierId, updateData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateSupplier:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlDeleteSupplier', async (req, res) => {
  try {
    const { supplierId } = req.body;
    const result = await deleteSupplier(supplierId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlDeleteSupplier:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateSupplierStats', async (req, res) => {
  try {
    const { supplierId, stats } = req.body;
    const result = await updateSupplierStats(supplierId, stats);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateSupplierStats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetPreferredSuppliers', async (req, res) => {
  try {
    const result = await getPreferredSuppliers();
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetPreferredSuppliers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetSuppliersStats', async (req, res) => {
  try {
    const result = await getSuppliersStats();
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetSuppliersStats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas para Products (12 endpoints)
app.post('/sqlCreateProduct', async (req, res) => {
  try {
    const { productData } = req.body;
    const userInfo = req.user;
    const result = await createProduct(productData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlCreateProduct:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetAllProducts', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getAllProducts(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetAllProducts:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetProduct', async (req, res) => {
  try {
    const { productId } = req.body;
    const result = await getProduct(productId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetProduct:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateProduct', async (req, res) => {
  try {
    const { productId, updateData } = req.body;
    const userInfo = req.user;
    const result = await updateProduct(productId, updateData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateProduct:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlDeleteProduct', async (req, res) => {
  try {
    const { productId } = req.body;
    const result = await deleteProduct(productId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlDeleteProduct:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetProductsByCategory', async (req, res) => {
  try {
    const { category } = req.body;
    const result = await getProductsByCategory(category);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetProductsByCategory:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetActiveProducts', async (req, res) => {
  try {
    const result = await getActiveProducts();
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetActiveProducts:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateProductStock', async (req, res) => {
  try {
    const { productId, newStock } = req.body;
    const userInfo = req.user;
    const result = await updateProductStock(productId, newStock, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateProductStock:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlSearchProducts', async (req, res) => {
  try {
    const { searchTerm } = req.body;
    const result = await searchProducts(searchTerm);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlSearchProducts:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetLowStockProducts', async (req, res) => {
  try {
    const result = await getLowStockProducts();
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetLowStockProducts:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetProductByCode', async (req, res) => {
  try {
    const { productCode } = req.body;
    const result = await getProductByCode(productCode);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetProductByCode:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas para Maintenance (8 endpoints)
app.post('/sqlCreateMaintenance', async (req, res) => {
  try {
    const { maintenanceData } = req.body;
    const userInfo = req.user;
    const result = await createMaintenanceRecord(maintenanceData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlCreateMaintenance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetAllMaintenance', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getAllMaintenanceRecords(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetAllMaintenance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetMaintenance', async (req, res) => {
  try {
    const { maintenanceId } = req.body;
    const result = await getMaintenanceRecord(maintenanceId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetMaintenance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateMaintenance', async (req, res) => {
  try {
    const { maintenanceId, updateData } = req.body;
    const userInfo = req.user;
    const result = await updateMaintenanceRecord(maintenanceId, updateData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateMaintenance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlDeleteMaintenance', async (req, res) => {
  try {
    const { maintenanceId } = req.body;
    const result = await deleteMaintenanceRecord(maintenanceId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlDeleteMaintenance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetMaintenanceByVehicle', async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const result = await getMaintenanceByVehicle(vehicleId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetMaintenanceByVehicle:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetUpcomingMaintenance', async (req, res) => {
  try {
    const result = await getUpcomingMaintenance();
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetUpcomingMaintenance:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetMaintenanceStats', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getMaintenanceStats(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetMaintenanceStats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas para Hour Meter (6 endpoints)
app.post('/sqlRecordHourMeterReading', async (req, res) => {
  try {
    const { vehicleId, newReading, movementId } = req.body;
    const userInfo = req.user;
    const result = await recordHourMeterReading(vehicleId, newReading, movementId, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlRecordHourMeterReading:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlValidateHourMeterForMovement', async (req, res) => {
  try {
    const { vehicleId, requiredReading } = req.body;
    const result = await validateHourMeterForMovement(vehicleId, requiredReading);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlValidateHourMeterForMovement:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetHourMeterHistory', async (req, res) => {
  try {
    const { vehicleId, limit } = req.body;
    const result = await getHourMeterHistory(vehicleId, limit);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ Error en sqlGetHourMeterHistory:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlInitializeHourMeter', async (req, res) => {
  try {
    const { vehicleId, initialReading } = req.body;
    const userInfo = req.user;
    const result = await initializeHourMeter(vehicleId, initialReading, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlInitializeHourMeter:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetHourMeterSummary', async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const result = await getHourMeterSummary(vehicleId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetHourMeterSummary:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetHourMeterStats', async (req, res) => {
  try {
    const { filters } = req.body;
    const result = await getHourMeterStats(filters);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetHourMeterStats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas para Vehicle Categories (9 endpoints)
app.post('/sqlCreateCategory', async (req, res) => {
  try {
    const { categoryData } = req.body;
    const userInfo = req.user;
    const result = await createCategory(categoryData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlCreateCategory:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetAllCategories', async (req, res) => {
  try {
    const { options } = req.body;
    const result = await getAllCategories(options);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetAllCategories:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetCategory', async (req, res) => {
  try {
    const { categoryId } = req.body;
    const result = await getCategory(categoryId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetCategory:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateCategory', async (req, res) => {
  try {
    const { categoryId, updateData } = req.body;
    const userInfo = req.user;
    const result = await updateCategory(categoryId, updateData, userInfo);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateCategory:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlDeleteCategory', async (req, res) => {
  try {
    const { categoryId } = req.body;
    const result = await deleteCategory(categoryId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlDeleteCategory:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetCategoryByCode', async (req, res) => {
  try {
    const { code } = req.body;
    const result = await getCategoryByCode(code);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetCategoryByCode:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlUpdateVehicleCount', async (req, res) => {
  try {
    const { categoryId, increment } = req.body;
    const result = await updateVehicleCount(categoryId, increment);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlUpdateVehicleCount:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlReorderCategories', async (req, res) => {
  try {
    const { categoryOrders } = req.body;
    const result = await reorderCategories(categoryOrders);
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlReorderCategories:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetActiveCategories', async (req, res) => {
  try {
    const result = await getActiveCategories();
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetActiveCategories:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlGetCategoryStats', async (req, res) => {
  try {
    const result = await getCategoryStats();
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlGetCategoryStats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas para inicialización de base de datos (2 endpoints)
app.post('/sqlInitializeDatabase', async (req, res) => {
  try {
    const userInfo = req.user;
    console.log(`👤 Usuario ${userInfo.email} solicitando inicialización de base de datos`);
    const result = await initializeDatabase();
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlInitializeDatabase:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/sqlForceRecreateTables', async (req, res) => {
  try {
    const userInfo = req.user;
    console.log(`👤 Usuario ${userInfo.email} solicitando recreación forzada de tablas`);
    const result = await forceRecreateTables();
    res.json(result);
  } catch (error) {
    console.error('❌ Error en sqlForceRecreateTables:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoints de diagnóstico de sistema que requieren autenticación
app.post('/system/autorepair', async (req, res) => {
  try {
    const userInfo = req.user;
    console.log(`🔧 Usuario ${userInfo.email} solicitando auto-reparación del sistema`);
    
    const { autoRepair } = await import('./src/sql/databaseHealthService.js');
    const repairResult = await autoRepair();
    
    if (repairResult.success) {
      console.log(`✅ Auto-reparación exitosa para usuario ${userInfo.email}`);
      res.json(repairResult);
    } else {
      console.error(`❌ Auto-reparación falló para usuario ${userInfo.email}:`, repairResult.error);
      res.status(500).json(repairResult);
    }
  } catch (error) {
    console.error('❌ Error en /system/autorepair:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error en auto-reparación del sistema',
      error: error.message 
    });
  }
});

app.post('/system/check-initialization', async (req, res) => {
  try {
    const userInfo = req.user;
    const { needsInitialization } = await import('./src/sql/databaseHealthService.js');
    
    const needsInit = await needsInitialization();
    res.json({
      needs_initialization: needsInit,
      user: userInfo.email,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en /system/check-initialization:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      needs_initialization: true // En caso de error, asumir que necesita inicialización
    });
  }
});

// Manejo de errores global
app.use((err, req, res, _next) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor Cloud Run ejecutándose en puerto ${PORT}`);
  console.log('✅ Todos los endpoints SQL disponibles como POST routes');
});

export default app;
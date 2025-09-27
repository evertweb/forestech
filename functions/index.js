import express from 'express';
import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import { ssrHandler, healthHandler } from './ssr/server.js';
import { sitemapHandler, robotsHandler } from './ssr/sitemap.js';
import { abTestingHandler } from './ssr/ab-testing-phase1.js';
import { errorStatsHandler } from './ssr/error-handler-advanced.js';
import { applyErrorMiddlewares } from './ssr/error-middleware.js';
import { reportingHandler } from './ssr/reporting-system.js';
import { alertsHandler, startAlertingSystem } from './ssr/alerting-system.js';
import { performanceOptimizationHandler } from './ssr/performance-optimization.js';
import { coverageMonitoringHandler } from './ssr/coverage-monitoring.js';
import { seoValidationHandler } from './ssr/seo-endpoint.js';
import { ensureEnv } from './ssr/env.js';
import { combustiblesWebhookReceiver } from './webhooks/combustibles-webhooks-http.js';
import { generatePasskeyToken, checkUserPasskeys, registerFace, loginFace } from './passkey-auth.js';

import { testConnection } from './src/sql/testConnection.js';

ensureEnv();

// Inicializar sistema de alertas automáticas - Fase 4 (Updated)
if (process.env.NODE_ENV === 'production') {
  startAlertingSystem();
  console.info('SSR Alerting System initialized for production');
}

const app = express();

// Aplicar middlewares de error handling avanzado - Fase 4
applyErrorMiddlewares(app, {
  timeout: 5000, // 5 segundos timeout
  rateLimit: 60, // 60 requests por minuto
  validRoutes: [
    '/combustibles/*', 
    '/movement-wizard-popup', 
    '/vehicle-wizard-popup',
    '/sitemap*', 
    '/robots.txt',
    '/seo-robots',
    '/test-robots-hosting',
    '/health', 
    '/ab-testing', 
    '/error-stats', 
    '/ssr-reports', 
    '/ssr-alerts', 
    '/ssr-optimization', 
    '/ssr-coverage', 
    '/seo-validation'
  ],
  enableLogging: process.env.NODE_ENV !== 'test' // Disable en tests
});

// SEO endpoints - sitemap y robots.txt
app.get('/sitemap.xml', sitemapHandler);
app.get('/sitemap-combustibles.xml', sitemapHandler);
app.get('/sitemap-index.xml', sitemapHandler);

// WORKAROUND: Firebase Hosting intercepta /robots.txt - usar rutas alternativas
app.get('/robots.txt', (req, res) => {
  console.log('🤖 ROBOTS.TXT REQUEST RECEIVED:', req.path);
  return robotsHandler(req, res);
});

// Ruta alternativa funcional para robots.txt
app.get('/seo-robots', (req, res) => {
  console.log('🤖 SEO-ROBOTS REQUEST RECEIVED:', req.path);
  return robotsHandler(req, res);
});

// Ruta temporal para debug hosting
app.get('/test-robots-hosting', (req, res) => {
  console.log('🏠 TEST ROBOTS HOSTING REQUEST:', req.path);
  return robotsHandler(req, res);
});

// SSR handler para todas las rutas de combustibles (incluye health check)
app.get('/combustibles/*', ssrHandler);

// Health endpoint simple para validar deploy
app.get('/health', healthHandler);

// A/B Testing control endpoint (desarrollo)
app.get('/ab-testing', abTestingHandler);

// Error statistics endpoint (monitoreo)
app.get('/error-stats', errorStatsHandler);

// SSR Reports endpoint - Fase 4 (sistema de reportes avanzado)
app.get('/ssr-reports', reportingHandler);
app.post('/ssr-reports', reportingHandler);

// SSR Alerts endpoint - Fase 4 (sistema de alertas automáticas)
app.get('/ssr-alerts', alertsHandler);
app.post('/ssr-alerts', alertsHandler);

// SSR Performance Optimization endpoint - Fase 4 (optimización de performance)
app.get('/ssr-optimization', performanceOptimizationHandler);
app.post('/ssr-optimization', performanceOptimizationHandler);

// SSR Coverage Monitoring endpoint - Fase 4 (monitoreo de cobertura 45%)
app.get('/ssr-coverage', coverageMonitoringHandler);
app.post('/ssr-coverage', coverageMonitoringHandler);

// SEO Validation endpoint - Validación y monitoreo SEO
app.get('/seo-validation', seoValidationHandler);
app.post('/seo-validation', seoValidationHandler);

export const ssrCombustibles = onRequest(
  {
    region: process.env.FIREBASE_DEFAULT_REGION || 'us-central1',
    timeoutSeconds: 60,
    memory: '512MiB',
    maxInstances: 10,
    concurrency: 80,
  },
  app
);

// Webhook endpoint para recibir movimientos desde N8N/Telegram
export { combustiblesWebhookReceiver };

// Endpoint para vincular Telegram con un usuario autenticado en la web
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export const linkTelegramAccount = onRequest({ cors: true, region: 'us-central1' }, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Método no permitido' });
    }
    const { code, userId, username } = req.body || {};
    if (!code || !userId) {
      return res.status(400).json({ success: false, error: 'code y userId son requeridos' });
    }

    const docRef = db.collection('telegram_link_codes').doc(String(code));
    const snap = await docRef.get();
    if (!snap.exists) {
      return res.status(400).json({ success: false, error: 'Código inválido' });
    }
    const data = snap.data();
    if (data.used) {
      return res.status(400).json({ success: false, error: 'Código ya usado' });
    }
    if (new Date(data.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({ success: false, error: 'Código expirado' });
    }

    // Guardar vínculo en perfil del usuario
    await db.collection('users').doc(String(userId)).set({
      telegram: {
        chatId: data.chatId,
        userId: data.telegram?.userId || null,
        username: data.telegram?.username || null,
        linkedAt: new Date().toISOString(),
      }
    }, { merge: true });

    await docRef.set({ used: true }, { merge: true });

    // Notificar por Telegram al chat vinculado (si hay token configurado)
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (botToken && data.chatId) {
        const msg = '✅ *Vinculación exitosa*\\n\\nYa puedes usar el bot ForeTech Combustibles.\\n\\n*Comandos disponibles:*\\n• `/help` - Ver ayuda\\n• `/entrada` - Registrar entrada\\n• `/salida` - Registrar salida\\n\\n¡Listo para usar! 🚀';
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const body = { chat_id: String(data.chatId), text: msg, parse_mode: 'Markdown' };
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!response.ok) {
          console.warn('Error enviando confirmación Telegram:', await response.text());
        } else {
          console.log('✅ Confirmación enviada a Telegram:', data.chatId);
        }
      }
    } catch (notifyErr) {
      console.warn('No se pudo enviar confirmación a Telegram:', notifyErr?.message);
    }

    return res.json({ success: true, message: 'Cuenta de Telegram vinculada correctamente' });
  } catch (error) {
    console.error('Error en linkTelegramAccount:', error);
    return res.status(500).json({ success: false, error: 'Error interno', message: error.message });
  }
});

// Exportar funciones de passkey authentication
export { generatePasskeyToken, checkUserPasskeys };

// Exportar funciones de reconocimiento facial
export { registerFace, loginFace };

// Test SQL Connection Function
export const testSqlConnection = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    console.log('🧪 Iniciando prueba de conexión SQL...');
    try {
      const result = await testSqlConnection();
      console.log('✅ Resultado de testSqlConnection:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Error en testSqlConnection:', error);
      throw new Error(`Error en conexión SQL: ${error.message}`);
    }
  }
);

// SQL Inventory Functions - TASK-003
import {
  createInventoryItem,
  getAllInventory,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryByLocation
} from './src/sql/inventoryService.js';

// SQL Vehicles Functions - TASK-004
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehiclesStats,
  VEHICLE_STATUS,
  FUEL_TYPES,
  FUEL_COMPATIBILITY
} from './src/sql/vehiclesService.js';

// SQL Suppliers Functions - TASK-005
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  updateSupplierStats,
  getPreferredSuppliers,
  getSuppliersStats,
  SUPPLIER_STATUS,
  SUPPLIER_TYPES,
  SUPPLIER_CATEGORIES
} from './src/sql/suppliersService.js';

// SQL Products Functions - TASK-006
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

// SQL Maintenance Functions - TASK-006
import {
  createMaintenanceRecord,
  getAllMaintenanceRecords,
  getMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceByVehicle,
  getUpcomingMaintenance,
  getMaintenanceStats,
  MAINTENANCE_TYPES,
  MAINTENANCE_STATUS,
  BATTERY_STATUS,
  MAINTENANCE_CONSTANTS
} from './src/sql/maintenanceService.js';

// SQL Hour Meter Functions - TASK-006
import {
  recordHourMeterReading,
  validateHourMeterForMovement,
  getHourMeterHistory,
  initializeHourMeter,
  getHourMeterSummary,
  getHourMeterStats
} from './src/sql/hourMeterService.js';

// SQL Vehicle Categories Functions - TASK-006
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategoryByCode,
  updateVehicleCount,
  reorderCategories,
  getActiveCategories,
  getCategoryStats,
  CATEGORY_TYPES
} from './src/sql/vehicleCategoriesService.js';

/**
 * Crear movimiento SQL via Functions
 */
export const sqlCreateMovement = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { movementData } = request.data;
      if (!movementData) {
        throw new HttpsError('invalid-argument', 'movementData es requerido');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await createMovement(movementData, userInfo);
      
      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlCreateMovement:', error);
      throw new HttpsError('internal', error.message || 'Error al crear movimiento');
    }
  }
);

/**
 * Obtener todos los movimientos SQL
 */
export const sqlGetAllMovements = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { filters } = request.data || {};
      
      const result = await getAllMovements(filters);
      
      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetAllMovements:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener movimientos');
    }
  }
);

/**
 * Actualizar movimiento SQL
 */
export const sqlUpdateMovement = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { movementId, updateData } = request.data;
      if (!movementId || !updateData) {
        throw new HttpsError('invalid-argument', 'movementId y updateData son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await updateMovement(movementId, updateData, userInfo);
      
      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateMovement:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar movimiento');
    }
  }
);

/**
 * Eliminar movimiento SQL
 */
export const sqlDeleteMovement = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { movementId } = request.data;
      if (!movementId) {
        throw new HttpsError('invalid-argument', 'movementId es requerido');
      }

      const result = await deleteMovement(movementId);
      
      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlDeleteMovement:', error);
      throw new HttpsError('internal', error.message || 'Error al eliminar movimiento');
    }
  }
);

// SQL Inventory Functions - TASK-003

/**
 * Crear item de inventario SQL via Functions
 */
export const sqlCreateInventoryItem = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { inventoryData } = request.data;
      if (!inventoryData) {
        throw new HttpsError('invalid-argument', 'inventoryData es requerido');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await createInventoryItem(inventoryData, userInfo);
      
      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlCreateInventoryItem:', error);
      throw new HttpsError('internal', error.message || 'Error al crear item de inventario');
    }
  }
);

/**
 * Obtener todos los items del inventario SQL
 */
export const sqlGetAllInventory = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { filters } = request.data || {};
      
      const result = await getAllInventory(filters);
      
      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetAllInventory:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener inventario');
    }
  }
);

/**
 * Actualizar item de inventario SQL
 */
export const sqlUpdateInventoryItem = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { itemId, updateData } = request.data;
      if (!itemId || !updateData) {
        throw new HttpsError('invalid-argument', 'itemId y updateData son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await updateInventoryItem(itemId, updateData, userInfo);
      
      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateInventoryItem:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar item de inventario');
    }
  }
);

/**
 * Eliminar item de inventario SQL
 */
export const sqlDeleteInventoryItem = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { itemId } = request.data;
      if (!itemId) {
        throw new HttpsError('invalid-argument', 'itemId es requerido');
      }

      const result = await deleteInventoryItem(itemId);
      
      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlDeleteInventoryItem:', error);
      throw new HttpsError('internal', error.message || 'Error al eliminar item de inventario');
    }
  }
);

/**
 * Obtener inventario por ubicación SQL
 */
export const sqlGetInventoryByLocation = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { location } = request.data;
      if (!location) {
        throw new HttpsError('invalid-argument', 'location es requerida');
      }

      const result = await getInventoryByLocation(location);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetInventoryByLocation:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener inventario por ubicación');
    }
  }
);

// SQL Vehicles Functions - TASK-004

/**
 * Crear vehículo SQL via Functions
 */
export const sqlCreateVehicle = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleData } = request.data;
      if (!vehicleData) {
        throw new HttpsError('invalid-argument', 'vehicleData es requerido');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await createVehicle(vehicleData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlCreateVehicle:', error);
      throw new HttpsError('internal', error.message || 'Error al crear vehículo');
    }
  }
);

/**
 * Obtener todos los vehículos SQL
 */
export const sqlGetAllVehicles = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { filters } = request.data || {};

      const result = await getAllVehicles(filters);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetAllVehicles:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener vehículos');
    }
  }
);

/**
 * Obtener vehículo por ID SQL
 */
export const sqlGetVehicleById = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleId } = request.data;
      if (!vehicleId) {
        throw new HttpsError('invalid-argument', 'vehicleId es requerido');
      }

      const result = await getVehicleById(vehicleId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetVehicleById:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener vehículo');
    }
  }
);

/**
 * Actualizar vehículo SQL
 */
export const sqlUpdateVehicle = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleId, updateData } = request.data;
      if (!vehicleId || !updateData) {
        throw new HttpsError('invalid-argument', 'vehicleId y updateData son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await updateVehicle(vehicleId, updateData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateVehicle:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar vehículo');
    }
  }
);

/**
 * Eliminar vehículo SQL
 */
export const sqlDeleteVehicle = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleId } = request.data;
      if (!vehicleId) {
        throw new HttpsError('invalid-argument', 'vehicleId es requerido');
      }

      const result = await deleteVehicle(vehicleId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlDeleteVehicle:', error);
      throw new HttpsError('internal', error.message || 'Error al eliminar vehículo');
    }
  }
);

/**
 * Obtener estadísticas de vehículos SQL
 */
export const sqlGetVehiclesStats = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { filters } = request.data || {};

      const result = await getVehiclesStats(filters);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetVehiclesStats:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener estadísticas de vehículos');
    }
  }
);

// SQL Suppliers Functions - TASK-005

/**
 * Crear proveedor SQL via Functions
 */
export const sqlCreateSupplier = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { supplierData } = request.data;
      if (!supplierData) {
        throw new HttpsError('invalid-argument', 'supplierData es requerido');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await createSupplier(supplierData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlCreateSupplier:', error);
      throw new HttpsError('internal', error.message || 'Error al crear proveedor');
    }
  }
);

/**
 * Obtener todos los proveedores SQL
 */
export const sqlGetAllSuppliers = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { filters } = request.data || {};

      const result = await getAllSuppliers(filters);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetAllSuppliers:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener proveedores');
    }
  }
);

/**
 * Obtener proveedor por ID SQL
 */
export const sqlGetSupplierById = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { supplierId } = request.data;
      if (!supplierId) {
        throw new HttpsError('invalid-argument', 'supplierId es requerido');
      }

      const result = await getSupplierById(supplierId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetSupplierById:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener proveedor');
    }
  }
);

/**
 * Actualizar proveedor SQL
 */
export const sqlUpdateSupplier = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { supplierId, updateData } = request.data;
      if (!supplierId || !updateData) {
        throw new HttpsError('invalid-argument', 'supplierId y updateData son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await updateSupplier(supplierId, updateData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateSupplier:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar proveedor');
    }
  }
);

/**
 * Eliminar proveedor SQL
 */
export const sqlDeleteSupplier = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { supplierId } = request.data;
      if (!supplierId) {
        throw new HttpsError('invalid-argument', 'supplierId es requerido');
      }

      const result = await deleteSupplier(supplierId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlDeleteSupplier:', error);
      throw new HttpsError('internal', error.message || 'Error al eliminar proveedor');
    }
  }
);

/**
 * Actualizar estadísticas de proveedor SQL
 */
export const sqlUpdateSupplierStats = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { supplierId, stats } = request.data;
      if (!supplierId || !stats) {
        throw new HttpsError('invalid-argument', 'supplierId y stats son requeridos');
      }

      const result = await updateSupplierStats(supplierId, stats);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateSupplierStats:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar estadísticas de proveedor');
    }
  }
);

/**
 * Obtener proveedores preferidos SQL
 */
export const sqlGetPreferredSuppliers = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const result = await getPreferredSuppliers();

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetPreferredSuppliers:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener proveedores preferidos');
    }
  }
);

/**
 * Obtener estadísticas de proveedores SQL
 */
export const sqlGetSuppliersStats = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const result = await getSuppliersStats();

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetSuppliersStats:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener estadísticas de proveedores');
    }
  }
);

// SQL Products Functions - TASK-006

/**
 * Crear producto SQL via Functions
 */
export const sqlCreateProduct = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { productData } = request.data;
      if (!productData) {
        throw new HttpsError('invalid-argument', 'productData es requerido');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await createProduct(productData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlCreateProduct:', error);
      throw new HttpsError('internal', error.message || 'Error al crear producto');
    }
  }
);

/**
 * Obtener todos los productos SQL
 */
export const sqlGetAllProducts = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { filters } = request.data || {};

      const result = await getAllProducts(filters);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetAllProducts:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener productos');
    }
  }
);

/**
 * Obtener producto por ID SQL
 */
export const sqlGetProduct = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { productId } = request.data;
      if (!productId) {
        throw new HttpsError('invalid-argument', 'productId es requerido');
      }

      const result = await getProduct(productId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetProduct:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener producto');
    }
  }
);

/**
 * Actualizar producto SQL
 */
export const sqlUpdateProduct = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { productId, updateData } = request.data;
      if (!productId || !updateData) {
        throw new HttpsError('invalid-argument', 'productId y updateData son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await updateProduct(productId, updateData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateProduct:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar producto');
    }
  }
);

/**
 * Eliminar producto SQL
 */
export const sqlDeleteProduct = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { productId } = request.data;
      if (!productId) {
        throw new HttpsError('invalid-argument', 'productId es requerido');
      }

      const result = await deleteProduct(productId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlDeleteProduct:', error);
      throw new HttpsError('internal', error.message || 'Error al eliminar producto');
    }
  }
);

/**
 * Obtener productos por categoría SQL
 */
export const sqlGetProductsByCategory = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { category } = request.data;
      if (!category) {
        throw new HttpsError('invalid-argument', 'category es requerida');
      }

      const result = await getProductsByCategory(category);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetProductsByCategory:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener productos por categoría');
    }
  }
);

/**
 * Obtener productos activos SQL
 */
export const sqlGetActiveProducts = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const result = await getActiveProducts();

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetActiveProducts:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener productos activos');
    }
  }
);

/**
 * Actualizar stock de producto SQL
 */
export const sqlUpdateProductStock = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { productId, newStock } = request.data;
      if (!productId || newStock === undefined) {
        throw new HttpsError('invalid-argument', 'productId y newStock son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await updateProductStock(productId, newStock, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateProductStock:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar stock de producto');
    }
  }
);

/**
 * Buscar productos SQL
 */
export const sqlSearchProducts = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { searchTerm } = request.data;
      if (!searchTerm) {
        throw new HttpsError('invalid-argument', 'searchTerm es requerido');
      }

      const result = await searchProducts(searchTerm);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlSearchProducts:', error);
      throw new HttpsError('internal', error.message || 'Error al buscar productos');
    }
  }
);

/**
 * Obtener productos con stock bajo SQL
 */
export const sqlGetLowStockProducts = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const result = await getLowStockProducts();

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetLowStockProducts:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener productos con stock bajo');
    }
  }
);

/**
 * Obtener producto por código SQL
 */
export const sqlGetProductByCode = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { productCode } = request.data;
      if (!productCode) {
        throw new HttpsError('invalid-argument', 'productCode es requerido');
      }

      const result = await getProductByCode(productCode);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetProductByCode:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener producto por código');
    }
  }
);

// SQL Maintenance Functions - TASK-006

/**
 * Crear registro de mantenimiento SQL via Functions
 */
export const sqlCreateMaintenance = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { maintenanceData } = request.data;
      if (!maintenanceData) {
        throw new HttpsError('invalid-argument', 'maintenanceData es requerido');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await createMaintenanceRecord(maintenanceData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlCreateMaintenance:', error);
      throw new HttpsError('internal', error.message || 'Error al crear mantenimiento');
    }
  }
);

/**
 * Obtener todos los registros de mantenimiento SQL
 */
export const sqlGetAllMaintenance = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { filters } = request.data || {};

      const result = await getAllMaintenanceRecords(filters);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetAllMaintenance:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener mantenimientos');
    }
  }
);

/**
 * Obtener registro de mantenimiento por ID SQL
 */
export const sqlGetMaintenance = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { maintenanceId } = request.data;
      if (!maintenanceId) {
        throw new HttpsError('invalid-argument', 'maintenanceId es requerido');
      }

      const result = await getMaintenanceRecord(maintenanceId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetMaintenance:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener mantenimiento');
    }
  }
);

/**
 * Actualizar registro de mantenimiento SQL
 */
export const sqlUpdateMaintenance = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { maintenanceId, updateData } = request.data;
      if (!maintenanceId || !updateData) {
        throw new HttpsError('invalid-argument', 'maintenanceId y updateData son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await updateMaintenanceRecord(maintenanceId, updateData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateMaintenance:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar mantenimiento');
    }
  }
);

/**
 * Eliminar registro de mantenimiento SQL
 */
export const sqlDeleteMaintenance = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { maintenanceId } = request.data;
      if (!maintenanceId) {
        throw new HttpsError('invalid-argument', 'maintenanceId es requerido');
      }

      const result = await deleteMaintenanceRecord(maintenanceId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlDeleteMaintenance:', error);
      throw new HttpsError('internal', error.message || 'Error al eliminar mantenimiento');
    }
  }
);

/**
 * Obtener mantenimientos por vehículo SQL
 */
export const sqlGetMaintenanceByVehicle = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleId } = request.data;
      if (!vehicleId) {
        throw new HttpsError('invalid-argument', 'vehicleId es requerido');
      }

      const result = await getMaintenanceByVehicle(vehicleId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetMaintenanceByVehicle:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener mantenimientos por vehículo');
    }
  }
);

/**
 * Obtener próximos mantenimientos SQL
 */
export const sqlGetUpcomingMaintenance = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const result = await getUpcomingMaintenance();

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetUpcomingMaintenance:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener próximos mantenimientos');
    }
  }
);

/**
 * Obtener estadísticas de mantenimiento SQL
 */
export const sqlGetMaintenanceStats = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { filters } = request.data || {};

      const result = await getMaintenanceStats(filters);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetMaintenanceStats:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener estadísticas de mantenimiento');
    }
  }
);

// SQL Hour Meter Functions - TASK-006

/**
 * Registrar lectura de horómetro SQL via Functions
 */
export const sqlRecordHourMeterReading = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleId, newReading, movementId } = request.data;
      if (!vehicleId || newReading === undefined) {
        throw new HttpsError('invalid-argument', 'vehicleId y newReading son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await recordHourMeterReading(vehicleId, newReading, movementId, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlRecordHourMeterReading:', error);
      throw new HttpsError('internal', error.message || 'Error al registrar lectura de horómetro');
    }
  }
);

/**
 * Validar lectura de horómetro SQL
 */
export const sqlValidateHourMeterForMovement = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleId, requiredReading } = request.data;
      if (!vehicleId) {
        throw new HttpsError('invalid-argument', 'vehicleId es requerido');
      }

      const result = await validateHourMeterForMovement(vehicleId, requiredReading);

      return result;
    } catch (error) {
      console.error('❌ Error en sqlValidateHourMeterForMovement:', error);
      throw new HttpsError('internal', error.message || 'Error al validar horómetro');
    }
  }
);

/**
 * Obtener historial de horómetro SQL
 */
export const sqlGetHourMeterHistory = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleId, limit } = request.data;
      if (!vehicleId) {
        throw new HttpsError('invalid-argument', 'vehicleId es requerido');
      }

      const result = await getHourMeterHistory(vehicleId, limit);

      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Error en sqlGetHourMeterHistory:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener historial de horómetro');
    }
  }
);

/**
 * Inicializar horómetro SQL
 */
export const sqlInitializeHourMeter = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleId, initialReading } = request.data;
      if (!vehicleId || initialReading === undefined) {
        throw new HttpsError('invalid-argument', 'vehicleId y initialReading son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await initializeHourMeter(vehicleId, initialReading, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlInitializeHourMeter:', error);
      throw new HttpsError('internal', error.message || 'Error al inicializar horómetro');
    }
  }
);

/**
 * Obtener resumen de horómetro SQL
 */
export const sqlGetHourMeterSummary = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { vehicleId } = request.data;
      if (!vehicleId) {
        throw new HttpsError('invalid-argument', 'vehicleId es requerido');
      }

      const result = await getHourMeterSummary(vehicleId);

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetHourMeterSummary:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener resumen de horómetro');
    }
  }
);

/**
 * Obtener estadísticas de horómetros SQL
 */
export const sqlGetHourMeterStats = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { filters } = request.data || {};

      const result = await getHourMeterStats(filters);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetHourMeterStats:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener estadísticas de horómetros');
    }
  }
);

// SQL Vehicle Categories Functions - TASK-006

/**
 * Crear categoría de vehículo SQL via Functions
 */
export const sqlCreateCategory = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { categoryData } = request.data;
      if (!categoryData) {
        throw new HttpsError('invalid-argument', 'categoryData es requerido');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await createCategory(categoryData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlCreateCategory:', error);
      throw new HttpsError('internal', error.message || 'Error al crear categoría');
    }
  }
);

/**
 * Obtener todas las categorías SQL
 */
export const sqlGetAllCategories = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { options } = request.data || {};

      const result = await getAllCategories(options);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetAllCategories:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener categorías');
    }
  }
);

/**
 * Obtener categoría por ID SQL
 */
export const sqlGetCategory = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { categoryId } = request.data;
      if (!categoryId) {
        throw new HttpsError('invalid-argument', 'categoryId es requerido');
      }

      const result = await getCategory(categoryId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetCategory:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener categoría');
    }
  }
);

/**
 * Actualizar categoría SQL
 */
export const sqlUpdateCategory = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { categoryId, updateData } = request.data;
      if (!categoryId || !updateData) {
        throw new HttpsError('invalid-argument', 'categoryId y updateData son requeridos');
      }

      const userInfo = request.auth ? {
        uid: request.auth.uid,
        email: request.auth.token.email,
        displayName: request.auth.token.name,
      } : null;

      const result = await updateCategory(categoryId, updateData, userInfo);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateCategory:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar categoría');
    }
  }
);

/**
 * Eliminar categoría SQL
 */
export const sqlDeleteCategory = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { categoryId } = request.data;
      if (!categoryId) {
        throw new HttpsError('invalid-argument', 'categoryId es requerido');
      }

      const result = await deleteCategory(categoryId);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlDeleteCategory:', error);
      throw new HttpsError('internal', error.message || 'Error al eliminar categoría');
    }
  }
);

/**
 * Obtener categoría por código SQL
 */
export const sqlGetCategoryByCode = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { code } = request.data;
      if (!code) {
        throw new HttpsError('invalid-argument', 'code es requerido');
      }

      const result = await getCategoryByCode(code);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetCategoryByCode:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener categoría por código');
    }
  }
);

/**
 * Actualizar contador de vehículos en categoría SQL
 */
export const sqlUpdateVehicleCount = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { categoryId, increment } = request.data;
      if (!categoryId) {
        throw new HttpsError('invalid-argument', 'categoryId es requerido');
      }

      const result = await updateVehicleCount(categoryId, increment);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlUpdateVehicleCount:', error);
      throw new HttpsError('internal', error.message || 'Error al actualizar contador de vehículos');
    }
  }
);

/**
 * Reordenar categorías SQL
 */
export const sqlReorderCategories = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const { categoryOrders } = request.data;
      if (!categoryOrders) {
        throw new HttpsError('invalid-argument', 'categoryOrders es requerido');
      }

      const result = await reorderCategories(categoryOrders);

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlReorderCategories:', error);
      throw new HttpsError('internal', error.message || 'Error al reordenar categorías');
    }
  }
);

/**
 * Obtener categorías activas SQL
 */
export const sqlGetActiveCategories = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const result = await getActiveCategories();

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetActiveCategories:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener categorías activas');
    }
  }
);

/**
 * Obtener estadísticas de categorías SQL
 */
export const sqlGetCategoryStats = onCall(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const result = await getCategoryStats();

      if (!result.success) {
        throw new HttpsError('internal', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en sqlGetCategoryStats:', error);
      throw new HttpsError('internal', error.message || 'Error al obtener estadísticas de categorías');
    }
  }
);

/**
 * databaseHealthService.js - Servicio inteligente de diagnóstico de base de datos
 * Proporciona diagnóstico completo del estado de las tablas y auto-reparación
 * Forestech Combustibles App - Sistema Inteligente
 */

import sqlConnection from './SqlConnection.js';
import { initializeDatabase } from './databaseInitService.js';

/**
 * Configuración de tablas del sistema
 */
const SYSTEM_TABLES = {
  movements: {
    name: 'combustibles_movements',
    description: 'Movimientos de combustible',
    required: true,
    endpoints: ['/sqlGetAllMovements', '/sqlCreateMovement']
  },
  inventory: {
    name: 'combustibles_inventory',
    description: 'Inventario de combustible',
    required: true,
    endpoints: ['/sqlGetAllInventory', '/sqlCreateInventoryItem']
  },
  vehicles: {
    name: 'combustibles_vehicles',
    description: 'Vehículos',
    required: true,
    endpoints: ['/sqlGetAllVehicles', '/sqlCreateVehicle']
  },
  maintenance: {
    name: 'combustibles_maintenance',
    description: 'Mantenimiento',
    required: true,
    endpoints: ['/sqlGetAllMaintenance', '/sqlCreateMaintenance']
  },
  products: {
    name: 'combustibles_products',
    description: 'Productos',
    required: true,
    endpoints: ['/sqlGetAllProducts', '/sqlCreateProduct']
  },
  suppliers: {
    name: 'combustibles_suppliers',
    description: 'Proveedores',
    required: true,
    endpoints: ['/sqlGetAllSuppliers', '/sqlCreateSupplier']
  },
  vehicle_categories: {
    name: 'combustibles_vehicle_categories',
    description: 'Categorías de vehículos',
    required: true,
    endpoints: ['/sqlGetAllCategories', '/sqlCreateCategory']
  },
  product_categories: {
    name: 'product_categories',
    description: 'Categorías de productos',
    required: true,
    endpoints: ['/sqlGetAllCategories']
  }
};

/**
 * Verificar si una tabla específica existe
 * @param {string} tableName - Nombre de la tabla
 * @returns {Promise<boolean>} - true si existe, false si no
 */
const checkTableExists = async (tableName) => {
  try {
    const query = `
      SELECT 1 FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_NAME = @tableName
    `;
    const result = await sqlConnection.query(query, { tableName });
    return result.length > 0;
  } catch (error) {
    console.log(`🔍 Tabla ${tableName}: No existe (esperado en primera verificación)`);
    return false;
  }
};

/**
 * Obtener diagnóstico completo del sistema de base de datos
 * @returns {Promise<Object>} - Estado completo del sistema
 */
export async function getDatabaseHealth() {
  try {
    console.log('🔍 Iniciando diagnóstico completo de base de datos...');

    const healthReport = {
      timestamp: new Date().toISOString(),
      database: 'Azure SQL Server',
      connection: { status: 'checking', message: 'Verificando conexión...' },
      tables: {},
      system: { status: 'unknown', score: 0, issues: [], recommendations: [] },
      endpoints: { available: [], affected: [] }
    };

    // Verificar conexión
    try {
      await sqlConnection.query('SELECT 1 as test');
      healthReport.connection = {
        status: 'healthy',
        message: 'Conexión exitosa a Azure SQL Server'
      };
    } catch (error) {
      healthReport.connection = {
        status: 'error',
        message: `Error de conexión: ${error.message}`
      };
      return healthReport;
    }

    // Verificar cada tabla
    const tableChecks = [];
    for (const [key, config] of Object.entries(SYSTEM_TABLES)) {
      const exists = await checkTableExists(config.name);
      const status = exists ? 'healthy' : 'missing';

      healthReport.tables[key] = {
        name: config.name,
        description: config.description,
        status: status,
        exists: exists,
        required: config.required,
        endpoints: config.endpoints
      };

      tableChecks.push({ key, exists, required: config.required });
    }

    // Calcular estado del sistema
    const existingTables = tableChecks.filter(t => t.exists);
    const missingTables = tableChecks.filter(t => !t.exists);
    const missingRequired = missingTables.filter(t => t.required);

    healthReport.system.score = Math.round((existingTables.length / tableChecks.length) * 100);

    if (missingRequired.length === 0) {
      healthReport.system.status = 'healthy';
      healthReport.system.message = 'Sistema completamente operativo';
    } else if (missingRequired.length < tableChecks.length) {
      healthReport.system.status = 'degraded';
      healthReport.system.message = 'Sistema operativo con algunas tablas faltantes';
    } else {
      healthReport.system.status = 'critical';
      healthReport.system.message = 'Sistema crítico - tablas esenciales faltantes';
    }

    // Identificar problemas
    if (missingRequired.length > 0) {
      healthReport.system.issues.push({
        type: 'missing_tables',
        severity: 'critical',
        description: `${missingRequired.length} tablas requeridas no existen`,
        tables: missingRequired.map(t => SYSTEM_TABLES[t.key].name)
      });
    }

    // Generar recomendaciones
    if (healthReport.system.status !== 'healthy') {
      healthReport.system.recommendations.push({
        action: 'initialize_database',
        description: 'Ejecutar inicialización de base de datos para crear tablas faltantes',
        endpoint: '/sqlInitializeDatabase',
        priority: 'high'
      });
    }

    // Identificar endpoints afectados
    healthReport.endpoints.affected = [];
    for (const table of missingTables) {
      const config = SYSTEM_TABLES[table.key];
      healthReport.endpoints.affected.push(...config.endpoints);
    }

    healthReport.endpoints.available = Object.values(SYSTEM_TABLES)
      .filter(config => healthReport.tables[Object.keys(SYSTEM_TABLES).find(key => SYSTEM_TABLES[key] === config)].exists)
      .flatMap(config => config.endpoints);

    console.log(`📊 Diagnóstico completado: ${healthReport.system.score}% saludable`);
    return healthReport;

  } catch (error) {
    console.error('❌ Error en diagnóstico de base de datos:', error);
    return {
      timestamp: new Date().toISOString(),
      database: 'Azure SQL Server',
      connection: { status: 'error', message: error.message },
      tables: {},
      system: {
        status: 'error',
        score: 0,
        issues: [{ type: 'diagnostic_error', severity: 'critical', description: error.message }],
        recommendations: []
      },
      endpoints: { available: [], affected: [] }
    };
  }
}

/**
 * Obtener estado resumido del sistema
 * @returns {Promise<Object>} - Estado resumido para endpoints
 */
export async function getSystemStatus() {
  try {
    const health = await getDatabaseHealth();

    return {
      status: health.system.status,
      score: health.system.score,
      message: health.system.message,
      needs_initialization: health.system.status !== 'healthy',
      missing_tables_count: Object.values(health.tables).filter(t => !t.exists && t.required).length,
      total_tables: Object.keys(health.tables).length,
      available_endpoints: health.endpoints.available.length,
      affected_endpoints: health.endpoints.affected.length
    };
  } catch (error) {
    return {
      status: 'error',
      score: 0,
      message: 'Error al obtener estado del sistema',
      needs_initialization: true,
      missing_tables_count: 0,
      total_tables: 0,
      available_endpoints: 0,
      affected_endpoints: 0
    };
  }
}

/**
 * Verificar si el sistema necesita inicialización
 * @returns {Promise<boolean>} - true si necesita inicialización
 */
export async function needsInitialization() {
  try {
    const status = await getSystemStatus();
    return status.needs_initialization;
  } catch (error) {
    console.error('❌ Error verificando necesidad de inicialización:', error);
    return true; // Si hay error, asumir que necesita inicialización
  }
}

/**
 * Auto-reparar el sistema ejecutando inicialización si es necesario
 * @returns {Promise<Object>} - Resultado de la auto-reparación
 */
export async function autoRepair() {
  try {
    console.log('🔧 Iniciando auto-reparación del sistema...');

    const needsInit = await needsInitialization();

    if (!needsInit) {
      return {
        success: true,
        message: 'Auto-reparación no necesaria - sistema ya está saludable',
        action: 'none'
      };
    }

    console.log('⚡ Sistema necesita inicialización - ejecutando...');
    const result = await initializeDatabase();

    return {
      success: result.success,
      message: result.success ? 'Auto-reparación completada exitosamente' : 'Auto-reparación falló',
      action: 'initialized',
      details: result
    };

  } catch (error) {
    console.error('❌ Error en auto-reparación:', error);
    return {
      success: false,
      message: 'Error en auto-reparación',
      action: 'error',
      error: error.message
    };
  }
}
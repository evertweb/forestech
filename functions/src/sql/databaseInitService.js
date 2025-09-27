/**
 * databaseInitService.js - Servicio de inicialización de base de datos
 * Ejecuta las consultas SQL para crear todas las tablas necesarias
 * Forestech Combustibles App
 */

import sqlConnection from './SqlConnection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Obtener el contenido del archivo SQL de creación de tablas
 * @returns {string} - Contenido del archivo SQL
 */
const getCreateTablesSQL = () => {
  try {
    // Intentar múltiples rutas para encontrar el archivo SQL
    const possiblePaths = [
      // Ruta relativa desde functions/src/sql/
      path.join(__dirname, '../../../sql/create-tables.sql'),
      // Ruta desde la raíz del proyecto
      path.join(process.cwd(), 'sql/create-tables.sql'),
      // Ruta desde functions/
      path.join(process.cwd(), '../sql/create-tables.sql'),
      // Ruta absoluta (si existe)
      '/app/sql/create-tables.sql',
      // Ruta en el directorio actual
      path.join(__dirname, 'create-tables.sql')
    ];

    let sqlContent = null;
    let usedPath = null;

    for (const sqlPath of possiblePaths) {
      try {
        if (fs.existsSync(sqlPath)) {
          sqlContent = fs.readFileSync(sqlPath, 'utf8');
          usedPath = sqlPath;
          console.log(`📄 SQL file loaded successfully from: ${sqlPath}`);
          break;
        }
      } catch (e) {
        // Continuar con la siguiente ruta
      }
    }

    if (!sqlContent) {
      throw new Error('No se pudo encontrar el archivo create-tables.sql en ninguna de las rutas esperadas');
    }

    return sqlContent;
  } catch (error) {
    console.error('❌ Error loading SQL file:', error);
    throw new Error(`No se pudo cargar el archivo SQL: ${error.message}`);
  }
};

/**
 * Ejecutar consultas SQL para crear tablas
 * @param {string} sqlContent - Contenido SQL a ejecutar
 * @returns {Promise<Object>} - Resultado de la operación
 */
const executeCreateTables = async (sqlContent) => {
  try {
    console.log('🔧 Iniciando creación de tablas SQL...');

    // Dividir el contenido SQL en consultas individuales
    const queries = sqlContent
      .split('GO')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'));

    console.log(`📊 Encontradas ${queries.length} consultas para ejecutar`);

    const results = [];

    // Ejecutar cada consulta
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`⚡ Ejecutando consulta ${i + 1}/${queries.length}...`);

      try {
        const result = await sqlConnection.execute(query);
        results.push({
          query: i + 1,
          success: true,
          rowsAffected: result?.rowsAffected || 0
        });
        console.log(`✅ Consulta ${i + 1} ejecutada exitosamente`);
      } catch (error) {
        console.error(`❌ Error en consulta ${i + 1}:`, error.message);
        results.push({
          query: i + 1,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    console.log(`📊 Resultados: ${successCount} exitosas, ${errorCount} con errores`);

    return {
      success: errorCount === 0,
      totalQueries: queries.length,
      successfulQueries: successCount,
      failedQueries: errorCount,
      results: results
    };

  } catch (error) {
    console.error('❌ Error al ejecutar consultas SQL:', error);
    throw error;
  }
};

/**
 * Verificar si las tablas ya existen
 * @returns {Promise<Object>} - Estado de las tablas
 */
const checkTablesExist = async () => {
  try {
    console.log('🔍 Verificando existencia de tablas...');

    const tables = [
      'combustibles_movements',
      'combustibles_inventory',
      'combustibles_vehicles',
      'combustibles_maintenance',
      'combustibles_products',
      'combustibles_suppliers',
      'combustibles_vehicle_categories',
      'product_categories'
    ];

    const existingTables = [];

    for (const tableName of tables) {
      try {
        const query = `SELECT TOP 1 * FROM ${tableName}`;
        await sqlConnection.execute(query);
        existingTables.push(tableName);
        console.log(`✅ Tabla ${tableName} existe`);
      } catch (error) {
        console.log(`❌ Tabla ${tableName} no existe`);
      }
    }

    return {
      existingTables,
      missingTables: tables.filter(table => !existingTables.includes(table)),
      allTablesExist: existingTables.length === tables.length
    };

  } catch (error) {
    console.error('❌ Error al verificar tablas:', error);
    return {
      existingTables: [],
      missingTables: [],
      allTablesExist: false,
      error: error.message
    };
  }
};

/**
 * Inicializar la base de datos (verificar y crear tablas si es necesario)
 * @returns {Promise<Object>} - Resultado de la inicialización
 */
export async function initializeDatabase() {
  try {
    console.log('🚀 Iniciando inicialización de base de datos...');

    // Verificar si las tablas ya existen
    const tableStatus = await checkTablesExist();

    if (tableStatus.allTablesExist) {
      console.log('✅ Todas las tablas ya existen, no es necesario crearlas');
      return {
        success: true,
        message: 'Base de datos ya inicializada',
        existingTables: tableStatus.existingTables,
        action: 'none'
      };
    }

    console.log('📋 Faltan tablas por crear:', tableStatus.missingTables);

    // Obtener el contenido SQL
    const sqlContent = getCreateTablesSQL();

    // Ejecutar las consultas
    const result = await executeCreateTables(sqlContent);

    if (result.success) {
      console.log('🎉 ¡Base de datos inicializada exitosamente!');
      return {
        success: true,
        message: 'Base de datos inicializada exitosamente',
        totalQueries: result.totalQueries,
        successfulQueries: result.successfulQueries,
        failedQueries: result.failedQueries,
        action: 'created'
      };
    } else {
      console.error('❌ Error al inicializar base de datos');
      return {
        success: false,
        message: 'Error al inicializar base de datos',
        error: 'Algunas consultas fallaron',
        totalQueries: result.totalQueries,
        successfulQueries: result.successfulQueries,
        failedQueries: result.failedQueries,
        results: result.results,
        action: 'partial'
      };
    }

  } catch (error) {
    console.error('❌ Error en inicialización de base de datos:', error);
    return {
      success: false,
      message: 'Error en inicialización de base de datos',
      error: error.message,
      action: 'error'
    };
  }
}

/**
 * Forzar recreación de todas las tablas (cuidado: elimina datos existentes)
 * @returns {Promise<Object>} - Resultado de la recreación
 */
export async function forceRecreateTables() {
  try {
    console.log('⚠️  Iniciando recreación forzada de tablas...');

    const sqlContent = getCreateTablesSQL();
    const result = await executeCreateTables(sqlContent);

    if (result.success) {
      console.log('🎉 ¡Tablas recreadas exitosamente!');
      return {
        success: true,
        message: 'Tablas recreadas exitosamente',
        totalQueries: result.totalQueries,
        successfulQueries: result.successfulQueries,
        failedQueries: result.failedQueries,
        action: 'recreated'
      };
    } else {
      return {
        success: false,
        message: 'Error al recrear tablas',
        error: 'Algunas consultas fallaron',
        totalQueries: result.totalQueries,
        successfulQueries: result.successfulQueries,
        failedQueries: result.failedQueries,
        results: result.results,
        action: 'partial'
      };
    }

  } catch (error) {
    console.error('❌ Error en recreación de tablas:', error);
    return {
      success: false,
      message: 'Error en recreación de tablas',
      error: error.message,
      action: 'error'
    };
  }
}
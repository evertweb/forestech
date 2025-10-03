#!/usr/bin/env node
/**
 * run-migration-categories.js
 * Script para ejecutar la migración de combustibles_vehicle_categories
 * Agrega las columnas faltantes: sortOrder, vehicleCount, icon, color, etc.
 */

import sqlConnection from './src/cloudsql/oil-connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TABLE_NAME = 'combustibles_vehicle_categories';

/**
 * Verificar si una columna existe en la tabla
 */
async function checkColumnExists(columnName) {
  const query = `
    SELECT COUNT(*) as count
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = @tableName 
    AND COLUMN_NAME = @columnName
  `;
  
  const result = await sqlConnection.query(query, { 
    tableName: TABLE_NAME, 
    columnName 
  });
  
  return result[0].count > 0;
}

/**
 * Agregar una columna si no existe
 */
async function addColumnIfNotExists(columnName, columnType, defaultValue = null) {
  const exists = await checkColumnExists(columnName);
  
  if (exists) {
    console.log(`⚠️  ${columnName} ya existe - OK`);
    return { success: true, action: 'skip', column: columnName };
  }
  
  try {
    let alterQuery = `ALTER TABLE ${TABLE_NAME} ADD ${columnName} ${columnType}`;
    
    if (defaultValue !== null) {
      alterQuery += ` DEFAULT ${defaultValue}`;
    }
    
    await sqlConnection.query(alterQuery);
    console.log(`✅ ${columnName} agregada exitosamente`);
    return { success: true, action: 'added', column: columnName };
  } catch (error) {
    console.error(`❌ Error agregando ${columnName}:`, error.message);
    return { success: false, action: 'error', column: columnName, error: error.message };
  }
}

/**
 * Ejecutar migración completa
 */
async function runMigration() {
  console.log('🚀 INICIANDO MIGRACIÓN DE COMBUSTIBLES_VEHICLE_CATEGORIES');
  console.log('========================================================\n');
  
  try {
    // Verificar que la tabla existe
    const tableExists = await sqlConnection.query(`
      SELECT COUNT(*) as count
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = @tableName
    `, { tableName: TABLE_NAME });
    
    if (tableExists[0].count === 0) {
      console.error('❌ ERROR: La tabla combustibles_vehicle_categories no existe!');
      console.log('Debe crear primero la tabla antes de ejecutar esta migración.');
      process.exit(1);
    }
    
    console.log('✅ Tabla combustibles_vehicle_categories encontrada\n');
    
    // Mostrar columnas actuales
    console.log('📊 COLUMNAS ACTUALES:');
    const currentColumns = await sqlConnection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = @tableName
      ORDER BY ORDINAL_POSITION
    `, { tableName: TABLE_NAME });
    
    console.table(currentColumns);
    console.log('');
    
    // Lista de columnas a agregar
    console.log('🔧 AGREGANDO COLUMNAS FALTANTES...\n');
    
    const columnsToAdd = [
      { name: 'sortOrder', type: 'INT', default: '0', critical: true },
      { name: 'vehicleCount', type: 'INT', default: '0', critical: true },
      { name: 'icon', type: 'NVARCHAR(100)', default: null },
      { name: 'color', type: 'NVARCHAR(50)', default: null },
      { name: 'customFields', type: 'NVARCHAR(MAX)', default: null },
      { name: 'defaultFuelType', type: 'NVARCHAR(50)', default: null },
      { name: 'estimatedConsumption', type: 'DECIMAL(8,3)', default: null },
      { name: 'updatedAt', type: 'DATETIME2', default: 'GETUTCDATE()' },
      { name: 'updatedBy', type: 'NVARCHAR(100)', default: null },
    ];
    
    const results = [];
    
    for (const column of columnsToAdd) {
      const result = await addColumnIfNotExists(
        column.name, 
        column.type, 
        column.default
      );
      results.push(result);
    }
    
    console.log('\n📋 RESUMEN DE MIGRACIÓN:');
    console.log('========================================================');
    
    const added = results.filter(r => r.action === 'added');
    const skipped = results.filter(r => r.action === 'skip');
    const errors = results.filter(r => r.action === 'error');
    
    console.log(`✅ Columnas agregadas: ${added.length}`);
    console.log(`⚠️  Columnas existentes (omitidas): ${skipped.length}`);
    console.log(`❌ Errores: ${errors.length}`);
    
    if (added.length > 0) {
      console.log('\n🆕 Columnas nuevas agregadas:');
      added.forEach(r => console.log(`   - ${r.column}`));
    }
    
    if (errors.length > 0) {
      console.log('\n❌ Columnas con errores:');
      errors.forEach(r => console.log(`   - ${r.column}: ${r.error}`));
    }
    
    // Verificar columnas críticas
    console.log('\n🔍 VERIFICANDO COLUMNAS CRÍTICAS...');
    const sortOrderExists = await checkColumnExists('sortOrder');
    const vehicleCountExists = await checkColumnExists('vehicleCount');
    
    if (sortOrderExists && vehicleCountExists) {
      console.log('✅ ¡Migración completada exitosamente!');
      console.log('✅ Todas las columnas críticas están disponibles');
      console.log('\n🎉 Ya puedes usar las categorías sin errores');
    } else {
      console.error('\n❌ MIGRACIÓN INCOMPLETA:');
      if (!sortOrderExists) console.error('   - sortOrder faltante');
      if (!vehicleCountExists) console.error('   - vehicleCount faltante');
    }
    
    // Mostrar columnas finales
    console.log('\n📊 COLUMNAS FINALES:');
    const finalColumns = await sqlConnection.query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = @tableName
      ORDER BY ORDINAL_POSITION
    `, { tableName: TABLE_NAME });
    
    console.table(finalColumns);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ ERROR FATAL EN MIGRACIÓN:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar migración
console.log('⏳ Iniciando conexión a SQL Server...\n');
runMigration().catch(error => {
  console.error('❌ Error ejecutando migración:', error);
  process.exit(1);
});

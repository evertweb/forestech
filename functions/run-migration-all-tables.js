#!/usr/bin/env node
/**
 * run-migration-all-tables.js
 * Script para ejecutar migraciones en TODAS las tablas principales
 * Agrega columnas faltantes detectadas en los tests
 */

import sqlConnection from './src/cloudsql/oil-connection.js';

const migrations = {
  // Tabla de suppliers
  combustibles_suppliers: [
    { name: 'lastOrderDate', type: 'DATETIME2', default: null },
    { name: 'averageDeliveryTime', type: 'INT', default: null },
    { name: 'updatedAt', type: 'DATETIME2', default: 'GETUTCDATE()' },
    { name: 'updatedBy', type: 'NVARCHAR(100)', default: null },
    { name: 'totalOrders', type: 'INT', default: '0' },
    { name: 'totalAmount', type: 'DECIMAL(18,2)', default: '0' },
  ],
  
  // Tabla de products
  combustibles_products: [
    { name: 'updatedAt', type: 'DATETIME2', default: 'GETUTCDATE()' },
    { name: 'updatedBy', type: 'NVARCHAR(100)', default: null },
  ],
  
  // Tabla de inventory
  combustibles_inventory: [
    { name: 'updatedAt', type: 'DATETIME2', default: 'GETUTCDATE()' },
    { name: 'updatedBy', type: 'NVARCHAR(100)', default: null },
    { name: 'lastMovementDate', type: 'DATETIME2', default: null },
  ],
  
  // Tabla de maintenance
  combustibles_maintenance: [
    { name: 'updatedAt', type: 'DATETIME2', default: 'GETUTCDATE()' },
    { name: 'updatedBy', type: 'NVARCHAR(100)', default: null },
  ],
};

async function checkColumnExists(tableName, columnName) {
  const query = `
    SELECT COUNT(*) as count
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = @tableName 
    AND COLUMN_NAME = @columnName
  `;
  
  const result = await sqlConnection.query(query, { tableName, columnName });
  return result[0].count > 0;
}

async function addColumnIfNotExists(tableName, columnName, columnType, defaultValue = null) {
  const exists = await checkColumnExists(tableName, columnName);
  
  if (exists) {
    console.log(`  ⚠️  ${columnName} ya existe`);
    return { success: true, action: 'skip', column: columnName };
  }
  
  try {
    let alterQuery = `ALTER TABLE ${tableName} ADD ${columnName} ${columnType}`;
    
    if (defaultValue !== null) {
      alterQuery += ` DEFAULT ${defaultValue}`;
    }
    
    await sqlConnection.query(alterQuery);
    console.log(`  ✅ ${columnName} agregada`);
    return { success: true, action: 'added', column: columnName };
  } catch (error) {
    console.error(`  ❌ Error agregando ${columnName}:`, error.message);
    return { success: false, action: 'error', column: columnName, error: error.message };
  }
}

async function runAllMigrations() {
  console.log('🚀 INICIANDO MIGRACIÓN COMPLETA DE TODAS LAS TABLAS');
  console.log('══════════════════════════════════════════════════\n');
  
  const allResults = {};
  
  try {
    for (const [tableName, columns] of Object.entries(migrations)) {
      console.log(`\n📋 Migrando tabla: ${tableName}`);
      console.log('─'.repeat(50));
      
      // Verificar que la tabla existe
      const tableExists = await sqlConnection.query(`
        SELECT COUNT(*) as count
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = @tableName
      `, { tableName });
      
      if (tableExists[0].count === 0) {
        console.error(`  ❌ Tabla ${tableName} no existe - OMITIDA`);
        allResults[tableName] = { skipped: true, reason: 'table_not_exists' };
        continue;
      }
      
      console.log(`  ✅ Tabla encontrada`);
      
      const tableResults = [];
      
      for (const column of columns) {
        const result = await addColumnIfNotExists(
          tableName,
          column.name,
          column.type,
          column.default
        );
        tableResults.push(result);
      }
      
      const added = tableResults.filter(r => r.action === 'added');
      const skipped = tableResults.filter(r => r.action === 'skip');
      const errors = tableResults.filter(r => r.action === 'error');
      
      console.log(`\n  📊 Resumen ${tableName}:`);
      console.log(`     ✅ Agregadas: ${added.length}`);
      console.log(`     ⚠️  Omitidas: ${skipped.length}`);
      console.log(`     ❌ Errores: ${errors.length}`);
      
      allResults[tableName] = { added, skipped, errors };
    }
    
    // Resumen final
    console.log('\n\n🎯 RESUMEN FINAL DE MIGRACIONES');
    console.log('══════════════════════════════════════════════════');
    
    let totalAdded = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    
    for (const [tableName, results] of Object.entries(allResults)) {
      if (results.skipped) {
        console.log(`\n❌ ${tableName}: Tabla no existe`);
        continue;
      }
      
      totalAdded += results.added.length;
      totalSkipped += results.skipped.length;
      totalErrors += results.errors.length;
      
      console.log(`\n✅ ${tableName}:`);
      console.log(`   - Agregadas: ${results.added.length}`);
      console.log(`   - Omitidas: ${results.skipped.length}`);
      console.log(`   - Errores: ${results.errors.length}`);
      
      if (results.added.length > 0) {
        console.log(`   - Nuevas columnas: ${results.added.map(r => r.column).join(', ')}`);
      }
    }
    
    console.log('\n📈 TOTALES:');
    console.log(`   ✅ Total columnas agregadas: ${totalAdded}`);
    console.log(`   ⚠️  Total columnas omitidas: ${totalSkipped}`);
    console.log(`   ❌ Total errores: ${totalErrors}`);
    
    if (totalErrors === 0) {
      console.log('\n🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!');
    } else {
      console.log('\n⚠️  Migración completada con algunos errores');
    }
    
    process.exit(totalErrors > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n❌ ERROR FATAL EN MIGRACIÓN:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

console.log('⏳ Iniciando conexión a SQL Server...\n');
runAllMigrations().catch(error => {
  console.error('❌ Error ejecutando migración:', error);
  process.exit(1);
});

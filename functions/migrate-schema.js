/**
 * Migración de esquema para combustibles_vehicle_categories
 * Ejecutar desde Firebase Functions con acceso al SQL Server de DigitalOcean
 */

import sqlConnection from './src/sql/SqlConnection.js';

const TABLE_NAME = 'combustibles_vehicle_categories';

const migrateSchema = async () => {
  try {
    console.log('🚀 Iniciando migración de esquema para', TABLE_NAME);
    
    // Verificar columnas existentes
    const existingColumnsQuery = `
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = '${TABLE_NAME}'
      ORDER BY ORDINAL_POSITION
    `;
    
    const existingColumns = await sqlConnection.query(existingColumnsQuery);
    const columnNames = existingColumns.map(col => col.COLUMN_NAME);
    
    console.log('📊 Columnas existentes:', columnNames);
    
    const requiredColumns = [
      { name: 'sortOrder', type: 'INT', defaultValue: '0' },
      { name: 'vehicleCount', type: 'INT', defaultValue: '0' },
      { name: 'icon', type: 'NVARCHAR(100)', defaultValue: null },
      { name: 'color', type: 'NVARCHAR(50)', defaultValue: null },
      { name: 'customFields', type: 'NVARCHAR(MAX)', defaultValue: null },
      { name: 'defaultFuelType', type: 'NVARCHAR(50)', defaultValue: null },
      { name: 'estimatedConsumption', type: 'DECIMAL(8,3)', defaultValue: null },
      { name: 'updatedAt', type: 'DATETIME2', defaultValue: 'GETUTCDATE()' },
      { name: 'updatedBy', type: 'NVARCHAR(100)', defaultValue: null }
    ];
    
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col.name));
    
    if (missingColumns.length === 0) {
      console.log('✅ Todas las columnas ya existen');
      return { success: true, message: 'No se necesitan cambios' };
    }
    
    console.log('❌ Columnas faltantes:', missingColumns.map(c => c.name));
    
    // Agregar columnas faltantes
    for (const column of missingColumns) {
      console.log(`➕ Agregando columna: ${column.name}`);
      
      let alterQuery = `ALTER TABLE ${TABLE_NAME} ADD ${column.name} ${column.type}`;
      
      if (column.defaultValue) {
        if (column.defaultValue === 'GETUTCDATE()') {
          alterQuery += ` DEFAULT GETUTCDATE()`;
        } else {
          alterQuery += ` DEFAULT ${column.defaultValue}`;
        }
      }
      
      try {
        await sqlConnection.execute(alterQuery);
        console.log(`✅ ${column.name} agregada exitosamente`);
      } catch (error) {
        console.error(`❌ Error agregando ${column.name}:`, error.message);
        throw error;
      }
    }
    
    // Crear índice para sortOrder si no existe
    try {
      await sqlConnection.execute(`
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_sort_order' AND object_id = OBJECT_ID('${TABLE_NAME}'))
        CREATE INDEX idx_sort_order ON ${TABLE_NAME}(sortOrder)
      `);
      console.log('✅ Índice idx_sort_order verificado/creado');
    } catch (error) {
      console.log('⚠️ Error creando índice (puede ya existir):', error.message);
    }
    
    // Verificación final
    const finalColumnsResult = await sqlConnection.query(existingColumnsQuery);
    console.log('\n📋 Estructura final de la tabla:');
    finalColumnsResult.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    return { 
      success: true, 
      message: `${missingColumns.length} columnas agregadas exitosamente`,
      columnsAdded: missingColumns.map(c => c.name)
    };
    
  } catch (error) {
    console.error('❌ Error en migración:', error.message);
    return { success: false, error: error.message };
  }
};

export { migrateSchema };
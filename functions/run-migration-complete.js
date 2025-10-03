#!/usr/bin/env node
import sqlConnection from './src/cloudsql/oil-connection.js';

const TIMESTAMP = Date.now();
console.log(`🔧 MIGRACIÓN COMPLETA - Timestamp: ${TIMESTAMP}`);
console.log('====================================\n');

const checkColumnExists = async (tableName, columnName) => {
  const query = `
    SELECT COUNT(*) as count
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = @tableName AND COLUMN_NAME = @columnName
  `;
  const result = await sqlConnection.query(query, { tableName, columnName });
  return result[0].count > 0;
};

const addColumnIfNotExists = async (tableName, columnName, columnType, defaultValue = null) => {
  const exists = await checkColumnExists(tableName, columnName);
  if (!exists) {
    const defaultClause = defaultValue ? ` DEFAULT ${defaultValue}` : '';
    const alterQuery = `ALTER TABLE ${tableName} ADD ${columnName} ${columnType}${defaultClause}`;
    await sqlConnection.query(alterQuery);
    console.log(`  ✅ Agregada columna: ${columnName} (${columnType})`);
    return true;
  } else {
    console.log(`  ⚠️  Columna ya existe: ${columnName}`);
    return false;
  }
};

const migrations = {
  combustibles_suppliers: [
    { name: 'totalPurchased', type: 'DECIMAL(18,2)', default: '0' },
    { name: 'city', type: 'NVARCHAR(100)', default: "''" },
    { name: 'state', type: 'NVARCHAR(100)', default: "'Colombia'" },
    { name: 'fuelTypes', type: 'NVARCHAR(MAX)', default: "'[]'" },
    { name: 'paymentTerms', type: 'NVARCHAR(100)', default: "'contado'" },
    { name: 'creditLimit', type: 'DECIMAL(18,2)', default: '0' },
    { name: 'priceList', type: 'NVARCHAR(MAX)', default: "'{}'" },
    { name: 'rating', type: 'DECIMAL(3,2)', default: '5.0' },
    { name: 'evaluationNotes', type: 'NVARCHAR(MAX)', default: "''" },
  ],
  combustibles_vehicles: [
    { name: 'searchTags', type: 'NVARCHAR(MAX)', default: "'[]'" },
    { name: 'year', type: 'INT', default: null },
    { name: 'plateNumber', type: 'NVARCHAR(50)', default: "''" },
    { name: 'enginePower', type: 'DECIMAL(10,2)', default: null },
    { name: 'fuelCapacity', type: 'DECIMAL(10,2)', default: null },
    { name: 'initialHourMeter', type: 'DECIMAL(10,2)', default: null },
    { name: 'hourMeterHistory', type: 'NVARCHAR(MAX)', default: "'[]'" },
    { name: 'estimatedConsumptionPerHour', type: 'DECIMAL(10,2)', default: '0' },
    { name: 'maintenanceHistory', type: 'NVARCHAR(MAX)', default: "'[]'" },
  ],
  combustibles_inventory: [
    { name: 'lastMovementId', type: 'UNIQUEIDENTIFIER', default: null },
    { name: 'lastMovementType', type: 'NVARCHAR(50)', default: null },
    { name: 'lastMovementQuantity', type: 'DECIMAL(10,2)', default: null },
  ],
};

(async () => {
  try {
    console.log('🚀 Iniciando migración completa...\n');

    for (const [tableName, columns] of Object.entries(migrations)) {
      console.log(`📋 Procesando tabla: ${tableName}`);
      
      // Verificar que la tabla exista
      const tableExistsQuery = `
        SELECT COUNT(*) as count
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME = @tableName
      `;
      const tableResult = await sqlConnection.query(tableExistsQuery, { tableName });
      
      if (tableResult[0].count === 0) {
        console.log(`  ❌ Tabla ${tableName} no existe - OMITIENDO\n`);
        continue;
      }
      
      console.log(`  ✅ Tabla encontrada`);
      
      let addedCount = 0;
      for (const col of columns) {
        const added = await addColumnIfNotExists(
          tableName,
          col.name,
          col.type,
          col.default
        );
        if (added) addedCount++;
      }
      
      console.log(`  📊 Total columnas agregadas: ${addedCount}/${columns.length}\n`);
    }

    console.log('🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
})();

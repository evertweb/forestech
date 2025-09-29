#!/usr/bin/env node

/**
 * Migración de datos Azure SQL → Cloud SQL "oil"
 * Script de respaldo si no puedes hacer backup/restore directo
 */

import sql from 'mssql';

// Configuración Azure SQL (origen)
const AZURE_CONFIG = {
  server: 'oilforestech.privatelink.database.windows.net',
  database: 'forestechCombus',
  user: 'oil',
  password: process.env.AZURE_SQL_PASSWORD || '271202Ev.',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// Configuración Cloud SQL "oil" (destino)
const OIL_CONFIG = {
  server: '34.61.242.157',
  port: 1433,
  database: 'forestechCombus',
  user: 'sqlserver',
  password: '123456789',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

const migrateData = async () => {
  console.log('🚀 Iniciando migración de datos Azure → Cloud SQL oil...\n');

  let azurePool, oilPool;

  try {
    // Conectar a ambas bases de datos
    console.log('🔌 Conectando a Azure SQL...');
    azurePool = await sql.connect(AZURE_CONFIG);
    console.log('✅ Conectado a Azure SQL');

    console.log('🔌 Conectando a Cloud SQL oil...');
    oilPool = new sql.ConnectionPool(OIL_CONFIG);
    await oilPool.connect();
    console.log('✅ Conectado a Cloud SQL oil');

    // Lista de tablas a migrar (en orden de dependencias)
    const tables = [
      'VehicleCategories',
      'Suppliers',
      'Products',
      'Vehicles',
      'Inventory',
      'Movements',
      'Maintenance',
      'HourMeterReadings'
    ];

    for (const table of tables) {
      try {
        console.log(`\n📊 Migrando tabla: ${table}`);

        // Obtener datos de Azure
        const azureData = await azurePool.request().query(`SELECT * FROM ${table}`);
        const records = azureData.recordset;

        console.log(`   📋 Encontrados ${records.length} registros`);

        if (records.length === 0) {
          console.log(`   ⚠️ Tabla ${table} vacía, saltando...`);
          continue;
        }

        // Limpiar tabla destino
        await oilPool.request().query(`DELETE FROM ${table}`);

        // Migrar registros
        let migrated = 0;
        for (const record of records) {
          try {
            const columns = Object.keys(record).join(', ');
            const values = Object.keys(record).map(key => `@${key}`).join(', ');

            const insertQuery = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
            const request = oilPool.request();

            // Agregar parámetros
            Object.entries(record).forEach(([key, value]) => {
              request.input(key, value);
            });

            await request.query(insertQuery);
            migrated++;
          } catch (error) {
            console.warn(`     ⚠️ Error en registro ${migrated + 1}: ${error.message}`);
          }
        }

        console.log(`   ✅ ${table}: ${migrated}/${records.length} registros migrados`);

      } catch (error) {
        console.error(`   ❌ Error migrando ${table}: ${error.message}`);
      }
    }

    console.log('\n🎉 Migración completada!');

  } catch (error) {
    console.error('❌ Error en migración:', error.message);
  } finally {
    if (azurePool) await azurePool.close();
    if (oilPool) await oilPool.close();
  }
};

// Ejecutar migración
migrateData();
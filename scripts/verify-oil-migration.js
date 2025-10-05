#!/usr/bin/env node

/**
 * Verificación de migración en SQL Server DigitalOcean (DBforestech)
 */

import sql from 'mssql';

const CONFIG = {
  server: '24.199.89.134',
  port: 1433,
  database: 'DBforestech',
  user: 'SA',
  password: 'Forestech2024!SecureDB',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

const verifyMigration = async () => {
  console.log('🔍 VERIFICACIÓN DE MIGRACIÓN - DIGITALOCEAN SQL SERVER');
  console.log('======================================================');

  try {
    const pool = await sql.connect(CONFIG);

    // Verificar tablas principales
    const tables = [
      'combustibles_vehicle_categories',
      'combustibles_suppliers',
      'combustibles_products',
      'combustibles_vehicles',
      'combustibles_inventory',
      'combustibles_movements',
      'combustibles_maintenance',
      'combustibles_hour_meter_readings'
    ];

    console.log('📊 Conteo de registros por tabla:');
    for (const table of tables) {
      try {
  const result = await pool.request().query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${result.recordset[0].count} registros`);
      } catch (error) {
        console.log(`   ${table}: ❌ Error - ${error.message}`);
      }
    }

    // Verificar últimos registros
    console.log('\n📅 Últimas fechas de creación:');
    try {
  const lastMovement = await pool.request().query('SELECT MAX(createdAt) as last_date FROM combustibles_movements');
  const lastVehicle = await pool.request().query('SELECT MAX(createdAt) as last_date FROM combustibles_vehicles');

      console.log(`   Último Movement: ${lastMovement.recordset[0].last_date || 'Sin datos'}`);
      console.log(`   Último Vehicle: ${lastVehicle.recordset[0].last_date || 'Sin datos'}`);
    } catch (error) {
      console.log('   ⚠️ Error obteniendo fechas (normal si las tablas están vacías)');
    }

    // Test de performance
    console.log('\n⚡ Test de performance:');
    const startTime = Date.now();
    await pool.request().query('SELECT 1 as test');
    const duration = Date.now() - startTime;
  console.log(`   Latencia: ${duration}ms ${duration < 500 ? '✅' : '❌'} (requerido <500ms)`);

    await pool.close();
  console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error en verificación:', error.message);
  }
};

verifyMigration();
#!/usr/bin/env node

/**
 * Test de conexión a Cloud SQL "oil"
 * Verifica conectividad y configuración de tu instancia específica
 */

import sql from 'mssql';

const CONFIG = {
  server: '34.61.242.157',
  port: 1433,
  database: 'forestechCombus',
  user: 'oil',
  password: '123456789',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectionTimeout: 10000,
    requestTimeout: 10000
  }
};

const testConnection = async () => {
  console.log('🧪 TESTING CLOUD SQL "OIL" CONNECTION');
  console.log('=====================================');
  console.log('📍 Server: 34.61.242.157:1433');
  console.log('🗄️ Database: forestechCombus');
  console.log('👤 User: oil');
  console.log('');

  try {
    console.log('🔌 Conectando a Cloud SQL "oil"...');
    const pool = await sql.connect(CONFIG);
    console.log('✅ Conexión exitosa!');

    // Test básico
    console.log('\n📊 Información del servidor:');
    const serverInfo = await pool.request().query('SELECT @@VERSION as version, @@SERVERNAME as server_name, GETDATE() as current_time');
    console.log('   Versión:', serverInfo.recordset[0].version.split('\n')[0]);
    console.log('   Servidor:', serverInfo.recordset[0].server_name);
    console.log('   Hora actual:', serverInfo.recordset[0].current_time);

    // Test de base de datos
    console.log('\n🗄️ Verificando base de datos:');
    try {
      const dbTest = await pool.request().query("SELECT DB_NAME() as current_db, COUNT(*) as table_count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
      console.log('   Base de datos actual:', dbTest.recordset[0].current_db);
      console.log('   Número de tablas:', dbTest.recordset[0].table_count);
    } catch (error) {
      console.log('   ⚠️ Base de datos forestechCombus no existe aún (normal si no has migrado)');
    }

    // Test de performance
    console.log('\n⚡ Test de performance:');
    const startTime = Date.now();
    await pool.request().query('SELECT 1 as test');
    const duration = Date.now() - startTime;
    console.log(`   Latencia: ${duration}ms`);

    // Test de transacciones
    console.log('\n🔄 Test de transacciones:');
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    await transaction.request().query('SELECT 1 as transaction_test');
    await transaction.commit();
    console.log('   ✅ Transacciones funcionando correctamente');

    await pool.close();
    
    console.log('\n🎉 TODOS LOS TESTS EXITOSOS');
    console.log('✅ Tu instancia Cloud SQL "oil" está lista para migración!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('   1. Crear base de datos forestechCombus (si no existe)');
    console.log('   2. Ejecutar migración de Azure SQL');
    console.log('   3. Configurar Firebase Functions');

  } catch (error) {
    console.error('\n❌ ERROR DE CONEXIÓN:');
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);
    
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('   1. Verificar que la IP pública esté habilitada');
    console.log('   2. Agregar tu IP a authorized networks si es necesario');
    console.log('   3. Verificar usuario y contraseña');
    console.log('   4. Verificar que el puerto 1433 esté abierto');
    
    process.exit(1);
  }
};

// Ejecutar test
testConnection();
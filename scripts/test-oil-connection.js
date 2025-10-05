#!/usr/bin/env node

/**
 * Test de conexión a SQL Server en DigitalOcean
 * Verifica conectividad y configuración de la instancia productiva
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
    enableArithAbort: true,
    connectionTimeout: 10000,
    requestTimeout: 10000
  }
};

const testConnection = async () => {
  console.log('🧪 TESTING DIGITALOCEAN SQL SERVER CONNECTION');
  console.log('============================================');
  console.log('📍 Server: 24.199.89.134:1433');
  console.log('🗄️ Database: DBforestech');
  console.log('👤 User: SA');
  console.log('');

  try {
  console.log('🔌 Conectando a SQL Server DigitalOcean...');
    const pool = await sql.connect(CONFIG);
    console.log('✅ Conexión exitosa!');

    // Test básico
    console.log('\n📊 Información del servidor:');
  const serverInfo = await pool.request().query('SELECT @@VERSION as version, @@SERVERNAME as server_name, GETDATE() as [current_time]');
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
  console.log('   ⚠️ Base de datos DBforestech no existe aún (verificar migración)');
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
  console.log('✅ Instancia DigitalOcean lista para operar!');
  console.log('');
  console.log('📋 Próximos pasos:');
  console.log('   1. Crear base de datos DBforestech (si no existe)');
  console.log('   2. Importar backups recientes');
  console.log('   3. Validar conexión desde Firebase Functions');

  } catch (error) {
    console.error('\n❌ ERROR DE CONEXIÓN:');
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code);
    
    console.log('\n🔧 POSIBLES SOLUCIONES:');
  console.log('   1. Verificar reglas inbound del firewall en DigitalOcean');
  console.log('   2. Confirmar usuario y contraseña');
  console.log('   3. Validar que el puerto 1433 esté abierto');
    
    process.exit(1);
  }
};

// Ejecutar test
testConnection();
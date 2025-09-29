#!/usr/bin/env node

/**
 * Test simple de conexión a Cloud SQL "oil" con usuario "oil"
 */

import sql from 'mssql';

const testConnection = async () => {
  console.log('🧪 TEST SIMPLE CLOUD SQL "OIL"');
  console.log('===============================');
  console.log('📍 Server: 34.61.242.157:1433');
  console.log('👤 User: oil');
  console.log('🔑 Password: 123456789');
  console.log('');

  const config = {
    server: '34.61.242.157',
    port: 1433,
    user: 'oil',
    password: '123456789',
    options: {
      encrypt: true,
      trustServerCertificate: true,
      enableArithAbort: true,
      connectionTimeout: 15000,
      requestTimeout: 15000
    }
  };

  try {
    console.log('🔌 Conectando a Cloud SQL "oil"...');
    const pool = await sql.connect(config);
    console.log('✅ CONEXIÓN EXITOSA!');

    // Test muy básico
    console.log('\n📊 Información básica:');
    const result = await pool.request().query('SELECT 1 as test_connection');
    console.log('   Test query: OK');

    // Información del servidor
    const serverInfo = await pool.request().query('SELECT @@SERVERNAME as server_name');
    console.log(`   Servidor: ${serverInfo.recordset[0].server_name}`);

    // Listar bases de datos
    console.log('\n🗄️ Bases de datos disponibles:');
    const databases = await pool.request().query('SELECT name FROM sys.databases WHERE name NOT IN (\'master\', \'tempdb\', \'model\', \'msdb\') ORDER BY name');
    if (databases.recordset.length > 0) {
      databases.recordset.forEach(db => {
        console.log(`   - ${db.name}`);
      });
    } else {
      console.log('   ⚠️ No hay bases de datos de usuario creadas aún');
    }

    // Test crear base de datos si no existe
    console.log('\n🔧 Verificando/creando base de datos forestechCombus...');
    try {
      await pool.request().query(`
        IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'forestechCombus')
        BEGIN
          CREATE DATABASE [forestechCombus]
          PRINT 'Base de datos forestechCombus creada'
        END
        ELSE
          PRINT 'Base de datos forestechCombus ya existe'
      `);
      console.log('   ✅ Base de datos forestechCombus lista');
    } catch (dbError) {
      console.log(`   ⚠️ Error creando BD: ${dbError.message}`);
    }

    await pool.close();
    
    console.log('\n🎉 CONEXIÓN EXITOSA A CLOUD SQL "OIL"!');
    console.log('✅ Tu instancia está lista para la migración');

  } catch (error) {
    console.error('\n❌ ERROR DE CONEXIÓN:');
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Código: ${error.code}`);
    
    if (error.code === 'ELOGIN') {
      console.log('\n🔧 PROBLEMA CON CREDENCIALES:');
      console.log('   1. Verifica en Google Cloud Console > SQL > oil > Users');
      console.log('   2. Confirma que el usuario "oil" existe');
      console.log('   3. Verifica el password: 123456789');
      console.log('   4. Asegúrate que SQL Server authentication esté habilitado');
    }
    
    process.exit(1);
  }
};

testConnection();
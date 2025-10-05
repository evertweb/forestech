#!/usr/bin/env node

/**
 * Test simple de conexión a SQL Server (DigitalOcean)
 */

import sql from 'mssql';

const testConnection = async () => {
  console.log('🧪 TEST SIMPLE DIGITALOCEAN SQL SERVER');
  console.log('======================================');
  console.log('📍 Server: 24.199.89.134:1433');
  console.log('👤 User: SA');
  console.log('🔑 Password: Forestech2024!SecureDB');
  console.log('');

  const config = {
  server: '24.199.89.134',
    port: 1433,
  user: 'SA',
  password: 'Forestech2024!SecureDB',
    options: {
      encrypt: true,
      trustServerCertificate: true,
      enableArithAbort: true,
      connectionTimeout: 15000,
      requestTimeout: 15000
    }
  };

  try {
  console.log('🔌 Conectando a SQL Server DigitalOcean...');
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
  console.log('\n🔧 Verificando/creando base de datos DBforestech...');
    try {
      await pool.request().query(`
        IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DBforestech')
        BEGIN
          CREATE DATABASE [DBforestech]
          PRINT 'Base de datos DBforestech creada'
        END
        ELSE
          PRINT 'Base de datos DBforestech ya existe'
      `);
      console.log('   ✅ Base de datos DBforestech lista');
    } catch (dbError) {
      console.log(`   ⚠️ Error creando BD: ${dbError.message}`);
    }

    await pool.close();
    
  console.log('\n🎉 CONEXIÓN EXITOSA A DIGITALOCEAN SQL SERVER!');
  console.log('✅ Instancia lista para operar');

  } catch (error) {
    console.error('\n❌ ERROR DE CONEXIÓN:');
    console.error(`   Mensaje: ${error.message}`);
    console.error(`   Código: ${error.code}`);
    
    if (error.code === 'ELOGIN') {
  console.log('\n🔧 PROBLEMA CON CREDENCIALES:');
  console.log('   1. Valida credenciales configuradas en SQL Server DigitalOcean');
  console.log('   2. Confirma que el usuario SA no haya cambiado su password');
  console.log('   3. Reestablece credenciales si es necesario');
    }
    
    process.exit(1);
  }
};

testConnection();
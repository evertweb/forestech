#!/usr/bin/env node

/**
 * Test de conexión con debug para Cloud SQL "oil"
 * Probando diferentes configuraciones de usuario
 */

import sql from 'mssql';

const testConfigs = [
  {
    name: "Config 1: sqlserver user",
    config: {
      server: '34.61.242.157',
      port: 1433,
      database: 'master', // Conectar primero a master
      user: 'sqlserver',
      password: '123456789',
      options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 10000,
        requestTimeout: 10000
      }
    }
  },
  {
    name: "Config 2: Sin especificar database",
    config: {
      server: '34.61.242.157',
      port: 1433,
      user: 'sqlserver',
      password: '123456789',
      options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 10000,
        requestTimeout: 10000
      }
    }
  }
];

const testConnection = async () => {
  console.log('🧪 TESTING CLOUD SQL "OIL" - DEBUG MODE');
  console.log('=========================================');
  
  for (const test of testConfigs) {
    console.log(`\n🔍 ${test.name}`);
    console.log(`   Server: ${test.config.server}:${test.config.port || 1433}`);
    console.log(`   User: ${test.config.user}`);
    console.log(`   Database: ${test.config.database || 'default'}`);
    
    try {
      console.log('   🔌 Conectando...');
      const pool = await sql.connect(test.config);
      console.log('   ✅ Conexión exitosa!');
      
      // Test básico
      const result = await pool.request().query('SELECT @@VERSION as version, @@SERVERNAME as server_name, GETDATE() as current_time');
      console.log('   📊 Servidor:', result.recordset[0].server_name);
      console.log('   ⏰ Hora:', result.recordset[0].current_time);
      
      // Listar bases de datos disponibles
      const databases = await pool.request().query('SELECT name FROM sys.databases ORDER BY name');
      console.log('   🗄️ Bases de datos disponibles:');
      databases.recordset.forEach(db => {
        console.log(`      - ${db.name}`);
      });
      
      await pool.close();
      console.log('   🎉 Test exitoso con esta configuración!');
      return; // Si funciona, salir
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log(`   🔧 Código: ${error.code}`);
    }
  }
  
  console.log('\n❌ Ninguna configuración funcionó');
  console.log('\n🔧 PASOS PARA RESOLVER:');
  console.log('1. Verificar en Google Cloud Console > SQL > oil > Users');
  console.log('2. Verificar que el usuario "sqlserver" existe');
  console.log('3. Resetear password si es necesario');
  console.log('4. Verificar que Built-in authentication esté habilitado');
};

// Ejecutar test
testConnection();
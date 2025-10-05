#!/usr/bin/env node

/**
 * Test de conexión con debug para SQL Server (DigitalOcean)
 * Prueba usuarios críticos y entrega información extendida
 */

import sql from 'mssql';

const testConfigs = [
  {
    name: 'Config 1: SA admin',
    config: {
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
    }
  },
  {
    name: 'Config 2: usuario app "oil"',
    config: {
      server: '24.199.89.134',
      port: 1433,
      database: 'DBforestech',
      user: 'oil',
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
  console.log('🧪 TESTING DIGITALOCEAN SQL SERVER - DEBUG MODE');
  console.log('===============================================');
  
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
  console.log('1. Revisar firewall del Droplet en DigitalOcean (puerto 1433)');
  console.log('2. Confirmar credenciales en SQL Server (SA y usuarios de aplicación)');
  console.log('3. Validar que la base de datos DBforestech existe');
  console.log('4. Revisar logs con "sudo journalctl -u mssql-server -f"');
};

// Ejecutar test
testConnection();
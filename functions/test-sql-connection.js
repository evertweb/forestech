/**
 * Test de conectividad a Cloud SQL
 * Script de diagnóstico para resolver problemas de conexión
 */

import sql from 'mssql';

const testConfigs = [
  {
    name: 'Config Actual (IP Pública)',
    config: {
      server: '34.61.242.157',
      port: 1433,
      database: 'forestechCombus',
      user: 'oil',
      password: '123456789',
      options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000,
      },
      pool: {
        max: 5,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000
      }
    }
  },
  {
    name: 'Config Sin SSL',
    config: {
      server: '34.61.242.157',
      port: 1433,
      database: 'forestechCombus',
      user: 'oil',
      password: '123456789',
      options: {
        encrypt: false,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000,
      },
      pool: {
        max: 1,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000
      }
    }
  },
  {
    name: 'Config Usuario SA',
    config: {
      server: '34.61.242.157',
      port: 1433,
      database: 'master',
      user: 'sa',
      password: '123456789',
      options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 15000,
        requestTimeout: 15000,
      },
      pool: {
        max: 1,
        min: 0,
        idleTimeoutMillis: 15000,
        acquireTimeoutMillis: 15000
      }
    }
  }
];

async function testConnection(config, name) {
  console.log(`\n🧪 Probando: ${name}`);
  console.log(`   Server: ${config.server}:${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  console.log(`   SSL: ${config.options.encrypt ? 'Sí' : 'No'}`);
  
  try {
    console.log('   🔌 Conectando...');
    const pool = await sql.connect(config);
    
    console.log('   ✅ Conexión exitosa!');
    
    // Probar query básica
    const result = await pool.request().query('SELECT @@VERSION as version, GETDATE() as current_time');
    console.log('   📊 Query exitosa:');
    console.log(`   - Versión: ${result.recordset[0].version.substring(0, 50)}...`);
    console.log(`   - Hora: ${result.recordset[0].current_time}`);
    
    // Probar listar databases
    const databases = await pool.request().query('SELECT name FROM sys.databases WHERE name NOT IN (\'master\', \'tempdb\', \'model\', \'msdb\')');
    console.log(`   - Databases disponibles: ${databases.recordset.map(d => d.name).join(', ')}`);
    
    await pool.close();
    return { success: true, config: name };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    console.log(`   🔍 Tipo: ${error.code || error.constructor.name}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   💡 Sugerencia: El servidor rechaza la conexión - verificar firewall/IP autorizada');
    } else if (error.code === 'ETIMEOUT') {
      console.log('   💡 Sugerencia: Timeout de conexión - verificar conectividad de red');
    } else if (error.message.includes('login failed')) {
      console.log('   💡 Sugerencia: Credenciales incorrectas');
    }
    
    return { success: false, error: error.message, config: name };
  }
}

async function runDiagnostics() {
  console.log('🔍 DIAGNÓSTICO DE CONECTIVIDAD CLOUD SQL');
  console.log('=====================================');
  
  const results = [];
  
  for (const { name, config } of testConfigs) {
    const result = await testConnection(config, name);
    results.push(result);
  }
  
  console.log('\n📋 RESUMEN DE RESULTADOS:');
  console.log('=========================');
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.config}: ${result.success ? 'EXITOSO' : result.error}`);
  });
  
  const successfulConfigs = results.filter(r => r.success);
  if (successfulConfigs.length > 0) {
    console.log(`\n🎉 Configuraciones exitosas: ${successfulConfigs.length}/${results.length}`);
  } else {
    console.log('\n⚠️ NINGUNA configuración funcionó - revisar Cloud SQL setup');
  }
}

// Ejecutar diagnósticos
runDiagnostics().catch(console.error);
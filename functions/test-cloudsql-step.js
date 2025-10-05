/**
 * Test de conectividad SQL Server (DigitalOcean) con diferentes configuraciones
 * Útil después de ajustar reglas de firewall o credenciales
 */

import sql from 'mssql';

const config = {
  server: '24.199.89.134',
  port: 1433,
  database: 'DBforestech',
  user: 'SA',
  password: 'Forestech2024!SecureDB',
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
};

async function testConnectionStep() {
  console.log('🔬 TEST DE CONECTIVIDAD SQL SERVER (DIGITALOCEAN)');
  console.log('================================');
  console.log(`Servidor: ${config.server}:${config.port}`);
  console.log(`Base de datos: ${config.database}`);
  console.log(`Usuario: ${config.user}`);
  console.log('');

  try {
    console.log('⏳ Conectando...');
    const startTime = Date.now();
    
    const pool = await sql.connect(config);
    const connectTime = Date.now() - startTime;
    
    console.log(`✅ CONEXIÓN EXITOSA en ${connectTime}ms`);
    
    // Test básico
    console.log('📊 Ejecutando queries de prueba...');
    
    const versionResult = await pool.request().query('SELECT @@VERSION as version');
    console.log(`   Versión SQL Server: ${versionResult.recordset[0].version.substring(0, 60)}...`);
    
    const timeResult = await pool.request().query('SELECT GETDATE() as server_time');
    console.log(`   Hora del servidor: ${timeResult.recordset[0].server_time}`);
    
    // Test de tablas específicas
    const tablesResult = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' 
      AND TABLE_NAME LIKE '%ategories%'
    `);
    
    if (tablesResult.recordset.length > 0) {
      console.log('📋 Tablas de categorías encontradas:');
      tablesResult.recordset.forEach(table => {
        console.log(`   - ${table.TABLE_NAME}`);
      });
    } else {
      console.log('📋 No se encontraron tablas de categorías (puede ser normal)');
    }
    
    // Test específico para Firebase Functions
    console.log('🔥 Simulando llamada Firebase Function...');
    const testQuery = 'SELECT COUNT(*) as total FROM INFORMATION_SCHEMA.TABLES';
    const countResult = await pool.request().query(testQuery);
    console.log(`   Total de tablas en DB: ${countResult.recordset[0].total}`);
    
    await pool.close();
    
    console.log('');
    console.log('🎉 TODAS LAS PRUEBAS EXITOSAS');
  console.log('✅ DigitalOcean SQL Server está configurado correctamente');
    console.log('✅ Firebase Functions podrán conectarse');
    
    return true;
    
  } catch (error) {
    console.log(`❌ ERROR DE CONEXIÓN: ${error.message}`);
    
    if (error.message.includes('timeout')) {
      console.log('💡 Problema: Timeout de conexión');
  console.log('   Solución: Verificar reglas inbound en firewall de DigitalOcean');
    } else if (error.message.includes('login')) {
      console.log('💡 Problema: Credenciales incorrectas');
      console.log('   Solución: Verificar usuario/contraseña');
    } else {
      console.log(`💡 Problema: ${error.code || 'Desconocido'}`);
    }
    
    return false;
  }
}

// Ejecutar test
testConnectionStep()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Error inesperado:', error);
    process.exit(1);
  });
/**
 * Script para probar conexión a Azure SQL Server
 */

import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config({ path: '.env.local' });

// Configuración de conexión
const config = {
  server: process.env.VITE_AZURE_SQL_SERVER,
  port: 1433,
  database: process.env.VITE_AZURE_SQL_DATABASE,
  user: process.env.VITE_AZURE_SQL_USER,
  password: process.env.VITE_AZURE_SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};

async function testConnection() {
  try {
    console.log('🔌 Probando conexión a Azure SQL Server...');
    console.log(`📍 Servidor: ${config.server}`);
    console.log(`📊 Base de datos: ${config.database}`);

    const pool = await sql.connect(config);
    console.log('✅ Conexión exitosa');

    // Probar consulta simple
    console.log('📝 Ejecutando consulta de prueba...');
    const result = await pool.request().query('SELECT @@VERSION as version');
    console.log('✅ Consulta ejecutada correctamente');
    console.log(`📋 SQL Server versión: ${result.recordset[0].version.split(' - ')[0]}`);

    // Verificar tablas
    console.log('📋 Verificando tablas...');
    const tablesResult = await pool.request().query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      AND TABLE_NAME LIKE 'combustibles_%'
      ORDER BY TABLE_NAME
    `);

    if (tablesResult.recordset.length > 0) {
      console.log('✅ Tablas encontradas:');
      tablesResult.recordset.forEach(table => {
        console.log(`  - ${table.TABLE_NAME}`);
      });
    } else {
      console.log('⚠️  No se encontraron tablas. Ejecuta: npm run db:create-tables');
    }

    await pool.close();
    console.log('🔌 Conexión cerrada correctamente');
    console.log('');
    console.log('🎉 ¡Conexión a Azure SQL Server funcionando perfectamente!');

  } catch (error) {
    console.error('❌ Error en conexión:', error.message);

    if (error.code === 'ETIMEOUT') {
      console.log('');
      console.log('💡 Sugerencias para solucionar ETIMEOUT:');
      console.log('  1. Verifica que el servidor esté accesible');
      console.log('  2. Confirma las credenciales en .env.local');
      console.log('  3. Asegúrate de que el firewall permita conexiones');
      console.log('  4. Verifica que el puerto 1433 esté abierto');
    }

    if (error.code === 'ELOGIN') {
      console.log('');
      console.log('💡 Sugerencias para solucionar ELOGIN:');
      console.log('  1. Verifica usuario y contraseña');
      console.log('  2. Confirma que el usuario tenga permisos');
      console.log('  3. Verifica que la base de datos exista');
    }

    process.exit(1);
  }
}

testConnection();

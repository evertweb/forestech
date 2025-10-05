/**
 * Script para probar conexión a SQL Server DigitalOcean
 */

import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config({ path: '.env.local' });

// Configuración de conexión (puedes sobreescribir con variables VITE_DIGITALOCEAN_SQL_* o DIGITALOCEAN_SQL_*)
const config = {
  server: process.env.VITE_DIGITALOCEAN_SQL_SERVER || process.env.DIGITALOCEAN_SQL_SERVER || process.env.VITE_AZURE_SQL_SERVER || '24.199.89.134',
  port: Number(process.env.VITE_DIGITALOCEAN_SQL_PORT || process.env.DIGITALOCEAN_SQL_PORT || process.env.VITE_AZURE_SQL_PORT || 1433),
  database: process.env.VITE_DIGITALOCEAN_SQL_DATABASE || process.env.DIGITALOCEAN_SQL_DATABASE || process.env.VITE_AZURE_SQL_DATABASE || 'DBforestech',
  user: process.env.VITE_DIGITALOCEAN_SQL_USER || process.env.DIGITALOCEAN_SQL_USER || process.env.VITE_AZURE_SQL_USER || 'SA',
  password: process.env.VITE_DIGITALOCEAN_SQL_PASSWORD || process.env.DIGITALOCEAN_SQL_PASSWORD || process.env.VITE_AZURE_SQL_PASSWORD || 'Forestech2024!SecureDB',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};

if (process.env.VITE_AZURE_SQL_SERVER) {
  console.warn('⚠️ Variables legacy VITE_AZURE_SQL_* detectadas. Actualízalas a VITE_DIGITALOCEAN_SQL_* lo antes posible.');
}

async function testConnection() {
  try {
    console.log('🔌 Probando conexión a SQL Server DigitalOcean...');
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
    console.log('🎉 ¡Conexión a SQL Server DigitalOcean funcionando perfectamente!');

  } catch (error) {
    console.error('❌ Error en conexión:', error.message);

    if (error.code === 'ETIMEOUT') {
      console.log('');
      console.log('💡 Sugerencias para solucionar ETIMEOUT:');
      console.log('  1. Verifica reglas de firewall en DigitalOcean');
      console.log('  2. Confirma las credenciales en .env.local');
      console.log('  3. Asegúrate de que el puerto 1433 esté abierto');
      console.log('  4. Comprueba conectividad desde tu IP');
    }

    if (error.code === 'ELOGIN') {
      console.log('');
      console.log('💡 Sugerencias para solucionar ELOGIN:');
      console.log('  1. Verifica usuario y contraseña');
      console.log('  2. Confirma que el usuario tenga permisos');
      console.log('  3. Verifica que la base de datos exista en DigitalOcean');
    }

    process.exit(1);
  }
}

testConnection();

/**
 * Script de inicialización de base de datos SQL Server DigitalOcean
 * Ejecutar una sola vez para crear tablas
 */

import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de conexión
const config = {
  server: process.env.VITE_DIGITALOCEAN_SQL_SERVER || process.env.DIGITALOCEAN_SQL_SERVER || process.env.VITE_AZURE_SQL_SERVER || '24.199.89.134',
  port: Number(process.env.VITE_DIGITALOCEAN_SQL_PORT || process.env.DIGITALOCEAN_SQL_PORT || process.env.VITE_AZURE_SQL_PORT || 1433),
  database: process.env.VITE_DIGITALOCEAN_SQL_DATABASE || process.env.DIGITALOCEAN_SQL_DATABASE || process.env.VITE_AZURE_SQL_DATABASE || 'DBforestech',
  user: process.env.VITE_DIGITALOCEAN_SQL_USER || process.env.DIGITALOCEAN_SQL_USER || process.env.VITE_AZURE_SQL_USER || 'SA',
  password: process.env.VITE_DIGITALOCEAN_SQL_PASSWORD || process.env.DIGITALOCEAN_SQL_PASSWORD || process.env.VITE_AZURE_SQL_PASSWORD || 'Forestech2024!SecureDB',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

if (process.env.VITE_AZURE_SQL_SERVER) {
  console.warn('⚠️ Variables legacy VITE_AZURE_SQL_* detectadas. Actualízalas a VITE_DIGITALOCEAN_SQL_* lo antes posible.');
}

async function initDatabase() {
  try {
    console.log('🔌 Conectando a SQL Server DigitalOcean...');

    // Conectar a master para crear BD si no existe
    const masterConfig = { ...config, database: 'master' };
    const masterPool = await sql.connect(masterConfig);

    console.log('📦 Verificando/creando base de datos...');
    await masterPool.request().query(`
      IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${config.database}')
      BEGIN
        CREATE DATABASE [${config.database}];
        PRINT 'Base de datos creada exitosamente';
      END
      ELSE
      BEGIN
        PRINT 'Base de datos ya existe';
      END
    `);

    await masterPool.close();

    // Conectar a la base de datos específica
    const pool = await sql.connect(config);
  console.log('✅ Conexión exitosa a la base de datos');

    // Leer y ejecutar script de tablas
    const tablesScript = fs.readFileSync(path.join(__dirname, '..', 'sql', 'create-tables.sql'), 'utf8');

    console.log('🏗️  Creando tablas...');
    await pool.request().query(tablesScript);

  console.log('✅ Base de datos inicializada correctamente');
    console.log('');
    console.log('📋 Tablas creadas:');
    console.log('  - combustibles_movements');
    console.log('  - combustibles_inventory');
    console.log('  - combustibles_vehicles');
    console.log('  - combustibles_maintenance');
    console.log('  - combustibles_products');
    console.log('  - combustibles_suppliers');
    console.log('  - combustibles_vehicle_categories');
    console.log('  - product_categories');

    await pool.close();

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
}

initDatabase();

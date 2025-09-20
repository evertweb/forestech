/**
 * Script para crear tablas en Azure SQL Server
 * Forestech Combustibles App
 */

import { config } from 'dotenv';
import sql from 'mssql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
config({ path: path.join(__dirname, '..', '.env.local') });

// Configuración de conexión
const sqlConfig = {
  server: process.env.VITE_AZURE_SQL_SERVER,
  port: 1433,
  database: process.env.VITE_AZURE_SQL_DATABASE,
  user: process.env.VITE_AZURE_SQL_USER,
  password: process.env.VITE_AZURE_SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 30000,
    requestTimeout: 60000, // Más tiempo para crear tablas
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

async function createTables() {
  let pool;

  try {
    console.log('🔌 Conectando a Azure SQL Server...');
    console.log(`📍 Servidor: ${sqlConfig.server}`);
    console.log(`📊 Base de datos: ${sqlConfig.database}`);

    pool = await sql.connect(sqlConfig);
    console.log('✅ Conexión exitosa');

    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, '..', 'sql', 'create-tables.sql');
    console.log('📄 Leyendo script SQL...');

    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`Archivo SQL no encontrado: ${sqlFilePath}`);
    }

    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ Script SQL cargado');

    // Dividir el script en comandos individuales (por GO statements)
    const commands = sqlScript.split('GO').filter(cmd => cmd.trim().length > 0);

    console.log(`🏗️  Ejecutando ${commands.length} comandos SQL...`);

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command.length === 0) continue;

      console.log(`📝 Ejecutando comando ${i + 1}/${commands.length}...`);

      try {
        await pool.request().query(command);
        console.log(`✅ Comando ${i + 1} ejecutado correctamente`);
      } catch (cmdError) {
        console.error(`❌ Error en comando ${i + 1}:`, cmdError.message);

        // Si es un error de objeto ya existente, continuar
        if (cmdError.message.includes('already exists') ||
            cmdError.message.includes('ya existe') ||
            cmdError.number === 2714) { // Object already exists
          console.log(`⚠️  Objeto ya existe, continuando...`);
          continue;
        }

        throw cmdError;
      }
    }

    console.log('');
    console.log('🎉 ¡TABLAS CREADAS EXITOSAMENTE!');
    console.log('');
    console.log('📋 Tablas creadas:');
    console.log('  ✅ combustibles_movements');
    console.log('  ✅ combustibles_inventory');
    console.log('  ✅ combustibles_vehicles');
    console.log('  ✅ combustibles_maintenance');
    console.log('  ✅ combustibles_products');
    console.log('  ✅ combustibles_suppliers');
    console.log('  ✅ combustibles_vehicle_categories');
    console.log('  ✅ product_categories');
    console.log('');
    console.log('🚀 ¡Base de datos lista para usar!');

  } catch (error) {
    console.error('❌ Error creando tablas:', error.message);

    if (error.code === 'ETIMEOUT') {
      console.log('');
      console.log('💡 Sugerencias para timeout:');
      console.log('  1. Verifica la conexión a internet');
      console.log('  2. Confirma que el servidor esté accesible');
      console.log('  3. Verifica las credenciales');
    }

    if (error.code === 'ELOGIN') {
      console.log('');
      console.log('💡 Sugerencias para login:');
      console.log('  1. Verifica usuario y contraseña en .env.local');
      console.log('  2. Confirma que el usuario tenga permisos DDL');
      console.log('  3. Verifica que la base de datos exista');
    }

    if (error.code === 'ENOTFOUND') {
      console.log('');
      console.log('💡 Sugerencias para conexión:');
      console.log('  1. Verifica el nombre del servidor');
      console.log('  2. Confirma que el puerto 1433 esté abierto');
      console.log('  3. Verifica la configuración del firewall');
    }

    process.exit(1);

  } finally {
    if (pool) {
      await pool.close();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Verificar variables de entorno
function checkEnvironment() {
  const required = [
    'VITE_AZURE_SQL_SERVER',
    'VITE_AZURE_SQL_DATABASE',
    'VITE_AZURE_SQL_USER',
    'VITE_AZURE_SQL_PASSWORD'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.log('');
    console.log('💡 Agrega estas variables a .env.local:');
    console.log('VITE_AZURE_SQL_SERVER=tu_servidor.database.windows.net');
    console.log('VITE_AZURE_SQL_DATABASE=tu_base_datos');
    console.log('VITE_AZURE_SQL_USER=tu_usuario');
    console.log('VITE_AZURE_SQL_PASSWORD=tu_contraseña');
    process.exit(1);
  }
}

// Ejecutar
checkEnvironment();
createTables();
#!/usr/bin/env node

import sql from 'mssql';

const CONFIG = {
  server: '24.199.89.134',
  port: 1433,
  user: 'SA',
  password: 'Forestech2024!SecureDB',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectionTimeout: 10000,
    requestTimeout: 10000
  }
};

const createDatabase = async () => {
  console.log('🗄️ Creando base de datos DBforestech...');

  try {
    const pool = await sql.connect(CONFIG);
    console.log('✅ Conectado a master');

  await pool.request().query('CREATE DATABASE DBforestech');
  console.log('✅ Base de datos DBforestech creada exitosamente');

    await pool.close();
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️ Base de datos DBforestech ya existe');
    } else {
      console.error('❌ Error creando base de datos:', error.message);
      process.exit(1);
    }
  }
};

createDatabase();
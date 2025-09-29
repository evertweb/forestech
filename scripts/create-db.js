#!/usr/bin/env node

import sql from 'mssql';

const CONFIG = {
  server: '34.61.242.157',
  port: 1433,
  user: 'oil',
  password: '123456789',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectionTimeout: 10000,
    requestTimeout: 10000
  }
};

const createDatabase = async () => {
  console.log('🗄️ Creando base de datos forestechCombus...');

  try {
    const pool = await sql.connect(CONFIG);
    console.log('✅ Conectado a master');

    await pool.request().query('CREATE DATABASE forestechCombus');
    console.log('✅ Base de datos forestechCombus creada exitosamente');

    await pool.close();
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️ Base de datos forestechCombus ya existe');
    } else {
      console.error('❌ Error creando base de datos:', error.message);
      process.exit(1);
    }
  }
};

createDatabase();
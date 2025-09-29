#!/usr/bin/env node

/**
 * SCRIPT DE MIGRACIÓN: Azure SQL → Google Cloud SQL
 * Forestech Combustibles - Migración automática de datos
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Dependencias
import sql from 'mssql';
import { Client } from 'pg'; // PostgreSQL client
import admin from 'firebase-admin';

// Configuraciones
const AZURE_CONFIG = {
  server: process.env.AZURE_SQL_SERVER || 'oilforestech.privatelink.database.windows.net',
  database: process.env.AZURE_SQL_DATABASE || 'forestechCombus',
  user: process.env.AZURE_SQL_USER || 'oil',
  password: process.env.AZURE_SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

const CLOUD_SQL_CONFIG = {
  host: '/cloudsql/liquidacionapp-62962:us-central1:forestech-combustibles', // Unix socket
  database: 'forestech_combustibles',
  user: 'forestech_user',
  password: process.env.CLOUD_SQL_PASSWORD,
  port: 5432,
};

// Esquemas de migración
const MIGRATION_SCHEMAS = {
  // Tablas en orden de dependencias
  vehicle_categories: `
    CREATE TABLE IF NOT EXISTS vehicle_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(20) UNIQUE NOT NULL,
      description TEXT,
      vehicle_count INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(100),
      updated_by VARCHAR(100)
    );
  `,
  
  vehicles: `
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      category_id INTEGER REFERENCES vehicle_categories(id),
      brand VARCHAR(100),
      model VARCHAR(100),
      year INTEGER,
      fuel_capacity DECIMAL(10,2) DEFAULT 0,
      current_fuel DECIMAL(10,2) DEFAULT 0,
      hour_meter_reading DECIMAL(10,2) DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      location VARCHAR(200),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(100),
      updated_by VARCHAR(100)
    );
  `,
  
  suppliers: `
    CREATE TABLE IF NOT EXISTS suppliers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      code VARCHAR(50) UNIQUE,
      contact_name VARCHAR(100),
      phone VARCHAR(50),
      email VARCHAR(100),
      address TEXT,
      tax_id VARCHAR(50),
      is_preferred BOOLEAN DEFAULT false,
      is_active BOOLEAN DEFAULT true,
      rating DECIMAL(3,2) DEFAULT 0,
      total_orders INTEGER DEFAULT 0,
      total_amount DECIMAL(15,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(100),
      updated_by VARCHAR(100)
    );
  `,
  
  products: `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      category VARCHAR(100),
      unit VARCHAR(50),
      price DECIMAL(12,2) DEFAULT 0,
      stock DECIMAL(12,2) DEFAULT 0,
      min_stock DECIMAL(12,2) DEFAULT 0,
      max_stock DECIMAL(12,2) DEFAULT 0,
      location VARCHAR(200),
      is_active BOOLEAN DEFAULT true,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(100),
      updated_by VARCHAR(100)
    );
  `,
  
  inventory: `
    CREATE TABLE IF NOT EXISTS inventory (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id),
      location VARCHAR(200),
      current_stock DECIMAL(12,2) DEFAULT 0,
      reserved_stock DECIMAL(12,2) DEFAULT 0,
      available_stock DECIMAL(12,2) GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_by VARCHAR(100),
      notes TEXT
    );
  `,
  
  movements: `
    CREATE TABLE IF NOT EXISTS movements (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER REFERENCES vehicles(id),
      product_id INTEGER REFERENCES products(id),
      supplier_id INTEGER REFERENCES suppliers(id),
      movement_type VARCHAR(50) NOT NULL, -- 'entrada', 'salida', 'abastecimiento'
      quantity DECIMAL(12,2) NOT NULL,
      unit_price DECIMAL(12,2),
      total_amount DECIMAL(15,2),
      hour_meter_before DECIMAL(10,2),
      hour_meter_after DECIMAL(10,2),
      hour_meter_difference DECIMAL(10,2),
      location VARCHAR(200),
      notes TEXT,
      invoice_number VARCHAR(100),
      movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(100),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_by VARCHAR(100)
    );
  `,
  
  maintenance: `
    CREATE TABLE IF NOT EXISTS maintenance (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER REFERENCES vehicles(id),
      maintenance_type VARCHAR(100) NOT NULL,
      description TEXT,
      cost DECIMAL(12,2),
      supplier_id INTEGER REFERENCES suppliers(id),
      hour_meter_reading DECIMAL(10,2),
      maintenance_date DATE,
      next_maintenance_date DATE,
      next_maintenance_hours DECIMAL(10,2),
      is_completed BOOLEAN DEFAULT false,
      invoice_number VARCHAR(100),
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(100),
      updated_by VARCHAR(100)
    );
  `,
  
  hour_meter_readings: `
    CREATE TABLE IF NOT EXISTS hour_meter_readings (
      id SERIAL PRIMARY KEY,
      vehicle_id INTEGER REFERENCES vehicles(id),
      reading_value DECIMAL(10,2) NOT NULL,
      previous_reading DECIMAL(10,2),
      hours_difference DECIMAL(10,2),
      movement_id INTEGER REFERENCES movements(id),
      reading_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      recorded_by VARCHAR(100),
      notes TEXT
    );
  `
};

class MigrationManager {
  constructor() {
    this.azurePool = null;
    this.cloudSqlClient = null;
    this.migrationLog = [];
  }

  async initialize() {
    console.log('🚀 Inicializando migración Azure SQL → Cloud SQL...\n');
    
    // Conectar a Azure SQL (origen)
    console.log('📡 Conectando a Azure SQL...');
    this.azurePool = await sql.connect(AZURE_CONFIG);
    console.log('✅ Conectado a Azure SQL\n');
    
    // Conectar a Cloud SQL (destino)
    console.log('📡 Conectando a Cloud SQL...');
    this.cloudSqlClient = new Client(CLOUD_SQL_CONFIG);
    await this.cloudSqlClient.connect();
    console.log('✅ Conectado a Cloud SQL\n');
  }

  async createSchemas() {
    console.log('🏗️ Creando esquemas en Cloud SQL...\n');
    
    for (const [tableName, schema] of Object.entries(MIGRATION_SCHEMAS)) {
      try {
        console.log(`📋 Creando tabla: ${tableName}`);
        await this.cloudSqlClient.query(schema);
        console.log(`✅ Tabla ${tableName} creada exitosamente`);
      } catch (error) {
        console.warn(`⚠️ Tabla ${tableName} ya existe o error: ${error.message}`);
      }
    }
    console.log('\n🎉 Esquemas creados exitosamente\n');
  }

  async migrateTable(tableName, selectQuery, insertQuery) {
    console.log(`🔄 Migrando tabla: ${tableName}`);
    
    try {
      // Obtener datos de Azure SQL
      const azureResult = await this.azurePool.request().query(selectQuery);
      const data = azureResult.recordset;
      
      console.log(`📊 Encontrados ${data.length} registros en ${tableName}`);
      
      if (data.length === 0) {
        console.log(`⚠️ No hay datos para migrar en ${tableName}\n`);
        return;
      }

      // Insertar en Cloud SQL
      let migrated = 0;
      for (const row of data) {
        try {
          await this.cloudSqlClient.query(insertQuery, Object.values(row));
          migrated++;
        } catch (error) {
          console.warn(`⚠️ Error migrando registro ${row.id || migrated}: ${error.message}`);
        }
      }
      
      console.log(`✅ ${tableName}: ${migrated}/${data.length} registros migrados\n`);
      
      this.migrationLog.push({
        table: tableName,
        total: data.length,
        migrated: migrated,
        success_rate: (migrated / data.length * 100).toFixed(2) + '%'
      });
      
    } catch (error) {
      console.error(`❌ Error migrando ${tableName}:`, error.message);
      this.migrationLog.push({
        table: tableName,
        error: error.message
      });
    }
  }

  async executeMigration() {
    console.log('🚀 Iniciando migración de datos...\n');
    
    // Orden de migración respetando dependencias
    const migrations = [
      {
        table: 'vehicle_categories',
        select: 'SELECT * FROM VehicleCategories ORDER BY id',
        insert: `INSERT INTO vehicle_categories 
                (name, code, description, vehicle_count, display_order, is_active, created_at, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
      },
      
      {
        table: 'vehicles', 
        select: 'SELECT * FROM Vehicles ORDER BY id',
        insert: `INSERT INTO vehicles 
                (name, code, category_id, brand, model, year, fuel_capacity, current_fuel, 
                 hour_meter_reading, is_active, location, notes, created_at, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`
      },
      
      {
        table: 'suppliers',
        select: 'SELECT * FROM Suppliers ORDER BY id', 
        insert: `INSERT INTO suppliers
                (name, code, contact_name, phone, email, address, tax_id, is_preferred, 
                 is_active, rating, total_orders, total_amount, created_at, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`
      },
      
      {
        table: 'products',
        select: 'SELECT * FROM Products ORDER BY id',
        insert: `INSERT INTO products
                (name, code, category, unit, price, stock, min_stock, max_stock, 
                 location, is_active, description, created_at, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`
      },
      
      {
        table: 'movements',
        select: 'SELECT * FROM Movements ORDER BY id',
        insert: `INSERT INTO movements
                (vehicle_id, product_id, supplier_id, movement_type, quantity, unit_price,
                 total_amount, hour_meter_before, hour_meter_after, hour_meter_difference,
                 location, notes, invoice_number, movement_date, created_at, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`
      }
    ];

    for (const migration of migrations) {
      await this.migrateTable(migration.table, migration.select, migration.insert);
    }
  }

  async generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE DE MIGRACIÓN');
    console.log('='.repeat(60));
    
    this.migrationLog.forEach(log => {
      if (log.error) {
        console.log(`❌ ${log.table}: ERROR - ${log.error}`);
      } else {
        console.log(`✅ ${log.table}: ${log.migrated}/${log.total} (${log.success_rate})`);
      }
    });
    
    console.log('\n🎉 Migración completada!');
    console.log('📝 Próximos pasos:');
    console.log('   1. Verificar datos en Cloud SQL');
    console.log('   2. Actualizar Firebase Functions');
    console.log('   3. Probar aplicación');
    console.log('   4. Descomisionar Azure SQL + Cloud Run\n');
  }

  async cleanup() {
    if (this.azurePool) {
      await this.azurePool.close();
    }
    if (this.cloudSqlClient) {
      await this.cloudSqlClient.end();
    }
  }
}

// Ejecutar migración
async function runMigration() {
  const migration = new MigrationManager();
  
  try {
    await migration.initialize();
    await migration.createSchemas();
    await migration.executeMigration();
    await migration.generateReport();
  } catch (error) {
    console.error('❌ Error en migración:', error);
  } finally {
    await migration.cleanup();
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default MigrationManager;
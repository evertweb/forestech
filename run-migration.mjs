/**
 * Script de migración JavaScript para actualizar esquema de combustibles_vehicle_categories
 * Ejecuta la migración SQL desde Node.js usando la conexión de Functions
 */

import { sqlConfig } from './functions/src/sql/config.js';
import sql from 'mssql';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
    try {
        console.log('🔗 Conectando a Azure SQL...');
        console.log('Server:', sqlConfig.server);
        console.log('Database:', sqlConfig.database);
        
        const pool = await sql.connect(sqlConfig);
        
        // Leer el archivo SQL de migración
        const migrationSQL = fs.readFileSync('./fix-vehicle-categories-schema.sql', 'utf8');
        
        console.log('📋 Ejecutando migración de esquema...');
        
        // Dividir por lotes (GO statements)
        const batches = migrationSQL.split(/\nGO\s*$/gm).filter(batch => batch.trim());
        
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i].trim();
            if (batch) {
                console.log(`Ejecutando lote ${i + 1}/${batches.length}...`);
                await pool.request().query(batch);
            }
        }
        
        console.log('✅ Migración completada exitosamente!');
        
        // Verificar que las columnas ahora existen
        console.log('\n📊 Verificando columnas de combustibles_vehicle_categories:');
        const columnsResult = await pool.request().query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'combustibles_vehicle_categories'
            ORDER BY ORDINAL_POSITION
        `);
        
        console.log('Columnas encontradas:');
        columnsResult.recordset.forEach(col => {
            console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
        
        await pool.close();
        
    } catch (error) {
        console.error('❌ Error en migración:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

console.log('🚀 Iniciando migración de esquema para combustibles_vehicle_categories...');
runMigration();
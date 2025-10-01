const sql = require('mssql');

const config = {
  server: '34.61.242.157',
  port: 1433,
  user: 'oil',
  password: '123456789',
  database: 'forestechCombus',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: 60000,
    requestTimeout: 30000
  }
};

async function fixSchemaColumns() {
  console.log('🔧 Iniciando reparación de columnas faltantes...');
  
  try {
    const pool = await sql.connect(config);
    console.log('✅ Conectado a Cloud SQL');

    // 1. Verificar y agregar columna 'isPreferred' a la tabla suppliers
    console.log('\n📋 Verificando tabla combustibles_suppliers...');
    const suppliersCheck = await pool.request().query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'combustibles_suppliers' 
      AND COLUMN_NAME = 'isPreferred'
    `);

    if (suppliersCheck.recordset.length === 0) {
      console.log('➕ Agregando columna isPreferred a combustibles_suppliers...');
      await pool.request().query(`
        ALTER TABLE combustibles_suppliers 
        ADD isPreferred BIT DEFAULT 0
      `);
      console.log('✅ Columna isPreferred agregada');
    } else {
      console.log('✅ Columna isPreferred ya existe');
    }

    // 2. Verificar y agregar columna 'sortOrder' a la tabla categories
    console.log('\n📋 Verificando tabla product_categories...');
    const categoriesCheck = await pool.request().query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'product_categories' 
      AND COLUMN_NAME = 'sortOrder'
    `);

    if (categoriesCheck.recordset.length === 0) {
      console.log('➕ Agregando columna sortOrder a product_categories...');
      await pool.request().query(`
        ALTER TABLE product_categories 
        ADD sortOrder INT DEFAULT 0
      `);
      console.log('✅ Columna sortOrder agregada');
    } else {
      console.log('✅ Columna sortOrder ya existe');
    }

    // 3. Verificar estructura actualizada
    console.log('\n📊 Verificando estructura actualizada...');
    
    const suppliersStructure = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'combustibles_suppliers'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('\n🏢 Estructura de combustibles_suppliers:');
    suppliersStructure.recordset.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    const categoriesStructure = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'product_categories'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('\n📂 Estructura de product_categories:');
    categoriesStructure.recordset.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    await pool.close();
    console.log('\n🎉 Reparación de esquema completada exitosamente');

  } catch (error) {
    console.error('❌ Error reparando esquema:', error.message);
    process.exit(1);
  }
}

fixSchemaColumns();
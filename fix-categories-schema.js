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
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000
  },
  pool: {
    max: 5,
    min: 1,
    idleTimeoutMillis: 30000
  }
};

async function fixCategoriesSchema() {
  let pool;
  try {
    console.log('🔌 Conectando a Cloud SQL SQL Server...');
    pool = await sql.connect(config);
    console.log('✅ Conectado exitosamente');
    
    // Verificar tabla product_categories
    const checkTableQuery = `
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'product_categories' 
      ORDER BY ORDINAL_POSITION
    `;
    
    console.log('\n📊 Verificando estructura actual de product_categories...');
    const currentColumns = await pool.request().query(checkTableQuery);
    console.log('Columnas actuales:', currentColumns.recordset);
    
    // Verificar si sortOrder existe
    const hasSortOrder = currentColumns.recordset.some(col => 
      col.COLUMN_NAME.toLowerCase() === 'sortorder'
    );
    
    if (!hasSortOrder) {
      console.log('\n⚠️ Columna sortOrder no encontrada, agregándola...');
      
      const addSortOrderQuery = `
        ALTER TABLE product_categories 
        ADD sortOrder INT NULL DEFAULT 0
      `;
      
      await pool.request().query(addSortOrderQuery);
      console.log('✅ Columna sortOrder agregada exitosamente');
    } else {
      console.log('✅ Columna sortOrder ya existe');
    }
    
    // Verificar estructura final
    console.log('\n📊 Estructura final de product_categories:');
    const finalColumns = await pool.request().query(checkTableQuery);
    finalColumns.recordset.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}) ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Test query para verificar que funciona
    console.log('\n🧪 Probando query con sortOrder...');
    const testQuery = `
      SELECT TOP 5 id, name, sortOrder 
      FROM product_categories 
      ORDER BY sortOrder, name
    `;
    
    const testResult = await pool.request().query(testQuery);
    console.log('✅ Query de prueba exitosa:', testResult.recordset);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    if (pool) {
      await pool.close();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar
fixCategoriesSchema()
  .then(() => {
    console.log('\n🎉 Esquema de categorías corregido exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error al corregir esquema:', error);
    process.exit(1);
  });
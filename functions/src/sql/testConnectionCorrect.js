// functions/src/sql/testConnection.js
import sql from 'mssql';

const sqlConfig = {
  server: 'oilforestech.database.windows.net',
  port: 1433,
  database: 'forestechCombus', 
  user: 'oil',
  password: '271202ev',
  options: {
    encrypt: true,
    trustServerCertificate: false,
  }
};

export const testSqlConnection = async () => {
  try {
    console.log('🔌 Conectando a Azure SQL...');
    const pool = await sql.connect(sqlConfig);
    
    const result = await pool.request().query('SELECT 1 as test');
    console.log('✅ Conexión SQL exitosa:', result.recordset);
    
    await pool.close();
    return { success: true, message: 'Conexión exitosa' };
  } catch (error) {
    console.error('❌ Error conexión SQL:', error);
    return { success: false, error: error.message };
  }
};
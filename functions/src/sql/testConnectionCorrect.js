// functions/src/sql/testConnection.js
import sql from 'mssql';

const sqlConfig = {
  server: '24.199.89.134',
  port: 1433,
  database: 'DBforestech', 
  user: 'SA',
  password: 'Forestech2024!SecureDB',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

export const testSqlConnection = async () => {
  try {
  console.log('🔌 Conectando a DigitalOcean SQL Server...');
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
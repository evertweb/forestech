import sql from 'mssql';
import { sqlConfig } from './config.js';

export const testConnection = async () => {
  try {
    console.log('🔌 Conectando a Cloud SQL Server...');
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
/**
 * Cloud SQL Connection - Instancia "oil"
 * Configuración específica para tu instancia Cloud SQL Server
 */

import sql from 'mssql';

class OilSQLConnection {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  getConfig() {
    // NOTA: Firebase Functions NO soporta Unix sockets
    // Siempre usamos IP pública con SSL
    return {
      server: '34.61.242.157',  // IP pública siempre para Firebase Functions
      port: 1433,
      database: 'forestechCombus',
      user: 'oil',
      password: '123456789',
      options: {
        encrypt: true,  // Siempre usar SSL para conexiones externas
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000,
      },
      pool: {
        max: 5,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000
      }
    };
  }

  async connect() {
    if (this.pool && this.isConnected) {
      return this.pool;
    }

    try {
      console.log('🔌 Conectando a Cloud SQL "oil"...');
      const config = this.getConfig();
      
      this.pool = await sql.connect(config);
      this.isConnected = true;
      
      console.log('✅ Conectado a Cloud SQL "oil" exitosamente');
      return this.pool;
    } catch (error) {
      console.error('❌ Error conectando a Cloud SQL "oil":', error);
      this.isConnected = false;
      throw new Error(`Cloud SQL "oil" connection failed: ${error.message}`);
    }
  }

  async query(queryText, params = {}) {
    const pool = await this.connect();
    try {
      const request = pool.request();
      
      // Agregar parámetros
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });

      const result = await request.query(queryText);
      return result.recordset || [];
    } catch (error) {
      console.error('❌ Error en query Cloud SQL "oil":', error);
      throw error;
    }
  }

  async execute(command, params = {}) {
    const pool = await this.connect();
    try {
      const request = pool.request();
      
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });

      const result = await request.query(command);
      
      return {
        success: true,
        rowsAffected: result.rowsAffected?.[0] || 0,
        recordset: result.recordset
      };
    } catch (error) {
      console.error('❌ Error ejecutando comando Cloud SQL "oil":', error);
      throw error;
    }
  }

  async transaction(callback) {
    const pool = await this.connect();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async testConnection() {
    try {
      const result = await this.query('SELECT @@VERSION as version, GETDATE() as current_time');
      return {
        success: true,
        version: result[0]?.version,
        currentTime: result[0]?.current_time,
        message: 'Conexión exitosa a Cloud SQL "oil"'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error de conexión a Cloud SQL "oil"'
      };
    }
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      this.isConnected = false;
      console.log('🔌 Desconectado de Cloud SQL "oil"');
    }
  }

  getStats() {
    return {
      isConnected: this.isConnected,
      poolSize: this.pool?.size || 0,
      connected: this.pool?.connected || false,
      healthy: this.pool?.healthy || false,
      instanceName: 'oil',
      connectionName: 'liquidacionapp-62962:us-central1:oil'
    };
  }
}

// Singleton instance
const oilConnection = new OilSQLConnection();
export default oilConnection;
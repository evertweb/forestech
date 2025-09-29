/**
 * Cloud SQL Connection Manager
 * Conexión simplificada a PostgreSQL via Cloud SQL
 */

import { Client } from 'pg';

const CONNECTION_CONFIG = {
  // Usar unix socket en producción (Cloud Functions)
  host: process.env.NODE_ENV === 'production' 
    ? '/cloudsql/liquidacionapp-62962:us-central1:forestech-combustibles'
    : 'localhost',
  database: 'forestech_combustibles',
  user: process.env.CLOUD_SQL_USER || 'forestech_user',
  password: process.env.CLOUD_SQL_PASSWORD,
  port: process.env.NODE_ENV === 'production' ? undefined : 5432,
  
  // Configuración de pool para Firebase Functions
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 5, // Máximo 5 conexiones para Functions
};

class CloudSQLConnection {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.client && this.isConnected) {
      return this.client;
    }

    try {
      console.log('🔌 Conectando a Cloud SQL PostgreSQL...');
      this.client = new Client(CONNECTION_CONFIG);
      await this.client.connect();
      this.isConnected = true;
      
      console.log('✅ Conectado a Cloud SQL exitosamente');
      return this.client;
    } catch (error) {
      console.error('❌ Error conectando a Cloud SQL:', error);
      throw new Error(`Cloud SQL connection failed: ${error.message}`);
    }
  }

  async query(text, params = []) {
    const client = await this.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('❌ Error en query Cloud SQL:', error);
      throw error;
    }
  }

  async transaction(callback) {
    const client = await this.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.end();
      this.client = null;
      this.isConnected = false;
      console.log('🔌 Desconectado de Cloud SQL');
    }
  }
}

// Singleton instance
const cloudSqlConnection = new CloudSQLConnection();

export default cloudSqlConnection;
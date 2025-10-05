/**
 * SqlConnection - Clase base para conexión y operaciones con SQL Server (DigitalOcean)
 * Adaptado para Firebase Functions (Node.js backend)
 * Forestech Combustibles App
 */

import sql from 'mssql';
import { sqlConfig } from './config.js';

class SqlConnection {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  /**
   * Conectar a la base de datos
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      if (this.pool) {
        return; // Ya conectado
      }

  console.log('🔌 Conectando a SQL Server DigitalOcean desde Functions...');
      this.pool = await sql.connect(sqlConfig);
      this.isConnected = true;

  console.log('✅ Conexión exitosa a SQL Server DigitalOcean en Functions');

      // Configurar event listeners
      this.pool.on('connect', () => {
        console.log('🔗 Conexión SQL establecida en Functions');
      });

      this.pool.on('error', (err) => {
        console.error('❌ Error en conexión SQL en Functions:', err);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Error conectando a SQL Server en Functions:', error);
      this.isConnected = false;
      throw new Error(`Error de conexión SQL: ${error.message}`);
    }
  }

  /**
   * Desconectar de la base de datos
   * @returns {Promise<void>}
   */
  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        this.isConnected = false;
        console.log('🔌 Desconexión exitosa de SQL Server en Functions');
      }
    } catch (error) {
      console.error('❌ Error desconectando SQL en Functions:', error);
      throw error;
    }
  }

  /**
   * Ejecutar consulta SELECT
   * @param {string} query - Consulta SQL
   * @param {Object} params - Parámetros de la consulta
   * @returns {Promise<Array>} - Resultados de la consulta
   */
  async query(query, params = {}) {
    try {
      await this.ensureConnection();

      const request = this.pool.request();

      // Agregar parámetros si existen
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });

      const result = await request.query(query);

      return result.recordset || [];
    } catch (error) {
      console.error('❌ Error en consulta SQL en Functions:', error);
      throw new Error(`Error en consulta: ${error.message}`);
    }
  }

  /**
   * Ejecutar comando INSERT, UPDATE, DELETE
   * @param {string} command - Comando SQL
   * @param {Object} params - Parámetros
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async execute(command, params = {}) {
    try {
      await this.ensureConnection();

      const request = this.pool.request();

      // Agregar parámetros
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });

      const result = await request.query(command);

      return {
        success: true,
        rowsAffected: result.rowsAffected?.[0] || 0,
        recordset: result.recordset,
      };
    } catch (error) {
      console.error('❌ Error ejecutando comando SQL en Functions:', error);
      throw new Error(`Error ejecutando comando: ${error.message}`);
    }
  }

  /**
   * Ejecutar transacción
   * @param {Function} callback - Función que recibe la transacción
   * @returns {Promise<any>} - Resultado de la transacción
   */
  async transaction(callback) {
    try {
      await this.ensureConnection();

      const transaction = new sql.Transaction(this.pool);
      await transaction.begin();

      try {
        const result = await callback(transaction);
        await transaction.commit();
        return result;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('❌ Error en transacción SQL en Functions:', error);
      throw new Error(`Error en transacción: ${error.message}`);
    }
  }

  /**
   * Verificar estado de conexión
   * @returns {Promise<void>}
   */
  async ensureConnection() {
    if (!this.isConnected || !this.pool) {
      await this.connect();
    }

    // Verificar si la conexión sigue viva
    try {
      await this.pool.request().query('SELECT 1');
    } catch (error) {
      console.warn('⚠️ Conexión perdida en Functions, reconectando...');
      this.isConnected = false;
      await this.connect();
    }
  }

  /**
   * Obtener estadísticas de conexión
   * @returns {Object} - Estadísticas
   */
  getStats() {
    return {
      isConnected: this.isConnected,
      poolSize: this.pool?.size || 0,
      connected: this.pool?.connected || false,
      healthy: this.pool?.healthy || false,
    };
  }

  /**
   * Limpiar recursos
   */
  cleanup() {
    if (this.pool) {
      this.pool.close();
      this.pool = null;
      this.isConnected = false;
    }
  }
}

// Instancia singleton
const sqlConnection = new SqlConnection();

export default sqlConnection;
export { SqlConnection };
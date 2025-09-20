/**
 * SqlConnection - Clase base para conexión y operaciones con Azure SQL Server
 * Forestech Combustibles App
 */

import sql from 'mssql';
import sqlConfig from '../../config/azureSqlConfig.js';

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

      console.log('🔌 Conectando a Azure SQL Server...');
      this.pool = await sql.connect(sqlConfig);
      this.isConnected = true;

      console.log('✅ Conexión exitosa a Azure SQL Server');

      // Configurar event listeners
      this.pool.on('connect', () => {
        console.log('🔗 Conexión SQL establecida');
      });

      this.pool.on('error', (err) => {
        console.error('❌ Error en conexión SQL:', err);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Error conectando a SQL Server:', error);
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
        console.log('🔌 Desconexión exitosa de SQL Server');
      }
    } catch (error) {
      console.error('❌ Error desconectando SQL:', error);
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
      console.error('❌ Error en consulta SQL:', error);
      throw new Error(`Error en consulta: ${error.message}`);
    }
  }

  /**
   * Ejecutar consulta SELECT con paginación
   * @param {string} query - Consulta base
   * @param {Object} params - Parámetros
   * @param {Object} pagination - { page, limit }
   * @returns {Promise<Object>} - { data, total, page, limit }
   */
  async queryPaginated(query, params = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      // Consulta para contar total
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as subquery`;
      const countResult = await this.query(countQuery, params);
      const total = countResult[0]?.total || 0;

      // Consulta paginada
      const paginatedQuery = `${query} ORDER BY (SELECT NULL) OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
      const data = await this.query(paginatedQuery, params);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('❌ Error en consulta paginada:', error);
      throw error;
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
      console.error('❌ Error ejecutando comando SQL:', error);
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
      console.error('❌ Error en transacción SQL:', error);
      throw new Error(`Error en transacción: ${error.message}`);
    }
  }

  /**
   * Ejecutar stored procedure
   * @param {string} procedureName - Nombre del procedimiento
   * @param {Object} params - Parámetros
   * @returns {Promise<Array>} - Resultados
   */
  async executeProcedure(procedureName, params = {}) {
    try {
      await this.ensureConnection();

      const request = this.pool.request();

      // Agregar parámetros
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });

      const result = await request.execute(procedureName);

      return result.recordset || [];
    } catch (error) {
      console.error('❌ Error ejecutando stored procedure:', error);
      throw new Error(`Error en stored procedure: ${error.message}`);
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
      console.warn('⚠️ Conexión perdida, reconectando...');
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
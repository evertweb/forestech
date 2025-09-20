/**
 * SqlBaseService - Clase base para servicios SQL Server
 * Extiende funcionalidad base con operaciones SQL equivalentes a Firestore
 * Forestech Combustibles App
 */

import sqlConnection from './SqlConnection.js';

class SqlBaseService {
  /**
   * Constructor de SqlBaseService
   * @param {string} tableName - Nombre de la tabla SQL
   * @param {Object} config - Configuración del servicio
   */
  constructor(tableName, config = {}) {
    if (!tableName) {
      throw new Error('SqlBaseService: tableName es requerido');
    }

    this.tableName = tableName;
    this.config = {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'createdAt',
      defaultOrderDirection: 'DESC',
      primaryKey: 'id',
      ...config,
    };
  }

  /**
   * Validar datos antes de guardar
   * @param {Object} data - Datos a validar
   * @returns {Object} - Resultado de validación { isValid, errors }
   */
  validateData(data) {
    if (!data || typeof data !== 'object') {
      return {
        isValid: false,
        errors: ['Los datos son requeridos y deben ser un objeto'],
      };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Procesar datos antes de guardar
   * @param {Object} data - Datos originales
   * @param {boolean} isUpdate - Si es una actualización
   * @returns {Object} - Datos procesados
   */
  processData(data, isUpdate = false) {
    const processedData = { ...data };

    if (this.config.enableTimestamps) {
      processedData.updatedAt = new Date();

      if (!isUpdate) {
        processedData.createdAt = new Date();
      }
    }

    // Limpiar campos undefined
    Object.keys(processedData).forEach((key) => {
      if (processedData[key] === undefined) {
        delete processedData[key];
      }
    });

    return processedData;
  }

  /**
   * Manejar errores de manera consistente
   * @param {Error} error - Error capturado
   * @param {string} operation - Operación que falló
   * @returns {Object} - Respuesta estructurada de error
   */
  handleError(error, operation) {
    console.error(`${this.constructor.name} - ${operation}:`, error);

    let errorMessage = 'Ocurrió un error inesperado';

    // Mapear errores comunes de SQL Server
    if (error.code === 'ETIMEOUT') {
      errorMessage = 'Timeout en la conexión a la base de datos';
    } else if (error.code === 'ECONNCLOSED') {
      errorMessage = 'Conexión a la base de datos cerrada';
    } else if (error.code === 'ENOTOPEN') {
      errorMessage = 'Conexión a la base de datos no está abierta';
    } else if (error.message?.includes('duplicate key')) {
      errorMessage = 'Ya existe un registro con estos datos';
    } else if (error.message?.includes('foreign key')) {
      errorMessage = 'Error de integridad referencial';
    } else if (error.message?.includes('cannot insert NULL')) {
      errorMessage = 'Faltan campos requeridos';
    } else {
      errorMessage = error.message || errorMessage;
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code || 'unknown',
      operation,
    };
  }

  /**
   * Verificar duplicados basado en un campo
   * @param {string} field - Campo a verificar
   * @param {any} value - Valor a buscar
   * @param {string} excludeId - ID a excluir de la búsqueda (para updates)
   * @returns {Promise<boolean>} - true si existe duplicado
   */
  async checkDuplicate(field, value, excludeId = null) {
    try {
      let query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE ${field} = @value`;
      const params = { value };

      if (excludeId) {
        query += ` AND ${this.config.primaryKey} != @excludeId`;
        params.excludeId = excludeId;
      }

      const result = await sqlConnection.query(query, params);
      return result[0]?.count > 0;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  }

  /**
   * Logs de auditoría para operaciones críticas
   * @param {string} operation - Operación realizada
   * @param {string} recordId - ID del registro
   * @param {Object} metadata - Información adicional
   */
  logOperation(operation, recordId, metadata = {}) {
    const logData = {
      service: this.constructor.name,
      table: this.tableName,
      operation,
      recordId,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    console.info(`[${this.constructor.name}] ${operation}:`, logData);
  }

  /**
   * Construir cláusula WHERE para consultas
   * @param {Object} filters - Filtros a aplicar
   * @returns {Object} - { whereClause, params }
   */
  buildWhereClause(filters = {}) {
    const conditions = [];
    const params = {};

    Object.entries(filters).forEach(([field, value], index) => {
      if (value !== undefined && value !== null) {
        const paramName = `param${index}`;
        conditions.push(`${field} = @${paramName}`);
        params[paramName] = value;
      }
    });

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    return { whereClause, params };
  }

  /**
   * Construir cláusula ORDER BY
   * @param {string} orderBy - Campo para ordenar
   * @param {string} orderDirection - Dirección (ASC/DESC)
   * @returns {string} - Cláusula ORDER BY
   */
  buildOrderByClause(orderBy, orderDirection = 'ASC') {
    if (!orderBy) return '';

    const direction = orderDirection.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    return `ORDER BY ${orderBy} ${direction}`;
  }

  /**
   * Ejecutar consulta con manejo de errores
   * @param {string} query - Consulta SQL
   * @param {Object} params - Parámetros
   * @returns {Promise<Array>} - Resultados
   */
  async executeQuery(query, params = {}) {
    try {
      return await sqlConnection.query(query, params);
    } catch (error) {
      throw this.handleError(error, 'QUERY');
    }
  }

  /**
   * Ejecutar comando con manejo de errores
   * @param {string} command - Comando SQL
   * @param {Object} params - Parámetros
   * @returns {Promise<Object>} - Resultado
   */
  async executeCommand(command, params = {}) {
    try {
      return await sqlConnection.execute(command, params);
    } catch (error) {
      throw this.handleError(error, 'COMMAND');
    }
  }
}

export default SqlBaseService;
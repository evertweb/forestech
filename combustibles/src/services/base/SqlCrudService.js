/**
 * SqlCrudService - Implementa operaciones CRUD para SQL Server
 * Equivalente a CRUDService pero usando SQL Server en lugar de Firestore
 * Forestech Combustibles App
 */

import SqlBaseService from './SqlBaseService.js';
import sqlConnection from './SqlConnection.js';

class SqlCrudService extends SqlBaseService {
  /**
   * Constructor de SqlCrudService
   * @param {string} tableName - Nombre de la tabla
   * @param {Object} config - Configuración del servicio
   */
  constructor(tableName, config = {}) {
    super(tableName, config);
  }

  /**
   * CREATE - Crear un nuevo registro
   * @param {Object} data - Datos del registro
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async create(data, options = {}) {
    try {
      // Validar datos
      const validation = this.validateData(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Datos inválidos: ${validation.errors.join(', ')}`,
        };
      }

      // Verificar duplicados si se especifica
      if (options.duplicateField) {
        const isDuplicate = await this.checkDuplicate(
          options.duplicateField,
          data[options.duplicateField]
        );

        if (isDuplicate) {
          return {
            success: false,
            error: `Ya existe un elemento con ${options.duplicateField}: ${data[options.duplicateField]}`,
          };
        }
      }

      // Procesar datos
      const processedData = this.processData(data, false);

      // Construir consulta INSERT
      const columns = Object.keys(processedData);
      const values = columns.map((_, index) => `@param${index}`);
      const params = {};

      columns.forEach((col, index) => {
        params[`param${index}`] = processedData[col];
      });

      const query = `
        INSERT INTO ${this.tableName} (${columns.join(', ')})
        VALUES (${values.join(', ')});
        SELECT SCOPE_IDENTITY() as id;
      `;

      const result = await this.executeQuery(query, params);
      const newId = result[0]?.id;

      // Log de auditoría
      this.logOperation('CREATE', newId, {
        duplicateCheck: !!options.duplicateField,
      });

      return {
        success: true,
        id: newId,
        message: 'Elemento creado exitosamente',
      };
    } catch (error) {
      return this.handleError(error, 'CREATE');
    }
  }

  /**
   * READ - Obtener un registro por ID
   * @param {string} id - ID del registro
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async getById(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'ID es requerido',
        };
      }

      const query = `SELECT * FROM ${this.tableName} WHERE ${this.config.primaryKey} = @id`;
      const result = await this.executeQuery(query, { id });

      if (result.length === 0) {
        return {
          success: false,
          error: 'Elemento no encontrado',
        };
      }

      return {
        success: true,
        data: result[0],
      };
    } catch (error) {
      return this.handleError(error, 'READ_BY_ID');
    }
  }

  /**
   * READ ALL - Obtener todos los registros
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async getAll(options = {}) {
    try {
      let query = `SELECT * FROM ${this.tableName}`;
      let params = {};

      // Aplicar filtros
      if (options.filters && Array.isArray(options.filters)) {
        const filterConditions = [];
        options.filters.forEach((filter, index) => {
          filterConditions.push(`${filter.field} = @filter${index}`);
          params[`filter${index}`] = filter.value;
        });

        if (filterConditions.length > 0) {
          query += ` WHERE ${filterConditions.join(' AND ')}`;
        }
      }

      // Aplicar ordenamiento
      const orderBy = options.orderBy || this.config.defaultOrderBy;
      const orderDirection = options.orderDirection || this.config.defaultOrderDirection;
      if (orderBy) {
        query += ` ${this.buildOrderByClause(orderBy, orderDirection)}`;
      }

      // Aplicar límite
      if (options.limit) {
        query += ` TOP ${options.limit}`;
      }

      const result = await this.executeQuery(query, params);

      return {
        success: true,
        data: result,
        count: result.length,
      };
    } catch (error) {
      return this.handleError(error, 'READ_ALL');
    }
  }

  /**
   * UPDATE - Actualizar un registro
   * @param {string} id - ID del registro
   * @param {Object} data - Datos a actualizar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async update(id, data, options = {}) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'ID es requerido',
        };
      }

      // Verificar que el registro existe
      const existsResult = await this.getById(id);
      if (!existsResult.success) {
        return existsResult;
      }

      // Validar datos
      const validation = this.validateData(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Datos inválidos: ${validation.errors.join(', ')}`,
        };
      }

      // Verificar duplicados si se especifica
      if (options.duplicateField && data[options.duplicateField]) {
        const isDuplicate = await this.checkDuplicate(
          options.duplicateField,
          data[options.duplicateField],
          id
        );

        if (isDuplicate) {
          return {
            success: false,
            error: `Ya existe un elemento con ${options.duplicateField}: ${data[options.duplicateField]}`,
          };
        }
      }

      // Procesar datos
      const processedData = this.processData(data, true);

      // Construir consulta UPDATE
      const setParts = [];
      const params = { id };

      Object.entries(processedData).forEach(([column, value], index) => {
        setParts.push(`${column} = @param${index}`);
        params[`param${index}`] = value;
      });

      const query = `
        UPDATE ${this.tableName}
        SET ${setParts.join(', ')}
        WHERE ${this.config.primaryKey} = @id
      `;

      const result = await this.executeCommand(query, params);

      // Log de auditoría
      this.logOperation('UPDATE', id, {
        fieldsUpdated: Object.keys(processedData),
        duplicateCheck: !!options.duplicateField,
      });

      return {
        success: true,
        id,
        message: 'Elemento actualizado exitosamente',
        rowsAffected: result.rowsAffected,
      };
    } catch (error) {
      return this.handleError(error, 'UPDATE');
    }
  }

  /**
   * DELETE - Eliminar un registro
   * @param {string} id - ID del registro
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async delete(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'ID es requerido',
        };
      }

      // Verificar que el registro existe
      const existsResult = await this.getById(id);
      if (!existsResult.success) {
        return existsResult;
      }

      // Soft delete si está habilitado
      if (this.config.enableSoftDelete) {
        const softDeleteData = {
          deleted: true,
          deletedAt: new Date(),
        };

        const updateResult = await this.update(id, softDeleteData);
        if (updateResult.success) {
          this.logOperation('SOFT_DELETE', id);
          return {
            success: true,
            id,
            message: 'Elemento eliminado exitosamente',
          };
        }
        return updateResult;
      }

      // Hard delete
      const query = `DELETE FROM ${this.tableName} WHERE ${this.config.primaryKey} = @id`;
      const result = await this.executeCommand(query, { id });

      // Log de auditoría
      this.logOperation('DELETE', id, {
        hardDelete: true,
      });

      return {
        success: true,
        id,
        message: 'Elemento eliminado permanentemente',
        rowsAffected: result.rowsAffected,
      };
    } catch (error) {
      return this.handleError(error, 'DELETE');
    }
  }

  /**
   * FIND - Buscar registros por criterios
   * @param {Object} criteria - Criterios de búsqueda
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async find(criteria, options = {}) {
    try {
      const { whereClause, params } = this.buildWhereClause(criteria);
      let query = `SELECT * FROM ${this.tableName} ${whereClause}`;

      // Aplicar ordenamiento
      const orderBy = options.orderBy || this.config.defaultOrderBy;
      const orderDirection = options.orderDirection || this.config.defaultOrderDirection;
      if (orderBy) {
        query += ` ${this.buildOrderByClause(orderBy, orderDirection)}`;
      }

      // Aplicar límite
      if (options.limit) {
        query = query.replace('SELECT', `SELECT TOP ${options.limit}`);
      }

      const result = await this.executeQuery(query, params);

      return {
        success: true,
        data: result,
        count: result.length,
      };
    } catch (error) {
      return this.handleError(error, 'FIND');
    }
  }

  /**
   * COUNT - Contar registros
   * @param {Object} criteria - Criterios de filtro
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async count(criteria = {}) {
    try {
      const { whereClause, params } = this.buildWhereClause(criteria);
      const query = `SELECT COUNT(*) as count FROM ${this.tableName} ${whereClause}`;

      const result = await this.executeQuery(query, params);

      return {
        success: true,
        count: result[0]?.count || 0,
      };
    } catch (error) {
      return this.handleError(error, 'COUNT');
    }
  }

  /**
   * Ejecutar transacción SQL
   * @param {Function} callback - Función que recibe la transacción
   * @returns {Promise<any>} - Resultado de la transacción
   */
  async runTransaction(callback) {
    try {
      return await sqlConnection.transaction(async (transaction) => {
        // Crear un wrapper para mantener compatibilidad con Firestore
        const transactionWrapper = {
          get: async (ref) => {
            // Implementar lógica para obtener datos dentro de transacción
            const query = `SELECT * FROM ${ref.table} WHERE id = @id`;
            const result = await transaction.request().input('id', ref.id).query(query);
            return result.recordset[0];
          },
          set: async (ref, data) => {
            // Implementar lógica para guardar datos dentro de transacción
            const columns = Object.keys(data);
            const values = columns.map((_, index) => `@param${index}`);
            const query = `
              INSERT INTO ${ref.table} (${columns.join(', ')})
              VALUES (${values.join(', ')})
            `;

            const request = transaction.request();
            columns.forEach((col, index) => {
              request.input(`param${index}`, data[col]);
            });

            await request.query(query);
          },
          update: async (ref, data) => {
            // Implementar lógica para actualizar datos dentro de transacción
            const setParts = Object.keys(data).map((col, index) => `${col} = @param${index}`);
            const query = `UPDATE ${ref.table} SET ${setParts.join(', ')} WHERE id = @id`;

            const request = transaction.request().input('id', ref.id);
            Object.keys(data).forEach((col, index) => {
              request.input(`param${index}`, data[col]);
            });

            await request.query(query);
          },
          delete: async (ref) => {
            // Implementar lógica para eliminar datos dentro de transacción
            const query = `DELETE FROM ${ref.table} WHERE id = @id`;
            await transaction.request().input('id', ref.id).query(query);
          },
        };

        return await callback(transactionWrapper);
      });
    } catch (error) {
      return this.handleError(error, 'TRANSACTION');
    }
  }
}

export default SqlCrudService;
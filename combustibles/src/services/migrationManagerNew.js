/**
 * MigrationManager - Servicio refactorizado para orquestación del sistema de migración
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 *
 * Funcionalidades:
 * - Orquestador principal del wizard de migración de datos
 * - Coordina todos los pasos del proceso de migración
 * - Gestión de contexto y estado de migración
 * - Validación avanzada y manejo de errores
 * - Sistema de callbacks para progreso en tiempo real
 *
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-08-04
 */

import { CRUDService } from './base/CRUDService.js';
import fileParsingService from './fileParsingService';
import aliasService, { ALIAS_TYPES } from './aliasService';
import movementsService, { MOVEMENT_TYPES, MOVEMENT_STATUS } from './movementsService';
import { OPERATIONAL_LOCATIONS } from '../constants/locations';
import { PRODUCT_TYPES } from '../constants/productTypes';

/**
 * Estados del wizard de migración
 */
export const MIGRATION_STEPS = {
  FILE_UPLOAD: 1,
  COLUMN_MAPPING: 2,
  VALUE_MAPPING: 3,
  VALIDATION: 4,
  EXECUTION: 5,
};

/**
 * Estados de sesión de migración
 */
export const MIGRATION_SESSION_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

/**
 * Campos requeridos para migración
 */
export const REQUIRED_FIELDS = {
  fecha: { required: true, type: 'date', description: 'Fecha del movimiento' },
  cantidad: { required: true, type: 'number', description: 'Cantidad de combustible' },
  vehiculo: { required: true, type: 'string', description: 'Vehículo o equipo' },
  producto: { required: true, type: 'string', description: 'Tipo de combustible/producto' },
};

/**
 * Campos opcionales para migración
 */
export const OPTIONAL_FIELDS = {
  horometro: { required: false, type: 'number', description: 'Lectura del horómetro' },
  precio: { required: false, type: 'number', description: 'Precio unitario' },
  ubicacion: { required: false, type: 'string', description: 'Ubicación origen' },
  destino: { required: false, type: 'string', description: 'Ubicación destino' },
  descripcion: { required: false, type: 'string', description: 'Notas adicionales' },
  proveedor: { required: false, type: 'string', description: 'Proveedor (para entradas)' },
};

/**
 * Crear contexto de migración
 */
export const createMigrationContext = () => ({
  sessionId: `migration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  step: MIGRATION_STEPS.FILE_UPLOAD,
  status: MIGRATION_SESSION_STATUS.ACTIVE,
  fileData: null,
  columnMapping: {},
  valueMapping: {},
  validationResult: null,
  executionResult: null,
  errors: [],
  warnings: [],
  metadata: {
    startedAt: new Date(),
    fileName: '',
    totalRows: 0,
    processedRows: 0,
    successfulRows: 0,
    failedRows: 0,
    currentStep: 'Iniciando...',
    estimatedTime: 0,
  },
});

/**
 * Clase MigrationManager refactorizada
 */
class MigrationManager extends CRUDService {
  constructor() {
    super('migration_sessions', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'createdAt',
      defaultOrderDirection: 'desc',
    });

    this.activeSessions = new Map(); // Sesiones activas en memoria
    this.callbacks = new Map(); // Callbacks por sesión
  }

  /**
   * Validación específica para sesiones de migración
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;

    const errors = [];

    if (!data.sessionId) {
      errors.push('sessionId es requerido');
    }

    if (data.step && !Object.values(MIGRATION_STEPS).includes(data.step)) {
      errors.push('step debe ser un paso válido de migración');
    }

    if (data.status && !Object.values(MIGRATION_SESSION_STATUS).includes(data.status)) {
      errors.push('status debe ser un estado válido de sesión');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Procesar datos específicos de sesión de migración
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Serializar objetos complejos para Firebase
    if (baseProcessed.fileData && typeof baseProcessed.fileData === 'object') {
      baseProcessed.fileData = JSON.stringify(baseProcessed.fileData);
    }

    if (baseProcessed.columnMapping && typeof baseProcessed.columnMapping === 'object') {
      baseProcessed.columnMapping = JSON.stringify(baseProcessed.columnMapping);
    }

    if (baseProcessed.valueMapping && typeof baseProcessed.valueMapping === 'object') {
      baseProcessed.valueMapping = JSON.stringify(baseProcessed.valueMapping);
    }

    return baseProcessed;
  }

  /**
   * Crear nueva sesión de migración
   */
  async createMigrationSession(userId, options = {}) {
    try {
      const context = createMigrationContext();
      context.userId = userId;
      context.options = options;

      // Guardar sesión en Firebase
      await this.create(context);

      // Mantener en memoria para acceso rápido
      this.activeSessions.set(context.sessionId, context);
      this.callbacks.set(context.sessionId, []);

      this.log(`Nueva sesión de migración creada: ${context.sessionId}`, {
        userId,
        options,
      });

      return {
        success: true,
        data: context,
        sessionId: context.sessionId,
      };
    } catch (error) {
      this.logError('Error creando sesión de migración', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Registrar callback para progreso de sesión
   */
  onSessionProgress(sessionId, callback) {
    if (!this.callbacks.has(sessionId)) {
      this.callbacks.set(sessionId, []);
    }

    if (typeof callback === 'function') {
      this.callbacks.get(sessionId).push(callback);
      this.log(`Callback agregado para sesión: ${sessionId}`);
    }
  }

  /**
   * Notificar progreso de sesión
   */
  async notifySessionProgress(sessionId) {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) return;

      const callbacks = this.callbacks.get(sessionId) || [];

      callbacks.forEach((callback) => {
        try {
          callback(context);
        } catch (error) {
          this.logError(`Error en callback de sesión ${sessionId}`, error);
        }
      });

      // Actualizar en Firebase periódicamente
      if (context.metadata.processedRows % 50 === 0) {
        await this.updateSession(sessionId, { metadata: context.metadata });
      }
    } catch (error) {
      this.logError('Error notificando progreso de sesión', error);
    }
  }

  /**
   * PASO 1: Procesar archivo cargado
   */
  async processFile(sessionId, file, options = {}) {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) {
        throw new Error(`Sesión no encontrada: ${sessionId}`);
      }

      this.log(`Iniciando procesamiento de archivo: ${file.name}`, { sessionId });

      context.metadata.currentStep = 'Procesando archivo...';
      context.metadata.fileName = file.name;
      await this.notifySessionProgress(sessionId);

      const parsingResult = await fileParsingService.parseFile(file, options);

      if (!parsingResult.success) {
        context.errors.push({
          step: MIGRATION_STEPS.FILE_UPLOAD,
          error: parsingResult.error,
          timestamp: new Date(),
        });

        return {
          success: false,
          error: parsingResult.error,
          data: null,
        };
      }

      // Obtener preview y sugerencias
      const preview = this.getDataPreview(parsingResult.data, 20);
      const columnSuggestions = this.suggestColumnMapping(preview.headers);

      // Actualizar contexto
      context.fileData = parsingResult.data;
      context.step = MIGRATION_STEPS.COLUMN_MAPPING;
      context.metadata.totalRows = parsingResult.data.length;
      context.metadata.currentStep = 'Archivo procesado exitosamente';

      // Guardar progreso
      await this.updateSession(sessionId, {
        step: context.step,
        fileData: context.fileData,
        metadata: context.metadata,
      });

      await this.notifySessionProgress(sessionId);

      this.log(`Archivo procesado exitosamente: ${file.name}`, {
        sessionId,
        rows: parsingResult.data.length,
      });

      return {
        success: true,
        data: parsingResult.data,
        metadata: parsingResult.metadata,
        preview: preview,
        columnSuggestions: columnSuggestions,
        error: null,
      };
    } catch (error) {
      this.logError(`Error procesando archivo en sesión ${sessionId}`, error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * PASO 2: Configurar mapeo de columnas
   */
  async configureColumnMapping(sessionId, columnMapping) {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) {
        throw new Error(`Sesión no encontrada: ${sessionId}`);
      }

      if (context.step !== MIGRATION_STEPS.COLUMN_MAPPING) {
        throw new Error(
          `Paso incorrecto. Esperado: ${MIGRATION_STEPS.COLUMN_MAPPING}, Actual: ${context.step}`
        );
      }

      // Validar mapeo de columnas
      const validation = this.validateColumnMapping(columnMapping);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Mapeo de columnas inválido',
          errors: validation.errors,
        };
      }

      context.columnMapping = columnMapping;
      context.step = MIGRATION_STEPS.VALUE_MAPPING;
      context.metadata.currentStep = 'Configurando mapeo de valores...';

      // Generar sugerencias de mapeo de valores
      const valueSuggestions = await this.generateValueMappingSuggestions(sessionId);

      // Guardar progreso
      await this.updateSession(sessionId, {
        step: context.step,
        columnMapping: context.columnMapping,
        metadata: context.metadata,
      });

      await this.notifySessionProgress(sessionId);

      this.log(`Mapeo de columnas configurado para sesión: ${sessionId}`, {
        mappingCount: Object.keys(columnMapping).length,
      });

      return {
        success: true,
        data: columnMapping,
        valueSuggestions: valueSuggestions,
      };
    } catch (error) {
      this.logError(`Error configurando mapeo de columnas en sesión ${sessionId}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * PASO 3: Configurar mapeo de valores
   */
  async configureValueMapping(sessionId, valueMapping) {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) {
        throw new Error(`Sesión no encontrada: ${sessionId}`);
      }

      if (context.step !== MIGRATION_STEPS.VALUE_MAPPING) {
        throw new Error(
          `Paso incorrecto. Esperado: ${MIGRATION_STEPS.VALUE_MAPPING}, Actual: ${context.step}`
        );
      }

      context.valueMapping = valueMapping;
      context.step = MIGRATION_STEPS.VALIDATION;
      context.metadata.currentStep = 'Ejecutando validación...';

      // Ejecutar validación automática
      const validationResult = await this.validateMigrationData(sessionId);

      // Guardar progreso
      await this.updateSession(sessionId, {
        step: context.step,
        valueMapping: context.valueMapping,
        validationResult: validationResult,
        metadata: context.metadata,
      });

      await this.notifySessionProgress(sessionId);

      this.log(`Mapeo de valores configurado para sesión: ${sessionId}`, {
        mappingCount: Object.keys(valueMapping).length,
        validationSuccess: validationResult.success,
      });

      return {
        success: true,
        data: valueMapping,
        validationResult: validationResult,
      };
    } catch (error) {
      this.logError(`Error configurando mapeo de valores en sesión ${sessionId}`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * PASO 4: Validar datos de migración
   */
  async validateMigrationData(sessionId) {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) {
        throw new Error(`Sesión no encontrada: ${sessionId}`);
      }

      const validation = {
        success: true,
        errors: [],
        warnings: [],
        statistics: {
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
          warningRows: 0,
        },
      };

      const mappedData = this.applyMappings(
        context.fileData,
        context.columnMapping,
        context.valueMapping
      );
      validation.statistics.totalRows = mappedData.length;

      for (let i = 0; i < mappedData.length; i++) {
        const row = mappedData[i];
        const rowValidation = this.validateDataRow(row, i + 1);

        if (!rowValidation.isValid) {
          validation.errors.push(...rowValidation.errors);
          validation.statistics.invalidRows++;
        } else {
          validation.statistics.validRows++;
        }

        if (rowValidation.warnings.length > 0) {
          validation.warnings.push(...rowValidation.warnings);
          validation.statistics.warningRows++;
        }
      }

      validation.success = validation.statistics.invalidRows === 0;
      context.validationResult = validation;

      if (validation.success) {
        context.step = MIGRATION_STEPS.EXECUTION;
        context.metadata.currentStep = 'Validación exitosa - Listo para ejecutar';
      } else {
        context.metadata.currentStep = `Validación falló - ${validation.statistics.invalidRows} errores`;
      }

      await this.notifySessionProgress(sessionId);

      this.log(`Validación completada para sesión: ${sessionId}`, {
        success: validation.success,
        errors: validation.errors.length,
        warnings: validation.warnings.length,
      });

      return validation;
    } catch (error) {
      this.logError(`Error validando datos de migración en sesión ${sessionId}`, error);
      return {
        success: false,
        error: error.message,
        errors: [error.message],
        warnings: [],
      };
    }
  }

  /**
   * PASO 5: Ejecutar migración
   */
  async executeMigration(sessionId, options = {}) {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) {
        throw new Error(`Sesión no encontrada: ${sessionId}`);
      }

      if (context.step !== MIGRATION_STEPS.EXECUTION) {
        throw new Error(
          `Paso incorrecto. Esperado: ${MIGRATION_STEPS.EXECUTION}, Actual: ${context.step}`
        );
      }

      if (!context.validationResult || !context.validationResult.success) {
        throw new Error('No se puede ejecutar migración sin validación exitosa');
      }

      context.metadata.currentStep = 'Ejecutando migración...';
      await this.notifySessionProgress(sessionId);

      // Aplicar mapeos a todos los datos
      const mappedData = this.applyMappings(
        context.fileData,
        context.columnMapping,
        context.valueMapping
      );

      // Ejecutar migración por lotes
      const executionResult = await this.executeBatchMigration(sessionId, mappedData, options);

      context.executionResult = executionResult;
      context.status = executionResult.success
        ? MIGRATION_SESSION_STATUS.COMPLETED
        : MIGRATION_SESSION_STATUS.FAILED;

      context.metadata.currentStep = executionResult.success
        ? 'Migración completada exitosamente'
        : 'Migración falló con errores';

      // Guardar resultado final
      await this.updateSession(sessionId, {
        status: context.status,
        executionResult: context.executionResult,
        metadata: context.metadata,
      });

      await this.notifySessionProgress(sessionId);

      this.log(
        `Migración ${executionResult.success ? 'completada' : 'falló'} para sesión: ${sessionId}`,
        {
          processed: executionResult.processed,
          errors: executionResult.errors,
        }
      );

      return executionResult;
    } catch (error) {
      this.logError(`Error ejecutando migración en sesión ${sessionId}`, error);

      // Marcar sesión como fallida
      const context = this.activeSessions.get(sessionId);
      if (context) {
        context.status = MIGRATION_SESSION_STATUS.FAILED;
        context.metadata.currentStep = `Error: ${error.message}`;
        await this.updateSession(sessionId, {
          status: context.status,
          metadata: context.metadata,
        });
      }

      return {
        success: false,
        error: error.message,
        processed: 0,
        errors: 1,
      };
    }
  }

  /**
   * Obtener preview de datos
   */
  getDataPreview(data, maxRows = 20) {
    if (!Array.isArray(data) || data.length === 0) {
      return {
        headers: [],
        rows: [],
        totalRows: 0,
      };
    }

    const headers = Object.keys(data[0]);
    const rows = data.slice(0, maxRows);

    return {
      headers,
      rows,
      totalRows: data.length,
    };
  }

  /**
   * Sugerir mapeo de columnas
   */
  suggestColumnMapping(headers) {
    const suggestions = {};

    const mappings = {
      fecha: ['fecha', 'date', 'dia', 'day', 'tiempo', 'time'],
      cantidad: ['cantidad', 'qty', 'quantity', 'galones', 'litros', 'amount'],
      vehiculo: ['vehiculo', 'vehicle', 'equipo', 'equipment', 'maquina', 'machine'],
      producto: ['producto', 'product', 'combustible', 'fuel', 'articulo', 'item'],
    };

    headers.forEach((header) => {
      const lowerHeader = header.toLowerCase();

      for (const [field, keywords] of Object.entries(mappings)) {
        if (keywords.some((keyword) => lowerHeader.includes(keyword))) {
          suggestions[field] = header;
          break;
        }
      }
    });

    return suggestions;
  }

  /**
   * Generar sugerencias de mapeo de valores
   */
  async generateValueMappingSuggestions(sessionId) {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context || !context.fileData) return {};

      const suggestions = {};

      // Analizar valores únicos en cada columna mapeada
      for (const [field, column] of Object.entries(context.columnMapping)) {
        const uniqueValues = [...new Set(context.fileData.map((row) => row[column]))]
          .filter((value) => value && value.toString().trim() !== '')
          .slice(0, 50); // Límite para performance

        if (uniqueValues.length > 0) {
          suggestions[field] = await this.generateFieldValueSuggestions(field, uniqueValues);
        }
      }

      return suggestions;
    } catch (error) {
      this.logError('Error generando sugerencias de mapeo de valores', error);
      return {};
    }
  }

  /**
   * Generar sugerencias para valores de campo específico
   */
  async generateFieldValueSuggestions(field, values) {
    const suggestions = {};

    switch (field) {
      case 'vehiculo':
        // Buscar alias de vehículos existentes
        for (const value of values) {
          const alias = await aliasService.findAlias(value, ALIAS_TYPES.VEHICLE);
          if (alias) {
            suggestions[value] = alias.mappedValue;
          }
        }
        break;

      case 'producto':
        // Mapear a tipos de productos conocidos
        for (const value of values) {
          const productType = this.inferProductType(value);
          if (productType) {
            suggestions[value] = productType;
          }
        }
        break;

      case 'ubicacion':
        // Mapear a ubicaciones operacionales
        for (const value of values) {
          const location = this.inferLocation(value);
          if (location) {
            suggestions[value] = location;
          }
        }
        break;
    }

    return suggestions;
  }

  /**
   * Inferir tipo de producto
   */
  inferProductType(value) {
    const lowerValue = value.toLowerCase();

    if (lowerValue.includes('acpm') || lowerValue.includes('diesel')) {
      return PRODUCT_TYPES.ACPM;
    }
    if (lowerValue.includes('gasolina') || lowerValue.includes('gasoline')) {
      return PRODUCT_TYPES.GASOLINA_CORRIENTE;
    }
    if (lowerValue.includes('aceite') || lowerValue.includes('oil')) {
      return PRODUCT_TYPES.ACEITE_MOTOR;
    }

    return null;
  }

  /**
   * Inferir ubicación
   */
  inferLocation(value) {
    const lowerValue = value.toLowerCase();

    for (const location of OPERATIONAL_LOCATIONS) {
      if (lowerValue.includes(location.toLowerCase())) {
        return location;
      }
    }

    return null;
  }

  /**
   * Validar mapeo de columnas
   */
  validateColumnMapping(columnMapping) {
    const errors = [];

    // Verificar campos requeridos
    for (const [field, config] of Object.entries(REQUIRED_FIELDS)) {
      if (config.required && !columnMapping[field]) {
        errors.push(`Campo requerido no mapeado: ${field} (${config.description})`);
      }
    }

    // Verificar duplicados
    const mappedColumns = Object.values(columnMapping);
    const duplicates = mappedColumns.filter(
      (column, index) => mappedColumns.indexOf(column) !== index
    );

    if (duplicates.length > 0) {
      errors.push(`Columnas duplicadas en mapeo: ${duplicates.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Aplicar mapeos a datos
   */
  applyMappings(data, columnMapping, valueMapping) {
    return data.map((row) => {
      const mappedRow = {};

      // Aplicar mapeo de columnas
      for (const [field, column] of Object.entries(columnMapping)) {
        let value = row[column];

        // Aplicar mapeo de valores
        if (valueMapping[field] && valueMapping[field][value]) {
          value = valueMapping[field][value];
        }

        mappedRow[field] = value;
      }

      return mappedRow;
    });
  }

  /**
   * Validar fila de datos
   */
  validateDataRow(row, rowNumber) {
    const errors = [];
    const warnings = [];

    // Validar campos requeridos
    for (const [field, config] of Object.entries(REQUIRED_FIELDS)) {
      const value = row[field];

      if (!value || value.toString().trim() === '') {
        errors.push({
          row: rowNumber,
          field,
          message: `Campo requerido vacío: ${config.description}`,
          value,
        });
        continue;
      }

      // Validar tipo de dato
      if (config.type === 'number' && isNaN(Number(value))) {
        errors.push({
          row: rowNumber,
          field,
          message: `Valor no numérico: ${config.description}`,
          value,
        });
      }

      if (config.type === 'date' && isNaN(Date.parse(value))) {
        errors.push({
          row: rowNumber,
          field,
          message: `Fecha inválida: ${config.description}`,
          value,
        });
      }
    }

    // Validar campos opcionales
    for (const [field, config] of Object.entries(OPTIONAL_FIELDS)) {
      const value = row[field];

      if (value && value.toString().trim() !== '') {
        if (config.type === 'number' && isNaN(Number(value))) {
          warnings.push({
            row: rowNumber,
            field,
            message: `Valor no numérico en campo opcional: ${config.description}`,
            value,
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Ejecutar migración por lotes
   */
  async executeBatchMigration(sessionId, data, options = {}) {
    const batchSize = options.batchSize || 100;
    const result = {
      success: true,
      processed: 0,
      errors: 0,
      warnings: 0,
      details: [],
    };

    const context = this.activeSessions.get(sessionId);

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      try {
        const batchResult = await this.processBatch(batch, i);

        result.processed += batchResult.processed;
        result.errors += batchResult.errors;
        result.warnings += batchResult.warnings;
        result.details.push(...batchResult.details);

        // Actualizar progreso
        if (context) {
          context.metadata.processedRows = result.processed;
          context.metadata.currentStep = `Procesando... ${result.processed}/${data.length}`;
          await this.notifySessionProgress(sessionId);
        }
      } catch (error) {
        this.logError(`Error procesando lote ${i}-${i + batchSize}`, error);
        result.errors += batch.length;
        result.success = false;
      }
    }

    result.success = result.errors === 0;
    return result;
  }

  /**
   * Procesar lote de datos
   */
  async processBatch(batch, startIndex) {
    const result = {
      processed: 0,
      errors: 0,
      warnings: 0,
      details: [],
    };

    for (let i = 0; i < batch.length; i++) {
      const row = batch[i];
      const rowIndex = startIndex + i + 1;

      try {
        // Crear movimiento basado en los datos
        const movementData = this.transformToMovement(row);

        const createResult = await movementsService.createMovement(movementData);

        if (createResult.success) {
          result.processed++;
          result.details.push({
            row: rowIndex,
            status: 'success',
            id: createResult.data.id,
          });
        } else {
          result.errors++;
          result.details.push({
            row: rowIndex,
            status: 'error',
            error: createResult.error,
          });
        }
      } catch (error) {
        result.errors++;
        result.details.push({
          row: rowIndex,
          status: 'error',
          error: error.message,
        });
      }
    }

    return result;
  }

  /**
   * Transformar fila a movimiento
   */
  transformToMovement(row) {
    return {
      date: new Date(row.fecha),
      quantity: Number(row.cantidad),
      vehicleId: row.vehiculo,
      productType: row.producto,
      horometer: Number(row.horometro) || 0,
      price: Number(row.precio) || 0,
      location: row.ubicacion || '',
      destination: row.destino || '',
      description: row.descripcion || 'Migrado desde archivo',
      provider: row.proveedor || '',
      type: MOVEMENT_TYPES.EXIT,
      status: MOVEMENT_STATUS.COMPLETED,
    };
  }

  /**
   * Actualizar sesión en Firebase
   */
  async updateSession(sessionId, updates) {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) return;

      // Actualizar contexto en memoria
      Object.assign(context, updates);

      // Actualizar en Firebase
      const sessions = await this.search('sessionId', '==', sessionId);
      if (sessions.length > 0) {
        await this.update(sessions[0].id, updates);
      }
    } catch (error) {
      this.logError(`Error actualizando sesión ${sessionId}`, error);
    }
  }

  /**
   * Obtener sesión activa
   */
  getActiveSession(sessionId) {
    return this.activeSessions.get(sessionId) || null;
  }

  /**
   * Cancelar sesión de migración
   */
  async cancelSession(sessionId) {
    try {
      const context = this.activeSessions.get(sessionId);
      if (!context) {
        return { success: false, error: 'Sesión no encontrada' };
      }

      context.status = MIGRATION_SESSION_STATUS.CANCELLED;
      context.metadata.currentStep = 'Migración cancelada por usuario';

      await this.updateSession(sessionId, {
        status: context.status,
        metadata: context.metadata,
      });

      // Limpiar de memoria
      this.activeSessions.delete(sessionId);
      this.callbacks.delete(sessionId);

      this.log(`Sesión cancelada: ${sessionId}`);

      return { success: true, message: 'Sesión cancelada exitosamente' };
    } catch (error) {
      this.logError(`Error cancelando sesión ${sessionId}`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener estadísticas de migraciones
   */
  async getMigrationStats(days = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentSessions = await this.search('createdAt', '>=', cutoffDate);

      const stats = {
        totalSessions: recentSessions.length,
        completedSessions: recentSessions.filter(
          (s) => s.status === MIGRATION_SESSION_STATUS.COMPLETED
        ).length,
        failedSessions: recentSessions.filter((s) => s.status === MIGRATION_SESSION_STATUS.FAILED)
          .length,
        cancelledSessions: recentSessions.filter(
          (s) => s.status === MIGRATION_SESSION_STATUS.CANCELLED
        ).length,
        totalRowsProcessed: 0,
        avgSessionDuration: 0,
      };

      // Calcular estadísticas adicionales
      const completedSessions = recentSessions.filter(
        (s) => s.status === MIGRATION_SESSION_STATUS.COMPLETED && s.metadata
      );

      if (completedSessions.length > 0) {
        stats.totalRowsProcessed = completedSessions.reduce(
          (sum, s) => sum + (s.metadata.processedRows || 0),
          0
        );

        const durations = completedSessions
          .filter((s) => s.metadata.startedAt && s.updatedAt)
          .map((s) => new Date(s.updatedAt) - new Date(s.metadata.startedAt));

        if (durations.length > 0) {
          stats.avgSessionDuration = Math.round(
            durations.reduce((sum, d) => sum + d, 0) / durations.length / 1000
          ); // en segundos
        }
      }

      stats.successRate =
        stats.totalSessions > 0
          ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
          : 0;

      return { success: true, data: stats };
    } catch (error) {
      this.logError('Error obteniendo estadísticas de migración', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Limpiar sesiones antiguas
   */
  async cleanOldSessions(daysOld = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const oldSessions = await this.search('createdAt', '<', cutoffDate);
      let cleanedCount = 0;

      for (const session of oldSessions) {
        await this.delete(session.id);

        // Limpiar de memoria si está activa
        if (this.activeSessions.has(session.sessionId)) {
          this.activeSessions.delete(session.sessionId);
          this.callbacks.delete(session.sessionId);
        }

        cleanedCount++;
      }

      this.log(`Limpieza completada: ${cleanedCount} sesiones antiguas eliminadas`);
      return { success: true, cleanedCount };
    } catch (error) {
      this.logError('Error en limpieza de sesiones', error);
      return { success: false, error: error.message };
    }
  }
}

// Crear instancia singleton
const migrationManager = new MigrationManager();

// Exportar métodos para compatibilidad con código existente
export const createMigrationSession = (userId, options) =>
  migrationManager.createMigrationSession(userId, options);
export const processFile = (sessionId, file, options) =>
  migrationManager.processFile(sessionId, file, options);
export const configureColumnMapping = (sessionId, mapping) =>
  migrationManager.configureColumnMapping(sessionId, mapping);
export const configureValueMapping = (sessionId, mapping) =>
  migrationManager.configureValueMapping(sessionId, mapping);
export const validateMigrationData = (sessionId) =>
  migrationManager.validateMigrationData(sessionId);
export const executeMigration = (sessionId, options) =>
  migrationManager.executeMigration(sessionId, options);
export const onSessionProgress = (sessionId, callback) =>
  migrationManager.onSessionProgress(sessionId, callback);
export const getActiveSession = (sessionId) => migrationManager.getActiveSession(sessionId);
export const cancelSession = (sessionId) => migrationManager.cancelSession(sessionId);
export const getMigrationStats = (days) => migrationManager.getMigrationStats(days);
export const cleanOldSessions = (daysOld) => migrationManager.cleanOldSessions(daysOld);

// Exportar clase por defecto
export default migrationManager;

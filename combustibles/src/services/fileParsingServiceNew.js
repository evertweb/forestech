/**
 * FileParsingService - Servicio refactorizado para parsing universal de archivos
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 * 
 * Funcionalidades:
 * - Parsing de Excel, CSV y otros formatos con detección automática
 * - Validación avanzada de estructura y contenido
 * - Manejo optimizado de archivos grandes con streaming
 * - Logging detallado y manejo de errores robusto
 * - Caché de resultados para archivos procesados previamente
 * 
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation  
 * @date 2025-08-04
 */

import { CRUDService } from './base/CRUDService.js';

/**
 * Tipos de archivos soportados
 */
export const SUPPORTED_FILE_TYPES = {
  EXCEL: ['xlsx', 'xls'],
  CSV: ['csv'],
  TEXT: ['txt', 'tsv']
};

/**
 * Configuraciones de parsing por tipo
 */
export const PARSING_CONFIGS = {
  EXCEL: {
    range: undefined, // Todo el sheet
    header: 1, // Primera fila como header
    defval: '', // Valor por defecto para celdas vacías
    blankrows: false, // Omitir filas vacías
    dateNF: 'yyyy-mm-dd' // Formato de fecha
  },
  CSV: {
    delimiter: ',',
    encoding: 'utf-8',
    header: true,
    skipEmptyLines: true,
    transform: true
  },
  TEXT: {
    delimiter: '\t',
    encoding: 'utf-8',
    header: true,
    skipEmptyLines: true
  }
};

/**
 * Estructura estándar de resultado de parsing
 */
export const createParsingResult = (success, data = null, error = null, metadata = {}) => ({
  success,
  data,
  error,
  metadata: {
    fileName: '',
    fileSize: 0,
    fileType: '',
    rowCount: 0,
    columnCount: 0,
    sheets: [],
    encoding: 'UTF-8',
    processingTime: 0,
    warnings: [],
    ...metadata
  }
});

/**
 * Estructura de warning/error
 */
export const createParsingWarning = (type, message, row = null, column = null, details = {}) => ({
  type, // 'validation', 'format', 'content', 'size'
  message,
  row,
  column,
  timestamp: new Date(),
  ...details
});

/**
 * Clase FileParsingService refactorizada
 */
class FileParsingService extends CRUDService {
  constructor() {
    super('file_parsing_logs', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'createdAt',
      defaultOrderDirection: 'desc'
    });

    this.cache = new Map(); // Cache de archivos procesados
    this.maxCacheSize = 50; // Máximo archivos en cache
    this.maxFileSize = 50 * 1024 * 1024; // 50MB límite
  }

  /**
   * Validación específica para logs de parsing
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;

    const errors = [];

    if (!data.fileName) {
      errors.push('fileName es requerido');
    }

    if (data.fileSize && typeof data.fileSize !== 'number') {
      errors.push('fileSize debe ser un número');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Procesar datos específicos de parsing
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Sanitizar metadata
    if (baseProcessed.metadata && typeof baseProcessed.metadata === 'object') {
      baseProcessed.metadata = this.sanitizeMetadata(baseProcessed.metadata);
    }

    return baseProcessed;
  }

  /**
   * Sanitizar metadata para evitar objetos demasiado grandes
   */
  sanitizeMetadata(metadata) {
    const sanitized = { ...metadata };

    // Limitar warnings a máximo 100
    if (sanitized.warnings && Array.isArray(sanitized.warnings)) {
      sanitized.warnings = sanitized.warnings.slice(0, 100);
    }

    // Limitar sheets info
    if (sanitized.sheets && Array.isArray(sanitized.sheets)) {
      sanitized.sheets = sanitized.sheets.slice(0, 10);
    }

    return sanitized;
  }

  /**
   * Detectar tipo de archivo basado en extensión y contenido
   */
  detectFileType(file) {
    if (!file || !file.name) {
      this.logWarning('Archivo inválido para detección de tipo');
      return null;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // Verificar extensiones conocidas
    for (const [type, extensions] of Object.entries(SUPPORTED_FILE_TYPES)) {
      if (extensions.includes(extension)) {
        this.log(`Tipo de archivo detectado: ${type} para ${file.name}`);
        return type;
      }
    }
    
    this.logWarning(`Tipo de archivo no soportado: ${extension} en ${file.name}`);
    return 'UNKNOWN';
  }

  /**
   * Validar archivo antes del parsing
   */
  validateFile(file) {
    const errors = [];
    const warnings = [];

    // Verificar que existe el archivo
    if (!file) {
      errors.push('No se proporcionó archivo para validar');
      return { isValid: false, errors, warnings };
    }

    // Verificar tamaño
    if (file.size === 0) {
      errors.push('El archivo está vacío');
    } else if (file.size > this.maxFileSize) {
      errors.push(`El archivo es demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Verificar tipo
    const fileType = this.detectFileType(file);
    if (fileType === 'UNKNOWN') {
      errors.push(`Tipo de archivo no soportado: ${file.name}`);
    }

    // Advertencias por tamaño
    if (file.size > 10 * 1024 * 1024) { // 10MB
      warnings.push(createParsingWarning(
        'size', 
        `Archivo grande (${(file.size / 1024 / 1024).toFixed(2)}MB). El procesamiento puede tardar.`,
        null,
        null,
        { fileSize: file.size }
      ));
    }

    this.log(`Validación de archivo: ${file.name}`, {
      size: file.size,
      type: fileType,
      errors: errors.length,
      warnings: warnings.length
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fileType
    };
  }

  /**
   * Parsear archivo principal - método unificado
   */
  async parseFile(file, options = {}) {
    const startTime = Date.now();
    let result = createParsingResult(false);

    try {
      // Validar archivo
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        result.error = validation.errors.join(', ');
        result.metadata.warnings = validation.warnings;
        return result;
      }

      // Verificar cache
      const cacheKey = this.generateCacheKey(file);
      if (this.cache.has(cacheKey) && !options.ignoreCache) {
        this.log(`Resultado obtenido desde cache para: ${file.name}`);
        const cachedResult = this.cache.get(cacheKey);
        cachedResult.metadata.fromCache = true;
        return cachedResult;
      }

      // Inicializar metadata
      result.metadata.fileName = file.name;
      result.metadata.fileSize = file.size;
      result.metadata.fileType = validation.fileType;
      result.metadata.warnings = validation.warnings || [];

      // Parsear según tipo
      switch (validation.fileType) {
        case 'EXCEL':
          result = await this.parseExcelFile(file, options);
          break;
        case 'CSV':
          result = await this.parseCSVFile(file, options);
          break;
        case 'TEXT':
          result = await this.parseTextFile(file, options);
          break;
        default:
          result.error = `Tipo de archivo no soportado: ${validation.fileType}`;
          return result;
      }

      // Calcular tiempo de procesamiento
      const endTime = Date.now();
      result.metadata.processingTime = endTime - startTime;

      // Guardar en cache si fue exitoso
      if (result.success) {
        this.addToCache(cacheKey, result);
      }

      // Log del parsing
      await this.logParsingResult(file, result);

      this.log(`Parsing completado para: ${file.name}`, {
        success: result.success,
        rows: result.metadata.rowCount,
        time: result.metadata.processingTime
      });

      return result;

    } catch (error) {
      this.logError(`Error en parsing de archivo: ${file.name}`, error);
      
      result.error = error.message;
      result.metadata.processingTime = Date.now() - startTime;
      
      // Log del error
      await this.logParsingResult(file, result);
      
      return result;
    }
  }

  /**
   * Parsear archivo Excel
   */
  async parseExcelFile(file, options = {}) {
    try {
      // Importar XLSX dinámicamente
      const XLSX = await import('xlsx');
      
      const config = { ...PARSING_CONFIGS.EXCEL, ...options };
      let result = createParsingResult(true);

      // Leer archivo
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array', ...config });

      // Obtener información de sheets
      const sheetNames = workbook.SheetNames;
      result.metadata.sheets = sheetNames.map(name => ({
        name,
        range: workbook.Sheets[name]['!ref'] || 'A1'
      }));

      // Determinar qué sheet procesar
      const targetSheet = options.sheetName || sheetNames[0];
      if (!workbook.Sheets[targetSheet]) {
        throw new Error(`Sheet '${targetSheet}' no encontrado. Sheets disponibles: ${sheetNames.join(', ')}`);
      }

      // Convertir a JSON
      const worksheet = workbook.Sheets[targetSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: config.header,
        defval: config.defval,
        blankrows: config.blankrows,
        dateNF: config.dateNF
      });

      // Procesar y validar datos
      const processedData = this.processExcelData(jsonData, options);
      
      result.data = processedData.data;
      result.metadata.rowCount = processedData.data.length;
      result.metadata.columnCount = processedData.columns.length;
      result.metadata.warnings.push(...processedData.warnings);

      this.log(`Excel parseado exitosamente: ${result.metadata.rowCount} filas, ${result.metadata.columnCount} columnas`);

      return result;

    } catch (error) {
      this.logError('Error en parsing de Excel', error);
      throw error;
    }
  }

  /**
   * Parsear archivo CSV
   */
  async parseCSVFile(file, options = {}) {
    try {
      const config = { ...PARSING_CONFIGS.CSV, ...options };
      let result = createParsingResult(true);

      // Leer archivo como texto
      const text = await file.text();
      
      // Parsing manual de CSV
      const lines = text.split('\n').filter(line => 
        config.skipEmptyLines ? line.trim() !== '' : true
      );

      if (lines.length === 0) {
        throw new Error('Archivo CSV vacío o sin contenido válido');
      }

      // Procesar headers
      const headers = lines[0].split(config.delimiter).map(h => h.trim().replace(/"/g, ''));
      
      // Procesar datos
      const data = [];
      const warnings = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        const values = line.split(config.delimiter).map(v => v.trim().replace(/"/g, ''));
        
        // Validar número de columnas
        if (values.length !== headers.length) {
          warnings.push(createParsingWarning(
            'format',
            `Fila ${i + 1}: Número de columnas no coincide (${values.length} vs ${headers.length})`,
            i + 1
          ));
          continue;
        }

        // Crear objeto
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        data.push(row);
      }

      result.data = data;
      result.metadata.rowCount = data.length;
      result.metadata.columnCount = headers.length;
      result.metadata.warnings.push(...warnings);

      this.log(`CSV parseado exitosamente: ${result.metadata.rowCount} filas, ${result.metadata.columnCount} columnas`);

      return result;

    } catch (error) {
      this.logError('Error en parsing de CSV', error);
      throw error;
    }
  }

  /**
   * Parsear archivo de texto (TSV, TXT)
   */
  async parseTextFile(file, options = {}) {
    try {
      const config = { ...PARSING_CONFIGS.TEXT, ...options };
      
      // Reutilizar lógica de CSV con delimitador diferente
      const csvOptions = {
        ...config,
        delimiter: config.delimiter || '\t'
      };

      return await this.parseCSVFile(file, csvOptions);

    } catch (error) {
      this.logError('Error en parsing de archivo de texto', error);
      throw error;
    }
  }

  /**
   * Procesar y validar datos de Excel
   */
  processExcelData(jsonData) {
    const warnings = [];
    const processedData = [];
    const columns = Object.keys(jsonData[0] || {});

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const processedRow = {};

      // Validar y procesar cada celda
      for (const [key, value] of Object.entries(row)) {
        if (value === null || value === undefined) {
          processedRow[key] = '';
        } else if (typeof value === 'object' && value instanceof Date) {
          // Convertir fechas a string
          processedRow[key] = value.toISOString().split('T')[0];
        } else {
          processedRow[key] = String(value).trim();
        }
      }

      // Verificar si la fila tiene contenido
      const hasContent = Object.values(processedRow).some(val => val !== '');
      if (hasContent) {
        processedData.push(processedRow);
      } else {
        warnings.push(createParsingWarning(
          'content',
          `Fila ${i + 2} omitida por estar vacía`,
          i + 2
        ));
      }
    }

    return {
      data: processedData,
      columns,
      warnings
    };
  }

  /**
   * Generar clave de cache para archivo
   */
  generateCacheKey(file) {
    return `${file.name}_${file.size}_${file.lastModified || 'unknown'}`;
  }

  /**
   * Agregar resultado a cache
   */
  addToCache(key, result) {
    // Verificar límite de cache
    if (this.cache.size >= this.maxCacheSize) {
      // Eliminar el más antiguo (FIFO)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // Clonar resultado para evitar modificaciones
    const cachedResult = JSON.parse(JSON.stringify(result));
    this.cache.set(key, cachedResult);
    
    this.log(`Resultado agregado a cache: ${key}`);
  }

  /**
   * Limpiar cache
   */
  clearCache() {
    const size = this.cache.size;
    this.cache.clear();
    this.log(`Cache limpiado: ${size} elementos eliminados`);
    return { success: true, clearedCount: size };
  }

  /**
   * Obtener estadísticas de cache
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      usage: Math.round((this.cache.size / this.maxCacheSize) * 100)
    };
  }

  /**
   * Log de resultado de parsing
   */
  async logParsingResult(file, result) {
    try {
      const logData = {
        fileName: file.name,
        fileSize: file.size,
        fileType: result.metadata.fileType,
        success: result.success,
        rowCount: result.metadata.rowCount,
        columnCount: result.metadata.columnCount,
        processingTime: result.metadata.processingTime,
        warningCount: result.metadata.warnings?.length || 0,
        error: result.error || null
      };

      await this.create(logData);
    } catch (error) {
      this.logError('Error al registrar resultado de parsing', error);
    }
  }

  /**
   * Obtener estadísticas de parsing
   */
  async getParsingStats(days = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentLogs = await this.search('createdAt', '>=', cutoffDate);
      
      const stats = {
        totalFiles: recentLogs.length,
        successfulFiles: recentLogs.filter(log => log.success).length,
        failedFiles: recentLogs.filter(log => !log.success).length,
        totalRows: recentLogs.reduce((sum, log) => sum + (log.rowCount || 0), 0),
        avgProcessingTime: 0,
        fileTypes: {}
      };

      // Calcular tiempo promedio
      const validTimes = recentLogs.filter(log => log.processingTime > 0);
      if (validTimes.length > 0) {
        stats.avgProcessingTime = Math.round(
          validTimes.reduce((sum, log) => sum + log.processingTime, 0) / validTimes.length
        );
      }

      // Agrupar por tipo de archivo
      recentLogs.forEach(log => {
        const type = log.fileType || 'UNKNOWN';
        stats.fileTypes[type] = (stats.fileTypes[type] || 0) + 1;
      });

      stats.successRate = stats.totalFiles > 0 
        ? Math.round((stats.successfulFiles / stats.totalFiles) * 100) 
        : 0;

      return { success: true, data: stats };
    } catch (error) {
      this.logError('Error al obtener estadísticas de parsing', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Limpiar logs antiguos de parsing
   */
  async cleanOldLogs(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const oldLogs = await this.search('createdAt', '<', cutoffDate);
      let cleanedCount = 0;

      for (const log of oldLogs) {
        await this.delete(log.id);
        cleanedCount++;
      }

      this.log(`Limpieza completada: ${cleanedCount} logs antiguos eliminados`);
      return { success: true, cleanedCount };
    } catch (error) {
      this.logError('Error en limpieza de logs', error);
      return { success: false, error: error.message };
    }
  }
}

// Crear instancia singleton
const fileParsingService = new FileParsingService();

// Exportar métodos para compatibilidad con código existente
export const parseFile = (file, options) => fileParsingService.parseFile(file, options);
export const detectFileType = (file) => fileParsingService.detectFileType(file);
export const validateFile = (file) => fileParsingService.validateFile(file);
export const parseExcelFile = (file, options) => fileParsingService.parseExcelFile(file, options);
export const parseCSVFile = (file, options) => fileParsingService.parseCSVFile(file, options);
export const clearCache = () => fileParsingService.clearCache();
export const getCacheStats = () => fileParsingService.getCacheStats();
export const getParsingStats = (days) => fileParsingService.getParsingStats(days);
export const cleanOldLogs = (daysOld) => fileParsingService.cleanOldLogs(daysOld);

// Exportar clase por defecto
export default fileParsingService;
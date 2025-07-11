/**
 * migrationManager.js - Orquestador principal del sistema de migración
 * Coordina todos los pasos del wizard de migración de datos
 */

import fileParsingService from './fileParsingService';
import aliasService, { ALIAS_TYPES } from './aliasService';
import movementsService, { MOVEMENT_TYPES, MOVEMENT_STATUS } from './movementsService';
import vehiclesService from './vehiclesService';
import { createProduct } from './productsService';
import { OPERATIONAL_LOCATIONS } from '../constants/locations';
import { PRODUCT_TYPES } from '../constants/productTypes';
import { preciseAdd, preciseSubtract, preciseRound } from '../utils/calculations';

/**
 * Estados del wizard de migración
 */
export const MIGRATION_STEPS = {
  FILE_UPLOAD: 1,
  COLUMN_MAPPING: 2,
  VALUE_MAPPING: 3,
  VALIDATION: 4,
  EXECUTION: 5
};

/**
 * Campos requeridos para migración
 */
export const REQUIRED_FIELDS = {
  fecha: { required: true, type: 'date', description: 'Fecha del movimiento' },
  cantidad: { required: true, type: 'number', description: 'Cantidad de combustible' },
  vehiculo: { required: true, type: 'string', description: 'Vehículo o equipo' },
  producto: { required: true, type: 'string', description: 'Tipo de combustible/producto' }
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
  proveedor: { required: false, type: 'string', description: 'Proveedor (para entradas)' }
};

/**
 * Crear contexto de migración
 */
export const createMigrationContext = () => ({
  step: MIGRATION_STEPS.FILE_UPLOAD,
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
    failedRows: 0
  }
});

/**
 * Paso 1: Procesar archivo cargado
 * @param {File} file - Archivo a procesar
 * @param {object} options - Opciones de parsing
 * @returns {Promise<object>} - Resultado del parsing
 */
export const processFile = async (file, options = {}) => {
  try {
    console.log('🔄 Iniciando procesamiento de archivo:', file.name);

    const parsingResult = await fileParsingService.parseFile(file, options);
    
    if (!parsingResult.success) {
      return {
        success: false,
        error: parsingResult.error,
        data: null
      };
    }

    const preview = fileParsingService.getDataPreview(parsingResult.data, 20);
    const columnSuggestions = fileParsingService.suggestColumnMapping(preview.headers);

    return {
      success: true,
      data: parsingResult.data,
      metadata: parsingResult.metadata,
      preview: preview,
      columnSuggestions: columnSuggestions,
      error: null
    };

  } catch (error) {
    console.error('❌ Error procesando archivo:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Paso 2: Configurar mapeo de columnas
 * @param {array} headers - Headers del archivo
 * @param {object} userMappings - Mapeos definidos por el usuario
 * @returns {object} - Configuración de mapeo validada
 */
export const configureColumnMapping = (headers, userMappings) => {
  try {
    const mapping = {};
    const unmappedColumns = [];
    const missingRequiredFields = [];

    // Validar mapeos del usuario
    Object.entries(userMappings).forEach(([systemField, fileColumn]) => {
      if (headers.includes(fileColumn)) {
        mapping[systemField] = fileColumn;
      }
    });

    // Verificar campos requeridos
    Object.keys(REQUIRED_FIELDS).forEach(field => {
      if (!mapping[field]) {
        missingRequiredFields.push(field);
      }
    });

    // Identificar columnas no mapeadas
    headers.forEach(header => {
      if (!Object.values(mapping).includes(header)) {
        unmappedColumns.push(header);
      }
    });

    const isValid = missingRequiredFields.length === 0;

    return {
      success: isValid,
      mapping: mapping,
      unmappedColumns: unmappedColumns,
      missingRequiredFields: missingRequiredFields,
      warnings: unmappedColumns.length > 0 
        ? [`${unmappedColumns.length} columnas no fueron mapeadas`] 
        : []
    };

  } catch (error) {
    console.error('❌ Error configurando mapeo de columnas:', error);
    return {
      success: false,
      error: error.message,
      mapping: {}
    };
  }
};

/**
 * Paso 3: Configurar mapeo de valores (alias)
 * @param {array} data - Datos del archivo
 * @param {object} columnMapping - Mapeo de columnas
 * @returns {Promise<object>} - Configuración de mapeo de valores
 */
export const configureValueMapping = async (data, columnMapping) => {
  try {
    console.log('🔄 Configurando mapeo de valores...');

    const valueMapping = {};
    const suggestions = {};

    // Obtener valores únicos para campos clave
    const vehicleColumn = columnMapping.vehiculo;
    const productColumn = columnMapping.producto;

    if (vehicleColumn) {
      const uniqueVehicles = [...new Set(data.map(row => row[vehicleColumn]).filter(Boolean))];
      const vehicleSuggestions = await aliasService.getSuggestedMappings(
        ALIAS_TYPES.VEHICLE, 
        uniqueVehicles
      );
      
      valueMapping.vehiculos = {};
      suggestions.vehiculos = vehicleSuggestions;
    }

    if (productColumn) {
      const uniqueProducts = [...new Set(data.map(row => row[productColumn]).filter(Boolean))];
      const productSuggestions = await aliasService.getSuggestedMappings(
        ALIAS_TYPES.PRODUCT, 
        uniqueProducts
      );
      
      valueMapping.productos = {};
      suggestions.productos = productSuggestions;
    }

    // Mapear ubicaciones si existe la columna
    const locationColumn = columnMapping.ubicacion;
    if (locationColumn) {
      const uniqueLocations = [...new Set(data.map(row => row[locationColumn]).filter(Boolean))];
      const locationSuggestions = await aliasService.getSuggestedMappings(
        ALIAS_TYPES.LOCATION, 
        uniqueLocations
      );
      
      valueMapping.ubicaciones = {};
      suggestions.ubicaciones = locationSuggestions;
    }

    return {
      success: true,
      valueMapping: valueMapping,
      suggestions: suggestions,
      error: null
    };

  } catch (error) {
    console.error('❌ Error configurando mapeo de valores:', error);
    return {
      success: false,
      error: error.message,
      valueMapping: {},
      suggestions: {}
    };
  }
};

/**
 * Paso 4: Validar datos (Dry Run)
 * @param {array} data - Datos del archivo
 * @param {object} columnMapping - Mapeo de columnas
 * @param {object} valueMapping - Mapeo de valores
 * @returns {Promise<object>} - Resultado de validación
 */
export const validateData = async (data, columnMapping, valueMapping) => {
  try {
    console.log('🔄 Iniciando validación de datos (Dry Run)...');

    const validationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      statistics: {
        totalRows: data.length,
        validRows: 0,
        invalidRows: 0,
        newVehicles: new Set(),
        newProducts: new Set(),
        dateRange: { min: null, max: null }
      },
      preview: []
    };

    const processedData = [];

    // Validar cada fila
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 1;
      const validationRow = {
        rowNumber: rowNumber,
        original: row,
        mapped: {},
        errors: [],
        warnings: []
      };

      try {
        // Mapear y validar campos obligatorios
        for (const [systemField, fieldConfig] of Object.entries(REQUIRED_FIELDS)) {
          const fileColumn = columnMapping[systemField];
          if (!fileColumn) {
            validationRow.errors.push(`Campo requerido '${systemField}' no mapeado`);
            continue;
          }

          const value = row[fileColumn];
          const validatedValue = validateField(value, fieldConfig, systemField, rowNumber);
          
          if (validatedValue.error) {
            validationRow.errors.push(validatedValue.error);
          } else {
            validationRow.mapped[systemField] = validatedValue.value;
          }
        }

        // Mapear y validar campos opcionales
        for (const [systemField, fieldConfig] of Object.entries(OPTIONAL_FIELDS)) {
          const fileColumn = columnMapping[systemField];
          if (fileColumn && row[fileColumn] !== undefined && row[fileColumn] !== '') {
            const value = row[fileColumn];
            const validatedValue = validateField(value, fieldConfig, systemField, rowNumber);
            
            if (validatedValue.error) {
              validationRow.warnings.push(validatedValue.error);
            } else {
              validationRow.mapped[systemField] = validatedValue.value;
            }
          }
        }

        // Resolver alias de vehículos
        if (validationRow.mapped.vehiculo) {
          const originalVehicle = validationRow.mapped.vehiculo;
          const resolvedVehicle = valueMapping.vehiculos?.[originalVehicle] || 
                                await aliasService.resolveAlias(ALIAS_TYPES.VEHICLE, originalVehicle);
          
          if (resolvedVehicle) {
            validationRow.mapped.vehiculoId = resolvedVehicle;
          } else {
            validationResult.statistics.newVehicles.add(originalVehicle);
            validationRow.warnings.push(`Vehículo '${originalVehicle}' no existe, será creado`);
            validationRow.mapped.vehiculoId = generateVehicleId(originalVehicle);
          }
        }

        // Resolver alias de productos
        if (validationRow.mapped.producto) {
          const originalProduct = validationRow.mapped.producto;
          const resolvedProduct = valueMapping.productos?.[originalProduct] || 
                                await aliasService.resolveAlias(ALIAS_TYPES.PRODUCT, originalProduct);
          
          if (resolvedProduct) {
            validationRow.mapped.productoId = resolvedProduct;
          } else {
            validationResult.statistics.newProducts.add(originalProduct);
            validationRow.warnings.push(`Producto '${originalProduct}' no existe, será creado`);
            validationRow.mapped.productoId = mapProductType(originalProduct);
          }
        }

        // Estadísticas de fechas
        if (validationRow.mapped.fecha) {
          const fecha = validationRow.mapped.fecha;
          if (!validationResult.statistics.dateRange.min || fecha < validationResult.statistics.dateRange.min) {
            validationResult.statistics.dateRange.min = fecha;
          }
          if (!validationResult.statistics.dateRange.max || fecha > validationResult.statistics.dateRange.max) {
            validationResult.statistics.dateRange.max = fecha;
          }
        }

        // Determinar si la fila es válida
        if (validationRow.errors.length === 0) {
          validationResult.statistics.validRows++;
        } else {
          validationResult.statistics.invalidRows++;
          validationResult.isValid = false;
        }

        validationResult.errors.push(...validationRow.errors);
        validationResult.warnings.push(...validationRow.warnings);
        
        processedData.push(validationRow);

      } catch (error) {
        validationRow.errors.push(`Error procesando fila: ${error.message}`);
        validationResult.statistics.invalidRows++;
        validationResult.isValid = false;
        processedData.push(validationRow);
      }
    }

    // Crear preview con primeras 10 filas
    validationResult.preview = processedData.slice(0, 10);
    validationResult.processedData = processedData;

    // Convertir Sets a Arrays para serialización
    validationResult.statistics.newVehicles = Array.from(validationResult.statistics.newVehicles);
    validationResult.statistics.newProducts = Array.from(validationResult.statistics.newProducts);

    console.log(`✅ Validación completada: ${validationResult.statistics.validRows}/${validationResult.statistics.totalRows} filas válidas`);

    return {
      success: true,
      validationResult: validationResult,
      error: null
    };

  } catch (error) {
    console.error('❌ Error en validación:', error);
    return {
      success: false,
      error: error.message,
      validationResult: null
    };
  }
};

/**
 * Paso 5: Ejecutar migración
 * @param {object} validationResult - Resultado de validación
 * @param {object} valueMapping - Mapeo de valores
 * @param {function} progressCallback - Callback para reporte de progreso
 * @returns {Promise<object>} - Resultado de ejecución
 */
export const executeMigration = async (validationResult, valueMapping, progressCallback = null) => {
  try {
    console.log('🚀 Iniciando ejecución de migración...');

    const executionResult = {
      success: true,
      statistics: {
        totalRows: validationResult.statistics.totalRows,
        processedRows: 0,
        successfulRows: 0,
        failedRows: 0,
        newVehiclesCreated: 0,
        newProductsCreated: 0,
        movementsCreated: 0
      },
      errors: [],
      warnings: [],
      migrationId: `migration_${Date.now()}`,
      startedAt: new Date()
    };

    // Guardar alias antes de comenzar
    if (Object.keys(valueMapping.vehiculos || {}).length > 0) {
      await aliasService.saveAliases(ALIAS_TYPES.VEHICLE, valueMapping.vehiculos);
    }
    if (Object.keys(valueMapping.productos || {}).length > 0) {
      await aliasService.saveAliases(ALIAS_TYPES.PRODUCT, valueMapping.productos);
    }

    // Crear vehículos nuevos
    for (const vehicleName of validationResult.statistics.newVehicles) {
      try {
        const vehicleId = generateVehicleId(vehicleName);
        await vehiclesService.createVehicle({
          vehicleId: vehicleId,
          name: vehicleName,
          type: inferVehicleType(vehicleName),
          fuelType: 'GASOLINA', // Default basado en datos del sheets
          status: 'activo',
          hasHourMeter: isTrackedVehicle(vehicleName),
          currentHours: 0,
          description: `Creado automáticamente durante migración ${executionResult.migrationId}`
        });
        executionResult.statistics.newVehiclesCreated++;
        console.log(`✅ Vehículo creado: ${vehicleId} - ${vehicleName}`);
      } catch (error) {
        console.error(`❌ Error creando vehículo ${vehicleName}:`, error);
        executionResult.warnings.push(`No se pudo crear vehículo '${vehicleName}': ${error.message}`);
      }
    }

    // Crear productos nuevos
    for (const productName of validationResult.statistics.newProducts) {
      try {
        const productType = mapProductType(productName);
        if (productType && !Object.values(PRODUCT_TYPES).includes(productType)) {
          await createProduct({
            name: productType,
            displayName: productName,
            category: 'Combustible',
            unit: 'gal',
            defaultPrice: 0,
            isActive: true,
            description: `Creado automáticamente durante migración ${executionResult.migrationId}`
          });
          executionResult.statistics.newProductsCreated++;
          console.log(`✅ Producto creado: ${productName}`);
        }
      } catch (error) {
        console.error(`❌ Error creando producto ${productName}:`, error);
        executionResult.warnings.push(`No se pudo crear producto '${productName}': ${error.message}`);
      }
    }

    // Procesar movimientos en lotes
    const BATCH_SIZE = 100;
    const validRows = validationResult.processedData.filter(row => row.errors.length === 0);
    
    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batch = validRows.slice(i, i + BATCH_SIZE);
      
      for (const row of batch) {
        try {
          const movementData = createMovementFromRow(row.mapped);
          await movementsService.createMovement(movementData);
          
          executionResult.statistics.successfulRows++;
          executionResult.statistics.movementsCreated++;

        } catch (error) {
          console.error(`❌ Error creando movimiento fila ${row.rowNumber}:`, error);
          executionResult.errors.push(`Fila ${row.rowNumber}: ${error.message}`);
          executionResult.statistics.failedRows++;
        }

        executionResult.statistics.processedRows++;

        // Reportar progreso
        if (progressCallback) {
          const progress = (executionResult.statistics.processedRows / validRows.length) * 100;
          progressCallback({
            progress: Math.round(progress),
            processedRows: executionResult.statistics.processedRows,
            totalRows: validRows.length,
            currentStep: `Procesando lote ${Math.floor(i / BATCH_SIZE) + 1}...`
          });
        }
      }
    }

    executionResult.completedAt = new Date();
    executionResult.success = executionResult.statistics.failedRows < (validRows.length * 0.1); // Tolerar hasta 10% de fallos

    console.log(`🎉 Migración completada: ${executionResult.statistics.successfulRows}/${validRows.length} movimientos creados`);

    return {
      success: true,
      executionResult: executionResult,
      error: null
    };

  } catch (error) {
    console.error('❌ Error en ejecución de migración:', error);
    return {
      success: false,
      error: error.message,
      executionResult: null
    };
  }
};

// ============ FUNCIONES AUXILIARES ============

/**
 * Validar un campo individual
 */
const validateField = (value, fieldConfig, fieldName, rowNumber) => {
  if (value === null || value === undefined || value === '') {
    if (fieldConfig.required) {
      return { error: `Campo '${fieldName}' requerido en fila ${rowNumber}` };
    }
    return { value: null };
  }

  switch (fieldConfig.type) {
    case 'date':
      const date = parseDate(value);
      if (!date) {
        return { error: `Fecha inválida '${value}' en fila ${rowNumber}` };
      }
      return { value: date };

    case 'number':
      const number = parseFloat(value);
      if (isNaN(number) || number < 0) {
        return { error: `Número inválido '${value}' en fila ${rowNumber}` };
      }
      return { value: number };

    case 'string':
      return { value: value.toString().trim() };

    default:
      return { value: value };
  }
};

/**
 * Parsear fecha de diferentes formatos
 */
const parseDate = (dateValue) => {
  if (dateValue instanceof Date) {
    return dateValue;
  }

  if (typeof dateValue === 'number') {
    // Excel timestamp
    const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
    return isValidDate(excelDate) ? excelDate : null;
  }

  const dateString = dateValue.toString().trim();
  
  // Formatos comunes
  const formats = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      let day, month, year;
      
      if (format.source.includes('YYYY')) {
        if (format.source.startsWith('^(\\d{4})')) {
          [, year, month, day] = match;
        } else {
          [, day, month, year] = match;
        }
      }
      
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return isValidDate(date) ? date : null;
    }
  }

  // Fallback: intentar parsing nativo
  const nativeDate = new Date(dateString);
  return isValidDate(nativeDate) ? nativeDate : null;
};

/**
 * Verificar si una fecha es válida
 */
const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date.getTime()) && date.getFullYear() > 1900;
};

/**
 * Generar ID de vehículo basado en el nombre
 */
const generateVehicleId = (vehicleName) => {
  const normalized = vehicleName.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Patrones conocidos
  if (normalized.includes('TR') && normalized.match(/\d/)) {
    const number = normalized.match(/\d+/)?.[0];
    return `TR-${number}`;
  }
  if (normalized.includes('CAMIONETA')) {
    if (normalized.includes('AMARILLA')) return 'CA-001';
    if (normalized.includes('BURBUJA')) return 'CB-001';
    return 'CM-001';
  }
  if (normalized.includes('CARRO')) return 'CR-001';
  if (normalized.includes('VOLQUETA')) return 'VQ-001';
  if (normalized.includes('MOTO')) return `MT-${Math.floor(Math.random() * 100)}`;
  
  // Fallback: usar primeras letras + número aleatorio
  const prefix = normalized.substring(0, 2) || 'EQ';
  return `${prefix}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Inferir tipo de vehículo basado en el nombre
 */
const inferVehicleType = (vehicleName) => {
  const name = vehicleName.toLowerCase();
  
  if (name.includes('tractor') || name.includes('tr-')) return 'tractor';
  if (name.includes('camioneta')) return 'pickup_truck';
  if (name.includes('carro')) return 'car';
  if (name.includes('volqueta')) return 'log_truck';
  if (name.includes('moto')) return 'motorcycle';
  if (name.includes('bomba')) return 'water_pump';
  if (name.includes('planta')) return 'generator';
  if (name.includes('fumigadora')) return 'fumigadora';
  if (name.includes('guadaña')) return 'guadana';
  if (name.includes('hidrolavadora')) return 'hidrolavadora';
  
  return 'otros';
};

/**
 * Verificar si un vehículo debe tener horómetro
 */
const isTrackedVehicle = (vehicleName) => {
  const name = vehicleName.toLowerCase();
  return name.includes('tr-') || name.includes('tractor');
};

/**
 * Mapear producto basado en nombre
 */
const mapProductType = (productName) => {
  const name = productName.toLowerCase().trim();
  
  if (name.includes('gasolina')) return PRODUCT_TYPES.GASOLINA;
  if (name.includes('acpm')) return PRODUCT_TYPES.ACPM;
  if (name.includes('diesel')) return PRODUCT_TYPES.ACPM;
  
  return PRODUCT_TYPES.GASOLINA; // Default basado en datos del sheets
};

/**
 * Crear datos de movimiento desde fila procesada
 */
const createMovementFromRow = (mappedRow) => {
  return {
    type: MOVEMENT_TYPES.SALIDA, // Todos los datos del sheets son consumos
    fuelType: mappedRow.productoId || PRODUCT_TYPES.GASOLINA,
    quantity: mappedRow.cantidad,
    unitPrice: mappedRow.precio || 0,
    vehicleId: mappedRow.vehiculoId,
    location: mappedRow.ubicacion || 'principal',
    destinationLocation: mappedRow.destino,
    currentHours: mappedRow.horometro,
    description: mappedRow.descripcion || `Migrado desde archivo histórico`,
    effectiveDate: mappedRow.fecha,
    reference: `MIGRACION_${Date.now()}`,
    status: MOVEMENT_STATUS.COMPLETADO
  };
};

export default {
  createMigrationContext,
  processFile,
  configureColumnMapping,
  configureValueMapping,
  validateData,
  executeMigration,
  MIGRATION_STEPS,
  REQUIRED_FIELDS,
  OPTIONAL_FIELDS
};
/**
 * migrationValidator.js - Validador exhaustivo para archivos de migración
 * Implementa todas las reglas de validación específicas del dominio
 */

// import { parseFileDate } from '../utils/dataMapper';

/**
 * Validador principal para archivos de migración
 */
export class MigrationValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      duplicates: 0
    };
  }

  /**
   * Validar archivo completo
   * @param {Object} fileData - Datos parseados del archivo
   * @returns {Object} Resultado de validación
   */
  validateFileData(fileData) {
    this.reset();
    
    // Validar estructura básica
    this.validateBasicStructure(fileData);
    
    // Validar contenido de movimientos
    if (fileData.movements && fileData.movements.length > 0) {
      this.validateMovements(fileData.movements);
    }
    
    // Validar vehículos si existen
    if (fileData.vehicles && fileData.vehicles.length > 0) {
      this.validateVehicles(fileData.vehicles);
    }
    
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      stats: this.stats
    };
  }

  /**
   * Reiniciar estado del validador
   */
  reset() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      duplicates: 0
    };
  }

  /**
   * Validar estructura básica del archivo
   */
  validateBasicStructure(fileData) {
    // Verificar que existe hoja de movimientos
    if (!fileData.movements || !Array.isArray(fileData.movements)) {
      this.errors.push('❌ El archivo debe contener una hoja llamada "Movimientos" o "movements"');
      return;
    }

    if (fileData.movements.length === 0) {
      this.errors.push('❌ La hoja de movimientos no puede estar vacía');
      return;
    }

    // Verificar columnas requeridas
    const requiredColumns = ['fecha', 'codigo', 'articulo', 'usuario', 'cantidad'];
    const firstRow = fileData.movements[0];
    const availableColumns = Object.keys(firstRow);
    
    const missingColumns = requiredColumns.filter(col => !availableColumns.includes(col));
    if (missingColumns.length > 0) {
      this.errors.push(`❌ Faltan columnas obligatorias: ${missingColumns.join(', ')}`);
    }

    // Verificar que no hay columnas con nombres extraños
    const unexpectedColumns = availableColumns.filter(col => 
      !['fecha', 'codigo', 'articulo', 'usuario', 'cantidad', 'horometro', 'descripcion'].includes(col)
    );
    
    if (unexpectedColumns.length > 0) {
      this.warnings.push(`⚠️ Columnas no reconocidas encontradas: ${unexpectedColumns.join(', ')}`);
    }
  }

  /**
   * Validar movimientos individuales
   */
  validateMovements(movements) {
    this.stats.totalRows = movements.length;
    const seenMovements = new Map();

    movements.forEach((movement, index) => {
      const rowNumber = index + 2; // +2 porque fila 1 son headers
      let hasErrors = false;

      // Validar fecha
      const dateValidation = this.validateDate(movement.fecha, rowNumber);
      if (!dateValidation.isValid) {
        this.errors.push(dateValidation.error);
        hasErrors = true;
      }

      // Validar código de producto
      const codeValidation = this.validateProductCode(movement.codigo, rowNumber);
      if (!codeValidation.isValid) {
        this.errors.push(codeValidation.error);
        hasErrors = true;
      }

      // Validar artículo
      if (!movement.articulo || movement.articulo.toString().trim() === '') {
        this.errors.push(`❌ Fila ${rowNumber}: El artículo no puede estar vacío`);
        hasErrors = true;
      }

      // Validar usuario/vehículo
      if (!movement.usuario || movement.usuario.toString().trim() === '') {
        this.errors.push(`❌ Fila ${rowNumber}: El usuario/vehículo no puede estar vacío`);
        hasErrors = true;
      }

      // Validar cantidad
      const quantityValidation = this.validateQuantity(movement.cantidad, rowNumber);
      if (!quantityValidation.isValid) {
        this.errors.push(quantityValidation.error);
        hasErrors = true;
      }

      // Validar horómetro si existe
      if (movement.horometro && movement.horometro !== '') {
        const horometerValidation = this.validateHorometer(movement.horometro, rowNumber);
        if (!horometerValidation.isValid) {
          this.warnings.push(horometerValidation.error);
        }
      }

      // Verificar duplicados
      const movementKey = `${movement.fecha}_${movement.usuario}_${movement.cantidad}`;
      if (seenMovements.has(movementKey)) {
        this.warnings.push(`⚠️ Posible duplicado en fila ${rowNumber}: mismo vehículo, fecha y cantidad que fila ${seenMovements.get(movementKey)}`);
        this.stats.duplicates++;
      } else {
        seenMovements.set(movementKey, rowNumber);
      }

      // Actualizar estadísticas
      if (hasErrors) {
        this.stats.invalidRows++;
      } else {
        this.stats.validRows++;
      }
    });
  }

  /**
   * Validar fecha individual
   */
  validateDate(dateValue, rowNumber) {
    if (!dateValue || dateValue.toString().trim() === '') {
      return {
        isValid: false,
        error: `❌ Fila ${rowNumber}: La fecha es obligatoria`
      };
    }

    const dateString = dateValue.toString().trim();
    
    // Verificar formato DD/MM/YYYY
    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateString.match(datePattern);
    
    if (!match) {
      return {
        isValid: false,
        error: `❌ Fila ${rowNumber}: Fecha "${dateString}" debe estar en formato DD/MM/YYYY (ejemplo: 15/01/2024)`
      };
    }

    const [, day, month, year] = match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    // Verificar que la fecha es válida
    if (date.getDate() != day || date.getMonth() != month - 1 || date.getFullYear() != year) {
      return {
        isValid: false,
        error: `❌ Fila ${rowNumber}: "${dateString}" no es una fecha válida`
      };
    }

    // Verificar rango razonable
    const currentYear = new Date().getFullYear();
    if (parseInt(year) < 2020 || parseInt(year) > currentYear + 1) {
      return {
        isValid: false,
        error: `❌ Fila ${rowNumber}: Año ${year} fuera del rango permitido (2020-${currentYear + 1})`
      };
    }

    return { isValid: true };
  }

  /**
   * Validar código de producto
   */
  validateProductCode(code, rowNumber) {
    if (!code || code.toString().trim() === '') {
      return {
        isValid: false,
        error: `❌ Fila ${rowNumber}: El código de producto es obligatorio`
      };
    }

    const validCodes = ['A', 'G', 'AO', 'AM4T', 'GA', 'VA', 'LO', 'MA', '15W40'];
    const codeStr = code.toString().trim().toUpperCase();
    
    if (!validCodes.includes(codeStr)) {
      return {
        isValid: false,
        error: `❌ Fila ${rowNumber}: Código "${code}" no válido. Códigos permitidos: ${validCodes.join(', ')}`
      };
    }

    return { isValid: true };
  }

  /**
   * Validar cantidad
   */
  validateQuantity(quantity, rowNumber) {
    if (!quantity && quantity !== 0) {
      return {
        isValid: false,
        error: `❌ Fila ${rowNumber}: La cantidad es obligatoria`
      };
    }

    const quantityNum = parseFloat(quantity);
    
    if (isNaN(quantityNum)) {
      return {
        isValid: false,
        error: `❌ Fila ${rowNumber}: "${quantity}" no es un número válido. Use punto (.) como separador decimal`
      };
    }

    if (quantityNum <= 0) {
      return {
        isValid: false,
        error: `❌ Fila ${rowNumber}: La cantidad debe ser mayor a cero (valor: ${quantity})`
      };
    }

    if (quantityNum > 1000) {
      this.warnings.push(`⚠️ Fila ${rowNumber}: Cantidad ${quantity} galones es muy alta. Verifique que sea correcta`);
    }

    return { isValid: true };
  }

  /**
   * Validar horómetro
   */
  validateHorometer(horometer, rowNumber) {
    const horometerNum = parseFloat(horometer);
    
    if (isNaN(horometerNum)) {
      return {
        isValid: false,
        error: `⚠️ Fila ${rowNumber}: Horómetro "${horometer}" no es un número válido`
      };
    }

    if (horometerNum < 0) {
      return {
        isValid: false,
        error: `⚠️ Fila ${rowNumber}: El horómetro no puede ser negativo (valor: ${horometer})`
      };
    }

    if (horometerNum > 50000) {
      return {
        isValid: false,
        error: `⚠️ Fila ${rowNumber}: Horómetro ${horometer} horas parece demasiado alto`
      };
    }

    return { isValid: true };
  }

  /**
   * Validar vehículos (si existe la hoja)
   */
  validateVehicles(vehicles) {
    const seenCodes = new Set();
    
    vehicles.forEach((vehicle, index) => {
      const rowNumber = index + 2;
      
      // Validar código único
      if (!vehicle.codigo || vehicle.codigo.toString().trim() === '') {
        this.errors.push(`❌ Vehículos fila ${rowNumber}: El código es obligatorio`);
      } else {
        const code = vehicle.codigo.toString().trim();
        if (seenCodes.has(code)) {
          this.errors.push(`❌ Vehículos fila ${rowNumber}: Código "${code}" duplicado`);
        } else {
          seenCodes.add(code);
        }
      }

      // Validar nombre
      if (!vehicle.nombre || vehicle.nombre.toString().trim() === '') {
        this.errors.push(`❌ Vehículos fila ${rowNumber}: El nombre es obligatorio`);
      }

      // Validar tipo
      if (!vehicle.tipo || vehicle.tipo.toString().trim() === '') {
        this.errors.push(`❌ Vehículos fila ${rowNumber}: El tipo es obligatorio`);
      }

      // Validar combustible
      const validFuels = ['Diesel', 'Gasolina'];
      if (vehicle.combustible && !validFuels.includes(vehicle.combustible)) {
        this.warnings.push(`⚠️ Vehículos fila ${rowNumber}: Combustible "${vehicle.combustible}" no estándar. Recomendados: ${validFuels.join(', ')}`);
      }
    });
  }
}

/**
 * Función helper para validación rápida
 */
export const validateMigrationFile = (fileData) => {
  const validator = new MigrationValidator();
  return validator.validateFileData(fileData);
};

export default MigrationValidator;

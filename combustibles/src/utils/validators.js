/**
 * Sistema centralizado de validaciones para formularios
 * Incluye validadores comunes y específicos del dominio
 */

// Validadores básicos
export const validators = {
  // Validación requerida
  required: (value, message = 'Campo requerido') => {
    return !value || (typeof value === 'string' && value.trim() === '') ? message : null;
  },

  // Validación de email
  email: (value, message = 'Email inválido') => {
    if (!value) return null; // Email opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? message : null;
  },

  // Validación de longitud mínima
  minLength: (minLen, message) => (value) => {
    if (!value) return null;
    return value.length < minLen ? (message || `Mínimo ${minLen} caracteres`) : null;
  },

  // Validación de longitud máxima
  maxLength: (maxLen, message) => (value) => {
    if (!value) return null;
    return value.length > maxLen ? (message || `Máximo ${maxLen} caracteres`) : null;
  },

  // Validación numérica
  number: (value, message = 'Debe ser un número válido') => {
    if (!value) return null;
    return isNaN(Number(value)) ? message : null;
  },

  // Validación número positivo
  positive: (value, message = 'Debe ser un número positivo') => {
    if (!value) return null;
    const num = Number(value);
    return isNaN(num) || num <= 0 ? message : null;
  },

  // Validación número no negativo
  nonNegative: (value, message = 'No puede ser negativo') => {
    if (!value) return null;
    const num = Number(value);
    return isNaN(num) || num < 0 ? message : null;
  },

  // Validación de rango numérico
  range: (min, max, message) => (value) => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) return 'Debe ser un número válido';
    return (num < min || num > max) ? 
      (message || `Debe estar entre ${min} y ${max}`) : null;
  },

  // Validación de fecha
  date: (value, message = 'Fecha inválida') => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? message : null;
  },

  // Validación fecha futura
  futureDate: (value, message = 'La fecha debe ser futura') => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today ? message : null;
  },

  // Validación fecha pasada
  pastDate: (value, message = 'La fecha debe ser pasada') => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    return date > today ? message : null;
  },

  // VALIDACIONES ESPECÍFICAS DEL DOMINIO

  // Validación placa de vehículo (formato colombiano)
  vehiclePlate: (value, message = 'Formato de placa inválido (ej: ABC-123)') => {
    if (!value) return null;
    const plateRegex = /^[A-Z]{3}-\d{3}$/;
    return !plateRegex.test(value.toUpperCase()) ? message : null;
  },

  // Validación código de vehículo
  vehicleCode: (value, message = 'Código de vehículo inválido') => {
    if (!value) return null;
    const codeRegex = /^[A-Z0-9]{3,10}$/;
    return !codeRegex.test(value.toUpperCase()) ? message : null;
  },

  // Validación NIT colombiano
  nit: (value, message = 'NIT inválido') => {
    if (!value) return null;
    const nitRegex = /^\d{8,10}-\d$/;
    return !nitRegex.test(value) ? message : null;
  },

  // Validación número de teléfono colombiano
  colombianPhone: (value, message = 'Número de teléfono inválido') => {
    if (!value) return null;
    const phoneRegex = /^(\+57|57)?[0-9]{10}$/;
    return !phoneRegex.test(value.replace(/\s/g, '')) ? message : null;
  },

  // Validación código postal colombiano
  colombianPostalCode: (value, message = 'Código postal inválido') => {
    if (!value) return null;
    const postalRegex = /^\d{6}$/;
    return !postalRegex.test(value) ? message : null;
  },

  // Validación tipo de combustible
  fuelType: (value, validTypes = [], message = 'Tipo de combustible inválido') => {
    if (!value) return null;
    return !validTypes.includes(value) ? message : null;
  },

  // Validación capacidad de tanque
  fuelCapacity: (value, message = 'Capacidad debe ser mayor a 0') => {
    if (!value) return null;
    const capacity = Number(value);
    return isNaN(capacity) || capacity <= 0 ? message : null;
  },

  // Validación stock vs capacidad
  stockCapacityCheck: (currentStock, maxCapacity, message = 'Stock no puede exceder la capacidad') => {
    if (!currentStock || !maxCapacity) return null;
    const stock = Number(currentStock);
    const capacity = Number(maxCapacity);
    return stock > capacity ? message : null;
  },

  // Validación umbral vs capacidad
  thresholdCapacityCheck: (threshold, maxCapacity, message = 'Umbral no puede exceder la capacidad') => {
    if (!threshold || !maxCapacity) return null;
    const thresh = Number(threshold);
    const capacity = Number(maxCapacity);
    return thresh > capacity ? message : null;
  },

  // Validación precio unitario
  unitPrice: (value, message = 'Precio debe ser mayor a 0') => {
    if (!value) return null;
    const price = Number(value);
    return isNaN(price) || price < 0 ? message : null;
  },

  // Validación horas de horómetro
  hours: (value, message = 'Horas deben ser un número positivo') => {
    if (!value) return null;
    const hours = Number(value);
    return isNaN(hours) || hours < 0 ? message : null;
  },

  // Validación potencia de motor
  enginePower: (value, message = 'Potencia debe ser mayor a 0 HP') => {
    if (!value) return null;
    const power = Number(value);
    return isNaN(power) || power <= 0 ? message : null;
  },

  // Validación consumo por hora
  consumptionRate: (value, message = 'Consumo debe ser mayor a 0') => {
    if (!value) return null;
    const rate = Number(value);
    return isNaN(rate) || rate <= 0 ? message : null;
  },

  // Validación rating (1-5 estrellas)
  rating: (value, message = 'Rating debe estar entre 1 y 5') => {
    if (!value) return null;
    const rating = Number(value);
    return isNaN(rating) || rating < 1 || rating > 5 ? message : null;
  }
};

// Función para ejecutar múltiples validaciones en un campo
export const validateField = (value, validationRules) => {
  if (!validationRules || validationRules.length === 0) return null;

  for (const rule of validationRules) {
    const error = typeof rule === 'function' ? rule(value) : rule;
    if (error) return error;
  }
  return null;
};

// Validar objeto completo según schema
export const validateForm = (data, validationSchema) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(validationSchema)) {
    const error = validateField(data[field], rules);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Validaciones cross-field (validaciones que requieren múltiples campos)
export const crossFieldValidators = {
  // Validar que stock actual no exceda capacidad máxima
  stockVsCapacity: (formData) => {
    const errors = {};
    const { currentStock, maxCapacity } = formData;
    
    if (currentStock && maxCapacity) {
      const stock = Number(currentStock);
      const capacity = Number(maxCapacity);
      
      if (stock > capacity) {
        errors.currentStock = 'Stock actual no puede ser mayor a la capacidad máxima';
      }
    }
    
    return errors;
  },

  // Validar que umbral mínimo no exceda capacidad máxima
  thresholdVsCapacity: (formData) => {
    const errors = {};
    const { minThreshold, maxCapacity } = formData;
    
    if (minThreshold && maxCapacity) {
      const threshold = Number(minThreshold);
      const capacity = Number(maxCapacity);
      
      if (threshold > capacity) {
        errors.minThreshold = 'Umbral mínimo no puede ser mayor a la capacidad máxima';
      }
    }
    
    return errors;
  },

  // Validar fechas de mantenimiento
  maintenanceDates: (formData) => {
    const errors = {};
    const { lastMaintenanceDate, nextMaintenanceDate } = formData;
    
    if (lastMaintenanceDate && nextMaintenanceDate) {
      const lastDate = new Date(lastMaintenanceDate);
      const nextDate = new Date(nextMaintenanceDate);
      
      if (nextDate <= lastDate) {
        errors.nextMaintenanceDate = 'La próxima fecha debe ser posterior a la última';
      }
    }
    
    return errors;
  },

  // Validar horas de horómetro
  hourometerHours: (formData) => {
    const errors = {};
    const { currentHours, nextChangeHours } = formData;
    
    if (currentHours && nextChangeHours) {
      const current = Number(currentHours);
      const next = Number(nextChangeHours);
      
      if (next <= current) {
        errors.nextChangeHours = 'Las horas del próximo cambio deben ser mayores a las actuales';
      }
    }
    
    return errors;
  }
};

// Schema de validación predefinidos para entidades comunes
export const validationSchemas = {
  // Schema para vehículos
  vehicle: {
    vehicleId: [validators.required, validators.vehicleCode],
    name: [validators.required, validators.minLength(2), validators.maxLength(50)],
    brand: [validators.required, validators.minLength(2), validators.maxLength(30)],
    model: [validators.required, validators.minLength(1), validators.maxLength(30)],
    plateNumber: [validators.vehiclePlate],
    fuelCapacity: [validators.required, validators.fuelCapacity],
    enginePower: [validators.enginePower],
    estimatedConsumptionPerHour: [validators.consumptionRate],
    currentHours: [validators.hours],
    serialNumber: [validators.minLength(5), validators.maxLength(20)]
  },

  // Schema para inventario
  inventory: {
    fuelType: [validators.required],
    location: [validators.required, validators.minLength(2), validators.maxLength(50)],
    maxCapacity: [validators.required, validators.fuelCapacity],
    currentStock: [validators.nonNegative],
    minThreshold: [validators.nonNegative],
    pricePerUnit: [validators.unitPrice],
    supplier: [validators.maxLength(50)]
  },

  // Schema para proveedores
  supplier: {
    name: [validators.required, validators.minLength(2), validators.maxLength(100)],
    taxId: [validators.nit],
    email: [validators.email],
    phone: [validators.colombianPhone],
    address: [validators.minLength(10), validators.maxLength(200)],
    rating: [validators.rating],
    creditLimit: [validators.nonNegative]
  },

  // Schema para mantenimiento
  maintenance: {
    vehicleId: [validators.required],
    title: [validators.required, validators.minLength(5), validators.maxLength(100)],
    description: [validators.minLength(10), validators.maxLength(500)],
    date: [validators.required, validators.date],
    cost: [validators.nonNegative],
    quantity: [validators.positive],
    currentHours: [validators.hours],
    nextChangeHours: [validators.hours]
  },

  // Schema general para movimientos (wizard puede aplicar reglas por paso)
  movement: {
    type: [validators.required],
    fuelType: [validators.required],
    quantity: [validators.positive],
    unitPrice: [validators.nonNegative],
    effectiveDate: [validators.required, validators.date]
  }
};

export default validators;
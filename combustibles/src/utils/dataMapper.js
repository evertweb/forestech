/**
 * DataMapper - Utilidades para mapear datos históricos a formato Firebase
 * Basado en análisis completo del archivo "COMBUSTIBLE 2025"
 */

/**
 * Mapeo de vehículos/equipos históricos basado en análisis real
 */
export const HISTORICAL_VEHICLE_MAPPING = {
  // Tractores con horómetro (datos reales analizados)
  'TR-1': {
    vehicleId: 'TR-001',
    name: 'Tractor TR-1',
    type: 'tractor',
    category: 'maquinaria_pesada',
    fuelType: 'Diesel',
    hasHourMeter: true,
    currentHours: 9173, // Último registro analizado
    estimatedConsumptionPerHour: 2.5,
    location: 'Campo'
  },
  'TR-2': {
    vehicleId: 'TR-002', 
    name: 'Tractor TR-2',
    type: 'tractor',
    category: 'maquinaria_pesada',
    fuelType: 'Diesel',
    hasHourMeter: true,
    currentHours: 7401, // Último registro analizado
    estimatedConsumptionPerHour: 2.5,
    location: 'Campo'
  },
  'TR-3': {
    vehicleId: 'TR-003',
    name: 'Tractor TR-3', 
    type: 'tractor',
    category: 'maquinaria_pesada',
    fuelType: 'Diesel',
    hasHourMeter: true,
    currentHours: 3860, // Último registro analizado
    estimatedConsumptionPerHour: 2.5,
    location: 'Campo'
  },

  // Vehículos terrestres
  'VOLQUETA': {
    vehicleId: 'VQ-001',
    name: 'Volqueta',
    type: 'volqueta',
    category: 'transporte_pesado',
    fuelType: 'Diesel',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 3.0,
    location: 'Campo'
  },
  'Camioneta Amarilla': {
    vehicleId: 'CA-001',
    name: 'Camioneta Amarilla',
    type: 'camioneta',
    category: 'transporte_liviano',
    fuelType: 'Gasolina',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 1.5,
    location: 'Campo'
  },
  'Camioneta Burbuja': {
    vehicleId: 'CB-001',
    name: 'Camioneta Burbuja',
    type: 'camioneta', 
    category: 'transporte_liviano',
    fuelType: 'Gasolina',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 1.5,
    location: 'Campo'
  },
  'CARRO AZUL': {
    vehicleId: 'CAZ-001',
    name: 'Carro Azul',
    type: 'automovil',
    category: 'transporte_liviano',
    fuelType: 'Gasolina',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 1.2,
    location: 'Campo'
  },

  // Motocicletas
  'Moto XTZ Negra': {
    vehicleId: 'MXN-001',
    name: 'Moto XTZ Negra',
    type: 'motocicleta',
    category: 'transporte_personal',
    fuelType: 'Gasolina',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 0.8,
    location: 'Campo'
  },
  'Moto XR150 Blanca': {
    vehicleId: 'MXB-001',
    name: 'Moto XR150 Blanca',
    type: 'motocicleta',
    category: 'transporte_personal', 
    fuelType: 'Gasolina',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 0.8,
    location: 'Campo'
  },

  // Equipos especializados
  'Fumigadora a motor': {
    vehicleId: 'FM-001',
    name: 'Fumigadora a Motor',
    type: 'fumigadora',
    category: 'equipos_agricolas',
    fuelType: 'Gasolina',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 0.5,
    location: 'Campo'
  },
  'Hidrolavadora': {
    vehicleId: 'HL-001',
    name: 'Hidrolavadora',
    type: 'hidrolavadora',
    category: 'equipos_limpieza',
    fuelType: 'Gasolina',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 0.8,
    location: 'Taller'
  },
  'Planta eléctrica': {
    vehicleId: 'PE-001',
    name: 'Planta Eléctrica',
    type: 'planta_electrica',
    category: 'equipos_energia',
    fuelType: 'Diesel',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 2.0,
    location: 'Campamento'
  },
  'Guadañas': {
    vehicleId: 'GD-001',
    name: 'Guadañas',
    type: 'guadana',
    category: 'herramientas_motor',
    fuelType: 'Gasolina',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 0.3,
    location: 'Vivero'
  },
  'Motosierra': {
    vehicleId: 'MS-001',
    name: 'Motosierra',
    type: 'motosierra',
    category: 'herramientas_motor',
    fuelType: 'Gasolina',
    hasHourMeter: false,
    estimatedConsumptionPerHour: 0.4,
    location: 'Campo'
  }
};

/**
 * Mapeo de productos históricos basado en análisis real
 */
export const HISTORICAL_PRODUCT_MAPPING = {
  'A': {
    code: 'ACPM',
    name: 'ACPM (Diesel)',
    category: 'combustibles',
    unit: 'Galón',
    fuelType: 'Diesel',
    priority: 'high'
  },
  'G': {
    code: 'GASOLINA',
    name: 'Gasolina',
    category: 'combustibles', 
    unit: 'Galón',
    fuelType: 'Gasolina',
    priority: 'high'
  },
  'AO': {
    code: 'ACEITE_HIDRAULICO',
    name: 'Aceite Hidráulico',
    category: 'lubricantes',
    unit: 'Galón',
    priority: 'medium'
  },
  'AM4T': {
    code: 'ACEITE_MOTOR_20W50',
    name: 'Aceite Motor 20W50',
    category: 'lubricantes',
    unit: 'Cuarto',
    priority: 'medium'
  },
  'GA': {
    code: 'GRASA',
    name: 'Grasa Industrial',
    category: 'lubricantes',
    unit: 'Cuñete',
    priority: 'low'
  },
  'VA': {
    code: 'VALBULINA',
    name: 'Valbulina',
    category: 'lubricantes',
    unit: 'Galón',
    priority: 'medium'
  },
  'LO': {
    code: 'LIQUIDO_FRENOS',
    name: 'Líquido para Frenos',
    category: 'fluidos',
    unit: 'Litro',
    priority: 'medium'
  },
  'MA': {
    code: 'MISTURA_2T',
    name: 'Mistura 2T',
    category: 'combustibles',
    unit: 'Galón',
    priority: 'medium'
  },
  '15W40': {
    code: 'ACEITE_15W40',
    name: 'Aceite 15W40',
    category: 'lubricantes',
    unit: 'Galón',
    priority: 'medium'
  }
};

/**
 * Mapeo de ubicaciones/campamentos
 */
export const HISTORICAL_LOCATION_MAPPING = {
  'Austria-casino': 'Campamento Austria Casino',
  'MOTOBOMBA CAMPAMENTO ILUSION': 'Campamento Ilusión',
  'Campamento Atabapo': 'Campamento Atabapo',
  'Campamento Barquereña': 'Campamento Barquereña',
  'MOTOBOMBA CAMPAMENTO TERQUEDAD': 'Campamento Terquedad',
  'Vivero': 'Vivero Principal',
  'Apoyo logístico': 'Base Logística'
};

/**
 * Función para mapear vehículo histórico a formato Firebase
 */
export const mapHistoricalVehicle = (historicalName) => {
  const mapping = HISTORICAL_VEHICLE_MAPPING[historicalName];
  
  if (!mapping) {
    console.warn(`⚠️ Vehículo no encontrado en mapeo: ${historicalName}`);
    return generateAutoVehicleMapping(historicalName);
  }
  
  return {
    ...mapping,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'activo',
    totalFuelConsumed: 0, // Se calculará después del análisis
    totalMovements: 0,
    totalHoursWorked: mapping.currentHours || 0,
    source: 'historical_migration'
  };
};

/**
 * Función para mapear producto histórico a formato Firebase
 */
export const mapHistoricalProduct = (historicalCode, historicalData) => {
  const mapping = HISTORICAL_PRODUCT_MAPPING[historicalCode];
  
  if (!mapping) {
    console.warn(`⚠️ Producto no encontrado en mapeo: ${historicalCode}`);
    return generateAutoProductMapping(historicalCode, historicalData);
  }
  
  return {
    ...mapping,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'activo',
    // NO incluir inventario - se calculará después del análisis
    source: 'historical_migration',
    historicalCode
  };
};

/**
 * Función para mapear movimiento histórico a formato Firebase
 */
export const mapHistoricalMovement = (rawMovement) => {
  return {
    // Datos básicos del movimiento
    type: 'salida', // Todos los movimientos históricos son salidas
    date: parseHistoricalDate(rawMovement.fecha),
    productCode: mapProductCode(rawMovement.articulo),
    productName: rawMovement.articulo,
    quantity: parseQuantity(rawMovement.cantidad),
    
    // Destino del movimiento
    destinationVehicle: mapVehicleDestination(rawMovement.usuario),
    destinationName: rawMovement.usuario,
    location: extractLocation(rawMovement.usuario),
    
    // Metadatos
    source: 'historical_migration',
    isHistorical: true,
    createdAt: parseHistoricalDate(rawMovement.fecha) || new Date(),
    updatedAt: new Date(),
    
    // Datos originales para auditoría
    originalData: {
      codigo: rawMovement.codigo,
      fecha: rawMovement.fecha,
      articulo: rawMovement.articulo,
      usuario: rawMovement.usuario,
      cantidad: rawMovement.cantidad
    }
  };
};

/**
 * Función para mapear datos de mantenimiento histórico
 */
export const mapHistoricalMaintenance = (rawMaintenance) => {
  return {
    vehicleCode: mapTractorCode(rawMaintenance.maquina),
    vehicleName: rawMaintenance.maquina,
    date: parseHistoricalDate(rawMaintenance.fecha),
    type: 'cambio_aceite',
    description: `Cambio de aceite - ${rawMaintenance.cantidad} galones`,
    
    // Datos específicos
    oilQuantity: parseQuantity(rawMaintenance.cantidad),
    hourMeterReading: parseQuantity(rawMaintenance.horometro),
    filters: rawMaintenance.filtros || '',
    
    // Metadatos
    source: 'historical_migration',
    isHistorical: true,
    createdAt: parseHistoricalDate(rawMaintenance.fecha) || new Date(),
    updatedAt: new Date(),
    
    // Datos originales
    originalData: rawMaintenance
  };
};

/**
 * Generar mapeo automático para vehículos no encontrados
 */
export const generateAutoVehicleMapping = (vehicleName) => {
  const words = vehicleName.split(' ');
  let code = '';
  
  // Generar código automático
  for (const word of words) {
    if (word.length > 0) {
      code += word[0].toUpperCase();
      if (code.length >= 3) break;
    }
  }
  
  // Determinar tipo y combustible basándose en el nombre
  let type = 'otros';
  let fuelType = 'Gasolina';
  let category = 'general';
  
  if (vehicleName.toLowerCase().includes('motobomba')) {
    type = 'motobomba';
    category = 'equipos_agua';
    fuelType = 'Gasolina';
  } else if (vehicleName.toLowerCase().includes('campamento')) {
    type = 'equipo_campamento';
    category = 'infraestructura';
    fuelType = 'Gasolina';
  }
  
  return {
    vehicleId: `${code}-001`,
    name: vehicleName,
    type,
    category,
    fuelType,
    hasHourMeter: false,
    estimatedConsumptionPerHour: 1.0,
    location: 'Campo'
  };
};

/**
 * Generar mapeo automático para productos no encontrados
 */
export const generateAutoProductMapping = (productCode, productData) => {
  return {
    code: productCode,
    name: productData?.articulo || `Producto ${productCode}`,
    category: 'otros',
    unit: 'Unidad',
    priority: 'low'
  };
};

/**
 * Parsear fechas históricas con manejo de formatos múltiples
 */
export const parseHistoricalDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    // Limpiar la cadena
    const cleaned = dateString.toString().trim();
    
    // Patrones de fecha soportados
    const patterns = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY o MM/DD/YYYY
      /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/,  // DD/MM/YY o MM/DD/YY
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,   // YYYY-MM-DD
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/    // DD-MM-YYYY
    ];
    
    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        let [, part1, part2, part3] = match;
        
        let year, month, day;
        
        if (pattern.source.includes('\\d{4}') && pattern.source.indexOf('\\d{4}') === 1) {
          // Formato YYYY-MM-DD
          year = part1;
          month = part2;
          day = part3;
        } else if (part3.length === 4) {
          // Formato DD/MM/YYYY o MM/DD/YYYY
          year = part3;
          
          // Determinar DD/MM vs MM/DD
          if (parseInt(part1) > 12) {
            day = part1;
            month = part2;
          } else if (parseInt(part2) > 12) {
            day = part2;
            month = part1;
          } else {
            // Ambiguo - usar DD/MM por defecto para datos de Latinoamérica
            day = part1;
            month = part2;
          }
        } else {
          // Formato con año de 2 dígitos
          year = parseInt(part3) > 50 ? `19${part3}` : `20${part3}`;
          day = part1;
          month = part2;
        }
        
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        
        if (!isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 2100) {
          return date;
        }
      }
    }
    
    // Intentar parsing directo como último recurso
    const directDate = new Date(cleaned);
    if (!isNaN(directDate.getTime())) {
      return directDate;
    }
    
  } catch (error) {
    console.warn(`⚠️ Error parseando fecha: ${dateString}`, error);
  }
  
  return null;
};

/**
 * Mapear código de producto
 */
export const mapProductCode = (articulo) => {
  const reverseMapping = {
    'GASOLINA': 'GASOLINA',
    'ACPM': 'ACPM',
    'Aceite Hidraulico': 'ACEITE_HIDRAULICO',
    'Aceite Motor 20w50': 'ACEITE_MOTOR_20W50',
    'GRASA': 'GRASA',
    'Valbulina': 'VALBULINA',
    'Liquido para frenos': 'LIQUIDO_FRENOS',
    'Mistura 2t': 'MISTURA_2T',
    'ACEITE 15W40': 'ACEITE_15W40'
  };
  
  return reverseMapping[articulo] || articulo.toUpperCase().replace(/\s+/g, '_');
};

/**
 * Mapear destino del vehículo
 */
export const mapVehicleDestination = (usuario) => {
  const mapping = HISTORICAL_VEHICLE_MAPPING[usuario];
  return mapping ? mapping.vehicleId : generateAutoVehicleMapping(usuario).vehicleId;
};

/**
 * Extraer ubicación del usuario/destino
 */
export const extractLocation = (usuario) => {
  // Verificar si es una ubicación específica
  const locationMapping = HISTORICAL_LOCATION_MAPPING[usuario];
  if (locationMapping) {
    return locationMapping;
  }
  
  // Verificar si contiene palabras clave de ubicación
  const locationKeywords = ['Campamento', 'Vivero', 'Austria', 'MOTOBOMBA'];
  
  for (const keyword of locationKeywords) {
    if (usuario.includes(keyword)) {
      return HISTORICAL_LOCATION_MAPPING[usuario] || usuario;
    }
  }
  
  // Si es un vehículo, la ubicación es 'Campo'
  return 'Campo';
};

/**
 * Parsear cantidad con manejo de formatos múltiples
 */
export const parseQuantity = (cantidad) => {
  if (typeof cantidad === 'number') {
    return cantidad;
  }
  
  if (typeof cantidad === 'string') {
    // Limpiar la cadena
    const cleaned = cantidad.toString().trim().replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
};

/**
 * Mapear código de tractor para mantenimiento
 */
export const mapTractorCode = (maquina) => {
  const tractorMapping = {
    'TR1': 'TR-001',
    'TR2': 'TR-002', 
    'TR3': 'TR-003'
  };
  
  return tractorMapping[maquina] || maquina;
};

/**
 * Validar datos de movimiento
 */
export const validateMovementData = (movement) => {
  const required = ['date', 'productCode', 'quantity', 'destinationVehicle'];
  
  for (const field of required) {
    if (!movement[field]) {
      return { valid: false, error: `Campo requerido: ${field}` };
    }
  }
  
  if (movement.quantity <= 0) {
    return { valid: false, error: 'La cantidad debe ser mayor a cero' };
  }
  
  if (!movement.date || isNaN(movement.date.getTime())) {
    return { valid: false, error: 'Fecha inválida' };
  }
  
  return { valid: true };
};

/**
 * Validar datos de vehículo
 */
export const validateVehicleData = (vehicle) => {
  const required = ['vehicleId', 'name', 'type', 'fuelType'];
  
  for (const field of required) {
    if (!vehicle[field]) {
      return { valid: false, error: `Campo requerido: ${field}` };
    }
  }
  
  return { valid: true };
};

/**
 * Obtener estadísticas de mapeo
 */
export const getMappingStatistics = () => {
  return {
    vehicles: Object.keys(HISTORICAL_VEHICLE_MAPPING).length,
    products: Object.keys(HISTORICAL_PRODUCT_MAPPING).length,
    locations: Object.keys(HISTORICAL_LOCATION_MAPPING).length,
    tractorsWithHourMeter: Object.values(HISTORICAL_VEHICLE_MAPPING)
      .filter(v => v.hasHourMeter).length
  };
};

export default {
  HISTORICAL_VEHICLE_MAPPING,
  HISTORICAL_PRODUCT_MAPPING,
  HISTORICAL_LOCATION_MAPPING,
  mapHistoricalVehicle,
  mapHistoricalProduct,
  mapHistoricalMovement,
  mapHistoricalMaintenance,
  parseHistoricalDate,
  mapProductCode,
  mapVehicleDestination,
  extractLocation,
  parseQuantity,
  validateMovementData,
  validateVehicleData,
  getMappingStatistics
};
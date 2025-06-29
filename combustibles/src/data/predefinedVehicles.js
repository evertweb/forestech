/**
 * Vehículos predefinidos para Forestech
 * Lista específica solicitada por el usuario para TAREA 3
 */

// Constantes locales para evitar dependencia circular
const VEHICLE_TYPES = {
  EXCAVADORA: 'excavadora',
  BULLDOZER: 'bulldozer',
  CARGADOR: 'cargador',
  CAMION: 'camion',
  GRUA: 'grua',
  MOTOSIERRA: 'motosierra',
  TRACTOR: 'tractor',
  VOLQUETA: 'volqueta',
  APOYO_LOGISTICO: 'apoyo_logistico',
  ASPERJADORA: 'asperjadora',
  MOTOBOMBA: 'motobomba',
  CAMIONETA: 'camioneta',
  FUMIGADORA: 'fumigadora',
  CONTROL_QUIMICO: 'control_quimico',
  GUADAÑAS: 'guadañas',
  HIDROLAVADORA: 'hidrolavadora',
  MOTO: 'moto',
  PLANTA_ELECTRICA: 'planta_electrica',
  CONTROL_HORMIGAS: 'control_hormigas',
  OTROS: 'otros'
};

const VEHICLE_STATUS = {
  ACTIVO: 'activo',
  MANTENIMIENTO: 'mantenimiento',
  INACTIVO: 'inactivo',
  REPARACION: 'reparacion'
};

const FUEL_COMPATIBILITY = {
  DIESEL: 'Diesel',
  GASOLINA: 'Gasolina',
  ACPM: 'ACPM',
  MIXTO: 'Mixto'
};

export const PREDEFINED_VEHICLES = [
  // 1. APOYO LOGISTICO
  {
    vehicleId: 'AL-001',
    name: 'Apoyo Logístico',
    type: 'apoyo_logistico',
    brand: 'Forestech',
    model: 'Logística',
    year: 2023,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 80,
    enginePower: 150,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Base Central',
    description: 'Vehículo para apoyo logístico general',
    estimatedConsumptionPerHour: 4.5
  },

  // 2. ASPERJADORA
  {
    vehicleId: 'ASP-001',
    name: 'Asperjadora',
    type: 'asperjadora',
    brand: 'Jacto',
    model: 'PJ600',
    year: 2022,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 25,
    enginePower: 80,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Sector Fumigación',
    description: 'Asperjadora para control fitosanitario',
    estimatedConsumptionPerHour: 2.8
  },

  // 3. MOTOBOMBA AUSTRIA-CASINO
  {
    vehicleId: 'MB-AUS-001',
    name: 'Motobomba Austria-Casino',
    type: 'motobomba',
    brand: 'Honda',
    model: 'WB30X',
    year: 2021,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 15,
    enginePower: 120,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Campamento Austria-Casino',
    description: 'Motobomba para sector Austria-Casino',
    estimatedConsumptionPerHour: 3.2
  },

  // 4. CAMIONETA TOYOTA AMARILLA
  {
    vehicleId: 'CAM-AM-001',
    name: 'Camioneta Toyota Amarilla',
    type: VEHICLE_TYPES.CAMION,
    brand: 'Toyota',
    model: 'Hilux',
    year: 2020,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 80,
    enginePower: 150,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Área Administrativa',
    description: 'Camioneta Toyota color amarillo para transporte',
    plateNumber: 'FOR-001',
    estimatedConsumptionPerHour: 5.0
  },

  // 5. CAMIONETA TOYOTA AZUL
  {
    vehicleId: 'CAM-AZ-001',
    name: 'Camioneta Toyota Azul',
    type: VEHICLE_TYPES.CAMION,
    brand: 'Toyota',
    model: 'Hilux',
    year: 2019,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 80,
    enginePower: 150,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Sector Norte',
    description: 'Camioneta Toyota color azul para transporte',
    plateNumber: 'FOR-002',
    estimatedConsumptionPerHour: 5.0
  },

  // 6. CAMIONETA TOYOTA GRIS
  {
    vehicleId: 'CAM-GR-001',
    name: 'Camioneta Toyota Gris',
    type: VEHICLE_TYPES.CAMION,
    brand: 'Toyota',
    model: 'Hilux',
    year: 2021,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 80,
    enginePower: 150,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Sector Sur',
    description: 'Camioneta Toyota color gris para transporte',
    plateNumber: 'FOR-003',
    estimatedConsumptionPerHour: 5.0
  },

  // 7. MOTOBOMBA CAMPAMENTO ATABAPO
  {
    vehicleId: 'MB-ATA-001',
    name: 'Motobomba Campamento Atabapo',
    type: 'motobomba',
    brand: 'Honda',
    model: 'WB20X',
    year: 2022,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 12,
    enginePower: 100,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Campamento Atabapo',
    description: 'Motobomba para suministro de agua - Atabapo',
    estimatedConsumptionPerHour: 2.8
  },

  // 8. MOTOBOMBA CAMPAMENTO ILUSIÓN
  {
    vehicleId: 'MB-ILU-001',
    name: 'Motobomba Campamento Ilusión',
    type: 'motobomba',
    brand: 'Honda',
    model: 'WB20X',
    year: 2022,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 12,
    enginePower: 100,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Campamento Ilusión',
    description: 'Motobomba para suministro de agua - Ilusión',
    estimatedConsumptionPerHour: 2.8
  },

  // 9. MOTOBOMBA RIEGO VIVERO
  {
    vehicleId: 'MB-VIV-001',
    name: 'Motobomba Riego Vivero',
    type: 'motobomba',
    brand: 'Honda',
    model: 'WB15X',
    year: 2023,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 10,
    enginePower: 80,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Vivero Principal',
    description: 'Motobomba dedicada al riego del vivero',
    estimatedConsumptionPerHour: 2.4
  },

  // 10. MOTOBOMBA CAMPAMENTO TERQUEDAD
  {
    vehicleId: 'MB-TER-001',
    name: 'Motobomba Campamento Terquedad',
    type: 'motobomba',
    brand: 'Honda',
    model: 'WB20X',
    year: 2021,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 12,
    enginePower: 100,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Campamento Terquedad',
    description: 'Motobomba para suministro de agua - Terquedad',
    estimatedConsumptionPerHour: 2.8
  },

  // 11. MOTOBOMBA CAMPAMENTO BARQUEREÑA
  {
    vehicleId: 'MB-BAR-001',
    name: 'Motobomba Campamento Barquereña',
    type: 'motobomba',
    brand: 'Honda',
    model: 'WB30X',
    year: 2022,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 15,
    enginePower: 120,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Campamento Barquereña',
    description: 'Motobomba para suministro de agua - Barquereña',
    estimatedConsumptionPerHour: 3.2
  },

  // 12. FUMIGADORAS MOTORIZADAS
  {
    vehicleId: 'FUM-001',
    name: 'Fumigadoras Motorizadas',
    type: 'fumigadora',
    brand: 'Stihl',
    model: 'SR450',
    year: 2022,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 5,
    enginePower: 45,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Almacén Fitosanitario',
    description: 'Fumigadoras motorizadas para aplicación de productos',
    estimatedConsumptionPerHour: 1.5
  },

  // 13. CONTROL QUÍMICO
  {
    vehicleId: 'CQ-001',
    name: 'Control Químico',
    type: 'control_quimico',
    brand: 'Jacto',
    model: 'PJH',
    year: 2023,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 20,
    enginePower: 60,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Sector Control',
    description: 'Equipo especializado para control químico',
    estimatedConsumptionPerHour: 2.0
  },

  // 14. GUADAÑAS
  {
    vehicleId: 'GUA-001',
    name: 'Guadañas',
    type: 'guadana',
    brand: 'Stihl',
    model: 'FS250',
    year: 2022,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 2,
    enginePower: 25,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Almacén Herramientas',
    description: 'Guadañas para mantenimiento y limpieza',
    estimatedConsumptionPerHour: 0.8
  },

  // 15. HIDROLAVADORA
  {
    vehicleId: 'HID-001',
    name: 'Hidrolavadora',
    type: 'hidrolavadora',
    brand: 'Karcher',
    model: 'HD7/18',
    year: 2021,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 8,
    enginePower: 70,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Taller Principal',
    description: 'Hidrolavadora para limpieza de equipos',
    estimatedConsumptionPerHour: 2.2
  },

  // 16. MOTO HONDA XTZ 150
  {
    vehicleId: 'MOT-HON-001',
    name: 'Moto Honda XTZ 150',
    type: 'motocicleta',
    brand: 'Honda',
    model: 'XTZ150',
    year: 2020,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 12,
    enginePower: 15,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Base Central',
    description: 'Motocicleta Honda para transporte rápido',
    plateNumber: 'MOT-001',
    estimatedConsumptionPerHour: 1.2
  },

  // 17. MOTO XTZ YAMAHA 125
  {
    vehicleId: 'MOT-YAM-001',
    name: 'Moto XTZ Yamaha 125',
    type: 'motocicleta',
    brand: 'Yamaha',
    model: 'XTZ125',
    year: 2021,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 10,
    enginePower: 12,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Sector Este',
    description: 'Motocicleta Yamaha para supervisión',
    plateNumber: 'MOT-002',
    estimatedConsumptionPerHour: 1.0
  },

  // 18. MOTOBOMBA ESTACIONARIA
  {
    vehicleId: 'MB-EST-001',
    name: 'Motobomba Estacionaria',
    type: 'motobomba',
    brand: 'Honda',
    model: 'WB40X',
    year: 2022,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 25,
    enginePower: 200,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Planta de Tratamiento',
    description: 'Motobomba estacionaria de alta capacidad',
    estimatedConsumptionPerHour: 4.8
  },

  // 19. MOTOSIERRA
  {
    vehicleId: 'MS-001',
    name: 'Motosierra',
    type: VEHICLE_TYPES.MOTOSIERRA,
    brand: 'Stihl',
    model: 'MS361',
    year: 2023,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 1.5,
    enginePower: 35,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Almacén Forestal',
    description: 'Motosierra profesional para actividades forestales',
    estimatedConsumptionPerHour: 1.2
  },

  // 20. PLANTA ELÉCTRICA
  {
    vehicleId: 'PE-001',
    name: 'Planta Eléctrica',
    type: 'planta_electrica',
    brand: 'Caterpillar',
    model: 'C15',
    year: 2020,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 200,
    enginePower: 400,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Subestación Principal',
    description: 'Planta eléctrica de respaldo principal',
    estimatedConsumptionPerHour: 12.0
  },

  // 21. CONTROL RODAMIENTO HORMIGAS
  {
    vehicleId: 'CRH-001',
    name: 'Control Rodamiento Hormigas',
    type: 'control_hormigas',
    brand: 'Forestech',
    model: 'CRH-Pro',
    year: 2023,
    fuelType: FUEL_COMPATIBILITY.GASOLINA,
    fuelCapacity: 15,
    enginePower: 50,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Sector Protección',
    description: 'Equipo especializado para control de hormigas cortadoras',
    estimatedConsumptionPerHour: 1.8
  },

  // 22. TRACTORES TR1, TR2, TR3 - Con horómetro
  {
    vehicleId: 'TR1',
    name: 'Tractor TR1',
    type: VEHICLE_TYPES.TRACTOR,
    brand: 'John Deere',
    model: '6120M',
    year: 2021,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 280,
    enginePower: 120,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Sector Norte',
    description: 'Tractor principal para trabajos pesados',
    estimatedConsumptionPerHour: 8.5,
    // ✅ NUEVO: Sistema de horómetro para tractores
    hasHourMeter: true,
    currentHours: 1250,
    lastHourMeterReading: 1250,
    lastHourMeterDate: new Date().toISOString()
  },

  {
    vehicleId: 'TR2',
    name: 'Tractor TR2',
    type: VEHICLE_TYPES.TRACTOR,
    brand: 'John Deere',
    model: '6130M',
    year: 2022,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 280,
    enginePower: 130,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Sector Central',
    description: 'Tractor secundario para trabajos medianos',
    estimatedConsumptionPerHour: 9.0,
    // ✅ NUEVO: Sistema de horómetro para tractores
    hasHourMeter: true,
    currentHours: 950,
    lastHourMeterReading: 950,
    lastHourMeterDate: new Date().toISOString()
  },

  {
    vehicleId: 'TR3',
    name: 'Tractor TR3',
    type: VEHICLE_TYPES.TRACTOR,
    brand: 'John Deere',
    model: '6110M',
    year: 2020,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 260,
    enginePower: 110,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Sector Sur',
    description: 'Tractor de apoyo para trabajos livianos',
    estimatedConsumptionPerHour: 7.8,
    // ✅ NUEVO: Sistema de horómetro para tractores
    hasHourMeter: true,
    currentHours: 1580,
    lastHourMeterReading: 1580,
    lastHourMeterDate: new Date().toISOString()
  },

  // 23. VOLQUETA
  {
    vehicleId: 'VOL-001',
    name: 'Volqueta',
    type: VEHICLE_TYPES.VOLQUETA,
    brand: 'Chevrolet',
    model: 'NPR',
    year: 2019,
    fuelType: FUEL_COMPATIBILITY.DIESEL,
    fuelCapacity: 120,
    enginePower: 180,
    status: VEHICLE_STATUS.ACTIVO,
    currentLocation: 'Patio de Materiales',
    description: 'Volqueta para transporte de materiales',
    plateNumber: 'VOL-001',
    estimatedConsumptionPerHour: 6.5
  }
];

/**
 * Función para obtener todos los vehículos predefinidos
 * @returns {Array} Lista de vehículos predefinidos
 */
export const getPredefinedVehicles = () => {
  return PREDEFINED_VEHICLES.map(vehicle => ({
    ...vehicle,
    // Agregar timestamps por defecto
    createdAt: new Date(),
    updatedAt: new Date(),
    totalFuelConsumed: 0,
    totalHoursWorked: vehicle.hasHourMeter ? vehicle.currentHours : 0,
    totalMovements: 0,
    lastMovementDate: null
  }));
};

/**
 * Función para obtener solo los tractores con horómetro
 * @returns {Array} Lista de tractores con sistema de horómetro
 */
export const getTractorsWithHourMeter = () => {
  return PREDEFINED_VEHICLES.filter(vehicle => 
    vehicle.hasHourMeter && vehicle.type === VEHICLE_TYPES.TRACTOR
  );
};

/**
 * Tipos personalizados agregados para los nuevos vehículos
 */
export const EXTENDED_VEHICLE_TYPES = {
  ...VEHICLE_TYPES,
  APOYO_LOGISTICO: 'apoyo_logistico',
  ASPERJADORA: 'asperjadora',
  MOTOBOMBA: 'motobomba',
  FUMIGADORA: 'fumigadora',
  CONTROL_QUIMICO: 'control_quimico',
  GUADANA: 'guadana',
  HIDROLAVADORA: 'hidrolavadora',
  MOTOCICLETA: 'motocicleta',
  PLANTA_ELECTRICA: 'planta_electrica',
  CONTROL_HORMIGAS: 'control_hormigas'
};

export default {
  PREDEFINED_VEHICLES,
  getPredefinedVehicles,
  getTractorsWithHourMeter,
  EXTENDED_VEHICLE_TYPES
};
/**
 * CALCULATIONS.JS - Sistema Centralizado de Cálculos para Combustibles
 *
 * Centraliza todas las operaciones matemáticas y lógica de negocio
 * para el módulo de gestión de combustibles de Forestech.
 *
 * Incluye:
 * - Cálculos de inventario (stock, valor, alertas)
 * - Métricas de movimientos (costos, validaciones)
 * - Análisis de vehículos (consumo, eficiencia)
 * - Cálculos financieros y reportes
 * - Funciones preparatorias para módulos futuros (Proveedores, Reportes)
 */

import {
  FUEL_TYPES,
  FUEL_INFO,
  STOCK_LEVELS,
  STOCK_ALERTS,
  getStockLevel,
} from '../constants/combustibleTypes';

// ============================================================================
// 📊 CÁLCULOS DE INVENTARIO
// ============================================================================

/**
 * Calcula el valor total del inventario
 * @param {Array} inventoryItems - Array de items de inventario
 * @returns {number} Valor total en COP
 */
export const calculateTotalInventoryValue = (inventoryItems = []) => {
  console.log('💰 calculateTotalInventoryValue llamado con:', inventoryItems.length, 'items');

  if (!Array.isArray(inventoryItems)) return 0;

  return inventoryItems.reduce((total, item) => {
    const quantity = parseFloat(item.currentStock) || 0;
    const price = parseFloat(item.pricePerUnit) || 0;
    const itemValue = quantity * price;

    console.log(`  - ${item.name || item.fuelType}: ${quantity} × ${price} = ${itemValue}`);

    return total + itemValue;
  }, 0);
};

/**
 * Calcula el stock disponible por tipo de combustible
 * @param {Array} inventoryItems - Array de items de inventario
 * @param {string} fuelType - Tipo de combustible (opcional)
 * @returns {Object|number} Stock por tipo o total si no se especifica tipo
 */
export const calculateAvailableStock = (inventoryItems = [], fuelType = null) => {
  if (!Array.isArray(inventoryItems)) return fuelType ? 0 : {};

  if (fuelType) {
    // 🔧 Normalizar comparación de fuelType
    const normalizedFuelType = fuelType.toUpperCase();
    return inventoryItems
      .filter((item) => item.fuelType?.toUpperCase() === normalizedFuelType)
      .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);
  }

  // Retorna stock por cada tipo de combustible
  const stockByType = {};
  Object.values(FUEL_TYPES).forEach((type) => {
    const normalizedType = type.toUpperCase();
    stockByType[type] = inventoryItems
      .filter((item) => item.fuelType?.toUpperCase() === normalizedType)
      .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);
  });

  return stockByType;
};

/**
 * Calcula el porcentaje de capacidad utilizada
 * @param {number} currentStock - Stock actual
 * @param {number} maxCapacity - Capacidad máxima
 * @returns {number} Porcentaje (0-100)
 */
export const calculateCapacityPercentage = (currentStock, maxCapacity) => {
  if (!maxCapacity || maxCapacity === 0) return 0;
  const percentage = (parseFloat(currentStock) || 0) / parseFloat(maxCapacity);
  return Math.min(Math.max(percentage * 100, 0), 100);
};

/**
 * Calcula alertas de stock bajo
 * @param {Array} inventoryItems - Array de items de inventario
 * @param {number} threshold - Umbral de alerta (default: 0.15 = 15%)
 * @returns {Array} Array de alertas con información detallada
 */
export const calculateLowStockAlerts = (inventoryItems = [], threshold = 0.15) => {
  if (!Array.isArray(inventoryItems)) return [];

  return inventoryItems
    .map((item) => {
      const currentStock = parseFloat(item.currentStock) || 0;
      const maxCapacity = parseFloat(item.maxCapacity) || 0;
      const percentage = maxCapacity > 0 ? currentStock / maxCapacity : 0;
      const stockLevel = getStockLevel(currentStock, maxCapacity);

      return {
        ...item,
        percentage: percentage * 100,
        stockLevel,
        isLowStock: percentage <= threshold,
        stockInfo: STOCK_ALERTS[stockLevel],
      };
    })
    .filter((item) => item.isLowStock)
    .sort((a, b) => a.percentage - b.percentage); // Los más críticos primero
};

/**
 * Calcula estadísticas generales de inventario
 * @param {Array} inventoryItems - Array de items de inventario
 * @returns {Object} Estadísticas completas
 */
export const calculateInventoryStats = (inventoryItems = []) => {
  console.log('🧮 calculateInventoryStats llamado con:', inventoryItems.length, 'items');
  console.log('📦 Items recibidos:', inventoryItems);

  if (!Array.isArray(inventoryItems)) {
    console.log('❌ inventoryItems no es un array');
    return {
      totalValue: 0,
      totalItems: 0,
      activeItems: 0,
      lowStockItems: 0,
      criticalItems: 0,
      averageStockLevel: 0,
      stockByType: {},
    };
  }

  const totalValue = calculateTotalInventoryValue(inventoryItems);
  console.log('💰 Valor total calculado:', totalValue);

  const totalItems = inventoryItems.length;
  const activeItems = inventoryItems.filter((item) => item.status === 'active').length;
  console.log('📊 Items activos encontrados:', activeItems, 'de', totalItems);
  const lowStockAlerts = calculateLowStockAlerts(inventoryItems);
  const criticalItems = lowStockAlerts.filter(
    (item) => item.stockLevel === STOCK_LEVELS.CRITICAL
  ).length;
  const stockByType = calculateAvailableStock(inventoryItems);

  // Promedio de nivel de stock
  const averageStockLevel =
    inventoryItems.length > 0
      ? inventoryItems.reduce((sum, item) => {
          const percentage = calculateCapacityPercentage(item.currentStock, item.maxCapacity);
          return sum + percentage;
        }, 0) / inventoryItems.length
      : 0;

  return {
    totalValue,
    totalItems,
    activeItems,
    lowStockItems: lowStockAlerts.length,
    criticalItems,
    averageStockLevel,
    stockByType,
  };
};

// ============================================================================
// 🔄 CÁLCULOS DE MOVIMIENTOS
// ============================================================================

/**
 * Valida disponibilidad de stock para un movimiento
 * @param {Object} movement - Datos del movimiento
 * @param {Array} inventoryItems - Array de items de inventario
 * @returns {Object} Resultado de validación con detalles
 */
export const validateStockAvailability = (movement, inventoryItems = []) => {
  if (!movement || !movement.fuelType || !movement.quantity) {
    return {
      isValid: false,
      error: 'Datos de movimiento incompletos',
      availableStock: 0,
      requiredStock: 0,
    };
  }

  const { fuelType, quantity, type, sourceLocation } = movement;
  const requiredStock = parseFloat(quantity) || 0;

  // Solo validar stock para movimientos de SALIDA y TRANSFERENCIA
  if (type !== 'salida' && type !== 'transferencia') {
    return {
      isValid: true,
      message: 'Movimiento no requiere validación de stock',
      availableStock: 0,
      requiredStock,
    };
  }

  // Calcular stock disponible en la ubicación específica
  const availableStock = inventoryItems
    .filter(
      (item) =>
        item.fuelType === fuelType &&
        item.location?.toLowerCase() === sourceLocation?.toLowerCase() &&
        item.status === 'active'
    )
    .reduce((total, item) => total + (parseFloat(item.currentStock) || 0), 0);

  const isValid = availableStock >= requiredStock;
  const remainingStock = availableStock - requiredStock;

  // Log para diagnóstico de problemas de stock
  console.log(`Validación de stock - Tipo: ${fuelType}, Ubicación: ${sourceLocation}`, {
    itemsEncontrados: inventoryItems.filter(
      (item) =>
        item.fuelType === fuelType &&
        item.location?.toLowerCase() === sourceLocation?.toLowerCase() &&
        item.status === 'active'
    ).length,
    disponible: availableStock,
    requerido: requiredStock,
    valido: availableStock >= requiredStock,
  });

  return {
    isValid,
    availableStock,
    requiredStock,
    remainingStock,
    fuelType,
    location: sourceLocation,
    error: !isValid
      ? `Stock insuficiente. Disponible: ${availableStock}, Requerido: ${requiredStock}`
      : null,
    warning:
      remainingStock < availableStock * 0.2 && remainingStock >= 0
        ? 'Stock quedará bajo después del movimiento'
        : null,
  };
};

/**
 * Calcula el stock resultante después de un movimiento
 * @param {number} currentStock - Stock actual
 * @param {Object} movement - Datos del movimiento
 * @returns {number} Stock resultante
 */
export const calculateResultingStock = (currentStock, movement) => {
  const current = parseFloat(currentStock) || 0;
  const quantity = parseFloat(movement.quantity) || 0;

  switch (movement.type) {
    case 'entrada':
    case 'ajuste':
      return current + quantity;
    case 'salida':
    case 'transferencia':
      return Math.max(0, current - quantity); // Evitar stock negativo
    default:
      return current;
  }
};

/**
 * Calcula costos de movimientos
 * @param {Array} movements - Array de movimientos
 * @param {Object} fuelPrices - Precios por tipo de combustible
 * @returns {Object} Análisis de costos
 */
export const calculateMovementCosts = (movements = [], fuelPrices = {}) => {
  if (!Array.isArray(movements)) return { totalCost: 0, costsByType: {}, costsByLocation: {} };

  let totalCost = 0;
  const costsByType = {};
  const costsByLocation = {};

  movements.forEach((movement) => {
    const quantity = parseFloat(movement.quantity) || 0;
    const fuelType = movement.fuelType;
    const location = movement.sourceLocation || movement.location;
    const price = fuelPrices[fuelType] || parseFloat(movement.pricePerUnit) || 0;
    const cost = quantity * price;

    totalCost += cost;

    // Agrupar por tipo de combustible
    if (!costsByType[fuelType]) costsByType[fuelType] = 0;
    costsByType[fuelType] += cost;

    // Agrupar por ubicación
    if (location) {
      if (!costsByLocation[location]) costsByLocation[location] = 0;
      costsByLocation[location] += cost;
    }
  });

  return {
    totalCost,
    costsByType,
    costsByLocation,
    averageCostPerMovement: movements.length > 0 ? totalCost / movements.length : 0,
  };
};

/**
 * Calcula estadísticas de movimientos
 * @param {Array} movements - Array de movimientos
 * @returns {Object} Estadísticas completas
 */
export const calculateMovementsStats = (movements = []) => {
  if (!Array.isArray(movements)) {
    return {
      totalMovements: 0,
      pendingMovements: 0,
      completedMovements: 0,
      cancelledMovements: 0,
      movementsByType: {},
      totalQuantity: 0,
    };
  }

  const stats = {
    totalMovements: movements.length,
    pendingMovements: movements.filter((m) => m.status === 'pendiente').length,
    completedMovements: movements.filter((m) => m.status === 'completado').length,
    cancelledMovements: movements.filter((m) => m.status === 'cancelado').length,
    movementsByType: {
      entrada: movements.filter((m) => m.type === 'entrada').length,
      salida: movements.filter((m) => m.type === 'salida').length,
      transferencia: movements.filter((m) => m.type === 'transferencia').length,
      ajuste: movements.filter((m) => m.type === 'ajuste').length,
    },
    totalQuantity: movements.reduce((sum, m) => sum + (parseFloat(m.quantity) || 0), 0),
  };

  return stats;
};

// ============================================================================
// 🚜 MÉTRICAS DE VEHÍCULOS
// ============================================================================

/**
 * Calcula consumo promedio por vehículo
 * @param {Object} vehicle - Datos del vehículo
 * @param {Array} movements - Movimientos relacionados con el vehículo
 * @returns {Object} Métricas de consumo
 */
export const calculateVehicleConsumption = (vehicle, movements = []) => {
  if (!vehicle) return { averageConsumption: 0, totalConsumption: 0, movementsCount: 0 };

  const vehicleMovements = movements.filter(
    (m) => m.vehicleId === vehicle.vehicleId && m.type === 'salida' && m.status === 'completado'
  );

  const totalConsumption = vehicleMovements.reduce(
    (sum, m) => sum + (parseFloat(m.quantity) || 0),
    0
  );

  const movementsCount = vehicleMovements.length;
  const averageConsumption = movementsCount > 0 ? totalConsumption / movementsCount : 0;

  return {
    averageConsumption,
    totalConsumption,
    movementsCount,
    consumptionByFuelType: vehicleMovements.reduce((acc, m) => {
      const fuelType = m.fuelType;
      if (!acc[fuelType]) acc[fuelType] = 0;
      acc[fuelType] += parseFloat(m.quantity) || 0;
      return acc;
    }, {}),
  };
};

/**
 * Calcula eficiencia de combustible del vehículo
 * @param {Object} vehicle - Datos del vehículo
 * @param {Array} movements - Movimientos del vehículo
 * @returns {Object} Métricas de eficiencia
 */
export const calculateFuelEfficiency = (vehicle, movements = []) => {
  if (!vehicle) return { efficiency: 0, unit: 'L/h' };

  const consumption = calculateVehicleConsumption(vehicle, movements);
  const hoursWorked = parseFloat(vehicle.hoursWorked) || 0;

  if (hoursWorked === 0 || consumption.totalConsumption === 0) {
    return {
      efficiency: 0,
      unit: 'L/h',
      hoursWorked,
      totalConsumption: consumption.totalConsumption,
    };
  }

  const efficiency = consumption.totalConsumption / hoursWorked;

  return {
    efficiency,
    unit: 'L/h',
    hoursWorked,
    totalConsumption: consumption.totalConsumption,
    efficiencyRating:
      efficiency < 10
        ? 'Excelente'
        : efficiency < 20
          ? 'Buena'
          : efficiency < 30
            ? 'Regular'
            : 'Necesita revisión',
  };
};

/**
 * Calcula costos operacionales del vehículo
 * @param {Object} vehicle - Datos del vehículo
 * @param {Array} movements - Movimientos del vehículo
 * @param {Object} fuelPrices - Precios por tipo de combustible
 * @returns {Object} Análisis de costos operacionales
 */
export const calculateOperationalCosts = (vehicle, movements = [], fuelPrices = {}) => {
  if (!vehicle) return { totalCost: 0, costPerHour: 0, costPerMovement: 0 };

  const vehicleMovements = movements.filter(
    (m) => m.vehicleId === vehicle.vehicleId && m.type === 'salida' && m.status === 'completado'
  );

  const costs = calculateMovementCosts(vehicleMovements, fuelPrices);
  const hoursWorked = parseFloat(vehicle.hoursWorked) || 0;

  return {
    totalCost: costs.totalCost,
    costPerHour: hoursWorked > 0 ? costs.totalCost / hoursWorked : 0,
    costPerMovement: costs.averageCostPerMovement,
    costsByFuelType: costs.costsByType,
    movementsCount: vehicleMovements.length,
  };
};

/**
 * Calcula estadísticas completas de vehículos
 * @param {Array} vehicles - Array de vehículos
 * @param {Array} movements - Array de movimientos
 * @returns {Object} Estadísticas generales
 */
export const calculateVehiclesStats = (vehicles = [], movements = []) => {
  if (!Array.isArray(vehicles)) {
    return {
      totalVehicles: 0,
      activeVehicles: 0,
      totalHours: 0,
      totalConsumption: 0,
      averageEfficiency: 0,
      vehiclesByType: {},
      vehiclesByStatus: {},
    };
  }

  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === 'activo').length;
  const totalHours = vehicles.reduce(
    (sum, v) => sum + (parseFloat(v.totalHoursWorked) || parseFloat(v.currentHours) || 0),
    0
  );

  // Calcular consumo total y eficiencia promedio
  let totalConsumption = 0;
  let totalEfficiency = 0;
  let vehiclesWithData = 0;

  vehicles.forEach((vehicle) => {
    const consumption = calculateVehicleConsumption(vehicle, movements);
    const efficiency = calculateFuelEfficiency(vehicle, movements);

    totalConsumption += consumption.totalConsumption;
    if (efficiency.efficiency > 0) {
      totalEfficiency += efficiency.efficiency;
      vehiclesWithData++;
    }
  });

  const averageEfficiency = vehiclesWithData > 0 ? totalEfficiency / vehiclesWithData : 0;

  // Estadísticas por tipo y estado
  const vehiclesByType = vehicles.reduce((acc, v) => {
    const type = v.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const vehiclesByStatus = vehicles.reduce((acc, v) => {
    const status = v.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return {
    totalVehicles,
    activeVehicles,
    totalHours,
    totalConsumption,
    averageEfficiency,
    vehiclesByType,
    vehiclesByStatus,
  };
};

// ============================================================================
// 📈 CÁLCULOS FINANCIEROS Y REPORTES
// ============================================================================

/**
 * Calcula el valor total de movimientos por período
 * @param {Array} movements - Array de movimientos
 * @param {Object} dateRange - Rango de fechas {start, end}
 * @param {Object} fuelPrices - Precios por tipo de combustible
 * @returns {Object} Análisis de valor por período
 */
export const calculatePeriodValue = (movements = [], dateRange = {}, fuelPrices = {}) => {
  if (!Array.isArray(movements)) return { totalValue: 0, movementsInPeriod: 0 };

  const { start, end } = dateRange;
  let filteredMovements = movements;

  // Filtrar por rango de fechas si se proporciona
  if (start || end) {
    filteredMovements = movements.filter((movement) => {
      const movementDate = new Date(movement.createdAt || movement.date);
      const startDate = start ? new Date(start) : new Date(0);
      const endDate = end ? new Date(end) : new Date();

      return movementDate >= startDate && movementDate <= endDate;
    });
  }

  const costs = calculateMovementCosts(filteredMovements, fuelPrices);

  return {
    totalValue: costs.totalCost,
    movementsInPeriod: filteredMovements.length,
    averageValuePerMovement: costs.averageCostPerMovement,
    valueByType: costs.costsByType,
    valueByLocation: costs.costsByLocation,
  };
};

/**
 * Calcula costos por ubicación
 * @param {Array} movements - Array de movimientos
 * @param {string} location - Ubicación específica
 * @param {Object} fuelPrices - Precios por tipo de combustible
 * @returns {Object} Análisis de costos por ubicación
 */
export const calculateLocationCosts = (movements = [], location, fuelPrices = {}) => {
  if (!Array.isArray(movements) || !location) return { totalCost: 0, movementsCount: 0 };

  const locationMovements = movements.filter(
    (m) => m.sourceLocation === location || m.targetLocation === location || m.location === location
  );

  const costs = calculateMovementCosts(locationMovements, fuelPrices);

  return {
    location,
    totalCost: costs.totalCost,
    movementsCount: locationMovements.length,
    averageCostPerMovement: costs.averageCostPerMovement,
    costsByType: costs.costsByType,
  };
};

/**
 * Calcula proyecciones de consumo y compras
 * @param {Array} movements - Historial de movimientos
 * @param {number} projectionDays - Días a proyectar (default: 30)
 * @returns {Object} Proyecciones de consumo
 */
export const calculateConsumptionProjections = (movements = [], projectionDays = 30) => {
  if (!Array.isArray(movements) || movements.length === 0) {
    return { projectedConsumption: {}, recommendedPurchases: {}, confidence: 0 };
  }

  // Calcular consumo promedio diario por tipo de combustible
  const outboundMovements = movements.filter(
    (m) => m.type === 'salida' && m.status === 'completado'
  );

  if (outboundMovements.length === 0) {
    return { projectedConsumption: {}, recommendedPurchases: {}, confidence: 0 };
  }

  // Obtener rango de fechas para calcular promedio diario
  const dates = outboundMovements.map((m) => new Date(m.createdAt || m.date));
  const oldestDate = new Date(Math.min(...dates));
  const newestDate = new Date(Math.max(...dates));
  const totalDays = Math.max(1, (newestDate - oldestDate) / (1000 * 60 * 60 * 24));

  // Calcular consumo por tipo de combustible
  const consumptionByType = outboundMovements.reduce((acc, m) => {
    const fuelType = m.fuelType;
    if (!acc[fuelType]) acc[fuelType] = 0;
    acc[fuelType] += parseFloat(m.quantity) || 0;
    return acc;
  }, {});

  // Calcular proyecciones
  const projectedConsumption = {};
  const recommendedPurchases = {};

  Object.entries(consumptionByType).forEach(([fuelType, totalConsumption]) => {
    const dailyAverage = totalConsumption / totalDays;
    const projectedTotal = dailyAverage * projectionDays;

    projectedConsumption[fuelType] = {
      dailyAverage,
      projectedTotal,
      projectionDays,
      historicalTotal: totalConsumption,
      historicalDays: totalDays,
    };

    // Recomendar compras con 20% de buffer
    recommendedPurchases[fuelType] = Math.ceil(projectedTotal * 1.2);
  });

  // Calcular nivel de confianza basado en cantidad de datos
  const confidence = Math.min(100, (outboundMovements.length / 10) * 100);

  return {
    projectedConsumption,
    recommendedPurchases,
    confidence,
    dataPoints: outboundMovements.length,
    projectionDays,
  };
};

// ============================================================================
// 🏪 FUNCIONES PREPARATORIAS PARA MÓDULO PROVEEDORES (FUTURO)
// ============================================================================

/**
 * Calcula comparación de precios entre proveedores
 * @param {Array} suppliers - Array de proveedores
 * @param {string} fuelType - Tipo de combustible
 * @returns {Object} Análisis de precios
 */
export const calculatePriceComparisons = (suppliers = [], fuelType) => {
  if (!Array.isArray(suppliers) || !fuelType)
    return { bestPrice: null, priceRange: {}, savings: 0 };

  const relevantSuppliers = suppliers.filter(
    (s) => s.fuelTypes && s.fuelTypes.includes(fuelType) && s.currentPrice
  );

  if (relevantSuppliers.length === 0) return { bestPrice: null, priceRange: {}, savings: 0 };

  const prices = relevantSuppliers.map((s) => parseFloat(s.currentPrice) || 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  const bestSupplier = relevantSuppliers.find((s) => parseFloat(s.currentPrice) === minPrice);
  const savings = maxPrice - minPrice;
  const savingsPercentage = maxPrice > 0 ? (savings / maxPrice) * 100 : 0;

  return {
    bestPrice: {
      supplier: bestSupplier,
      price: minPrice,
    },
    priceRange: {
      min: minPrice,
      max: maxPrice,
      average: avgPrice,
    },
    savings,
    savingsPercentage,
    suppliersCount: relevantSuppliers.length,
  };
};

// ============================================================================
// 🔧 FUNCIONES UTILITARIAS
// ============================================================================

/**
 * Formatea números como moneda colombiana
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea números con separadores de miles
 * @param {number} number - Número a formatear
 * @param {number} decimals - Decimales a mostrar (default: 2)
 * @returns {string} Número formateado
 */
export const formatNumber = (number, decimals = 2) => {
  if (typeof number !== 'number' || isNaN(number)) return '0';

  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Formatea porcentajes
 * @param {number} value - Valor decimal (0.15 = 15%)
 * @param {number} decimals - Decimales a mostrar (default: 1)
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number' || isNaN(value)) return '0%';

  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Valida que un valor numérico sea válido y positivo
 * @param {any} value - Valor a validar
 * @param {number} min - Valor mínimo permitido (default: 0)
 * @returns {boolean} True si es válido
 */
export const isValidPositiveNumber = (value, min = 0) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && isFinite(num);
};

// ============================================================================
// 🧮 ARITMÉTICA DECIMAL PRECISA
// ============================================================================

/**
 * Suma dos números con precisión decimal
 * @param {number} a - Primer número
 * @param {number} b - Segundo número
 * @param {number} decimals - Decimales de precisión (default: 2)
 * @returns {number} Resultado de la suma
 */
export const preciseAdd = (a, b, decimals = 2) => {
  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  return parseFloat((numA + numB).toFixed(decimals));
};

/**
 * Resta dos números con precisión decimal
 * @param {number} a - Primer número (minuendo)
 * @param {number} b - Segundo número (sustraendo)
 * @param {number} decimals - Decimales de precisión (default: 2)
 * @returns {number} Resultado de la resta
 */
export const preciseSubtract = (a, b, decimals = 2) => {
  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  return parseFloat((numA - numB).toFixed(decimals));
};

/**
 * Multiplica dos números con precisión decimal
 * @param {number} a - Primer número
 * @param {number} b - Segundo número
 * @param {number} decimals - Decimales de precisión (default: 2)
 * @returns {number} Resultado de la multiplicación
 */
export const preciseMultiply = (a, b, decimals = 2) => {
  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  return parseFloat((numA * numB).toFixed(decimals));
};

/**
 * Divide dos números con precisión decimal
 * @param {number} a - Dividendo
 * @param {number} b - Divisor
 * @param {number} decimals - Decimales de precisión (default: 2)
 * @returns {number} Resultado de la división
 */
export const preciseDivide = (a, b, decimals = 2) => {
  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  if (numB === 0) return 0;
  return parseFloat((numA / numB).toFixed(decimals));
};

/**
 * Redondea un número a la precisión especificada
 * @param {number} value - Valor a redondear
 * @param {number} decimals - Decimales de precisión (default: 2)
 * @returns {number} Número redondeado
 */
export const preciseRound = (value, decimals = 2) => {
  const num = parseFloat(value) || 0;
  return parseFloat(num.toFixed(decimals));
};

// Exportación por defecto de todas las funciones principales
export default {
  // Inventario
  calculateTotalInventoryValue,
  calculateAvailableStock,
  calculateCapacityPercentage,
  calculateLowStockAlerts,
  calculateInventoryStats,

  // Movimientos
  validateStockAvailability,
  calculateResultingStock,
  calculateMovementCosts,
  calculateMovementsStats,

  // Vehículos
  calculateVehicleConsumption,
  calculateFuelEfficiency,
  calculateOperationalCosts,
  calculateVehiclesStats,

  // Financiero y Reportes
  calculatePeriodValue,
  calculateLocationCosts,
  calculateConsumptionProjections,

  // Proveedores (futuro)
  calculatePriceComparisons,

  // Utilidades
  formatCurrency,
  formatNumber,
  formatPercentage,
  isValidPositiveNumber,

  // Aritmética precisa
  preciseAdd,
  preciseSubtract,
  preciseMultiply,
  preciseDivide,
  preciseRound,
};

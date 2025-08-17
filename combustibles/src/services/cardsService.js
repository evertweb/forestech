/**
 * cardsService.js - Servicio centralizado para gestión de cards y métricas
 * Unifica cálculos y configuraciones para evitar duplicación entre pestañas
 */

import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  calculateInventoryStats,
  calculateVehiclesStats,
  calculateLowStockAlerts,
  calculateConsumptionProjections,
} from '../utils/calculations';
import { FUEL_INFO } from '../constants/combustibleTypes';

// ============================================================================
// CONFIGURACIÓN DE CARDS COMUNES
// ============================================================================

export const CARD_TYPES = {
  // Cards comunes
  VALOR_TOTAL_INVENTARIO: 'valor_total_inventario',
  VEHICULOS_ACTIVOS: 'vehiculos_activos',
  ALERTAS_STOCK: 'alertas_stock',
  COMBUSTIBLE_TOTAL: 'combustible_total',

  // Cards específicas Dashboard
  STOCK_POR_UBICACION: 'stock_por_ubicacion',
  TENDENCIAS_CONSUMO: 'tendencias_consumo',
  PROXIMOS_MANTENIMIENTOS: 'proximos_mantenimientos',
  MOVIMIENTOS_PENDIENTES_UBICACION: 'movimientos_pendientes_ubicacion',
  EFICIENCIA_OPERACIONAL: 'eficiencia_operacional',

  // Cards específicas Inventario
  STOCK_DETALLADO_UBICACION: 'stock_detallado_ubicacion',
  HISTORIAL_REABASTECIMIENTOS: 'historial_reabastecimientos',
  TIEMPO_PROMEDIO_REABASTECIMIENTOS: 'tiempo_promedio_reabastecimientos',
  PROYECCIONES_AGOTAMIENTO: 'proyecciones_agotamiento',
  COMPARACION_CAPACIDAD_USO: 'comparacion_capacidad_uso',
  TOP_PRODUCTOS_ROTACION: 'top_productos_rotacion',

  // Cards específicas Reportes
  ANALISIS_COSTOS_UBICACION: 'analisis_costos_ubicacion',
  ROI_COMBUSTIBLE: 'roi_combustible',
  COMPARACION_PERIODOS: 'comparacion_periodos',
  PREDICCIONES_DEMANDA: 'predicciones_demanda',
  ANALISIS_DESPERDICIOS: 'analisis_desperdicios',
  METRICAS_EFICIENCIA: 'metricas_eficiencia',
};

// ============================================================================
// SERVICIO PRINCIPAL DE CARDS
// ============================================================================

export class CardsService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutos
    // Limpiar cache al inicializar para evitar datos obsoletos
    this.clearCache();
  }

  // --------------------------------------------------------------------------
  // MÉTODOS DE CACHE
  // --------------------------------------------------------------------------

  getCacheKey(cardType, params = {}) {
    // Incluir el length de los datos en la cache key para evitar cache con datos vacíos
    const dataLength =
      (params.inventory?.length || 0) +
      (params.vehicles?.length || 0) +
      (params.movements?.length || 0);
    return `${cardType}_${dataLength}_${JSON.stringify(params)}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Invalidar cache cuando cambien los datos
  invalidateCache() {
    console.log('🗑️ CardsService: Cache invalidado');
    this.clearCache();
  }

  // --------------------------------------------------------------------------
  // CARDS COMUNES
  // --------------------------------------------------------------------------

  getValorTotalInventarioCard(inventory) {
    console.log(
      '🔍 CardsService - getValorTotalInventarioCard llamado con:',
      inventory.length,
      'items'
    );

    // No usar cache si no hay datos
    if (inventory.length === 0) {
      console.log('⚠️ No hay datos de inventario, no usar cache');
      const stats = calculateInventoryStats(inventory);
      return {
        id: CARD_TYPES.VALOR_TOTAL_INVENTARIO,
        title: 'Valor Total Inventario',
        icon: '💰',
        value: formatCurrency(stats.totalValue),
        subtitle: `${stats.totalItems} productos activos`,
        trend: {
          type: 'neutral',
          text: 'Cargando datos...',
          icon: '⏳',
        },
        rawValue: stats.totalValue,
        category: 'financial',
      };
    }

    const cacheKey = this.getCacheKey(CARD_TYPES.VALOR_TOTAL_INVENTARIO, { inventory });
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log('⚡ Retornando card desde cache:', cached.value);
      return cached;
    }

    console.log('🆕 Generando nueva card (no encontrada en cache)');

    const stats = calculateInventoryStats(inventory);
    console.log('📊 Stats calculadas:', stats);

    const card = {
      id: CARD_TYPES.VALOR_TOTAL_INVENTARIO,
      title: 'Valor Total Inventario',
      icon: '💰',
      value: formatCurrency(stats.totalValue),
      subtitle: `${stats.totalItems} productos activos`,
      trend: {
        type: stats.totalValue > 50000000 ? 'positive' : 'neutral',
        text: stats.totalValue > 50000000 ? 'Inventario saludable' : 'Revisar stock',
        icon: stats.totalValue > 50000000 ? '📈' : '⚠️',
      },
      rawValue: stats.totalValue,
      category: 'financial',
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getVehiculosActivosCard(vehicles, movements) {
    // No usar cache si no hay datos
    if (vehicles.length === 0) {
      return {
        id: CARD_TYPES.VEHICULOS_ACTIVOS,
        title: 'Vehículos Activos',
        icon: '🚜',
        value: '0',
        subtitle: 'Cargando vehículos...',
        trend: {
          type: 'neutral',
          text: 'Cargando...',
          icon: '⏳',
        },
        rawValue: 0,
        category: 'operations',
      };
    }

    const cacheKey = this.getCacheKey(CARD_TYPES.VEHICULOS_ACTIVOS, { vehicles, movements });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const stats = calculateVehiclesStats(vehicles, movements);

    const card = {
      id: CARD_TYPES.VEHICULOS_ACTIVOS,
      title: 'Vehículos Activos',
      icon: '🚜',
      value: stats.activeVehicles.toString(),
      subtitle: `${formatNumber(stats.totalHours)} horas trabajadas`,
      trend: {
        type: stats.activeVehicles > 0 ? 'positive' : 'negative',
        text: stats.activeVehicles > 0 ? 'Operativos' : 'Sin actividad',
        icon: stats.activeVehicles > 0 ? '✅' : '⚠️',
      },
      rawValue: stats.activeVehicles,
      category: 'operations',
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getAlertasStockCard(inventory) {
    const cacheKey = this.getCacheKey(CARD_TYPES.ALERTAS_STOCK);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const alerts = calculateLowStockAlerts(inventory);
    const criticalAlerts = alerts.filter((alert) => alert.stockLevel === 'critical').length;

    const card = {
      id: CARD_TYPES.ALERTAS_STOCK,
      title: 'Alertas de Stock',
      icon: '⚠️',
      value: alerts.length.toString(),
      subtitle: `${criticalAlerts} críticas`,
      trend: {
        type: alerts.length === 0 ? 'positive' : 'negative',
        text: alerts.length === 0 ? 'Todo normal' : 'Requiere atención',
        icon: alerts.length === 0 ? '✅' : '🚨',
      },
      rawValue: alerts.length,
      category: 'alerts',
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getCombustibleTotalCard(inventory) {
    // No usar cache si no hay datos
    if (inventory.length === 0) {
      return {
        id: CARD_TYPES.COMBUSTIBLE_TOTAL,
        title: 'Combustible Total',
        icon: '🛢️',
        value: '0,00',
        subtitle: 'galones disponibles',
        trend: {
          type: 'neutral',
          text: 'Cargando...',
          icon: '⏳',
        },
        rawValue: 0,
        category: 'inventory',
      };
    }

    const cacheKey = this.getCacheKey(CARD_TYPES.COMBUSTIBLE_TOTAL, { inventory });
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const totalFuel = inventory
      .filter((item) => item.status === 'active')
      .reduce((sum, item) => sum + (parseFloat(item.currentStock) || 0), 0);

    const card = {
      id: CARD_TYPES.COMBUSTIBLE_TOTAL,
      title: 'Combustible Total',
      icon: '🛢️',
      value: formatNumber(totalFuel),
      subtitle: 'galones disponibles',
      trend: {
        type: totalFuel > 1000 ? 'positive' : 'negative',
        text: totalFuel > 1000 ? 'Suficiente' : 'Revisar stock',
        icon: totalFuel > 1000 ? '📈' : '📉',
      },
      rawValue: totalFuel,
      category: 'inventory',
    };

    this.setCache(cacheKey, card);
    return card;
  }

  // --------------------------------------------------------------------------
  // CARDS ESPECÍFICAS DASHBOARD
  // --------------------------------------------------------------------------

  getStockPorUbicacionCard(inventory) {
    const cacheKey = this.getCacheKey(CARD_TYPES.STOCK_POR_UBICACION);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const stockByLocation = {};
    inventory.forEach((item) => {
      if (item.location && item.status === 'active') {
        if (!stockByLocation[item.location]) {
          stockByLocation[item.location] = 0;
        }
        stockByLocation[item.location] += parseFloat(item.currentStock) || 0;
      }
    });

    const locations = Object.keys(stockByLocation);
    const totalLocations = locations.length;
    const mainLocation = locations.reduce(
      (a, b) => (stockByLocation[a] > stockByLocation[b] ? a : b),
      locations[0] || ''
    );

    const card = {
      id: CARD_TYPES.STOCK_POR_UBICACION,
      title: 'Stock por Ubicación',
      icon: '📍',
      value: totalLocations.toString(),
      subtitle: `Principal: ${mainLocation}`,
      trend: {
        type: 'info',
        text: `${formatNumber(stockByLocation[mainLocation] || 0)} gal`,
        icon: '🏭',
      },
      rawValue: stockByLocation,
      category: 'locations',
      details: stockByLocation,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getTendenciasConsumoCard(movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.TENDENCIAS_CONSUMO);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentMovements = movements.filter((m) => {
      const date = new Date(m.createdAt || m.date);
      return date >= lastWeek && m.type === 'salida';
    });

    const weeklyConsumption = recentMovements.reduce(
      (sum, m) => sum + (parseFloat(m.quantity) || 0),
      0
    );
    const dailyAverage = weeklyConsumption / 7;

    const card = {
      id: CARD_TYPES.TENDENCIAS_CONSUMO,
      title: 'Tendencia Semanal',
      icon: '📊',
      value: formatNumber(weeklyConsumption),
      subtitle: 'galones última semana',
      trend: {
        type: 'info',
        text: `${formatNumber(dailyAverage, 1)} gal/día promedio`,
        icon: '📈',
      },
      rawValue: weeklyConsumption,
      category: 'trends',
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getProximosMantenimientosCard(vehicles) {
    const cacheKey = this.getCacheKey(CARD_TYPES.PROXIMOS_MANTENIMIENTOS);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const vehiclesDiesel = vehicles.filter((v) => v.fuelType === 'DIESEL' && v.status === 'activo');

    const nearMaintenance = vehiclesDiesel.filter((v) => {
      const currentHours = parseFloat(v.currentHours) || 0;
      const nextMaintenanceHours = Math.ceil(currentHours / 250) * 250;
      const hoursToMaintenance = nextMaintenanceHours - currentHours;
      return hoursToMaintenance <= 50;
    });

    const card = {
      id: CARD_TYPES.PROXIMOS_MANTENIMIENTOS,
      title: 'Próximos Mantenimientos',
      icon: '🔧',
      value: nearMaintenance.length.toString(),
      subtitle: 'vehículos ≤50 horas',
      trend: {
        type: nearMaintenance.length > 0 ? 'warning' : 'positive',
        text: nearMaintenance.length > 0 ? 'Programar pronto' : 'Al día',
        icon: nearMaintenance.length > 0 ? '⚠️' : '✅',
      },
      rawValue: nearMaintenance.length,
      category: 'maintenance',
      details: nearMaintenance,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getMovimientosPendientesUbicacionCard(movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.MOVIMIENTOS_PENDIENTES_UBICACION);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const pendingMovements = movements.filter((m) => m.status === 'pendiente');
    const pendingByLocation = {};

    pendingMovements.forEach((m) => {
      const location = m.location || m.sourceLocation || 'Sin ubicación';
      pendingByLocation[location] = (pendingByLocation[location] || 0) + 1;
    });

    const totalPending = pendingMovements.length;
    const mainLocation = Object.keys(pendingByLocation).reduce(
      (a, b) => (pendingByLocation[a] > pendingByLocation[b] ? a : b),
      'Sin ubicación'
    );

    const card = {
      id: CARD_TYPES.MOVIMIENTOS_PENDIENTES_UBICACION,
      title: 'Movimientos Pendientes',
      icon: '⏳',
      value: totalPending.toString(),
      subtitle: `Principal: ${mainLocation}`,
      trend: {
        type: totalPending > 0 ? 'warning' : 'positive',
        text: totalPending > 0 ? 'Procesar pronto' : 'Al día',
        icon: totalPending > 0 ? '⚠️' : '✅',
      },
      rawValue: totalPending,
      category: 'operations',
      details: pendingByLocation,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getEficienciaOperacionalCard(vehicles, movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.EFICIENCIA_OPERACIONAL);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const vehicleTypes = [...new Set(vehicles.map((v) => v.type))];
    const efficiencyByType = {};

    vehicleTypes.forEach((type) => {
      const typeVehicles = vehicles.filter((v) => v.type === type);
      const totalConsumption = typeVehicles.reduce((sum, v) => {
        const vehicleMovements = movements.filter((m) => m.vehicleId === v.vehicleId);
        const consumption = vehicleMovements.reduce(
          (vSum, m) => vSum + (parseFloat(m.quantity) || 0),
          0
        );
        return sum + consumption;
      }, 0);

      const totalHours = typeVehicles.reduce(
        (sum, v) => sum + (parseFloat(v.totalHoursWorked) || 0),
        0
      );

      efficiencyByType[type] = totalHours > 0 ? totalConsumption / totalHours : 0;
    });

    const avgEfficiency =
      Object.values(efficiencyByType).length > 0
        ? Object.values(efficiencyByType).reduce((a, b) => a + b, 0) /
          Object.values(efficiencyByType).length
        : 0;

    const card = {
      id: CARD_TYPES.EFICIENCIA_OPERACIONAL,
      title: 'Eficiencia Operacional',
      icon: '⚡',
      value: formatNumber(avgEfficiency, 1),
      subtitle: 'L/h promedio general',
      trend: {
        type: avgEfficiency < 8 ? 'positive' : 'warning',
        text: avgEfficiency < 8 ? 'Eficiente' : 'Revisar',
        icon: avgEfficiency < 8 ? '🎯' : '⚠️',
      },
      rawValue: avgEfficiency,
      category: 'efficiency',
      details: efficiencyByType,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  // --------------------------------------------------------------------------
  // CARDS ESPECÍFICAS INVENTARIO
  // --------------------------------------------------------------------------

  getStockDetalladoUbicacionCard(inventory) {
    const cacheKey = this.getCacheKey(CARD_TYPES.STOCK_DETALLADO_UBICACION);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const locationDetails = {};
    inventory.forEach((item) => {
      if (item.location && item.status === 'active') {
        if (!locationDetails[item.location]) {
          locationDetails[item.location] = {
            totalStock: 0,
            totalCapacity: 0,
            items: 0,
            fuelTypes: new Set(),
          };
        }

        locationDetails[item.location].totalStock += parseFloat(item.currentStock) || 0;
        locationDetails[item.location].totalCapacity += parseFloat(item.maxCapacity) || 0;
        locationDetails[item.location].items += 1;
        locationDetails[item.location].fuelTypes.add(item.fuelType);
      }
    });

    // Convertir Set a Array para serialización
    Object.keys(locationDetails).forEach((location) => {
      locationDetails[location].fuelTypes = Array.from(locationDetails[location].fuelTypes);
      locationDetails[location].percentage =
        locationDetails[location].totalCapacity > 0
          ? (locationDetails[location].totalStock / locationDetails[location].totalCapacity) * 100
          : 0;
    });

    const totalLocations = Object.keys(locationDetails).length;
    const avgUtilization =
      Object.values(locationDetails).reduce((sum, loc) => sum + loc.percentage, 0) /
      (totalLocations || 1);

    const card = {
      id: CARD_TYPES.STOCK_DETALLADO_UBICACION,
      title: 'Stock Detallado por Ubicación',
      icon: '🏭',
      value: totalLocations.toString(),
      subtitle: 'ubicaciones activas',
      trend: {
        type: avgUtilization > 60 ? 'positive' : avgUtilization > 30 ? 'warning' : 'negative',
        text: `${formatNumber(avgUtilization, 1)}% utilización promedio`,
        icon: avgUtilization > 60 ? '📈' : avgUtilization > 30 ? '📊' : '📉',
      },
      rawValue: totalLocations,
      category: 'inventory',
      details: locationDetails,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getHistorialReabastecimientosCard(movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.HISTORIAL_REABASTECIMIENTOS);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentEntries = movements.filter((m) => {
      const date = new Date(m.createdAt || m.date);
      return date >= last30Days && m.type === 'entrada';
    });

    const totalRestock = recentEntries.reduce((sum, m) => sum + (parseFloat(m.quantity) || 0), 0);

    const restockByFuel = {};
    recentEntries.forEach((m) => {
      const fuelType = m.fuelType || 'Unknown';
      restockByFuel[fuelType] = (restockByFuel[fuelType] || 0) + (parseFloat(m.quantity) || 0);
    });

    const card = {
      id: CARD_TYPES.HISTORIAL_REABASTECIMIENTOS,
      title: 'Reabastecimientos (30 días)',
      icon: '📦',
      value: recentEntries.length.toString(),
      subtitle: `${formatNumber(totalRestock)} gal ingresados`,
      trend: {
        type: recentEntries.length > 0 ? 'positive' : 'warning',
        text: recentEntries.length > 0 ? 'Actividad normal' : 'Sin reabastecimientos',
        icon: recentEntries.length > 0 ? '✅' : '⚠️',
      },
      rawValue: recentEntries.length,
      category: 'inventory',
      details: restockByFuel,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getTiempoPromedioReabastecimientosCard(movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.TIEMPO_PROMEDIO_REABASTECIMIENTOS);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const entries = movements
      .filter((m) => m.type === 'entrada')
      .sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));

    let totalDaysBetween = 0;
    let intervals = 0;

    for (let i = 1; i < entries.length; i++) {
      const currentDate = new Date(entries[i].createdAt || entries[i].date);
      const previousDate = new Date(entries[i - 1].createdAt || entries[i - 1].date);
      const daysBetween = (currentDate - previousDate) / (1000 * 60 * 60 * 24);

      if (daysBetween > 0 && daysBetween < 365) {
        // Filtrar intervalos razonables
        totalDaysBetween += daysBetween;
        intervals++;
      }
    }

    const averageDays = intervals > 0 ? totalDaysBetween / intervals : 0;

    const card = {
      id: CARD_TYPES.TIEMPO_PROMEDIO_REABASTECIMIENTOS,
      title: 'Tiempo Promedio entre Reabastecimientos',
      icon: '⏱️',
      value: formatNumber(averageDays, 0),
      subtitle: 'días promedio',
      trend: {
        type:
          averageDays > 0 && averageDays < 30
            ? 'positive'
            : averageDays >= 30 && averageDays < 60
              ? 'warning'
              : 'negative',
        text:
          averageDays > 0 && averageDays < 30
            ? 'Frecuencia alta'
            : averageDays >= 30 && averageDays < 60
              ? 'Frecuencia media'
              : 'Frecuencia baja',
        icon:
          averageDays > 0 && averageDays < 30
            ? '🔄'
            : averageDays >= 30 && averageDays < 60
              ? '📅'
              : '⚠️',
      },
      rawValue: averageDays,
      category: 'inventory',
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getProyeccionesAgotamientoCard(inventory, movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.PROYECCIONES_AGOTAMIENTO);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const projections = calculateConsumptionProjections(movements);

    const criticalProducts = [];
    inventory.forEach((item) => {
      if (item.status === 'active') {
        const currentStock = parseFloat(item.currentStock) || 0;
        const fuelProjection = projections.projectedConsumption[item.fuelType];

        if (fuelProjection && fuelProjection.dailyAverage > 0) {
          const daysUntilEmpty = currentStock / fuelProjection.dailyAverage;
          if (daysUntilEmpty <= 30) {
            // Productos que se agotan en 30 días o menos
            criticalProducts.push({
              ...item,
              daysUntilEmpty: Math.floor(daysUntilEmpty),
            });
          }
        }
      }
    });

    const avgDaysUntilEmpty =
      criticalProducts.length > 0
        ? criticalProducts.reduce((sum, p) => sum + p.daysUntilEmpty, 0) / criticalProducts.length
        : 0;

    const card = {
      id: CARD_TYPES.PROYECCIONES_AGOTAMIENTO,
      title: 'Proyecciones de Agotamiento',
      icon: '⏰',
      value: criticalProducts.length.toString(),
      subtitle: 'productos críticos (≤30 días)',
      trend: {
        type:
          criticalProducts.length === 0
            ? 'positive'
            : criticalProducts.length <= 3
              ? 'warning'
              : 'negative',
        text:
          criticalProducts.length === 0
            ? 'Stock seguro'
            : `${formatNumber(avgDaysUntilEmpty, 0)} días promedio`,
        icon: criticalProducts.length === 0 ? '✅' : criticalProducts.length <= 3 ? '⚠️' : '🚨',
      },
      rawValue: criticalProducts.length,
      category: 'inventory',
      details: criticalProducts,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getComparacionCapacidadUsoCard(inventory) {
    const cacheKey = this.getCacheKey(CARD_TYPES.COMPARACION_CAPACIDAD_USO);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const activeItems = inventory.filter((item) => item.status === 'active');
    const totalCapacity = activeItems.reduce(
      (sum, item) => sum + (parseFloat(item.maxCapacity) || 0),
      0
    );
    const totalUsed = activeItems.reduce(
      (sum, item) => sum + (parseFloat(item.currentStock) || 0),
      0
    );

    const utilizationPercentage = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;
    const unusedCapacity = totalCapacity - totalUsed;

    const card = {
      id: CARD_TYPES.COMPARACION_CAPACIDAD_USO,
      title: 'Capacidad vs Uso Real',
      icon: '📏',
      value: formatPercentage(utilizationPercentage / 100),
      subtitle: 'utilización de capacidad',
      trend: {
        type:
          utilizationPercentage > 80
            ? 'warning'
            : utilizationPercentage > 40
              ? 'positive'
              : 'negative',
        text: `${formatNumber(unusedCapacity)} gal disponibles`,
        icon: utilizationPercentage > 80 ? '⚠️' : utilizationPercentage > 40 ? '✅' : '📉',
      },
      rawValue: utilizationPercentage,
      category: 'inventory',
      details: {
        totalCapacity,
        totalUsed,
        unusedCapacity,
        utilizationPercentage,
      },
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getTopProductosRotacionCard(inventory, movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.TOP_PRODUCTOS_ROTACION);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentMovements = movements.filter((m) => {
      const date = new Date(m.createdAt || m.date);
      return date >= last30Days && (m.type === 'entrada' || m.type === 'salida');
    });

    const productRotation = {};
    recentMovements.forEach((m) => {
      const key = `${m.fuelType}_${m.location || 'unknown'}`;
      if (!productRotation[key]) {
        productRotation[key] = {
          fuelType: m.fuelType,
          location: m.location,
          entries: 0,
          exits: 0,
          totalMovement: 0,
        };
      }

      const quantity = parseFloat(m.quantity) || 0;
      if (m.type === 'entrada') {
        productRotation[key].entries += quantity;
      } else if (m.type === 'salida') {
        productRotation[key].exits += quantity;
      }
      productRotation[key].totalMovement += quantity;
    });

    const topProducts = Object.values(productRotation)
      .sort((a, b) => b.totalMovement - a.totalMovement)
      .slice(0, 5);

    const totalMovement = Object.values(productRotation).reduce(
      (sum, p) => sum + p.totalMovement,
      0
    );

    const card = {
      id: CARD_TYPES.TOP_PRODUCTOS_ROTACION,
      title: 'Top Productos por Rotación',
      icon: '🔄',
      value: topProducts.length.toString(),
      subtitle: `${formatNumber(totalMovement)} gal total`,
      trend: {
        type: topProducts.length > 0 ? 'positive' : 'warning',
        text: topProducts.length > 0 ? 'Rotación activa' : 'Baja rotación',
        icon: topProducts.length > 0 ? '📈' : '📉',
      },
      rawValue: topProducts.length,
      category: 'inventory',
      details: topProducts,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  // --------------------------------------------------------------------------
  // CARDS ESPECÍFICAS REPORTES
  // --------------------------------------------------------------------------

  getAnalisisCostosUbicacionCard(movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.ANALISIS_COSTOS_UBICACION);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const costosPorUbicacion = {};
    movements.forEach((movement) => {
      const location = movement.location || movement.sourceLocation || 'Sin ubicación';
      const costo = (parseFloat(movement.quantity) || 0) * (parseFloat(movement.unitPrice) || 0);
      costosPorUbicacion[location] = (costosPorUbicacion[location] || 0) + costo;
    });

    const ubicaciones = Object.keys(costosPorUbicacion);
    const costoTotal = Object.values(costosPorUbicacion).reduce((sum, cost) => sum + cost, 0);
    const ubicacionMasCostosa = ubicaciones.reduce(
      (a, b) => (costosPorUbicacion[a] > costosPorUbicacion[b] ? a : b),
      ubicaciones[0] || ''
    );

    const card = {
      id: CARD_TYPES.ANALISIS_COSTOS_UBICACION,
      title: 'Costos por Ubicación',
      icon: '🏭',
      value: formatCurrency(costoTotal),
      subtitle: `${ubicaciones.length} ubicaciones analizadas`,
      trend: {
        type: 'info',
        text: `Mayor costo: ${ubicacionMasCostosa}`,
        icon: '📊',
      },
      rawValue: costoTotal,
      category: 'financial',
      details: costosPorUbicacion,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getRoiCombustibleCard(movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.ROI_COMBUSTIBLE);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const roiPorTipo = {};
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const recentMovements = movements.filter((m) => {
      const date = new Date(m.createdAt || m.date);
      return date >= last30Days;
    });

    // Calcular entrada vs salida por tipo de combustible
    recentMovements.forEach((movement) => {
      const fuelType = movement.fuelType || 'Desconocido';
      const valor = (parseFloat(movement.quantity) || 0) * (parseFloat(movement.unitPrice) || 0);

      if (!roiPorTipo[fuelType]) {
        roiPorTipo[fuelType] = { entradas: 0, salidas: 0 };
      }

      if (movement.type === 'entrada') {
        roiPorTipo[fuelType].entradas += valor;
      } else if (movement.type === 'salida') {
        roiPorTipo[fuelType].salidas += valor;
      }
    });

    // Calcular ROI promedio
    const rois = Object.values(roiPorTipo).map((data) => {
      if (data.entradas === 0) return 0;
      return ((data.salidas - data.entradas) / data.entradas) * 100;
    });

    const roiPromedio = rois.length > 0 ? rois.reduce((sum, roi) => sum + roi, 0) / rois.length : 0;

    const card = {
      id: CARD_TYPES.ROI_COMBUSTIBLE,
      title: 'ROI Combustibles (30d)',
      icon: '📈',
      value: `${formatNumber(roiPromedio, 1)}%`,
      subtitle: 'retorno de inversión promedio',
      trend: {
        type: roiPromedio > 0 ? 'positive' : roiPromedio < 0 ? 'negative' : 'neutral',
        text: roiPromedio > 0 ? 'Rentable' : roiPromedio < 0 ? 'Pérdidas' : 'Equilibrio',
        icon: roiPromedio > 0 ? '💰' : roiPromedio < 0 ? '📉' : '⚖️',
      },
      rawValue: roiPromedio,
      category: 'financial',
      details: roiPorTipo,
    };

    this.setCache(cacheKey, card);
    return card;
  }

  getComparacionPeriodosCard(movements) {
    const cacheKey = this.getCacheKey(CARD_TYPES.COMPARACION_PERIODOS);
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const ahora = new Date();
    const mesActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
    const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

    const movimientosMesActual = movements.filter((m) => {
      const date = new Date(m.createdAt || m.date);
      return date >= mesActual;
    });

    const movimientosMesAnterior = movements.filter((m) => {
      const date = new Date(m.createdAt || m.date);
      return date >= mesAnterior && date <= finMesAnterior;
    });

    const cantidadActual = movimientosMesActual.length;
    const cantidadAnterior = movimientosMesAnterior.length;
    const cambio =
      cantidadAnterior > 0 ? ((cantidadActual - cantidadAnterior) / cantidadAnterior) * 100 : 0;

    const card = {
      id: CARD_TYPES.COMPARACION_PERIODOS,
      title: 'Mes Actual vs Anterior',
      icon: '📅',
      value: cantidadActual.toString(),
      subtitle: 'movimientos este mes',
      trend: {
        type: cambio > 0 ? 'positive' : cambio < 0 ? 'negative' : 'neutral',
        text: `${cambio > 0 ? '+' : ''}${formatNumber(cambio, 1)}% vs mes anterior`,
        icon: cambio > 0 ? '📈' : cambio < 0 ? '📉' : '➡️',
      },
      rawValue: cantidadActual,
      category: 'trends',
      details: {
        mesActual: cantidadActual,
        mesAnterior: cantidadAnterior,
        cambioAbsoluto: cantidadActual - cantidadAnterior,
        cambioPorcentual: cambio,
      },
    };

    this.setCache(cacheKey, card);
    return card;
  }

  // --------------------------------------------------------------------------
  // MÉTODO PRINCIPAL PARA OBTENER CARDS POR PESTAÑA
  // --------------------------------------------------------------------------

  getCardsForTab(tabName, data) {
    const { inventory = [], vehicles = [], movements = [] } = data;

    console.log('🎯 CardsService - getCardsForTab llamado:');
    console.log('  - Tab:', tabName);
    console.log('  - Inventory items:', inventory.length);
    console.log('  - Vehicles items:', vehicles.length);
    console.log('  - Movements items:', movements.length);

    switch (tabName) {
      case 'dashboard':
        return [
          this.getValorTotalInventarioCard(inventory),
          this.getCombustibleTotalCard(inventory),
          this.getVehiculosActivosCard(vehicles, movements),
          this.getAlertasStockCard(inventory),
          this.getStockPorUbicacionCard(inventory),
          this.getTendenciasConsumoCard(movements),
          this.getProximosMantenimientosCard(vehicles),
          this.getMovimientosPendientesUbicacionCard(movements),
          this.getEficienciaOperacionalCard(vehicles, movements),
        ];

      case 'inventory':
        return [
          this.getValorTotalInventarioCard(inventory),
          this.getCombustibleTotalCard(inventory),
          this.getAlertasStockCard(inventory),
          this.getStockDetalladoUbicacionCard(inventory),
          this.getHistorialReabastecimientosCard(movements),
          this.getTiempoPromedioReabastecimientosCard(movements),
          this.getProyeccionesAgotamientoCard(inventory, movements),
          this.getComparacionCapacidadUsoCard(inventory),
          this.getTopProductosRotacionCard(inventory, movements),
        ];

      case 'reports':
        return [
          this.getValorTotalInventarioCard(inventory),
          this.getVehiculosActivosCard(vehicles, movements),
          this.getAlertasStockCard(inventory),
          this.getAnalisisCostosUbicacionCard(movements),
          this.getRoiCombustibleCard(movements),
          this.getComparacionPeriodosCard(movements),
        ];

      default:
        return [];
    }
  }
}

// Instancia singleton del servicio
export const cardsService = new CardsService();

// Funciones de conveniencia
export const getCardsForDashboard = (data) => cardsService.getCardsForTab('dashboard', data);
export const getCardsForInventory = (data) => cardsService.getCardsForTab('inventory', data);
export const getCardsForReports = (data) => cardsService.getCardsForTab('reports', data);

export default cardsService;

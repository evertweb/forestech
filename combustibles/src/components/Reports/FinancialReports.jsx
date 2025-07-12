/**
 * FinancialReports.jsx - Reportes financieros y análisis de costos
 * ROI, análisis de proveedores, proyecciones financieras y presupuestos
 */

import React, { useMemo, useState } from 'react';
import {
  calculateMovementCosts,
  calculatePeriodValue,
  calculateLocationCosts,
  calculateConsumptionProjections,
  // eslint-disable-next-line no-unused-vars
  calculateOperationalCosts,
  formatCurrency,
  formatNumber,
  formatPercentage
} from '../../utils/calculations';
import { MOVEMENT_TYPES } from '../../services/movementsService';
import { FUEL_INFO } from '../../constants/combustibleTypes';

// eslint-disable-next-line no-unused-vars
const FinancialReports = ({ movements, vehicles, suppliers, dateRange, inventory }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  // Filtrar movimientos por rango de fechas
  const filteredMovements = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return movements;
    
    return movements.filter(movement => {
      const movementDate = new Date(movement.createdAt || movement.date);
      const startDate = dateRange.start ? new Date(dateRange.start) : new Date(0);
      const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
      
      return movementDate >= startDate && movementDate <= endDate;
    });
  }, [movements, dateRange]);

  // Calcular período de comparación
  const comparisonData = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return null;

    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const comparisonStart = new Date(start);
    comparisonStart.setDate(comparisonStart.getDate() - daysDiff);
    const comparisonEnd = new Date(start);

    const comparisonMovements = movements.filter(movement => {
      const movementDate = new Date(movement.createdAt || movement.date);
      return movementDate >= comparisonStart && movementDate < comparisonEnd;
    });

    return {
      movements: comparisonMovements,
      period: `${comparisonStart.toLocaleDateString()} - ${comparisonEnd.toLocaleDateString()}`
    };
  }, [movements, dateRange]);

  // Análisis financiero principal
  const financialAnalysis = useMemo(() => {
    const costs = calculateMovementCosts(filteredMovements);
    const periodValue = calculatePeriodValue(filteredMovements, dateRange);
    
    // Separar entradas y salidas para análisis de ROI
    const entradas = filteredMovements.filter(m => m.type === MOVEMENT_TYPES.ENTRADA);
    const salidas = filteredMovements.filter(m => m.type === MOVEMENT_TYPES.SALIDA);
    
    const entradasValue = entradas.reduce((sum, m) => 
      sum + ((parseFloat(m.quantity) || 0) * (parseFloat(m.unitPrice) || 0)), 0
    );
    const salidasValue = salidas.reduce((sum, m) => 
      sum + ((parseFloat(m.quantity) || 0) * (parseFloat(m.unitPrice) || 0)), 0
    );

    return {
      ...costs,
      ...periodValue,
      entradasValue,
      salidasValue,
      netFlow: entradasValue - salidasValue,
      turnoverRatio: entradasValue > 0 ? salidasValue / entradasValue : 0
    };
  }, [filteredMovements, dateRange]);

  // Comparación con período anterior
  const comparison = useMemo(() => {
    if (!comparisonData) return null;

    const currentCosts = calculateMovementCosts(filteredMovements);
    const previousCosts = calculateMovementCosts(comparisonData.movements);

    return {
      costChange: currentCosts.totalCost - previousCosts.totalCost,
      costChangePercent: previousCosts.totalCost > 0 
        ? ((currentCosts.totalCost - previousCosts.totalCost) / previousCosts.totalCost) * 100 
        : 0,
      movementChange: filteredMovements.length - comparisonData.movements.length,
      movementChangePercent: comparisonData.movements.length > 0
        ? ((filteredMovements.length - comparisonData.movements.length) / comparisonData.movements.length) * 100
        : 0
    };
  }, [filteredMovements, comparisonData]);

  // Análisis por ubicación
  const locationAnalysis = useMemo(() => {
    const locations = [...new Set(filteredMovements.flatMap(m => 
      [m.location, m.sourceLocation, m.destinationLocation].filter(Boolean)
    ))];

    return locations.map(location => {
      const locationCosts = calculateLocationCosts(filteredMovements, location);
      const locationMovements = filteredMovements.filter(m =>
        m.location === location || m.sourceLocation === location || m.destinationLocation === location
      );

      return {
        location,
        ...locationCosts,
        movementsPercentage: filteredMovements.length > 0 
          ? (locationMovements.length / filteredMovements.length) * 100 
          : 0
      };
    }).sort((a, b) => b.totalCost - a.totalCost);
  }, [filteredMovements]);

  // Análisis de proveedores (basado en movimientos de entrada)
  const supplierAnalysis = useMemo(() => {
    const supplierMovements = filteredMovements.filter(m => 
      m.type === MOVEMENT_TYPES.ENTRADA && m.supplierName
    );

    const supplierData = {};
    supplierMovements.forEach(movement => {
      const supplier = movement.supplierName;
      const quantity = parseFloat(movement.quantity) || 0;
      const value = quantity * (parseFloat(movement.unitPrice) || 0);

      if (!supplierData[supplier]) {
        supplierData[supplier] = {
          name: supplier,
          movementsCount: 0,
          totalQuantity: 0,
          totalValue: 0,
          avgPrice: 0,
          fuelTypes: new Set()
        };
      }

      supplierData[supplier].movementsCount++;
      supplierData[supplier].totalQuantity += quantity;
      supplierData[supplier].totalValue += value;
      supplierData[supplier].fuelTypes.add(movement.fuelType);
    });

    // Calcular precio promedio y convertir Set a Array
    Object.values(supplierData).forEach(supplier => {
      supplier.avgPrice = supplier.totalQuantity > 0 ? supplier.totalValue / supplier.totalQuantity : 0;
      supplier.fuelTypes = Array.from(supplier.fuelTypes);
    });

    return Object.values(supplierData).sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredMovements]);

  // Proyecciones financieras
  const financialProjections = useMemo(() => {
    const projections = calculateConsumptionProjections(movements);
    
    // Calcular proyección de costos basada en precios actuales
    const currentPrices = {};
    inventory.forEach(item => {
      if (item.pricePerUnit) {
        currentPrices[item.fuelType] = parseFloat(item.pricePerUnit);
      }
    });

    const projectedCosts = {};
    Object.entries(projections.recommendedPurchases).forEach(([fuelType, quantity]) => {
      const price = currentPrices[fuelType] || 0;
      projectedCosts[fuelType] = quantity * price;
    });

    const totalProjectedCost = Object.values(projectedCosts).reduce((sum, cost) => sum + cost, 0);

    return {
      ...projections,
      projectedCosts,
      totalProjectedCost,
      currentPrices
    };
  }, [movements, inventory]);

  // Top costos por categoría
  const topCosts = useMemo(() => {
    const categoryCosts = {};
    
    filteredMovements.forEach(movement => {
      // Determinar categoría basada en el tipo de movimiento y combustible
      let category = movement.type;
      if (movement.vehicleId) {
        const vehicle = vehicles.find(v => v.vehicleId === movement.vehicleId);
        if (vehicle) {
          category = `${movement.type}_${vehicle.category || vehicle.type}`;
        }
      }
      
      const value = (parseFloat(movement.quantity) || 0) * (parseFloat(movement.unitPrice) || 0);
      
      if (!categoryCosts[category]) {
        categoryCosts[category] = 0;
      }
      categoryCosts[category] += value;
    });

    return Object.entries(categoryCosts)
      .map(([category, cost]) => ({ category, cost }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);
  }, [filteredMovements, vehicles]);

  // Función para exportar
  const exportFinancialReport = () => {
    const reportData = {
      period: `${dateRange.start} a ${dateRange.end}`,
      summary: financialAnalysis,
      locations: locationAnalysis,
      suppliers: supplierAnalysis,
      projections: financialProjections,
      comparison: comparison
    };

    const reportText = JSON.stringify(reportData, null, 2);
    const blob = new Blob([reportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_financiero_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="financial-reports">
      {/* KPIs financieros */}
      <div className="kpis-grid">
        <div className="kpi-card">
          <div className="kpi-icon financial">💰</div>
          <div className="kpi-value">{formatCurrency(financialAnalysis.totalCost)}</div>
          <div className="kpi-label">Costo Total</div>
          <div className={`kpi-trend ${comparison?.costChangePercent > 0 ? 'negative' : 'positive'}`}>
            <span className="trend-icon">
              {comparison?.costChangePercent > 0 ? '📈' : '📉'}
            </span>
            {comparison ? `${formatNumber(Math.abs(comparison.costChangePercent), 1)}%` : 'N/A'}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon financial">📊</div>
          <div className="kpi-value">{formatCurrency(financialAnalysis.averageCostPerMovement)}</div>
          <div className="kpi-label">Costo Promedio</div>
          <div className="kpi-trend neutral">
            <span className="trend-icon">📋</span>
            {filteredMovements.length} movimientos
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon financial">🔄</div>
          <div className="kpi-value">{formatCurrency(financialAnalysis.netFlow)}</div>
          <div className="kpi-label">Flujo Neto</div>
          <div className={`kpi-trend ${financialAnalysis.netFlow > 0 ? 'negative' : 'positive'}`}>
            <span className="trend-icon">
              {financialAnalysis.netFlow > 0 ? '📤' : '📥'}
            </span>
            {formatPercentage(financialAnalysis.turnoverRatio)} rotación
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon financial">📈</div>
          <div className="kpi-value">{formatCurrency(financialProjections.totalProjectedCost)}</div>
          <div className="kpi-label">Proyección 30 días</div>
          <div className="kpi-trend info">
            <span className="trend-icon">🎯</span>
            {formatNumber(financialProjections.confidence)}% confianza
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="reports-filters">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Período de Análisis</label>
            <select 
              className="filter-select"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">Semanal</option>
              <option value="month">Mensual</option>
              <option value="quarter">Trimestral</option>
              <option value="year">Anual</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Comparar con</label>
            <select 
              className="filter-select"
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
            >
              <option value="previous">Período anterior</option>
              <option value="year_ago">Mismo período año anterior</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="filter-btn secondary" onClick={exportFinancialReport}>
              📊 Exportar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* Comparación con período anterior */}
      {comparison && (
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">📊 Comparación con Período Anterior</h3>
            <div className="chart-actions">
              <span className="badge info">vs {comparisonData.period}</span>
            </div>
          </div>
          <div className="chart-content">
            <div className="comparison-grid">
              <div className="comparison-item">
                <h4>💰 Cambio en Costos</h4>
                <div className={`comparison-value ${comparison.costChangePercent > 0 ? 'negative' : 'positive'}`}>
                  {formatCurrency(comparison.costChange)}
                  <span className="comparison-percent">
                    ({comparison.costChangePercent > 0 ? '+' : ''}{formatNumber(comparison.costChangePercent, 1)}%)
                  </span>
                </div>
              </div>
              <div className="comparison-item">
                <h4>📈 Cambio en Movimientos</h4>
                <div className={`comparison-value ${comparison.movementChangePercent > 0 ? 'positive' : 'negative'}`}>
                  {comparison.movementChange > 0 ? '+' : ''}{comparison.movementChange}
                  <span className="comparison-percent">
                    ({comparison.movementChangePercent > 0 ? '+' : ''}{formatNumber(comparison.movementChangePercent, 1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Análisis por ubicación */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">📍 Costos por Ubicación</h3>
        </div>
        <div className="chart-content">
          <div className="location-analysis-grid">
            {locationAnalysis.slice(0, 6).map(location => (
              <div key={location.location} className="location-item">
                <h4>{location.location}</h4>
                <div className="location-metrics">
                  <div className="metric">
                    <span className="metric-label">Costo Total:</span>
                    <span className="metric-value">{formatCurrency(location.totalCost)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Movimientos:</span>
                    <span className="metric-value">{location.movementsCount}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Participación:</span>
                    <span className="metric-value">{formatNumber(location.movementsPercentage, 1)}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Promedio:</span>
                    <span className="metric-value">{formatCurrency(location.averageCostPerMovement)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Análisis de proveedores */}
      {supplierAnalysis.length > 0 && (
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">🏪 Análisis de Proveedores</h3>
          </div>
          <div className="chart-content">
            <div className="suppliers-analysis">
              {supplierAnalysis.slice(0, 5).map(supplier => (
                <div key={supplier.name} className="supplier-item">
                  <h4>{supplier.name}</h4>
                  <div className="supplier-metrics">
                    <div className="metric">
                      <span className="metric-label">Valor Total:</span>
                      <span className="metric-value">{formatCurrency(supplier.totalValue)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Cantidad:</span>
                      <span className="metric-value">{formatNumber(supplier.totalQuantity)} L</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Precio Promedio:</span>
                      <span className="metric-value">{formatCurrency(supplier.avgPrice)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Movimientos:</span>
                      <span className="metric-value">{supplier.movementsCount}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Combustibles:</span>
                      <span className="metric-value">{supplier.fuelTypes.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Proyecciones financieras */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">📈 Proyecciones Financieras (30 días)</h3>
          <div className="chart-actions">
            <span className="badge success">
              Confianza: {formatNumber(financialProjections.confidence)}%
            </span>
          </div>
        </div>
        <div className="chart-content">
          <div className="projections-financial">
            {Object.entries(financialProjections.projectedCosts).map(([fuelType, cost]) => {
              const quantity = financialProjections.recommendedPurchases[fuelType];
              const price = financialProjections.currentPrices[fuelType];
              const fuelInfo = FUEL_INFO[fuelType] || {};
              
              return (
                <div key={fuelType} className="projection-financial-item">
                  <h4>
                    <span style={{ marginRight: '0.5rem' }}>
                      {fuelInfo.icon || '⛽'}
                    </span>
                    {fuelInfo.name || fuelType.toUpperCase()}
                  </h4>
                  <div className="projection-financial-metrics">
                    <div className="metric">
                      <span className="metric-label">Cantidad Proyectada:</span>
                      <span className="metric-value">
                        {formatNumber(quantity)} {fuelInfo.unit || 'L'}
                      </span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Precio Actual:</span>
                      <span className="metric-value">{formatCurrency(price)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Costo Proyectado:</span>
                      <span className="metric-value highlight">{formatCurrency(cost)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top costos por categoría */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">💸 Top Costos por Categoría</h3>
        </div>
        <div className="chart-content">
          <div className="top-costs-list">
            {topCosts.map((item, index) => (
              <div key={item.category} className="cost-item">
                <div className="cost-rank">#{index + 1}</div>
                <div className="cost-info">
                  <h4>{item.category.replace('_', ' - ')}</h4>
                  <div className="cost-percentage">
                    {formatPercentage(item.cost / financialAnalysis.totalCost)} del total
                  </div>
                </div>
                <div className="cost-value">
                  {formatCurrency(item.cost)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen ejecutivo */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">📋 Resumen Ejecutivo</h3>
        </div>
        <div className="chart-content">
          <div className="executive-summary">
            <div className="summary-section">
              <h4>💰 Flujo de Efectivo</h4>
              <div className="summary-metrics">
                <div className="summary-item">
                  <span>Entradas:</span>
                  <span className="text-success">{formatCurrency(financialAnalysis.entradasValue)}</span>
                </div>
                <div className="summary-item">
                  <span>Salidas:</span>
                  <span className="text-warning">{formatCurrency(financialAnalysis.salidasValue)}</span>
                </div>
                <div className="summary-item">
                  <span>Balance:</span>
                  <span className={financialAnalysis.netFlow > 0 ? 'text-danger' : 'text-success'}>
                    {formatCurrency(Math.abs(financialAnalysis.netFlow))}
                  </span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h4>📊 Eficiencia Operacional</h4>
              <div className="summary-metrics">
                <div className="summary-item">
                  <span>Rotación de Inventario:</span>
                  <span>{formatPercentage(financialAnalysis.turnoverRatio)}</span>
                </div>
                <div className="summary-item">
                  <span>Costo por Movimiento:</span>
                  <span>{formatCurrency(financialAnalysis.averageCostPerMovement)}</span>
                </div>
                <div className="summary-item">
                  <span>Total Movimientos:</span>
                  <span>{filteredMovements.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;
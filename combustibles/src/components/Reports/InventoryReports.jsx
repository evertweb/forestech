/**
 * InventoryReports.jsx - Reportes específicos de inventario
 * Análisis de stock, alertas, valoración y proyecciones de compra
 */

import React, { useMemo, useState } from 'react';
import {
  calculateInventoryStats,
  calculateLowStockAlerts,
  calculateAvailableStock,
  calculateConsumptionProjections,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '../../utils/calculations';
import { FUEL_INFO } from '../../constants/combustibleTypes';

const InventoryReports = ({ inventory, movements /* _dateRange */ }) => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('stock_level');

  // Filtrar inventario por ubicación si se selecciona
  const filteredInventory = useMemo(() => {
    if (selectedLocation === 'all') return inventory;
    return inventory.filter((item) => item.location === selectedLocation);
  }, [inventory, selectedLocation]);

  // Obtener ubicaciones únicas
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(inventory.map((item) => item.location))];
    return uniqueLocations.filter(Boolean);
  }, [inventory]);

  // Calcular estadísticas
  const inventoryStats = useMemo(
    () => calculateInventoryStats(filteredInventory),
    [filteredInventory]
  );
  const lowStockAlerts = useMemo(
    () => calculateLowStockAlerts(filteredInventory),
    [filteredInventory]
  );
  const stockByType = useMemo(
    () => calculateAvailableStock(filteredInventory),
    [filteredInventory]
  );
  const projections = useMemo(() => calculateConsumptionProjections(movements), [movements]);

  // Datos para tabla de inventario detallado
  const detailedInventory = useMemo(() => {
    const enrichedInventory = filteredInventory.map((item) => {
      const fuelInfo = FUEL_INFO[item.fuelType] || {};
      const currentStock = parseFloat(item.currentStock) || 0;
      const maxCapacity = parseFloat(item.maxCapacity) || 0;
      const percentage = maxCapacity > 0 ? (currentStock / maxCapacity) * 100 : 0;
      const value = currentStock * (parseFloat(item.pricePerUnit) || 0);

      return {
        ...item,
        fuelInfo,
        percentage,
        value,
        stockLevel: percentage < 15 ? 'critical' : percentage < 30 ? 'low' : 'good',
      };
    });

    // Ordenar según criterio seleccionado
    return enrichedInventory.sort((a, b) => {
      switch (sortBy) {
        case 'stock_level':
          return a.percentage - b.percentage;
        case 'value':
          return b.value - a.value;
        case 'name':
          return a.productName.localeCompare(b.productName);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });
  }, [filteredInventory, sortBy]);

  // Función para exportar datos
  const exportToCSV = () => {
    const headers = [
      'Producto',
      'Ubicación',
      'Stock Actual',
      'Capacidad',
      '% Capacidad',
      'Valor',
      'Estado',
    ];
    const csvData = detailedInventory.map((item) => [
      item.productName,
      item.location,
      formatNumber(item.currentStock),
      formatNumber(item.maxCapacity),
      formatPercentage(item.percentage / 100),
      formatCurrency(item.value),
      item.stockLevel === 'critical' ? 'Crítico' : item.stockLevel === 'low' ? 'Bajo' : 'Bueno',
    ]);

    const csvContent = [headers, ...csvData].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventario_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="apple-card">
      {/* Resumen de inventario */}
      <div className="apple-stats-grid">
        <div className="apple-card">
          <div className="apple-stat-card-icon">💰</div>
          <div className="apple-form-input">{formatCurrency(inventoryStats.totalValue)}</div>
          <div className="apple-form-label">Valor Total</div>
          <div className="apple-status-badge">
            <span className="apple-status-badge">📦</span>
            {inventoryStats.totalItems} productos
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-stat-card-icon">📊</div>
          <div className="apple-form-input">
            {formatPercentage(inventoryStats.averageStockLevel / 100)}
          </div>
          <div className="apple-form-label">Nivel Promedio</div>
          <div
            className={`apple-status-badge ${inventoryStats.averageStockLevel > 60 ? 'positive' : inventoryStats.averageStockLevel > 30 ? 'neutral' : 'negative'}`}
          >
            <span className="apple-status-badge">
              {inventoryStats.averageStockLevel > 60
                ? '📈'
                : inventoryStats.averageStockLevel > 30
                  ? '➡️'
                  : '📉'}
            </span>
            {inventoryStats.activeItems} activos
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-stat-card-icon">⚠️</div>
          <div className="apple-form-input">{inventoryStats.lowStockItems}</div>
          <div className="apple-form-label">Alertas de Stock</div>
          <div className={`apple-status-badge ${inventoryStats.criticalItems > 0 ? 'negative' : 'neutral'}`}>
            <span className="apple-status-badge">🚨</span>
            {inventoryStats.criticalItems} críticos
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-stat-card-icon">🎯</div>
          <div className="apple-form-input">{formatNumber(projections.confidence)}%</div>
          <div className="apple-form-label">Precisión Proyección</div>
          <div className="apple-status-badge">
            <span className="apple-status-badge">📊</span>
            {projections.dataPoints} datos
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="apple-card">
        <div className="apple-card">
          <div className="apple-form-group">
            <label className="apple-form-label">Ubicación</label>
            <select
              className="apple-form-input"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="all">Todas las ubicaciones</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="apple-form-group">
            <label className="apple-form-label">Ordenar por</label>
            <select
              className="apple-form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="stock_level">Nivel de Stock</option>
              <option value="value">Valor</option>
              <option value="name">Nombre</option>
              <option value="location">Ubicación</option>
            </select>
          </div>
          <div className="apple-action-buttons">
            <button className="apple-button apple-button-secondary" onClick={exportToCSV}>
              📊 Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stock por tipo de combustible */}
      <div className="apple-card">
        <div className="apple-card">
          <h3 className="apple-form-label">🛢️ Stock por Tipo de Combustible</h3>
        </div>
        <div className="apple-card">
          <div className="apple-stats-grid">
            {Object.entries(stockByType).map(([fuelType, stock]) => {
              const fuelInfo = FUEL_INFO[fuelType] || {};
              return (
                <div key={fuelType} className="apple-card">
                  <div className="apple-card">
                    <span className="apple-stat-card-icon">{fuelInfo.icon || '⛽'}</span>
                    <h4>{fuelInfo.name || fuelType.toUpperCase()}</h4>
                  </div>
                  <div className="apple-form-input">
                    {formatNumber(stock)} {fuelInfo.unit || 'L'}
                  </div>
                  <div className="apple-status-badge">
                    {stock > 1000 ? (
                      <span className="apple-status-badge">Stock Bueno</span>
                    ) : stock > 500 ? (
                      <span className="apple-status-badge">Stock Bajo</span>
                    ) : (
                      <span className="apple-status-badge">Stock Crítico</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alertas de stock bajo */}
      {lowStockAlerts.length > 0 && (
        <div className="apple-card">
          <div className="apple-card">
            <h3 className="apple-form-label">⚠️ Alertas de Stock Bajo</h3>
            <div className="apple-action-buttons">
              <span className="apple-status-badge">{lowStockAlerts.length} alertas</span>
            </div>
          </div>
          <div className="apple-card">
            <div className="apple-card">
              {lowStockAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`apple-card ${alert.stockLevel === 'critical' ? 'critical' : 'warning'}`}
                >
                  <span className="apple-stat-card-icon">
                    {alert.stockLevel === 'critical' ? '🚨' : '⚠️'}
                  </span>
                  <div className="apple-card">
                    <div className="apple-form-label">
                      {alert.productName} - {alert.location}
                    </div>
                    <div className="apple-form-input">
                      Stock: {formatNumber(alert.currentStock)} {alert.unit}(
                      {formatPercentage(alert.percentage / 100)} de capacidad máxima)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Proyecciones de compra */}
      {Object.keys(projections.recommendedPurchases).length > 0 && (
        <div className="apple-card">
          <div className="apple-card">
            <h3 className="apple-form-label">📈 Proyecciones de Compra (30 días)</h3>
            <div className="apple-action-buttons">
              <span className="apple-status-badge">
                Confianza: {formatNumber(projections.confidence)}%
              </span>
            </div>
          </div>
          <div className="apple-card">
            <div className="apple-stats-grid">
              {Object.entries(projections.recommendedPurchases).map(
                ([fuelType, recommendation]) => {
                  const fuelInfo = FUEL_INFO[fuelType] || {};
                  const projection = projections.projectedConsumption[fuelType];
                  return (
                    <div key={fuelType} className="apple-card">
                      <div className="apple-card">
                        <span>{fuelInfo.icon || '⛽'}</span>
                        <h4>{fuelInfo.name || fuelType.toUpperCase()}</h4>
                      </div>
                      <div className="apple-form-input">
                        {formatNumber(recommendation)} {fuelInfo.unit || 'L'}
                      </div>
                      <div className="apple-form-label">
                        <small>
                          Consumo proyectado: {formatNumber(projection?.projectedTotal)}{' '}
                          {fuelInfo.unit || 'L'}
                        </small>
                        <small>
                          Promedio diario: {formatNumber(projection?.dailyAverage)}{' '}
                          {fuelInfo.unit || 'L'}
                        </small>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabla detallada de inventario */}
      <div className="apple-card">
        <div className="apple-card">
          <h3 className="apple-form-label">📋 Inventario Detallado</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="apple-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Ubicación</th>
                <th>Tipo</th>
                <th>Stock Actual</th>
                <th>Capacidad</th>
                <th>% Capacidad</th>
                <th>Precio/Unidad</th>
                <th>Valor Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {detailedInventory.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>{item.location}</td>
                  <td>
                    <span style={{ marginRight: '0.5rem' }}>{item.fuelInfo.icon || '⛽'}</span>
                    {item.fuelInfo.name || item.fuelType}
                  </td>
                  <td>
                    {formatNumber(item.currentStock)} {item.unit}
                  </td>
                  <td>
                    {formatNumber(item.maxCapacity)} {item.unit}
                  </td>
                  <td>
                    <span
                      className={`apple-status-badge ${item.stockLevel === 'critical' ? 'danger' : item.stockLevel === 'low' ? 'warning' : 'success'}`}
                    >
                      {formatPercentage(item.percentage / 100)}
                    </span>
                  </td>
                  <td>{formatCurrency(item.pricePerUnit)}</td>
                  <td>{formatCurrency(item.value)}</td>
                  <td>
                    <span
                      className={`apple-status-badge ${item.stockLevel === 'critical' ? 'danger' : item.stockLevel === 'low' ? 'warning' : 'success'}`}
                    >
                      {item.stockLevel === 'critical'
                        ? 'Crítico'
                        : item.stockLevel === 'low'
                          ? 'Bajo'
                          : 'Bueno'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryReports;

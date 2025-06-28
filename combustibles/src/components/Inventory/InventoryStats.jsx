// combustibles/src/components/Inventory/InventoryStats.jsx
// Componente de estadísticas del inventario
import React from 'react';
import { FUEL_INFO } from '../../constants/combustibleTypes';
import { formatCurrency, formatNumber } from '../../utils/calculations';

const InventoryStats = ({ stats }) => {

  return (
    <div className="inventory-stats">
      {/* Métricas principales */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Valor Total</h3>
            <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
            <div className="stat-subtitle">
              {formatNumber(stats.totalItems)} tipos de combustible
            </div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Items Activos</h3>
            <div className="stat-value">{stats.activeItems}</div>
            <div className="stat-subtitle">
              {Math.round((stats.activeItems / stats.totalItems) * 100)}% del total
            </div>
          </div>
        </div>

        <div className={`stat-card ${stats.lowStockItems > 0 ? 'warning' : 'info'}`}>
          <div className="stat-icon">
            {stats.lowStockItems > 0 ? '⚠️' : '📊'}
          </div>
          <div className="stat-content">
            <h3>Stock Bajo</h3>
            <div className="stat-value">{stats.lowStockItems}</div>
            <div className="stat-subtitle">
              {stats.lowStockItems > 0 ? 'Requieren atención' : 'Niveles normales'}
            </div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Nivel Promedio</h3>
            <div className="stat-value">{stats.averageStockLevel}%</div>
            <div className="stat-subtitle">
              Capacidad promedio utilizada
            </div>
          </div>
        </div>
      </div>

      {/* Resumen por tipo de combustible */}
      <div className="fuel-type-summary">
        <h4>📊 Resumen por Tipo de Combustible</h4>
        <div className="fuel-types-grid">
          {Object.entries(stats.byFuelType).map(([fuelType, data]) => {
            const fuelInfo = FUEL_INFO[fuelType];
            const utilizationPercent = data.totalCapacity > 0 
              ? Math.round((data.totalStock / data.totalCapacity) * 100)
              : 0;

            return (
              <div key={fuelType} className="fuel-type-card">
                <div className="fuel-header">
                  <span 
                    className="fuel-icon" 
                    style={{ color: fuelInfo?.color || '#6b7280' }}
                  >
                    {fuelInfo?.icon || '⛽'}
                  </span>
                  <div className="fuel-info">
                    <h5>{fuelInfo?.name || fuelType}</h5>
                    <span className="fuel-count">{data.count} ubicaciones</span>
                  </div>
                </div>
                
                <div className="fuel-metrics">
                  <div className="metric">
                    <span className="metric-label">Stock Total:</span>
                    <span className="metric-value">
                      {formatNumber(data.totalStock)} {fuelInfo?.unit || 'unidades'}
                    </span>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">Capacidad:</span>
                    <span className="metric-value">
                      {formatNumber(data.totalCapacity)} {fuelInfo?.unit || 'unidades'}
                    </span>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">Utilización:</span>
                    <span className={`metric-value ${utilizationPercent < 25 ? 'low' : utilizationPercent > 75 ? 'high' : 'normal'}`}>
                      {utilizationPercent}%
                    </span>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">Valor:</span>
                    <span className="metric-value">
                      {formatCurrency(data.totalValue)}
                    </span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${utilizationPercent}%`,
                      backgroundColor: fuelInfo?.color || '#6b7280'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(stats.byFuelType).length === 0 && (
          <div className="empty-fuel-types">
            <p>No hay tipos de combustible registrados en el inventario.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryStats;
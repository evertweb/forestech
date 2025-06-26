/**
 * MovementsStats - Componente de estadísticas de movimientos
 * Muestra métricas clave y resúmenes de movimientos de combustibles
 */

import React from 'react';
import { MOVEMENT_TYPES, MOVEMENT_STATUS } from '../../services/movementsService';

const MovementsStats = ({ stats, filters }) => {
  if (!stats) return null;

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Formatear número
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CO').format(number);
  };

  // Calcular porcentaje de crecimiento
  const calculateGrowthPercent = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Obtener color para tipo de movimiento
  const getMovementTypeColor = (type) => {
    switch (type) {
      case MOVEMENT_TYPES.ENTRADA: return '#10b981'; // Verde
      case MOVEMENT_TYPES.SALIDA: return '#ef4444';  // Rojo
      case MOVEMENT_TYPES.TRANSFERENCIA: return '#3b82f6'; // Azul
      case MOVEMENT_TYPES.AJUSTE: return '#f59e0b'; // Amarillo
      default: return '#6b7280'; // Gris
    }
  };

  // Obtener icono para tipo de movimiento
  const getMovementTypeIcon = (type) => {
    switch (type) {
      case MOVEMENT_TYPES.ENTRADA: return '📥';
      case MOVEMENT_TYPES.SALIDA: return '📤';
      case MOVEMENT_TYPES.TRANSFERENCIA: return '🔄';
      case MOVEMENT_TYPES.AJUSTE: return '⚖️';
      default: return '📋';
    }
  };

  const growthPercent = calculateGrowthPercent(stats.thisMonth, stats.lastMonth);

  return (
    <div className="movements-stats">
      {/* Métricas principales */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{formatNumber(stats.totalMovements)}</div>
            <div className="stat-label">Total Movimientos</div>
            <div className="stat-trend">
              <span className={`trend ${growthPercent >= 0 ? 'positive' : 'negative'}`}>
                {growthPercent >= 0 ? '📈' : '📉'} {Math.abs(growthPercent)}%
              </span>
              <span className="trend-label">vs mes anterior</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
            <div className="stat-label">Valor Total</div>
            <div className="stat-secondary">
              Promedio: {formatCurrency(stats.averageValue)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⛽</div>
          <div className="stat-content">
            <div className="stat-value">{formatNumber(stats.totalQuantity)}</div>
            <div className="stat-label">Galones Total</div>
            <div className="stat-secondary">
              Promedio: {formatNumber(stats.totalQuantity / (stats.totalMovements || 1))} gal/mov
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{formatNumber(stats.thisWeek)}</div>
            <div className="stat-label">Esta Semana</div>
            <div className="stat-secondary">
              {formatNumber(stats.thisMonth)} este mes
            </div>
          </div>
        </div>
      </div>

      {/* Desglose por tipo de movimiento */}
      <div className="stats-breakdown">
        <div className="breakdown-section">
          <h4>📋 Por Tipo de Movimiento</h4>
          <div className="breakdown-grid">
            {Object.entries(stats.byType).map(([type, count]) => {
              const percentage = ((count / stats.totalMovements) * 100).toFixed(1);
              return (
                <div key={type} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-icon">
                      {getMovementTypeIcon(type)}
                    </span>
                    <span className="breakdown-label">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </div>
                  <div className="breakdown-value">{count}</div>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getMovementTypeColor(type)
                      }}
                    />
                  </div>
                  <div className="breakdown-percentage">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="breakdown-section">
          <h4>⚡ Por Estado</h4>
          <div className="breakdown-grid">
            {Object.entries(stats.byStatus).map(([status, count]) => {
              const percentage = ((count / stats.totalMovements) * 100).toFixed(1);
              const getStatusColor = (status) => {
                switch (status) {
                  case MOVEMENT_STATUS.COMPLETADO: return '#10b981';
                  case MOVEMENT_STATUS.PENDIENTE: return '#f59e0b';
                  case MOVEMENT_STATUS.CANCELADO: return '#ef4444';
                  default: return '#6b7280';
                }
              };
              const getStatusIcon = (status) => {
                switch (status) {
                  case MOVEMENT_STATUS.COMPLETADO: return '✅';
                  case MOVEMENT_STATUS.PENDIENTE: return '⏳';
                  case MOVEMENT_STATUS.CANCELADO: return '❌';
                  default: return '❓';
                }
              };
              
              return (
                <div key={status} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-icon">
                      {getStatusIcon(status)}
                    </span>
                    <span className="breakdown-label">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  <div className="breakdown-value">{count}</div>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getStatusColor(status)
                      }}
                    />
                  </div>
                  <div className="breakdown-percentage">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="breakdown-section">
          <h4>⛽ Por Tipo de Combustible</h4>
          <div className="breakdown-grid">
            {Object.entries(stats.byFuelType).map(([fuelType, count]) => {
              const percentage = ((count / stats.totalMovements) * 100).toFixed(1);
              const getFuelIcon = (fuel) => {
                switch (fuel?.toLowerCase()) {
                  case 'diesel': return '🚛';
                  case 'gasolina': return '🚗';
                  case 'acpm': return '🚚';
                  case 'lubricante': return '🛢️';
                  default: return '⛽';
                }
              };
              
              return (
                <div key={fuelType} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-icon">
                      {getFuelIcon(fuelType)}
                    </span>
                    <span className="breakdown-label">
                      {fuelType}
                    </span>
                  </div>
                  <div className="breakdown-value">{count}</div>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: '#059669'
                      }}
                    />
                  </div>
                  <div className="breakdown-percentage">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtros activos */}
      {(filters.type || filters.status || filters.fuelType || filters.vehicleId) && (
        <div className="active-filters">
          <h4>🔍 Filtros Activos</h4>
          <div className="filters-list">
            {filters.type && (
              <span className="filter-tag">
                Tipo: {filters.type}
              </span>
            )}
            {filters.status && (
              <span className="filter-tag">
                Estado: {filters.status}
              </span>
            )}
            {filters.fuelType && (
              <span className="filter-tag">
                Combustible: {filters.fuelType}
              </span>
            )}
            {filters.vehicleId && (
              <span className="filter-tag">
                Vehículo: {filters.vehicleId}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementsStats;
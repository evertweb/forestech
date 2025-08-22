/**
 * MovementsStats - Componente de estadísticas de movimientos
 * Muestra métricas clave y resúmenes de movimientos de combustibles
 */

import React from 'react';
import { MOVEMENT_TYPES, MOVEMENT_STATUS } from '../../services/movementsService';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import { useMovementStatusColors } from '../../hooks/useStatusColors';

const MovementsStats = ({ stats, filters }) => {
  const { getStatusColor } = useMovementStatusColors();

  if (!stats) return null;

  // Calcular porcentaje de crecimiento
  const calculateGrowthPercent = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  // Obtener color para tipo de movimiento
  const getMovementTypeColor = (type) => {
    switch (type) {
      case MOVEMENT_TYPES.ENTRADA:
        return 'var(--color-success)'; // Verde
      case MOVEMENT_TYPES.SALIDA:
        return 'var(--color-error)'; // Rojo
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return 'var(--color-info)'; // Azul
      case MOVEMENT_TYPES.AJUSTE:
        return 'var(--color-warning)'; // Amarillo
      default:
        return 'var(--text-muted)'; // Gris
    }
  };

  // Obtener icono para tipo de movimiento
  const getMovementTypeIcon = (type) => {
    switch (type) {
      case MOVEMENT_TYPES.ENTRADA:
        return '📥';
      case MOVEMENT_TYPES.SALIDA:
        return '📤';
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return '🔄';
      case MOVEMENT_TYPES.AJUSTE:
        return '⚖️';
      default:
        return '📋';
    }
  };

  const growthPercent = calculateGrowthPercent(stats.thisMonth, stats.lastMonth);

  return (
    <div className="movements-stats sap-theme">
      {/* Métricas principales */}
      <div className="stats-grid sap-theme">
        <div className="stat-card sap-theme primary">
          <div className="stat-icon sap-theme">📊</div>
          <div className="stat-content sap-theme">
            <div className="stat-value sap-theme">{formatNumber(stats.totalMovements)}</div>
            <div className="stat-label sap-theme">Total Movimientos</div>
            <div className="stat-trend sap-theme">
              <span className={`trend sap-theme ${growthPercent >= 0 ? 'positive' : 'negative'}`}>
                {growthPercent >= 0 ? '📈' : '📉'} {Math.abs(growthPercent)}%
              </span>
              <span className="trend-label sap-theme">vs mes anterior</span>
            </div>
          </div>
        </div>

        <div className="stat-card sap-theme">
          <div className="stat-icon sap-theme">💰</div>
          <div className="stat-content sap-theme">
            <div className="stat-value sap-theme">{formatCurrency(stats.totalValue)}</div>
            <div className="stat-label sap-theme">Valor Total</div>
            <div className="stat-secondary sap-theme">
              Promedio: {formatCurrency(stats.averageValue)}
            </div>
          </div>
        </div>

        <div className="stat-card sap-theme">
          <div className="stat-icon sap-theme">⛽</div>
          <div className="stat-content sap-theme">
            <div className="stat-value sap-theme">{formatNumber(stats.totalQuantity)}</div>
            <div className="stat-label sap-theme">Galones Total</div>
            <div className="stat-secondary sap-theme">
              Promedio: {formatNumber(stats.totalQuantity / (stats.totalMovements || 1))} gal/mov
            </div>
          </div>
        </div>

        <div className="stat-card sap-theme">
          <div className="stat-icon sap-theme">📅</div>
          <div className="stat-content sap-theme">
            <div className="stat-value sap-theme">{formatNumber(stats.thisWeek)}</div>
            <div className="stat-label sap-theme">Esta Semana</div>
            <div className="stat-secondary sap-theme">{formatNumber(stats.thisMonth)} este mes</div>
          </div>
        </div>
      </div>

      {/* Desglose por tipo de movimiento */}
      <div className="stats-breakdown sap-theme">
        <div className="breakdown-section sap-theme">
          <h4>📋 Por Tipo de Movimiento</h4>
          <div className="breakdown-grid sap-theme">
            {Object.entries(stats.byType).map(([type, count]) => {
              const percentage = ((count / stats.totalMovements) * 100).toFixed(1);
              return (
                <div key={type} className="breakdown-item sap-theme">
                  <div className="breakdown-header sap-theme">
                    <span className="breakdown-icon sap-theme">{getMovementTypeIcon(type)}</span>
                    <span className="breakdown-label sap-theme">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </div>
                  <div className="breakdown-value sap-theme">{count}</div>
                  <div className="breakdown-bar sap-theme">
                    <div
                      className="breakdown-fill sap-theme"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getMovementTypeColor(type),
                      }}
                    />
                  </div>
                  <div className="breakdown-percentage sap-theme">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="breakdown-section sap-theme">
          <h4>⚡ Por Estado</h4>
          <div className="breakdown-grid sap-theme">
            {Object.entries(stats.byStatus).map(([status, count]) => {
              const percentage = ((count / stats.totalMovements) * 100).toFixed(1);

              const getStatusIcon = (status) => {
                switch (status) {
                  case MOVEMENT_STATUS.COMPLETADO:
                    return '✅';
                  case MOVEMENT_STATUS.PENDIENTE:
                    return '⏳';
                  case MOVEMENT_STATUS.CANCELADO:
                    return '❌';
                  default:
                    return '❓';
                }
              };

              return (
                <div key={status} className="breakdown-item sap-theme">
                  <div className="breakdown-header sap-theme">
                    <span className="breakdown-icon sap-theme">{getStatusIcon(status)}</span>
                    <span className="breakdown-label sap-theme">
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  <div className="breakdown-value sap-theme">{count}</div>
                  <div className="breakdown-bar sap-theme">
                    <div
                      className="breakdown-fill sap-theme"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getStatusColor(status),
                      }}
                    />
                  </div>
                  <div className="breakdown-percentage sap-theme">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="breakdown-section sap-theme">
          <h4>⛽ Por Tipo de Combustible</h4>
          <div className="breakdown-grid sap-theme">
            {Object.entries(stats.byFuelType).map(([fuelType, count]) => {
              const percentage = ((count / stats.totalMovements) * 100).toFixed(1);
              const getFuelIcon = (fuel) => {
                switch (fuel?.toUpperCase()) {
                  case 'DIESEL':
                    return '🚛';
                  case 'GASOLINA':
                    return '🚗';
                  case 'LUBRICANTE':
                    return '🛢️';
                  default:
                    return '⛽';
                }
              };

              return (
                <div key={fuelType} className="breakdown-item sap-theme">
                  <div className="breakdown-header sap-theme">
                    <span className="breakdown-icon sap-theme">{getFuelIcon(fuelType)}</span>
                    <span className="breakdown-label sap-theme">{fuelType}</span>
                  </div>
                  <div className="breakdown-value sap-theme">{count}</div>
                  <div className="breakdown-bar sap-theme">
                    <div
                      className="breakdown-fill sap-theme"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: 'var(--forestech-green)',
                      }}
                    />
                  </div>
                  <div className="breakdown-percentage sap-theme">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtros activos */}
      {(filters.type || filters.status || filters.fuelType || filters.vehicleId) && (
        <div className="active-filters sap-theme">
          <h4>🔍 Filtros Activos</h4>
          <div className="filters-list sap-theme">
            {filters.type && <span className="filter-tag sap-theme">Tipo: {filters.type}</span>}
            {filters.status && (
              <span className="filter-tag sap-theme">Estado: {filters.status}</span>
            )}
            {filters.fuelType && (
              <span className="filter-tag sap-theme">Combustible: {filters.fuelType}</span>
            )}
            {filters.vehicleId && (
              <span className="filter-tag sap-theme">Vehículo: {filters.vehicleId}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementsStats;

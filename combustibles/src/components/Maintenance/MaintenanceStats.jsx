/**
 * MaintenanceStats - Componente de estadísticas de mantenimiento
 * Muestra métricas y insights del módulo de mantenimiento
 */

import React from 'react';
import { MAINTENANCE_TYPES, MAINTENANCE_STATUS } from '../../services/maintenanceService';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import { useMaintenanceStatusColors } from '../../hooks/useStatusColors';

const MaintenanceStats = ({ stats }) => {
  const { getStatusColor } = useMaintenanceStatusColors();
  
  if (!stats) return null;

  const getMaintenanceTypeIcon = (type) => {
    switch (type) {
      case MAINTENANCE_TYPES.OIL_CHANGE:
        return '🛢️';
      case MAINTENANCE_TYPES.BATTERY_CHANGE:
        return '🔋';
      case MAINTENANCE_TYPES.FILTER_CHANGE:
        return '🔧';
      case MAINTENANCE_TYPES.GENERAL_MAINTENANCE:
        return '⚙️';
      default:
        return '🔧';
    }
  };

  const getMaintenanceTypeName = (type) => {
    switch (type) {
      case MAINTENANCE_TYPES.OIL_CHANGE:
        return 'Cambios de Aceite';
      case MAINTENANCE_TYPES.BATTERY_CHANGE:
        return 'Cambios de Batería';
      case MAINTENANCE_TYPES.FILTER_CHANGE:
        return 'Cambios de Filtros';
      case MAINTENANCE_TYPES.GENERAL_MAINTENANCE:
        return 'Mantenimientos Generales';
      default:
        return type;
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case MAINTENANCE_STATUS.COMPLETED:
        return 'Completados';
      case MAINTENANCE_STATUS.PENDING:
        return 'Pendientes';
      case MAINTENANCE_STATUS.CANCELLED:
        return 'Cancelados';
      default:
        return status;
    }
  };

  return (
    <div className="maintenance-stats sap-theme">
      <div className="stats-grid">
        {/* Total de mantenimientos */}
        <div className="stat-card primary">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>{formatNumber(stats.total)}</h3>
            <p>Total Mantenimientos</p>
          </div>
        </div>

        {/* Costo total */}
        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{formatCurrency(stats.totalCost)}</h3>
            <p>Costo Total</p>
          </div>
        </div>

        {/* Próximos mantenimientos */}
        <div className="stat-card warning">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{formatNumber(stats.upcomingCount)}</h3>
            <p>Próximos</p>
          </div>
        </div>

        {/* Mantenimientos vencidos */}
        <div className="stat-card danger">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{formatNumber(stats.overdueCount)}</h3>
            <p>Vencidos</p>
          </div>
        </div>
      </div>

      {/* Desglose por tipo */}
      {Object.keys(stats.byType).length > 0 && (
        <div className="stats-breakdown sap-theme">
          <h3>📊 Desglose por Tipo</h3>
          <div className="breakdown-grid">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-icon">
                    {getMaintenanceTypeIcon(type)}
                  </span>
                  <span className="breakdown-label">
                    {getMaintenanceTypeName(type)}
                  </span>
                </div>
                <div className="breakdown-value">{formatNumber(count)}</div>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill"
                    style={{ 
                      width: `${(count / stats.total) * 100}%`,
                      backgroundColor: 'var(--sap-blue-primary)'
                    }}
                  ></div>
                </div>
                <div className="breakdown-percentage">
                  {((count / stats.total) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desglose por estado */}
      {Object.keys(stats.byStatus).length > 0 && (
        <div className="stats-breakdown sap-theme">
          <h3>📈 Desglose por Estado</h3>
          <div className="breakdown-grid">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="breakdown-item">
                <div className="breakdown-header">
                  <span 
                    className="status-dot"
                    style={{ backgroundColor: getStatusColor(status) }}
                  ></span>
                  <span className="breakdown-label">
                    {getStatusName(status)}
                  </span>
                </div>
                <div className="breakdown-value">{formatNumber(count)}</div>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill"
                    style={{ 
                      width: `${(count / stats.total) * 100}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  ></div>
                </div>
                <div className="breakdown-percentage">
                  {((count / stats.total) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="stats-insights sap-theme">
        <h3>💡 Insights</h3>
        <div className="insights-grid">
          <div className="insight-item">
            <span className="insight-label">Costo Promedio:</span>
            <span className="insight-value">
              {formatCurrency(stats.averageCost)}
            </span>
          </div>
          
          {stats.overdueCount > 0 && (
            <div className="insight-item alert">
              <span className="insight-label">⚠️ Mantenimientos Vencidos:</span>
              <span className="insight-value">
                {formatNumber(stats.overdueCount)} requieren atención
              </span>
            </div>
          )}
          
          {stats.upcomingCount > 0 && (
            <div className="insight-item info">
              <span className="insight-label">⏰ Próximos Mantenimientos:</span>
              <span className="insight-value">
                {formatNumber(stats.upcomingCount)} programados
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceStats;

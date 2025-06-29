/**
 * VehiclesStats - Componente de estadísticas de vehículos
 * Muestra métricas clave y resúmenes de la flota de vehículos
 */

import React from 'react';
import { VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';
import { formatNumber } from '../../utils/calculations';

const VehiclesStats = ({ stats, filters }) => {
  if (!stats) return null;

  // Formatear galones
  const formatGallons = (gallons) => {
    return `${formatNumber(gallons)} gal`;
  };

  // Formatear horas
  const formatHours = (hours) => {
    return `${formatNumber(hours)} hrs`;
  };

  // Formatear consumo por hora
  const formatConsumption = (consumption) => {
    return `${consumption.toFixed(2)} gal/hr`;
  };

  // Obtener color para tipo de vehículo (dinámico)
  const getVehicleTypeColor = (type) => {
    // Generar color basado en hash del tipo para consistencia
    let hash = 0;
    for (let i = 0; i < type.length; i++) {
      hash = ((hash << 5) - hash + type.charCodeAt(i)) & 0xffffffff;
    }
    const colors = ['#059669', '#dc2626', '#2563eb', '#7c3aed', '#ea580c', '#16a34a', '#ca8a04', '#9333ea'];
    return colors[Math.abs(hash) % colors.length];
  };

  // Obtener icono para tipo de vehículo (dinámico)
  const getVehicleTypeIcon = (type) => {
    if (!type) return '🚗';
    const lowerType = type.toLowerCase();
    if (lowerType.includes('excavadora')) return '🚚';
    if (lowerType.includes('bulldozer')) return '🚜';
    if (lowerType.includes('cargador')) return '🏗️';
    if (lowerType.includes('camion')) return '🚛';
    if (lowerType.includes('grua')) return '🏗️';
    if (lowerType.includes('motosierra')) return '🪚';
    if (lowerType.includes('tractor')) return '🚜';
    if (lowerType.includes('volqueta')) return '🚛';
    return '🚗';
  };

  // Obtener color para estado
  const getStatusColor = (status) => {
    switch (status) {
      case VEHICLE_STATUS.ACTIVO: return '#10b981';
      case VEHICLE_STATUS.MANTENIMIENTO: return '#f59e0b';
      case VEHICLE_STATUS.INACTIVO: return '#6b7280';
      case VEHICLE_STATUS.REPARACION: return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Obtener icono para estado
  const getStatusIcon = (status) => {
    switch (status) {
      case VEHICLE_STATUS.ACTIVO: return '✅';
      case VEHICLE_STATUS.MANTENIMIENTO: return '🔧';
      case VEHICLE_STATUS.INACTIVO: return '⏸️';
      case VEHICLE_STATUS.REPARACION: return '🔴';
      default: return '❓';
    }
  };

  // Obtener icono para combustible
  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case FUEL_COMPATIBILITY.DIESEL: return '🚛';
      case FUEL_COMPATIBILITY.GASOLINA: return '🚗';
      case FUEL_COMPATIBILITY.ACPM: return '🚚';
      case FUEL_COMPATIBILITY.MIXTO: return '⛽';
      default: return '⛽';
    }
  };

  // Calcular porcentaje de eficiencia de la flota
  const fleetEfficiency = stats.totalVehicles > 0 
    ? ((stats.byStatus[VEHICLE_STATUS.ACTIVO] || 0) / stats.totalVehicles * 100).toFixed(1)
    : 0;

  return (
    <div className="vehicles-stats">
      {/* Métricas principales */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🚜</div>
          <div className="stat-content">
            <div className="stat-value">{formatNumber(stats.totalVehicles)}</div>
            <div className="stat-label">Total Vehículos</div>
            <div className="stat-trend">
              <span className={`trend ${fleetEfficiency >= 80 ? 'positive' : 'warning'}`}>
                {fleetEfficiency >= 80 ? '📈' : '⚠️'} {fleetEfficiency}% activos
              </span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⛽</div>
          <div className="stat-content">
            <div className="stat-value">{formatGallons(stats.totalFuelConsumed)}</div>
            <div className="stat-label">Combustible Consumido</div>
            <div className="stat-secondary">
              Promedio: {formatConsumption(stats.averageConsumption || 0)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-value">{formatHours(stats.totalHoursWorked)}</div>
            <div className="stat-label">Horas Trabajadas</div>
            <div className="stat-secondary">
              Promedio: {formatHours((stats.totalHoursWorked / (stats.totalVehicles || 1)))}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">
              {stats.mostActiveVehicle ? stats.mostActiveVehicle.vehicleId : 'N/A'}
            </div>
            <div className="stat-label">Más Activo</div>
            <div className="stat-secondary">
              {stats.mostActiveVehicle 
                ? `${stats.mostActiveVehicle.totalMovements || 0} movimientos`
                : 'Sin datos'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Desglose por tipo de vehículo */}
      <div className="stats-breakdown">
        <div className="breakdown-section">
          <h4>🚜 Por Tipo de Vehículo</h4>
          <div className="breakdown-grid">
            {Object.entries(stats.byType).map(([type, count]) => {
              const percentage = ((count / stats.totalVehicles) * 100).toFixed(1);
              return (
                <div key={type} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-icon">
                      {getVehicleTypeIcon(type)}
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
                        backgroundColor: getVehicleTypeColor(type)
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
              const percentage = ((count / stats.totalVehicles) * 100).toFixed(1);
              
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
              const percentage = ((count / stats.totalVehicles) * 100).toFixed(1);
              
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

      {/* Métricas de rendimiento */}
      {(stats.totalFuelConsumed > 0 || stats.totalHoursWorked > 0) && (
        <div className="performance-metrics">
          <h4>📊 Métricas de Rendimiento</h4>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">⚡</div>
              <div className="metric-content">
                <div className="metric-label">Eficiencia de Flota</div>
                <div className="metric-value">{fleetEfficiency}%</div>
                <div className="metric-description">
                  {stats.byStatus[VEHICLE_STATUS.ACTIVO] || 0} de {stats.totalVehicles} activos
                </div>
              </div>
            </div>

            {stats.averageConsumption > 0 && (
              <div className="metric-card">
                <div className="metric-icon">📈</div>
                <div className="metric-content">
                  <div className="metric-label">Consumo Promedio</div>
                  <div className="metric-value">{formatConsumption(stats.averageConsumption)}</div>
                  <div className="metric-description">
                    Por vehículo por hora trabajada
                  </div>
                </div>
              </div>
            )}

            {stats.mostActiveVehicle && (
              <div className="metric-card">
                <div className="metric-icon">🏆</div>
                <div className="metric-content">
                  <div className="metric-label">Mayor Utilización</div>
                  <div className="metric-value">{stats.mostActiveVehicle.vehicleId}</div>
                  <div className="metric-description">
                    {formatGallons(stats.mostActiveVehicle.totalFuelConsumed || 0)} consumidos
                  </div>
                </div>
              </div>
            )}

            {stats.leastActiveVehicle && (
              <div className="metric-card">
                <div className="metric-icon">📉</div>
                <div className="metric-content">
                  <div className="metric-label">Menor Utilización</div>
                  <div className="metric-value">{stats.leastActiveVehicle.vehicleId}</div>
                  <div className="metric-description">
                    {formatGallons(stats.leastActiveVehicle.totalFuelConsumed || 0)} consumidos
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtros activos */}
      {(filters.type || filters.status || filters.fuelType || filters.location) && (
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
            {filters.location && (
              <span className="filter-tag">
                Ubicación: {filters.location}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesStats;
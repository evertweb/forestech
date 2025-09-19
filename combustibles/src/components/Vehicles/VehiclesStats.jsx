/**
 * VehiclesStats - Componente de estadísticas de vehículos
 * Muestra métricas clave y resúmenes de la flota de vehículos
 * Rediseñado con estilo Apple inspirado en Health app
 */

import React from 'react';
import { VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';
import { formatNumber } from '../../utils/calculations';
import { CHART_COLORS } from '../../constants';
import { useVehicleStatusColors } from '../../hooks/useStatusColors';
import '../../styles/apple-cards.css';

const VehiclesStats = ({ stats, filters }) => {
  const { getStatusColor } = useVehicleStatusColors();

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
    const colors = CHART_COLORS.DEFAULT;
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

  // Obtener icono para estado
  const getStatusIcon = (status) => {
    switch (status) {
      case VEHICLE_STATUS.ACTIVO:
        return '✅';
      case VEHICLE_STATUS.MANTENIMIENTO:
        return '🔧';
      case VEHICLE_STATUS.INACTIVO:
        return '⏸️';
      case VEHICLE_STATUS.REPARACION:
        return '🔴';
      default:
        return '❓';
    }
  };

  // Obtener icono para combustible
  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case FUEL_COMPATIBILITY.DIESEL:
        return '🚛';
      case FUEL_COMPATIBILITY.GASOLINE:
        return '🚗';
      case FUEL_COMPATIBILITY.MIXED:
        return '🔄';
      default:
        return '⛽';
    }
  };

  // Calcular porcentaje de eficiencia de la flota
  const fleetEfficiency =
    stats.totalVehicles > 0
      ? (((stats.byStatus[VEHICLE_STATUS.ACTIVO] || 0) / stats.totalVehicles) * 100).toFixed(1)
      : 0;

  return (
    <div className="apple-section">
      {/* Métricas principales */}
      <div className="apple-stats-grid">
        <div className="apple-card">
          <div className="apple-card-header">
            <span className="apple-stat-card-icon">🚜</span>
            <h3 className="apple-card-title">Total Vehículos</h3>
          </div>
          <div className="apple-card-content">
            <div className="apple-form-input">{formatNumber(stats.totalVehicles)}</div>
            <div className="apple-form-label">vehículos registrados</div>
            <div className="apple-status-badge">
              <span className={`apple-status-badge ${fleetEfficiency >= 80 ? 'positive' : 'warning'}`}>
                {fleetEfficiency >= 80 ? '📈' : '⚠️'} {fleetEfficiency}% activos
              </span>
            </div>
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-card-header">
            <span className="apple-stat-card-icon">⛽</span>
            <h3 className="apple-card-title">Combustible Consumido</h3>
          </div>
          <div className="apple-card-content">
            <div className="apple-form-input">{formatGallons(stats.totalFuelConsumed)}</div>
            <div className="apple-form-label">
              Promedio: {formatConsumption(stats.averageConsumption || 0)}
            </div>
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-card-header">
            <span className="apple-stat-card-icon">⏰</span>
            <h3 className="apple-card-title">Horas Trabajadas</h3>
          </div>
          <div className="apple-card-content">
            <div className="apple-form-input">{formatHours(stats.totalHoursWorked)}</div>
            <div className="apple-form-label">
              Promedio: {formatHours(stats.totalHoursWorked / (stats.totalVehicles || 1))}
            </div>
          </div>
        </div>

        <div className="apple-card">
          <div className="apple-card-header">
            <span className="apple-stat-card-icon">🏆</span>
            <h3 className="apple-card-title">Más Activo</h3>
          </div>
          <div className="apple-card-content">
            <div className="apple-form-input">
              {stats.mostActiveVehicle ? stats.mostActiveVehicle.vehicleId : 'N/A'}
            </div>
            <div className="apple-form-label">
              {stats.mostActiveVehicle
                ? `${stats.mostActiveVehicle.totalMovements || 0} movimientos`
                : 'Sin datos'}
            </div>
          </div>
        </div>
      </div>

      {/* Desglose por tipo de vehículo */}
      <div className="apple-section">
        <h2 className="apple-section-title">🚜 Distribución por Tipo</h2>
        <div className="apple-stats-grid">
          {Object.entries(stats.byType).map(([type, count]) => {
            const percentage = ((count / stats.totalVehicles) * 100).toFixed(1);
            return (
              <div key={type} className="apple-card">
                <div className="apple-card-header">
                  <span className="apple-stat-card-icon">{getVehicleTypeIcon(type)}</span>
                  <h3 className="apple-card-title">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </h3>
                </div>
                <div className="apple-card-content">
                  <div className="apple-form-input">{count}</div>
                  <div className="apple-progress-container">
                    <div className="apple-progress-bar">
                      <div
                        className="apple-progress-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getVehicleTypeColor(type),
                        }}
                      />
                    </div>
                    <div className="apple-progress-label">{percentage}% del total</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="apple-section">
        <h2 className="apple-section-title">⚡ Estado Operativo</h2>
        <div className="apple-stats-grid">
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const percentage = ((count / stats.totalVehicles) * 100).toFixed(1);

            return (
              <div key={status} className="apple-card">
                <div className="apple-card-header">
                  <span className="apple-stat-card-icon">{getStatusIcon(status)}</span>
                  <h3 className="apple-card-title">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </h3>
                </div>
                <div className="apple-card-content">
                  <div className="apple-form-input">{count}</div>
                  <div className="apple-progress-container">
                    <div className="apple-progress-bar">
                      <div
                        className="apple-progress-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getStatusColor(status),
                        }}
                      />
                    </div>
                    <div className="apple-progress-label">{percentage}% del total</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="apple-section">
        <h2 className="apple-section-title">⛽ Consumo por Combustible</h2>
        <div className="apple-stats-grid">
          {Object.entries(stats.byFuelType).map(([fuelType, count]) => {
            const percentage = ((count / stats.totalVehicles) * 100).toFixed(1);

            return (
              <div key={fuelType} className="apple-card">
                <div className="apple-card-header">
                  <span className="apple-stat-card-icon">{getFuelIcon(fuelType)}</span>
                  <h3 className="apple-card-title">{fuelType}</h3>
                </div>
                <div className="apple-card-content">
                  <div className="apple-form-input">{count}</div>
                  <div className="apple-progress-container">
                    <div className="apple-progress-bar">
                      <div
                        className="apple-progress-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: 'var(--apple-success)',
                        }}
                      />
                    </div>
                    <div className="apple-progress-label">{percentage}% del total</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Métricas de rendimiento */}
      {(stats.totalFuelConsumed > 0 || stats.totalHoursWorked > 0) && (
        <div className="apple-section">
          <h2 className="apple-section-title">📊 Rendimiento de Flota</h2>
          <div className="apple-stats-grid">
            <div className="apple-card">
              <div className="apple-card-header">
                <span className="apple-stat-card-icon">⚡</span>
                <h3 className="apple-card-title">Eficiencia General</h3>
              </div>
              <div className="apple-card-content">
                <div className="apple-form-input">{fleetEfficiency}%</div>
                <div className="apple-form-label">
                  {stats.byStatus[VEHICLE_STATUS.ACTIVO] || 0} de {stats.totalVehicles} vehículos activos
                </div>
              </div>
            </div>

            {stats.averageConsumption > 0 && (
              <div className="apple-card">
                <div className="apple-card-header">
                  <span className="apple-stat-card-icon">📈</span>
                  <h3 className="apple-card-title">Consumo Promedio</h3>
                </div>
                <div className="apple-card-content">
                  <div className="apple-form-input">{formatConsumption(stats.averageConsumption)}</div>
                  <div className="apple-form-label">galones por hora trabajada</div>
                </div>
              </div>
            )}

            {stats.mostActiveVehicle && (
              <div className="apple-card">
                <div className="apple-card-header">
                  <span className="apple-stat-card-icon">🏆</span>
                  <h3 className="apple-card-title">Mayor Actividad</h3>
                </div>
                <div className="apple-card-content">
                  <div className="apple-form-input">{stats.mostActiveVehicle.vehicleId}</div>
                  <div className="apple-form-label">
                    {formatGallons(stats.mostActiveVehicle.totalFuelConsumed || 0)} consumidos
                  </div>
                </div>
              </div>
            )}

            {stats.leastActiveVehicle && (
              <div className="apple-card">
                <div className="apple-card-header">
                  <span className="apple-stat-card-icon">📉</span>
                  <h3 className="apple-card-title">Menor Actividad</h3>
                </div>
                <div className="apple-card-content">
                  <div className="apple-form-input">{stats.leastActiveVehicle.vehicleId}</div>
                  <div className="apple-form-label">
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
        <div className="apple-section">
          <h2 className="apple-section-title">🔍 Filtros Aplicados</h2>
          <div className="apple-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {filters.type && <span className="apple-status-badge">Tipo: {filters.type}</span>}
              {filters.status && <span className="apple-status-badge">Estado: {filters.status}</span>}
              {filters.fuelType && (
                <span className="apple-status-badge">Combustible: {filters.fuelType}</span>
              )}
              {filters.location && <span className="apple-status-badge">Ubicación: {filters.location}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesStats;

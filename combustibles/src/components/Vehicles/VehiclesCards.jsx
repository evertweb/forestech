/**
 * VehiclesCards - Vista en tarjetas para vehículos
 * Muestra los vehículos en formato de cards responsive
 */

import React from 'react';
import { VEHICLE_TYPES, VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';

const VehiclesCards = ({ vehicles, onEdit, onView, onMaintenance }) => {
  // Formatear número
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CO').format(number);
  };

  // Formatear galones
  const formatGallons = (gallons) => {
    return `${formatNumber(gallons)} gal`;
  };

  // Formatear horas
  const formatHours = (hours) => {
    return `${formatNumber(hours)} hrs`;
  };

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return 'Sin fecha';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtener tiempo relativo
  const getRelativeTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const targetDate = date instanceof Date ? date : new Date(date);
    const diffTime = Math.abs(now - targetDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays < 365) return `hace ${Math.ceil(diffDays / 30)} meses`;
    return `hace ${Math.ceil(diffDays / 365)} años`;
  };

  // Obtener clase CSS para tipo de vehículo
  const getVehicleTypeClass = (type) => {
    switch (type) {
      case VEHICLE_TYPES.EXCAVADORA: return 'vehicle-excavadora';
      case VEHICLE_TYPES.BULLDOZER: return 'vehicle-bulldozer';
      case VEHICLE_TYPES.CARGADOR: return 'vehicle-cargador';
      case VEHICLE_TYPES.CAMION: return 'vehicle-camion';
      case VEHICLE_TYPES.GRUA: return 'vehicle-grua';
      case VEHICLE_TYPES.MOTOSIERRA: return 'vehicle-motosierra';
      case VEHICLE_TYPES.TRACTOR: return 'vehicle-tractor';
      case VEHICLE_TYPES.VOLQUETA: return 'vehicle-volqueta';
      default: return 'vehicle-default';
    }
  };

  // Obtener clase CSS para estado
  const getStatusClass = (status) => {
    switch (status) {
      case VEHICLE_STATUS.ACTIVO: return 'status-activo';
      case VEHICLE_STATUS.MANTENIMIENTO: return 'status-mantenimiento';
      case VEHICLE_STATUS.INACTIVO: return 'status-inactivo';
      case VEHICLE_STATUS.REPARACION: return 'status-reparacion';
      default: return 'status-default';
    }
  };

  // Obtener icono para tipo de vehículo
  const getVehicleIcon = (type) => {
    switch (type) {
      case VEHICLE_TYPES.EXCAVADORA: return '🚚';
      case VEHICLE_TYPES.BULLDOZER: return '🚜';
      case VEHICLE_TYPES.CARGADOR: return '🏗️';
      case VEHICLE_TYPES.CAMION: return '🚛';
      case VEHICLE_TYPES.GRUA: return '🏗️';
      case VEHICLE_TYPES.MOTOSIERRA: return '🪚';
      case VEHICLE_TYPES.TRACTOR: return '🚜';
      case VEHICLE_TYPES.VOLQUETA: return '🚛';
      default: return '🚗';
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

  // Calcular consumo por hora
  const getConsumptionPerHour = (vehicle) => {
    if (!vehicle.totalHoursWorked || vehicle.totalHoursWorked === 0) {
      return vehicle.estimatedConsumptionPerHour || 0;
    }
    return vehicle.totalFuelConsumed / vehicle.totalHoursWorked;
  };

  // Determinar si necesita mantenimiento
  const needsMaintenance = (vehicle) => {
    if (!vehicle.lastMaintenanceDate) return true;
    const daysSinceLastMaintenance = Math.floor(
      (new Date() - new Date(vehicle.lastMaintenanceDate)) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLastMaintenance > 90; // Más de 90 días
  };

  return (
    <div className="vehicles-cards">
      {vehicles.map((vehicle) => (
        <div 
          key={vehicle.id} 
          className={`vehicle-card ${getVehicleTypeClass(vehicle.type)}`}
        >
          {/* Header de la tarjeta */}
          <div className="card-header">
            <div className="vehicle-info">
              <div className="vehicle-id-section">
                <span className="vehicle-icon">{getVehicleIcon(vehicle.type)}</span>
                <div className="vehicle-details">
                  <span className="vehicle-id">{vehicle.vehicleId}</span>
                  <span className="vehicle-name">{vehicle.name}</span>
                </div>
              </div>
              <div className={`status-badge ${getStatusClass(vehicle.status)}`}>
                <span className="status-icon">{getStatusIcon(vehicle.status)}</span>
                <span className="status-label">
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Información principal */}
          <div className="card-content">
            {/* Información básica */}
            <div className="basic-info">
              <div className="info-row">
                <span className="info-label">Tipo:</span>
                <span className="info-value">
                  {getVehicleIcon(vehicle.type)} {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                </span>
              </div>

              {vehicle.brand && vehicle.model && (
                <div className="info-row">
                  <span className="info-label">Marca/Modelo:</span>
                  <span className="info-value">{vehicle.brand} {vehicle.model}</span>
                </div>
              )}

              <div className="info-row">
                <span className="info-label">Combustible:</span>
                <span className="info-value">
                  {getFuelIcon(vehicle.fuelType)} {vehicle.fuelType}
                </span>
              </div>

              {vehicle.currentLocation && (
                <div className="info-row">
                  <span className="info-label">Ubicación:</span>
                  <span className="info-value">📍 {vehicle.currentLocation}</span>
                </div>
              )}
            </div>

            {/* Métricas de consumo */}
            <div className="consumption-metrics">
              <div className="metric-item">
                <div className="metric-icon">⛽</div>
                <div className="metric-content">
                  <div className="metric-value">{formatGallons(vehicle.totalFuelConsumed || 0)}</div>
                  <div className="metric-label">Consumido</div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-icon">⏰</div>
                <div className="metric-content">
                  <div className="metric-value">{formatHours(vehicle.totalHoursWorked || 0)}</div>
                  <div className="metric-label">Trabajadas</div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <div className="metric-value">{getConsumptionPerHour(vehicle).toFixed(1)} gal/hr</div>
                  <div className="metric-label">Consumo</div>
                </div>
              </div>

              <div className="metric-item">
                <div className="metric-icon">🔄</div>
                <div className="metric-content">
                  <div className="metric-value">{vehicle.totalMovements || 0}</div>
                  <div className="metric-label">Movimientos</div>
                </div>
              </div>
            </div>

            {/* Especificaciones técnicas */}
            {(vehicle.enginePower || vehicle.fuelCapacity || vehicle.year) && (
              <div className="technical-specs">
                {vehicle.enginePower && (
                  <div className="spec-item">
                    <span className="spec-icon">⚡</span>
                    <span className="spec-value">{vehicle.enginePower} HP</span>
                  </div>
                )}
                
                {vehicle.fuelCapacity && (
                  <div className="spec-item">
                    <span className="spec-icon">🛢️</span>
                    <span className="spec-value">{vehicle.fuelCapacity} gal</span>
                  </div>
                )}
                
                {vehicle.year && (
                  <div className="spec-item">
                    <span className="spec-icon">📅</span>
                    <span className="spec-value">{vehicle.year}</span>
                  </div>
                )}
              </div>
            )}

            {/* Descripción */}
            {vehicle.description && (
              <div className="description">
                <p>{vehicle.description}</p>
              </div>
            )}
          </div>

          {/* Footer con fechas y acciones */}
          <div className="card-footer">
            <div className="date-info">
              {vehicle.lastMovementDate && (
                <div className="date-item">
                  <span className="date-label">Último movimiento:</span>
                  <span className="date-value">{formatDate(vehicle.lastMovementDate)}</span>
                  <span className="date-relative">{getRelativeTime(vehicle.lastMovementDate)}</span>
                </div>
              )}
              
              {vehicle.lastMaintenanceDate && (
                <div className="date-item">
                  <span className="date-label">Último mantenimiento:</span>
                  <span className="date-value">{formatDate(vehicle.lastMaintenanceDate)}</span>
                  <span className="date-relative">{getRelativeTime(vehicle.lastMaintenanceDate)}</span>
                </div>
              )}
            </div>

            <div className="card-actions">
              <button
                className="btn-view"
                onClick={() => onView(vehicle)}
                title="Ver detalles"
              >
                👁️
              </button>
              
              {onEdit && vehicle.status !== VEHICLE_STATUS.REPARACION && (
                <button
                  className="btn-edit"
                  onClick={() => onEdit(vehicle)}
                  title="Editar vehículo"
                >
                  ✏️
                </button>
              )}

              {onMaintenance && (
                <button
                  className="btn-maintenance"
                  onClick={() => onMaintenance(vehicle)}
                  title="Registrar mantenimiento"
                >
                  🔧
                </button>
              )}
            </div>
          </div>

          {/* Indicadores especiales */}
          {vehicle.status === VEHICLE_STATUS.MANTENIMIENTO && (
            <div className="maintenance-indicator">
              <div className="maintenance-pulse"></div>
            </div>
          )}

          {needsMaintenance(vehicle) && vehicle.status === VEHICLE_STATUS.ACTIVO && (
            <div className="maintenance-due-badge">
              <span>Mantenimiento Debido</span>
            </div>
          )}

          {vehicle.status === VEHICLE_STATUS.REPARACION && (
            <div className="repair-badge">
              <span>En Reparación</span>
            </div>
          )}

          {/* Indicador de eficiencia */}
          {vehicle.totalHoursWorked > 0 && (
            <div className="efficiency-indicator">
              <div className="efficiency-bar">
                <div 
                  className="efficiency-fill"
                  style={{ 
                    width: `${Math.min((vehicle.totalHoursWorked / 2000) * 100, 100)}%`
                  }}
                />
              </div>
              <span className="efficiency-label">
                {((vehicle.totalHoursWorked / 2000) * 100).toFixed(1)}% utilización anual
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VehiclesCards;
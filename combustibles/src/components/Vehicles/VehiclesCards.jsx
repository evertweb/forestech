/**
 * VehiclesCards - Vista en tarjetas para vehículos
 * Muestra los vehículos en formato de cards responsive
 */

import React from 'react';
import { VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';
import VehicleIcon from './VehicleIcon';

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
      year: 'numeric',
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

  // Obtener clase CSS para tipo de vehículo (dinámico)
  const getVehicleTypeClass = (type) => {
    if (!type) return 'vehicle-default';
    const lowerType = type.toLowerCase();
    if (lowerType.includes('excavadora')) return 'vehicle-excavadora';
    if (lowerType.includes('bulldozer')) return 'vehicle-bulldozer';
    if (lowerType.includes('cargador')) return 'vehicle-cargador';
    if (lowerType.includes('camion')) return 'vehicle-camion';
    if (lowerType.includes('grua')) return 'vehicle-grua';
    if (lowerType.includes('motosierra')) return 'vehicle-motosierra';
    if (lowerType.includes('tractor')) return 'vehicle-tractor';
    if (lowerType.includes('volqueta')) return 'vehicle-volqueta';
    return 'vehicle-default';
  };

  // Obtener clase CSS para estado
  const getStatusClass = (status) => {
    switch (status) {
      case VEHICLE_STATUS.ACTIVO:
        return 'status-activo';
      case VEHICLE_STATUS.MANTENIMIENTO:
        return 'status-mantenimiento';
      case VEHICLE_STATUS.INACTIVO:
        return 'status-inactivo';
      case VEHICLE_STATUS.REPARACION:
        return 'status-reparacion';
      default:
        return 'status-default';
    }
  };

  // Renderizar icono de vehículo personalizado
  const renderVehicleIcon = (vehicle) => {
    return <VehicleIcon iconId={vehicle.iconId} size="medium" showBorder={true} />;
  };

  // Obtener icono para combustible
  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case FUEL_COMPATIBILITY.DIESEL:
        return '🚛';
      case FUEL_COMPATIBILITY.GASOLINA:
        return '🚗';
      case FUEL_COMPATIBILITY.MIXTO:
        return '⛽';
      default:
        return '⛽';
    }
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
    <div className="vehicles-cards sap-theme sap-theme">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className={`vehicle-card sap-theme ${getVehicleTypeClass(vehicle.type)}`}
        >
          {/* Header de la tarjeta */}
          <div className="card-header sap-theme">
            <div className="vehicle-info sap-theme">
              <div className="vehicle-id-section sap-theme">
                {renderVehicleIcon(vehicle)}
                <div className="vehicle-details sap-theme">
                  <span className="vehicle-id sap-theme">{vehicle.vehicleId}</span>
                  <span className="vehicle-name sap-theme">{vehicle.name}</span>
                </div>
              </div>
              <div className={`status-badge ${getStatusClass(vehicle.status)}`}>
                <span className="status-icon sap-theme">{getStatusIcon(vehicle.status)}</span>
                <span className="status-label sap-theme">
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Información principal */}
          <div className="card-content sap-theme">
            {/* Información básica */}
            <div className="basic-info sap-theme">
              <div className="info-row sap-theme">
                <span className="info-label sap-theme">Tipo:</span>
                <span className="info-value sap-theme">
                  {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
                </span>
              </div>

              {vehicle.brand && vehicle.model && (
                <div className="info-row sap-theme">
                  <span className="info-label sap-theme">Marca/Modelo:</span>
                  <span className="info-value sap-theme">
                    {vehicle.brand} {vehicle.model}
                  </span>
                </div>
              )}

              <div className="info-row sap-theme">
                <span className="info-label sap-theme">Combustible:</span>
                <span className="info-value sap-theme">
                  {getFuelIcon(vehicle.fuelType)} {vehicle.fuelType}
                </span>
              </div>

              {vehicle.currentLocation && (
                <div className="info-row sap-theme">
                  <span className="info-label sap-theme">Ubicación:</span>
                  <span className="info-value sap-theme">📍 {vehicle.currentLocation}</span>
                </div>
              )}
            </div>

            {/* Métricas de consumo */}
            <div className="consumption-metrics sap-theme">
              <div className="metric-item sap-theme">
                <div className="metric-icon sap-theme">⛽</div>
                <div className="metric-content sap-theme">
                  <div className="metric-value sap-theme">
                    {formatGallons(vehicle.totalFuelConsumed || 0)}
                  </div>
                  <div className="metric-label sap-theme">Consumido</div>
                </div>
              </div>

              <div className="metric-item sap-theme">
                <div className="metric-icon sap-theme">⏰</div>
                <div className="metric-content sap-theme">
                  <div className="metric-value sap-theme">
                    {formatHours(vehicle.totalHoursWorked || 0)}
                  </div>
                  <div className="metric-label sap-theme">Trabajadas</div>
                </div>
              </div>

              <div className="metric-item sap-theme">
                <div className="metric-icon sap-theme">📊</div>
                <div className="metric-content sap-theme">
                  <div className="metric-value sap-theme">
                    {getConsumptionPerHour(vehicle).toFixed(1)} gal/hr
                  </div>
                  <div className="metric-label sap-theme">Consumo</div>
                </div>
              </div>

              <div className="metric-item sap-theme">
                <div className="metric-icon sap-theme">🔄</div>
                <div className="metric-content sap-theme">
                  <div className="metric-value sap-theme">{vehicle.totalMovements || 0}</div>
                  <div className="metric-label sap-theme">Movimientos</div>
                </div>
              </div>
            </div>

            {/* Especificaciones técnicas */}
            {(vehicle.enginePower || vehicle.fuelCapacity || vehicle.year) && (
              <div className="technical-specs sap-theme">
                {vehicle.enginePower && (
                  <div className="spec-item sap-theme">
                    <span className="spec-icon sap-theme">⚡</span>
                    <span className="spec-value sap-theme">{vehicle.enginePower} HP</span>
                  </div>
                )}

                {vehicle.fuelCapacity && (
                  <div className="spec-item sap-theme">
                    <span className="spec-icon sap-theme">🛢️</span>
                    <span className="spec-value sap-theme">{vehicle.fuelCapacity} gal</span>
                  </div>
                )}

                {vehicle.year && (
                  <div className="spec-item sap-theme">
                    <span className="spec-icon sap-theme">📅</span>
                    <span className="spec-value sap-theme">{vehicle.year}</span>
                  </div>
                )}
              </div>
            )}

            {/* Descripción */}
            {vehicle.description && (
              <div className="description sap-theme">
                <p>{vehicle.description}</p>
              </div>
            )}
          </div>

          {/* Footer con fechas y acciones */}
          <div className="card-footer sap-theme">
            <div className="date-info sap-theme">
              {vehicle.lastMovementDate && (
                <div className="date-item sap-theme">
                  <span className="date-label sap-theme">Último movimiento:</span>
                  <span className="date-value sap-theme">
                    {formatDate(vehicle.lastMovementDate)}
                  </span>
                  <span className="date-relative sap-theme">
                    {getRelativeTime(vehicle.lastMovementDate)}
                  </span>
                </div>
              )}

              {vehicle.lastMaintenanceDate && (
                <div className="date-item sap-theme">
                  <span className="date-label sap-theme">Último mantenimiento:</span>
                  <span className="date-value sap-theme">
                    {formatDate(vehicle.lastMaintenanceDate)}
                  </span>
                  <span className="date-relative sap-theme">
                    {getRelativeTime(vehicle.lastMaintenanceDate)}
                  </span>
                </div>
              )}
            </div>

            <div className="card-actions sap-theme">
              <button
                className="btn-view sap-theme"
                onClick={() => onView(vehicle)}
                title="Ver detalles"
              >
                👁️
              </button>

              {onEdit && vehicle.status !== VEHICLE_STATUS.REPARACION && (
                <button
                  className="btn-edit sap-theme"
                  onClick={() => onEdit(vehicle)}
                  title="Editar vehículo"
                >
                  ✏️
                </button>
              )}

              {onMaintenance && (
                <button
                  className="btn-maintenance sap-theme"
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
            <div className="maintenance-indicator sap-theme">
              <div className="maintenance-pulse sap-theme"></div>
            </div>
          )}

          {needsMaintenance(vehicle) && vehicle.status === VEHICLE_STATUS.ACTIVO && (
            <div className="maintenance-due-badge sap-theme">
              <span>Mantenimiento Debido</span>
            </div>
          )}

          {vehicle.status === VEHICLE_STATUS.REPARACION && (
            <div className="repair-badge sap-theme">
              <span>En Reparación</span>
            </div>
          )}

          {/* Indicador de eficiencia */}
          {vehicle.totalHoursWorked > 0 && (
            <div className="efficiency-indicator sap-theme">
              <div className="efficiency-bar sap-theme">
                <div
                  className="efficiency-fill sap-theme"
                  style={{
                    width: `${Math.min((vehicle.totalHoursWorked / 2000) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="efficiency-label sap-theme">
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

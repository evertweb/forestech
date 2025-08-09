/**
 * VehiclesTable - Vista en tabla para vehículos
 * Muestra los vehículos en formato de tabla compacta para desktop
 */

import React, { useState, useMemo, useCallback, memo } from 'react';
import { VEHICLE_STATUS, FUEL_COMPATIBILITY } from '../../services/vehiclesService';

const VehiclesTable = ({ vehicles, onEdit, onView, onMaintenance }) => {
  const [sortField, setSortField] = useState('vehicleId');
  const [sortDirection, setSortDirection] = useState('asc');

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
    if (!date) return '-';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Obtener icono para tipo de vehículo (dinámico)
  const getVehicleIcon = (type) => {
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

  // Obtener icono para combustible
  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case FUEL_COMPATIBILITY.DIESEL: return '🚛';
      case FUEL_COMPATIBILITY.GASOLINA: return '🚗';
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

  // Manejar ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Ordenar vehículos
  const sortedVehicles = useMemo(() => {
    const arr = [...vehicles];
    return arr.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Manejar fechas
    if (sortField.includes('Date') || sortField.includes('At')) {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    // Manejar números
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Manejar strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Manejar fechas
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Manejar valores nulos/undefined
    if (!aValue && !bValue) return 0;
    if (!aValue) return sortDirection === 'asc' ? 1 : -1;
    if (!bValue) return sortDirection === 'asc' ? -1 : 1;

      return 0;
    });
  }, [vehicles, sortField, sortDirection]);

  // Obtener icono de ordenamiento
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // (helpers de fila movidos a VehiclesRow para memoización)

  return (
    <div className="vehicles-table-container">
      <div className="table-wrapper">
        <table className="vehicles-table">
          <thead>
            <tr>
              <th 
                className="sortable"
                onClick={() => handleSort('vehicleId')}
              >
                ID Vehículo {getSortIcon('vehicleId')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('name')}
              >
                Nombre {getSortIcon('name')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('type')}
              >
                Tipo {getSortIcon('type')}
              </th>
              <th>Marca/Modelo</th>
              <th 
                className="sortable"
                onClick={() => handleSort('fuelType')}
              >
                Combustible {getSortIcon('fuelType')}
              </th>
              <th 
                className="sortable text-right"
                onClick={() => handleSort('totalFuelConsumed')}
              >
                Consumido {getSortIcon('totalFuelConsumed')}
              </th>
              <th 
                className="sortable text-right"
                onClick={() => handleSort('totalHoursWorked')}
              >
                Horas {getSortIcon('totalHoursWorked')}
              </th>
              <th className="text-right">Consumo/Hr</th>
              <th>Ubicación</th>
              <th 
                className="sortable"
                onClick={() => handleSort('status')}
              >
                Estado {getSortIcon('status')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('lastMovementDate')}
              >
                Último Mov. {getSortIcon('lastMovementDate')}
              </th>
              <th className="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedVehicles.map((vehicle) => (
              <VehiclesRow
                key={vehicle.id}
                vehicle={vehicle}
                onView={onView}
                onEdit={onEdit}
                onMaintenance={onMaintenance}
                getVehicleIcon={getVehicleIcon}
                getFuelIcon={getFuelIcon}
                getStatusIcon={getStatusIcon}
                getStatusClass={getStatusClass}
                formatGallons={formatGallons}
                formatHours={formatHours}
                formatDate={formatDate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Información de la tabla */}
      <div className="table-info">
        <div className="table-summary">
          <span className="total-rows">
            {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''}
          </span>
          {sortField && (
            <span className="sort-info">
              Ordenado por {sortField} ({sortDirection === 'asc' ? 'ascendente' : 'descendente'})
            </span>
          )}
        </div>

        <div className="table-legend">
          <span className="legend-item">
            <span className="legend-icon">✅</span> Activo
          </span>
          <span className="legend-item">
            <span className="legend-icon">🔧</span> Mantenimiento
          </span>
          <span className="legend-item">
            <span className="legend-icon">⏸️</span> Inactivo
          </span>
          <span className="legend-item">
            <span className="legend-icon">🔴</span> Reparación
          </span>
          <span className="legend-item">
            <span className="legend-icon">⚠️</span> Mantto. Debido
          </span>
        </div>
      </div>
    </div>
  );
};

export default VehiclesTable;

// Fila memoizada
const VehiclesRow = memo(function VehiclesRow({
  vehicle,
  onView,
  onEdit,
  onMaintenance,
  getVehicleIcon,
  getFuelIcon,
  getStatusIcon,
  getStatusClass,
  formatGallons,
  formatHours,
  formatDate
}) {
  const needsMaintenance = useCallback(() => {
    if (!vehicle.lastMaintenanceDate) return true;
    const daysSinceLastMaintenance = Math.floor(
      (new Date() - new Date(vehicle.lastMaintenanceDate)) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLastMaintenance > 90;
  }, [vehicle.lastMaintenanceDate]);

  const handleView = useCallback(() => onView(vehicle), [onView, vehicle]);
  const handleEdit = useCallback(() => onEdit && onEdit(vehicle), [onEdit, vehicle]);
  const handleMaintenance = useCallback(() => onMaintenance && onMaintenance(vehicle), [onMaintenance, vehicle]);

  return (
    <tr className={`vehicle-row ${vehicle.status === VEHICLE_STATUS.MANTENIMIENTO ? 'maintenance-row' : ''} ${needsMaintenance() ? 'needs-maintenance' : ''}`}>
      <td className="vehicle-id-cell">
        <div className="id-content">
          <span className="vehicle-icon">{getVehicleIcon(vehicle.type)}</span>
          <span className="vehicle-id">{vehicle.vehicleId}</span>
        </div>
      </td>
      <td className="name-cell">
        <span className="vehicle-name">{vehicle.name}</span>
      </td>
      <td className="type-cell">
        <span className="type-text">{vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</span>
      </td>
      <td className="brand-model-cell">
        {vehicle.brand && vehicle.model ? (
          <span className="brand-model">{vehicle.brand} {vehicle.model}</span>
        ) : (
          <span className="no-data">-</span>
        )}
      </td>
      <td className="fuel-cell">
        <div className="fuel-content">
          <span className="fuel-icon">{getFuelIcon(vehicle.fuelType)}</span>
          <span className="fuel-text">{vehicle.fuelType}</span>
        </div>
      </td>
      <td className="consumption-cell text-right">
        <span className="consumption-value">{formatGallons(vehicle.totalFuelConsumed || 0)}</span>
      </td>
      <td className="hours-cell text-right">
        <span className="hours-value">{formatHours(vehicle.totalHoursWorked || 0)}</span>
      </td>
      <td className="rate-cell text-right">
        <span className="rate-value">{(vehicle.totalHoursWorked ? (vehicle.totalFuelConsumed / vehicle.totalHoursWorked) : (vehicle.estimatedConsumptionPerHour || 0)).toFixed(1)} gal/hr</span>
      </td>
      <td className="location-cell">
        <span className="location-text">📍 {vehicle.currentLocation || 'Sin ubicación'}</span>
      </td>
      <td className="status-cell">
        <div className={`status-badge ${getStatusClass(vehicle.status)}`}>
          <span className="status-icon">{getStatusIcon(vehicle.status)}</span>
          <span className="status-text">{vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}</span>
        </div>
      </td>
      <td className="date-cell">
        <div className="date-content">
          <span className="date-value">{formatDate(vehicle.lastMovementDate)}</span>
          {needsMaintenance() && <span className="maintenance-warning">⚠️</span>}
        </div>
      </td>
      <td className="actions-cell">
        <div className="action-buttons">
          <button className="btn-action btn-view" onClick={handleView} title="Ver detalles">👁️</button>
          {onEdit && vehicle.status !== VEHICLE_STATUS.REPARACION && (
            <button className="btn-action btn-edit" onClick={handleEdit} title="Editar vehículo">✏️</button>
          )}
          {onMaintenance && (
            <button className="btn-action btn-maintenance" onClick={handleMaintenance} title="Registrar mantenimiento">🔧</button>
          )}
        </div>
      </td>
    </tr>
  );
});
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
      year: '2-digit',
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
    <div className="vehicles-table-container sap-theme">
      <div className="table-wrapper sap-theme">
        <table className="vehicles-table sap-theme">
          <thead>
            <tr>
              <th className="sortable sap-theme" onClick={() => handleSort('vehicleId')}>
                ID Vehículo {getSortIcon('vehicleId')}
              </th>
              <th className="sortable sap-theme" onClick={() => handleSort('name')}>
                Nombre {getSortIcon('name')}
              </th>
              <th className="sortable sap-theme" onClick={() => handleSort('type')}>
                Tipo {getSortIcon('type')}
              </th>
              <th>Marca/Modelo</th>
              <th className="sortable sap-theme" onClick={() => handleSort('fuelType')}>
                Combustible {getSortIcon('fuelType')}
              </th>
              <th
                className="sortable sap-theme text-right"
                onClick={() => handleSort('totalFuelConsumed')}
              >
                Consumido {getSortIcon('totalFuelConsumed')}
              </th>
              <th
                className="sortable sap-theme text-right"
                onClick={() => handleSort('totalHoursWorked')}
              >
                Horas {getSortIcon('totalHoursWorked')}
              </th>
              <th className="sap-theme text-right">Consumo/Hr</th>
              <th>Ubicación</th>
              <th className="sortable sap-theme" onClick={() => handleSort('status')}>
                Estado {getSortIcon('status')}
              </th>
              <th className="sortable sap-theme" onClick={() => handleSort('lastMovementDate')}>
                Último Mov. {getSortIcon('lastMovementDate')}
              </th>
              <th className="actions-column sap-theme">Acciones</th>
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
      <div className="table-info sap-theme">
        <div className="table-summary sap-theme">
          <span className="total-rows sap-theme">
            {vehicles.length} vehículo{vehicles.length !== 1 ? 's' : ''}
          </span>
          {sortField && (
            <span className="sort-info sap-theme">
              Ordenado por {sortField} ({sortDirection === 'asc' ? 'ascendente' : 'descendente'})
            </span>
          )}
        </div>

        <div className="table-legend sap-theme">
          <span className="legend-item sap-theme">
            <span className="legend-icon sap-theme">✅</span> Activo
          </span>
          <span className="legend-item sap-theme">
            <span className="legend-icon sap-theme">🔧</span> Mantenimiento
          </span>
          <span className="legend-item sap-theme">
            <span className="legend-icon sap-theme">⏸️</span> Inactivo
          </span>
          <span className="legend-item sap-theme">
            <span className="legend-icon sap-theme">🔴</span> Reparación
          </span>
          <span className="legend-item sap-theme">
            <span className="legend-icon sap-theme">⚠️</span> Mantto. Debido
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
  formatDate,
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
  const handleMaintenance = useCallback(
    () => onMaintenance && onMaintenance(vehicle),
    [onMaintenance, vehicle]
  );

  return (
    <tr
      className={`vehicle-row ${vehicle.status === VEHICLE_STATUS.MANTENIMIENTO ? 'maintenance-row' : ''} ${needsMaintenance() ? 'needs-maintenance' : ''}`}
    >
      <td className="vehicle-id-cell sap-theme">
        <div className="id-content sap-theme">
          <span className="vehicle-icon sap-theme">{getVehicleIcon(vehicle.type)}</span>
          <span className="vehicle-id sap-theme">{vehicle.vehicleId}</span>
        </div>
      </td>
      <td className="name-cell sap-theme">
        <span className="vehicle-name sap-theme">{vehicle.name}</span>
      </td>
      <td className="type-cell sap-theme">
        <span className="type-text sap-theme">
          {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}
        </span>
      </td>
      <td className="brand-model-cell sap-theme">
        {vehicle.brand && vehicle.model ? (
          <span className="brand-model sap-theme">
            {vehicle.brand} {vehicle.model}
          </span>
        ) : (
          <span className="no-data sap-theme">-</span>
        )}
      </td>
      <td className="fuel-cell sap-theme">
        <div className="fuel-content sap-theme">
          <span className="fuel-icon sap-theme">{getFuelIcon(vehicle.fuelType)}</span>
          <span className="fuel-text sap-theme">{vehicle.fuelType}</span>
        </div>
      </td>
      <td className="consumption-cell sap-theme text-right">
        <span className="consumption-value sap-theme">
          {formatGallons(vehicle.totalFuelConsumed || 0)}
        </span>
      </td>
      <td className="hours-cell sap-theme text-right">
        <span className="hours-value sap-theme">{formatHours(vehicle.totalHoursWorked || 0)}</span>
      </td>
      <td className="rate-cell sap-theme text-right">
        <span className="rate-value sap-theme">
          {(vehicle.totalHoursWorked
            ? vehicle.totalFuelConsumed / vehicle.totalHoursWorked
            : vehicle.estimatedConsumptionPerHour || 0
          ).toFixed(1)}{' '}
          gal/hr
        </span>
      </td>
      <td className="location-cell sap-theme">
        <span className="location-text sap-theme">
          📍 {vehicle.currentLocation || 'Sin ubicación'}
        </span>
      </td>
      <td className="status-cell sap-theme">
        <div className={`status-badge ${getStatusClass(vehicle.status)}`}>
          <span className="status-icon sap-theme">{getStatusIcon(vehicle.status)}</span>
          <span className="status-text sap-theme">
            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </span>
        </div>
      </td>
      <td className="date-cell sap-theme">
        <div className="date-content sap-theme">
          <span className="date-value sap-theme">{formatDate(vehicle.lastMovementDate)}</span>
          {needsMaintenance() && <span className="maintenance-warning sap-theme">⚠️</span>}
        </div>
      </td>
      <td className="actions-cell sap-theme">
        <div className="action-buttons sap-theme">
          <button
            className="btn-action btn-view sap-theme"
            onClick={handleView}
            title="Ver detalles"
          >
            👁️
          </button>
          {onEdit && vehicle.status !== VEHICLE_STATUS.REPARACION && (
            <button
              className="btn-action btn-edit sap-theme"
              onClick={handleEdit}
              title="Editar vehículo"
            >
              ✏️
            </button>
          )}
          {onMaintenance && (
            <button
              className="btn-action btn-maintenance sap-theme"
              onClick={handleMaintenance}
              title="Registrar mantenimiento"
            >
              🔧
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

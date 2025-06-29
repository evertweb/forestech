/**
 * MaintenanceTable - Vista de tabla para mantenimientos
 * Muestra información en formato de tabla con ordenamiento
 */

import React, { useState } from 'react';
import { MAINTENANCE_TYPES, MAINTENANCE_STATUS } from '../../services/maintenanceService';
import { formatCurrency, formatNumber } from '../../utils/calculations';

const MaintenanceTable = ({ 
  maintenanceRecords, 
  onEdit, 
  onView, 
  onDelete, 
  userRole 
}) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getMaintenanceIcon = (type) => {
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
        return 'Cambio de Aceite';
      case MAINTENANCE_TYPES.BATTERY_CHANGE:
        return 'Cambio de Batería';
      case MAINTENANCE_TYPES.FILTER_CHANGE:
        return 'Cambio de Filtros';
      case MAINTENANCE_TYPES.GENERAL_MAINTENANCE:
        return 'Mantenimiento General';
      default:
        return type;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case MAINTENANCE_STATUS.COMPLETED:
        return '✅';
      case MAINTENANCE_STATUS.PENDING:
        return '⏰';
      case MAINTENANCE_STATUS.CANCELLED:
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case MAINTENANCE_STATUS.COMPLETED:
        return 'Completado';
      case MAINTENANCE_STATUS.PENDING:
        return 'Pendiente';
      case MAINTENANCE_STATUS.CANCELLED:
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case MAINTENANCE_STATUS.COMPLETED:
        return 'status-completado';
      case MAINTENANCE_STATUS.PENDING:
        return 'status-pendiente';
      case MAINTENANCE_STATUS.CANCELLED:
        return 'status-cancelado';
      default:
        return 'status-unknown';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const sortedRecords = [...maintenanceRecords].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Manejar fechas
    if (sortField === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    // Manejar números
    if (['quantity', 'currentHours', 'nextChangeHours', 'cost'].includes(sortField)) {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    // Manejar strings
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const canManage = userRole === 'admin' || userRole === 'supervisor';

  return (
    <div className="maintenance-table-container">
      <div className="table-wrapper">
        <table className="maintenance-table">
          <thead>
            <tr>
              <th 
                className="sortable"
                onClick={() => handleSort('type')}
              >
                Tipo {getSortIcon('type')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('vehicleName')}
              >
                Vehículo {getSortIcon('vehicleName')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('date')}
              >
                Fecha {getSortIcon('date')}
              </th>
              <th>Detalles</th>
              <th 
                className="sortable"
                onClick={() => handleSort('status')}
              >
                Estado {getSortIcon('status')}
              </th>
              <th 
                className="sortable text-right"
                onClick={() => handleSort('cost')}
              >
                Costo {getSortIcon('cost')}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((maintenance) => (
              <tr key={maintenance.id} className="maintenance-row">
                {/* Tipo */}
                <td className="type-cell">
                  <div className="type-content">
                    <span className="type-icon">
                      {getMaintenanceIcon(maintenance.type)}
                    </span>
                    <span className="type-name">
                      {getMaintenanceTypeName(maintenance.type)}
                    </span>
                  </div>
                </td>

                {/* Vehículo */}
                <td className="vehicle-cell">
                  <div className="vehicle-info">
                    <div className="vehicle-name">{maintenance.vehicleName}</div>
                    <div className="vehicle-id">{maintenance.vehicleId}</div>
                  </div>
                </td>

                {/* Fecha */}
                <td className="date-cell">
                  <div className="date-content">
                    <div className="date-value">{formatDate(maintenance.date)}</div>
                  </div>
                </td>

                {/* Detalles */}
                <td className="details-cell">
                  {maintenance.type === MAINTENANCE_TYPES.OIL_CHANGE && (
                    <div className="oil-details">
                      <div>Qty: {formatNumber(maintenance.quantity)} gal</div>
                      <div>Hrs: {formatNumber(maintenance.currentHours)}</div>
                      {maintenance.filters && <div>Filtros: {maintenance.filters}</div>}
                    </div>
                  )}
                  {maintenance.type === MAINTENANCE_TYPES.BATTERY_CHANGE && (
                    <div className="battery-details">
                      <div>{maintenance.batteryType}</div>
                      {maintenance.brand && <div>{maintenance.brand}</div>}
                      <div>Estado: {maintenance.batteryStatus}</div>
                    </div>
                  )}
                  {maintenance.notes && (
                    <div className="notes-small">{maintenance.notes}</div>
                  )}
                </td>

                {/* Estado */}
                <td className="status-cell">
                  <div className={`status-badge ${getStatusClass(maintenance.status)}`}>
                    {getStatusIcon(maintenance.status)} {getStatusName(maintenance.status)}
                  </div>
                </td>

                {/* Costo */}
                <td className="cost-cell text-right">
                  {maintenance.cost ? formatCurrency(maintenance.cost) : 'N/A'}
                </td>

                {/* Acciones */}
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-view"
                      onClick={() => onView(maintenance)}
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    
                    {canManage && onEdit && (
                      <button
                        className="btn-action btn-edit"
                        onClick={() => onEdit(maintenance)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                    )}
                    
                    {canManage && onDelete && (
                      <button
                        className="btn-action btn-delete"
                        onClick={() => onDelete(maintenance.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información de la tabla */}
      <div className="table-info">
        <div className="table-summary">
          <span className="total-rows">
            {maintenanceRecords.length} mantenimiento{maintenanceRecords.length !== 1 ? 's' : ''} en total
          </span>
        </div>
        
        <div className="table-legend">
          <div className="legend-item">
            <span className="legend-dot oil-change"></span>
            <span>Cambio de Aceite</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot battery-change"></span>
            <span>Cambio de Batería</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot filter-change"></span>
            <span>Cambio de Filtros</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot general"></span>
            <span>Mantenimiento General</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTable;

/**
 * MaintenanceCards - Vista de cards para mantenimientos
 * Muestra información detallada en formato de tarjetas
 */

import React from 'react';
import { MAINTENANCE_TYPES, MAINTENANCE_STATUS } from '../../services/maintenanceService';
import { formatCurrency, formatNumber } from '../../utils/calculations';

const MaintenanceCards = ({ 
  maintenanceRecords, 
  onEdit, 
  onView, 
  onDelete, 
  userRole 
}) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelativeTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const maintenanceDate = new Date(date);
    const diffTime = Math.abs(now - maintenanceDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  const getMaintenanceTypeClass = (type) => {
    switch (type) {
      case MAINTENANCE_TYPES.OIL_CHANGE:
        return 'maintenance-oil-change';
      case MAINTENANCE_TYPES.BATTERY_CHANGE:
        return 'maintenance-battery-change';
      case MAINTENANCE_TYPES.FILTER_CHANGE:
        return 'maintenance-filter-change';
      case MAINTENANCE_TYPES.GENERAL_MAINTENANCE:
        return 'maintenance-general';
      default:
        return 'maintenance-general';
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

  const canManage = userRole === 'admin' || userRole === 'supervisor';

  return (
    <div className="maintenance-cards">
      {maintenanceRecords.map((maintenance) => (
        <div 
          key={maintenance.id} 
          className={`maintenance-card ${getMaintenanceTypeClass(maintenance.type)}`}
        >
          {/* Header */}
          <div className="card-header">
            <div className="maintenance-type">
              <span className="type-icon">
                {getMaintenanceIcon(maintenance.type)}
              </span>
              <span className="type-label">
                {getMaintenanceTypeName(maintenance.type)}
              </span>
            </div>
            <div className={`status-badge ${getStatusClass(maintenance.status)}`}>
              {getStatusIcon(maintenance.status)} {getStatusName(maintenance.status)}
            </div>
          </div>

          {/* Content */}
          <div className="card-content">
            {/* Información del vehículo */}
            <div className="vehicle-info">
              <span className="vehicle-icon">🚜</span>
              <div className="vehicle-details">
                <div className="vehicle-name">{maintenance.vehicleName}</div>
                <div className="vehicle-id">{maintenance.vehicleId}</div>
              </div>
            </div>

            {/* Fecha */}
            <div className="date-info">
              <div className="created-date">
                {formatDate(maintenance.date)}
              </div>
              <div className="relative-time">
                {getRelativeTime(maintenance.date)}
              </div>
            </div>

            {/* Información específica por tipo */}
            {maintenance.type === MAINTENANCE_TYPES.OIL_CHANGE && (
              <div className="oil-change-info">
                <div className="info-row">
                  <span className="info-label">Cantidad:</span>
                  <span className="info-value">{formatNumber(maintenance.quantity)} galones</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Horómetro:</span>
                  <span className="info-value">{formatNumber(maintenance.currentHours)} horas</span>
                </div>
                {maintenance.nextChangeHours && (
                  <div className="info-row">
                    <span className="info-label">Próximo cambio:</span>
                    <span className="info-value">{formatNumber(maintenance.nextChangeHours)} horas</span>
                  </div>
                )}
                {maintenance.filters && (
                  <div className="info-row">
                    <span className="info-label">Filtros:</span>
                    <span className="info-value">{maintenance.filters}</span>
                  </div>
                )}
              </div>
            )}

            {maintenance.type === MAINTENANCE_TYPES.BATTERY_CHANGE && (
              <div className="battery-change-info">
                <div className="info-row">
                  <span className="info-label">Tipo:</span>
                  <span className="info-value">{maintenance.batteryType}</span>
                </div>
                {maintenance.brand && (
                  <div className="info-row">
                    <span className="info-label">Marca:</span>
                    <span className="info-value">{maintenance.brand}</span>
                  </div>
                )}
                {maintenance.model && (
                  <div className="info-row">
                    <span className="info-label">Modelo:</span>
                    <span className="info-value">{maintenance.model}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Estado:</span>
                  <span className="info-value">{maintenance.batteryStatus}</span>
                </div>
                {maintenance.cost && (
                  <div className="info-row">
                    <span className="info-label">Costo:</span>
                    <span className="info-value">{formatCurrency(maintenance.cost)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Notas */}
            {maintenance.notes && (
              <div className="notes-section">
                <span className="notes-label">Notas:</span>
                <p className="notes-text">{maintenance.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="card-footer">
            <div className="card-actions">
              <button
                className="btn-view"
                onClick={() => onView(maintenance)}
                title="Ver detalles"
              >
                👁️ Ver
              </button>
              
              {canManage && onEdit && (
                <button
                  className="btn-edit"
                  onClick={() => onEdit(maintenance)}
                  title="Editar"
                >
                  ✏️ Editar
                </button>
              )}
              
              {canManage && onDelete && (
                <button
                  className="btn-delete"
                  onClick={() => onDelete(maintenance.id)}
                  title="Eliminar"
                >
                  🗑️ Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceCards;

/**
 * MaintenanceCards - Vista de cards para mantenimientos
 * Muestra información detallada en formato de tarjetas
 */

import React from 'react';
import { MAINTENANCE_TYPES, MAINTENANCE_STATUS } from '../../services/FirebaseMaintenanceService';
import { formatCurrency, formatNumber } from '../../utils/calculations';

const MaintenanceCards = ({ maintenanceRecords, onEdit, onView, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  return (
    <div className="maintenance-cards sap-theme">
      {maintenanceRecords.map((maintenance) => (
        <div
          key={maintenance.id}
          className={`maintenance-card sap-theme ${getMaintenanceTypeClass(maintenance.type)}`}
        >
          {/* Header */}
          <div className="card-header sap-theme">
            <div className="maintenance-type sap-theme">
              <span className="type-icon sap-theme">{getMaintenanceIcon(maintenance.type)}</span>
              <span className="type-label sap-theme">
                {getMaintenanceTypeName(maintenance.type)}
              </span>
            </div>
            <div className={`status-badge ${getStatusClass(maintenance.status)}`}>
              {getStatusIcon(maintenance.status)} {getStatusName(maintenance.status)}
            </div>
          </div>

          {/* Content */}
          <div className="card-content sap-theme">
            {/* Información del vehículo */}
            <div className="vehicle-info sap-theme">
              <span className="vehicle-icon sap-theme">🚜</span>
              <div className="vehicle-details sap-theme">
                <div className="vehicle-name sap-theme">{maintenance.vehicleName}</div>
                <div className="vehicle-id sap-theme">{maintenance.vehicleId}</div>
              </div>
            </div>

            {/* Fecha */}
            <div className="date-info sap-theme">
              <div className="created-date sap-theme">{formatDate(maintenance.date)}</div>
              <div className="relative-time sap-theme">{getRelativeTime(maintenance.date)}</div>
            </div>

            {/* Información específica por tipo */}
            {maintenance.type === MAINTENANCE_TYPES.OIL_CHANGE && (
              <div className="oil-change-info sap-theme">
                <div className="info-row sap-theme">
                  <span className="info-label sap-theme">Cantidad:</span>
                  <span className="info-value sap-theme">
                    {formatNumber(maintenance.quantity)} galones
                  </span>
                </div>
                <div className="info-row sap-theme">
                  <span className="info-label sap-theme">Horómetro:</span>
                  <span className="info-value sap-theme">
                    {formatNumber(maintenance.currentHours)} horas
                  </span>
                </div>
                {maintenance.nextChangeHours && (
                  <div className="info-row sap-theme">
                    <span className="info-label sap-theme">Próximo cambio:</span>
                    <span className="info-value sap-theme">
                      {formatNumber(maintenance.nextChangeHours)} horas
                    </span>
                  </div>
                )}
                {maintenance.filters && (
                  <div className="info-row sap-theme">
                    <span className="info-label sap-theme">Filtros:</span>
                    <span className="info-value sap-theme">{maintenance.filters}</span>
                  </div>
                )}
              </div>
            )}

            {maintenance.type === MAINTENANCE_TYPES.BATTERY_CHANGE && (
              <div className="battery-change-info sap-theme">
                <div className="info-row sap-theme">
                  <span className="info-label sap-theme">Tipo:</span>
                  <span className="info-value sap-theme">{maintenance.batteryType}</span>
                </div>
                {maintenance.brand && (
                  <div className="info-row sap-theme">
                    <span className="info-label sap-theme">Marca:</span>
                    <span className="info-value sap-theme">{maintenance.brand}</span>
                  </div>
                )}
                {maintenance.model && (
                  <div className="info-row sap-theme">
                    <span className="info-label sap-theme">Modelo:</span>
                    <span className="info-value sap-theme">{maintenance.model}</span>
                  </div>
                )}
                <div className="info-row sap-theme">
                  <span className="info-label sap-theme">Estado:</span>
                  <span className="info-value sap-theme">{maintenance.batteryStatus}</span>
                </div>
                {maintenance.cost && (
                  <div className="info-row sap-theme">
                    <span className="info-label sap-theme">Costo:</span>
                    <span className="info-value sap-theme">{formatCurrency(maintenance.cost)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Notas */}
            {maintenance.notes && (
              <div className="notes-section sap-theme">
                <span className="notes-label sap-theme">Notas:</span>
                <p className="notes-text sap-theme">{maintenance.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="card-footer sap-theme">
            <div className="card-actions sap-theme">
              <button
                className="btn-view sap-theme"
                onClick={() => onView(maintenance)}
                title="Ver detalles"
              >
                <span className="sap-visually-hidden">Ver</span>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1c-4 0-7.5 3-8 7 0.5 4 4 7 8 7s7.5-3 8-7c-0.5-4-4-7-8-7zM8 12c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
                  <circle cx="8" cy="7" r="2.5" />
                </svg>
              </button>

              {onEdit && (
                <button
                  className="btn-edit sap-theme"
                  onClick={() => onEdit(maintenance)}
                  title="Editar"
                >
                  <span className="sap-visually-hidden">Editar</span>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.854 1.854a.5.5 0 0 0-.708-.708L9 4.293 11.707 7l3.147-3.146a.5.5 0 0 0 0-.708l-2-2zM10 5L3 12v3h3l7-7L10 5z" />
                  </svg>
                </button>
              )}

              {onDelete && (
                <button
                  className="btn-delete sap-theme"
                  onClick={() => onDelete(maintenance.id)}
                  title="Eliminar"
                >
                  <span className="sap-visually-hidden">Eliminar</span>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                    <path
                      fill-rule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                    />
                  </svg>
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

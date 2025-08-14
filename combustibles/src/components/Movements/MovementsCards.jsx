/**
 * MovementsCards - Vista en tarjetas para movimientos
 * Muestra los movimientos en formato de cards responsive
 */

import React from 'react';
import { MOVEMENT_TYPES, MOVEMENT_STATUS } from '../../services/movementsService';

const MovementsCards = ({ movements, onEdit, onView, onApprove, onReject, onDelete, userRole }) => {
  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return 'Sin fecha';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Obtener tiempo relativo
  const getRelativeTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const moveDate = date instanceof Date ? date : new Date(date);
    const diffTime = Math.abs(now - moveDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays < 365) return `hace ${Math.ceil(diffDays / 30)} meses`;
    return `hace ${Math.ceil(diffDays / 365)} años`;
  };

  // Obtener clase CSS para tipo de movimiento
  const getMovementTypeClass = (type) => {
    switch (type) {
      case MOVEMENT_TYPES.ENTRADA:
        return 'movement-entrada';
      case MOVEMENT_TYPES.SALIDA:
        return 'movement-salida';
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return 'movement-transferencia';
      case MOVEMENT_TYPES.AJUSTE:
        return 'movement-ajuste';
      default:
        return 'movement-default';
    }
  };

  // Obtener clase CSS para estado
  const getStatusClass = (status) => {
    switch (status) {
      case MOVEMENT_STATUS.COMPLETADO:
        return 'status-completado';
      case MOVEMENT_STATUS.PENDIENTE:
        return 'status-pendiente';
      case MOVEMENT_STATUS.CANCELADO:
        return 'status-cancelado';
      default:
        return 'status-default';
    }
  };

  // Obtener icono para tipo de movimiento
  const getMovementIcon = (type) => {
    switch (type) {
      case MOVEMENT_TYPES.ENTRADA:
        return '📥';
      case MOVEMENT_TYPES.SALIDA:
        return '📤';
      case MOVEMENT_TYPES.TRANSFERENCIA:
        return '🔄';
      case MOVEMENT_TYPES.AJUSTE:
        return '⚖️';
      default:
        return '📋';
    }
  };

  // Obtener icono para combustible
  const getFuelIcon = (fuelType) => {
    switch (fuelType?.toUpperCase()) {
      case 'DIESEL':
        return '🚛';
      case 'GASOLINA':
        return '🚗';
      case 'LUBRICANTE':
        return '🛢️';
      default:
        return '⛽';
    }
  };

  // Obtener icono para estado
  const getStatusIcon = (status) => {
    switch (status) {
      case MOVEMENT_STATUS.COMPLETADO:
        return '✅';
      case MOVEMENT_STATUS.PENDIENTE:
        return '⏳';
      case MOVEMENT_STATUS.CANCELADO:
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="movements-cards sap-theme">
      {movements.map((movement) => (
        <div key={movement.id} className={`movement-card ${getMovementTypeClass(movement.type)}`}>
          {/* Header de la tarjeta */}
          <div className="card-header sap-theme">
            <div className="movement-type sap-theme">
              <span className="type-icon sap-theme">{getMovementIcon(movement.type)}</span>
              <span className="type-label sap-theme">
                {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
              </span>
            </div>
            <div className={`status-badge ${getStatusClass(movement.status)}`}>
              <span className="status-icon sap-theme">{getStatusIcon(movement.status)}</span>
              <span className="status-label sap-theme">
                {movement.status.charAt(0).toUpperCase() + movement.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Información principal */}
          <div className="card-content sap-theme">
            <div className="fuel-info sap-theme">
              <span className="fuel-icon sap-theme">{getFuelIcon(movement.fuelType)}</span>
              <span className="fuel-type sap-theme">{movement.fuelType}</span>
              <span className="quantity sap-theme">{movement.quantity} galones</span>
            </div>

            <div className="value-info sap-theme">
              <div className="total-value sap-theme">{formatCurrency(movement.totalValue)}</div>
              <div className="unit-price sap-theme">{formatCurrency(movement.unitPrice)}/galón</div>
            </div>

            {movement.vehicleId && (
              <div className="vehicle-info sap-theme">
                <span className="vehicle-icon sap-theme">🚜</span>
                <span className="vehicle-id sap-theme">Vehículo: {movement.vehicleId}</span>
              </div>
            )}

            {movement.location && (
              <div className="location-info sap-theme">
                <span className="location-icon sap-theme">📍</span>
                <span className="location sap-theme">{movement.location}</span>
              </div>
            )}

            {movement.description && (
              <div className="description sap-theme">
                <p>{movement.description}</p>
              </div>
            )}

            {movement.reference && (
              <div className="reference sap-theme">
                <span className="reference-label sap-theme">Ref:</span>
                <span className="reference-value sap-theme">{movement.reference}</span>
              </div>
            )}
          </div>

          {/* Footer con fecha y acciones */}
          <div className="card-footer sap-theme">
            <div className="date-info sap-theme">
              <div className="created-date sap-theme">{formatDate(movement.createdAt)}</div>
              <div className="relative-time sap-theme">{getRelativeTime(movement.createdAt)}</div>
            </div>

            <div className="card-actions sap-theme">
              {userRole === 'admin' && movement.status === MOVEMENT_STATUS.PENDIENTE && (
                <div className="admin-actions sap-theme">
                  <button
                    className="btn-approve sap-theme"
                    onClick={() => onApprove(movement.id)}
                    title="Aprobar movimiento"
                  >
                    ✓ Aprobar
                  </button>
                  <button
                    className="btn-reject sap-theme"
                    onClick={() => onReject(movement.id)}
                    title="Rechazar movimiento"
                  >
                    ✗ Rechazar
                  </button>
                </div>
              )}

              <div className="user-actions sap-theme">
                <button
                  className="btn-view sap-theme"
                  onClick={() => onView(movement)}
                  title="Ver detalles"
                >
                  👁️ Ver
                </button>

                {onEdit && movement.status === MOVEMENT_STATUS.PENDIENTE && (
                  <button
                    className="btn-edit sap-theme"
                    onClick={() => onEdit(movement)}
                    title="Editar movimiento"
                  >
                    ✏️ Editar
                  </button>
                )}

                {userRole === 'admin' && (
                  <button
                    className="btn-delete sap-theme"
                    onClick={() => {
                      if (
                        window.confirm(
                          '¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer.'
                        )
                      ) {
                        onDelete(movement.id);
                      }
                    }}
                    title="Eliminar movimiento"
                  >
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Indicador de urgencia para movimientos pendientes */}
          {movement.status === MOVEMENT_STATUS.PENDIENTE && (
            <div className="urgency-indicator sap-theme">
              <div className="urgency-pulse sap-theme"></div>
            </div>
          )}

          {/* Indicador para ajustes */}
          {movement.type === MOVEMENT_TYPES.AJUSTE && (
            <div className="adjustment-badge sap-theme">
              <span>Ajuste</span>
            </div>
          )}

          {/* Indicador para transferencias */}
          {movement.type === MOVEMENT_TYPES.TRANSFERENCIA && movement.destinationLocation && (
            <div className="transfer-info sap-theme">
              <span className="transfer-arrow sap-theme">→</span>
              <span className="destination sap-theme">{movement.destinationLocation}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MovementsCards;

/**
 * MovementsCards - Vista en tarjetas para movimientos
 * Muestra los movimientos en formato de cards responsive
 */

import React from 'react';
import { MOVEMENT_TYPES, MOVEMENT_STATUS } from '../../services/movementsService';

const MovementsCards = ({ movements, onEdit, onView, userRole }) => {
  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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
      minute: '2-digit'
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
      case MOVEMENT_TYPES.ENTRADA: return 'movement-entrada';
      case MOVEMENT_TYPES.SALIDA: return 'movement-salida';
      case MOVEMENT_TYPES.TRANSFERENCIA: return 'movement-transferencia';
      case MOVEMENT_TYPES.AJUSTE: return 'movement-ajuste';
      default: return 'movement-default';
    }
  };

  // Obtener clase CSS para estado
  const getStatusClass = (status) => {
    switch (status) {
      case MOVEMENT_STATUS.COMPLETADO: return 'status-completado';
      case MOVEMENT_STATUS.PENDIENTE: return 'status-pendiente';
      case MOVEMENT_STATUS.CANCELADO: return 'status-cancelado';
      default: return 'status-default';
    }
  };

  // Obtener icono para tipo de movimiento
  const getMovementIcon = (type) => {
    switch (type) {
      case MOVEMENT_TYPES.ENTRADA: return '📥';
      case MOVEMENT_TYPES.SALIDA: return '📤';
      case MOVEMENT_TYPES.TRANSFERENCIA: return '🔄';
      case MOVEMENT_TYPES.AJUSTE: return '⚖️';
      default: return '📋';
    }
  };

  // Obtener icono para combustible
  const getFuelIcon = (fuelType) => {
    switch (fuelType?.toLowerCase()) {
      case 'diesel': return '🚛';
      case 'gasolina': return '🚗';
      case 'acpm': return '🚚';
      case 'lubricante': return '🛢️';
      default: return '⛽';
    }
  };

  // Obtener icono para estado
  const getStatusIcon = (status) => {
    switch (status) {
      case MOVEMENT_STATUS.COMPLETADO: return '✅';
      case MOVEMENT_STATUS.PENDIENTE: return '⏳';
      case MOVEMENT_STATUS.CANCELADO: return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="movements-cards">
      {movements.map((movement) => (
        <div 
          key={movement.id} 
          className={`movement-card ${getMovementTypeClass(movement.type)}`}
        >
          {/* Header de la tarjeta */}
          <div className="card-header">
            <div className="movement-type">
              <span className="type-icon">{getMovementIcon(movement.type)}</span>
              <span className="type-label">
                {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
              </span>
            </div>
            <div className={`status-badge ${getStatusClass(movement.status)}`}>
              <span className="status-icon">{getStatusIcon(movement.status)}</span>
              <span className="status-label">
                {movement.status.charAt(0).toUpperCase() + movement.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Información principal */}
          <div className="card-content">
            <div className="fuel-info">
              <span className="fuel-icon">{getFuelIcon(movement.fuelType)}</span>
              <span className="fuel-type">{movement.fuelType}</span>
              <span className="quantity">{movement.quantity} galones</span>
            </div>

            <div className="value-info">
              <div className="total-value">{formatCurrency(movement.totalValue)}</div>
              <div className="unit-price">
                {formatCurrency(movement.unitPrice)}/galón
              </div>
            </div>

            {movement.vehicleId && (
              <div className="vehicle-info">
                <span className="vehicle-icon">🚜</span>
                <span className="vehicle-id">Vehículo: {movement.vehicleId}</span>
              </div>
            )}

            {movement.location && (
              <div className="location-info">
                <span className="location-icon">📍</span>
                <span className="location">{movement.location}</span>
              </div>
            )}

            {movement.description && (
              <div className="description">
                <p>{movement.description}</p>
              </div>
            )}

            {movement.reference && (
              <div className="reference">
                <span className="reference-label">Ref:</span>
                <span className="reference-value">{movement.reference}</span>
              </div>
            )}
          </div>

          {/* Footer con fecha y acciones */}
          <div className="card-footer">
            <div className="date-info">
              <div className="created-date">{formatDate(movement.createdAt)}</div>
              <div className="relative-time">{getRelativeTime(movement.createdAt)}</div>
            </div>

            <div className="card-actions">
              <button
                className="btn-view"
                onClick={() => onView(movement)}
                title="Ver detalles"
              >
                👁️
              </button>
              
              {onEdit && movement.status === MOVEMENT_STATUS.PENDIENTE && (
                <button
                  className="btn-edit"
                  onClick={() => onEdit(movement)}
                  title="Editar movimiento"
                >
                  ✏️
                </button>
              )}

              {movement.status === MOVEMENT_STATUS.PENDIENTE && userRole === 'admin' && (
                <button
                  className="btn-approve"
                  onClick={() => {
                    // TODO: Implementar aprobación
                    console.log('Aprobar movimiento:', movement.id);
                  }}
                  title="Aprobar movimiento"
                >
                  ✓
                </button>
              )}
            </div>
          </div>

          {/* Indicador de urgencia para movimientos pendientes */}
          {movement.status === MOVEMENT_STATUS.PENDIENTE && (
            <div className="urgency-indicator">
              <div className="urgency-pulse"></div>
            </div>
          )}

          {/* Indicador para ajustes */}
          {movement.type === MOVEMENT_TYPES.AJUSTE && (
            <div className="adjustment-badge">
              <span>Ajuste</span>
            </div>
          )}

          {/* Indicador para transferencias */}
          {movement.type === MOVEMENT_TYPES.TRANSFERENCIA && movement.destinationLocation && (
            <div className="transfer-info">
              <span className="transfer-arrow">→</span>
              <span className="destination">{movement.destinationLocation}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MovementsCards;
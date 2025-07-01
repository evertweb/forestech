/**
 * MovementsTable - Vista en tabla para movimientos
 * Muestra los movimientos en formato de tabla compacta para desktop
 */

import React, { useState } from 'react';
import { MOVEMENT_TYPES, MOVEMENT_STATUS } from '../../services/movementsService';

const MovementsTable = ({ movements, onEdit, onView, onApprove, onReject, onDelete, userRole }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

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
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Obtener clase CSS para estado
  const getStatusClass = (status) => {
    switch (status) {
      case MOVEMENT_STATUS.COMPLETADO: return 'status-completado';
      case MOVEMENT_STATUS.PENDIENTE: return 'status-pendiente';
      case MOVEMENT_STATUS.CANCELADO: return 'status-cancelado';
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

  // Ordenar movimientos
  const sortedMovements = [...movements].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Manejar fechas
    if (sortField.includes('Date') || sortField.includes('At')) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
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

    return 0;
  });

  // Obtener icono de ordenamiento
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="movements-table-container">
      <div className="table-wrapper">
        <table className="movements-table">
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
                onClick={() => handleSort('fuelType')}
              >
                Combustible {getSortIcon('fuelType')}
              </th>
              <th 
                className="sortable text-right"
                onClick={() => handleSort('quantity')}
              >
                Cantidad {getSortIcon('quantity')}
              </th>
              <th 
                className="sortable text-right"
                onClick={() => handleSort('unitPrice')}
              >
                Precio/Gal {getSortIcon('unitPrice')}
              </th>
              <th 
                className="sortable text-right"
                onClick={() => handleSort('totalValue')}
              >
                Valor Total {getSortIcon('totalValue')}
              </th>
              <th>Vehículo</th>
              <th>Ubicación</th>
              <th 
                className="sortable"
                onClick={() => handleSort('status')}
              >
                Estado {getSortIcon('status')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('createdAt')}
              >
                Fecha {getSortIcon('createdAt')}
              </th>
              <th className="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedMovements.map((movement) => (
              <tr 
                key={movement.id}
                className={`movement-row ${movement.status === MOVEMENT_STATUS.PENDIENTE ? 'pending-row' : ''}`}
              >
                <td className="type-cell">
                  <div className="type-content">
                    <span className="type-icon">{getMovementIcon(movement.type)}</span>
                    <span className="type-text">
                      {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
                    </span>
                  </div>
                </td>

                <td className="fuel-cell">
                  <div className="fuel-content">
                    <span className="fuel-icon">{getFuelIcon(movement.fuelType)}</span>
                    <span className="fuel-text">{movement.fuelType}</span>
                  </div>
                </td>

                <td className="quantity-cell text-right">
                  <span className="quantity-value">{movement.quantity}</span>
                  <span className="quantity-unit">gal</span>
                </td>

                <td className="price-cell text-right">
                  {formatCurrency(movement.unitPrice)}
                </td>

                <td className="value-cell text-right">
                  <strong>{formatCurrency(movement.totalValue)}</strong>
                </td>

                <td className="vehicle-cell">
                  {movement.vehicleId ? (
                    <span className="vehicle-id">
                      🚜 {movement.vehicleId}
                    </span>
                  ) : (
                    <span className="no-vehicle">-</span>
                  )}
                </td>

                <td className="location-cell">
                  <span className="location-text">
                    📍 {movement.type === MOVEMENT_TYPES.ENTRADA 
                      ? (movement.destinationLocation || 'Sin ubicación') 
                      : (movement.location || 'Principal')
                    }
                  </span>
                </td>

                <td className="status-cell">
                  <div className={`status-badge ${getStatusClass(movement.status)}`}>
                    <span className="status-icon">{getStatusIcon(movement.status)}</span>
                    <span className="status-text">
                      {movement.status.charAt(0).toUpperCase() + movement.status.slice(1)}
                    </span>
                  </div>
                </td>

                <td className="date-cell">
                  <div className="date-content">
                    <span className="date-value">{formatDate(movement.createdAt)}</span>
                    {movement.reference && (
                      <span className="reference-small">#{movement.reference}</span>
                    )}
                  </div>
                </td>

                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-view"
                      onClick={() => onView(movement)}
                      title="Ver detalles"
                    >
                      👁️
                    </button>
                    
                    {userRole === 'admin' && movement.status === MOVEMENT_STATUS.PENDIENTE && (
                      <>
                        <button
                          className="btn-action btn-approve"
                          onClick={() => onApprove(movement.id)}
                          title="Aprobar movimiento"
                        >
                          ✓
                        </button>
                        <button
                          className="btn-action btn-reject"
                          onClick={() => onReject(movement.id)}
                          title="Rechazar movimiento"
                        >
                          ✗
                        </button>
                      </>
                    )}

                    {onEdit && movement.status === MOVEMENT_STATUS.PENDIENTE && (
                      <button
                        className="btn-action btn-edit"
                        onClick={() => onEdit(movement)}
                        title="Editar movimiento"
                      >
                        ✏️
                      </button>
                    )}

                    {userRole === 'admin' && (
                      <button
                        className="btn-action btn-delete"
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer.')) {
                            onDelete(movement.id);
                          }
                        }}
                        title="Eliminar movimiento"
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
            {movements.length} movimiento{movements.length !== 1 ? 's' : ''}
          </span>
          {sortField && (
            <span className="sort-info">
              Ordenado por {sortField} ({sortDirection === 'asc' ? 'ascendente' : 'descendente'})
            </span>
          )}
        </div>

        <div className="table-legend">
          <span className="legend-item">
            <span className="legend-icon">⏳</span> Pendiente
          </span>
          <span className="legend-item">
            <span className="legend-icon">✅</span> Completado
          </span>
          <span className="legend-item">
            <span className="legend-icon">❌</span> Cancelado
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovementsTable;
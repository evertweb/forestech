/**
 * MovementsTable - Vista en tabla para movimientos
 * Muestra los movimientos en formato de tabla compacta para desktop
 */

import React, { useState, useMemo, useCallback, memo } from 'react';

// REFACTORED: Removed legacy service import, using constants directly
const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
};

const MOVEMENT_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
};

const MovementsTable = ({ movements, onEdit, onView, onApprove, onReject, onDelete, userRole }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

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
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
  const sortedMovements = useMemo(() => {
    const arr = [...movements];
    return arr.sort((a, b) => {
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
  }, [movements, sortField, sortDirection]);

  // Obtener icono de ordenamiento
  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="apple-content-section">
      <div className="table-wrapper">
        <table className="apple-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('type')}>
                Tipo {getSortIcon('type')}
              </th>
              <th className="sortable" onClick={() => handleSort('fuelType')}>
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
              <th className="sortable" onClick={() => handleSort('status')}>
                Estado {getSortIcon('status')}
              </th>
              <th className="sortable" onClick={() => handleSort('createdAt')}>
                Fecha {getSortIcon('createdAt')}
              </th>
              <th className="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedMovements.map((movement) => (
              <MovementRow
                key={movement.id}
                movement={movement}
                userRole={userRole}
                onView={onView}
                onApprove={onApprove}
                onReject={onReject}
                onEdit={onEdit}
                onDelete={onDelete}
                getMovementIcon={getMovementIcon}
                getFuelIcon={getFuelIcon}
                getStatusIcon={getStatusIcon}
                getStatusClass={getStatusClass}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Información de la tabla */}
      <div className="apple-card-footer">
        <div className="apple-body-small text-secondary">
          <span>
            {movements.length} movimiento{movements.length !== 1 ? 's' : ''}
          </span>
          {sortField && (
            <span>
              · Ordenado por {sortField} ({sortDirection === 'asc' ? 'ascendente' : 'descendente'})
            </span>
          )}
        </div>

        <div className="table-legend">
          <span className="apple-badge apple-badge-warning">
            ⏳ Pendiente
          </span>
          <span className="apple-badge apple-badge-success">
            ✅ Completado
          </span>
          <span className="apple-badge apple-badge-error">
            ❌ Cancelado
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovementsTable;

// Fila memoizada
const MovementRow = memo(function MovementRow({
  movement,
  userRole,
  onView,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  getMovementIcon,
  getFuelIcon,
  getStatusIcon,
  getStatusClass,
  formatCurrency,
  formatDate,
}) {
  const handleView = useCallback(() => onView(movement), [onView, movement]);
  const handleApprove = useCallback(
    () => onApprove && onApprove(movement.id),
    [onApprove, movement.id]
  );
  const handleReject = useCallback(
    () => onReject && onReject(movement.id),
    [onReject, movement.id]
  );
  const handleEdit = useCallback(() => onEdit && onEdit(movement), [onEdit, movement]);
  const handleDelete = useCallback(() => {
    if (!onDelete) return;
    if (
      window.confirm(
        '¿Estás seguro de que deseas eliminar este movimiento? Esta acción no se puede deshacer.'
      )
    ) {
      onDelete(movement.id);
    }
  }, [onDelete, movement.id]);

  return (
    <tr
      className={`movement-row ${movement.status === MOVEMENT_STATUS.PENDIENTE ? 'pending-row' : ''}`}
    >
      <td className="type-cell">
        <div className="movement-type">
          <span className="movement-type-icon">
            {getMovementIcon(movement.type)}
          </span>
          <span className="apple-body-medium type-text">
            {movement.type
              ? movement.type.charAt(0).toUpperCase() + movement.type.slice(1)
              : 'Sin tipo'}
          </span>
        </div>
      </td>
      <td className="fuel-cell">
        <div className="fuel-info">
          <span className="fuel-icon">{getFuelIcon(movement.fuelType)}</span>
          <span className="apple-body-medium fuel-type">{movement.fuelType}</span>
        </div>
      </td>
      <td className="quantity-cell text-right">
        <span className="apple-body-medium quantity-value">{movement.quantity}</span>
        <span className="apple-body-small text-secondary quantity-unit">gal</span>
      </td>
      <td className="price-cell text-right">
        <span className="apple-body-medium">{formatCurrency(movement.unitPrice)}</span>
      </td>
      <td className="value-cell text-right">
        <strong className="apple-body-medium">{formatCurrency(movement.totalValue)}</strong>
      </td>
      <td className="vehicle-cell">
        {movement.vehicleId ? (
          <span className="apple-body-medium vehicle-id">🚜 {movement.vehicleId}</span>
        ) : (
          <span className="apple-body-small text-secondary no-vehicle">-</span>
        )}
      </td>
      <td className="location-cell">
        <span className="apple-body-medium location-text">
          📍{' '}
          {movement.type === MOVEMENT_TYPES.ENTRADA
            ? movement.destinationLocation || 'Sin ubicación'
            : movement.location || 'Principal'}
        </span>
      </td>
      <td className="status-cell">
        <div className={`apple-status-badge ${getStatusClass(movement.status)}`}>
          <span className="status-icon">{getStatusIcon(movement.status)}</span>
          <span className="apple-body-small status-text">
            {movement.status
              ? movement.status.charAt(0).toUpperCase() + movement.status.slice(1)
              : 'Sin estado'}
          </span>
        </div>
      </td>
      <td className="date-cell">
        <div className="date-content">
          <span className="apple-body-medium date-value">{formatDate(movement.createdAt)}</span>
          {movement.reference && (
            <span className="apple-body-small text-secondary reference-small">#{movement.reference}</span>
          )}
        </div>
      </td>
      <td className="actions-cell">
        <div className="apple-action-buttons">
          <button
            className="apple-action-button"
            onClick={handleView}
            title="Ver detalles"
          >
            👁️
          </button>
          {userRole === 'admin' && movement.status === MOVEMENT_STATUS.PENDIENTE && (
            <>
              <button
                className="apple-action-button"
                onClick={handleApprove}
                title="Aprobar movimiento"
                style={{ color: 'var(--interactive-success)' }}
              >
                ✓
              </button>
              <button
                className="apple-action-button"
                onClick={handleReject}
                title="Rechazar movimiento"
                style={{ color: 'var(--interactive-error)' }}
              >
                ✗
              </button>
            </>
          )}
          {onEdit && movement.status === MOVEMENT_STATUS.PENDIENTE && (
            <button
              className="apple-action-button primary"
              onClick={handleEdit}
              title="Editar movimiento"
            >
              ✏️
            </button>
          )}
          {userRole === 'admin' && (
            <button
              className="apple-action-button"
              onClick={handleDelete}
              title="Eliminar movimiento"
              style={{ color: 'var(--interactive-error)' }}
            >
              🗑️
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

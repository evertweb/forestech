// combustibles/src/components/Inventory/InventoryTable.jsx
// Vista de tabla para el inventario
import React, { useState } from 'react';
import { FUEL_INFO, STOCK_ALERTS } from '../../constants/combustibleTypes';

const InventoryTable = ({ items, onEdit, onDelete, canManage }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-CO').format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTimeAgo = (date) => {
    if (!date) return 'N/A';
    
    const now = new Date();
    let timestamp;
    
    // Manejar diferentes formatos de fecha de forma segura
    if (date && typeof date === 'object') {
      if (date.seconds) {
        timestamp = new Date(date.seconds * 1000);
      } else if (date.toDate && typeof date.toDate === 'function') {
        timestamp = date.toDate();
      } else if (date instanceof Date) {
        timestamp = date;
      } else {
        return 'N/A';
      }
    } else if (typeof date === 'string' || typeof date === 'number') {
      timestamp = new Date(date);
    } else {
      return 'N/A';
    }
    
    // Verificar que timestamp es válido
    if (isNaN(timestamp.getTime())) return 'N/A';
    
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'ahora';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle special cases
    if (sortField === 'lastUpdated') {
      // Manejar fechas de forma segura
      const parseDate = (date) => {
        if (!date) return new Date(0);
        if (date && typeof date === 'object') {
          if (date.seconds) return new Date(date.seconds * 1000);
          if (date.toDate && typeof date.toDate === 'function') return date.toDate();
          if (date instanceof Date) return date;
        }
        return new Date(date);
      };
      
      aValue = parseDate(aValue);
      bValue = parseDate(bValue);
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="inventory-table-container">
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('name')}
                className="sortable"
              >
                Combustible {getSortIcon('name')}
              </th>
              <th 
                onClick={() => handleSort('location')}
                className="sortable"
              >
                Ubicación {getSortIcon('location')}
              </th>
              <th 
                onClick={() => handleSort('currentStock')}
                className="sortable"
              >
                Stock Actual {getSortIcon('currentStock')}
              </th>
              <th 
                onClick={() => handleSort('stockPercentage')}
                className="sortable"
              >
                Nivel {getSortIcon('stockPercentage')}
              </th>
              <th 
                onClick={() => handleSort('pricePerUnit')}
                className="sortable"
              >
                Precio {getSortIcon('pricePerUnit')}
              </th>
              <th>Valor Total</th>
              <th 
                onClick={() => handleSort('status')}
                className="sortable"
              >
                Estado {getSortIcon('status')}
              </th>
              <th 
                onClick={() => handleSort('lastUpdated')}
                className="sortable"
              >
                Actualizado {getSortIcon('lastUpdated')}
              </th>
              {canManage && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => {
              const fuelInfo = FUEL_INFO[item.fuelType];
              const stockAlert = STOCK_ALERTS[item.stockLevel];
              
              // Validar valores numéricos para evitar NaN
              const currentStock = parseFloat(item.currentStock) || 0;
              const pricePerUnit = parseFloat(item.pricePerUnit) || 0;
              const maxCapacity = parseFloat(item.maxCapacity) || 0;
              const stockPercentage = parseFloat(item.stockPercentage) || 0;
              
              const totalValue = currentStock * pricePerUnit;

              return (
                <tr key={item.id} className={item.needsRestock ? 'needs-restock' : ''}>
                  {/* Combustible */}
                  <td className="fuel-cell">
                    <div className="fuel-info">
                      <span 
                        className="fuel-icon"
                        style={{ color: fuelInfo?.color }}
                      >
                        {fuelInfo?.icon}
                      </span>
                      <div>
                        <div className="fuel-name">{fuelInfo?.name}</div>
                        <div className="fuel-type">{item.fuelType}</div>
                      </div>
                    </div>
                  </td>

                  {/* Ubicación */}
                  <td>{item.location}</td>

                  {/* Stock Actual */}
                  <td className="stock-cell">
                    <div className="stock-info">
                      <span className="stock-amount">
                        {formatNumber(currentStock)}
                      </span>
                      <span className="stock-unit">/ {formatNumber(maxCapacity)} {item.unit || 'gal'}</span>
                    </div>
                    {item.needsRestock && (
                      <div className="restock-indicator">
                        ⚠️ Bajo mínimo
                      </div>
                    )}
                  </td>

                  {/* Nivel */}
                  <td className="level-cell">
                    <div className="level-info">
                      <div 
                        className="level-badge"
                        style={{ 
                          backgroundColor: stockAlert?.color,
                          color: 'white'
                        }}
                      >
                        {stockPercentage}%
                      </div>
                      <div className="level-bar">
                        <div 
                          className="level-fill"
                          style={{ 
                            width: `${stockPercentage}%`,
                            backgroundColor: stockAlert?.color
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Precio */}
                  <td className="price-cell">
                    <div className="price-info">
                      <span className="price-amount">
                        {formatCurrency(pricePerUnit)}
                      </span>
                      <span className="price-unit">/ {item.unit || 'gal'}</span>
                    </div>
                  </td>

                  {/* Valor Total */}
                  <td className="value-cell">
                    <span className="total-value">
                      {formatCurrency(totalValue)}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="status-cell">
                    <span className={`status-badge ${item.status}`}>
                      <span className="status-dot"></span>
                      {item.status === 'active' ? 'Activo' : 
                       item.status === 'inactive' ? 'Inactivo' : 
                       item.status === 'maintenance' ? 'Mantenimiento' : item.status}
                    </span>
                  </td>

                  {/* Actualizado */}
                  <td className="updated-cell">
                    <span className="time-ago">
                      {getTimeAgo(item.lastUpdated)}
                    </span>
                  </td>

                  {/* Acciones */}
                  {canManage && (
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => onEdit(item)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(item)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="table-footer">
        <div className="table-info">
          {sortedItems.length} items ordenados por {sortField} 
          ({sortDirection === 'asc' ? 'ascendente' : 'descendente'})
        </div>
        
        <div className="table-legend">
          <span className="legend-item">
            <span className="legend-dot critical"></span>
            Crítico
          </span>
          <span className="legend-item">
            <span className="legend-dot low"></span>
            Bajo
          </span>
          <span className="legend-item">
            <span className="legend-dot normal"></span>
            Normal
          </span>
          <span className="legend-item">
            <span className="legend-dot high"></span>
            Alto
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
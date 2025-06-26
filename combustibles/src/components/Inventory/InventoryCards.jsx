// combustibles/src/components/Inventory/InventoryCards.jsx
// Vista de cards para el inventario
import React from 'react';
import { FUEL_INFO, STOCK_ALERTS } from '../../constants/combustibleTypes';

const InventoryCards = ({ items, onEdit, onDelete, canManage }) => {
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
    const now = new Date();
    const diff = now - new Date(date.seconds ? date.seconds * 1000 : date);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    return 'hace unos minutos';
  };

  return (
    <div className="inventory-cards-grid">
      {items.map((item) => {
        const fuelInfo = FUEL_INFO[item.fuelType];
        const stockAlert = STOCK_ALERTS[item.stockLevel];
        const totalValue = item.currentStock * item.pricePerUnit;

        return (
          <div key={item.id} className="inventory-card">
            {/* Header */}
            <div className="card-header">
              <div className="fuel-info">
                <span 
                  className="fuel-icon" 
                  style={{ color: fuelInfo?.color }}
                >
                  {fuelInfo?.icon}
                </span>
                <div className="fuel-details">
                  <h3>{fuelInfo?.name}</h3>
                  <p className="location">{item.location}</p>
                </div>
              </div>
              
              <div className="stock-status">
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: stockAlert?.color,
                    color: 'white'
                  }}
                >
                  {stockAlert?.icon} {stockAlert?.label}
                </span>
              </div>
            </div>

            {/* Stock Progress */}
            <div className="stock-progress">
              <div className="progress-header">
                <span className="stock-text">
                  {formatNumber(item.currentStock)} / {formatNumber(item.maxCapacity)} {item.unit}
                </span>
                <span className="percentage">
                  {item.stockPercentage}%
                </span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${item.stockPercentage}%`,
                    backgroundColor: stockAlert?.color
                  }}
                />
              </div>
              
              {item.needsRestock && (
                <div className="restock-warning">
                  ⚠️ Bajo nivel mínimo ({formatNumber(item.minThreshold)} {item.unit})
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="card-metrics">
              <div className="metric">
                <span className="metric-label">Precio por {item.unit}:</span>
                <span className="metric-value">
                  {formatCurrency(item.pricePerUnit)}
                </span>
              </div>
              
              <div className="metric">
                <span className="metric-label">Valor total:</span>
                <span className="metric-value">
                  {formatCurrency(totalValue)}
                </span>
              </div>
              
              {item.supplier && (
                <div className="metric">
                  <span className="metric-label">Proveedor:</span>
                  <span className="metric-value">{item.supplier}</span>
                </div>
              )}
            </div>

            {/* Status and Last Update */}
            <div className="card-footer">
              <div className="status-info">
                <span className={`status-dot ${item.status}`}></span>
                <span className="status-text">
                  {item.status === 'active' ? 'Activo' : 
                   item.status === 'inactive' ? 'Inactivo' : 
                   item.status === 'maintenance' ? 'Mantenimiento' : item.status}
                </span>
              </div>
              
              <div className="last-update">
                Actualizado {getTimeAgo(item.lastUpdated)}
              </div>
            </div>

            {/* Actions */}
            {canManage && (
              <div className="card-actions">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(item)}
                  title="Editar combustible"
                >
                  ✏️ Editar
                </button>
                
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(item)}
                  title="Eliminar combustible"
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}

            {/* Description */}
            {item.description && item.description !== fuelInfo?.description && (
              <div className="card-description">
                <p>{item.description}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InventoryCards;
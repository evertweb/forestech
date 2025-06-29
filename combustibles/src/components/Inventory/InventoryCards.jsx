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
    if (!date) return 'sin fecha';
    
    try {
      const now = new Date();
      let targetDate;
      
      // Manejar diferentes formatos de fecha
      if (date.seconds) {
        // Timestamp de Firestore
        targetDate = new Date(date.seconds * 1000);
      } else if (date.toDate && typeof date.toDate === 'function') {
        // Timestamp de Firestore con método toDate()
        targetDate = date.toDate();
      } else {
        // Fecha normal
        targetDate = new Date(date);
      }
      
      const diff = now - targetDate;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
      if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
      return 'hace unos minutos';
    } catch (error) {
      console.warn('Error al calcular tiempo transcurrido:', error);
      return 'fecha inválida';
    }
  };

  return (
    <div className="inventory-cards-grid">
      {items.map((item) => {
        const fuelInfo = FUEL_INFO[item.fuelType];
        const stockAlert = STOCK_ALERTS[item.stockLevel];
        
        // Validar valores numéricos para evitar NaN
        const currentStock = parseFloat(item.currentStock) || 0;
        const pricePerUnit = parseFloat(item.pricePerUnit) || parseFloat(item.unitPrice) || 0;
        const maxCapacity = parseFloat(item.maxCapacity) || parseFloat(item.capacity) || 0;
        const stockPercentage = parseFloat(item.stockPercentage) || 0;
        
        const totalValue = currentStock * pricePerUnit;

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
                  {formatNumber(currentStock)} / {formatNumber(maxCapacity)} {item.unit || 'gal'}
                </span>
                <span className="percentage">
                  {stockPercentage}%
                </span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${stockPercentage}%`,
                    backgroundColor: stockAlert?.color
                  }}
                />
              </div>
              
              {item.needsRestock && (
                <div className="restock-warning">
                  ⚠️ Bajo nivel mínimo ({formatNumber(item.minThreshold || item.minStock || 0)} {item.unit || 'gal'})
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="card-metrics">
              <div className="metric">
                <span className="metric-label">Precio por {item.unit || 'gal'}:</span>
                <span className="metric-value">
                  {formatCurrency(pricePerUnit)}
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
                Actualizado {getTimeAgo(item.updatedAt || item.lastUpdated)}
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
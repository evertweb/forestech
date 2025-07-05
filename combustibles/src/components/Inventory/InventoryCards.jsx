// combustibles/src/components/Inventory/InventoryCards.jsx
// Vista de cards para el inventario
import React from 'react';
import { FUEL_INFO, STOCK_ALERTS } from '../../constants/combustibleTypes';

const InventoryCards = ({ items, onEdit, onDelete, canManage }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(num);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeAgo = (date) => {
    if (!date) return 'sin fecha';
    try {
      const now = new Date();
      const targetDate = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
      const diff = now - targetDate;
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(hours / 24);
      if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`;
      if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
      return 'hace unos minutos';
    } catch (error) {
      return 'fecha inválida';
    }
  };

  return (
    <div className="inventory-cards-grid">
      {items.map((item) => {
        const fuelInfo = FUEL_INFO[item.fuelType] || {};
        const stockPercentage = parseFloat(item.stockPercentage) || 0;
        
        let stockAlertKey = 'default';
        if (stockPercentage === 0) stockAlertKey = 'empty';
        else if (stockPercentage <= 15) stockAlertKey = 'critical';
        else if (stockPercentage <= 30) stockAlertKey = 'low';
        else if (stockPercentage >= 95) stockAlertKey = 'full';
        else stockAlertKey = 'normal';
        
        const stockAlert = STOCK_ALERTS[stockAlertKey];

        const currentStock = parseFloat(item.currentStock) || 0;
        const maxCapacity = parseFloat(item.maxCapacity) || parseFloat(item.capacity) || 1; // Evitar división por cero
        const pricePerUnit = parseFloat(item.pricePerUnit) || parseFloat(item.unitPrice) || 0;
        const totalValue = currentStock * pricePerUnit;

        return (
          <div key={item.id} className="inventory-card">
            <div className="card-header">
              <div className="fuel-info">
                <span className="fuel-icon" style={{ color: fuelInfo.color }}>
                  {fuelInfo.icon}
                </span>
                <div className="fuel-details">
                  <h3>{fuelInfo.name || item.name}</h3>
                  <p className="location">{item.location}</p>
                </div>
              </div>
              <div className="stock-status">
                <span className="status-badge" style={{ backgroundColor: stockAlert.color, color: 'white' }}>
                  {stockAlert.icon} {stockAlert.label}
                </span>
              </div>
            </div>

            <div className="stock-progress">
              <div className="progress-header">
                <span className="stock-text">
                  <span className="value">{formatNumber(currentStock)}</span> / {formatNumber(maxCapacity)} gal
                </span>
                <span className="percentage" style={{ color: stockAlert.color }}>
                  {stockPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${stockPercentage}%`,
                    backgroundColor: stockAlert.color,
                  }}
                />
              </div>
              {item.needsRestock && (
                <div className="restock-warning">
                  ⚠️ Nivel bajo
                </div>
              )}
            </div>

            <div className="card-metrics">
              <div className="metric">
                <span className="metric-label">Precio/gal:</span>
                <span className="metric-value">{formatCurrency(pricePerUnit)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Valor Total:</span>
                <span className="metric-value">{formatCurrency(totalValue)}</span>
              </div>
            </div>

            <div className="card-footer">
              <div className="last-update">
                Actualizado {getTimeAgo(item.updatedAt || item.lastUpdated)}
              </div>
              {canManage && (
                <div className="card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(item)}>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryCards;

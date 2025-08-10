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
    } catch {
      return 'fecha inválida';
    }
  };

  return (
    <div className="inventory-cards-grid sap-theme">
      {items.map((item) => {
        const fuelInfo = FUEL_INFO[item.fuelType];
        const stockAlert = STOCK_ALERTS[item.stockLevel];

        const currentStock = parseFloat(item.currentStock) || 0;
        const pricePerUnit = parseFloat(item.pricePerUnit) || 0;
        const maxCapacity = parseFloat(item.maxCapacity) || 0;
        const stockPercentage = parseFloat(item.stockPercentage) || 0;
        const totalValue = currentStock * pricePerUnit;

        return (
          <div key={item.id} className="inventory-card sap-theme">
            <div className="card-header sap-theme">
              <div className="fuel-info sap-theme">
                <span className="fuel-icon sap-theme" style={{ color: fuelInfo.color }}>
                  {fuelInfo.icon}
                </span>
                <div className="fuel-details sap-theme">
                  <h4>{fuelInfo.name}</h4>
                  <p className="location sap-theme">{item.location}</p>
                </div>
              </div>
              <div className="stock-status sap-theme">
                <span
                  className="status-badge sap-theme"
                  style={{ backgroundColor: stockAlert.color, color: 'white' }}
                >
                  {stockAlert.label}
                </span>
              </div>
            </div>

            <div className="stock-progress sap-theme">
              <div className="progress-header sap-theme">
                <span className="stock-text sap-theme">
                  <span className="value sap-theme">{formatNumber(currentStock)}</span> /{' '}
                  {formatNumber(maxCapacity)} gal
                </span>
                <span className="percentage sap-theme" style={{ color: stockAlert.color }}>
                  {stockPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar sap-theme">
                <div
                  className="progress-fill sap-theme"
                  style={{
                    width: `${stockPercentage}%`,
                    backgroundColor: stockAlert.color,
                  }}
                />
              </div>
              {item.needsRestock && <div className="restock-warning sap-theme">⚠️ Nivel bajo</div>}
            </div>

            <div className="card-metrics sap-theme">
              <div className="metric sap-theme">
                <span className="metric-label sap-theme">Precio/gal:</span>
                <span className="metric-value sap-theme">{formatCurrency(pricePerUnit)}</span>
              </div>
              <div className="metric sap-theme">
                <span className="metric-label sap-theme">Valor Total:</span>
                <span className="metric-value sap-theme">{formatCurrency(totalValue)}</span>
              </div>
            </div>

            <div className="card-footer sap-theme">
              <div className="last-update sap-theme">
                Actualizado {getTimeAgo(item.updatedAt || item.lastUpdated)}
              </div>
              {canManage && (
                <div className="card-actions sap-theme">
                  <button
                    className="btn btn-secondary btn-sm sap-theme"
                    onClick={() => onEdit(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm sap-theme"
                    onClick={() => onDelete(item)}
                  >
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

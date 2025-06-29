// combustibles/src/components/Dashboard/DashboardMain.jsx
import React, { useMemo } from 'react';
import './Dashboard.css';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { calculateInventoryStats, formatNumber, formatCurrency } from '../../utils/calculations';

const DashboardMain = () => {
  const { inventory, movements, vehicles, loading, error } = useCombustibles();

  // Helper para manejar fechas de manera segura
  const safeDateHelper = (date) => {
    if (!date) return new Date();
    if (date.toDate && typeof date.toDate === 'function') return date.toDate();
    if (date.seconds) return new Date(date.seconds * 1000);
    if (date instanceof Date) return date;
    return new Date(date);
  };

  const stats = useMemo(() => {
    // Normalizar datos de inventario para cálculos correctos
    const normalizedInventory = inventory.map(item => ({
      ...item,
      quantity: item.currentStock || 0, // Mapear currentStock a quantity para calculations.js
      pricePerUnit: item.unitPrice || 0, // Mapear unitPrice a pricePerUnit
      status: item.isActive ? 'active' : 'inactive' // Normalizar status
    }));
    
    const correctStats = calculateInventoryStats(normalizedInventory);
    
    const activeVehicles = vehicles.filter(v => v.status === 'activo').length;
    const pendingMovements = movements.filter(m => m.status === 'pendiente').length;

    return {
      totalFuel: correctStats.totalItems > 0 
        ? normalizedInventory.filter(item => item.status === 'active')
            .reduce((sum, item) => sum + (item.quantity || 0), 0)
        : 0,
      totalValue: correctStats.totalValue,
      lowStockAlerts: correctStats.lowStockItems,
      activeInventoryItems: correctStats.activeItems,
      activeVehicles,
      pendingMovements,
      totalMaintenance: 0, // Placeholder para futuro módulo
      overdueMaintenance: 0, // Placeholder para futuro módulo
      averageStockLevel: correctStats.averageStockLevel,
      stockByType: correctStats.stockByType
    };
  }, [inventory, vehicles, movements]);

  const recentMovements = useMemo(() => {
    return movements
      .sort((a, b) => safeDateHelper(b.createdAt).getTime() - safeDateHelper(a.createdAt).getTime())
      .slice(0, 5);
  }, [movements]);

  const getMovementDescription = (mov) => {
    const quantity = mov.quantity || 0;
    const fuelType = mov.fuelType || 'N/A';
    switch(mov.type) {
      case 'entrada':
        return `Entrada de ${quantity} gal de ${fuelType}.`;
      case 'salida':
        return `Salida de ${quantity} gal para vehículo ${mov.vehicleId || 'N/A'}.`;
      case 'transferencia':
        return `Transferencia de ${quantity} gal.`;
      case 'ajuste':
        return `Ajuste de inventario: ${quantity} gal de ${fuelType}.`;
      default:
        return 'Movimiento registrado.';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-main">
        <h1 className="dashboard-title">Dashboard Operativo</h1>
        <p className="dashboard-subtitle">Cargando datos en tiempo real...</p>
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-main">
        <h1 className="dashboard-title">Dashboard Operativo</h1>
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-main">
      <h1 className="dashboard-title">Dashboard Operativo</h1>
      <p className="dashboard-subtitle">Resumen general del estado de combustibles y maquinaria.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon fuel-icon">🛢️</div>
          <div className="stat-info">
            <p>Combustible Total</p>
            <h2>{formatNumber(stats.totalFuel)} gal</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon value-icon">💰</div>
          <div className="stat-info">
            <p>Valor Inventario</p>
            <h2>{formatCurrency(stats.totalValue)}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon vehicle-icon">🚜</div>
          <div className="stat-info">
            <p>Vehículos Activos</p>
            <h2>{formatNumber(stats.activeVehicles)}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon movement-icon">🔄</div>
          <div className="stat-info">
            <p>Movimientos Pendientes</p>
            <h2>{formatNumber(stats.pendingMovements)}</h2>
          </div>
        </div>
        <div className={`stat-card ${stats.lowStockAlerts > 0 ? 'alert' : ''}`}>
          <div className="stat-icon alert-icon">⚠️</div>
          <div className="stat-info">
            <p>Alertas de Stock</p>
            <h2>{formatNumber(stats.lowStockAlerts)}</h2>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon maintenance-icon">🔧</div>
          <div className="stat-info">
            <p>Mantenimientos</p>
            <h2>{formatNumber(stats.totalMaintenance)}</h2>
          </div>
        </div>
        <div className={`stat-card ${stats.overdueMaintenance > 0 ? 'alert' : ''}`}>
          <div className="stat-icon maintenance-alert-icon">⏰</div>
          <div className="stat-info">
            <p>Mantenimientos Vencidos</p>
            <h2>{formatNumber(stats.overdueMaintenance)}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-widget">
          <h3>Actividad Reciente</h3>
          {recentMovements.length > 0 ? (
            <ul>
              {recentMovements.map(mov => (
                <li key={mov.id}>
                  <span className={`movement-type-badge ${mov.type}`}>{mov.type}</span>
                  {getMovementDescription(mov)}
                  <span className="movement-date">{safeDateHelper(mov.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay movimientos recientes.</p>
          )}
        </div>
        
        <div className="dashboard-widget">
          <h3>📦 Stock por Producto</h3>
          {inventory.length > 0 ? (
            <div className="products-summary">
              {inventory.map(item => (
                <div key={item.id} className="product-summary-item">
                  <div className="product-icon">⛽</div>
                  <div className="product-info">
                    <span className="product-name">{item.fuelType}</span>
                    <div className="product-stats">
                      <span className="stock-value">
                        {formatNumber(item.currentStock || 0)} gal
                      </span>
                      <span className={`stock-status ${
                        (item.currentStock || 0) <= (item.minStock || 20) ? 'low' : 'normal'
                      }`}>
                        {(item.currentStock || 0) <= (item.minStock || 20) ? '🟡 Stock bajo' : '🟢 Normal'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No hay inventario registrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;

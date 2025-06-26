// combustibles/src/components/Dashboard/DashboardMain.jsx
// Componente principal del dashboard con métricas y cards de resumen
import React from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { FUEL_INFO, getStockLevel, STOCK_ALERTS } from '../../constants/combustibleTypes';
import { VEHICLE_INFO } from '../../constants/vehicleTypes';

const DashboardMain = () => {
  const { userProfile } = useCombustibles();

  // Datos mock para demostración
  const mockInventoryData = [
    {
      fuelType: 'diesel',
      currentStock: 1250,
      maxCapacity: 2000,
      location: 'Tanque Principal',
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000) // hace 2 horas
    },
    {
      fuelType: 'gasoline',
      currentStock: 180,
      maxCapacity: 500,
      location: 'Tanque Auxiliar',
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000) // hace 4 horas
    },
    {
      fuelType: 'acpm',
      currentStock: 95,
      maxCapacity: 1200,
      location: 'Depósito Central',
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000) // hace 1 hora
    },
    {
      fuelType: 'lubricants',
      currentStock: 85,
      maxCapacity: 200,
      location: 'Bodega',
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000) // hace 6 horas
    }
  ];

  const mockMovementsData = [
    { type: 'entry', quantity: 500, fuelType: 'diesel', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { type: 'exit', quantity: 120, fuelType: 'gasoline', date: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { type: 'exit', quantity: 250, fuelType: 'diesel', date: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { type: 'entry', quantity: 200, fuelType: 'acpm', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
  ];

  const mockVehicleData = [
    { vehicleType: 'harvester', name: 'Cosechadora 001', status: 'active', fuelType: 'diesel', lastUsed: new Date() },
    { vehicleType: 'chainsaw', name: 'Motosierra 015', status: 'active', fuelType: 'two_stroke', lastUsed: new Date() },
    { vehicleType: 'log_truck', name: 'Camión MD-789', status: 'maintenance', fuelType: 'acpm', lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { vehicleType: 'pickup_truck', name: 'Toyota Hilux', status: 'active', fuelType: 'gasoline', lastUsed: new Date() }
  ];

  // Calcular métricas principales
  const totalInventoryValue = mockInventoryData.reduce((total, item) => {
    const fuelInfo = FUEL_INFO[item.fuelType];
    return total + (item.currentStock * (fuelInfo ? 12000 : 0)); // Precio mock: $12,000 por galón
  }, 0);

  const totalMovementsToday = mockMovementsData.filter(
    movement => movement.date.toDateString() === new Date().toDateString()
  ).length;

  const activeVehicles = mockVehicleData.filter(vehicle => vehicle.status === 'active').length;

  const criticalStockItems = mockInventoryData.filter(item => {
    const stockLevel = getStockLevel(item.currentStock, item.maxCapacity);
    return stockLevel === 'critical' || stockLevel === 'low';
  });

  // Formatear números
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-CO').format(num);
  };

  return (
    <div className="dashboard-main-content">
      {/* Saludo personalizado */}
      <div className="dashboard-welcome">
        <h2>Bienvenido, {userProfile?.displayName || 'Usuario'}</h2>
        <p>Dashboard de Gestión de Combustibles - {new Date().toLocaleDateString('es-CO', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      {/* Cards de métricas principales */}
      <div className="dashboard-cards">
        {/* Total Inventario */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">💰</span>
              Valor Total Inventario
            </div>
          </div>
          <div className="card-value">{formatCurrency(totalInventoryValue)}</div>
          <div className="card-description">
            {mockInventoryData.length} tipos de combustible en stock
          </div>
          <div className="card-trend trend-positive">
            ↗ +5.2% vs mes anterior
          </div>
        </div>

        {/* Movimientos del día */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">📈</span>
              Movimientos Hoy
            </div>
          </div>
          <div className="card-value">{totalMovementsToday}</div>
          <div className="card-description">
            Entradas y salidas registradas
          </div>
          <div className="card-trend trend-positive">
            ↗ Actividad normal
          </div>
        </div>

        {/* Vehículos activos */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">🚜</span>
              Vehículos Activos
            </div>
          </div>
          <div className="card-value">{activeVehicles}</div>
          <div className="card-description">
            de {mockVehicleData.length} vehículos totales
          </div>
          <div className="card-trend trend-positive">
            ↗ {Math.round((activeVehicles / mockVehicleData.length) * 100)}% operatividad
          </div>
        </div>

        {/* Alertas de stock */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <span className="card-icon">⚠️</span>
              Alertas de Stock
            </div>
          </div>
          <div className="card-value" style={{ color: criticalStockItems.length > 0 ? '#dc2626' : '#16a34a' }}>
            {criticalStockItems.length}
          </div>
          <div className="card-description">
            {criticalStockItems.length > 0 ? 'Requieren atención' : 'Niveles normales'}
          </div>
          {criticalStockItems.length > 0 && (
            <div className="card-trend trend-negative">
              ⚠ Revisar stock crítico
            </div>
          )}
        </div>
      </div>

      {/* Resumen de inventario */}
      <div className="dashboard-section">
        <h3>🛢️ Resumen de Inventario</h3>
        <div className="inventory-grid">
          {mockInventoryData.map((item, index) => {
            const fuelInfo = FUEL_INFO[item.fuelType];
            const stockLevel = getStockLevel(item.currentStock, item.maxCapacity);
            const stockAlert = STOCK_ALERTS[stockLevel];
            const percentage = Math.round((item.currentStock / item.maxCapacity) * 100);

            return (
              <div key={index} className="inventory-card">
                <div className="inventory-header">
                  <span className="fuel-icon" style={{ color: fuelInfo?.color }}>
                    {fuelInfo?.icon}
                  </span>
                  <div>
                    <h4>{fuelInfo?.name}</h4>
                    <p>{item.location}</p>
                  </div>
                  <span className="stock-badge" style={{ background: stockAlert?.color, color: 'white' }}>
                    {stockAlert?.icon}
                  </span>
                </div>
                
                <div className="inventory-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        background: stockAlert?.color 
                      }}
                    />
                  </div>
                  <div className="progress-text">
                    {formatNumber(item.currentStock)} / {formatNumber(item.maxCapacity)} {fuelInfo?.unit}
                  </div>
                </div>
                
                <div className="inventory-meta">
                  <span>{percentage}% capacidad</span>
                  <span>Actualizado: {item.lastUpdated.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="dashboard-section">
        <h3>📊 Actividad Reciente</h3>
        <div className="activity-list">
          {mockMovementsData.slice(0, 5).map((movement, index) => {
            const fuelInfo = FUEL_INFO[movement.fuelType];
            const isEntry = movement.type === 'entry';
            
            return (
              <div key={index} className="activity-item">
                <div className="activity-icon" style={{ background: isEntry ? '#dcfce7' : '#fef2f2' }}>
                  {isEntry ? '📥' : '📤'}
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    {isEntry ? 'Entrada' : 'Salida'} de {fuelInfo?.name}
                  </div>
                  <div className="activity-description">
                    {formatNumber(movement.quantity)} {fuelInfo?.unit} - {movement.date.toLocaleString('es-CO')}
                  </div>
                </div>
                <div className="activity-amount" style={{ color: isEntry ? '#16a34a' : '#dc2626' }}>
                  {isEntry ? '+' : '-'}{formatNumber(movement.quantity)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
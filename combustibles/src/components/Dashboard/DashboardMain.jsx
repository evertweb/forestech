// combustibles/src/components/Dashboard/DashboardMain.jsx

import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { subscribeToInventory } from '../../services/inventoryService';
import { subscribeToMovements } from '../../services/movementsService';
import { subscribeToVehicles } from '../../services/vehiclesService';

const DashboardMain = () => {
  const [stats, setStats] = useState({
    totalFuel: 0,
    activeVehicles: 0,
    pendingMovements: 0,
    lowStockAlerts: 0,
  });
  const [recentMovements, setRecentMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubInventory = subscribeToInventory((inventory) => {
      const totalFuel = inventory.reduce((sum, item) => sum + (item.currentStock || 0), 0);
      const lowStockAlerts = inventory.filter(item => (item.currentStock || 0) < (item.minThreshold || 0)).length;
      setStats(prevStats => ({ ...prevStats, totalFuel, lowStockAlerts }));
    });

    const unsubMovements = subscribeToMovements((movements) => {
      const pendingMovements = movements.filter(m => m.status === 'pending').length;
      const recent = movements.sort((a, b) => b.date.toMillis() - a.date.toMillis()).slice(0, 5);
      setStats(prevStats => ({ ...prevStats, pendingMovements }));
      setRecentMovements(recent);
    });

    const unsubVehicles = subscribeToVehicles((vehicles) => {
      const activeVehicles = vehicles.filter(v => v.status === 'active').length;
      setStats(prevStats => ({ ...prevStats, activeVehicles }));
    });
    
    // Simulamos un tiempo de carga para que los datos se asienten
    const timer = setTimeout(() => setLoading(false), 1500);

    // Función de limpieza para desuscribirse cuando el componente se desmonte
    return () => {
      unsubInventory();
      unsubMovements();
      unsubVehicles();
      clearTimeout(timer);
    };
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('es-CO').format(num);
  };
  
  const getMovementDescription = (mov) => {
    switch(mov.type) {
      case 'entry':
        return `Entrada de ${mov.quantity} ${mov.unit} de ${mov.fuelType}.`;
      case 'exit':
        return `Salida de ${mov.quantity} ${mov.unit} para vehículo ${mov.vehicleId || 'N/A'}.`;
      case 'transfer':
        return `Transferencia de ${mov.quantity} ${mov.unit} de ${mov.fromLocation} a ${mov.toLocation}.`;
      case 'adjustment':
        return `Ajuste de inventario: ${mov.quantity} ${mov.unit} de ${mov.fuelType}.`;
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
                  <span className="movement-date">{mov.date.toDate().toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay movimientos recientes.</p>
          )}
        </div>
        <div className="dashboard-widget">
          <h3>Consumo por Tipo de Combustible</h3>
          {/* TODO: Implementar gráfico de Chart.js */}
          <div className="chart-placeholder">
            <p>Gráfico de consumo próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;

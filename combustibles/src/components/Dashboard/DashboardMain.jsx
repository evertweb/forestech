// combustibles/src/components/Dashboard/DashboardMain.jsx

import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';
import { subscribeToInventory } from '../../services/inventoryService';
import { subscribeToMovements } from '../../services/movementsService';
import { subscribeToVehicles } from '../../services/vehiclesService';
import { subscribeToProducts } from '../../services/productsService';

const DashboardMain = () => {
  const [stats, setStats] = useState({
    totalFuel: 0,
    activeVehicles: 0,
    pendingMovements: 0,
    lowStockAlerts: 0,
    totalProducts: 0,
  });
  const [recentMovements, setRecentMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState({
    inventory: false,
    movements: false,
    vehicles: false,
    products: false
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubInventory = subscribeToInventory(
      (inventory) => {
        const totalFuel = inventory.reduce((sum, item) => sum + (item.currentStock || 0), 0);
        const lowStockAlerts = inventory.filter(item => (item.currentStock || 0) < (item.minThreshold || 0)).length;
        setStats(prevStats => ({ ...prevStats, totalFuel, lowStockAlerts }));
        setDataLoaded(prev => ({ ...prev, inventory: true }));
      },
      (error) => {
        console.error('Error loading inventory:', error);
        setError('Error cargando inventario');
      }
    );

    const unsubMovements = subscribeToMovements(
      (movements) => {
        const pendingMovements = movements.filter(m => m.status === 'pending').length;
        const recent = movements.sort((a, b) => b.date.toMillis() - a.date.toMillis()).slice(0, 5);
        setStats(prevStats => ({ ...prevStats, pendingMovements }));
        setRecentMovements(recent);
        setDataLoaded(prev => ({ ...prev, movements: true }));
      },
      (error) => {
        console.error('Error loading movements:', error);
        setError('Error cargando movimientos');
      }
    );

    const unsubVehicles = subscribeToVehicles(
      (vehicles) => {
        const activeVehicles = vehicles.filter(v => v.status === 'active').length;
        setStats(prevStats => ({ ...prevStats, activeVehicles }));
        setDataLoaded(prev => ({ ...prev, vehicles: true }));
      },
      (error) => {
        console.error('Error loading vehicles:', error);
        setError('Error cargando vehículos');
      }
    );

    const unsubProducts = subscribeToProducts(
      (productsData) => {
        const totalProducts = productsData.length;
        setProducts(productsData);
        setStats(prevStats => ({ ...prevStats, totalProducts }));
        setDataLoaded(prev => ({ ...prev, products: true }));
      },
      (error) => {
        console.error('Error loading products:', error);
        // No mostramos error crítico por productos, es opcional
        setDataLoaded(prev => ({ ...prev, products: true }));
      }
    );

    return () => {
      unsubInventory();
      unsubMovements();
      unsubVehicles();
      unsubProducts();
    };
  }, []);

  // Determinar cuando todos los datos están cargados
  useEffect(() => {
    const allDataLoaded = Object.values(dataLoaded).every(loaded => loaded);
    if (allDataLoaded) {
      setLoading(false);
    }
  }, [dataLoaded]);

  const formatNumber = useMemo(() => {
    return (num) => new Intl.NumberFormat('es-CO').format(num);
  }, []);
  
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
          <h3>📦 Stock por Tipo de Producto</h3>
          {products.length > 0 ? (
            <div className="products-summary">
              {products.slice(0, 6).map(product => (
                <div key={product.id} className="product-summary-item">
                  <div className="product-icon" style={{ color: product.color }}>
                    {product.icon}
                  </div>
                  <div className="product-info">
                    <span className="product-name">{product.displayName}</span>
                    <div className="product-stats">
                      <span className="stock-value">
                        {formatNumber(product.currentStock || 0)} {product.unit}
                      </span>
                      <span className={`stock-status ${
                        (product.currentStock || 0) === 0 ? 'empty' :
                        (product.currentStock || 0) <= (product.minThreshold || 0) ? 'low' : 'normal'
                      }`}>
                        {(product.currentStock || 0) === 0 ? '🔴 Sin stock' :
                         (product.currentStock || 0) <= (product.minThreshold || 0) ? '🟡 Stock bajo' : '🟢 Normal'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {products.length > 6 && (
                <div className="view-all-products">
                  <span>+{products.length - 6} productos más</span>
                </div>
              )}
            </div>
          ) : (
            <div className="no-products">
              <p>No hay productos registrados.</p>
              <small>Ve a la sección Productos para crear los primeros tipos de combustible.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;

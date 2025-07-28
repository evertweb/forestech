// combustibles/src/components/Dashboard/DashboardMain.jsx
import React, { useMemo, useEffect, useState } from 'react';
import './Dashboard.css';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { formatNumber, formatCurrency } from '../../utils/calculations';
import { logInventoryState, findDuplicateItems } from '../../utils/debugUtils';

const DashboardMain = () => {
  // Estado local para los datos del dashboard
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const { 
    subscribeToInventory,
    subscribeToMovements,
    subscribeToVehicles
  } = useCombustibles();


  // ✅ Suscribirse a los datos esenciales cuando se monta el componente
  useEffect(() => {
    console.log('🚀 Dashboard iniciando suscripciones a datos...');
    let loadingCount = 3; // Contador para saber cuándo terminar loading
    
    const updateLoading = () => {
      loadingCount--;
      if (loadingCount === 0) {
        setDataLoading(false);
      }
    };

    // Callback para inventario
    const unsubInventory = subscribeToInventory((data, error) => {
      if (error) {
        console.error('Error inventory:', error);
        setDataError(error);
      } else {
        setInventory(data || []);
      }
      updateLoading();
    });

    // Callback para movimientos  
    const unsubMovements = subscribeToMovements((data, error) => {
      if (error) {
        console.error('Error movements:', error);
        setDataError(error);
      } else {
        setMovements(data || []);
      }
      updateLoading();
    });

    // Callback para vehículos
    const unsubVehicles = subscribeToVehicles((data, error) => {
      if (error) {
        console.error('Error vehicles:', error);
        setDataError(error);
      } else {
        setVehicles(data || []);
      }
      updateLoading();
    });

    // Cleanup function para evitar memory leaks
    return () => {
      if (typeof unsubInventory === 'function') unsubInventory();
      if (typeof unsubMovements === 'function') unsubMovements();
      if (typeof unsubVehicles === 'function') unsubVehicles();
    };
  }, [subscribeToInventory, subscribeToMovements, subscribeToVehicles]);

  // Ejecutar diagnóstico del inventario al cargar
  useEffect(() => {
    if (!dataLoading && inventory.length > 0) {
      console.log('🔍 Ejecutando diagnóstico del inventario...');
      logInventoryState(inventory);

      // Detectar posibles duplicaciones
      const duplicados = findDuplicateItems(inventory);
      if (duplicados.length > 0) {
        console.warn(`⚠️ Se detectaron ${duplicados.length} posibles items duplicados:`);
        console.table(duplicados.map(item => ({
          id: item.id,
          tipo: item.fuelType,
          ubicacion: item.location,
          stock: item.currentStock
        })));
      }
    }
  }, [dataLoading, inventory]);

  // Helper para manejar fechas de manera segura
  const safeDateHelper = (date) => {
    if (!date) return new Date();
    if (date.toDate && typeof date.toDate === 'function') return date.toDate();
    if (date.seconds) return new Date(date.seconds * 1000);
    if (date instanceof Date) return date;
    return new Date(date);
  };

  const stats = useMemo(() => {
    // Calcular totales directamente desde inventory sin normalización duplicada
    const activeVehicles = vehicles.filter(v => v.status === 'activo').length;
    const pendingMovements = movements.filter(m => m.status === 'pendiente').length;
    
    // Calcular total de combustible sumando currentStock directamente - evitar duplicación
    // Aplica console.log para depuración
    console.log('Inventario en DashboardMain:', inventory.map(item => ({
      id: item.id,
      fuelType: item.fuelType,
      currentStock: item.currentStock,
      pricePerUnit: item.pricePerUnit || item.unitPrice
    })));

    const totalFuel = inventory
      .filter(item => item.status === 'active') // ✅ Solo items activos
      .reduce((sum, item) => {
        const stock = parseFloat(item.currentStock) || 0;
        console.log(`Sumando stock de ${item.fuelType}: ${stock} gal`);
        return sum + stock;
      }, 0);

    // Calcular valor total multiplicando stock por precio
    const totalValue = inventory
      .filter(item => item.isActive !== false)
      .reduce((sum, item) => {
        const stock = parseFloat(item.currentStock) || 0;
        const price = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
        return sum + (stock * price);
      }, 0);
    
    // Calcular alertas de stock bajo
    const lowStockAlerts = inventory
      .filter(item => {
        const stock = parseFloat(item.currentStock) || 0;
        const minStock = parseFloat(item.minStock) || parseFloat(item.minThreshold) || 20;
        return item.isActive !== false && stock <= minStock;
      }).length;

    return {
      totalFuel,
      totalValue,
      lowStockAlerts,
      activeInventoryItems: inventory.filter(item => item.isActive !== false).length,
      activeVehicles,
      pendingMovements,
      totalMaintenance: 0, // Placeholder para futuro módulo
      overdueMaintenance: 0, // Placeholder para futuro módulo
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

  if (dataLoading) {
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

  if (dataError) {
    return (
      <div className="dashboard-main">
        <h1 className="dashboard-title">Dashboard Operativo</h1>
        <div className="error-message">
          <p>⚠️ {dataError}</p>
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
              {inventory.map(item => {
                const currentStock = parseFloat(item.currentStock) || 0;
                const minThreshold = parseFloat(item.minStock || item.minThreshold) || 20;
                return (
                  <div key={item.id} className="product-summary-item">
                    <div className="product-icon">⛽</div>
                    <div className="product-info">
                      <span className="product-name">{item.fuelType || item.name}</span>
                      <div className="product-stats">
                        <span className="stock-value">
                          {formatNumber(currentStock)} gal
                        </span>
                        <span className={`stock-status ${currentStock <= minThreshold ? 'low' : 'normal'}`}>
                          {currentStock <= minThreshold ? '🟡 Stock bajo' : '🟢 Normal'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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

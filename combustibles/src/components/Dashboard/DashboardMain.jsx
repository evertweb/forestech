/**
 * ================================================================================================================================
 * ARCHIVO: DashboardMain.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Componente principal que renderiza el contenido del dashboard operativo.
 *
 * FUNCIONALIDAD:
 * - Se suscribe en tiempo real a las colecciones de Firebase (inventario, movimientos, vehículos) para obtener datos actualizados.
 * - Gestiona los estados de carga y error durante la obtención de datos.
 * - Calcula estadísticas clave (total de combustible, valor del inventario, alertas, etc.) utilizando `useMemo` para optimizar el rendimiento.
 * - Muestra las estadísticas en tarjetas interactivas (Stat Cards).
 * - Presenta widgets con información detallada, como la actividad reciente y un resumen del stock por producto.
 * - Ejecuta diagnósticos sobre los datos de inventario al cargar para detectar posibles inconsistencias.
 * ================================================================================================================================
 */

import React, { useMemo, useEffect, useState } from 'react';
import './Dashboard.css';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { formatNumber, formatCurrency } from '../../utils/calculations';
import { logInventoryState, findDuplicateItems } from '../../utils/debugUtils';

const DashboardMain = () => {
  // ==================================================================================================
  // ESTADO DEL COMPONENTE
  // ==================================================================================================
  const [inventory, setInventory] = useState([]); // Almacena los datos del inventario.
  const [movements, setMovements] = useState([]); // Almacena los movimientos de combustible.
  const [vehicles, setVehicles] = useState([]);     // Almacena la lista de vehículos.
  const [dataLoading, setDataLoading] = useState(true); // Controla la visualización del spinner de carga.
  const [dataError, setDataError] = useState(null);     // Almacena mensajes de error si falla la carga de datos.

  // Extrae las funciones de suscripción del contexto de combustibles.
  const { 
    subscribeToInventory,
    subscribeToMovements,
    subscribeToVehicles
  } = useCombustibles();

  // ==================================================================================================
  // EFECTOS (LÓGICA DE SUSCRIPCIÓN Y DIAGNÓSTICO)
  // ==================================================================================================

  /**
   * useEffect para suscribirse a los datos de Firebase cuando el componente se monta.
   * Utiliza un contador para gestionar el estado de carga de múltiples fuentes de datos asíncronas.
   */
  useEffect(() => {
    console.log('🚀 Dashboard iniciando suscripciones a datos...');
    let loadingCount = 3; // 3 suscripciones: inventory, movements, vehicles.
    
    // Función para decrementar el contador y desactivar el estado de carga cuando todas las suscripciones han respondido.
    const updateLoading = () => {
      loadingCount--;
      if (loadingCount === 0) {
        setDataLoading(false);
      }
    };

    // Suscripción a la colección de inventario.
    const unsubInventory = subscribeToInventory((data, error) => {
      if (error) {
        console.error('Error en suscripción de inventario:', error);
        setDataError('Error al cargar el inventario.');
      } else {
        setInventory(data || []);
      }
      updateLoading();
    });

    // Suscripción a la colección de movimientos.
    const unsubMovements = subscribeToMovements((data, error) => {
      if (error) {
        console.error('Error en suscripción de movimientos:', error);
        setDataError('Error al cargar los movimientos.');
      } else {
        setMovements(data || []);
      }
      updateLoading();
    });

    // Suscripción a la colección de vehículos.
    const unsubVehicles = subscribeToVehicles((data, error) => {
      if (error) {
        console.error('Error en suscripción de vehículos:', error);
        setDataError('Error al cargar los vehículos.');
      } else {
        setVehicles(data || []);
      }
      updateLoading();
    });

    // Función de limpieza: se ejecuta cuando el componente se desmonta para cancelar las suscripciones
    // y evitar fugas de memoria (memory leaks).
    return () => {
      console.log('🔌 Dashboard cancelando suscripciones...');
      if (typeof unsubInventory === 'function') unsubInventory();
      if (typeof unsubMovements === 'function') unsubMovements();
      if (typeof unsubVehicles === 'function') unsubVehicles();
    };
  }, [subscribeToInventory, subscribeToMovements, subscribeToVehicles]);

  /**
   * useEffect para ejecutar diagnósticos en el inventario una vez que los datos se han cargado.
   */
  useEffect(() => {
    if (!dataLoading && inventory.length > 0) {
      console.log('🔍 Ejecutando diagnóstico del inventario...');
      logInventoryState(inventory); // Imprime el estado actual del inventario en la consola.

      // Busca posibles ítems duplicados en el inventario.
      const duplicados = findDuplicateItems(inventory);
      if (duplicados.length > 0) {
        console.warn(`⚠️ Se detectaron ${duplicados.length} posibles items duplicados:`, duplicados);
      }
    }
  }, [dataLoading, inventory]);

  // ==================================================================================================
  // CÁLCULOS MEMOIZADOS (OPTIMIZACIÓN DE RENDIMIENTO)
  // ==================================================================================================

  /**
   * `useMemo` para calcular las estadísticas principales. 
   * Este hook asegura que los cálculos solo se rehagan si `inventory`, `vehicles`, o `movements` cambian,
   * evitando recálculos innecesarios en cada renderizado.
   */
  const stats = useMemo(() => {
    const activeVehicles = vehicles.filter(v => v.status === 'activo').length;
    const pendingMovements = movements.filter(m => m.status === 'pendiente').length;
    
    // Suma el stock de todos los ítems activos en el inventario.
    const totalFuel = inventory
      .filter(item => item.status === 'active')
      .reduce((sum, item) => sum + (parseFloat(item.currentStock) || 0), 0);

    // Calcula el valor monetario total del inventario.
    const totalValue = inventory
      .filter(item => item.isActive !== false)
      .reduce((sum, item) => {
        const stock = parseFloat(item.currentStock) || 0;
        const price = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
        return sum + (stock * price);
      }, 0);
    
    // Cuenta cuántos ítems tienen un stock por debajo del umbral mínimo.
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
      totalMaintenance: 0, // Placeholder para futuro módulo de mantenimiento.
      overdueMaintenance: 0, // Placeholder.
    };
  }, [inventory, vehicles, movements]);

  // ==================================================================================================
  // FUNCIONES AUXILIARES (HELPERS)
  // ==================================================================================================

  // Helper para convertir de forma segura diferentes formatos de fecha a un objeto Date.
  const safeDateHelper = (date) => {
    if (!date) return new Date();
    if (date.toDate && typeof date.toDate === 'function') return date.toDate(); // Formato Timestamp de Firebase.
    if (date.seconds) return new Date(date.seconds * 1000); // Otro formato de Timestamp.
    if (date instanceof Date) return date;
    return new Date(date);
  };

  /**
   * `useMemo` para obtener y ordenar los 5 movimientos más recientes.
   * Se recalcula solo si el array `movements` cambia.
   */
  const recentMovements = useMemo(() => {
    return movements
      .sort((a, b) => safeDateHelper(b.createdAt).getTime() - safeDateHelper(a.createdAt).getTime())
      .slice(0, 5);
  }, [movements]);

  // Genera una descripción legible para cada tipo de movimiento.
  const getMovementDescription = (mov) => {
    const quantity = mov.quantity || 0;
    const fuelType = mov.fuelType || 'N/A';
    switch(mov.type) {
      case 'entrada': return `Entrada de ${quantity} gal de ${fuelType}.`;
      case 'salida': return `Salida de ${quantity} gal para vehículo ${mov.vehicleId || 'N/A'}.`;
      case 'transferencia': return `Transferencia de ${quantity} gal.`;
      case 'ajuste': return `Ajuste de inventario: ${quantity} gal de ${fuelType}.`;
      default: return 'Movimiento registrado.';
    }
  };

  // ==================================================================================================
  // RENDERIZADO CONDICIONAL (CARGA Y ERRORES)
  // ==================================================================================================

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

  // ==================================================================================================
  // RENDERIZADO PRINCIPAL DEL DASHBOARD
  // ==================================================================================================

  return (
    <div className="dashboard-main">
      <h1 className="dashboard-title">Dashboard Operativo</h1>
      <p className="dashboard-subtitle">Resumen general del estado de combustibles y maquinaria.</p>

      {/* Grid de tarjetas con estadísticas principales */}
      <div className="stats-grid">
        {/* Fila 1: Métricas operativas */}
        <div className="stat-card"><div className="stat-icon fuel-icon">🛢️</div><div className="stat-info"><p>Combustible Total</p><h2>{formatNumber(stats.totalFuel)} gal</h2></div></div>
        <div className="stat-card"><div className="stat-icon value-icon">💰</div><div className="stat-info"><p>Valor Inventario</p><h2>{formatCurrency(stats.totalValue)}</h2></div></div>
        <div className="stat-card"><div className="stat-icon vehicle-icon">🚜</div><div className="stat-info"><p>Vehículos Activos</p><h2>{formatNumber(stats.activeVehicles)}</h2></div></div>
        <div className="stat-card"><div className="stat-icon movement-icon">🔄</div><div className="stat-info"><p>Movimientos Pendientes</p><h2>{formatNumber(stats.pendingMovements)}</h2></div></div>
        
        {/* Fila 2: Alertas y mantenimiento */}
        <div className={`stat-card ${stats.lowStockAlerts > 0 ? 'alert' : ''}`}><div className="stat-icon alert-icon">⚠️</div><div className="stat-info"><p>Alertas de Stock</p><h2>{formatNumber(stats.lowStockAlerts)}</h2></div></div>
        <div className="stat-card"><div className="stat-icon maintenance-icon">🔧</div><div className="stat-info"><p>Mantenimientos</p><h2>{formatNumber(stats.totalMaintenance)}</h2></div></div>
        <div className={`stat-card ${stats.overdueMaintenance > 0 ? 'alert' : ''}`}><div className="stat-icon maintenance-alert-icon">⏰</div><div className="stat-info"><p>Mantenimientos Vencidos</p><h2>{formatNumber(stats.overdueMaintenance)}</h2></div></div>
      </div>

      {/* Contenido principal con widgets */}
      <div className="dashboard-content">
        {/* Widget de Actividad Reciente */}
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
        
        {/* Widget de Resumen de Stock por Producto */}
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
                        <span className="stock-value">{formatNumber(currentStock)} gal</span>
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
            <div className="no-products"><p>No hay inventario registrado.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
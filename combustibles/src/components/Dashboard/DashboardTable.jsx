/**
 * ================================================================================================================================
 * ARCHIVO: DashboardTable.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Componente de Dashboard rediseñado en formato tabla que mantiene toda la funcionalidad original.
 *
 * FUNCIONALIDAD:
 * - Presenta todas las estadísticas del dashboard en formato de tabla organizada
 * - Mantiene la funcionalidad en tiempo real del dashboard original
 * - Incluye secciones de: Estadísticas Generales, Inventario, Movimientos, Vehículos y Alertas
 * - Diseño responsive con scroll horizontal en móviles
 * - Colores y estilos consistentes con el sistema de diseño existente
 * ================================================================================================================================
 */

import React, { useMemo, useEffect, useState } from 'react';
import './Dashboard.css';
import './DashboardTable.css';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { formatNumber, formatCurrency } from '../../utils/calculations';
import { logInventoryState, findDuplicateItems } from '../../utils/debugUtils';

const DashboardTable = () => {
  // ==================================================================================================
  // ESTADO DEL COMPONENTE (Mismo del DashboardMain original)
  // ==================================================================================================
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const { subscribeToInventory, subscribeToMovements, subscribeToVehicles } = useCombustibles();

  // ==================================================================================================
  // EFECTOS (Misma lógica del componente original)
  // ==================================================================================================
  useEffect(() => {
    console.log('🚀 Dashboard Table iniciando suscripciones a datos...');
    let loadingCount = 3;

    const updateLoading = () => {
      loadingCount--;
      if (loadingCount === 0) {
        setDataLoading(false);
      }
    };

    const unsubInventory = subscribeToInventory((data, error) => {
      if (error) {
        console.error('Error en suscripción de inventario:', error);
        setDataError('Error al cargar el inventario.');
      } else {
        setInventory(data || []);
      }
      updateLoading();
    });

    const unsubMovements = subscribeToMovements((data, error) => {
      if (error) {
        console.error('Error en suscripción de movimientos:', error);
        setDataError('Error al cargar los movimientos.');
      } else {
        setMovements(data || []);
      }
      updateLoading();
    });

    const unsubVehicles = subscribeToVehicles((data, error) => {
      if (error) {
        console.error('Error en suscripción de vehículos:', error);
        setDataError('Error al cargar los vehículos.');
      } else {
        setVehicles(data || []);
      }
      updateLoading();
    });

    return () => {
      console.log('🔌 Dashboard Table cancelando suscripciones...');
      if (typeof unsubInventory === 'function') unsubInventory();
      if (typeof unsubMovements === 'function') unsubMovements();
      if (typeof unsubVehicles === 'function') unsubVehicles();
    };
  }, [subscribeToInventory, subscribeToMovements, subscribeToVehicles]);

  useEffect(() => {
    if (!dataLoading && inventory.length > 0) {
      console.log('🔍 Ejecutando diagnóstico del inventario...');
      logInventoryState(inventory);

      const duplicados = findDuplicateItems(inventory);
      if (duplicados.length > 0) {
        console.warn(
          `⚠️ Se detectaron ${duplicados.length} posibles items duplicados:`,
          duplicados
        );
      }
    }
  }, [dataLoading, inventory]);

  // ==================================================================================================
  // CÁLCULOS MEMOIZADOS (Misma lógica del componente original)
  // ==================================================================================================
  const stats = useMemo(() => {
    const activeVehicles = vehicles.filter((v) => v.status === 'activo').length;
    const pendingMovements = movements.filter((m) => m.status === 'pendiente').length;

    const totalFuel = inventory
      .filter((item) => item.status === 'active')
      .reduce((sum, item) => sum + (parseFloat(item.currentStock) || 0), 0);

    const totalValue = inventory
      .filter((item) => item.isActive !== false)
      .reduce((sum, item) => {
        const stock = parseFloat(item.currentStock) || 0;
        const price = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
        return sum + stock * price;
      }, 0);

    const lowStockAlerts = inventory.filter((item) => {
      const stock = parseFloat(item.currentStock) || 0;
      const minStock = parseFloat(item.minStock) || parseFloat(item.minThreshold) || 20;
      return item.isActive !== false && stock <= minStock;
    }).length;

    return {
      totalFuel,
      totalValue,
      lowStockAlerts,
      activeInventoryItems: inventory.filter((item) => item.isActive !== false).length,
      activeVehicles,
      pendingMovements,
      totalMaintenance: 0,
      overdueMaintenance: 0,
    };
  }, [inventory, vehicles, movements]);

  // Helper para fechas
  const safeDateHelper = (date) => {
    if (!date) return new Date();
    if (date.toDate && typeof date.toDate === 'function') return date.toDate();
    if (date.seconds) return new Date(date.seconds * 1000);
    if (date instanceof Date) return date;
    return new Date(date);
  };

  const recentMovements = useMemo(() => {
    return movements
      .sort((a, b) => safeDateHelper(b.createdAt).getTime() - safeDateHelper(a.createdAt).getTime())
      .slice(0, 5);
  }, [movements]);

  const getMovementDescription = (mov) => {
    const quantity = mov.quantity || 0;
    const fuelType = mov.fuelType || 'N/A';
    switch (mov.type) {
      case 'entrada':
        return `Entrada de ${quantity} gal de ${fuelType}`;
      case 'salida':
        return `Salida de ${quantity} gal para vehículo ${mov.vehicleId || 'N/A'}`;
      case 'transferencia':
        return `Transferencia de ${quantity} gal`;
      case 'ajuste':
        return `Ajuste de inventario: ${quantity} gal de ${fuelType}`;
      default:
        return 'Movimiento registrado';
    }
  };

  // Datos adicionales para las tablas
  const inventoryTableData = useMemo(() => {
    return inventory
      .filter((item) => item.isActive !== false)
      .slice(0, 10) // Limitamos a 10 items principales
      .map((item) => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const maxCapacity = parseFloat(item.maxCapacity) || 0;
        const pricePerUnit = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
        const percentage = maxCapacity > 0 ? (currentStock / maxCapacity) * 100 : 0;
        const minStock = parseFloat(item.minStock) || parseFloat(item.minThreshold) || 20;

        return {
          id: item.id,
          name: item.fuelType || item.name,
          location: item.location || 'N/A',
          currentStock,
          maxCapacity,
          percentage: Math.round(percentage),
          value: currentStock * pricePerUnit,
          status: currentStock <= minStock ? 'Bajo' : percentage > 80 ? 'Alto' : 'Normal',
          statusClass:
            currentStock <= minStock
              ? 'status-low'
              : percentage > 80
                ? 'status-high'
                : 'status-normal',
        };
      });
  }, [inventory]);

  const vehiclesTableData = useMemo(() => {
    return vehicles
      .filter((v) => v.status === 'activo')
      .slice(0, 8) // Limitamos a 8 vehículos activos
      .map((vehicle) => ({
        id: vehicle.id,
        vehicleId: vehicle.vehicleId || 'N/A',
        name: vehicle.name || 'N/A',
        type: vehicle.type || 'N/A',
        fuelType: vehicle.fuelType || 'N/A',
        consumption: vehicle.totalFuelConsumed || 0,
        hours: vehicle.totalHoursWorked || 0,
        location: vehicle.currentLocation || 'N/A',
        status: vehicle.status || 'N/A',
        statusClass: `status-${vehicle.status}`,
      }));
  }, [vehicles]);

  // ==================================================================================================
  // RENDERIZADO CONDICIONAL (Misma lógica del componente original)
  // ==================================================================================================
  if (dataLoading) {
    return (
      <div className="dashboard-main sap-theme">
        <h1 className="dashboard-title sap-theme">Dashboard Operativo - Vista Tabla</h1>
        <p className="dashboard-subtitle sap-theme">Cargando datos en tiempo real...</p>
        <div className="loading-spinner-container sap-theme">
          <div className="loading-spinner sap-theme"></div>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="dashboard-main sap-theme">
        <h1 className="dashboard-title sap-theme">Dashboard Operativo - Vista Tabla</h1>
        <div className="error-message sap-theme">
          <p>⚠️ {dataError}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  // ==================================================================================================
  // RENDERIZADO PRINCIPAL EN FORMATO TABLA
  // ==================================================================================================
  return (
    <div className="dashboard-main dashboard-table-view sap-theme">
      <div className="dashboard-table-header sap-theme">
        <h1 className="dashboard-title sap-theme">📊 Dashboard Operativo - Vista Tabla</h1>
        <p className="dashboard-subtitle sap-theme">
          Resumen completo del estado de combustibles y maquinaria en formato organizado.
        </p>
      </div>

      {/* Tabla de Estadísticas Generales */}
      <div className="dashboard-table-section sap-theme">
        <h2 className="table-section-title sap-theme">📈 Estadísticas Generales</h2>
        <div className="dashboard-table-container sap-theme">
          <div className="table-wrapper sap-theme">
            <table className="dashboard-table sap-theme">
              <thead>
                <tr>
                  <th>Métrica</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="metric-name sap-theme">
                    <span className="metric-icon sap-theme">🛢️</span>
                    Combustible Total
                  </td>
                  <td className="metric-value sap-theme">{formatNumber(stats.totalFuel)} gal</td>
                  <td>
                    <span
                      className={`status-badge ${stats.totalFuel > 1000 ? 'status-normal' : 'status-low'}`}
                    >
                      {stats.totalFuel > 1000 ? '🟢 Suficiente' : '🟡 Revisar'}
                    </span>
                  </td>
                  <td className="metric-description sap-theme">
                    Total de combustible disponible en inventario
                  </td>
                </tr>
                <tr>
                  <td className="metric-name sap-theme">
                    <span className="metric-icon sap-theme">💰</span>
                    Valor Inventario
                  </td>
                  <td className="metric-value sap-theme">{formatCurrency(stats.totalValue)}</td>
                  <td>
                    <span className="status-badge status-normal sap-theme">🟢 Activo</span>
                  </td>
                  <td className="metric-description sap-theme">
                    Valor monetario total del inventario
                  </td>
                </tr>
                <tr>
                  <td className="metric-name sap-theme">
                    <span className="metric-icon sap-theme">🚜</span>
                    Vehículos Activos
                  </td>
                  <td className="metric-value sap-theme">{formatNumber(stats.activeVehicles)}</td>
                  <td>
                    <span
                      className={`status-badge ${stats.activeVehicles > 0 ? 'status-normal' : 'status-low'}`}
                    >
                      {stats.activeVehicles > 0 ? '🟢 Operativos' : '🔴 Sin actividad'}
                    </span>
                  </td>
                  <td className="metric-description sap-theme">
                    Número de vehículos en estado activo
                  </td>
                </tr>
                <tr>
                  <td className="metric-name sap-theme">
                    <span className="metric-icon sap-theme">🔄</span>
                    Movimientos Pendientes
                  </td>
                  <td className="metric-value sap-theme">{formatNumber(stats.pendingMovements)}</td>
                  <td>
                    <span
                      className={`status-badge ${stats.pendingMovements === 0 ? 'status-normal' : 'status-warning'}`}
                    >
                      {stats.pendingMovements === 0 ? '🟢 Al día' : '🟡 Pendientes'}
                    </span>
                  </td>
                  <td className="metric-description sap-theme">
                    Movimientos que requieren procesamiento
                  </td>
                </tr>
                <tr className={stats.lowStockAlerts > 0 ? 'alert-row' : ''}>
                  <td className="metric-name sap-theme">
                    <span className="metric-icon sap-theme">⚠️</span>
                    Alertas de Stock
                  </td>
                  <td className="metric-value sap-theme">{formatNumber(stats.lowStockAlerts)}</td>
                  <td>
                    <span
                      className={`status-badge ${stats.lowStockAlerts === 0 ? 'status-normal' : 'status-critical'}`}
                    >
                      {stats.lowStockAlerts === 0 ? '🟢 Normal' : '🔴 Crítico'}
                    </span>
                  </td>
                  <td className="metric-description sap-theme">
                    Productos con stock por debajo del mínimo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabla de Inventario Principal */}
      <div className="dashboard-table-section sap-theme">
        <h2 className="table-section-title sap-theme">📦 Inventario Principal</h2>
        <div className="dashboard-table-container sap-theme">
          <div className="table-wrapper sap-theme">
            <table className="dashboard-table sap-theme">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Ubicación</th>
                  <th>Stock Actual</th>
                  <th>Capacidad</th>
                  <th>Porcentaje</th>
                  <th>Valor</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {inventoryTableData.length > 0 ? (
                  inventoryTableData.map((item) => (
                    <tr
                      key={item.id}
                      className={item.statusClass === 'status-low' ? 'alert-row' : ''}
                    >
                      <td className="product-name sap-theme">
                        <span className="product-icon sap-theme">⛽</span>
                        {item.name}
                      </td>
                      <td>{item.location}</td>
                      <td className="stock-value sap-theme">
                        {formatNumber(item.currentStock)} gal
                      </td>
                      <td>{formatNumber(item.maxCapacity)} gal</td>
                      <td>
                        <div className="percentage-display sap-theme">
                          <span className="percentage-value sap-theme">{item.percentage}%</span>
                          <div className="percentage-bar sap-theme">
                            <div
                              className="percentage-fill sap-theme"
                              style={{
                                width: `${item.percentage}%`,
                                backgroundColor:
                                  item.percentage < 25
                                    ? 'var(--color-error)'
                                    : item.percentage < 50
                                      ? 'var(--color-warning)'
                                      : 'var(--color-success)',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="value-cell sap-theme">{formatCurrency(item.value)}</td>
                      <td>
                        <span className={`status-badge ${item.statusClass}`}>
                          {item.status === 'Bajo' ? '🔴' : item.status === 'Alto' ? '🔵' : '🟢'}{' '}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data sap-theme">
                      No hay datos de inventario disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabla de Vehículos Activos */}
      <div className="dashboard-table-section sap-theme">
        <h2 className="table-section-title sap-theme">🚜 Vehículos Activos</h2>
        <div className="dashboard-table-container sap-theme">
          <div className="table-wrapper sap-theme">
            <table className="dashboard-table sap-theme">
              <thead>
                <tr>
                  <th>ID Vehículo</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Combustible</th>
                  <th>Consumo Total</th>
                  <th>Horas Trabajadas</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {vehiclesTableData.length > 0 ? (
                  vehiclesTableData.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td className="vehicle-id sap-theme">{vehicle.vehicleId}</td>
                      <td>{vehicle.name}</td>
                      <td className="vehicle-type sap-theme">{vehicle.type}</td>
                      <td>
                        <span className="fuel-type sap-theme">
                          {vehicle.fuelType === 'diesel' ? '🚛' : '🚗'} {vehicle.fuelType}
                        </span>
                      </td>
                      <td className="consumption-value sap-theme">
                        {formatNumber(vehicle.consumption)} gal
                      </td>
                      <td>{formatNumber(vehicle.hours)} hrs</td>
                      <td>📍 {vehicle.location}</td>
                      <td>
                        <span className={`status-badge ${vehicle.statusClass}`}>
                          ✅ {vehicle.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data sap-theme">
                      No hay vehículos activos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabla de Actividad Reciente */}
      <div className="dashboard-table-section sap-theme">
        <h2 className="table-section-title sap-theme">📋 Actividad Reciente</h2>
        <div className="dashboard-table-container sap-theme">
          <div className="table-wrapper sap-theme">
            <table className="dashboard-table sap-theme">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentMovements.length > 0 ? (
                  recentMovements.map((mov) => (
                    <tr key={mov.id}>
                      <td>
                        <span className={`movement-type-badge ${mov.type}`}>
                          {mov.type === 'entrada'
                            ? '📥'
                            : mov.type === 'salida'
                              ? '📤'
                              : mov.type === 'transferencia'
                                ? '🔄'
                                : '🔧'}{' '}
                          {mov.type}
                        </span>
                      </td>
                      <td className="movement-description sap-theme">
                        {getMovementDescription(mov)}
                      </td>
                      <td className="movement-date sap-theme">
                        {safeDateHelper(mov.createdAt).toLocaleDateString('es-CO')}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${mov.status === 'completado' ? 'status-normal' : 'status-warning'}`}
                        >
                          {mov.status === 'completado' ? '✅ Completado' : '⏳ Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-data sap-theme">
                      No hay movimientos recientes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer con información del dashboard */}
      <div className="dashboard-table-footer sap-theme">
        <div className="footer-stats sap-theme">
          <span className="footer-stat sap-theme">
            <strong>{inventory.length}</strong> productos en inventario
          </span>
          <span className="footer-stat sap-theme">
            <strong>{vehicles.length}</strong> vehículos registrados
          </span>
          <span className="footer-stat sap-theme">
            <strong>{movements.length}</strong> movimientos totales
          </span>
        </div>
        <div className="footer-timestamp sap-theme">
          Última actualización: {new Date().toLocaleString('es-CO')}
        </div>
      </div>
    </div>
  );
};

export default DashboardTable;

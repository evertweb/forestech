/**
 * ================================================================================================================================
 * ARCHIVO: DashboardMain-SAP.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Componente principal de Dashboard con tema SAP Fiori Corporate implementado.
 *
 * FUNCIONALIDAD:
 * - Implementa el tema SAP Fiori Corporate completo
 * - Mantiene toda la funcionalidad del dashboard original
 * - Diseño responsive y accesible WCAG 2.1 AA
 * - Estados visuales consistentes con estándares SAP
 * ================================================================================================================================
 */

import React, { useMemo, useEffect, useState, useCallback } from 'react';
import '../../styles/sap-dashboard.css';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { formatNumber, formatCurrency } from '../../utils/calculations';
import { logInventoryState, findDuplicateItems } from '../../utils/debugUtils';
import { PageLayout, ShimmerLoader, ShimmerCardsGrid, ShimmerTable } from '../shared';
import { cardsService } from '../../services/cardsService';
import UnifiedCardsGrid from '../shared/UnifiedCards';
import { useCardDetails } from '../../hooks/useCardDetails.jsx';

const DashboardMainSAP = () => {
  // ==================================================================================================
  // ESTADO DEL COMPONENTE
  // ==================================================================================================
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const { subscribeToInventory, subscribeToMovements, subscribeToVehicles } = useCombustibles();
  const { openCardDetails, CardDetailsModal } = useCardDetails();

  // ==================================================================================================
  // EFECTOS
  // ==================================================================================================
  useEffect(() => {
    console.log('🚀 Dashboard SAP iniciando suscripciones a datos...');
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
      console.log('🔌 Dashboard SAP cancelando suscripciones...');
      if (typeof unsubInventory === 'function') unsubInventory();
      if (typeof unsubMovements === 'function') unsubMovements();
      if (typeof unsubVehicles === 'function') unsubVehicles();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Las funciones subscribe son estables del context, no necesitan estar en dependencies

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

  // Estadísticas calculadas (removidas ya que usamos cards unificadas)
  // const stats = useMemo(() => { ... }, [inventory, vehicles, movements]);

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
      .slice()
      .sort((a, b) => safeDateHelper(b.createdAt).getTime() - safeDateHelper(a.createdAt).getTime())
      .slice(0, 10);
  }, [movements]);

  const inventoryTableData = useMemo(() => {
    return inventory
      .filter((item) => item.isActive !== false)
      .slice(0, 15)
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
          status: currentStock <= minStock ? 'Crítico' : percentage > 80 ? 'Alto' : 'Normal',
          statusClass: currentStock <= minStock ? 'error' : percentage > 80 ? 'warning' : 'success',
        };
      });
  }, [inventory]);

  // Componentes para PageLayout
  const handleManualRefresh = useCallback(async () => {
    console.log('🔄 Forzando actualización manual del dashboard...');
    try {
      const { cardsService: cardsServiceModule } = await import('../../services/cardsService');
      cardsServiceModule.invalidateCache();

      const FirebaseMovementsService = (await import('../../services/FirebaseMovementsService')).default;
      const movementsService = new FirebaseMovementsService();

      const FirebaseInventoryService = (await import('../../services/FirebaseInventoryService')).default;
      const inventoryServiceInstance = new FirebaseInventoryService();

      const [movementsResult, inventoryResult] = await Promise.all([
        movementsService.getAllMovements(),
        inventoryServiceInstance.getInventory()
      ]);

      console.log('🔍 Datos frescos obtenidos:');
      console.log('  - Movimientos:', movementsResult?.length, 'items');
      console.log('  - Inventario:', inventoryResult?.length, 'items');

      if (movementsResult) {
        setMovements(movementsResult);
      }
      if (inventoryResult) {
        setInventory(inventoryResult);
      }

      console.log('✅ Refresh manual completado');
    } catch (error) {
      console.error('❌ Error en refresh manual:', error);
    }
  }, [setInventory, setMovements]);

  // Generar cards unificadas para dashboard
  const dashboardCards = useMemo(() => {
    console.log('🎯 DashboardMain-SAP - Generando cards con datos:');
    console.log('  - Inventory:', inventory.length, 'items');
    console.log('  - Vehicles:', vehicles.length, 'items');
    console.log('  - Movements:', movements.length, 'items');

    const cards = cardsService.getCardsForTab('dashboard', {
      inventory,
      vehicles,
      movements,
    });

    console.log('🃏 DashboardMain-SAP - Cards generadas:', cards.length);
    console.log(
      '📋 Cards:',
      cards.map((c) => ({ id: c.id, title: c.title, value: c.value }))
    );

    return cards;
  }, [inventory, vehicles, movements]);

  const statsComponent = useMemo(() => {
    if (dataLoading) {
      return (
        <div className="apple-stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="apple-stat-card">
              <div className="apple-skeleton" style={{ height: '20px', marginBottom: '12px' }} />
              <div className="apple-skeleton" style={{ height: '32px', marginBottom: '8px' }} />
              <div className="apple-skeleton" style={{ height: '16px', width: '60%' }} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="apple-stats-grid">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            className="apple-stat-card"
            onClick={() => openCardDetails(card)}
          >
            <div className="apple-stat-card-header">
              <span className="apple-stat-card-icon">{card.icon || '📊'}</span>
            </div>
            <div className="apple-stat-card-value">{card.value}</div>
            <div className="apple-stat-card-label">{card.title}</div>
            {card.change && (
              <div className={`apple-stat-card-change ${card.change > 0 ? 'positive' : card.change < 0 ? 'negative' : 'neutral'}`}>
                {card.change > 0 ? '↗' : card.change < 0 ? '↘' : '→'} {Math.abs(card.change)}%
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }, [dataLoading, dashboardCards, openCardDetails]);

  const mainContent = useMemo(() => {
    return (
      <>
        {/* Modal de detalles de cards */}
        {CardDetailsModal}

        {/* Error Display */}
        {dataError && (
          <div className="error-banner sap-theme">
            <div>
              <strong>Error al cargar datos:</strong> {dataError}
            </div>
            <button className="btn btn-primary sap-theme" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        {/* Tabla de Inventario */}
        {dataLoading ? (
          <ShimmerTable
            rows={8}
            columns={8}
            title={true}
            actions={true}
            className="shimmer-inventory-table"
          />
        ) : (
          <div className="apple-content-section">
            <div className="apple-content-header">
              <h2 className="apple-content-title">Inventario Principal</h2>
              <div className="apple-content-actions">
                <button className="apple-button apple-button-tertiary">🔍 Filtrar</button>
                <button className="apple-button apple-button-secondary">📋 Ver Todo</button>
                <button className="apple-button apple-button-primary" onClick={handleManualRefresh}>
                  🔄 Actualizar
                </button>
              </div>
            </div>

            <div className="apple-content-body">
              <table className="apple-dashboard-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Ubicación</th>
                    <th>Stock Actual</th>
                    <th>Capacidad</th>
                    <th>Nivel</th>
                    <th>Valor</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryTableData.length > 0 ? (
                    inventoryTableData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong className="apple-body-medium">{item.name}</strong>
                        </td>
                        <td className="text-secondary">{item.location}</td>
                        <td>{formatNumber(item.currentStock)} gal</td>
                        <td>{formatNumber(item.maxCapacity)} gal</td>
                        <td>
                          <div className="apple-progress-container">
                            <div className="apple-progress-bar">
                              <div
                                className={`apple-progress-fill ${
                                  item.statusClass === 'error'
                                    ? 'error'
                                    : item.statusClass === 'warning'
                                      ? 'warning'
                                      : 'success'
                                }`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="apple-progress-text">{item.percentage}%</span>
                          </div>
                        </td>
                        <td className="apple-body-medium">{formatCurrency(item.value)}</td>
                        <td>
                          <span className={`apple-status-badge ${
                            item.statusClass === 'error' ? 'inactive' :
                            item.statusClass === 'warning' ? 'warning' : 'active'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="apple-action-buttons">
                            <button className="apple-action-button" title="Ver detalles">
                              👁️
                            </button>
                            <button className="apple-action-button" title="Editar">
                              ✏️
                            </button>
                            <button className="apple-action-button primary" title="Reabastecer">
                              📦
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">
                        <div className="apple-empty-state">
                          <div className="apple-empty-icon">📦</div>
                          <div className="apple-empty-title">No hay datos de inventario</div>
                          <div className="apple-empty-description">
                            Los datos del inventario se cargarán automáticamente cuando estén disponibles.
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de Actividad Reciente */}
        {dataLoading ? (
          <ShimmerTable
            rows={5}
            columns={5}
            title={true}
            actions={true}
            className="shimmer-activity-table"
          />
        ) : (
          <div className="apple-content-section">
            <div className="apple-content-header">
              <h2 className="apple-content-title">Actividad Reciente</h2>
              <div className="apple-content-actions">
                <button className="apple-button apple-button-tertiary">📋 Ver Histórico</button>
              </div>
            </div>

            <div className="apple-content-body">
              <table className="apple-dashboard-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMovements.length > 0 ? (
                    recentMovements.map((mov) => (
                      <tr key={mov.id}>
                        <td>
                          <span
                            className={`apple-status-badge ${
                              mov.type === 'entrada' ? 'active' :
                              mov.type === 'salida' ? 'warning' : 'info'
                            }`}
                          >
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
                        <td className="text-secondary">
                          {mov.type === 'entrada'
                            ? `Entrada de ${mov.quantity || 0} gal de ${mov.fuelType || 'N/A'}`
                            : mov.type === 'salida'
                              ? `Salida de ${mov.quantity || 0} gal para vehículo ${mov.vehicleId || 'N/A'}`
                              : mov.type === 'transferencia'
                                ? `Transferencia de ${mov.quantity || 0} gal`
                                : `Ajuste de inventario: ${mov.quantity || 0} gal de ${mov.fuelType || 'N/A'}`}
                        </td>
                        <td className="apple-body-small text-secondary">
                          {safeDateHelper(mov.createdAt).toLocaleDateString('es-CO')}
                        </td>
                        <td>
                          <span
                            className={`apple-status-badge ${mov.status === 'completado' ? 'active' : 'warning'}`}
                          >
                            {mov.status === 'completado' ? 'Completado' : 'Pendiente'}
                          </span>
                        </td>
                        <td>
                          <div className="apple-action-buttons">
                            <button className="apple-action-button" title="Ver detalles">
                              👁️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">
                        <div className="apple-empty-state">
                          <div className="apple-empty-icon">🔄</div>
                          <div className="apple-empty-title">No hay movimientos recientes</div>
                          <div className="apple-empty-description">
                            Los movimientos aparecerán aquí cuando se registren nuevas actividades.
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer con estadísticas Apple */}
        {dataLoading ? (
          <div className="apple-content-section">
            <div className="apple-content-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                  <div className="apple-skeleton" style={{ width: '120px', height: '16px' }} />
                  <div className="apple-skeleton" style={{ width: '140px', height: '16px' }} />
                  <div className="apple-skeleton" style={{ width: '130px', height: '16px' }} />
                </div>
                <div className="apple-skeleton" style={{ width: '180px', height: '14px' }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="apple-content-section">
            <div className="apple-content-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                  <span className="apple-body-medium">
                    <strong>{inventory.length}</strong> productos en inventario
                  </span>
                  <span className="apple-body-medium">
                    <strong>{vehicles.length}</strong> vehículos registrados
                  </span>
                  <span className="apple-body-medium">
                    <strong>{movements.length}</strong> movimientos totales
                  </span>
                </div>
                <div className="apple-body-small text-secondary">
                  Última actualización: {new Date().toLocaleString('es-CO')}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }, [CardDetailsModal, dataError, dataLoading, handleManualRefresh, inventory.length, inventoryTableData, movements.length, recentMovements, vehicles.length]);

  return (
    <div className="apple-dashboard-main">
      {/* Header del Dashboard */}
      <div className="apple-dashboard-header">
        <h1 className="apple-dashboard-title">Dashboard Operativo</h1>
        <p className="apple-dashboard-subtitle">Gestión integral de combustibles y maquinaria</p>
      </div>

      {/* Estadísticas */}
      {statsComponent}

      {/* Contenido principal */}
      <div className="apple-content-grid">
        {mainContent}
      </div>
    </div>
  );
};

export default DashboardMainSAP;

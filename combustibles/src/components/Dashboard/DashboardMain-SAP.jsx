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

import React, { useMemo, useEffect, useState } from 'react';
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
  const headerActions = (
    <div className="dashboard-table-actions sap-theme">
      <button className="btn btn-secondary sap-theme">📊 Exportar</button>
      <button className="btn btn-primary sap-theme">🔄 Actualizar</button>
    </div>
  );

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

  const statsComponent = dataLoading ? (
    <ShimmerCardsGrid cards={4} columns={4} variant="stat" className="dashboard-cards-grid" />
  ) : (
    <UnifiedCardsGrid
      cards={dashboardCards}
      onCardClick={openCardDetails}
      columns={4}
      className="dashboard-cards-grid"
    />
  );

  const filtersComponent = null; // Dashboard no necesita filtros complejos

  const mainContent = (
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
        <div className="dashboard-table-container sap-theme">
          <div className="dashboard-table-header sap-theme">
            <h2 className="dashboard-table-title sap-theme">Inventario Principal</h2>
            <div className="dashboard-table-actions sap-theme">
              <button className="btn btn-tertiary sap-theme">🔍 Filtrar</button>
              <button className="btn btn-secondary sap-theme">📋 Ver Todo</button>
            </div>
          </div>

          <table className="sap-theme table">
            <thead>
              <tr>
                <th role="columnheader">Producto</th>
                <th role="columnheader">Ubicación</th>
                <th role="columnheader">Stock Actual</th>
                <th role="columnheader">Capacidad</th>
                <th role="columnheader">Nivel</th>
                <th role="columnheader">Valor</th>
                <th role="columnheader">Estado</th>
                <th role="columnheader">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventoryTableData.length > 0 ? (
                inventoryTableData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.location}</td>
                    <td>{formatNumber(item.currentStock)} gal</td>
                    <td>{formatNumber(item.maxCapacity)} gal</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{item.percentage}%</span>
                        <div
                          style={{
                            width: '60px',
                            height: '8px',
                            background: 'var(--sap-neutral-300)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${item.percentage}%`,
                              height: '100%',
                              background:
                                item.statusClass === 'error'
                                  ? 'var(--sap-error)'
                                  : item.statusClass === 'warning'
                                    ? 'var(--sap-warning)'
                                    : 'var(--sap-success)',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>{formatCurrency(item.value)}</td>
                    <td>
                      <span className={`status-badge sap-theme ${item.statusClass}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="inventory-actions sap-theme">
                        <button className="action-button sap-theme view" title="Ver detalles">
                          👁️
                        </button>
                        <button className="action-button sap-theme edit" title="Editar">
                          ✏️
                        </button>
                        <button className="action-button sap-theme restock" title="Reabastecer">
                          📦
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: 'center', padding: '24px', color: 'var(--sap-text-muted)' }}
                  >
                    No hay datos de inventario disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
        <div className="dashboard-table-container sap-theme">
          <div className="dashboard-table-header sap-theme">
            <h2 className="dashboard-table-title sap-theme">Actividad Reciente</h2>
            <div className="dashboard-table-actions sap-theme">
              <button className="btn btn-tertiary sap-theme">📋 Ver Histórico</button>
            </div>
          </div>

          <table className="sap-theme table">
            <thead>
              <tr>
                <th role="columnheader">Tipo</th>
                <th role="columnheader">Descripción</th>
                <th role="columnheader">Fecha</th>
                <th role="columnheader">Estado</th>
                <th role="columnheader">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.length > 0 ? (
                recentMovements.map((mov) => (
                  <tr key={mov.id}>
                    <td>
                      <span
                        className={`status-badge sap-theme ${mov.type === 'entrada' ? 'success' : mov.type === 'salida' ? 'warning' : ''}`}
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
                    <td>
                      {mov.type === 'entrada'
                        ? `Entrada de ${mov.quantity || 0} gal de ${mov.fuelType || 'N/A'}`
                        : mov.type === 'salida'
                          ? `Salida de ${mov.quantity || 0} gal para vehículo ${mov.vehicleId || 'N/A'}`
                          : mov.type === 'transferencia'
                            ? `Transferencia de ${mov.quantity || 0} gal`
                            : `Ajuste de inventario: ${mov.quantity || 0} gal de ${mov.fuelType || 'N/A'}`}
                    </td>
                    <td>{safeDateHelper(mov.createdAt).toLocaleDateString('es-CO')}</td>
                    <td>
                      <span
                        className={`status-badge sap-theme ${mov.status === 'completado' ? 'active' : 'warning'}`}
                      >
                        {mov.status === 'completado' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                    <td>
                      <div className="inventory-actions sap-theme">
                        <button className="action-button sap-theme view" title="Ver detalles">
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: 'center', padding: '24px', color: 'var(--sap-text-muted)' }}
                  >
                    No hay movimientos recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer con estadísticas */}
      {dataLoading ? (
        <div className="shimmer-dashboard-footer">
          <div className="shimmer-footer-stats">
            <ShimmerLoader.Base width="120px" height="16px" />
            <ShimmerLoader.Base width="140px" height="16px" />
            <ShimmerLoader.Base width="130px" height="16px" />
          </div>
          <ShimmerLoader.Base width="180px" height="14px" className="shimmer-timestamp" />
        </div>
      ) : (
        <div
          style={{
            marginTop: 'var(--sap-spacing-xl)',
            padding: 'var(--sap-spacing-lg)',
            background: 'var(--sap-neutral-100)',
            border: '1px solid var(--sap-neutral-300)',
            borderRadius: 'var(--sap-border-radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--sap-spacing-md)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--sap-spacing-lg)', flexWrap: 'wrap' }}>
            <span>
              <strong>{inventory.length}</strong> productos en inventario
            </span>
            <span>
              <strong>{vehicles.length}</strong> vehículos registrados
            </span>
            <span>
              <strong>{movements.length}</strong> movimientos totales
            </span>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--sap-text-secondary)' }}>
            Última actualización: {new Date().toLocaleString('es-CO')}
          </div>
        </div>
      )}
    </>
  );

  return (
    <PageLayout
      title="Dashboard Operativo"
      subtitle="Gestión integral de combustibles y maquinaria - SAP Fiori"
      actions={headerActions}
      stats={statsComponent}
      filters={filtersComponent}
      loading={dataLoading}
      showFilters={false}
    >
      {mainContent}
    </PageLayout>
  );
};

export default DashboardMainSAP;

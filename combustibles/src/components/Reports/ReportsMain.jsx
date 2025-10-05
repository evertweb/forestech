/**
 * ReportsMain.jsx - Módulo principal de reportes y análisis
 * Dashboard ejecutivo con KPIs en tiempo real y navegación entre reportes
 * 
 * MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
 * - Usa múltiples stores: Auth, Movements, Inventory, Vehicles
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useAuthStore, useMovementsStore, useInventoryStore, useVehiclesStore } from '../../stores';
import {
  calculateInventoryStats,
  calculateMovementsStats,
  calculateVehiclesStats,
  calculateLowStockAlerts,
  calculateConsumptionProjections,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '../../utils/calculations';

// Importar componentes de reportes específicos
import InventoryReports from './InventoryReports';
import VehicleReports from './VehicleReports';
import FinancialReports from './FinancialReports';
import MovementReports from './MovementReports';
import { PageLayout, ShimmerLoader, ShimmerCardsGrid, ShimmerTable } from '../shared';
import { cardsService } from '../../services/cardsService';
import UnifiedCardsGrid from '../shared/UnifiedCards';
import { useCardDetails } from '../../hooks/useCardDetails.jsx';

import './ReportsMain-SAP.css';

const ReportsMain = () => {
  // 🏪 Zustand Stores - Múltiples stores para reportes
  const inventory = useInventoryStore(state => state.inventory);
  const movements = useMovementsStore(state => state.movements);
  const vehicles = useVehiclesStore(state => state.vehicles);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const canViewReports = hasPermission ? hasPermission('reports:view') : true;
  
  // Nota: suppliers no está en un store aún, por ahora usar array vacío memoizado
  const suppliers = useMemo(() => [], []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // Últimos 30 días
    end: new Date().toISOString().slice(0, 10),
  });
  const { openCardDetails, CardDetailsModal } = useCardDetails();

  // Calcular estadísticas principales (hooks siempre se ejecutan)
  const inventoryStats = useMemo(() => calculateInventoryStats(inventory), [inventory]);
  const movementsStats = useMemo(() => calculateMovementsStats(movements), [movements]);
  const vehiclesStats = useMemo(
    () => calculateVehiclesStats(vehicles, movements),
    [vehicles, movements]
  );
  const lowStockAlerts = useMemo(() => calculateLowStockAlerts(inventory), [inventory]);
  const projections = useMemo(() => calculateConsumptionProjections(movements), [movements]);

  // Generar cards unificadas para reportes dashboard
  const reportsCards = useMemo(() => {
    return cardsService.getCardsForTab('reports', {
      inventory,
      vehicles,
      movements,
      suppliers,
    });
  }, [inventory, vehicles, movements, suppliers]);

  const statsComponent = useMemo(() => {
    const isLoading = !inventory.length && !movements.length && !vehicles.length;

    return activeTab === 'dashboard' && isLoading ? (
      <ShimmerCardsGrid cards={4} columns={4} variant="stat" className="reports-cards-grid" />
    ) : (
      <UnifiedCardsGrid
        cards={activeTab === 'dashboard' ? reportsCards : []}
        onCardClick={openCardDetails}
        columns={4}
        className="reports-cards-grid"
      />
    );
  }, [
    activeTab,
    reportsCards,
    openCardDetails,
    inventory.length,
    movements.length,
    vehicles.length,
  ]);

  // Configuración de pestañas
  const reportTabs = useMemo(
    () => [
      {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Vista ejecutiva',
        icon: '📊',
        component: null, // Se renderiza aquí mismo
      },
      {
        id: 'inventory',
        title: 'Inventario',
        subtitle: 'Stock y alertas',
        icon: '🛢️',
        component: InventoryReports,
      },
      {
        id: 'vehicles',
        title: 'Vehículos',
        subtitle: 'Consumo y eficiencia',
        icon: '🚜',
        component: VehicleReports,
      },
      {
        id: 'movements',
        title: 'Movimientos',
        subtitle: 'Entradas y salidas',
        icon: '📈',
        component: MovementReports,
      },
      {
        id: 'financial',
        title: 'Financiero',
        subtitle: 'Costos y ROI',
        icon: '💰',
        component: FinancialReports,
      },
    ],
    []
  );

  // Función para cambiar rango de fechas
  const handleDateRangeChange = useCallback((field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Renderizar dashboard ejecutivo
  const renderDashboard = useCallback(() => (
    <div className="apple-content-grid">
      {/* Alertas críticas */}
      {lowStockAlerts.length > 0 && (
        <div className="alerts-container">
          {lowStockAlerts.slice(0, 3).map((alert, index) => (
            <div
              key={index}
              className={`apple-card ${alert.stockLevel === 'critical' ? 'apple-form-error' : 'apple-form-warning'}`}
            >
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <div className="apple-title-small alert-title">
                  Stock {alert.stockLevel === 'critical' ? 'Crítico' : 'Bajo'}: {alert.productName}
                </div>
                <div className="apple-body-small text-secondary alert-message">
                  {alert.location} - {formatNumber(alert.currentStock)} {alert.unit} (
                  {formatPercentage(alert.percentage / 100)} de capacidad)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs principales */}
      <div className="apple-stats-grid">
        {/* Inventario */}
        <div className="apple-stat-card">
          <div className="apple-stat-card-header">
            <div className="apple-stat-card-icon">🛢️</div>
          </div>
          <div className="apple-stat-card-value">
            {formatCurrency(inventoryStats.totalValue)}
          </div>
          <div className="apple-stat-card-label">Valor Total Inventario</div>
          <div className="apple-stat-card-change neutral">
            <span>📦</span>
            <span>{inventoryStats.totalItems} productos activos</span>
          </div>
        </div>

        {/* Vehículos */}
        <div className="apple-stat-card">
          <div className="apple-stat-card-header">
            <div className="apple-stat-card-icon">🚜</div>
          </div>
          <div className="apple-stat-card-value">{vehiclesStats.activeVehicles}</div>
          <div className="apple-stat-card-label">Vehículos Activos</div>
          <div className="apple-stat-card-change positive">
            <span>⏱️</span>
            <span>{formatNumber(vehiclesStats.totalHours)} horas trabajadas</span>
          </div>
        </div>

        {/* Movimientos */}
        <div className="apple-stat-card">
          <div className="apple-stat-card-header">
            <div className="apple-stat-card-icon">📈</div>
          </div>
          <div className="apple-stat-card-value">
            {movementsStats.totalMovements}
          </div>
          <div className="apple-stat-card-label">Movimientos del Mes</div>
          <div className="apple-stat-card-change positive">
            <span>✅</span>
            <span>{movementsStats.completedMovements} completados</span>
          </div>
        </div>

        {/* Eficiencia */}
        <div className="apple-stat-card">
          <div className="apple-stat-card-header">
            <div className="apple-stat-card-icon">💰</div>
          </div>
          <div className="apple-stat-card-value">
            {formatNumber(vehiclesStats.averageEfficiency, 1)}
          </div>
          <div className="apple-stat-card-label">Consumo Promedio (L/h)</div>
          <div className="apple-stat-card-change neutral">
            <span>📊</span>
            <span>{formatNumber(vehiclesStats.totalConsumption)} L total</span>
          </div>
        </div>
      </div>

      {/* Proyecciones */}
      {projections.confidence > 0 && (
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">📈 Proyecciones de Consumo (30 días)</h3>
            <div className="chart-actions">
              <span className="badge info">Confianza: {formatNumber(projections.confidence)}%</span>
            </div>
          </div>
          <div className="chart-content">
            <div className="projections-grid">
              {Object.entries(projections.projectedConsumption).map(([fuelType, projection]) => (
                <div key={fuelType} className="projection-item">
                  <h4>{fuelType.toUpperCase()}</h4>
                  <div className="projection-value">
                    {formatNumber(projection.projectedTotal)} L
                  </div>
                  <div className="projection-daily">
                    {formatNumber(projection.dailyAverage)} L/día promedio
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock por tipo */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">🛢️ Stock Actual por Tipo de Combustible</h3>
        </div>
        <div className="chart-content">
          <div className="stock-grid">
            {Object.entries(inventoryStats.stockByType).map(([fuelType, stock]) => (
              <div key={fuelType} className="stock-item">
                <h4>{fuelType.toUpperCase()}</h4>
                <div className="stock-value">{formatNumber(stock)} L</div>
                <div className="stock-status">
                  {stock > 1000 ? (
                    <span className="badge success">Stock Bueno</span>
                  ) : stock > 500 ? (
                    <span className="badge warning">Stock Bajo</span>
                  ) : (
                    <span className="badge danger">Stock Crítico</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ), [
    inventoryStats,
    lowStockAlerts,
    movementsStats,
    projections,
    vehiclesStats,
  ]);

  // Renderizar contenido activo
  const activeContent = useMemo(() => {
    const activeTabConfig = reportTabs.find((tab) => tab.id === activeTab);

    if (activeTab === 'dashboard') {
      return renderDashboard();
    }

    if (activeTabConfig?.component) {
      const Component = activeTabConfig.component;
      return (
        <Component
          inventory={inventory}
          movements={movements}
          vehicles={vehicles}
          suppliers={suppliers}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      );
    }

    return (
      <div className="apple-empty-state">
        <div className="apple-empty-icon">🚧</div>
        <h3 className="apple-empty-title">Reporte en Desarrollo</h3>
        <p className="apple-empty-description">
          Este reporte estará disponible próximamente.
        </p>
      </div>
    );
  }, [
    activeTab,
    dateRange,
    handleDateRangeChange,
    inventory,
    movements,
    renderDashboard,
    reportTabs,
    suppliers,
    vehicles,
  ]);

  // Componentes para PageLayout
  const headerActions = null; // No hay acciones específicas en el header para reportes

  const handleQuickRange = useCallback(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    setDateRange({
      start: lastMonth.toISOString().slice(0, 10),
      end: today.toISOString().slice(0, 10),
    });
  }, []);

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const handleSetActiveTab = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const filtersComponent = useMemo(() => (
    <>
      {/* Filtros globales */}
      <div className="apple-content-section">
        <div className="apple-form-row">
          <div className="apple-form-group">
            <label className="apple-form-label">Fecha Inicio</label>
            <input
              type="date"
              className="apple-form-input"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
          </div>
          <div className="apple-form-group">
            <label className="apple-form-label">Fecha Fin</label>
            <input
              type="date"
              className="apple-form-input"
              value={dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>
          <div className="apple-form-group">
            <button
              className="apple-button apple-button-secondary"
              onClick={handleQuickRange}
            >
              📅 Último Mes
            </button>
            <button
              className="apple-button apple-button-primary"
              onClick={handleRefresh}
            >
              🔄 Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Navegación de reportes */}
      <div className="apple-nav-container">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            className={`apple-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleSetActiveTab(tab.id)}
          >
            <span className="apple-nav-icon">{tab.icon}</span>
            <div className="nav-tab-text">
              <span className="apple-nav-label">{tab.title}</span>
              <span className="apple-body-small text-secondary">{tab.subtitle}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  ), [
    activeTab,
    dateRange.end,
    dateRange.start,
    handleDateRangeChange,
    handleQuickRange,
    handleRefresh,
    handleSetActiveTab,
    reportTabs,
  ]);

  if (!canViewReports) {
    return (
      <div className="apple-dashboard-main">
        <div className="apple-empty-state">
          <div className="apple-empty-icon">🔒</div>
          <h3 className="apple-empty-title">Acceso Restringido</h3>
          <p className="apple-empty-description">
            No tienes permisos para ver los reportes. Contacta a tu administrador.
          </p>
        </div>
      </div>
    );
  }

  const mainContent = activeContent;

  return (
    <>
      {/* Modal de detalles de cards */}
      {CardDetailsModal}

      <PageLayout
        title="Reportes y Análisis"
        subtitle="Dashboard ejecutivo con análisis en tiempo real del sistema de combustibles"
        actions={headerActions}
        stats={statsComponent}
        filters={filtersComponent}
        showStats={activeTab === 'dashboard'}
        showFilters={true}
        className="reports-main"
      >
        {mainContent}
      </PageLayout>
    </>
  );
};

export default ReportsMain;

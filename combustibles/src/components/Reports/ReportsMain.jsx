/**
 * ReportsMain.jsx - Módulo principal de reportes y análisis
 * Dashboard ejecutivo con KPIs en tiempo real y navegación entre reportes
 */

import React, { useState, useMemo } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import {
  calculateInventoryStats,
  calculateMovementsStats,
  calculateVehiclesStats,
  calculateLowStockAlerts,
  calculateConsumptionProjections,
  formatCurrency,
  formatNumber,
  formatPercentage
} from '../../utils/calculations';

// Importar componentes de reportes específicos
import InventoryReports from './InventoryReports';
import VehicleReports from './VehicleReports';
import FinancialReports from './FinancialReports';
import MovementReports from './MovementReports';

import './ReportsMain-SAP.css';

const ReportsMain = () => {
  const { inventory, movements, vehicles, suppliers, userProfile } = useCombustibles();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // Últimos 30 días
    end: new Date().toISOString().slice(0, 10)
  });

  // Calcular estadísticas principales (hooks antes del return condicional)
  const inventoryStats = useMemo(() => calculateInventoryStats(inventory), [inventory]);
  const movementsStats = useMemo(() => calculateMovementsStats(movements), [movements]);
  const vehiclesStats = useMemo(() => calculateVehiclesStats(vehicles, movements), [vehicles, movements]);
  const lowStockAlerts = useMemo(() => calculateLowStockAlerts(inventory), [inventory]);
  const projections = useMemo(() => calculateConsumptionProjections(movements), [movements]);

  // Verificar permisos
  const canViewReports = userProfile?.combustiblesPermissions?.canViewReports || userProfile?.role === 'admin';

  if (!canViewReports) {
    return (
      <div className="reports-main sap-theme">
        <div className="empty-state sap-theme sap-message-info">
          <div className="empty-icon sap-theme">🔒</div>
          <h3 className="empty-title sap-theme sap-title">Acceso Restringido</h3>
          <p className="empty-message sap-theme sap-text">
            No tienes permisos para ver los reportes. Contacta a tu administrador.
          </p>
        </div>
      </div>
    );
  }

  // Configuración de pestañas
  const reportTabs = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'Vista ejecutiva',
      icon: '📊',
      component: null // Se renderiza aquí mismo
    },
    {
      id: 'inventory',
      title: 'Inventario',
      subtitle: 'Stock y alertas',
      icon: '🛢️',
      component: InventoryReports
    },
    {
      id: 'vehicles',
      title: 'Vehículos',
      subtitle: 'Consumo y eficiencia',
      icon: '🚜',
      component: VehicleReports
    },
    {
      id: 'movements',
      title: 'Movimientos',
      subtitle: 'Entradas y salidas',
      icon: '📈',
      component: MovementReports
    },
    {
      id: 'financial',
      title: 'Financiero',
      subtitle: 'Costos y ROI',
      icon: '💰',
      component: FinancialReports
    }
  ];

  // Función para cambiar rango de fechas
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Renderizar dashboard ejecutivo
  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Alertas críticas */}
      {lowStockAlerts.length > 0 && (
        <div className="alerts-container sap-theme">
          {lowStockAlerts.slice(0, 3).map((alert, index) => (
            <div key={index} className={`alert sap-theme sap-message-${alert.stockLevel === 'critical' ? 'error' : 'warning'}`}>
              <span className="alert-icon sap-theme">⚠️</span>
              <div className="alert-content sap-theme">
                <div className="alert-title sap-theme sap-text-primary">
                  Stock {alert.stockLevel === 'critical' ? 'Crítico' : 'Bajo'}: {alert.productName}
                </div>
                <div className="alert-message sap-theme sap-text-secondary">
                  {alert.location} - {formatNumber(alert.currentStock)} {alert.unit} 
                  ({formatPercentage(alert.percentage / 100)} de capacidad)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs principales */}
      <div className="kpis-grid sap-theme">
        {/* Inventario */}
        <div className="kpi-card sap-theme sap-card">
          <div className="kpi-icon inventory sap-theme">🛢️</div>
          <div className="kpi-value sap-theme sap-text-primary">{formatCurrency(inventoryStats.totalValue)}</div>
          <div className="kpi-label sap-theme sap-text-secondary">Valor Total Inventario</div>
          <div className="kpi-trend neutral sap-theme">
            <span className="trend-icon sap-theme">📦</span>
            <span className="sap-text">{inventoryStats.totalItems} productos activos</span>
          </div>
        </div>

        {/* Vehículos */}
        <div className="kpi-card sap-theme sap-card">
          <div className="kpi-icon vehicles sap-theme">🚜</div>
          <div className="kpi-value sap-theme sap-text-primary">{vehiclesStats.activeVehicles}</div>
          <div className="kpi-label sap-theme sap-text-secondary">Vehículos Activos</div>
          <div className="kpi-trend positive sap-theme">
            <span className="trend-icon sap-theme">⏱️</span>
            <span className="sap-text">{formatNumber(vehiclesStats.totalHours)} horas trabajadas</span>
          </div>
        </div>

        {/* Movimientos */}
        <div className="kpi-card sap-theme sap-card">
          <div className="kpi-icon movements sap-theme">📈</div>
          <div className="kpi-value sap-theme sap-text-primary">{movementsStats.totalMovements}</div>
          <div className="kpi-label sap-theme sap-text-secondary">Movimientos del Mes</div>
          <div className="kpi-trend positive sap-theme">
            <span className="trend-icon sap-theme">✅</span>
            <span className="sap-text">{movementsStats.completedMovements} completados</span>
          </div>
        </div>

        {/* Eficiencia */}
        <div className="kpi-card sap-theme sap-card">
          <div className="kpi-icon financial sap-theme">💰</div>
          <div className="kpi-value sap-theme sap-text-primary">{formatNumber(vehiclesStats.averageEfficiency, 1)}</div>
          <div className="kpi-label sap-theme sap-text-secondary">Consumo Promedio (L/h)</div>
          <div className="kpi-trend neutral sap-theme">
            <span className="trend-icon sap-theme">📊</span>
            <span className="sap-text">{formatNumber(vehiclesStats.totalConsumption)} L total</span>
          </div>
        </div>
      </div>

      {/* Proyecciones */}
      {projections.confidence > 0 && (
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">📈 Proyecciones de Consumo (30 días)</h3>
            <div className="chart-actions">
              <span className="badge info">
                Confianza: {formatNumber(projections.confidence)}%
              </span>
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
                <div className="stock-value">
                  {formatNumber(stock)} L
                </div>
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
  );

  // Renderizar contenido activo
  const renderActiveContent = () => {
    const activeTabConfig = reportTabs.find(tab => tab.id === activeTab);
    
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
      <div className="empty-state sap-theme sap-message-info">
        <div className="empty-icon sap-theme">🚧</div>
        <h3 className="empty-title sap-theme sap-title">Reporte en Desarrollo</h3>
        <p className="empty-message sap-theme sap-text">
          Este reporte estará disponible próximamente.
        </p>
      </div>
    );
  };

  return (
    <div className="reports-main sap-theme">
      {/* Header */}
      <div className="reports-header sap-theme">
        <div className="reports-title sap-theme">
          <span className="title-icon sap-theme">📋</span>
          <h1 className="sap-title">Reportes y Análisis</h1>
        </div>
        <p className="reports-subtitle sap-theme sap-subtitle">
          Dashboard ejecutivo con análisis en tiempo real del sistema de combustibles
        </p>
      </div>

      {/* Filtros globales */}
      <div className="reports-filters sap-theme">
        <div className="filters-grid sap-theme">
          <div className="filter-group sap-theme">
            <label className="filter-label sap-theme sap-text-secondary">Fecha Inicio</label>
            <input
              type="date"
              className="filter-input sap-theme sap-input"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
          </div>
          <div className="filter-group sap-theme">
            <label className="filter-label sap-theme sap-text-secondary">Fecha Fin</label>
            <input
              type="date"
              className="filter-input sap-theme sap-input"
              value={dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>
          <div className="filter-actions sap-theme">
            <button 
              className="filter-btn secondary sap-theme sap-button sap-button-secondary"
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                setDateRange({
                  start: lastMonth.toISOString().slice(0, 10),
                  end: today.toISOString().slice(0, 10)
                });
              }}
            >
              📅 Último Mes
            </button>
            <button 
              className="filter-btn primary sap-theme sap-button sap-button-primary"
              onClick={() => window.location.reload()}
            >
              🔄 Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Navegación de reportes */}
      <div className="reports-navigation sap-theme">
        {reportTabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab sap-theme sap-button ${activeTab === tab.id ? 'active sap-button-primary' : 'sap-button-secondary'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-tab-icon sap-theme">{tab.icon}</span>
            <div className="nav-tab-text sap-theme">
              <span className="nav-tab-title sap-theme sap-text-primary">{tab.title}</span>
              <span className="nav-tab-subtitle sap-theme sap-text-secondary">{tab.subtitle}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Contenido del reporte activo */}
      {renderActiveContent()}
    </div>
  );
};

export default ReportsMain;
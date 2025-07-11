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

import './Reports.css';

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
      <div className="reports-main">
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h3 className="empty-title">Acceso Restringido</h3>
          <p className="empty-message">
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
        <div className="alerts-container">
          {lowStockAlerts.slice(0, 3).map((alert, index) => (
            <div key={index} className={`alert ${alert.stockLevel === 'critical' ? 'critical' : 'warning'}`}>
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <div className="alert-title">
                  Stock {alert.stockLevel === 'critical' ? 'Crítico' : 'Bajo'}: {alert.productName}
                </div>
                <div className="alert-message">
                  {alert.location} - {formatNumber(alert.currentStock)} {alert.unit} 
                  ({formatPercentage(alert.percentage / 100)} de capacidad)
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPIs principales */}
      <div className="kpis-grid">
        {/* Inventario */}
        <div className="kpi-card">
          <div className="kpi-icon inventory">🛢️</div>
          <div className="kpi-value">{formatCurrency(inventoryStats.totalValue)}</div>
          <div className="kpi-label">Valor Total Inventario</div>
          <div className="kpi-trend neutral">
            <span className="trend-icon">📦</span>
            {inventoryStats.totalItems} productos activos
          </div>
        </div>

        {/* Vehículos */}
        <div className="kpi-card">
          <div className="kpi-icon vehicles">🚜</div>
          <div className="kpi-value">{vehiclesStats.activeVehicles}</div>
          <div className="kpi-label">Vehículos Activos</div>
          <div className="kpi-trend positive">
            <span className="trend-icon">⏱️</span>
            {formatNumber(vehiclesStats.totalHours)} horas trabajadas
          </div>
        </div>

        {/* Movimientos */}
        <div className="kpi-card">
          <div className="kpi-icon movements">📈</div>
          <div className="kpi-value">{movementsStats.totalMovements}</div>
          <div className="kpi-label">Movimientos del Mes</div>
          <div className="kpi-trend positive">
            <span className="trend-icon">✅</span>
            {movementsStats.completedMovements} completados
          </div>
        </div>

        {/* Eficiencia */}
        <div className="kpi-card">
          <div className="kpi-icon financial">💰</div>
          <div className="kpi-value">{formatNumber(vehiclesStats.averageEfficiency, 1)}</div>
          <div className="kpi-label">Consumo Promedio (L/h)</div>
          <div className="kpi-trend neutral">
            <span className="trend-icon">📊</span>
            {formatNumber(vehiclesStats.totalConsumption)} L total
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
      <div className="empty-state">
        <div className="empty-icon">🚧</div>
        <h3 className="empty-title">Reporte en Desarrollo</h3>
        <p className="empty-message">
          Este reporte estará disponible próximamente.
        </p>
      </div>
    );
  };

  return (
    <div className="reports-main">
      {/* Header */}
      <div className="reports-header">
        <div className="reports-title">
          <span className="title-icon">📋</span>
          <h1>Reportes y Análisis</h1>
        </div>
        <p className="reports-subtitle">
          Dashboard ejecutivo con análisis en tiempo real del sistema de combustibles
        </p>
      </div>

      {/* Filtros globales */}
      <div className="reports-filters">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Fecha Inicio</label>
            <input
              type="date"
              className="filter-input"
              value={dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Fecha Fin</label>
            <input
              type="date"
              className="filter-input"
              value={dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>
          <div className="filter-actions">
            <button 
              className="filter-btn secondary"
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
              className="filter-btn primary"
              onClick={() => window.location.reload()}
            >
              🔄 Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Navegación de reportes */}
      <div className="reports-navigation">
        {reportTabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="nav-tab-icon">{tab.icon}</span>
            <div className="nav-tab-text">
              <span className="nav-tab-title">{tab.title}</span>
              <span className="nav-tab-subtitle">{tab.subtitle}</span>
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
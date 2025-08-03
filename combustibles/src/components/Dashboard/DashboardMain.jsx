/**
 * ================================================================================================================================
 * ARCHIVO: DashboardMain.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Dashboard principal con cards de navegación y resúmenes ejecutivos.
 *
 * FUNCIONALIDAD:
 * - Cards de navegación clicables hacia otras secciones
 * - Resúmenes ejecutivos con estadísticas clave
 * - Diseño SAP Fiori Corporate
 * - Funciones de redirección como el sidebar
 * ================================================================================================================================
 */

import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/sap-dashboard.css';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { formatNumber, formatCurrency } from '../../utils/calculations';

/**
 * Componente principal del dashboard operativo de combustibles.
 * Muestra cards de navegación, estadísticas generales y resúmenes ejecutivos.
 * Utiliza suscripciones manuales a inventario, movimientos y vehículos.
 */
const DashboardMain = () => {
  // ==================================================================================================
  // ESTADO DEL COMPONENTE Y NAVEGACIÓN
  // ==================================================================================================
  // Hook de navegación de React Router
  const navigate = useNavigate();

  // Estados locales para almacenar datos en tiempo real
  const [inventory, setInventory] = useState([]); // Lista de productos en inventario
  const [movements, setMovements] = useState([]); // Lista de movimientos de combustible
  const [vehicles, setVehicles] = useState([]);   // Lista de vehículos registrados
  const [dataLoading, setDataLoading] = useState(true); // Estado de carga de datos
  const [dataError, setDataError] = useState(null);      // Estado de error de datos

  // Hooks y funciones del contexto CombustiblesContext
  const { 
    subscribeToInventory,    // Función para suscribirse a cambios en inventario
    subscribeToMovements,    // Función para suscribirse a cambios en movimientos
    subscribeToVehicles,     // Función para suscribirse a cambios en vehículos
    hasPermission            // Función para validar permisos del usuario
  } = useCombustibles();

  // ==================================================================================================
  // EFECTOS
  // ==================================================================================================
  /**
   * Efecto que realiza la suscripción manual a inventario, movimientos y vehículos.
   * Cada suscripción actualiza su respectivo estado local y controla el estado de carga.
   * Se asegura el cleanup de las suscripciones al desmontar el componente.
   */
  useEffect(() => {
    console.log('🚀 Dashboard SAP iniciando suscripciones a datos...');
    let loadingCount = 3; // Controla cuántas suscripciones faltan por cargar
    
    // Función auxiliar para actualizar el estado de carga
    const updateLoading = () => {
      loadingCount--;
      if (loadingCount === 0) {
        setDataLoading(false);
      }
    };

    // Suscripción a inventario
    const unsubInventory = subscribeToInventory((data, error) => {
      if (error) {
        console.error('Error en suscripción de inventario:', error);
        setDataError('Error al cargar el inventario.');
      } else {
        setInventory(data || []);
      }
      updateLoading();
    });

    // Suscripción a movimientos
    const unsubMovements = subscribeToMovements((data, error) => {
      if (error) {
        console.error('Error en suscripción de movimientos:', error);
        setDataError('Error al cargar los movimientos.');
      } else {
        setMovements(data || []);
      }
      updateLoading();
    });

    // Suscripción a vehículos
    const unsubVehicles = subscribeToVehicles((data, error) => {
      if (error) {
        console.error('Error en suscripción de vehículos:', error);
        setDataError('Error al cargar los vehículos.');
      } else {
        setVehicles(data || []);
      }
      updateLoading();
    });

    // Cleanup: cancelar suscripciones al desmontar
    return () => {
      console.log('🔌 Dashboard SAP cancelando suscripciones...');
      if (typeof unsubInventory === 'function') unsubInventory();
      if (typeof unsubMovements === 'function') unsubMovements();
      if (typeof unsubVehicles === 'function') unsubVehicles();
    };
  }, [subscribeToInventory, subscribeToMovements, subscribeToVehicles]);

  // ==================================================================================================
  // NAVIGATION CARDS DATA
  // ==================================================================================================
  /**
   * Definición de las cards de navegación principales del dashboard.
   * Cada card contiene: título, icono, descripción, ruta, permiso requerido y estadísticas.
   * Se recalcula solo cuando cambian los datos de inventario, movimientos o vehículos.
   */
  const navigationCards = useMemo(() => [
    {
      id: 'inventory',
      title: 'Inventario',
      icon: '🛢️',
      description: 'Gestión de stock de combustibles',
      path: '/inventario',
      permission: 'canManageInventory',
      color: 'blue',
      stats: {
        primary: `${inventory.filter(item => item.isActive !== false).length}`,
        primaryLabel: 'Productos activos',
        secondary: `${inventory.filter(item => {
          const stock = parseFloat(item.currentStock) || 0;
          const minStock = parseFloat(item.minStock) || parseFloat(item.minThreshold) || 20;
          return item.isActive !== false && stock <= minStock;
        }).length}`,
        secondaryLabel: 'Alertas críticas'
      }
    },
    {
      id: 'movements',
      title: 'Movimientos',
      icon: '📈',
      description: 'Entradas y salidas de combustible',
      path: '/movimientos',
      permission: 'canCreateMovements',
      color: 'green',
      stats: {
        primary: `${movements.length}`,
        primaryLabel: 'Movimientos totales',
        secondary: `${movements.filter(m => m.status === 'pendiente').length}`,
        secondaryLabel: 'Pendientes'
      }
    },
    {
      id: 'vehicles',
      title: 'Vehículos',
      icon: '🚜',
      description: 'Gestión de maquinaria forestal',
      path: '/vehiculos',
      permission: null, // Visible para todos los usuarios
      color: 'orange',
      stats: {
        primary: `${vehicles.filter(v => v.status === 'activo').length}`,
        primaryLabel: 'Vehículos activos',
        secondary: `${vehicles.length}`,
        secondaryLabel: 'Total registrados'
      }
    },
    {
      id: 'reports',
      title: 'Reportes',
      icon: '📋',
      description: 'Análisis y reportes operativos',
      path: '/reportes',
      permission: 'canViewReports',
      color: 'purple',
      stats: {
        primary: formatCurrency(inventory
          .filter(item => item.isActive !== false)
          .reduce((sum, item) => {
            const stock = parseFloat(item.currentStock) || 0;
            const price = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
            return sum + (stock * price);
          }, 0)),
        primaryLabel: 'Valor total inventario',
        secondary: `${formatNumber(inventory
          .filter(item => item.status === 'active')
          .reduce((sum, item) => sum + (parseFloat(item.currentStock) || 0), 0))} gal`,
        secondaryLabel: 'Combustible total'
      }
    }
  ], [inventory, movements, vehicles]);

  // ==================================================================================================
  // FUNCIONES DE NAVEGACIÓN
  // ==================================================================================================
  /**
   * Maneja el clic en una card de navegación.
   * Si el usuario no tiene el permiso requerido, muestra alerta.
   * Si tiene permiso, navega a la ruta correspondiente.
   */
  const handleCardClick = (card) => {
    if (card.permission && !hasPermission(card.permission)) {
      alert(`No tienes permisos para acceder a ${card.title}`);
      return;
    }
    navigate(card.path);
  };

  // Filtra las cards según los permisos del usuario
  const visibleCards = navigationCards.filter(card => 
    !card.permission || hasPermission(card.permission)
  );

  // ==================================================================================================
  // ESTADÍSTICAS GENERALES
  // ==================================================================================================
  /**
   * Calcula estadísticas generales del sistema:
   * - Combustible total disponible
   * - Valor total del inventario
   * - Número de alertas de bajo stock
   * - Total de productos activos
   * - Vehículos activos
   * - Movimientos pendientes
   */
  const generalStats = useMemo(() => {
    const totalFuel = inventory
      .filter(item => item.status === 'active')
      .reduce((sum, item) => sum + (parseFloat(item.currentStock) || 0), 0);

    const totalValue = inventory
      .filter(item => item.isActive !== false)
      .reduce((sum, item) => {
        const stock = parseFloat(item.currentStock) || 0;
        const price = parseFloat(item.pricePerUnit || item.unitPrice) || 0;
        return sum + (stock * price);
      }, 0);
    
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
      totalItems: inventory.filter(item => item.isActive !== false).length,
      activeVehicles: vehicles.filter(v => v.status === 'activo').length,
      pendingMovements: movements.filter(m => m.status === 'pendiente').length,
    };
  }, [inventory, vehicles, movements]);

  // ==================================================================================================
  // RENDERIZADO CONDICIONAL
  // ==================================================================================================
  // Si los datos están cargando, muestra spinner de carga
  if (dataLoading) {
    return (
      <div className="dashboard-container sap-theme">
        <div className="dashboard-header sap-theme">
          <div>
            <h1 className="dashboard-title sap-theme">Dashboard Operativo</h1>
            <p className="dashboard-subtitle sap-theme">Cargando datos en tiempo real...</p>
          </div>
        </div>
        <div className="dashboard-loading sap-theme">
          <div className="loading-spinner sap-theme"></div>
          <span>Cargando información...</span>
        </div>
      </div>
    );
  }

  // Si ocurre un error al cargar datos, muestra banner de error y botón de reintento
  if (dataError) {
    return (
      <div className="dashboard-container sap-theme">
        <div className="dashboard-header sap-theme">
          <div>
            <h1 className="dashboard-title sap-theme">Dashboard Operativo</h1>
          </div>
        </div>
        <div className="error-banner sap-theme">
          <div>
            <strong>Error al cargar datos:</strong> {dataError}
          </div>
          <button 
            className="btn btn-primary sap-theme" 
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ==================================================================================================
  // RENDERIZADO PRINCIPAL
  // ==================================================================================================
  /**
   * Render principal del dashboard:
   * - Header con título y acciones
   * - Grid de estadísticas generales
   * - Cards de navegación a módulos principales
   * - Footer con resumen de totales y timestamp de actualización
   */
  return (
    <div className="dashboard-container sap-theme">
      {/* Header del Dashboard */}
      <div className="dashboard-header sap-theme">
        <div>
          <h1 className="dashboard-title sap-theme">Dashboard Operativo</h1>
          <p className="dashboard-subtitle sap-theme">
            Centro de control - Gestión integral de combustibles y maquinaria
          </p>
        </div>
        <div className="dashboard-table-actions sap-theme">
          <button className="btn btn-secondary sap-theme">
            📊 Exportar
          </button>
          <button className="btn btn-primary sap-theme" onClick={() => window.location.reload()}>
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="stats-grid sap-theme">
        {/* Card: Combustible Total */}
        <div className="stat-card sap-theme">
          <div className="stat-card-header sap-theme">
            <h3 className="stat-card-title sap-theme">Combustible Total</h3>
            <div className="stat-card-icon sap-theme">🛢️</div>
          </div>
          <div className="stat-card-value sap-theme">{formatNumber(generalStats.totalFuel)}</div>
          <div className={`stat-card-change sap-theme ${generalStats.totalFuel > 1000 ? 'positive' : 'negative'}`}>
            {generalStats.totalFuel > 1000 ? 'Suficiente' : 'Revisar stock'} galones
          </div>
        </div>

        {/* Card: Valor Inventario */}
        <div className="stat-card sap-theme success">
          <div className="stat-card-header sap-theme">
            <h3 className="stat-card-title sap-theme">Valor Inventario</h3>
            <div className="stat-card-icon sap-theme">💰</div>
          </div>
          <div className="stat-card-value sap-theme">{formatCurrency(generalStats.totalValue)}</div>
          <div className="stat-card-change sap-theme positive">
            Activo - {generalStats.totalItems} productos
          </div>
        </div>

        {/* Card: Vehículos Activos */}
        <div className="stat-card sap-theme">
          <div className="stat-card-header sap-theme">
            <h3 className="stat-card-title sap-theme">Vehículos Activos</h3>
            <div className="stat-card-icon sap-theme">🚜</div>
          </div>
          <div className="stat-card-value sap-theme">{generalStats.activeVehicles}</div>
          <div className={`stat-card-change sap-theme ${generalStats.activeVehicles > 0 ? 'positive' : 'negative'}`}>
            {generalStats.activeVehicles > 0 ? 'Operativos' : 'Sin actividad'}
          </div>
        </div>

        {/* Card: Alertas de Stock */}
        <div className={`stat-card sap-theme ${generalStats.lowStockAlerts > 0 ? 'error' : 'success'}`}>
          <div className="stat-card-header sap-theme">
            <h3 className="stat-card-title sap-theme">Alertas de Stock</h3>
            <div className="stat-card-icon sap-theme">⚠️</div>
          </div>
          <div className="stat-card-value sap-theme">{generalStats.lowStockAlerts}</div>
          <div className={`stat-card-change sap-theme ${generalStats.lowStockAlerts === 0 ? 'positive' : 'negative'}`}>
            {generalStats.lowStockAlerts === 0 ? 'Todo normal' : 'Requiere atención'}
          </div>
        </div>
      </div>

      {/* Cards de Navegación Principal */}
      <div className="dashboard-table-container sap-theme">
        <div className="dashboard-table-header sap-theme">
          <h2 className="dashboard-table-title sap-theme">Módulos del Sistema</h2>
          <p style={{ 
            color: 'var(--sap-text-secondary)', 
            margin: 'var(--sap-spacing-xs) 0 0 0',
            fontSize: '0.875rem'
          }}>
            Haz clic en cualquier módulo para acceder a su gestión completa
          </p>
        </div>
        
        <div className="navigation-cards-grid sap-theme">
          {visibleCards.map((card) => (
            <div
              key={card.id}
              className={`navigation-card sap-theme ${card.color}`}
              onClick={() => handleCardClick(card)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(card)}
            >
              <div className="navigation-card-header sap-theme">
                <div className="navigation-card-icon sap-theme">{card.icon}</div>
                <div className="navigation-card-title sap-theme">{card.title}</div>
              </div>
              
              <div className="navigation-card-description sap-theme">
                {card.description}
              </div>
              
              <div className="navigation-card-stats sap-theme">
                <div className="navigation-card-stat-primary sap-theme">
                  <span className="navigation-card-stat-value sap-theme">{card.stats.primary}</span>
                  <span className="navigation-card-stat-label sap-theme">{card.stats.primaryLabel}</span>
                </div>
                <div className="navigation-card-stat-secondary sap-theme">
                  <span className="navigation-card-stat-value sap-theme">{card.stats.secondary}</span>
                  <span className="navigation-card-stat-label sap-theme">{card.stats.secondaryLabel}</span>
                </div>
              </div>
              
              <div className="navigation-card-action sap-theme">
                <span>Ir a {card.title} →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer con estadísticas y timestamp de actualización */}
      <div style={{ 
        marginTop: 'var(--sap-spacing-xl)', 
        padding: 'var(--sap-spacing-lg)',
        background: 'var(--sap-neutral-100)',
        border: '1px solid var(--sap-neutral-300)',
        borderRadius: 'var(--sap-border-radius-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--sap-spacing-md)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--sap-spacing-lg)', flexWrap: 'wrap' }}>
          <span><strong>{inventory.length}</strong> productos en inventario</span>
          <span><strong>{vehicles.length}</strong> vehículos registrados</span>
          <span><strong>{movements.length}</strong> movimientos totales</span>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--sap-text-secondary)' }}>
          Última actualización: {new Date().toLocaleString('es-CO')}
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
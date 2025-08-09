/**
 * VehiclesMain - Componente principal del módulo de vehículos
 * Ahora incluye pestañas para gestionar vehículos y categorías por separado
 */

import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { 
  subscribeToVehicles, 
  getVehiclesStats,
  VEHICLE_STATUS,
  FUEL_COMPATIBILITY 
} from '../../services/vehiclesService';

// Componentes de la pestaña Vehículos
import VehiclesStats from './VehiclesStats';
import VehiclesFilters from './VehiclesFilters';
import VehiclesList from './VehiclesList';
// Lazy load de modales pesados para dividir bundle
const VehicleFormSmart = lazy(() => import('./VehicleFormSmart')); // ✅ VERSIÓN MÁS RECIENTE (6 Aug)
const MaintenanceModal = lazy(() => import('./MaintenanceModal'));

// Componentes de la pestaña Categorías
const VehicleCategoriesManager = lazy(() => import('./VehicleCategoriesManager'));

// PageLayout
import { PageLayout } from '../shared';

import './Vehicles.css';

const VehiclesMain = () => {
  // Estado para manejo de pestañas
  const [activeTab, setActiveTab] = useState('vehicles'); // 'vehicles' | 'categories'
  // Context y estado
  const { user, userProfile } = useCombustibles();
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [filters, setFilters] = useState({
    type: '',           // Tipo de vehículo
    status: '',         // Estado
    fuelType: '',       // Tipo de combustible
    location: '',       // Ubicación actual
    maintenance: 'all'  // Filtro mantenimiento
  });

  // Estado de vista
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'

  // Función estabilizada para manejar la suscripción con filtros
  const handleVehiclesSubscription = useCallback((callback) => {
    return subscribeToVehicles(callback, filters);
  }, [filters]);

  // Función estabilizada para cargar estadísticas
  const loadVehiclesStats = useCallback(async () => {
    try {
      const statsData = await getVehiclesStats(filters);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }, [filters]);

  // Suscripción a vehículos en tiempo real
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const unsubscribe = handleVehiclesSubscription((vehiclesData, error) => {
      if (error) {
        console.error('Error en suscripción de vehículos:', error);
        setError('Error al cargar vehículos');
        setLoading(false);
        return;
      }

      setVehicles(vehiclesData);
      setError(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, handleVehiclesSubscription]);

  // Cargar estadísticas
  useEffect(() => {
    if (user) {
      loadVehiclesStats();
    }
  }, [user, vehicles, loadVehiclesStats]);

  // Filtrar vehículos por búsqueda
  const filteredVehicles = useMemo(() => vehicles.filter(vehicle => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.vehicleId?.toLowerCase().includes(searchLower) ||
      vehicle.name?.toLowerCase().includes(searchLower) ||
      vehicle.type?.toLowerCase().includes(searchLower) ||
      vehicle.brand?.toLowerCase().includes(searchLower) ||
      vehicle.model?.toLowerCase().includes(searchLower) ||
      vehicle.currentLocation?.toLowerCase().includes(searchLower) ||
      vehicle.description?.toLowerCase().includes(searchLower)
    );
  }), [vehicles, searchTerm]);

  // Manejadores de eventos
  const handleCreateVehicle = useCallback(() => {
    setSelectedVehicle(null);
    setModalMode('create');
    setShowModal(true);
  }, []);

  const handleEditVehicle = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('edit');
    setShowModal(true);
  }, []);

  const handleViewVehicle = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('view');
    setShowModal(true);
  }, []);

  const handleMaintenanceVehicle = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setShowMaintenanceModal(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setShowMaintenanceModal(false);
    setSelectedVehicle(null);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      type: '',
      status: '',
      fuelType: '',
      location: '',
      maintenance: 'all'
    });
    setSearchTerm('');
  }, []);

  // Permisos del usuario
  const canCreateVehicle = userProfile?.role === 'admin' || userProfile?.role === 'contador' || userProfile?.role === 'cliente';
  const canEditVehicle = userProfile?.role === 'admin';
  const canManageVehicle = userProfile?.role === 'admin' || userProfile?.role === 'contador';

  // Componentes para PageLayout
  const headerActions = useMemo(() => (
    <div className="header-actions">
      {/* Navegación por pestañas */}
      <div className="tabs-navigation" style={{ marginRight: '20px' }}>
        <button 
          className={`tab-btn ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          🚜 Vehículos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          🏷️ Categorías
        </button>
      </div>
      
      {/* Botón crear vehículo solo para tab vehículos */}
      {activeTab === 'vehicles' && canCreateVehicle && (
        <button 
          className="btn-create-vehicle"
          onClick={handleCreateVehicle}
        >
          ➕ Nuevo Vehículo
        </button>
      )}
    </div>
  ), [activeTab, canCreateVehicle, handleCreateVehicle]);

  const statsComponent = useMemo(() => activeTab === 'vehicles' && stats ? (
    <VehiclesStats 
      stats={stats}
      filters={filters}
    />
  ) : null, [activeTab, stats, filters]);

  const filtersComponent = useMemo(() => activeTab === 'vehicles' ? (
    <VehiclesFilters
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      totalResults={filteredVehicles.length}
    />
  ) : null, [activeTab, filters, handleFilterChange, handleClearFilters, searchTerm, viewMode, filteredVehicles.length]);

  const mainContent = (
    <>
      {/* Contenido según pestaña activa */}
      {activeTab === 'vehicles' && (
        <>
          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Error al cargar vehículos</h3>
              <p>{error}</p>
              <button 
                className="btn-retry"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Lista de vehículos */}
          {!error && (filteredVehicles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚜</div>
              <h3>
                {vehicles.length === 0 
                  ? 'No hay vehículos registrados'
                  : 'No se encontraron vehículos'
                }
              </h3>
              <p>
                {vehicles.length === 0 
                  ? 'Comienza registrando tu primer vehículo o maquinaria forestal'
                  : 'Intenta ajustar los filtros de búsqueda'
                }
              </p>
              {vehicles.length === 0 && canCreateVehicle && (
                <button 
                  className="btn-create-first"
                  onClick={handleCreateVehicle}
                >
                  ➕ Registrar Primer Vehículo
                </button>
              )}
            </div>
          ) : (
            <VehiclesList
              vehicles={filteredVehicles}
              viewMode={viewMode}
              onEdit={canEditVehicle ? handleEditVehicle : null}
              onView={handleViewVehicle}
              onMaintenance={canManageVehicle ? handleMaintenanceVehicle : null}
              userRole={user?.role}
            />
          ))}
        </>
      )}

      {activeTab === 'categories' && (
        <div className="categories-tab-content">
          <div className="tab-description">
            <h3>🏷️ Gestión de Categorías de Vehículos</h3>
            <p>Crea y administra las categorías que clasifican tus vehículos y maquinaria forestal</p>
          </div>
          
          <Suspense
            fallback={
              <div className="loading-container">
                <div className="loader">
                  <div className="spinner"></div>
                  <p>Cargando categorías...</p>
                </div>
              </div>
            }
          >
            <VehicleCategoriesManager
              embedded={true} // Indicar que está embebido, no es modal
              onClose={null} // No necesita close cuando está embebido
              onCategoryCreated={() => {
                // Refrescar datos si es necesario
              }}
            />
          </Suspense>
        </div>
      )}

      {/* Modales que se mantienen globales */}
      {showModal && (
        <Suspense
          fallback={
            <div className="loading-container">
              <div className="loader">
                <div className="spinner"></div>
                <p>Cargando formulario...</p>
              </div>
            </div>
          }
        >
          <VehicleFormSmart
            isOpen={showModal}
            onClose={handleModalClose}
            vehicle={modalMode === 'edit' ? selectedVehicle : null}
            onSuccess={(vehicleData) => {
              console.log('✅ Vehículo guardado:', vehicleData);
              handleModalClose();
            }}
          />
        </Suspense>
      )}

      {showMaintenanceModal && (
        <Suspense
          fallback={
            <div className="loading-container">
              <div className="loader">
                <div className="spinner"></div>
                <p>Cargando mantenimiento...</p>
              </div>
            </div>
          }
        >
          <MaintenanceModal
            isOpen={showMaintenanceModal}
            onClose={handleModalClose}
            vehicle={selectedVehicle}
            onSuccess={() => {
              handleModalClose();
              // Los datos se actualizan automáticamente por la suscripción
            }}
          />
        </Suspense>
      )}
    </>
  );

  return (
    <PageLayout
      title="🚜 Gestión de Vehículos"
      subtitle="Administra la maquinaria y vehículos forestales"
      actions={headerActions}
      stats={statsComponent}
      filters={filtersComponent}
      loading={loading}
      showStats={activeTab === 'vehicles' && !!stats}
      showFilters={activeTab === 'vehicles'}
    >
      {mainContent}
    </PageLayout>
  );
};

export default VehiclesMain;
/**
 * VehiclesMain - Componente principal del módulo de vehículos
 * Ahora incluye pestañas para gestionar vehículos y categorías por separado
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import VehicleWizard from './VehicleWizard';
import MaintenanceModal from './MaintenanceModal';

// Componentes de la pestaña Categorías
import VehicleCategoriesManager from './VehicleCategoriesManager';

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
  const filteredVehicles = vehicles.filter(vehicle => {
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
  });

  // Manejadores de eventos
  const handleCreateVehicle = () => {
    setSelectedVehicle(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalMode('view');
    setShowModal(true);
  };

  const handleMaintenanceVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowMaintenanceModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowMaintenanceModal(false);
    setSelectedVehicle(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      status: '',
      fuelType: '',
      location: '',
      maintenance: 'all'
    });
    setSearchTerm('');
  };

  // Permisos del usuario
  const canCreateVehicle = userProfile?.role === 'admin' || userProfile?.role === 'contador' || userProfile?.role === 'cliente';
  const canEditVehicle = userProfile?.role === 'admin';
  const canManageVehicle = userProfile?.role === 'admin' || userProfile?.role === 'contador';

  if (loading) {
    return (
      <div className="vehicles-main">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vehicles-main">
        <div className="error-container">
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
      </div>
    );
  }

  return (
    <div className="vehicles-main">
      {/* Header con pestañas */}
      <div className="vehicles-header">
        <div className="header-title">
          <h2>🚜 Gestión de Vehículos</h2>
          <p>Administra la maquinaria y vehículos forestales</p>
        </div>
        
        {/* Navegación por pestañas */}
        <div className="tabs-navigation">
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
      </div>

      {/* Contenido según pestaña activa */}
      {activeTab === 'vehicles' && (
        <VehiclesTabContent 
          vehicles={vehicles}
          stats={stats}
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          filteredVehicles={filteredVehicles}
          loading={loading}
          error={error}
          canCreateVehicle={canCreateVehicle}
          canEditVehicle={canEditVehicle}
          canManageVehicle={canManageVehicle}
          user={user}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSearchChange={setSearchTerm}
          onViewModeChange={setViewMode}
          onCreateVehicle={handleCreateVehicle}
          onEditVehicle={handleEditVehicle}
          onViewVehicle={handleViewVehicle}
          onMaintenanceVehicle={handleMaintenanceVehicle}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesTabContent />
      )}

      {/* Modales que se mantienen globales */}
      {showModal && (
        <VehicleWizard
          isOpen={showModal}
          onClose={handleModalClose}
          vehicle={modalMode === 'edit' ? selectedVehicle : null}
          onSuccess={(vehicleData) => {
            console.log('✅ Vehículo guardado:', vehicleData);
            handleModalClose();
          }}
        />
      )}

      {showMaintenanceModal && (
        <MaintenanceModal
          isOpen={showMaintenanceModal}
          onClose={handleModalClose}
          vehicle={selectedVehicle}
          onSuccess={() => {
            handleModalClose();
            // Los datos se actualizan automáticamente por la suscripción
          }}
        />
      )}
    </div>
  );
};

// Componente para el contenido de la pestaña Vehículos
const VehiclesTabContent = ({ 
  vehicles, 
  stats, 
  filters, 
  searchTerm, 
  viewMode,
  filteredVehicles,
  loading,
  error,
  canCreateVehicle,
  canEditVehicle,
  canManageVehicle,
  user,
  onFilterChange,
  onClearFilters,
  onSearchChange,
  onViewModeChange,
  onCreateVehicle,
  onEditVehicle,
  onViewVehicle,
  onMaintenanceVehicle
}) => {

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Cargando vehículos...</p>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <>
      {/* Botón crear vehículo */}
      {canCreateVehicle && (
        <div className="tab-actions">
          <button 
            className="btn-create-vehicle"
            onClick={onCreateVehicle}
          >
            ➕ Nuevo Vehículo
          </button>
        </div>
      )}

      {/* Estadísticas */}
      {stats && (
        <VehiclesStats 
          stats={stats}
          filters={filters}
        />
      )}

      {/* Filtros y búsqueda */}
      <VehiclesFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        totalResults={filteredVehicles.length}
      />

      {/* Lista de vehículos */}
      {filteredVehicles.length === 0 ? (
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
              onClick={onCreateVehicle}
            >
              ➕ Registrar Primer Vehículo
            </button>
          )}
        </div>
      ) : (
        <VehiclesList
          vehicles={filteredVehicles}
          viewMode={viewMode}
          onEdit={canEditVehicle ? onEditVehicle : null}
          onView={onViewVehicle}
          onMaintenance={canManageVehicle ? onMaintenanceVehicle : null}
          userRole={user?.role}
        />
      )}
    </>
  );
};

// Componente para el contenido de la pestaña Categorías
const CategoriesTabContent = () => {
  return (
    <div className="categories-tab-content">
      <div className="tab-description">
        <h3>🏷️ Gestión de Categorías de Vehículos</h3>
        <p>Crea y administra las categorías que clasifican tus vehículos y maquinaria forestal</p>
      </div>
      
      <VehicleCategoriesManager
        embedded={true} // Indicar que está embebido, no es modal
        onClose={null} // No necesita close cuando está embebido
        onCategoryCreated={() => {
          // Refrescar datos si es necesario
        }}
      />
    </div>
  );
};

export default VehiclesMain;
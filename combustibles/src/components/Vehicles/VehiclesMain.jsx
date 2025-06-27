/**
 * VehiclesMain - Componente principal del módulo de vehículos
 * Gestiona la visualización y filtrado de vehículos forestales
 */

import React, { useState, useEffect, useContext } from 'react';
import { CombustiblesContext } from '../../contexts/CombustiblesContext';
import { 
  subscribeToVehicles, 
  getVehiclesStats,
  VEHICLE_TYPES,
  VEHICLE_STATUS,
  FUEL_COMPATIBILITY 
} from '../../services/vehiclesService';
import VehiclesStats from './VehiclesStats';
import VehiclesFilters from './VehiclesFilters';
import VehiclesList from './VehiclesList';
import VehicleModal from './VehicleModal';
import MaintenanceModal from './MaintenanceModal';
import './Vehicles.css';

const VehiclesMain = () => {
  // Context y estado
  const { user } = useContext(CombustiblesContext);
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

  // Suscripción a vehículos en tiempo real
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const unsubscribe = subscribeToVehicles(
      (vehiclesData, error) => {
        if (error) {
          console.error('Error en suscripción de vehículos:', error);
          setError('Error al cargar vehículos');
          setLoading(false);
          return;
        }

        setVehicles(vehiclesData);
        setError(null);
        setLoading(false);
      },
      filters // Aplicar filtros en tiempo real
    );

    return () => unsubscribe();
  }, [user, filters]);

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getVehiclesStats(filters);
        setStats(statsData);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user, vehicles, filters]);

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
  const canCreateVehicle = user?.role === 'admin' || user?.role === 'contador';
  const canEditVehicle = user?.role === 'admin';
  const canManageVehicle = user?.role === 'admin' || user?.role === 'contador';

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
      {/* Header */}
      <div className="vehicles-header">
        <div className="header-title">
          <h2>🚜 Gestión de Vehículos</h2>
          <p>Administra la maquinaria y vehículos forestales</p>
        </div>
        
        {canCreateVehicle && (
          <button 
            className="btn-create-vehicle"
            onClick={handleCreateVehicle}
          >
            ➕ Nuevo Vehículo
          </button>
        )}
      </div>

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
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
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
      )}

      {/* Modal Vehículo */}
      {showModal && (
        <VehicleModal
          isOpen={showModal}
          onClose={handleModalClose}
          vehicle={selectedVehicle}
          mode={modalMode}
          onSuccess={() => {
            handleModalClose();
            // Los datos se actualizan automáticamente por la suscripción
          }}
        />
      )}

      {/* Modal Mantenimiento */}
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

export default VehiclesMain;
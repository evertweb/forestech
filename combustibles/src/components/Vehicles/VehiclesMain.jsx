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
  FUEL_COMPATIBILITY,
} from '../../services/vehiclesService';

// Componentes de la pestaña Vehículos
import VehiclesStats from './VehiclesStats';
import VehiclesFilters from './VehiclesFilters';
import VehiclesList from './VehiclesList';
// Lazy load de modales pesados para dividir bundle
const VehicleFormCorporate = lazy(() => import('./VehicleFormCorporate')); // ✅ CORPORATE MODERN FORM
const MaintenanceModal = lazy(() => import('./MaintenanceModal'));

// Componentes de la pestaña Categorías
const VehicleCategoriesManager = lazy(() => import('./VehicleCategoriesManager'));

// PageLayout
import { PageLayout } from '../shared';

import './Vehicles.css';
import '../../styles/sap-vehicles.css';
import { openVehicleWizardPopup } from '../Popups/PopupManager';
import { POPUP_EVENTS } from '../../services/popupCommunication';

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
    type: '', // Tipo de vehículo
    status: '', // Estado
    fuelType: '', // Tipo de combustible
    location: '', // Ubicación actual
    maintenance: 'all', // Filtro mantenimiento
  });

  // Estado de vista
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [openingPopup, setOpeningPopup] = useState(false);
  const [popupError, setPopupError] = useState(null);

  // Función estabilizada para manejar la suscripción con filtros
  const handleVehiclesSubscription = useCallback(
    (callback) => {
      return subscribeToVehicles(callback, filters);
    },
    [filters]
  );

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
  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((vehicle) => {
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
      }),
    [vehicles, searchTerm]
  );

  // Manejadores de eventos
  const handleCreateVehicle = useCallback(() => {
    // Abrir versión popup con contexto necesario
    setPopupError(null);
    setOpeningPopup(true);
    const initialData = {
      user,
      inventory: [],
      vehicles,
      suppliers: [],
      theme: 'sap-fiori',
    };

    const { success, error } = openVehicleWizardPopup(initialData, ({ type, payload }) => {
      if (type === POPUP_EVENTS.WIZARD_SUCCESS) {
        // Actualizar estadísticas y dejar que suscripciones refresquen
        loadVehiclesStats();
      } else if (type === POPUP_EVENTS.WIZARD_ERROR) {
        console.error('Error en wizard popup:', payload);
        alert(`Error en asistente: ${payload?.message || 'desconocido'}`);
      }
    });

    setOpeningPopup(false);
    if (!success) {
      // Fallback: si bloqueado, abrir modal inline
      setPopupError(error || 'Popup bloqueado');
      setSelectedVehicle(null);
      setModalMode('create');
      setShowModal(true);
    }
  }, [user, vehicles, loadVehiclesStats]);

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
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      type: '',
      status: '',
      fuelType: '',
      location: '',
      maintenance: 'all',
    });
    setSearchTerm('');
  }, []);

  // Atajo de teclado Ctrl+Shift+V para abrir popup de vehículo
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handleCreateVehicle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleCreateVehicle]);

  // Permisos del usuario
  const canCreateVehicle =
    userProfile?.role === 'admin' ||
    userProfile?.role === 'contador' ||
    userProfile?.role === 'cliente';
  const canEditVehicle = userProfile?.role === 'admin';
  const canManageVehicle = userProfile?.role === 'admin' || userProfile?.role === 'contador';

  // Componentes para PageLayout
  const headerActions = useMemo(
    () => (
      <div className="header-actions sap-theme">
        {/* Navegación por pestañas */}
        <div className="tabs-navigation sap-theme">
          <button
            className={`tab-btn sap-theme ${activeTab === 'vehicles' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            🚜 Vehículos
          </button>
          <button
            className={`tab-btn sap-theme ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            🏷️ Categorías
          </button>
        </div>

        {/* Botón crear vehículo solo para tab vehículos */}
        {activeTab === 'vehicles' && canCreateVehicle && (
          <div className="create-vehicle-options sap-theme">
            <button className="btn-create-vehicle sap-theme primary" onClick={handleCreateVehicle}>
              ➕ Nuevo Vehículo
            </button>
            {openingPopup && (
              <span className="opening-status" style={{ marginLeft: 12 }}>
                Abriendo formulario...
              </span>
            )}
          </div>
        )}
      </div>
    ),
    [activeTab, canCreateVehicle, handleCreateVehicle, openingPopup]
  );

  const statsComponent = useMemo(
    () =>
      activeTab === 'vehicles' && stats ? <VehiclesStats stats={stats} filters={filters} /> : null,
    [activeTab, stats, filters]
  );

  const filtersComponent = useMemo(
    () =>
      activeTab === 'vehicles' ? (
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
      ) : null,
    [
      activeTab,
      filters,
      handleFilterChange,
      handleClearFilters,
      searchTerm,
      viewMode,
      filteredVehicles.length,
    ]
  );

  const mainContent = (
    <>
      {/* Contenido según pestaña activa */}
      {activeTab === 'vehicles' && (
        <>
          {error && (
            <div className="error-state sap-theme">
              <div className="error-icon sap-theme">⚠️</div>
              <h3>Error al cargar vehículos</h3>
              <p>{error}</p>
              <button className="btn-retry sap-theme" onClick={() => window.location.reload()}>
                Reintentar
              </button>
            </div>
          )}

          {/* Lista de vehículos */}
          {!error &&
            (filteredVehicles.length === 0 ? (
              <div className="empty-state sap-theme">
                <div className="empty-icon sap-theme">🚜</div>
                <h3>
                  {vehicles.length === 0
                    ? 'No hay vehículos registrados'
                    : 'No se encontraron vehículos'}
                </h3>
                <p>
                  {vehicles.length === 0
                    ? 'Comienza registrando tu primer vehículo o maquinaria forestal'
                    : 'Intenta ajustar los filtros de búsqueda'}
                </p>
                {vehicles.length === 0 && canCreateVehicle && (
                  <button className="btn-create-first sap-theme" onClick={handleCreateVehicle}>
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

          {/* Estado de error de popup y botón de reintento */}
          {popupError && (
            <div className="popup-error sap-theme" style={{ marginTop: 16 }}>
              <p>
                El navegador bloqueó la ventana emergente. Permite popups para este sitio o usa el
                formulario integrado.
              </p>
              <button className="sap-theme" onClick={() => setShowModal(true)}>
                Abrir formulario integrado
              </button>
              <button
                className="sap-theme"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  setPopupError(null);
                  handleCreateVehicle();
                }}
              >
                Reintentar popup
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <div className="categories-tab-content sap-theme">
          <div className="tab-description sap-theme">
            <h3>🏷️ Gestión de Categorías de Vehículos</h3>
            <p>
              Crea y administra las categorías que clasifican tus vehículos y maquinaria forestal
            </p>
          </div>

          <Suspense
            fallback={
              <div className="loading-container sap-theme">
                <div className="loader sap-theme">
                  <div className="spinner sap-theme"></div>
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
            <div className="loading-container sap-theme">
              <div className="loader sap-theme">
                <div className="spinner sap-theme"></div>
                <p>Cargando formulario...</p>
              </div>
            </div>
          }
        >
          <VehicleFormCorporate
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
            <div className="loading-container sap-theme">
              <div className="loader sap-theme">
                <div className="spinner sap-theme"></div>
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

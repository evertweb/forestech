/**
 * MaintenanceMain - Componente principal del módulo de mantenimiento
 * Gestiona cambios de aceite, filtros y baterías con integración horómetro tractores
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
// maintenanceService se importa estáticamente aquí (eliminar dynamic import)
import {
  subscribeToMaintenance,
  getMaintenanceStats,
  deleteMaintenanceRecord,
  MAINTENANCE_TYPES,
  MAINTENANCE_STATUS,
} from '../../services/FirebaseMaintenanceService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import MaintenanceStats from './MaintenanceStats';
import MaintenanceFilters from './MaintenanceFilters';
import MaintenanceList from './MaintenanceList';
import MaintenanceModal from './MaintenanceModal';
import { PageLayout } from '../shared';
import './MaintenanceMain-SAP.css';

const MaintenanceMain = () => {
  // Context y estado
  const { user, userProfile } = useCombustibles();

  // Hook para progreso transparente de Firebase
  const { executeWithProgress } = useFirebaseProgressContext();
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [filters, setFilters] = useState({
    type: '', // Tipo de mantenimiento
    status: '', // Estado
    vehicleId: '', // Vehículo específico
    dateFrom: '', // Fecha desde
    dateTo: '', // Fecha hasta
  });

  // Estado de vista
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'

  // Función estabilizada para manejar la suscripción con filtros
  const handleMaintenanceSubscription = useCallback(
    (callback) => {
      return subscribeToMaintenance(callback, filters);
    },
    [filters]
  );

  // Función estabilizada para cargar estadísticas
  const loadMaintenanceStats = useCallback(async () => {
    try {
      const statsData = await getMaintenanceStats(filters);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }, [filters]);

  // Suscripción a mantenimientos en tiempo real
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const unsubscribe = handleMaintenanceSubscription((maintenanceData, error) => {
      if (error) {
        console.error('Error en suscripción de mantenimientos:', error);
        setError('Error al cargar mantenimientos');
        setLoading(false);
        return;
      }

      setMaintenanceRecords(maintenanceData);
      setError(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, handleMaintenanceSubscription]);

  // Cargar estadísticas
  useEffect(() => {
    if (user) {
      loadMaintenanceStats();
    }
  }, [user, maintenanceRecords, loadMaintenanceStats]);

  // Filtrar mantenimientos por búsqueda
  const filteredMaintenance = maintenanceRecords.filter((record) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      record.vehicleName?.toLowerCase().includes(searchLower) ||
      record.type?.toLowerCase().includes(searchLower) ||
      record.status?.toLowerCase().includes(searchLower) ||
      record.notes?.toLowerCase().includes(searchLower)
    );
  });

  // Verificar permisos
  const canManageMaintenance = userProfile?.combustiblesPermissions?.canManageMaintenance || false;

  // Handlers
  const handleCreateMaintenance = () => {
    setSelectedMaintenance(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setModalMode('view');
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedMaintenance(null);
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setSelectedMaintenance(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      status: '',
      vehicleId: '',
      dateFrom: '',
      dateTo: '',
    });
    setSearchTerm('');
  };

  const handleDeleteMaintenance = async (maintenanceId) => {
    if (!canManageMaintenance) {
      alert('No tienes permisos para eliminar mantenimientos');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este mantenimiento?')) {
      try {
        const progressDescription = `Eliminando registro de mantenimiento ${maintenanceId}`;

        await executeWithProgress(
          'deleteMaintenance',
          progressDescription,
          () => deleteMaintenanceRecord(maintenanceId),
          { maintenanceId }
        );

        console.log('✅ Mantenimiento eliminado exitosamente');
      } catch (error) {
        console.error('❌ Error al eliminar mantenimiento:', error);
        alert('Error al eliminar mantenimiento: ' + error.message);
      }
    }
  };

  // Renderizado condicional
  if (!user) {
    return (
      <div className="maintenance-main sap-theme">
        <div className="auth-required sap-theme sap-message-info">
          <h2 className="sap-title">🔐 Autenticación Requerida</h2>
          <p className="sap-text">Debes iniciar sesión para acceder al módulo de mantenimiento.</p>
        </div>
      </div>
    );
  }

  // Componentes para PageLayout
  const headerActions = canManageMaintenance ? (
    <div className="header-actions sap-theme">
      <button
        className="btn-create-maintenance sap-theme sap-button sap-button-primary"
        onClick={handleCreateMaintenance}
      >
        ➕ Crear Mantenimiento
      </button>
    </div>
  ) : null;

  const statsComponent = stats ? <MaintenanceStats stats={stats} /> : null;

  const filtersComponent = (
    <MaintenanceFilters
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      totalResults={filteredMaintenance.length}
    />
  );

  const mainContent = (
    <>
      {/* Error */}
      {error && (
        <div className="error-banner sap-theme sap-message-error">
          <span>❌ {error}</span>
          <button
            className="sap-button sap-button-secondary"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Lista de mantenimientos */}
      {!loading && !error && (
        <>
          {filteredMaintenance.length > 0 ? (
            <MaintenanceList
              maintenanceRecords={filteredMaintenance}
              viewMode={viewMode}
              onEdit={canManageMaintenance ? handleEditMaintenance : null}
              onView={handleViewMaintenance}
              onDelete={canManageMaintenance ? handleDeleteMaintenance : null}
              userRole={userProfile?.role}
            />
          ) : (
            <div className="empty-state sap-theme">
              <div className="empty-icon sap-theme">🔧</div>
              <h3>No hay mantenimientos registrados</h3>
              <p>Comienza creando el primer mantenimiento para tu flota de vehículos.</p>
              {canManageMaintenance && (
                <button
                  className="sap-button sap-button-primary sap-mt-lg"
                  onClick={handleCreateMaintenance}
                >
                  ➕ Crear Primer Mantenimiento
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <MaintenanceModal
          isOpen={showModal}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          maintenance={selectedMaintenance}
          mode={modalMode}
          userRole={userProfile?.role}
        />
      )}
    </>
  );

  return (
    <PageLayout
      title="🔧 Mantenimiento de Vehículos"
      subtitle="Gestión de cambios de aceite, filtros y baterías"
      actions={headerActions}
      stats={statsComponent}
      filters={filtersComponent}
      loading={loading}
    >
      {mainContent}
    </PageLayout>
  );
};

export default MaintenanceMain;

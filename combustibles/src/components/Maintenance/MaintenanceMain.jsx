/**
 * MaintenanceMain - Componente principal del módulo de mantenimiento
 * Gestiona cambios de aceite, filtros y baterías con integración horómetro tractores
 */

import React, { useState, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
// maintenanceService se importa estáticamente aquí (eliminar dynamic import)
import { 
  subscribeToMaintenance, 
  getMaintenanceStats,
  deleteMaintenanceRecord,
  MAINTENANCE_TYPES,
  MAINTENANCE_STATUS
} from '../../services/maintenanceService';
import MaintenanceStats from './MaintenanceStats';
import MaintenanceFilters from './MaintenanceFilters';
import MaintenanceList from './MaintenanceList';
import MaintenanceModal from './MaintenanceModal';
import './Maintenance.css';

const MaintenanceMain = () => {
  // Context y estado
  const { user, userProfile } = useCombustibles();
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [filters, setFilters] = useState({
    type: '',           // Tipo de mantenimiento
    status: '',         // Estado
    vehicleId: '',      // Vehículo específico
    dateFrom: '',       // Fecha desde
    dateTo: ''          // Fecha hasta
  });

  // Estado de vista
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'

  // Suscripción a mantenimientos en tiempo real
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const unsubscribe = subscribeToMaintenance(
      (maintenanceData, error) => {
        if (error) {
          console.error('Error en suscripción de mantenimientos:', error);
          setError('Error al cargar mantenimientos');
          setLoading(false);
          return;
        }

        setMaintenanceRecords(maintenanceData);
        setError(null);
        setLoading(false);
      },
      filters // Aplicar filtros en tiempo real
    );

    return () => unsubscribe();
  }, [user, filters.type, filters.status, filters.vehicleId, filters.dateFrom, filters.dateTo]); // ⚠️ FIXED: Specific filter dependencies

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await getMaintenanceStats(filters);
        setStats(statsData);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user, maintenanceRecords, filters.type, filters.status, filters.vehicleId, filters.dateFrom, filters.dateTo]); // ⚠️ FIXED: Specific filter dependencies

  // Filtrar mantenimientos por búsqueda
  const filteredMaintenance = maintenanceRecords.filter(record => {
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
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      status: '',
      vehicleId: '',
      dateFrom: '',
      dateTo: ''
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
        // Usar la función importada estáticamente
        await deleteMaintenanceRecord(maintenanceId);
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
      <div className="maintenance-main">
        <div className="auth-required">
          <h2>🔐 Autenticación Requerida</h2>
          <p>Debes iniciar sesión para acceder al módulo de mantenimiento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="maintenance-main">
      {/* Header */}
      <div className="maintenance-header">
        <div className="header-title">
          <h2>🔧 Mantenimiento de Vehículos</h2>
          <p>Gestión de cambios de aceite, filtros y baterías</p>
        </div>
        <div className="header-actions">
          {canManageMaintenance && (
            <button 
              className="btn-create-maintenance"
              onClick={handleCreateMaintenance}
            >
              ➕ Crear Mantenimiento
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="maintenance-loading">
          <div className="loading-spinner"></div>
          <p>Cargando mantenimientos...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      )}

      {/* Estadísticas */}
      {stats && <MaintenanceStats stats={stats} />}

      {/* Filtros */}
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

      {/* Lista de mantenimientos */}
      {!loading && !error && (
        <MaintenanceList
          maintenanceRecords={filteredMaintenance}
          viewMode={viewMode}
          onEdit={canManageMaintenance ? handleEditMaintenance : null}
          onView={handleViewMaintenance}
          onDelete={canManageMaintenance ? handleDeleteMaintenance : null}
          userRole={userProfile?.role}
        />
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
    </div>
  );
};

export default MaintenanceMain;

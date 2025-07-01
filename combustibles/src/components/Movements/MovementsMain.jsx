/**
 * MovementsMain - Componente principal del módulo de movimientos
 * Gestiona la visualización y filtrado de movimientos de combustibles
 */

import React, { useState, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { 
  subscribeToMovements, 
  getMovementsStats,
  approveMovement,
  updateMovement,
  MOVEMENT_TYPES,
  MOVEMENT_STATUS 
} from '../../services/movementsService';
import MovementsStats from './MovementsStats';
import MovementsFilters from './MovementsFilters';
import MovementsList from './MovementsList';
import MovementModal from './MovementModal';
import MovementWizard from './MovementWizard';
import './Movements.css';

const MovementsMain = () => {
  // Context y estado
  const { user, userProfile, deleteMovement } = useCombustibles();
  const [movements, setMovements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [filters, setFilters] = useState({
    type: '',           // Tipo de movimiento
    status: '',         // Estado
    fuelType: '',       // Tipo de combustible
    vehicleId: '',      // Vehículo específico
    dateRange: 'all'    // Rango de fechas
  });

  // Estado de vista
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'

  // Suscripción a movimientos en tiempo real
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const unsubscribe = subscribeToMovements(
      (movementsData, error) => {
        if (error) {
          console.error('Error en suscripción de movimientos:', error);
          setError('Error al cargar movimientos');
          setLoading(false);
          return;
        }

        setMovements(movementsData);
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
        const statsData = await getMovementsStats(filters);
        setStats(statsData);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    };

    if (user) {
      loadStats();
    }
  }, [user, movements, filters]);

  // Filtrar movimientos por búsqueda
  const filteredMovements = movements.filter(movement => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      movement.fuelType?.toLowerCase().includes(searchLower) ||
      movement.type?.toLowerCase().includes(searchLower) ||
      movement.location?.toLowerCase().includes(searchLower) ||
      movement.vehicleId?.toLowerCase().includes(searchLower) ||
      movement.description?.toLowerCase().includes(searchLower) ||
      movement.reference?.toLowerCase().includes(searchLower)
    );
  });

  // Manejadores de eventos
  const handleCreateMovement = () => {
    setSelectedMovement(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleCreateMovementWizard = () => {
    setShowWizard(true);
  };

  const handleEditMovement = (movement) => {
    setSelectedMovement(movement);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewMovement = (movement) => {
    setSelectedMovement(movement);
    setModalMode('view');
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedMovement(null);
  };

  const handleWizardClose = () => {
    setShowWizard(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      status: '',
      fuelType: '',
      vehicleId: '',
      dateRange: 'all'
    });
    setSearchTerm('');
  };

  const handleApproveMovement = async (movementId) => {
    if (!window.confirm('¿Estás seguro de que quieres aprobar este movimiento? Esta acción actualizará el inventario.')) {
      return;
    }
    try {
      await approveMovement(movementId);
      alert('Movimiento aprobado y stock actualizado.');
    } catch (error) {
      console.error('Error al aprobar movimiento:', error);
      alert(`Error al aprobar movimiento: ${error.message}`);
    }
  };

  const handleRejectMovement = async (movementId) => {
    if (!window.confirm('¿Estás seguro de que quieres rechazar este movimiento?')) {
      return;
    }
    try {
      await updateMovement(movementId, { status: MOVEMENT_STATUS.CANCELADO });
      alert('Movimiento rechazado.');
    } catch (error) {
      console.error('Error al rechazar movimiento:', error);
      alert(`Error al rechazar movimiento: ${error.message}`);
    }
  };

  const handleDeleteMovement = async (movementId) => {
    try {
      const result = await deleteMovement(movementId);
      if (result.success) {
        alert('Movimiento eliminado exitosamente.');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      alert(`Error al eliminar movimiento: ${error.message}`);
    }
  };

  // Permisos del usuario
  const canCreateMovement = userProfile?.role === 'admin' || userProfile?.role === 'contador' || userProfile?.role === 'cliente';
  const canEditMovement = userProfile?.role === 'admin';

  if (loading) {
    return (
      <div className="movements-main">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando movimientos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movements-main">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error al cargar movimientos</h3>
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
    <div className="movements-main">
      {/* Header */}
      <div className="movements-header">
        <div className="header-title">
          <h2>📊 Movimientos de Combustibles</h2>
          <p>Gestiona entradas, salidas, transferencias y ajustes de inventario</p>
        </div>
        
        {canCreateMovement && (
          <div className="create-movement-options">
            <button 
              className="btn-create-movement primary"
              onClick={handleCreateMovementWizard}
            >
              🧙‍♂️ Asistente Guiado
            </button>
            <button 
              className="btn-create-movement secondary"
              onClick={handleCreateMovement}
            >
              📝 Formulario Clásico
            </button>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      {stats && (
        <MovementsStats 
          stats={stats}
          filters={filters}
        />
      )}

      {/* Filtros y búsqueda */}
      <MovementsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredMovements.length}
      />

      {/* Lista de movimientos */}
      {filteredMovements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>
            {movements.length === 0 
              ? 'No hay movimientos registrados'
              : 'No se encontraron movimientos'
            }
          </h3>
          <p>
            {movements.length === 0 
              ? 'Comienza creando tu primer movimiento de combustible'
              : 'Intenta ajustar los filtros de búsqueda'
            }
          </p>
          {movements.length === 0 && canCreateMovement && (
            <div className="create-first-options">
              <button 
                className="btn-create-first primary"
                onClick={handleCreateMovementWizard}
              >
                🧙‍♂️ Comenzar con Asistente
              </button>
              <button 
                className="btn-create-first secondary"
                onClick={handleCreateMovement}
              >
                📝 Usar Formulario Clásico
              </button>
            </div>
          )}
        </div>
      ) : (
        <MovementsList
          movements={filteredMovements}
          viewMode={viewMode}
          onEdit={canEditMovement ? handleEditMovement : null}
          onView={handleViewMovement}
          onApprove={handleApproveMovement}
          onReject={handleRejectMovement}
          onDelete={handleDeleteMovement} // Pasar la función de eliminar
          userRole={userProfile?.role} // Usar el rol del perfil
        />
      )}

      {/* Modal Clásico */}
      {showModal && (
        <MovementModal
          isOpen={showModal}
          onClose={handleModalClose}
          movement={selectedMovement}
          mode={modalMode}
          onSuccess={() => {
            handleModalClose();
            // Los datos se actualizan automáticamente por la suscripción
          }}
        />
      )}

      {/* Wizard Guiado */}
      {showWizard && (
        <MovementWizard
          isOpen={showWizard}
          onClose={handleWizardClose}
          onSuccess={() => {
            handleWizardClose();
            // Los datos se actualizan automáticamente por la suscripción
          }}
        />
      )}
    </div>
  );
};

export default MovementsMain;
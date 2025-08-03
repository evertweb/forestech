/**
 * MovementsMain - Componente principal del módulo de movimientos
 * Gestiona la visualización y filtrado de movimientos de combustibles
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import MovementWizard from './MovementWizard';
import './Movements.css';
import './MovementsMain-SAP.css';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  // Variables de estado limpias - solo wizard

  // Función estabilizada para manejar la suscripción con filtros
  const handleMovementsSubscription = useCallback((callback) => {
    return subscribeToMovements(callback, filters);
  }, [filters]);

  // Función estabilizada para cargar estadísticas
  const loadMovementsStats = useCallback(async () => {
    try {
      const statsData = await getMovementsStats(filters);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }, [filters]);

  // Suscripción a movimientos en tiempo real
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    const unsubscribe = handleMovementsSubscription((movementsData, error) => {
      if (error) {
        console.error('Error en suscripción de movimientos:', error);
        setError('Error al cargar movimientos');
        setLoading(false);
        return;
      }

      setMovements(movementsData);
      setError(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, handleMovementsSubscription]);

  // Cargar estadísticas
  useEffect(() => {
    if (user) {
      loadMovementsStats();
    }
  }, [user, movements, loadMovementsStats]);

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
    setShowWizard(true);
  };

  const handleViewMovement = (movement) => {
    // Vista de movimientos en modo lectura simplificado
    alert(`📋 Detalles del movimiento:\n\nTipo: ${movement.type}\nCombustible: ${movement.fuelType}\nCantidad: ${movement.quantity} gal\nFecha: ${new Date(movement.createdAt).toLocaleDateString('es-CO')}`);
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

  if (loading) {
    return (
      <div className="movements-main sap-theme">
        <div className="loading-container sap-theme">
          <div className="loading-spinner sap-theme"></div>
          <p>Cargando movimientos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movements-main sap-theme">
        <div className="error-container sap-theme">
          <div className="error-icon sap-theme">⚠️</div>
          <h3>Error al cargar movimientos</h3>
          <p>{error}</p>
          <button 
            className="btn-retry sap-theme"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movements-main sap-theme">
      {/* Header */}
      <div className="movements-header sap-theme">
        <div className="header-title sap-theme">
          <h2>📊 Movimientos de Combustibles</h2>
          <p>Gestiona entradas, salidas, transferencias y ajustes de inventario</p>
        </div>
        
        {canCreateMovement && (
          <div className="create-movement-options sap-theme">
            <button 
              className="btn-create-movement sap-theme primary"
              onClick={handleCreateMovement}
            >
              ➕ Nuevo Movimiento
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
        totalResults={filteredMovements.length}
      />

      {/* Lista de movimientos */}
      {filteredMovements.length === 0 ? (
        <div className="empty-state sap-theme">
          <div className="empty-icon sap-theme">📋</div>
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
            <div className="create-first-options sap-theme">
              <button 
                className="btn-create-first sap-theme primary"
                onClick={handleCreateMovement}
              >
                ➕ Crear Primer Movimiento
              </button>
            </div>
          )}
        </div>
      ) : (
        <MovementsList
          movements={filteredMovements}
          onEdit={null} // Edición eliminada - solo wizard
          onView={handleViewMovement}
          onApprove={handleApproveMovement}
          onReject={handleRejectMovement}
          onDelete={handleDeleteMovement}
          userRole={userProfile?.role}
        />
      )}

      {/* Wizard - Única Opción */}
      {showWizard && (
        <MovementWizard
          isOpen={showWizard}
          onClose={handleWizardClose}
          onSuccess={() => {
            handleWizardClose();
          }}
        />
      )}
    </div>
  );
};

export default MovementsMain;
/**
 * MovementsMain - Componente principal del módulo de movimientos
 * Gestiona la visualización y filtrado de movimientos de combustibles
 * 
 * MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
 * - Usa múltiples stores: Auth, Movements, Inventory, Vehicles
 * - Performance optimizada con selectores
 */

import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useAuthStore, useMovementsStore, useInventoryStore, useVehiclesStore } from '../../stores';
import {
  subscribeToMovements,
  getMovementsStats,
  approveMovement,
  updateMovement,
  MOVEMENT_TYPES,
  MOVEMENT_STATUS,
} from '../../services/FirebaseMovementsService';
import { useFirebaseProgressContext } from '../../contexts/FirebaseProgressContext';
import MovementsStats from './MovementsStats';
import MovementsFilters from './MovementsFilters';
import MovementsList from './MovementsList';
// Lazy load del wizard para reducir el bundle inicial
const MovementWizard = lazy(() => import('./MovementWizard'));
import { PageLayout, ShimmerLoader, ShimmerCardsGrid, ShimmerTable } from '../shared';
import './Movements.css';
import { openMovementWizardPopup } from '../Popups/PopupManager';
import { POPUP_EVENTS } from '../../services/popupCommunication';

const MovementsMain = () => {
  // 🏪 Zustand Stores - Selectores optimizados para evitar re-renders
  // Usar selectores individuales en lugar de array destructuring para evitar loops
  const user = useAuthStore(state => state.user);
  const hasPermission = useAuthStore(state => state.hasPermission);
  const deleteMovement = useMovementsStore(state => state.deleteMovement);
  const inventory = useInventoryStore(state => state.inventory);
  const vehicles = useVehiclesStore(state => state.vehicles);

  // Hook para progreso transparente de Firebase
  const { executeWithProgress } = useFirebaseProgressContext();
  const [movements, setMovements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de filtros
  const [filters, setFilters] = useState({
    type: '', // Tipo de movimiento
    status: '', // Estado
    fuelType: '', // Tipo de combustible
    vehicleId: '', // Vehículo específico
    dateRange: 'all', // Rango de fechas
  });

  // Estado de vista
  const [searchTerm, setSearchTerm] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [openingPopup, setOpeningPopup] = useState(false);
  const [popupError, setPopupError] = useState(null);
  // Nota: no necesitamos mantener una referencia al manager por ahora
  // Variables de estado limpias - solo wizard

  // Función estabilizada para manejar la suscripción con filtros
  const handleMovementsSubscription = useCallback(
    (callback) => {
      return subscribeToMovements(callback, filters);
    },
    [filters]
  );

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

  // Cargar estadísticas solo cuando cambian los filtros o el usuario
  // NO cuando cambian los movements (se actualizan en tiempo real por suscripción)
  useEffect(() => {
    if (user) {
      loadMovementsStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filters]);

  // Filtrar movimientos por búsqueda
  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
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
  }, [movements, searchTerm]);

  // Manejadores de eventos
  const handleCreateMovement = useCallback(() => {
    // Abrir versión popup con contexto necesario
    setPopupError(null);
    setOpeningPopup(true);
    const initialData = {
      user,
      inventory,
      vehicles,
      suppliers: [],
      theme: 'government',
    };

    const { success, error } = openMovementWizardPopup(initialData, ({ type, payload }) => {
      if (type === POPUP_EVENTS.WIZARD_SUCCESS) {
        // Actualizar estadísticas y dejar que suscripciones refresquen
        loadMovementsStats();
      } else if (type === POPUP_EVENTS.WIZARD_ERROR) {
        console.error('Error en wizard popup:', payload);
        alert(`Error en asistente: ${payload?.message || 'desconocido'}`);
      }
    });

    setOpeningPopup(false);
    if (!success) {
      // Fallback: si bloqueado, abrir modal inline
      setPopupError(error || 'Popup bloqueado');
      setShowWizard(true);
    }
  }, [user, inventory, vehicles, loadMovementsStats]);

  // Atajo de teclado Ctrl+Shift+N para abrir popup (debajo para evitar TDZ)
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateMovement();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleCreateMovement]);

  const handleViewMovement = useCallback((movement) => {
    // Vista de movimientos en modo lectura simplificado
    alert(
      `📋 Detalles del movimiento:\n\nTipo: ${movement.type}\nCombustible: ${movement.fuelType}\nCantidad: ${movement.quantity} gal\nFecha: ${new Date(movement.createdAt).toLocaleDateString('es-CO')}`
    );
  }, []);

  const handleWizardClose = useCallback(() => {
    setShowWizard(false);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      type: '',
      status: '',
      fuelType: '',
      vehicleId: '',
      dateRange: 'all',
    });
    setSearchTerm('');
  }, []);

  const handleApproveMovement = useCallback(async (movementId) => {
    if (
      !window.confirm(
        '¿Estás seguro de que quieres aprobar este movimiento? Esta acción actualizará el inventario.'
      )
    ) {
      return;
    }

    try {
      const progressDescription = `Aprobando movimiento ${movementId}`;

      await executeWithProgress(
        'updateMovement',
        progressDescription,
        () => approveMovement(movementId),
        { movementId, action: 'approve' }
      );

      console.log('✅ Movimiento aprobado y stock actualizado');
    } catch (error) {
      console.error('Error al aprobar movimiento:', error);
      alert(`Error al aprobar movimiento: ${error.message}`);
    }
  }, [executeWithProgress]);

  const handleRejectMovement = useCallback(async (movementId) => {
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
  }, []);

  const handleDeleteMovement = useCallback(async (movementId) => {
    if (
      !window.confirm(
        '¿Estás seguro de que quieres eliminar este movimiento? Esta acción revertirá cambios en el inventario.'
      )
    ) {
      return;
    }

    try {
      const progressDescription = `Eliminando movimiento ${movementId}`;

      const result = await executeWithProgress(
        'deleteMovement',
        progressDescription,
        () => deleteMovement(movementId),
        { movementId }
      );

      if (result.success) {
        console.log('✅ Movimiento eliminado exitosamente');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      alert(`Error al eliminar movimiento: ${error.message}`);
    }
  }, [deleteMovement, executeWithProgress]);

  // Permisos del usuario
  const canCreateMovement = hasPermission('canCreateMovements');

  // Componentes para PageLayout
  const headerActions = useMemo(() => {
    if (!canCreateMovement) return null;

    return (
      <div
        className="create-movement-options sap-theme"
        style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
      >
        <button className="btn-create-movement sap-theme primary" onClick={handleCreateMovement}>
          ➕ Nuevo Movimiento
        </button>
        {openingPopup && (
          <span className="opening-status" style={{ marginLeft: 12 }}>
            Abriendo formulario...
          </span>
        )}
      </div>
    );
  }, [canCreateMovement, handleCreateMovement, openingPopup]);

  const statsComponent = useMemo(() => {
    if (loading) {
      return (
        <ShimmerCardsGrid cards={4} columns={4} variant="stat" className="movements-cards-grid" />
      );
    }

    return stats ? <MovementsStats stats={stats} filters={filters} /> : null;
  }, [filters, loading, stats]);

  const filtersComponent = useMemo(() => {
    return (
      <MovementsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalResults={filteredMovements.length}
      />
    );
  }, [filters, handleClearFilters, handleFilterChange, filteredMovements, searchTerm]);

  const mainContent = useMemo(() => {
    const emptyState = (
      <div className="empty-state sap-theme">
        <div className="empty-icon sap-theme">📋</div>
        <h3>
          {movements.length === 0
            ? 'No hay movimientos registrados'
            : 'No se encontraron movimientos'}
        </h3>
        <p>
          {movements.length === 0
            ? 'Comienza creando tu primer movimiento de combustible'
            : 'Intenta ajustar los filtros de búsqueda'}
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
    );

    const loadingState = (
      <ShimmerTable
        rows={10}
        columns={6}
        title={false}
        actions={false}
        className="shimmer-movements-table"
      />
    );

    const listContent = (
      <MovementsList
        movements={filteredMovements}
        onEdit={null}
        onView={handleViewMovement}
        onApprove={handleApproveMovement}
        onReject={handleRejectMovement}
        onDelete={handleDeleteMovement}
      />
    );

    return (
      <>
        {error && (
          <div className="error-container sap-theme">
            <div className="error-icon sap-theme">⚠️</div>
            <h3>Error al cargar movimientos</h3>
            <p>{error}</p>
            <button className="btn-retry sap-theme" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        )}

        {!error &&
          (filteredMovements.length === 0 ? emptyState : loading ? loadingState : listContent)}

        {popupError && (
          <div className="popup-error sap-theme" style={{ marginTop: 16 }}>
            <p>
              El navegador bloqueó la ventana emergente. Permite popups para este sitio o usa el
              formulario integrado.
            </p>
            <button className="sap-theme" onClick={() => setShowWizard(true)}>
              Abrir formulario integrado
            </button>
            <button
              className="sap-theme"
              style={{ marginLeft: 8 }}
              onClick={() => {
                setPopupError(null);
                handleCreateMovement();
              }}
            >
              Reintentar popup
            </button>
          </div>
        )}

        {showWizard && (
          <Suspense
            fallback={
              <div className="loading-container sap-theme">
                <div className="loading-spinner sap-theme"></div>
                <p>Cargando asistente...</p>
              </div>
            }
          >
            <MovementWizard
              isOpen={showWizard}
              onClose={handleWizardClose}
              onSuccess={handleWizardClose}
              theme="government"
            />
          </Suspense>
        )}
      </>
    );
  }, [
    canCreateMovement,
    error,
    filteredMovements,
    handleApproveMovement,
    handleCreateMovement,
    handleDeleteMovement,
    handleRejectMovement,
    handleViewMovement,
    handleWizardClose,
    loading,
    movements,
    popupError,
    showWizard,
  ]);

  return (
    <>
      <PageLayout
        title="📊 Movimientos de Combustibles"
        subtitle="Gestiona entradas, salidas, transferencias y ajustes de inventario"
        actions={headerActions}
        stats={statsComponent}
        filters={filtersComponent}
        loading={loading}
      >
        {mainContent}
      </PageLayout>
    </>
  );
};

export default MovementsMain;

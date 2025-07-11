// combustibles/src/components/Examples/OptimizedMovementsPage.jsx
// Ejemplo práctico del sistema optimizado completo - NIVELES 2 Y 3
import React, { useCallback } from 'react';
import { usePageData } from '../../hooks/usePageData';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { withOptimization, useOptimizedCallbacks } from '../../hooks/useOptimizedComponents';
import OptimizedMovementsList from '../Optimized/OptimizedMovementsList';

// TODO: Separar componente de constantes/funciones para Fast Refresh
const OptimizedMovementsPage = () => {
  // ✅ NIVEL 2: Fetching por demanda - solo datos de movimientos
  const { movements, vehicles, inventory, loading, error } = usePageData('movements');

  // ✅ NIVEL 2: Operaciones CRUD optimizadas
  const { deleteMovement, loading: crudLoading } = useCombustibles();

  // ✅ NIVEL 3: Callbacks optimizados con React.memo
  const optimizedCallbacks = useOptimizedCallbacks({
    handleDelete: useCallback(async (movementId) => {
      console.log(`🗑️ Eliminando movimiento: ${movementId}`);
      const result = await deleteMovement(movementId);
      if (result.success) {
        console.log('✅ Movimiento eliminado exitosamente');
      } else {
        console.error('❌ Error:', result.error);
      }
    }, [deleteMovement]),

    handleEdit: useCallback((movementId) => {
      console.log(`✏️ Editando movimiento: ${movementId}`);
      // TODO: Implementar lógica de edición
    }, []),

    handleRefresh: useCallback(() => {
      console.log('🔄 Refrescando datos...');
      // Los datos se actualizarán automáticamente via suscripciones optimizadas
    }, [])
  });

  if (loading) {
    return (
      <div className="optimized-page">
        <div className="loading-state">
          <h2>🚀 Cargando con Sistema Optimizado</h2>
          <p>✅ Solo cargando datos necesarios para movimientos</p>
          <p>✅ Cache activo • Consultas limitadas • Suscripciones eficientes</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="optimized-page">
        <div className="error-state">
          <h2>❌ Error en Sistema Optimizado</h2>
          <p>{error}</p>
          <button onClick={optimizedCallbacks.handleRefresh}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="optimized-page">
      <header className="page-header">
        <h1>📊 Movimientos - Sistema Optimizado</h1>
        <div className="optimization-stats">
          <span className="stat">✅ Suscripciones: 3/3 necesarias</span>
          <span className="stat">✅ Cache: Activo</span>
          <span className="stat">✅ React.memo: Activo</span>
          <span className="stat">✅ Firestore: Consultas limitadas</span>
        </div>
      </header>

      <div className="content-grid">
        <section className="movements-section">
          <OptimizedMovementsList
            movements={movements}
            onDelete={optimizedCallbacks.handleDelete}
            onEdit={optimizedCallbacks.handleEdit}
            loading={crudLoading}
          />
        </section>

        <aside className="stats-sidebar">
          <div className="stat-card">
            <h3>📈 Estadísticas en Tiempo Real</h3>
            <p>Movimientos: {movements?.length || 0}</p>
            <p>Vehículos activos: {vehicles?.length || 0}</p>
            <p>Items inventario: {inventory?.length || 0}</p>
          </div>

          <div className="optimization-info">
            <h3>⚡ Optimizaciones Activas</h3>
            <ul>
              <li>✅ Fetching por demanda</li>
              <li>✅ React.memo en listas</li>
              <li>✅ Cache Firestore (5min)</li>
              <li>✅ Consultas limitadas (100 items)</li>
              <li>✅ Debounce (300ms)</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

// ✅ NIVEL 3: Exportar con React.memo optimización
export default withOptimization(OptimizedMovementsPage);

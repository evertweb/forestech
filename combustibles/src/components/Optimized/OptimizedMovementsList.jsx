// combustibles/src/components/Optimized/OptimizedMovementsList.jsx
// Ejemplo de componente optimizado con React.memo - NIVEL 3 OPTIMIZACIÓN
import React from 'react';
import { withOptimization, createCustomCompare, useArrayChanges } from '../../hooks/useOptimizedComponents';

// Componente individual de movimiento optimizado
const MovementItem = withOptimization(({ movement, onDelete, onEdit }) => {
  console.log(`Renderizando MovementItem: ${movement.id}`); // Para debug

  return (
    <div className="movement-item">
      <div className="movement-info">
        <h4>{movement.type}</h4>
        <p>Vehículo: {movement.vehicleId}</p>
        <p>Cantidad: {movement.quantity}L</p>
        <p>Fecha: {new Date(movement.date?.seconds * 1000).toLocaleDateString()}</p>
      </div>
      <div className="movement-actions">
        <button onClick={() => onEdit(movement.id)}>Editar</button>
        <button onClick={() => onDelete(movement.id)}>Eliminar</button>
      </div>
    </div>
  );
}, createCustomCompare(['movement.id', 'movement.quantity', 'movement.type']));

// Lista principal optimizada
const MovementsList = ({ movements, onDelete, onEdit, loading }) => {
  console.log('Renderizando MovementsList'); // Para debug

  const { items: optimizedMovements, isEmpty } = useArrayChanges(movements);

  if (loading) {
    return <div className="loading">Cargando movimientos...</div>;
  }

  if (isEmpty) {
    return <div className="empty-state">No hay movimientos registrados</div>;
  }

  return (
    <div className="movements-list">
      <h3>Movimientos ({optimizedMovements.length})</h3>
      {optimizedMovements.map(movement => (
        <MovementItem
          key={movement.id}
          movement={movement}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

// Exportar componente optimizado con comparación personalizada
const OptimizedMovementsList = withOptimization(MovementsList, (prevProps, nextProps) => {
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.movements?.length === nextProps.movements?.length &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onEdit === nextProps.onEdit
  );
});
OptimizedMovementsList.displayName = 'OptimizedMovementsList';
export default OptimizedMovementsList;

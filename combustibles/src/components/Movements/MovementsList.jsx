/**
 * MovementsList - Componente para mostrar la lista de movimientos
 * Soporta vista en tarjetas y tabla con acciones por permisos
 */

import React from 'react';
import MovementsCards from './MovementsCards';
import MovementsTable from './MovementsTable';

const MovementsList = ({
  movements,
  viewMode,
  onEdit,
  onView,
  onApprove,
  onReject,
  onDelete,
  userRole
}) => {
  if (viewMode === 'table') {
    return (
      <MovementsTable
        movements={movements}
        onEdit={onEdit}
        onView={onView}
        onApprove={onApprove}
        onReject={onReject}
        onDelete={onDelete}
        userRole={userRole}
      />
    );
  }

  return (
    <MovementsCards
      movements={movements}
      onEdit={onEdit}
      onView={onView}
      onApprove={onApprove}
      onReject={onReject}
      onDelete={onDelete}
      userRole={userRole}
    />
  );
};

export default MovementsList;
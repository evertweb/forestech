/**
 * MovementsList - Componente para mostrar la lista de movimientos
 * Vista única en tabla optimizada
 */

import React from 'react';
import MovementsTable from './MovementsTable';

const MovementsList = ({
  movements,
  onEdit,
  onView,
  onApprove,
  onReject,
  onDelete,
  userRole
}) => {
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
};

export default MovementsList;
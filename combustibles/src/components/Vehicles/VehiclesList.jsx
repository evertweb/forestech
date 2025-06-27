/**
 * VehiclesList - Componente para mostrar la lista de vehículos
 * Soporta vista en tarjetas y tabla con acciones por permisos
 */

import React from 'react';
import VehiclesCards from './VehiclesCards';
import VehiclesTable from './VehiclesTable';

const VehiclesList = ({
  vehicles,
  viewMode,
  onEdit,
  onView,
  onMaintenance
}) => {
  if (viewMode === 'table') {
    return (
      <VehiclesTable
        vehicles={vehicles}
        onEdit={onEdit}
        onView={onView}
        onMaintenance={onMaintenance}
      />
    );
  }

  return (
    <VehiclesCards
      vehicles={vehicles}
      onEdit={onEdit}
      onView={onView}
      onMaintenance={onMaintenance}
    />
  );
};

export default VehiclesList;
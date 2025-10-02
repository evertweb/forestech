/**
 * VehiclesList - Componente para mostrar la lista de vehículos
 * Soporta vista en tarjetas y tabla con acciones por permisos
 */

import React, { memo } from 'react';
import VehiclesCards from './VehiclesCards';
import VehiclesTable from './VehiclesTable';

const VehiclesListComponent = ({
  vehicles,
  viewMode,
  onEdit,
  onView,
  onMaintenance
}) => {
  console.log('🚗 VehiclesList render', {
    vehiclesCount: vehicles?.length || 0,
    viewMode,
  });
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

const propsAreEqual = (prevProps, nextProps) => {
  return (
    prevProps.vehicles === nextProps.vehicles &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onView === nextProps.onView &&
    prevProps.onMaintenance === nextProps.onMaintenance
  );
};

const VehiclesList = memo(VehiclesListComponent, propsAreEqual);

export default VehiclesList;
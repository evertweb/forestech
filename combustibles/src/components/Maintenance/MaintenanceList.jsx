/**
 * MaintenanceList - Componente para mostrar lista de mantenimientos
 * Incluye vista de cards y tabla con acciones
 */

import React from 'react';
import { MAINTENANCE_TYPES, MAINTENANCE_STATUS } from '../../services/maintenanceService';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import MaintenanceCards from './MaintenanceCards';
import MaintenanceTable from './MaintenanceTable';

const MaintenanceList = ({
  maintenanceRecords,
  viewMode,
  onEdit,
  onView,
  onDelete,
  userRole
}) => {
  if (!maintenanceRecords || maintenanceRecords.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔧</div>
        <h3>No hay mantenimientos registrados</h3>
        <p>Comienza creando el primer mantenimiento para tu flota de vehículos.</p>
      </div>
    );
  }

  return (
    <div className="maintenance-list">
      {viewMode === 'cards' ? (
        <MaintenanceCards
          maintenanceRecords={maintenanceRecords}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          userRole={userRole}
        />
      ) : (
        <MaintenanceTable
          maintenanceRecords={maintenanceRecords}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default MaintenanceList;

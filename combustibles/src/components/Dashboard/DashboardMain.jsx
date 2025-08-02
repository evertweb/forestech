/**
 * ================================================================================================================================
 * ARCHIVO: DashboardMain.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Componente principal que renderiza el dashboard operativo en formato tabla únicamente.
 *
 * FUNCIONALIDAD:
 * - Componente simplificado que renderiza directamente el DashboardTable
 * - Elimina la complejidad de múltiples vistas manteniendo solo la vista tabla
 * - Mantiene la compatibilidad con el routing existente
 * ================================================================================================================================
 */

import React from 'react';
import DashboardTable from './DashboardTable';

const DashboardMain = () => {
  // ==================================================================================================
  // RENDERIZADO SIMPLIFICADO - SOLO VISTA TABLA
  // ==================================================================================================
  return <DashboardTable />;
};

export default DashboardMain;
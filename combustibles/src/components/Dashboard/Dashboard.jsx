// combustibles/src/components/Dashboard/Dashboard.jsx
// Componente contenedor del dashboard con navegación entre módulos
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardMain from './DashboardMain';
import InventoryMain from '../Inventory/InventoryMain';
import MovementsMain from '../Movements/MovementsMain';
import VehiclesMain from '../Vehicles/VehiclesMain';
import AdminMain from '../Admin/AdminMain';
import './Dashboard.css';

const SuppliersModule = () => (
  <div className="module-placeholder">
    <h2>🏪 Módulo de Proveedores</h2>
    <p>Gestión de proveedores de combustible</p>
    <div className="coming-soon">
      <span>🚧 En desarrollo</span>
      <p>Próximamente: Base de datos de proveedores, comparación de precios, y evaluación.</p>
    </div>
  </div>
);

const ReportsModule = () => (
  <div className="module-placeholder">
    <h2>📋 Módulo de Reportes</h2>
    <p>Análisis y reportes de combustibles</p>
    <div className="coming-soon">
      <span>🚧 En desarrollo</span>
      <p>Próximamente: Reportes personalizables, gráficos interactivos, y exportación.</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardMain />;
      case 'inventory':
        return <InventoryMain />;
      case 'movements':
        return <MovementsMain />;
      case 'vehicles':
        return <VehiclesMain />;
      case 'suppliers':
        return <SuppliersModule />;
      case 'reports':
        return <ReportsModule />;
      case 'admin':
        return <AdminMain />;
      default:
        return <DashboardMain />;
    }
  };

  return (
    <DashboardLayout 
      currentView={currentView} 
      onViewChange={setCurrentView}
    >
      {renderCurrentView()}
    </DashboardLayout>
  );
};

export default Dashboard;
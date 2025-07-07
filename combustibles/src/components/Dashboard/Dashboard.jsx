// combustibles/src/components/Dashboard/Dashboard.jsx
// Componente contenedor del dashboard con navegación entre módulos
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardMain from './DashboardMain';
import InventoryMain from '../Inventory/InventoryMain';
import MovementsMain from '../Movements/MovementsMain';
import VehiclesMain from '../Vehicles/VehiclesMain';
import MaintenanceMain from '../Maintenance/MaintenanceMain';
import ProductsMain from '../Products/ProductsMain';
import SuppliersMain from '../Suppliers/SuppliersMain';
import AdminMain from '../Admin/AdminMain';
import ReportsMain from '../Reports/ReportsMain';
import './Dashboard.css';

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
      case 'maintenance':
        return <MaintenanceMain />;
      case 'products':
        return <ProductsMain />;
      case 'suppliers':
        return <SuppliersMain />;
      case 'reports':
        return <ReportsMain />;
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
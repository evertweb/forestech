// combustibles/src/components/Dashboard/Dashboard.jsx
// Componente contenedor del dashboard con navegación entre módulos
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import DashboardMain from './DashboardMain';
import './Dashboard.css';

// Componentes placeholder para los diferentes módulos
const InventoryModule = () => (
  <div className="module-placeholder">
    <h2>🛢️ Módulo de Inventario</h2>
    <p>Gestión de stock de combustibles</p>
    <div className="coming-soon">
      <span>🚧 En desarrollo</span>
      <p>Próximamente: CRUD completo de inventario, alertas automáticas, y gestión de ubicaciones.</p>
    </div>
  </div>
);

const MovementsModule = () => (
  <div className="module-placeholder">
    <h2>📈 Módulo de Movimientos</h2>
    <p>Registro de entradas y salidas de combustible</p>
    <div className="coming-soon">
      <span>🚧 En desarrollo</span>
      <p>Próximamente: Formularios de movimientos, validaciones automáticas, y tracking por vehículo.</p>
    </div>
  </div>
);

const VehiclesModule = () => (
  <div className="module-placeholder">
    <h2>🚜 Módulo de Vehículos</h2>
    <p>Gestión de maquinaria forestal</p>
    <div className="coming-soon">
      <span>🚧 En desarrollo</span>
      <p>Próximamente: Catálogo de vehículos, tracking de consumo, y mantenimientos.</p>
    </div>
  </div>
);

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
        return <InventoryModule />;
      case 'movements':
        return <MovementsModule />;
      case 'vehicles':
        return <VehiclesModule />;
      case 'suppliers':
        return <SuppliersModule />;
      case 'reports':
        return <ReportsModule />;
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
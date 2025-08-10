import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContextLazy';
import { CombustiblesProvider, useCombustibles } from './contexts/CombustiblesContext';
import './App.css';
// Rutas de los popups cargadas de forma perezosa
const MovementWizardPopup = lazy(() => import('./components/Popups/MovementWizardPopup'));
const VehicleWizardPopup = lazy(() => import('./components/Popups/VehicleWizardPopup'));

// Lazy load CRÍTICO - dividir componentes pesados para LCP
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const AuthVisualEnhanced = lazy(() => import('./components/Auth/AuthVisualEnhanced'));

// Lazy load de los componentes de ruta
const DashboardMain = lazy(() => import('./components/Dashboard/DashboardMain-SAP'));
const InventoryMain = lazy(() => import('./components/Inventory/InventoryMain'));
const MovementsMain = lazy(() => import('./components/Movements/MovementsMain'));
const VehiclesMain = lazy(() => import('./components/Vehicles/VehiclesMain'));
const MaintenanceMain = lazy(() => import('./components/Maintenance/MaintenanceMain'));
const ProductsMain = lazy(() => import('./components/Products/ProductsMain'));
const SuppliersMain = lazy(() => import('./components/Suppliers/SuppliersMain'));
const AdminMain = lazy(() => import('./components/Admin/AdminMain'));
const ReportsMain = lazy(() => import('./components/Reports/ReportsMain'));

// Componente de fallback para Suspense
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loader">
      <div className="spinner"></div>
      <p>Cargando vista...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CombustiblesProvider>
        <AppContent />
      </CombustiblesProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useCombustibles();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        {/* Rutas según autenticación */}
        {!user ? (
          <AuthVisualEnhanced />
        ) : (
          <Routes>
            {/* Rutas dedicadas para los popups de wizards */}
            <Route path="/movement-wizard-popup" element={<MovementWizardPopup />} />
            <Route path="/vehicle-wizard-popup" element={<VehicleWizardPopup />} />
            <Route path="/" element={<Dashboard />}>
              <Route index element={<DashboardMain />} />
              <Route path="inventario" element={<InventoryMain />} />
              <Route path="movimientos" element={<MovementsMain />} />
              <Route path="vehiculos" element={<VehiclesMain />} />
              <Route path="mantenimiento" element={<MaintenanceMain />} />
              <Route path="productos" element={<ProductsMain />} />
              <Route path="proveedores" element={<SuppliersMain />} />
              <Route path="reportes" element={<ReportsMain />} />
              <Route path="admin" element={<AdminMain />} />
            </Route>
          </Routes>
        )}
      </Suspense>
    </div>
  );
}

export default App;

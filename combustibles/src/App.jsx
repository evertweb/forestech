import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CombustiblesProvider, useCombustibles } from './contexts/CombustiblesContext';
import { PerformanceProvider } from './contexts/PerformanceContext';
import PerformanceDashboard from './components/Optimized/PerformanceDashboard';
import Dashboard from './components/Dashboard/Dashboard';
import Auth from './components/Auth/Auth';
import './App.css';

// Lazy load de los componentes de ruta
const DashboardMain = lazy(() => import('./components/Dashboard/DashboardMain'));
const MigrationPage = lazy(() => import('./components/Migration/MigrationPage'));
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
        <PerformanceProvider>
          <PerformanceDashboard isVisible={process.env.NODE_ENV === 'development'} />
          <AppContent />
        </PerformanceProvider>
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
      {!user ? (
        <Auth />
      ) : (
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<DashboardMain />} />
              <Route path="inventario" element={<InventoryMain />} />
              <Route path="movimientos" element={<MovementsMain />} />
              <Route path="vehiculos" element={<VehiclesMain />} />
              <Route path="mantenimiento" element={<MaintenanceMain />} />
              <Route path="productos" element={<ProductsMain />} />
              <Route path="proveedores" element={<SuppliersMain />} />
              <Route path="reportes" element={<ReportsMain />} />
              <Route path="migracion" element={<MigrationPage />} />
              <Route path="admin" element={<AdminMain />} />
            </Route>
          </Routes>
        </Suspense>
      )}
    </div>
  );
}

export default App;

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContextLazy';
import { CombustiblesProvider, useCombustibles } from './contexts/CombustiblesContext';
import { FirebaseProgressProvider } from './contexts/FirebaseProgressContext';
import PriceUpdateServiceProvider from './components/Services/PriceUpdateServiceProvider';
import PriceUpdateNotifications from './components/Services/PriceUpdateNotifications';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
// Rutas de los popups cargadas de forma perezosa
const MovementWizardPopup = lazy(() => import('./components/Popups/MovementWizardPopup'));
const VehicleWizardPopup = lazy(() => import('./components/Popups/VehicleWizardPopup'));
const ProductWizardPopup = lazy(() => import('./components/Popups/ProductWizardPopup'));

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
const LinkTelegram = lazy(() => import('./components/Integrations/LinkTelegram'));
const SimplePasskeyDemo = lazy(() => import('./pages/SimplePasskeyDemo'));

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
    <ErrorBoundary>
      <AuthProvider>
        <CombustiblesProvider>
          <FirebaseProgressProvider>
            <PriceUpdateServiceProvider>
              <AppContent />
              <PriceUpdateNotifications />
            </PriceUpdateServiceProvider>
          </FirebaseProgressProvider>
        </CombustiblesProvider>
      </AuthProvider>
    </ErrorBoundary>
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
    <ErrorBoundary>
      <div className="App">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* RUTA PÚBLICA PARA DEMO DE PASSKEYS - ACCESO SIN LOGIN PARA PRUEBAS */}
            <Route path="/simple-passkeys" element={<SimplePasskeyDemo />} />

            {/* Rutas dedicadas para los popups de wizards */}
            <Route path="/movement-wizard-popup" element={<MovementWizardPopup />} />
            <Route path="/vehicle-wizard-popup" element={<VehicleWizardPopup />} />
            <Route path="/product-wizard-popup" element={<ProductWizardPopup />} />

            {/* Rutas autenticadas */}
            {user ? (
              <>
                {/* Rutas del Dashboard integrado con navegación por tabs */}
                <Route path="/" element={<Dashboard />}>
                  <Route index element={<DashboardMain />} />
                  <Route path="inventario" element={<InventoryMain />} />
                  <Route path="movimientos" element={<MovementsMain />} />
                  <Route path="vehiculos" element={<VehiclesMain />} />
                  <Route path="mantenimiento" element={<MaintenanceMain />} />
                  <Route path="productos" element={<ProductsMain />} />
                  <Route path="proveedores" element={<SuppliersMain />} />
                  <Route path="reportes" element={<ReportsMain />} />
                  <Route path="administracion" element={<AdminMain />} />
                  <Route path="integraciones/telegram" element={<LinkTelegram />} />
                </Route>
              </>
            ) : (
              <Route path="/*" element={<AuthVisualEnhanced />} />
            )}
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;

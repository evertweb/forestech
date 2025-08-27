import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContextSSR';
import { CombustiblesProvider, useCombustibles } from './contexts/CombustiblesContextSSR';
import { isServer } from './utils/ssr';
import './App.css';

// Lazy load CRÍTICO - dividir componentes pesados para LCP
// En SSR, no lazy load para ruta login para mejor FCP
const Dashboard = isServer
  ? () => import('./components/Dashboard/Dashboard').then((m) => m.default)
  : lazy(() => import('./components/Dashboard/Dashboard'));

const AuthVisualEnhanced = isServer
  ? () => import('./components/Auth/AuthVisualEnhanced').then((m) => m.default)
  : lazy(() => import('./components/Auth/AuthVisualEnhanced'));

// Lazy load de los componentes de ruta (solo en cliente)
const DashboardMain = lazy(() => import('./components/Dashboard/DashboardMain-SAP'));
const InventoryMain = lazy(() => import('./components/Inventory/InventoryMain'));
const MovementsMain = lazy(() => import('./components/Movements/MovementsMain'));
const VehiclesMain = lazy(() => import('./components/Vehicles/VehiclesMain'));
const MaintenanceMain = lazy(() => import('./components/Maintenance/MaintenanceMain'));
const ProductsMain = lazy(() => import('./components/Products/ProductsMain'));
const LinkTelegram = lazy(() => import('./components/Integrations/LinkTelegram'));
const SuppliersMain = lazy(() => import('./components/Suppliers/SuppliersMain'));
const AdminMain = lazy(() => import('./components/Admin/AdminMain'));
const ReportsMain = lazy(() => import('./components/Reports/ReportsMain'));

// Rutas de los popups cargadas de forma perezosa (solo cliente)
const MovementWizardPopup = lazy(() => import('./components/Popups/MovementWizardPopup'));
const VehicleWizardPopup = lazy(() => import('./components/Popups/VehicleWizardPopup'));

// Componentes legales - Redirección al dominio principal
const LegalRedirect = lazy(() => import('./components/Legal/LegalRedirect'));

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

  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Rutas de popup SIEMPRE disponibles - tanto en SSR como CSR */}
          <Route path="/movement-wizard-popup" element={<MovementWizardPopup />} />
          <Route path="/vehicle-wizard-popup" element={<VehicleWizardPopup />} />

          {/* Rutas legales - Redirección al dominio principal */}
          <Route path="/politica-privacidad" element={<LegalRedirect type="privacy" />} />
          <Route path="/terminos-servicio" element={<LegalRedirect type="terms" />} />

          {/* Resto de rutas según contexto SSR/CSR */}
          <Route
            path="*"
            element={
              isServer ? (
                <AuthVisualEnhanced />
              ) : loading ? (
                <div className="loading-container">
                  <div className="loader">
                    <div className="spinner"></div>
                    <p>Cargando...</p>
                  </div>
                </div>
              ) : !user ? (
                <AuthVisualEnhanced />
              ) : (
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
                    <Route path="admin" element={<AdminMain />} />
                    <Route path="integraciones/telegram" element={<LinkTelegram />} />
                  </Route>
                </Routes>
              )
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

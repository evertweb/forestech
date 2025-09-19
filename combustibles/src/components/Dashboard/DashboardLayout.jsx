/**
 * DashboardLayout - Layout principal del dashboard
 * Proporciona estructura común con navegación por tabs y contenido principal
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import MainNavigation from './MainNavigation';
import AdminSSRBanner from './AdminSSRBanner';
import './AdminSSRBanner.css';
import './DashboardLayout.css';
import '../../styles/apple-dashboard.css';

const DashboardLayout = ({ children }) => {
  const { user: _user, userProfile } = useCombustibles();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mapeo de rutas a tabs (memoizado para evitar re-renders)
  const routeToTabMap = useMemo(() => ({
    '/': 'dashboard',
    '/inventario': 'inventario',
    '/movimientos': 'movimientos',
    '/vehiculos': 'vehiculos',
    '/mantenimiento': 'mantenimiento',
    '/productos': 'productos',
    '/proveedores': 'proveedores',
    '/reportes': 'reportes',
    '/administracion': 'administracion',
  }), []);

  // Actualizar tab activo basado en la ruta actual
  useEffect(() => {
    const currentTab = routeToTabMap[location.pathname] || 'dashboard';
    setActiveTab(currentTab);
  }, [location.pathname, routeToTabMap]);

  // Manejar cambio de tab
  const handleTabChange = (tabId, path) => {
    setActiveTab(tabId);
    navigate(path);
  };

  return (
    <div className="apple-dashboard-layout">
      {/* Banner SSR para admins */}
      {userProfile?.role === 'admin' && <AdminSSRBanner />}

      {/* Navegación principal estilo Apple */}
      <MainNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Contenido principal del dashboard */}
      <main className="apple-dashboard-main">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

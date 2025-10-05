/**
 * DashboardLayout - Layout principal del dashboard
 * Proporciona estructura común con navegación por tabs y contenido principal
 * 
 * MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
 * - Usa useAuthStore en lugar de CombustiblesContext
 * - Solo necesita userProfile para verificar rol de admin
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import AdminSSRBanner from './AdminSSRBanner';
import './AdminSSRBanner.css';
import './DashboardLayout.css';
import '../../styles/apple-dashboard.css';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mapeo de rutas a tabs (memoizado para evitar re-renders)
  const routeToTabMap = useMemo(() => ({
    '/': 'dashboard',
    '/inventario': 'inventario',
    '/movimientos': 'movimientos',
    '/vehiculos': 'vehiculos',
    // COMMENTED: '/mantenimiento': 'mantenimiento', - postponed for later phase
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
      <AdminSSRBanner />

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

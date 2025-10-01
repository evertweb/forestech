/**
 * MainNavigation - Navegación principal estilo Apple iOS/macOS
 * Diseño minimalista con blur background y estados suaves
 * 
 * MIGRADO A ZUSTAND (Fase 2 - Sprint 1)
 * - Usa useAuthStore para userProfile
 * - Usa signOut directamente de Firebase Auth
 */

import React from 'react';
import { useAuthStore, resetAllStores } from '../../stores';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

const MainNavigation = ({ activeTab, onTabChange }) => {
  // 🔐 Zustand Store - Auth
  const userProfile = useAuthStore(state => state.userProfile);

  // Manejar logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      resetAllStores(); // Limpiar todos los stores al hacer logout
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Configuración de tabs principales con iconos Apple style
  const mainTabs = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'Vista general',
      icon: '📊',
      path: '/',
    },
    {
      id: 'inventario',
      title: 'Inventario',
      subtitle: 'Stock y productos',
      icon: '📦',
      path: '/inventario',
    },
    {
      id: 'movimientos',
      title: 'Movimientos',
      subtitle: 'Entradas y salidas',
      icon: '🔄',
      path: '/movimientos',
    },
    {
      id: 'vehiculos',
      title: 'Vehículos',
      subtitle: 'Maquinaria forestal',
      icon: '🚜',
      path: '/vehiculos',
    },
    // COMMENTED: Mantenimiento tab - postponed for later phase (Refactoring decision)
    // {
    //   id: 'mantenimiento',
    //   title: 'Mantenimiento',
    //   subtitle: 'Servicios y reparaciones',
    //   icon: '🔧',
    //   path: '/mantenimiento',
    // },
    {
      id: 'productos',
      title: 'Productos',
      subtitle: 'Catálogo de combustibles',
      icon: '🛢️',
      path: '/productos',
    },
    {
      id: 'proveedores',
      title: 'Proveedores',
      subtitle: 'Gestión de proveedores',
      icon: '🏢',
      path: '/proveedores',
    },
    {
      id: 'reportes',
      title: 'Reportes',
      subtitle: 'Análisis y métricas',
      icon: '📈',
      path: '/reportes',
    },
  ];

  // Tab de administración solo para admins
  const adminTab = {
    id: 'administracion',
    title: 'Administración',
    subtitle: 'Panel de control',
    icon: '⚙️',
    path: '/administracion',
  };

  // Combinar tabs según permisos
  const allTabs = userProfile?.role === 'admin'
    ? [...mainTabs, adminTab]
    : mainTabs;

  return (
    <nav className="apple-navigation">
      <div className="apple-nav-container">
        {allTabs.map((tab) => (
          <button
            key={tab.id}
            className={`apple-nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id, tab.path)}
            title={`${tab.title} - ${tab.subtitle}`}
            aria-label={`${tab.title} - ${tab.subtitle}`}
          >
            <span className="apple-nav-icon">{tab.icon}</span>
            <div className="apple-nav-text">
              <span className="apple-nav-label">{tab.title}</span>
            </div>
          </button>
        ))}
        
        {/* Separador y botón de logout */}
        <div className="apple-nav-separator"></div>
        <button
          className="apple-nav-item logout-nav-item"
          onClick={handleLogout}
          title="Cerrar Sesión"
          aria-label="Cerrar Sesión"
        >
          <span className="apple-nav-icon">🚪</span>
          <div className="apple-nav-text">
            <span className="apple-nav-label">Salir</span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default MainNavigation;
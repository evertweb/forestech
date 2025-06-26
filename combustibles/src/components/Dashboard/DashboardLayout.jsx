// combustibles/src/components/Dashboard/DashboardLayout.jsx
// Layout principal del Dashboard con navegación y sidebar
import React, { useState } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';

const DashboardLayout = ({ children, currentView, onViewChange }) => {
  const { userProfile, isAdmin, isCounterOrAbove } = useCombustibles();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '📊',
      description: 'Vista general',
      requiredPermission: null // Todos pueden ver dashboard
    },
    {
      id: 'inventory',
      name: 'Inventario',
      icon: '🛢️', 
      description: 'Gestión de stock',
      requiredPermission: 'canManageInventory'
    },
    {
      id: 'movements',
      name: 'Movimientos',
      icon: '📈',
      description: 'Entradas y salidas',
      requiredPermission: 'canCreateMovements'
    },
    {
      id: 'vehicles',
      name: 'Vehículos',
      icon: '🚜',
      description: 'Maquinaria forestal',
      requiredPermission: null // Todos pueden ver vehículos
    },
    {
      id: 'suppliers',
      name: 'Proveedores',
      icon: '🏪',
      description: 'Gestión de proveedores',
      requiredPermission: 'canManageSuppliers'
    },
    {
      id: 'reports',
      name: 'Reportes',
      icon: '📋',
      description: 'Análisis y reportes',
      requiredPermission: 'canViewReports'
    }
  ];

  const handleViewChange = (viewId) => {
    onViewChange(viewId);
    setSidebarOpen(false); // Cerrar sidebar en móvil
  };

  const hasPermission = (permission) => {
    if (!permission) return true; // Sin restricción
    return userProfile?.combustiblesPermissions?.[permission] || false;
  };

  const visibleItems = navigationItems.filter(item => hasPermission(item.requiredPermission));

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          
          <div className="header-title">
            <h1>⛽ Gestión de Combustibles</h1>
            <span className="subtitle">Forestech Colombia</span>
          </div>
          
          <div className="header-user">
            <div className="user-info">
              <span className="user-name">{userProfile?.displayName || userProfile?.email}</span>
              <span className="user-role">{userProfile?.role}</span>
            </div>
            <div className="user-avatar">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {(userProfile?.displayName || userProfile?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {visibleItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => handleViewChange(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <div className="nav-content">
                  <span className="nav-name">{item.name}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              </button>
            ))}
          </nav>
          
          {/* Información del usuario en sidebar */}
          <div className="sidebar-footer">
            <div className="user-permissions">
              <h4>Permisos Activos:</h4>
              <div className="permission-list">
                {isAdmin() && <span className="permission admin">👑 Administrador</span>}
                {isCounterOrAbove() && <span className="permission counter">📊 Gestión Operativa</span>}
                {hasPermission('canManageInventory') && <span className="permission">🛢️ Inventario</span>}
                {hasPermission('canManageVehicles') && <span className="permission">🚜 Vehículos</span>}
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="dashboard-main">
          <div className="main-content">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay para cerrar sidebar en móvil */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
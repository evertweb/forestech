import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useCombustibles } from '../../contexts/CombustiblesContext';

const DashboardLayout = ({ children }) => {
  const { userProfile, isAdmin, isCounterOrAbove } = useCombustibles();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      id: 'dashboard',
      path: '/',
      name: 'Dashboard',
      icon: '📊',
      description: 'Vista general',
      requiredPermission: null
    },
    {
      id: 'inventory',
      path: '/inventario',
      name: 'Inventario',
      icon: '🛢️',
      description: 'Gestión de stock',
      requiredPermission: 'canManageInventory'
    },
    {
      id: 'movements',
      path: '/movimientos',
      name: 'Movimientos',
      icon: '📈',
      description: 'Entradas y salidas',
      requiredPermission: 'canCreateMovements'
    },
    {
      id: 'vehicles',
      path: '/vehiculos',
      name: 'Vehículos',
      icon: '🚜',
      description: 'Maquinaria forestal',
      requiredPermission: null
    },
    {
      id: 'maintenance',
      path: '/mantenimiento',
      name: 'Mantenimiento',
      icon: '🔧',
      description: 'Cambios de aceite y baterías',
      requiredPermission: null
    },
    {
      id: 'products',
      path: '/productos',
      name: 'Productos',
      icon: '🛢️',
      description: 'Tipos de combustibles',
      requiredPermission: null
    },
    {
      id: 'suppliers',
      path: '/proveedores',
      name: 'Proveedores',
      icon: '🏪',
      description: 'Gestión de proveedores',
      requiredPermission: 'canManageSuppliers'
    },
    {
      id: 'reports',
      path: '/reportes',
      name: 'Reportes',
      icon: '📋',
      description: 'Análisis y reportes',
      requiredPermission: 'canViewReports'
    },
    {
      id: 'admin',
      path: '/admin',
      name: 'Administración',
      icon: '⚙️',
      description: 'Gestión de usuarios',
      requiredPermission: 'admin'
    }
  ];

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  const hasPermission = (permission) => {
    if (!permission) return true;
    if (permission === 'admin') return isAdmin();
    return userProfile?.combustiblesPermissions?.[permission] || false;
  };

  const visibleItems = navigationItems.filter(item => hasPermission(item.requiredPermission));

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="dashboard-layout">
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
            <button 
              className="logout-button"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {visibleItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">{item.icon}</span>
                <div className="nav-content">
                  <span className="nav-name">{item.name}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              </Link>
            ))}
          </nav>
          
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

        <main className="dashboard-main">
          <div className="main-content">
            {children}
          </div>
        </main>
      </div>

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
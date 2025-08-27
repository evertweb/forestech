/**
 * ================================================================================================================================
 * ARCHIVO: DashboardLayout.jsx
 * MÓDULO: combustibles
 * DESCRIPCIÓN: Componente que define la estructura visual principal del dashboard, incluyendo el header, sidebar y el área de contenido.
 *
 * FUNCIONALIDAD:
 * - Proporciona un layout consistente para todas las páginas del dashboard.
 * - Muestra un header fijo con el título de la aplicación, información del usuario y un botón de logout.
 * - Implementa un sidebar de navegación lateral que se puede ocultar en dispositivos móviles.
 * - Filtra los ítems de navegación basándose en los permisos del usuario actual.
 * - Renderiza el contenido específico de cada página (pasado como `children`).
 * - Maneja el estado de visibilidad del sidebar (`sidebarOpen`).
 *
 * USO:
 * - Este componente envuelve el `Outlet` en `Dashboard.jsx` para aplicar este layout a todas las rutas anidadas.
 * ================================================================================================================================
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import AdminSSRBanner from './AdminSSRBanner';
import './AdminSSRBanner.css';

const DashboardLayout = React.memo(({ children }) => {
  // Extrae el perfil de usuario y las funciones de verificación de permisos del contexto.
  const { userProfile, isAdmin, isCounterOrAbove } = useCombustibles();

  // Estado para controlar la visibilidad del sidebar en todos los dispositivos.
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Hook de react-router para obtener la ubicación actual y resaltar el enlace activo.
  const location = useLocation();

  // Detecta si estamos en el Dashboard principal
  const isDashboardHome = location.pathname === '/';

  // useEffect para manejar el estado inicial del sidebar basado en el tamaño de pantalla y ruta
  useEffect(() => {
    const handleResize = () => {
      // Si estamos en Dashboard principal, siempre ocultar sidebar
      if (isDashboardHome) {
        setSidebarOpen(false);
        return;
      }

      // En otras rutas: En móviles inicia cerrado, en desktop abierto
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Ejecuta al montar el componente
    handleResize();

    // Escucha cambios de tamaño de ventana
    window.addEventListener('resize', handleResize);

    // Limpieza del event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [isDashboardHome]);

  // useEffect adicional para manejar cambios de ruta
  useEffect(() => {
    // Si navegamos al Dashboard principal, ocultar sidebar
    if (isDashboardHome) {
      setSidebarOpen(false);
    } else {
      // Si navegamos a otra ruta desde Dashboard, mostrar sidebar según tamaño de pantalla
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
      }
    }
  }, [isDashboardHome]);

  /**
   * @type {Array<Object>}
   * @description Define la estructura y el contenido de los ítems de navegación del sidebar.
   * - id: Identificador único.
   * - path: Ruta de la URL a la que enlaza.
   * - name: Texto principal del enlace.
   * - icon: Emoji o ícono visual.
   * - description: Texto secundario que describe la sección.
   * - requiredPermission: Permiso necesario para que el ítem sea visible. `null` significa que es visible para todos.
   */
  const navigationItems = useMemo(
    () => [
      {
        id: 'dashboard',
        path: '/',
        name: 'Dashboard',
        icon: '📊',
        description: 'Vista general',
        requiredPermission: null,
      },
      {
        id: 'inventory',
        path: '/inventario',
        name: 'Inventario',
        icon: '🛢️',
        description: 'Gestión de stock',
        requiredPermission: 'canManageInventory',
      },
      {
        id: 'movements',
        path: '/movimientos',
        name: 'Movimientos',
        icon: '📈',
        description: 'Entradas y salidas',
        requiredPermission: 'canCreateMovements',
      },
      {
        id: 'vehicles',
        path: '/vehiculos',
        name: 'Vehículos',
        icon: '🚜',
        description: 'Maquinaria forestal',
        requiredPermission: null,
      },
      {
        id: 'maintenance',
        path: '/mantenimiento',
        name: 'Mantenimiento',
        icon: '🔧',
        description: 'Cambios de aceite y baterías',
        requiredPermission: null,
      },
      {
        id: 'products',
        path: '/productos',
        name: 'Productos',
        icon: '🛢️',
        description: 'Tipos de combustibles',
        requiredPermission: null,
      },
      {
        id: 'suppliers',
        path: '/proveedores',
        name: 'Proveedores',
        icon: '🏪',
        description: 'Gestión de proveedores',
        requiredPermission: 'canManageSuppliers',
      },
      {
        id: 'reports',
        path: '/reportes',
        name: 'Reportes',
        icon: '📋',
        description: 'Análisis y reportes',
        requiredPermission: 'canViewReports',
      },
      {
        id: 'admin',
        path: '/admin',
        name: 'Administración',
        icon: '⚙️',
        description: 'Gestión de usuarios',
        requiredPermission: 'admin',
      },
      {
        id: 'integrations-telegram',
        path: '/integraciones/telegram',
        name: 'Integraciones',
        icon: '🤖',
        description: 'Vincular bot de Telegram',
        requiredPermission: null,
      },
    ],
    []
  );

  // Prefetch de rutas al pasar el mouse sobre los enlaces del sidebar
  const routePrefetchers = useMemo(
    () => ({
      dashboard: () => import('../../components/Dashboard/DashboardMain-SAP'),
      inventory: () => import('../../components/Inventory/InventoryMain'),
      movements: () => import('../../components/Movements/MovementsMain'),
      vehicles: () => import('../../components/Vehicles/VehiclesMain'),
      maintenance: () => import('../../components/Maintenance/MaintenanceMain'),
      products: () => import('../../components/Products/ProductsMain'),
      suppliers: () => import('../../components/Suppliers/SuppliersMain'),
      reports: () => import('../../components/Reports/ReportsMain'),
      admin: () => import('../../components/Admin/AdminMain'),
      'integrations-telegram': () => import('../../components/Integrations/LinkTelegram'),
    }),
    []
  );

  const handlePrefetch = useCallback(
    (id) => {
      try {
        const loader = routePrefetchers[id];
        if (loader) {
          loader().then(() => {
            console.log(`✅ Prefetch completado: ${id}`);
          });
        }
      } catch (error) {
        console.warn(`⚠️ Error en prefetch: ${id}`, error);
      }
    },
    [routePrefetchers]
  );

  // Cierra el sidebar al hacer clic en un enlace en la navegación móvil.
  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  /**
   * Verifica si el usuario actual tiene un permiso específico.
   * @param {string|null} permission - El permiso requerido para una acción o vista.
   * @returns {boolean} - `true` si el usuario tiene el permiso, `false` en caso contrario.
   */
  const hasPermission = useCallback(
    (permission) => {
      // Admin ve todas las secciones por defecto
      if (isAdmin()) return true;
      if (!permission) return true; // Si no se requiere permiso, siempre es visible.
      if (permission === 'admin') return isAdmin(); // Caso especial para el permiso de administrador.
      return userProfile?.combustiblesPermissions?.[permission] || false; // Verifica el permiso en el perfil del usuario.
    },
    [isAdmin, userProfile?.combustiblesPermissions]
  );

  // Prefetch proactivo de rutas comunes al montar el componente
  useEffect(() => {
    const prefetchCommonRoutes = () => {
      // Prefetch de las rutas más utilizadas después de un pequeño delay
      setTimeout(() => {
        ['inventory', 'movements', 'vehicles'].forEach((route) => {
          if (
            hasPermission(navigationItems.find((item) => item.id === route)?.requiredPermission)
          ) {
            handlePrefetch(route);
          }
        });
      }, 1000);
    };

    prefetchCommonRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

  // Filtra los ítems de navegación para mostrar solo aquellos para los que el usuario tiene permiso.
  const visibleItems = useMemo(
    () => navigationItems.filter((item) => hasPermission(item.requiredPermission)),
    [hasPermission, navigationItems]
  );

  // Maneja el cierre de sesión del usuario.
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // La redirección se maneja automáticamente por el `AuthContext` o un observer de estado de autenticación.
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* ================= HEADER ================= */}
      <header className="dashboard-header">
        <div className="header-content">
          {/* Botón para alternar el sidebar - disponible también en Dashboard */}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
          >
            ☰
          </button>

          {/* Título de la aplicación */}
          <div className="header-title">
            <h1>⛽ Gestión de Combustibles</h1>
            <span className="subtitle">Forestech Colombia</span>
          </div>

          {/* Sección del usuario */}
          <div className="header-user">
            <div className="user-info">
              <span className="user-name">{userProfile?.displayName || userProfile?.email}</span>
              <span className="user-role">{userProfile?.role}</span>
            </div>
            <div className="user-avatar">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Avatar"
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                // Si no hay foto de perfil, muestra la inicial del nombre o email.
                <div className="avatar-placeholder">
                  {(userProfile?.displayName || userProfile?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button className="logout-button" onClick={handleLogout} title="Cerrar sesión">
              🚪
            </button>
          </div>
        </div>
      </header>

      {/* ================= CUERPO DEL DASHBOARD ================= */}
      <div className="dashboard-body">
        {/* ================= SIDEBAR ================= */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'hidden'}`}>
          <nav className="sidebar-nav">
            {/* Mapea los ítems de navegación visibles y crea los enlaces */}
            {visibleItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                // Aplica la clase 'active' si la ruta actual coincide con la del ítem.
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={handleLinkClick}
                onMouseEnter={() => handlePrefetch(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <div className="nav-content">
                  <span className="nav-name">{item.name}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              </Link>
            ))}
          </nav>

          {/* Footer del sidebar para mostrar permisos del usuario */}
          <div className="sidebar-footer">
            <div className="user-permissions">
              <h4>Permisos Activos:</h4>
              <div className="permission-list">
                {isAdmin() && <span className="permission admin">👑 Administrador</span>}
                {isCounterOrAbove() && (
                  <span className="permission counter">📊 Gestión Operativa</span>
                )}
                {hasPermission('canManageInventory') && (
                  <span className="permission">🛢️ Inventario</span>
                )}
                {hasPermission('canManageVehicles') && (
                  <span className="permission">🚜 Vehículos</span>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ================= CONTENIDO PRINCIPAL ================= */}
        <main
          className={`dashboard-main ${isDashboardHome ? 'dashboard-home' : sidebarOpen ? '' : 'sidebar-hidden'}`}
        >
          <div className="main-content">
            {/* Banner de administración SSR - Solo visible para admins */}
            <AdminSSRBanner />

            {/* Aquí se renderiza el contenido de la página actual (ej. Home, Reports, etc.) */}
            {children}
          </div>
        </main>
      </div>

      {/* Overlay que se muestra en móviles cuando el sidebar está abierto. */}
      {/* Al hacer clic, cierra el sidebar. Solo en móviles (max-width: 1024px) */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;

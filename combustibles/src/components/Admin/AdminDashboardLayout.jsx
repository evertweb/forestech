/**
 * AdminDashboardLayout - Layout principal para el nuevo diseño de administración
 * Dashboard moderno con sidebar modal y cards, reemplaza el sistema de tabs horizontal
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminDashboardCards from './AdminDashboardCards';
import AdminContentPanel from './AdminContentPanel';
import PasskeyManager from '../PasskeyManager';
import DataReset from './DataReset';
import BackgroundImageManager from './BackgroundImageManager';
import PriceServiceControl from '../Services/PriceServiceControl';
import './AdminDashboard.css';

const AdminDashboardLayout = ({ user, userProfile }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla para responsive
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Configuración de secciones del dashboard
  const dashboardSections = [
    {
      id: 'dashboard',
      title: 'Dashboard Principal',
      subtitle: 'Vista general del sistema',
      icon: '📊',
      color: 'blue',
      component: AdminDashboardCards
    },
    {
      id: 'invitations',
      title: 'Gestión de Invitaciones',
      subtitle: 'Crear y administrar invitaciones de usuario',
      icon: '📧',
      color: 'green',
      component: null // Se maneja en AdminContentPanel
    },
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      subtitle: 'Administrar usuarios del sistema',
      icon: '👥',
      color: 'purple',
      component: null
    },
    {
      id: 'passkeys',
      title: 'Autenticación Biométrica',
      subtitle: 'Gestión de passkeys y autenticación facial',
      icon: '🔐',
      color: 'indigo',
      component: PasskeyManager
    },
    {
      id: 'prices',
      title: 'Precios Automáticos',
      subtitle: 'Control de servicios de precios',
      icon: '💰',
      color: 'yellow',
      component: PriceServiceControl
    },
    {
      id: 'background',
      title: 'Imagen de Login',
      subtitle: 'Personalizar imagen de fondo',
      icon: '🖼️',
      color: 'pink',
      component: BackgroundImageManager
    },
    {
      id: 'diagnostic',
      title: 'Diagnóstico Passkeys',
      subtitle: 'Herramientas de diagnóstico técnico',
      icon: '🔧',
      color: 'orange',
      component: null
    },
    {
      id: 'settings',
      title: 'Configuración General',
      subtitle: 'Configuraciones del sistema',
      icon: '⚙️',
      color: 'gray',
      component: null
    },
    {
      id: 'reset',
      title: 'Reset de Datos',
      subtitle: 'Herramientas de limpieza y reset',
      icon: '🔥',
      color: 'red',
      component: DataReset
    }
  ];

  const currentSection = dashboardSections.find(section => section.id === activeSection);

  // Loading state si las secciones no están listas
  if (!dashboardSections || dashboardSections.length === 0) {
    return (
      <div className="admin-dashboard-layout">
        <div className="loading-dashboard">
          <div className="loading-spinner"></div>
          <span>Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  // Autorización
  if (userProfile?.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <motion.div
          className="unauthorized-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="unauthorized-icon">⛔</div>
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden acceder a esta sección.</p>
          <div className="unauthorized-details">
            <span>Usuario actual: {user?.email}</span>
            <span>Rol: {userProfile?.role || 'Sin rol asignado'}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard-layout ${isMobile ? 'mobile' : ''}`}>
      {/* Botón para abrir sidebar modal */}
      <motion.button
        className="admin-sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Abrir menú de administración"
      >
        ⚙️ Admin
      </motion.button>

      {/* Sidebar Modal */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay oscuro */}
            <motion.div
              className="admin-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar Modal */}
            <motion.div
              className="admin-sidebar-modal"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <AdminSidebar
                sections={dashboardSections}
                activeSection={activeSection}
                onSectionChange={(section) => {
                  setActiveSection(section);
                  setSidebarOpen(false); // Cerrar modal al seleccionar
                }}
                collapsed={false} // Modal siempre expandido
                onToggleCollapse={() => setSidebarOpen(false)}
                isMobile={isMobile}
                user={user}
                userProfile={userProfile}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <main className="admin-main-content">
        {/* Header de la sección actual */}
        <motion.div
          className="admin-content-header"
          key={activeSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="header-content">
            <div className="header-title-section">
              <div className={`header-icon ${currentSection?.color}`}>
                {currentSection?.icon}
              </div>
              <div className="header-text">
                <h1>{currentSection?.title}</h1>
                <p>{currentSection?.subtitle}</p>
              </div>
            </div>

            {/* Breadcrumb */}
            <nav className="breadcrumb">
              <span className="breadcrumb-item">Administración</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-item active">{currentSection?.title}</span>
            </nav>
          </div>
        </motion.div>

        {/* Contenido de la sección */}
        <div className="admin-section-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="section-wrapper"
            >
              {activeSection === 'dashboard' && (
                <AdminDashboardCards
                  sections={dashboardSections ? dashboardSections.filter(s => s.id !== 'dashboard') : []}
                  onSectionClick={setActiveSection}
                />
              )}

              {currentSection?.component && React.createElement(currentSection.component, {
                user,
                userProfile,
                ...(activeSection === 'prices' && { userRole: userProfile?.role })
              })}

              {!currentSection?.component && activeSection !== 'dashboard' && (
                <AdminContentPanel
                  section={activeSection}
                  user={user}
                  userProfile={userProfile}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
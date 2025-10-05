/**
 * AdminDashboardLayout - Layout modal para el panel de administración
 * Modal moderno con sidebar interna que se abre sobre la app sin interferir
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

const AdminDashboardLayout = ({ user, userProfile, isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla para responsive
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(false);
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
    return null; // No mostrar nada si no hay secciones
  }

  // No mostrar si el modal no está abierto
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal del Dashboard Admin */}
          <motion.div
            className={`admin-modal-container ${isMobile ? 'mobile' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <motion.div
              className="admin-modal-content"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20 }}
              transition={{ delay: 0.1 }}
            >
              {/* Header del Modal */}
              <div className="admin-modal-header">
                <div className="modal-header-content">
                  <h2>Panel de Administración</h2>
                  <button
                    className="admin-modal-close"
                    onClick={onClose}
                    title="Cerrar panel de administración"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Contenido del Modal */}
              <div className="admin-modal-body">
                {/* Sidebar interna del modal */}
                <div className={`admin-modal-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                  <AdminSidebar
                    sections={dashboardSections}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    isMobile={isMobile}
                    user={user}
                    userProfile={userProfile}
                  />
                </div>

                {/* Contenido principal */}
                <main className="admin-modal-main">
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
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminDashboardLayout;
// combustibles/src/components/Admin/AdminMain.jsx
// Componente principal del módulo de administración - PÁGINA INTEGRADA
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { PageLayout, ShimmerLoader, ShimmerCardsGrid } from '../shared';
import AdminDashboardCards from './AdminDashboardCards';
import AdminContentPanel from './AdminContentPanel';
import PasskeyManager from '../PasskeyManager';
import DataReset from './DataReset';
import BackgroundImageManager from './BackgroundImageManager';
import PriceServiceControl from '../Services/PriceServiceControl';
import './AdminDashboard.css';
import './AdminMain.css';

const AdminMain = () => {
  const { user, userProfile } = useCombustibles();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Verificar permisos
  if (userProfile?.role !== 'admin') {
    return (
      <PageLayout
        title="🔒 Acceso Restringido"
        subtitle="Panel de Administración"
        showStats={false}
        showFilters={false}
      >
        <div className="admin-unauthorized">
          <div className="unauthorized-content">
            <div className="unauthorized-icon">🔒</div>
            <h2>Acceso Denegado</h2>
            <p>
              No tienes permisos para acceder al panel de administración.
              Solo los administradores pueden ver esta sección.
            </p>
            <div className="unauthorized-details">
              <div><strong>Usuario:</strong> {user?.email || 'No identificado'}</div>
              <div><strong>Rol:</strong> {userProfile?.role || 'Sin rol asignado'}</div>
              <div><strong>Permisos requeridos:</strong> Administrador</div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

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

  // Navegación por tabs horizontales (siguiendo el patrón de ReportsMain)
  const adminTabs = dashboardSections.map(section => ({
    id: section.id,
    title: section.title,
    subtitle: section.subtitle,
    icon: section.icon,
    color: section.color
  }));

  // Componente de navegación interna
  const AdminNavigation = () => (
    <div className="apple-nav-container admin-navigation">
      <div className="admin-tabs-container">
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            className={`apple-nav-item admin-nav-tab ${
              activeSection === tab.id ? 'active' : ''
            }`}
            onClick={() => setActiveSection(tab.id)}
            title={`${tab.title} - ${tab.subtitle}`}
          >
            <span className="apple-nav-icon admin-nav-tab-icon">{tab.icon}</span>
            <div className="admin-nav-tab-text">
              <span className="apple-nav-label admin-nav-tab-title">
                {tab.title}
              </span>
              <span className="apple-body-small text-secondary admin-nav-tab-subtitle">
                {tab.subtitle}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Stats component para el dashboard principal
  const statsComponent = activeSection === 'dashboard' && !loading ? (
    <AdminDashboardCards
      sections={dashboardSections.filter(s => s.id !== 'dashboard')}
      onSectionClick={setActiveSection}
    />
  ) : activeSection === 'dashboard' && loading ? (
    <ShimmerCardsGrid cards={6} columns={3} variant="stat" className="admin-cards-grid" />
  ) : null;

  // Filtros component (navegación interna)
  const filtersComponent = <AdminNavigation />;

  // Contenido principal
  const mainContent = (
    <div className="admin-main-content">
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando panel de administración...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="admin-section-wrapper"
          >
            {/* Header de la sección actual */}
            <div className="admin-section-header">
              <div className="section-header-content">
                <div className="section-title-area">
                  <div className={`section-icon ${currentSection?.color}`}>
                    {currentSection?.icon}
                  </div>
                  <div className="section-text">
                    <h1>{currentSection?.title}</h1>
                    <p>{currentSection?.subtitle}</p>
                  </div>
                </div>

                {/* Breadcrumb */}
                <nav className="section-breadcrumb">
                  <span className="breadcrumb-item">Administración</span>
                  <span className="breadcrumb-separator">›</span>
                  <span className="breadcrumb-item active">{currentSection?.title}</span>
                </nav>
              </div>
            </div>

            {/* Contenido de la sección */}
            <div className="admin-section-content">
              {activeSection === 'dashboard' && (
                <div className="admin-dashboard-overview">
                  <div className="dashboard-welcome">
                    <h2>Bienvenido al Panel de Administración</h2>
                    <p>Gestiona todos los aspectos del sistema desde aquí</p>
                  </div>
                </div>
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
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );

  return (
    <PageLayout
      title="⚙️ Panel de Administración"
      subtitle="Gestión completa del sistema de combustibles"
      stats={statsComponent}
      filters={filtersComponent}
      showStats={activeSection === 'dashboard'}
      showFilters={true}
      className="admin-page-layout"
    >
      {mainContent}
    </PageLayout>
  );
};

export default AdminMain;

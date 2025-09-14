/**
 * AdminDashboardCards - Dashboard principal con cards para cada módulo administrativo
 * Vista de tarjetas moderna y responsive para navegación rápida
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AdminDashboardCards = ({ sections = [], onSectionClick }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeInvitations: 0,
    passkeyUsers: 0,
    systemHealth: 'good'
  });

  // Simular carga de estadísticas (en implementación real se conectaría a Firebase)
  useEffect(() => {
    const loadStats = async () => {
      // Aquí se cargarían las estadísticas reales del sistema
      setTimeout(() => {
        setStats({
          totalUsers: 24,
          activeInvitations: 3,
          passkeyUsers: 18,
          systemHealth: 'excellent'
        });
      }, 1000);
    };

    loadStats();
  }, []);

  // Configuración de cards con estadísticas y acciones rápidas
  const dashboardCards = [
    {
      id: 'quick-stats',
      title: 'Estadísticas Generales',
      type: 'stats',
      span: 'col-span-2',
      content: {
        stats: [
          { label: 'Usuarios Totales', value: stats.totalUsers, icon: '👥', color: 'blue' },
          { label: 'Invitaciones Activas', value: stats.activeInvitations, icon: '📧', color: 'green' },
          { label: 'Usuarios con Passkeys', value: stats.passkeyUsers, icon: '🔐', color: 'purple' },
          { label: 'Estado del Sistema', value: stats.systemHealth, icon: '💚', color: 'emerald' }
        ]
      }
    },
    {
      id: 'quick-actions',
      title: 'Acciones Rápidas',
      type: 'actions',
      span: 'col-span-1',
      content: {
        actions: [
          { label: 'Nueva Invitación', icon: '➕', action: () => onSectionClick('invitations'), color: 'green' },
          { label: 'Gestionar Usuarios', icon: '👥', action: () => onSectionClick('users'), color: 'blue' },
          { label: 'Configurar Passkeys', icon: '🔐', action: () => onSectionClick('passkeys'), color: 'purple' }
        ]
      }
    }
  ];

  // Cards de secciones principales
  const sectionCards = Array.isArray(sections) 
    ? sections.filter(section => 
        ['invitations', 'users', 'passkeys', 'prices', 'settings'].includes(section.id)
      )
    : [];

  // Cards de herramientas y diagnóstico
  const toolCards = Array.isArray(sections)
    ? sections.filter(section => 
        ['diagnostic', 'background', 'reset'].includes(section.id)
      )
    : [];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -4,
      scale: 1.02,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.2 }
    }
  };

  const statsCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="admin-dashboard-cards">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <motion.div 
          className="welcome-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Bienvenido al Panel de Administración</h2>
          <p>Gestiona usuarios, configuraciones y herramientas del sistema Forestech</p>
        </motion.div>

        <motion.div 
          className="dashboard-time"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="time-label">Última actualización</span>
          <span className="time-value">{new Date().toLocaleTimeString('es-ES')}</span>
        </motion.div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="dashboard-grid">
        {/* Cards especiales (estadísticas y acciones rápidas) */}
        {dashboardCards.map((card, index) => (
          <motion.div
            key={card.id}
            className={`dashboard-card special-card ${card.span} ${card.type}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="card-header">
              <h3>{card.title}</h3>
            </div>

            <div className="card-content">
              {card.type === 'stats' && (
                <div className="stats-grid">
                  {card.content.stats.map((stat, statIndex) => (
                    <motion.div
                      key={stat.label}
                      className={`stat-item ${stat.color}`}
                      variants={statsCardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.5 + statIndex * 0.1 }}
                    >
                      <div className="stat-icon">{stat.icon}</div>
                      <div className="stat-info">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {card.type === 'actions' && (
                <div className="actions-grid">
                  {card.content.actions.map((action, actionIndex) => (
                    <motion.button
                      key={action.label}
                      className={`action-btn ${action.color}`}
                      onClick={action.action}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + actionIndex * 0.1 }}
                    >
                      <span className="action-icon">{action.icon}</span>
                      <span className="action-label">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Secciones principales */}
        <div className="section-divider">
          <h3>Módulos Principales</h3>
          <div className="divider-line"></div>
        </div>

        {sectionCards.map((section, index) => (
          <motion.div
            key={section.id}
            className={`dashboard-card section-card ${section.color}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ duration: 0.3, delay: (index + 2) * 0.1 }}
            onClick={() => onSectionClick(section.id)}
          >
            <div className="card-background">
              <div className={`card-pattern ${section.color}`}></div>
            </div>

            <div className="card-content">
              <div className={`card-icon ${section.color}`}>
                {section.icon}
              </div>
              
              <div className="card-info">
                <h4>{section.title}</h4>
                <p>{section.subtitle}</p>
              </div>

              <div className="card-action">
                <span className="action-text">Abrir</span>
                <span className="action-arrow">→</span>
              </div>
            </div>

            {/* Notificaciones/badges */}
            {section.id === 'invitations' && (
              <div className="card-badge">
                <span>3 Pendientes</span>
              </div>
            )}

            {section.id === 'passkeys' && (
              <div className="card-badge success">
                <span>Activo</span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Herramientas y diagnóstico */}
        <div className="section-divider">
          <h3>Herramientas y Diagnóstico</h3>
          <div className="divider-line"></div>
        </div>

        {toolCards.map((section, index) => (
          <motion.div
            key={section.id}
            className={`dashboard-card tool-card ${section.color}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ duration: 0.3, delay: (index + sectionCards.length + 4) * 0.1 }}
            onClick={() => onSectionClick(section.id)}
          >
            <div className="card-content">
              <div className={`card-icon ${section.color}`}>
                {section.icon}
              </div>
              
              <div className="card-info">
                <h4>{section.title}</h4>
                <p>{section.subtitle}</p>
              </div>

              {section.id === 'reset' && (
                <div className="card-warning">
                  ⚠️ Usar con precaución
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer del dashboard */}
      <motion.div 
        className="dashboard-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="footer-info">
          <span>Forestech Admin Dashboard v2.0</span>
          <span>Sistema de gestión forestal empresarial</span>
        </div>
        <div className="footer-status">
          <div className="status-indicator online"></div>
          <span>Sistema en línea</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardCards;
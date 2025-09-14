/**
 * AdminSidebar - Sidebar moderno para el dashboard administrativo
 * Navegación responsive con estados activos y animaciones fluidas
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = ({ 
  sections, 
  activeSection, 
  onSectionChange, 
  collapsed, 
  onToggleCollapse, 
  isMobile,
  user,
  userProfile 
}) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  // Variantes de animación para Framer Motion
  const sidebarVariants = {
    expanded: {
      width: isMobile ? '280px' : '320px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: {
      width: isMobile ? '0px' : '80px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const menuItemVariants = {
    hover: {
      scale: 1.02,
      x: 4,
      transition: { duration: 0.2 }
    },
    active: {
      scale: 1.02,
      x: 8,
      transition: { duration: 0.2 }
    }
  };

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    if (isMobile) {
      onToggleCollapse();
    }
  };

  return (
    <>
      {/* Sidebar principal */}
      <motion.aside 
        className="admin-sidebar"
        variants={sidebarVariants}
        animate={collapsed ? 'collapsed' : 'expanded'}
        initial={false}
      >
        {/* Header del sidebar */}
        <div className="sidebar-header">
          <motion.div 
            className="sidebar-brand"
            animate={{ opacity: collapsed && !isMobile ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="brand-icon">🌲</div>
            <AnimatePresence>
              {(!collapsed || isMobile) && (
                <motion.div
                  className="brand-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3>Forestech</h3>
                  <span>Admin Panel</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Botón toggle (solo desktop) */}
          {!isMobile && (
            <motion.button
              className="sidebar-toggle"
              onClick={onToggleCollapse}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ◀
            </motion.button>
          )}

          {/* Botón cerrar (solo mobile) */}
          {isMobile && (
            <motion.button
              className="sidebar-close"
              onClick={onToggleCollapse}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          )}
        </div>

        {/* Navegación principal */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <AnimatePresence>
              {(!collapsed || isMobile) && (
                <motion.h4 
                  className="nav-section-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  Panel de Control
                </motion.h4>
              )}
            </AnimatePresence>

            <ul className="nav-menu">
              {sections.map((section, index) => {
                const isActive = activeSection === section.id;
                const isHovered = hoveredSection === section.id;

                return (
                  <motion.li 
                    key={section.id}
                    className="nav-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <motion.button
                      className={`nav-link ${isActive ? 'active' : ''} ${section.color}`}
                      onClick={() => handleSectionClick(section.id)}
                      onHoverStart={() => setHoveredSection(section.id)}
                      onHoverEnd={() => setHoveredSection(null)}
                      variants={menuItemVariants}
                      animate={
                        isActive ? 'active' : 
                        isHovered ? 'hover' : 
                        'initial'
                      }
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Indicador activo */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            className="active-indicator"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            exit={{ scaleY: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Icono */}
                      <div className={`nav-icon ${section.color}`}>
                        {section.icon}
                      </div>

                      {/* Texto (solo cuando no está colapsado) */}
                      <AnimatePresence>
                        {(!collapsed || isMobile) && (
                          <motion.div
                            className="nav-text"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="nav-title">{section.title}</span>
                            <span className="nav-subtitle">{section.subtitle}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Tooltip para modo colapsado (solo desktop) */}
                      {collapsed && !isMobile && (
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              className="nav-tooltip"
                              initial={{ opacity: 0, x: -10, scale: 0.8 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -10, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="tooltip-content">
                                <span className="tooltip-title">{section.title}</span>
                                <span className="tooltip-subtitle">{section.subtitle}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}

                      {/* Notificación badge (ejemplo para futuras funcionalidades) */}
                      {section.id === 'invitations' && (
                        <div className="nav-badge">
                          <span>3</span>
                        </div>
                      )}
                    </motion.button>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Footer del sidebar con información del usuario */}
        <div className="sidebar-footer">
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                className="user-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="user-avatar">
                  <div className="avatar-icon">👤</div>
                  <div className="user-status online"></div>
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.displayName || user?.email?.split('@')[0]}</span>
                  <span className="user-role">{userProfile?.role || 'admin'}</span>
                </div>
                <div className="user-actions">
                  <motion.button
                    className="action-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Configuraciones"
                  >
                    ⚙️
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Versión compacta para sidebar colapsado */}
          {collapsed && !isMobile && (
            <motion.div
              className="user-info-compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="user-avatar-compact">
                <div className="avatar-icon">👤</div>
                <div className="user-status online"></div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Toggle button para mobile */}
      {isMobile && collapsed && (
        <motion.button
          className="mobile-sidebar-toggle"
          onClick={onToggleCollapse}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="toggle-icon">☰</span>
        </motion.button>
      )}
    </>
  );
};

export default AdminSidebar;
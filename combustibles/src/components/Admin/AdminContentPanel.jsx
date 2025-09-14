/**
 * AdminContentPanel - Panel de contenido para secciones que no tienen componentes dedicados
 * Maneja invitaciones, usuarios, configuraciones y diagnóstico
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createInvitation,
  getInvitations,
  cancelInvitation,
} from '../../firebase/invitationService';
import { ROLES } from '../../constants/roles';

const AdminContentPanel = ({ section, _user, _userProfile }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Cargar datos según la sección
  useEffect(() => {
    if (section === 'invitations') {
      loadInvitations();
    }
  }, [section, loadInvitations]);

  const loadInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCancelInvitation = async (invitationId) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta invitación?')) return;

    try {
      await cancelInvitation(invitationId);
      await loadInvitations();
      alert('Invitación cancelada exitosamente');
    } catch (error) {
      console.error('Error canceling invitation:', error);
      alert('Error cancelando invitación');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', class: 'status-pending' },
      used: { text: 'Usada', class: 'status-used' },
      cancelled: { text: 'Cancelada', class: 'status-cancelled' },
      expired: { text: 'Expirada', class: 'status-expired' },
    };
    return badges[status] || { text: status, class: 'status-unknown' };
  };

  const getRoleName = (role) => {
    const roleNames = {
      admin: 'Administrador',
      contador: 'Contador',
      cliente: 'Cliente',
    };
    return roleNames[role] || role;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Renderizar contenido de invitaciones
  const renderInvitationsContent = () => (
    <div className="invitations-content">
      <div className="content-header">
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{invitations.filter(inv => inv.status === 'pending').length}</span>
            <span className="stat-label">Pendientes</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{invitations.filter(inv => inv.status === 'used').length}</span>
            <span className="stat-label">Utilizadas</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{invitations.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        <motion.button 
          className="create-button"
          onClick={() => setShowCreateModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">➕</span>
          Crear Invitación
        </motion.button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Cargando invitaciones...</span>
        </div>
      ) : (
        <motion.div 
          className="invitations-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {invitations.map((invitation, index) => {
            const status = getStatusBadge(invitation.status);
            return (
              <motion.div
                key={invitation.id}
                className={`invitation-card ${status.class}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)' }}
              >
                <div className="card-header">
                  <div className={`status-badge ${status.class}`}>
                    {status.text}
                  </div>
                  <div className="card-date">
                    {formatDate(invitation.createdAt)}
                  </div>
                </div>

                <div className="card-content">
                  <div className="invitation-code">
                    <span className="code-label">Código:</span>
                    <span className="code-value">{invitation.code}</span>
                  </div>
                  
                  <div className="invitation-role">
                    <span className="role-icon">👤</span>
                    <span className="role-name">{getRoleName(invitation.role)}</span>
                  </div>

                  {invitation.usedBy && (
                    <div className="invitation-used">
                      <span className="used-label">Utilizada por:</span>
                      <span className="used-value">{invitation.usedBy}</span>
                    </div>
                  )}

                  {invitation.expiresAt && (
                    <div className="invitation-expires">
                      <span className="expires-label">Expira:</span>
                      <span className="expires-value">{formatDate(invitation.expiresAt)}</span>
                    </div>
                  )}
                </div>

                {invitation.status === 'pending' && (
                  <div className="card-actions">
                    <motion.button
                      className="cancel-button"
                      onClick={() => handleCancelInvitation(invitation.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancelar
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}

          {invitations.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📧</div>
              <h3>No hay invitaciones</h3>
              <p>Crea tu primera invitación para dar acceso a nuevos usuarios</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );

  // Renderizar contenido coming soon para otras secciones
  const renderComingSoonContent = () => (
    <div className="coming-soon-content">
      <motion.div 
        className="coming-soon-card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="coming-soon-icon">🚧</div>
        <h3>Próximamente</h3>
        <p>Esta funcionalidad está en desarrollo y estará disponible pronto.</p>
        
        {section === 'users' && (
          <div className="feature-preview">
            <h4>Funcionalidades planeadas:</h4>
            <ul>
              <li>✨ Gestión completa de usuarios</li>
              <li>✨ Asignación de roles y permisos</li>
              <li>✨ Activar/desactivar cuentas</li>
              <li>✨ Historial de actividad</li>
            </ul>
          </div>
        )}

        {section === 'settings' && (
          <div className="feature-preview">
            <h4>Configuraciones disponibles:</h4>
            <ul>
              <li>✨ Configuraciones generales del sistema</li>
              <li>✨ Notificaciones automáticas</li>
              <li>✨ Parámetros de seguridad</li>
              <li>✨ Integraciones externas</li>
            </ul>
          </div>
        )}

        {section === 'diagnostic' && (
          <div className="feature-preview">
            <h4>Herramientas de diagnóstico:</h4>
            <ul>
              <li>✨ Test de conectividad WebAuthn</li>
              <li>✨ Validación de certificados</li>
              <li>✨ Logs del sistema</li>
              <li>✨ Monitoreo de rendimiento</li>
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="admin-content-panel">
      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {section === 'invitations' && renderInvitationsContent()}
          {['users', 'settings', 'diagnostic'].includes(section) && renderComingSoonContent()}
        </motion.div>
      </AnimatePresence>

      {/* Modal para crear invitación */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateInvitationModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => {
              setShowCreateModal(false);
              loadInvitations();
            }}
            creating={creating}
            setCreating={setCreating}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal para crear invitación
const CreateInvitationModal = ({ onClose, onCreated, creating, setCreating }) => {
  const [formData, setFormData] = useState({
    role: 'cliente',
    expiresInDays: 7,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (creating) return;

    setCreating(true);
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expiresInDays));

      await createInvitation({
        role: formData.role,
        expiresAt: expiresAt,
      });

      onCreated();
      alert('Invitación creada exitosamente');
    } catch (error) {
      console.error('Error creating invitation:', error);
      alert('Error creando invitación');
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Crear Nueva Invitación</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Rol del Usuario</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              required
            >
              {Object.entries(ROLES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Días hasta expiración</label>
            <select
              value={formData.expiresInDays}
              onChange={(e) => setFormData(prev => ({ ...prev, expiresInDays: e.target.value }))}
              required
            >
              <option value={1}>1 día</option>
              <option value={3}>3 días</option>
              <option value={7}>1 semana</option>
              <option value={14}>2 semanas</option>
              <option value={30}>1 mes</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={creating}>
              {creating ? 'Creando...' : 'Crear Invitación'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminContentPanel;
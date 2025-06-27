// combustibles/src/components/Admin/AdminMain.jsx
// Componente principal del módulo de administración
import React, { useState, useEffect } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import { createInvitation, getInvitations, cancelInvitation } from '../../firebase/invitationService';
import { ROLES } from '../../constants/roles';
import './Admin.css';

const AdminMain = () => {
  const { user, userProfile } = useCombustibles();
  const [activeTab, setActiveTab] = useState('invitations');
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state para crear invitación
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: ROLES.CLIENTE
  });

  // Cargar invitaciones al montar el componente
  useEffect(() => {
    if (user && userProfile?.role === 'admin') {
      loadInvitations();
    }
  }, [user, userProfile]);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const result = await getInvitations(user.uid);
      if (result.success) {
        setInvitations(result.invitations);
      } else {
        console.error('Error loading invitations:', result.error);
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvitation = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const result = await createInvitation(formData, user.uid);
      if (result.success) {
        // Limpiar formulario
        setFormData({
          email: '',
          name: '',
          role: ROLES.CLIENTE
        });
        setShowCreateModal(false);
        
        // Recargar invitaciones
        await loadInvitations();
        
        alert(`Invitación creada exitosamente!\nCódigo: ${result.invitation.code}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating invitation:', error);
      alert('Error creando invitación');
    } finally {
      setCreating(false);
    }
  };

  const handleCancelInvitation = async (invitationId) => {
    if (!confirm('¿Estás seguro de cancelar esta invitación?')) return;

    try {
      const result = await cancelInvitation(invitationId, user.uid);
      if (result.success) {
        await loadInvitations();
        alert('Invitación cancelada exitosamente');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      alert('Error cancelando invitación');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendiente', class: 'status-pending' },
      used: { text: 'Usada', class: 'status-used' },
      cancelled: { text: 'Cancelada', class: 'status-cancelled' },
      expired: { text: 'Expirada', class: 'status-expired' }
    };
    return badges[status] || { text: status, class: 'status-unknown' };
  };

  const getRoleName = (role) => {
    const roleNames = {
      admin: 'Administrador',
      contador: 'Contador',
      cliente: 'Cliente'
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
      minute: '2-digit'
    });
  };

  if (userProfile?.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <h2>⛔ Acceso Denegado</h2>
        <p>Solo los administradores pueden acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div className="admin-main">
      <div className="admin-header">
        <h1>⚙️ Administración del Sistema</h1>
        <p>Gestión de usuarios y configuraciones</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'invitations' ? 'active' : ''}`}
          onClick={() => setActiveTab('invitations')}
        >
          🎫 Invitaciones
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Configuración
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'invitations' && (
          <div className="invitations-section">
            <div className="section-header">
              <h2>Gestión de Invitaciones</h2>
              <button 
                className="create-button"
                onClick={() => setShowCreateModal(true)}
              >
                + Crear Invitación
              </button>
            </div>

            {loading ? (
              <div className="loading">Cargando invitaciones...</div>
            ) : (
              <div className="invitations-table">
                <table>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Email</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Creada</th>
                      <th>Expira</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map(invitation => {
                      const status = getStatusBadge(invitation.status);
                      return (
                        <tr key={invitation.id}>
                          <td>
                            <code className="invitation-code">{invitation.code}</code>
                          </td>
                          <td>{invitation.targetEmail}</td>
                          <td>{invitation.targetName || '-'}</td>
                          <td>{getRoleName(invitation.targetRole)}</td>
                          <td>
                            <span className={`status-badge ${status.class}`}>
                              {status.text}
                            </span>
                          </td>
                          <td>{formatDate(invitation.createdAt)}</td>
                          <td>{formatDate(invitation.expiresAt)}</td>
                          <td>
                            {invitation.status === 'pending' && (
                              <button
                                className="cancel-button"
                                onClick={() => handleCancelInvitation(invitation.id)}
                              >
                                Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {invitations.length === 0 && (
                  <div className="empty-state">
                    <p>No hay invitaciones creadas</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>👥 Usuarios del Sistema</h2>
            <div className="coming-soon">
              <span>🚧 En desarrollo</span>
              <p>Próximamente: Lista de usuarios registrados, edición de permisos, y estadísticas.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>⚙️ Configuración del Sistema</h2>
            <div className="coming-soon">
              <span>🚧 En desarrollo</span>
              <p>Próximamente: Configuraciones generales, notificaciones, y parámetros del sistema.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear invitación */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Crear Nueva Invitación</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateInvitation} className="invitation-form">
              <div className="form-group">
                <label htmlFor="email">Email del usuario:</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Nombre (opcional):</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nombre del usuario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Rol:</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value={ROLES.CLIENTE}>Cliente</option>
                  <option value={ROLES.CONTADOR}>Contador</option>
                  <option value={ROLES.ADMIN}>Administrador</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="create-button"
                  disabled={creating}
                >
                  {creating ? 'Creando...' : 'Crear Invitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMain;
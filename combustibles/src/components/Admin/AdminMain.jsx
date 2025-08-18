// combustibles/src/components/Admin/AdminMain.jsx
// Componente principal del módulo de administración
import React, { useState, useEffect, useCallback } from 'react';
import { useCombustibles } from '../../contexts/CombustiblesContext';
import {
  createInvitation,
  getInvitations,
  cancelInvitation,
} from '../../firebase/invitationService';
import { ROLES } from '../../constants/roles';
import DataReset from './DataReset';
import BackgroundImageManager from './BackgroundImageManager';
import PriceServiceControl from '../Services/PriceServiceControl';
import { PageLayout } from '../shared';
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
    role: ROLES.CLIENTE,
  });

  // Cargar invitaciones al montar el componente
  useEffect(() => {
    if (user && userProfile?.role === 'admin') {
      loadInvitations();
    }
  }, [user, userProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadInvitations = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

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
          role: ROLES.CLIENTE,
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

  if (userProfile?.role !== 'admin') {
    return (
      <div className="admin-unauthorized sap-theme">
        <h2>⛔ Acceso Denegado</h2>
        <p>Solo los administradores pueden acceder a esta sección.</p>
      </div>
    );
  }

  const headerActions = (
    <div className="admin-tabs sap-theme">
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
      <button
        className={`tab-button ${activeTab === 'prices' ? 'active' : ''}`}
        onClick={() => setActiveTab('prices')}
      >
        💰 Precios Automáticos
      </button>
      <button
        className={`tab-button ${activeTab === 'background' ? 'active' : ''}`}
        onClick={() => setActiveTab('background')}
      >
        🖼️ Imagen Login
      </button>
      <button
        className={`tab-button ${activeTab === 'reset' ? 'active' : ''}`}
        onClick={() => setActiveTab('reset')}
      >
        🔥 Reset de Datos
      </button>
    </div>
  );

  const statsComponent = null;

  const filtersComponent = null;

  const mainContent = (
    <>
      {activeTab === 'invitations' && (
        <div className="invitations-section sap-theme">
          <div className="section-header sap-theme">
            <h2>Gestión de Invitaciones</h2>
            <button className="create-button sap-theme" onClick={() => setShowCreateModal(true)}>
              + Crear Invitación
            </button>
          </div>

          {loading ? (
            <div className="loading sap-theme">Cargando invitaciones...</div>
          ) : (
            <div className="invitations-table sap-theme">
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
                  {invitations.map((invitation) => {
                    const status = getStatusBadge(invitation.status);
                    return (
                      <tr key={invitation.id}>
                        <td>
                          <code className="invitation-code sap-theme">{invitation.code}</code>
                        </td>
                        <td>{invitation.targetEmail}</td>
                        <td>{invitation.targetName || '-'}</td>
                        <td>{getRoleName(invitation.targetRole)}</td>
                        <td>
                          <span className={`status-badge ${status.class}`}>{status.text}</span>
                        </td>
                        <td>{formatDate(invitation.createdAt)}</td>
                        <td>{formatDate(invitation.expiresAt)}</td>
                        <td>
                          {invitation.status === 'pending' && (
                            <button
                              className="cancel-button sap-theme"
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
                <div className="empty-state sap-theme">
                  <p>No hay invitaciones creadas</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section sap-theme">
          <h2>👥 Usuarios del Sistema</h2>
          <div className="coming-soon sap-theme">
            <span>🚧 En desarrollo</span>
            <p>Próximamente: Lista de usuarios registrados, edición de permisos, y estadísticas.</p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings-section sap-theme">
          <h2>⚙️ Configuración del Sistema</h2>
          <div className="coming-soon sap-theme">
            <span>🚧 En desarrollo</span>
            <p>
              Próximamente: Configuraciones generales, notificaciones, y parámetros del sistema.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'prices' && (
        <div className="prices-section sap-theme">
          <PriceServiceControl userRole={userProfile?.role} />
        </div>
      )}

      {activeTab === 'background' && <BackgroundImageManager />}

      {activeTab === 'reset' && <DataReset />}
    </>
  );

  return (
    <PageLayout
      title="⚙️ Administración del Sistema"
      subtitle="Gestión de usuarios y configuraciones"
      actions={headerActions}
      stats={statsComponent}
      filters={filtersComponent}
      loading={loading}
      showStats={false}
      showFilters={false}
    >
      {mainContent}

      {/* Modal para crear invitación */}
      {showCreateModal && (
        <div className="modal-overlay sap-theme" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content sap-theme" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header sap-theme">
              <h3>Crear Nueva Invitación</h3>
              <button className="modal-close sap-theme" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateInvitation} className="invitation-form sap-theme">
              <div className="form-group sap-theme">
                <label htmlFor="email">Email del usuario:</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className="form-group sap-theme">
                <label htmlFor="name">Nombre (opcional):</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre del usuario"
                />
              </div>

              <div className="form-group sap-theme">
                <label htmlFor="role">Rol:</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value={ROLES.CLIENTE}>Cliente</option>
                  <option value={ROLES.CONTADOR}>Contador</option>
                  <option value={ROLES.ADMIN}>Administrador</option>
                </select>
              </div>

              <div className="form-actions sap-theme">
                <button
                  type="button"
                  className="cancel-button sap-theme"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="create-button sap-theme" disabled={creating}>
                  {creating ? 'Creando...' : 'Crear Invitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AdminMain;

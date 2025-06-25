/**
 * Panel de Administración para Forestech
 * Permite gestionar usuarios, roles y configuraciones del sistema
 * Solo accesible para usuarios con rol Admin
 */

import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getAllUsers, changeUserRole, createNewUser } from '../firebase/userService';
import { AdminOnly } from './ProtectedRoute';
import { ROLES, getRoleDescription, getRoleColor } from '../constants/roles';
import { analyticsEvents } from '../firebase/analytics';

const AdminPanel = () => {
  const { user, userProfile, reloadUserProfile } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('users');
  const [actionLoading, setActionLoading] = useState(null);
  
  // Estados para crear usuario
  const [createUserForm, setCreateUserForm] = useState({
    email: '',
    password: '',
    displayName: '',
    role: ROLES.CLIENTE
  });
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [createUserSuccess, setCreateUserSuccess] = useState(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAllUsers(user.uid);
      if (result.success) {
        setUsers(result.users);
        analyticsEvents.custom('admin_panel_viewed', {
          users_count: result.users.length
        });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error cargando usuarios');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole, currentEmail) => {
    if (!user) return;
    
    setActionLoading(userId);
    
    try {
      const result = await changeUserRole(userId, newRole, user.uid);
      
      if (result.success) {
        // Recargar lista de usuarios
        await loadUsers();
        
        // Si cambié mi propio rol, recargar mi perfil
        if (userId === user.uid) {
          await reloadUserProfile();
        }
        
        analyticsEvents.custom('admin_role_changed', {
          target_email: currentEmail,
          new_role: newRole,
          admin_email: user.email
        });
        
        console.log('✅ Rol actualizado exitosamente');
      } else {
        setError(result.message);
        console.error('❌ Error cambiando rol:', result.message);
      }
    } catch (err) {
      setError('Error actualizando rol');
      console.error('Error changing role:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setCreateUserLoading(true);
    setError(null);
    setCreateUserSuccess(null);
    
    try {
      const result = await createNewUser(createUserForm, user.uid);
      
      if (result.success) {
        setCreateUserSuccess({
          message: result.message,
          temporaryPassword: result.temporaryPassword,
          userId: result.userId
        });
        
        // Limpiar formulario
        setCreateUserForm({
          email: '',
          password: '',
          displayName: '',
          role: ROLES.CLIENTE
        });
        
        // Recargar lista de usuarios
        await loadUsers();
        
        analyticsEvents.custom('admin_user_created', {
          new_user_role: createUserForm.role,
          admin_email: user.email
        });
        
        console.log('✅ Usuario creado exitosamente');
      } else {
        setError(result.message);
        console.error('❌ Error creando usuario:', result.message);
      }
    } catch (err) {
      setError('Error creando usuario');
      console.error('Error creating user:', err);
    } finally {
      setCreateUserLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setCreateUserForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Manejar tanto Firestore Timestamp como strings ISO
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Fecha inválida';
    }
  };

  const getUserStats = () => {
    const roleStats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total: users.length,
      admins: roleStats.admin || 0,
      contadores: roleStats.contador || 0,
      clientes: roleStats.cliente || 0
    };
  };

  if (loading) {
    return (
      <AdminOnly>
        <div className="admin-panel loading">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando panel de administración...</p>
          </div>
        </div>
      </AdminOnly>
    );
  }

  const stats = getUserStats();

  return (
    <AdminOnly>
      <div className="admin-panel">
        <div className="admin-header">
          <div className="admin-title">
            <h2>Panel de Administración</h2>
            <p>Gestión de usuarios y configuraciones del sistema</p>
          </div>
          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Usuarios</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.admins}</span>
              <span className="stat-label">Admins</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.contadores}</span>
              <span className="stat-label">Contadores</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.clientes}</span>
              <span className="stat-label">Clientes</span>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-button ${selectedTab === 'users' ? 'active' : ''}`}
            onClick={() => setSelectedTab('users')}
          >
            👥 Gestión de Usuarios
          </button>
          <button 
            className={`tab-button ${selectedTab === 'create-user' ? 'active' : ''}`}
            onClick={() => setSelectedTab('create-user')}
          >
            ➕ Crear Usuario
          </button>
          <button 
            className={`tab-button ${selectedTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setSelectedTab('notifications')}
          >
            🔔 Notificaciones
          </button>
          <button 
            className={`tab-button ${selectedTab === 'settings' ? 'active' : ''}`}
            onClick={() => setSelectedTab('settings')}
          >
            ⚙️ Configuraciones
          </button>
        </div>

        <div className="admin-content">
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button onClick={() => setError(null)} className="error-close">×</button>
            </div>
          )}

          {selectedTab === 'users' && (
            <div className="users-management">
              <div className="users-header">
                <h3>Gestión de Usuarios</h3>
                <button onClick={loadUsers} className="refresh-button">
                  🔄 Recargar
                </button>
              </div>
              
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Rol Actual</th>
                      <th>Último Login</th>
                      <th>Creado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userData) => (
                      <tr key={userData.uid} className="user-row">
                        <td className="user-info">
                          <div className="user-avatar">
                            {userData.displayName ? userData.displayName.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="user-details">
                            <span className="user-name">{userData.displayName || 'Sin nombre'}</span>
                            <span className="user-id">ID: {userData.uid.substring(0, 8)}...</span>
                          </div>
                        </td>
                        <td className="user-email">{userData.email}</td>
                        <td className="user-role">
                          <span 
                            className="role-badge" 
                            style={{ backgroundColor: getRoleColor(userData.role) }}
                          >
                            {getRoleDescription(userData.role)}
                          </span>
                        </td>
                        <td className="user-date">{formatDate(userData.lastLogin)}</td>
                        <td className="user-date">{formatDate(userData.createdAt)}</td>
                        <td className="user-actions">
                          {userData.email !== userProfile?.email && (
                            <select
                              value={userData.role}
                              onChange={(e) => handleRoleChange(userData.uid, e.target.value, userData.email)}
                              disabled={actionLoading === userData.uid}
                              className="role-selector"
                            >
                              <option value={ROLES.CLIENTE}>Cliente</option>
                              <option value={ROLES.CONTADOR}>Contador</option>
                              <option value={ROLES.ADMIN}>Admin</option>
                            </select>
                          )}
                          {userData.email === userProfile?.email && (
                            <span className="current-user-badge">Tú</span>
                          )}
                          {actionLoading === userData.uid && (
                            <div className="action-loading">
                              <div className="mini-spinner"></div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'create-user' && (
            <div className="create-user-management">
              <div className="create-user-header">
                <h3>Crear Nuevo Usuario</h3>
                <p>Añade un nuevo usuario al sistema con el rol apropiado</p>
              </div>

              {createUserSuccess && (
                <div className="success-banner">
                  <span className="success-icon">✅</span>
                  <div className="success-content">
                    <p><strong>{createUserSuccess.message}</strong></p>
                    <div className="user-credentials">
                      <p><strong>Credenciales temporales:</strong></p>
                      <p>Email: <code>{createUserForm.email}</code></p>
                      <p>Contraseña: <code>{createUserSuccess.temporaryPassword}</code></p>
                      <small>⚠️ Comunica estas credenciales al usuario de forma segura</small>
                    </div>
                  </div>
                  <button onClick={() => setCreateUserSuccess(null)} className="success-close">×</button>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="create-user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="user-email">Email</label>
                    <input
                      id="user-email"
                      type="email"
                      value={createUserForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="usuario@empresa.com"
                      required
                      disabled={createUserLoading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="user-name">Nombre Completo</label>
                    <input
                      id="user-name"
                      type="text"
                      value={createUserForm.displayName}
                      onChange={(e) => handleFormChange('displayName', e.target.value)}
                      placeholder="Juan Pérez"
                      required
                      disabled={createUserLoading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="user-password">Contraseña Temporal</label>
                    <input
                      id="user-password"
                      type="password"
                      value={createUserForm.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      minLength="6"
                      required
                      disabled={createUserLoading}
                    />
                    <small>El usuario deberá cambiar esta contraseña en su primer login</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="user-role">Rol del Usuario</label>
                    <select
                      id="user-role"
                      value={createUserForm.role}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                      required
                      disabled={createUserLoading}
                    >
                      <option value={ROLES.CLIENTE}>Cliente - Acceso básico</option>
                      <option value={ROLES.CONTADOR}>Contador - Gestión de liquidaciones</option>
                    </select>
                    <small>No se pueden crear múltiples administradores</small>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="create-user-button"
                    disabled={createUserLoading}
                  >
                    {createUserLoading ? (
                      <>
                        <div className="button-spinner"></div>
                        Creando Usuario...
                      </>
                    ) : (
                      '➕ Crear Usuario'
                    )}
                  </button>
                </div>
              </form>

              <div className="create-user-help">
                <h4>📋 Información Importante</h4>
                <ul>
                  <li><strong>Cliente:</strong> Puede crear y gestionar sus propias liquidaciones</li>
                  <li><strong>Contador:</strong> Acceso completo a liquidaciones + funciones contables</li>
                  <li><strong>Admin:</strong> Solo existe un administrador principal del sistema</li>
                  <li>El usuario recibirá sus credenciales por email (próximamente)</li>
                  <li>Debe cambiar la contraseña temporal en su primer login</li>
                </ul>
              </div>
            </div>
          )}

          {selectedTab === 'notifications' && (
            <div className="notifications-management">
              <h3>Centro de Notificaciones</h3>
              <div className="notification-placeholder">
                <div className="coming-soon">
                  <span className="coming-soon-icon">🚧</span>
                  <h4>Notificaciones Push - Próximamente</h4>
                  <p>Sistema de notificaciones Firebase Cloud Messaging en desarrollo</p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="settings-management">
              <h3>Configuraciones del Sistema</h3>
              <div className="settings-placeholder">
                <div className="coming-soon">
                  <span className="coming-soon-icon">⚙️</span>
                  <h4>Configuraciones Avanzadas</h4>
                  <p>Panel de configuraciones del sistema próximamente disponible</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-panel {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .admin-panel.loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }
        
        .loading-spinner {
          text-align: center;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .admin-header {
          margin-bottom: 30px;
        }
        
        .admin-title h2 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 28px;
        }
        
        .admin-title p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }
        
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }
        
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
          border: 1px solid #e1e5e9;
        }
        
        .stat-number {
          display: block;
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .admin-tabs {
          display: flex;
          border-bottom: 2px solid #e1e5e9;
          margin-bottom: 30px;
        }
        
        .tab-button {
          padding: 12px 24px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 16px;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }
        
        .tab-button:hover {
          color: #007bff;
          background: #f8f9fa;
        }
        
        .tab-button.active {
          color: #007bff;
          border-bottom-color: #007bff;
          font-weight: 600;
        }
        
        .error-banner {
          background: #f8d7da;
          color: #721c24;
          padding: 12px 16px;
          border-radius: 6px;
          border: 1px solid #f5c6cb;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .error-close {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: #721c24;
        }
        
        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .users-header h3 {
          margin: 0;
          color: #333;
        }
        
        .refresh-button {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        
        .refresh-button:hover {
          background: #0056b3;
        }
        
        .users-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
          border: 1px solid #e1e5e9;
        }
        
        .users-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .users-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 1px solid #e1e5e9;
        }
        
        .users-table td {
          padding: 12px;
          border-bottom: 1px solid #e1e5e9;
        }
        
        .user-row:hover {
          background: #f8f9fa;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .user-name {
          font-weight: 600;
          color: #333;
        }
        
        .user-id {
          font-size: 12px;
          color: #666;
          font-family: monospace;
        }
        
        .user-email {
          color: #495057;
          font-family: monospace;
          font-size: 14px;
        }
        
        .role-badge {
          display: inline-block;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .user-date {
          color: #666;
          font-size: 14px;
        }
        
        .user-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .role-selector {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }
        
        .role-selector:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .current-user-badge {
          background: #28a745;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .action-loading {
          display: flex;
          align-items: center;
        }
        
        .mini-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .coming-soon {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }
        
        .coming-soon-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
        
        .coming-soon h4 {
          margin: 0 0 8px 0;
          color: #333;
        }
        
        .coming-soon p {
          margin: 0;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .admin-panel {
            padding: 15px;
          }
          
          .admin-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .users-table-container {
            overflow-x: auto;
          }
          
          .users-table {
            min-width: 800px;
          }
          
          .tab-button {
            font-size: 14px;
            padding: 10px 16px;
          }
        }
      `}</style>
    </AdminOnly>
  );
};

export default AdminPanel;
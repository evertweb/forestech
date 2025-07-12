/**
 * Context de usuario con sistema de roles para Forestech
 * Proporciona estado global de autenticación y autorización
 * Mantiene consistencia con los patrones existentes del proyecto
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getOrCreateUserProfile } from '../firebase/userService';
import { ROLES, PERMISSIONS } from '../constants/roles';
import { analyticsEvents } from '../firebase/analytics';

// Crear contexto
const UserContext = createContext();

// Hook personalizado para usar el contexto
// TODO: Separar componente de constantes/funciones para Fast Refresh
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe ser usado dentro de un UserProvider');
  }
  return context;
};

/**
 * Provider del contexto de usuario
 * Maneja el estado de autenticación y roles globalmente
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        setError(null);

        if (firebaseUser) {
          console.log('🔄 Usuario autenticado:', firebaseUser.email);
          
          // Obtener o crear perfil del usuario
          const profileResult = await getOrCreateUserProfile(firebaseUser);
          
          if (profileResult.success) {
            setUser(firebaseUser);
            setUserProfile(profileResult.profile);
            
            // Analytics tracking
            analyticsEvents.custom('user_session_start', {
              role: profileResult.profile.role,
              email_verified: firebaseUser.emailVerified
            });
            
            console.log('✅ Perfil cargado:', profileResult.profile.role, firebaseUser.email);
          } else {
            console.error('❌ Error cargando perfil:', profileResult.error);
            setError(profileResult.message || 'Error cargando perfil de usuario');
            setUser(firebaseUser);
            setUserProfile(null);
          }
        } else {
          console.log('👋 Usuario desconectado');
          setUser(null);
          setUserProfile(null);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Error en onAuthStateChanged:', err);
        setError('Error de autenticación');
        analyticsEvents.custom('auth_error', {
          error_message: err.message
        });
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param {string} permission - Permiso a verificar
   * @returns {boolean} - True si tiene el permiso
   */
  const hasPermission = (permission) => {
    if (!userProfile || !userProfile.permissions) {
      return false;
    }
    return userProfile.permissions[permission] === true;
  };

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean} - True si tiene el rol
   */
  const isRole = (role) => {
    if (!userProfile) {
      return false;
    }
    return userProfile.role === role;
  };

  /**
   * Verifica si el usuario es administrador
   * @returns {boolean} - True si es admin
   */
  const isAdmin = () => {
    return isRole(ROLES.ADMIN);
  };

  /**
   * Verifica si el usuario es contador
   * @returns {boolean} - True si es contador
   */
  const isContador = () => {
    return isRole(ROLES.CONTADOR);
  };

  /**
   * Verifica si el usuario es cliente
   * @returns {boolean} - True si es cliente
   */
  const isCliente = () => {
    return isRole(ROLES.CLIENTE);
  };

  /**
   * Verifica si el usuario puede crear liquidaciones
   * @returns {boolean} - True si puede crear
   */
  const canCreateSettlements = () => {
    return hasPermission(PERMISSIONS.CREATE_SETTLEMENTS);
  };

  /**
   * Verifica si el usuario puede ver todas las liquidaciones
   * @returns {boolean} - True si puede ver todas
   */
  const canViewAllSettlements = () => {
    return hasPermission(PERMISSIONS.VIEW_ALL_SETTLEMENTS);
  };

  /**
   * Verifica si el usuario puede gestionar otros usuarios
   * @returns {boolean} - True si puede gestionar usuarios
   */
  const canManageUsers = () => {
    return hasPermission(PERMISSIONS.MANAGE_USERS);
  };

  /**
   * Verifica si el usuario puede exportar reportes
   * @returns {boolean} - True si puede exportar
   */
  const canExportReports = () => {
    return hasPermission(PERMISSIONS.EXPORT_REPORTS);
  };

  /**
   * Verifica si el usuario puede eliminar liquidaciones
   * @returns {boolean} - True si puede eliminar
   */
  const canDeleteSettlements = () => {
    return hasPermission(PERMISSIONS.DELETE_SETTLEMENTS);
  };

  /**
   * Verifica si el usuario puede modificar configuraciones
   * @returns {boolean} - True si puede modificar settings
   */
  const canModifySettings = () => {
    return hasPermission(PERMISSIONS.MODIFY_SETTINGS);
  };

  /**
   * Recarga el perfil del usuario (útil después de cambios de rol)
   */
  const reloadUserProfile = async () => {
    if (user) {
      setLoading(true);
      try {
        const profileResult = await getOrCreateUserProfile(user);
        if (profileResult.success) {
          setUserProfile(profileResult.profile);
        }
      } catch (err) {
        console.error('Error recargando perfil:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * Obtiene información del usuario para mostrar en UI
   * @returns {object} - Información del usuario
   */
  const getUserInfo = () => {
    if (!user || !userProfile) {
      return {
        displayName: 'Usuario',
        email: '',
        role: '',
        roleDescription: ''
      };
    }

    return {
      displayName: userProfile.displayName || user.displayName || user.email.split('@')[0],
      email: user.email,
      role: userProfile.role,
      roleDescription: getRoleDescription(userProfile.role)
    };
  };

  /**
   * Obtiene descripción del rol actual
   * @param {string} role - Rol a describir
   * @returns {string} - Descripción del rol
   */
  const getRoleDescription = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'Administrador';
      case ROLES.CONTADOR:
        return 'Contador';
      case ROLES.CLIENTE:
        return 'Cliente';
      default:
        return 'Usuario';
    }
  };

  // Valores del contexto
  const contextValue = {
    // Estado básico
    user,
    userProfile,
    loading,
    error,
    
    // Funciones de verificación de roles
    isRole,
    isAdmin,
    isContador,
    isCliente,
    
    // Funciones de verificación de permisos
    hasPermission,
    canCreateSettlements,
    canViewAllSettlements,
    canManageUsers,
    canExportReports,
    canDeleteSettlements,
    canModifySettings,
    
    // Utilidades
    getUserInfo,
    reloadUserProfile,
    
    // Constantes para fácil acceso
    ROLES,
    PERMISSIONS
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
/**
 * authService.js - Servicio de autenticación mejorado con verificación de roles
 * Implementa las verificaciones de seguridad necesarias para migración
 */

import { auth } from './config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

/**
 * Roles autorizados para operaciones de migración
 */
export const MIGRATION_ROLES = ['admin', 'super_admin', 'migration_operator'];

/**
 * Obtener usuario actual autenticado
 * @returns {Promise<Object|null>} Usuario actual o null
 */
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Verificar si el usuario actual tiene permisos de migración
 * @param {Object} user - Usuario de Firebase Auth
 * @returns {Promise<boolean>} True si tiene permisos
 */
export const hasUserMigrationPermissions = async (user) => {
  if (!user) return false;

  try {
    // Obtener token con claims personalizados
    const idTokenResult = await user.getIdTokenResult();
    const customClaims = idTokenResult.claims;

    // Verificar roles
    const userRoles = customClaims.roles || [];
    return MIGRATION_ROLES.some(role => userRoles.includes(role));
  } catch (error) {
    console.error('Error verificando permisos:', error);
    return false;
  }
};

/**
 * Obtener información completa del usuario con claims
 * @returns {Promise<Object|null>} Usuario con información de roles
 */
export const getCurrentUserWithClaims = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const idTokenResult = await user.getIdTokenResult();
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      customClaims: idTokenResult.claims,
      hasMigrationPermissions: await hasUserMigrationPermissions(user)
    };
  } catch (error) {
    console.error('Error obteniendo claims:', error);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      customClaims: {},
      hasMigrationPermissions: false
    };
  }
};

/**
 * Cerrar sesión
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    throw error;
  }
};

export default {
  getCurrentUser,
  getCurrentUserWithClaims,
  hasUserMigrationPermissions,
  logout,
  MIGRATION_ROLES
};

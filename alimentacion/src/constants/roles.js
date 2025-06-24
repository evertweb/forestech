/**
 * Definiciones de roles y permisos para el sistema Forestech
 * Mantiene consistencia con la arquitectura existente de Firebase
 */

export const ROLES = {
  ADMIN: 'admin',
  CONTADOR: 'contador',
  CLIENTE: 'cliente'
};

export const PERMISSIONS = {
  CREATE_SETTLEMENTS: 'canCreateSettlements',
  VIEW_ALL_SETTLEMENTS: 'canViewAllSettlements', 
  MANAGE_USERS: 'canManageUsers',
  EXPORT_REPORTS: 'canExportReports',
  DELETE_SETTLEMENTS: 'canDeleteSettlements',
  MODIFY_SETTINGS: 'canModifySettings'
};

/**
 * Email específico que siempre será Admin
 */
export const ADMIN_EMAIL = 'contacto.evert@gmail.com';

/**
 * Obtiene permisos por defecto según el rol
 * @param {string} role - Rol del usuario
 * @returns {object} - Objeto con permisos booleanos
 */
export const getDefaultPermissions = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return {
        [PERMISSIONS.CREATE_SETTLEMENTS]: true,
        [PERMISSIONS.VIEW_ALL_SETTLEMENTS]: true,
        [PERMISSIONS.MANAGE_USERS]: true,
        [PERMISSIONS.EXPORT_REPORTS]: true,
        [PERMISSIONS.DELETE_SETTLEMENTS]: true,
        [PERMISSIONS.MODIFY_SETTINGS]: true
      };
    
    case ROLES.CONTADOR:
      return {
        [PERMISSIONS.CREATE_SETTLEMENTS]: true,
        [PERMISSIONS.VIEW_ALL_SETTLEMENTS]: true,
        [PERMISSIONS.MANAGE_USERS]: false,
        [PERMISSIONS.EXPORT_REPORTS]: true,
        [PERMISSIONS.DELETE_SETTLEMENTS]: true,
        [PERMISSIONS.MODIFY_SETTINGS]: false
      };
    
    case ROLES.CLIENTE:
    default:
      return {
        [PERMISSIONS.CREATE_SETTLEMENTS]: true,
        [PERMISSIONS.VIEW_ALL_SETTLEMENTS]: false,
        [PERMISSIONS.MANAGE_USERS]: false,
        [PERMISSIONS.EXPORT_REPORTS]: false,
        [PERMISSIONS.DELETE_SETTLEMENTS]: false,
        [PERMISSIONS.MODIFY_SETTINGS]: false
      };
  }
};

/**
 * Determina el rol automáticamente basado en el email
 * @param {string} email - Email del usuario
 * @returns {string} - Rol asignado
 */
export const determineUserRole = (email) => {
  if (email === ADMIN_EMAIL) {
    return ROLES.ADMIN;
  }
  
  // Por defecto, nuevos usuarios son clientes por seguridad
  return ROLES.CLIENTE;
};

/**
 * Obtiene descripción legible del rol
 * @param {string} role - Rol del usuario
 * @returns {string} - Descripción del rol
 */
export const getRoleDescription = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'Administrador - Control total del sistema';
    case ROLES.CONTADOR:
      return 'Contador - Crear y gestionar liquidaciones';
    case ROLES.CLIENTE:
      return 'Cliente - Ver sus propias liquidaciones';
    default:
      return 'Rol no definido';
  }
};

/**
 * Obtiene color del rol para UI
 * @param {string} role - Rol del usuario
 * @returns {string} - Color CSS
 */
export const getRoleColor = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return '#dc2626'; // red-600
    case ROLES.CONTADOR:
      return '#2563eb'; // blue-600
    case ROLES.CLIENTE:
      return '#16a34a'; // green-600
    default:
      return '#6b7280'; // gray-500
  }
};
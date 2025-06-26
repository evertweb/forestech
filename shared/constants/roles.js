/**
 * Definiciones de roles y permisos para el sistema Forestech
 * Compatibilidad entre todas las apps del monorepo
 */

export const ROLES = {
  ADMIN: 'admin',
  CONTADOR: 'contador', 
  CLIENTE: 'cliente'
};

// Permisos específicos para ALIMENTACION
export const ALIMENTACION_PERMISSIONS = {
  CREATE_SETTLEMENTS: 'canCreateSettlements',
  VIEW_ALL_SETTLEMENTS: 'canViewAllSettlements',
  MANAGE_USERS: 'canManageUsers',
  EXPORT_REPORTS: 'canExportReports',
  DELETE_SETTLEMENTS: 'canDeleteSettlements',
  MODIFY_SETTINGS: 'canModifySettings'
};

// Permisos específicos para COMBUSTIBLES
export const COMBUSTIBLES_PERMISSIONS = {
  MANAGE_INVENTORY: 'canManageInventory',
  CREATE_MOVEMENTS: 'canCreateMovements',
  VIEW_ALL_MOVEMENTS: 'canViewAllMovements',
  MANAGE_VEHICLES: 'canManageVehicles',
  MANAGE_SUPPLIERS: 'canManageSuppliers',
  VIEW_REPORTS: 'canViewReports',
  EXPORT_REPORTS: 'canExportReports',
  MODIFY_SETTINGS: 'canModifySettings'
};

// Permisos generales del sistema
export const SYSTEM_PERMISSIONS = {
  MANAGE_USERS: 'canManageUsers',
  VIEW_DASHBOARD: 'canViewDashboard',
  MODIFY_SETTINGS: 'canModifySettings'
};

/**
 * Email específico que siempre será Admin
 */
export const ADMIN_EMAIL = 'contacto.evert@gmail.com';

/**
 * Obtiene permisos por defecto para ALIMENTACION según el rol
 */
export const getAlimentacionPermissions = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return {
        [ALIMENTACION_PERMISSIONS.CREATE_SETTLEMENTS]: true,
        [ALIMENTACION_PERMISSIONS.VIEW_ALL_SETTLEMENTS]: true,
        [ALIMENTACION_PERMISSIONS.MANAGE_USERS]: true,
        [ALIMENTACION_PERMISSIONS.EXPORT_REPORTS]: true,
        [ALIMENTACION_PERMISSIONS.DELETE_SETTLEMENTS]: true,
        [ALIMENTACION_PERMISSIONS.MODIFY_SETTINGS]: true
      };
    
    case ROLES.CONTADOR:
      return {
        [ALIMENTACION_PERMISSIONS.CREATE_SETTLEMENTS]: true,
        [ALIMENTACION_PERMISSIONS.VIEW_ALL_SETTLEMENTS]: true,
        [ALIMENTACION_PERMISSIONS.MANAGE_USERS]: false,
        [ALIMENTACION_PERMISSIONS.EXPORT_REPORTS]: true,
        [ALIMENTACION_PERMISSIONS.DELETE_SETTLEMENTS]: true,
        [ALIMENTACION_PERMISSIONS.MODIFY_SETTINGS]: false
      };
    
    case ROLES.CLIENTE:
    default:
      return {
        [ALIMENTACION_PERMISSIONS.CREATE_SETTLEMENTS]: true,
        [ALIMENTACION_PERMISSIONS.VIEW_ALL_SETTLEMENTS]: false,
        [ALIMENTACION_PERMISSIONS.MANAGE_USERS]: false,
        [ALIMENTACION_PERMISSIONS.EXPORT_REPORTS]: false,
        [ALIMENTACION_PERMISSIONS.DELETE_SETTLEMENTS]: false,
        [ALIMENTACION_PERMISSIONS.MODIFY_SETTINGS]: false
      };
  }
};

/**
 * Obtiene permisos por defecto para COMBUSTIBLES según el rol
 */
export const getCombustiblesPermissions = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return {
        [COMBUSTIBLES_PERMISSIONS.MANAGE_INVENTORY]: true,
        [COMBUSTIBLES_PERMISSIONS.CREATE_MOVEMENTS]: true,
        [COMBUSTIBLES_PERMISSIONS.VIEW_ALL_MOVEMENTS]: true,
        [COMBUSTIBLES_PERMISSIONS.MANAGE_VEHICLES]: true,
        [COMBUSTIBLES_PERMISSIONS.MANAGE_SUPPLIERS]: true,
        [COMBUSTIBLES_PERMISSIONS.VIEW_REPORTS]: true,
        [COMBUSTIBLES_PERMISSIONS.EXPORT_REPORTS]: true,
        [COMBUSTIBLES_PERMISSIONS.MODIFY_SETTINGS]: true
      };
    
    case ROLES.CONTADOR:
      return {
        [COMBUSTIBLES_PERMISSIONS.MANAGE_INVENTORY]: true,
        [COMBUSTIBLES_PERMISSIONS.CREATE_MOVEMENTS]: true,
        [COMBUSTIBLES_PERMISSIONS.VIEW_ALL_MOVEMENTS]: true,
        [COMBUSTIBLES_PERMISSIONS.MANAGE_VEHICLES]: false,
        [COMBUSTIBLES_PERMISSIONS.MANAGE_SUPPLIERS]: false,
        [COMBUSTIBLES_PERMISSIONS.VIEW_REPORTS]: true,
        [COMBUSTIBLES_PERMISSIONS.EXPORT_REPORTS]: true,
        [COMBUSTIBLES_PERMISSIONS.MODIFY_SETTINGS]: false
      };
    
    case ROLES.CLIENTE:
    default:
      return {
        [COMBUSTIBLES_PERMISSIONS.MANAGE_INVENTORY]: false,
        [COMBUSTIBLES_PERMISSIONS.CREATE_MOVEMENTS]: true,
        [COMBUSTIBLES_PERMISSIONS.VIEW_ALL_MOVEMENTS]: false,
        [COMBUSTIBLES_PERMISSIONS.MANAGE_VEHICLES]: false,
        [COMBUSTIBLES_PERMISSIONS.MANAGE_SUPPLIERS]: false,
        [COMBUSTIBLES_PERMISSIONS.VIEW_REPORTS]: false,
        [COMBUSTIBLES_PERMISSIONS.EXPORT_REPORTS]: false,
        [COMBUSTIBLES_PERMISSIONS.MODIFY_SETTINGS]: false
      };
  }
};

/**
 * Determina el rol automáticamente basado en el email
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
 */
export const getRoleDescription = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'Administrador - Control total del sistema';
    case ROLES.CONTADOR:
      return 'Contador - Gestión operativa';
    case ROLES.CLIENTE:
      return 'Cliente - Acceso limitado';
    default:
      return 'Rol no definido';
  }
};

/**
 * Obtiene color del rol para UI
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
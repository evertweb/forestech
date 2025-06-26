/**
 * Definiciones de roles y permisos para combustibles
 */

export const ROLES = {
  ADMIN: 'admin',
  CONTADOR: 'contador', 
  CLIENTE: 'cliente'
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

/**
 * Email específico que siempre será Admin
 */
export const ADMIN_EMAIL = 'contacto.evert@gmail.com';

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
  
  return ROLES.CLIENTE;
};
/**
 * Componente de protección de rutas por roles y permisos
 * Controla el acceso a diferentes secciones de la aplicación
 * Mantiene consistencia con los patrones de UI existentes
 */

import React from 'react';
import { useUser } from '../contexts/UserContext';

/**
 * Componente que protege rutas basado en roles y permisos
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Contenido a proteger
 * @param {string} props.requiredRole - Rol requerido para acceder
 * @param {string} props.requiredPermission - Permiso requerido para acceder
 * @param {React.ReactNode} props.fallback - Componente a mostrar si no tiene acceso
 * @param {boolean} props.showLoader - Mostrar loader mientras verifica permisos
 * @returns {React.ReactNode} - Contenido protegido o mensaje de acceso denegado
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requiredPermission, 
  fallback,
  showLoader = true 
}) => {
  const { 
    user, 
    userProfile, 
    loading, 
    isRole, 
    hasPermission 
  } = useUser();

  // Mostrar loader mientras se carga la información del usuario
  if (loading && showLoader) {
    return <LoadingSpinner />;
  }

  // Si no hay usuario autenticado, mostrar mensaje de login requerido
  if (!user) {
    return fallback || <AccessDenied message="Debes iniciar sesión para acceder a esta sección" />;
  }

  // Si no hay perfil cargado, mostrar error
  if (!userProfile) {
    return fallback || <AccessDenied message="Error cargando perfil de usuario" />;
  }

  // Verificar rol requerido
  if (requiredRole && !isRole(requiredRole)) {
    return fallback || <AccessDenied 
      message={`Necesitas ser ${getRoleDisplayName(requiredRole)} para acceder a esta sección`} 
    />;
  }

  // Verificar permiso requerido
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || <AccessDenied 
      message="No tienes permisos suficientes para realizar esta acción" 
    />;
  }

  // Si pasa todas las verificaciones, mostrar contenido
  return children;
};

/**
 * Componente de acceso denegado
 * Mantiene el estilo visual consistente con la aplicación
 */
const AccessDenied = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
        <svg 
          className="w-6 h-6 text-red-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m0 0v2m0-2h2m-2 0H9m11-5a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        Acceso Denegado
      </h3>
      <p className="text-red-700 text-sm">
        {message}
      </p>
    </div>
  </div>
);

/**
 * Componente de spinner de carga
 * Usa el mismo estilo que otros loaders de la aplicación
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex flex-col items-center space-y-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600">Verificando permisos...</p>
    </div>
  </div>
);

/**
 * Obtiene el nombre legible del rol
 * @param {string} role - Rol a convertir
 * @returns {string} - Nombre legible del rol
 */
const getRoleDisplayName = (role) => {
  const roleNames = {
    admin: 'Administrador',
    contador: 'Contador', 
    cliente: 'Cliente'
  };
  return roleNames[role] || role;
};

/**
 * Hook personalizado para verificaciones rápidas de permisos
 * Útil para mostrar/ocultar elementos de UI sin crear componentes completos
 */
// TODO: Separar componente de constantes/funciones para Fast Refresh
export const usePermissionCheck = () => {
  const { isRole, hasPermission } = useUser();

  return {
    /**
     * Verifica si el usuario puede ver un elemento
     * @param {Object} requirements - Requerimientos de acceso
     * @param {string} requirements.role - Rol requerido
     * @param {string} requirements.permission - Permiso requerido
     * @returns {boolean} - True si puede ver el elemento
     */
    canView: (requirements = {}) => {
      if (requirements.role && !isRole(requirements.role)) {
        return false;
      }
      if (requirements.permission && !hasPermission(requirements.permission)) {
        return false;
      }
      return true;
    },

    /**
     * Wrapper para mostrar elementos condicionalmente
     * @param {Object} requirements - Requerimientos de acceso
     * @param {React.ReactNode} element - Elemento a mostrar
     * @returns {React.ReactNode|null} - Elemento o null
     */
    renderIf: (requirements, element) => {
      return this.canView(requirements) ? element : null;
    }
  };
};

/**
 * Componente HOC para proteger componentes completos
 * @param {React.Component} Component - Componente a proteger
 * @param {Object} requirements - Requerimientos de acceso
 * @returns {React.Component} - Componente protegido
 */
// TODO: Separar componente de constantes/funciones para Fast Refresh
export const withRoleProtection = (Component, requirements = {}) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...requirements}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

/**
 * Componente específico para proteger funciones de administrador
 */
export const AdminOnly = ({ children, fallback }) => (
  <ProtectedRoute 
    requiredRole="admin" 
    fallback={fallback}
  >
    {children}
  </ProtectedRoute>
);

/**
 * Componente específico para proteger funciones de contador
 */
export const ContadorOnly = ({ children, fallback }) => (
  <ProtectedRoute 
    requiredRole="contador" 
    fallback={fallback}
  >
    {children}
  </ProtectedRoute>
);

/**
 * Componente para mostrar contenido solo a usuarios autenticados
 */
export const AuthenticatedOnly = ({ children, fallback }) => (
  <ProtectedRoute fallback={fallback}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
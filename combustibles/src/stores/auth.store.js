/**
 * 🔐 Auth Store - Zustand
 * 
 * Store para manejo de autenticación y permisos de usuarios.
 * Reemplaza la funcionalidad de autenticación del CombustiblesContext.
 * 
 * @module stores/auth
 * @see {@link https://zustand-demo.pmnd.rs/} - Zustand docs
 * 
 * @example
 * ```javascript
 * import { useAuthStore } from '@/stores/auth.store';
 * 
 * function MyComponent() {
 *   const { user, userProfile, hasPermission, isAdmin } = useAuthStore();
 *   
 *   if (hasPermission('movements:create')) {
 *     // User can create movements
 *   }
 * }
 * ```
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Auth Store State
 * 
 * @typedef {Object} AuthState
 * @property {Object|null} user - Firebase user object
 * @property {Object|null} userProfile - User profile from Firestore
 * @property {boolean} loading - Loading state for authentication
 * @property {string|null} error - Error message if any
 * @property {boolean} authReady - Flag indicating auth is ready
 */

/**
 * Auth Store Actions
 * 
 * @typedef {Object} AuthActions
 * @property {function(Object): void} setUser - Set current user
 * @property {function(Object): void} setUserProfile - Set user profile
 * @property {function(boolean): void} setLoading - Set loading state
 * @property {function(string|null): void} setError - Set error message
 * @property {function(boolean): void} setAuthReady - Set auth ready state
 * @property {function(string): boolean} hasPermission - Check if user has specific permission
 * @property {function(): boolean} isAdmin - Check if user is admin
 * @property {function(): boolean} isCounterOrAbove - Check if user is counter or admin
 * @property {function(): void} reset - Reset store to initial state
 */

const initialState = {
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  authReady: false,
};

/**
 * useAuthStore - Zustand store for authentication
 * 
 * @returns {AuthState & AuthActions} Auth state and actions
 */
export const useAuthStore = create(
  devtools(
    (set, _get) => ({
      // Estado inicial
      ...initialState,

      // Acciones
      /**
       * Set current Firebase user
       * 
       * @param {Object|null} user - Firebase user object
       * @example
       * setUser(firebaseUser);
       */
      setUser: (user) => {
        console.log('🔐 AuthStore: setUser -', user?.email || 'null');
        set({ user }, false, 'auth/setUser');
      },

      /**
       * Set user profile from Firestore
       * 
       * @param {Object|null} userProfile - User profile data
       * @example
       * setUserProfile({ uid, email, role, combustiblesPermissions });
       */
      setUserProfile: (userProfile) => {
        console.log('👤 AuthStore: setUserProfile -', userProfile?.email || 'null');
        set({ userProfile }, false, 'auth/setUserProfile');
      },

      /**
       * Set loading state
       * 
       * @param {boolean} loading - Loading state
       */
      setLoading: (loading) => {
        set({ loading }, false, 'auth/setLoading');
      },

      /**
       * Set error message
       * 
       * @param {string|null} error - Error message
       */
      setError: (error) => {
        console.error('❌ AuthStore: Error -', error);
        set({ error }, false, 'auth/setError');
      },

      /**
       * Set auth ready state
       * 
       * @param {boolean} authReady - Auth ready flag
       */
      setAuthReady: (authReady) => {
        console.log('✅ AuthStore: authReady -', authReady);
        set({ authReady }, false, 'auth/setAuthReady');
      },

      /**
       * Check if user has specific permission
       * 
       * ⚠️ PERMISOS DESHABILITADOS - Todos los usuarios tienen acceso total
       * 
       * @param {string} permission - Permission to check (e.g., 'movements:create')
       * @returns {boolean} Always true (permissions disabled)
       * 
       * @example
       * const canCreate = hasPermission('movements:create');
       */
      hasPermission: (permission) => {
        // ⚠️ SISTEMA DE PERMISOS DESHABILITADO
        // Todos los usuarios tienen control total
        console.log(`🔓 AuthStore: hasPermission(${permission}) = true (permisos deshabilitados)`);
        return true;
      },

      /**
       * Check if user is admin
       * 
       * ⚠️ PERMISOS DESHABILITADOS - Todos los usuarios son admin
       * 
       * @returns {boolean} Always true (permissions disabled)
       * 
       * @example
       * if (isAdmin()) {
       *   // Show admin features
       * }
       */
      isAdmin: () => {
        // ⚠️ SISTEMA DE PERMISOS DESHABILITADO
        // Todos los usuarios son considerados admin
        console.log(`👑 AuthStore: isAdmin = true (permisos deshabilitados)`);
        return true;
      },

      /**
       * Check if user is counter or above (admin or contador)
       * 
       * ⚠️ PERMISOS DESHABILITADOS - Todos los usuarios tienen acceso
       * 
       * @returns {boolean} Always true (permissions disabled)
       * 
       * @example
       * if (isCounterOrAbove()) {
       *   // Show financial features
       * }
       */
      isCounterOrAbove: () => {
        // ⚠️ SISTEMA DE PERMISOS DESHABILITADO
        // Todos los usuarios tienen acceso completo
        console.log(`📊 AuthStore: isCounterOrAbove = true (permisos deshabilitados)`);
        return true;
      },

      /**
       * Reset store to initial state
       * Used when user logs out
       * 
       * @example
       * reset(); // Clear all auth data
       */
      reset: () => {
        console.log('🔄 AuthStore: reset');
        set(initialState, false, 'auth/reset');
      },
    }),
    {
      name: 'auth-store',
      enabled: import.meta.env.DEV, // Enable devtools only in development
    }
  )
);

// Selectores útiles para evitar re-renders innecesarios
/**
 * Selector to get only user email (avoids re-render if other user properties change)
 * 
 * @example
 * const userEmail = useAuthStore(selectUserEmail);
 */
export const selectUserEmail = (state) => state.user?.email;

/**
 * Selector to get only user role
 * 
 * @example
 * const userRole = useAuthStore(selectUserRole);
 */
export const selectUserRole = (state) => state.userProfile?.role;

/**
 * Selector to get loading state
 * 
 * @example
 * const isLoading = useAuthStore(selectLoading);
 */
export const selectLoading = (state) => state.loading;

/**
 * Selector to check if user is authenticated
 * 
 * @example
 * const isAuthenticated = useAuthStore(selectIsAuthenticated);
 */
export const selectIsAuthenticated = (state) => state.user !== null && state.authReady;


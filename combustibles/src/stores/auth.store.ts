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
 * ```typescript
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
import type { AuthState } from '../types/store';
import type { FirebaseUser, UserProfile } from '../types/models';

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
 * @returns Auth state and actions
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Acciones
      /**
       * Set current Firebase user
       * 
       * @param user - Firebase user object or null
       * @example
       * setUser(firebaseUser);
       */
      setUser: (user: FirebaseUser | null) => {
        console.log('🔐 AuthStore: setUser -', user?.email || 'null');
        set({ user }, false, 'auth/setUser');
      },

      /**
       * Set user profile from Firestore
       * 
       * @param userProfile - User profile data or null
       * @example
       * setUserProfile({ uid, email, role, combustiblesPermissions });
       */
      setUserProfile: (userProfile: UserProfile | null) => {
        console.log('👤 AuthStore: setUserProfile -', userProfile?.email || 'null');
        set({ userProfile }, false, 'auth/setUserProfile');
      },

      /**
       * Set loading state
       * 
       * @param loading - Loading state
       */
      setLoading: (loading: boolean) => {
        set({ loading }, false, 'auth/setLoading');
      },

      /**
       * Set error message
       * 
       * @param error - Error message or null
       */
      setError: (error: string | null) => {
        console.error('❌ AuthStore: Error -', error);
        set({ error }, false, 'auth/setError');
      },

      /**
       * Set auth ready state
       * 
       * @param authReady - Auth ready flag
       */
      setAuthReady: (authReady: boolean) => {
        console.log('✅ AuthStore: authReady -', authReady);
        set({ authReady }, false, 'auth/setAuthReady');
      },

      /**
       * Check if user has specific permission
       * 
       * @param permission - Permission to check (e.g., 'movements:create')
       * @returns True if user has permission
       * 
       * @example
       * const canCreate = hasPermission('movements:create');
       */
      hasPermission: (permission: string): boolean => {
        const { userProfile } = get();
        const hasIt = Boolean(userProfile?.combustiblesPermissions?.[permission as keyof typeof userProfile.combustiblesPermissions]);
        console.log(`🔑 AuthStore: hasPermission(${permission}) = ${hasIt}`);
        return hasIt;
      },

      /**
       * Check if user is admin
       * 
       * @returns True if user role is 'admin'
       * 
       * @example
       * if (isAdmin()) {
       *   // Show admin features
       * }
       */
      isAdmin: (): boolean => {
        const { userProfile } = get();
        const admin = userProfile?.role === 'admin';
        console.log(`👑 AuthStore: isAdmin = ${admin}`);
        return admin;
      },

      /**
       * Check if user is counter or above (admin or contador)
       * 
       * @returns True if user role is 'admin' or 'contador'
       * 
       * @example
       * if (isCounterOrAbove()) {
       *   // Show financial features
       * }
       */
      isCounterOrAbove: (): boolean => {
        const { userProfile } = get();
        const isCounter = userProfile?.role === 'admin' || userProfile?.role === 'contador';
        console.log(`📊 AuthStore: isCounterOrAbove = ${isCounter}`);
        return isCounter;
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
export const selectUserEmail = (state: AuthState): string | null => state.user?.email || null;

/**
 * Selector to get only user role
 * 
 * @example
 * const userRole = useAuthStore(selectUserRole);
 */
export const selectUserRole = (state: AuthState): string | undefined => state.userProfile?.role;

/**
 * Selector to get loading state
 * 
 * @example
 * const isLoading = useAuthStore(selectLoading);
 */
export const selectLoading = (state: AuthState): boolean => state.loading;

/**
 * Selector to check if user is authenticated
 * 
 * @example
 * const isAuthenticated = useAuthStore(selectIsAuthenticated);
 */
export const selectIsAuthenticated = (state: AuthState): boolean => state.user !== null && state.authReady;

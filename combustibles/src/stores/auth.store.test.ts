/**
 * Tests for Auth Store (Zustand)
 * 
 * Testing strategy:
 * - Test initial state
 * - Test each action/setter
 * - Test computed functions (hasPermission, isAdmin, etc.)
 * - Test reset functionality
 * - Test selectors
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore, selectUserEmail, selectUserRole, selectLoading, selectIsAuthenticated } from './auth.store';
import type { FirebaseUser, UserProfile } from '../types/models';

// Mock console methods to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Helper function to create mock UserProfile with all required fields
const createMockUserProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  uid: '123',
  email: 'test@test.com',
  role: 'operador',
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  combustiblesPermissions: {},
  ...overrides,
});

// Helper function to create mock FirebaseUser
const createMockFirebaseUser = (overrides: Partial<FirebaseUser> = {}): FirebaseUser => ({
  uid: '123',
  email: 'test@test.com',
  displayName: 'Test User',
  photoURL: null,
  emailVerified: true,
  ...overrides,
});

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should initialize with null user', () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it('should initialize with null userProfile', () => {
      const { userProfile } = useAuthStore.getState();
      expect(userProfile).toBeNull();
    });

    it('should initialize with loading true', () => {
      const { loading } = useAuthStore.getState();
      expect(loading).toBe(true);
    });

    it('should initialize with null error', () => {
      const { error } = useAuthStore.getState();
      expect(error).toBeNull();
    });

    it('should initialize with authReady false', () => {
      const { authReady } = useAuthStore.getState();
      expect(authReady).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should update user state', () => {
      const mockUser = createMockFirebaseUser();

      useAuthStore.getState().setUser(mockUser);

      const { user } = useAuthStore.getState();
      expect(user).toEqual(mockUser);
    });

    it('should set user to null', () => {
      const mockUser = createMockFirebaseUser();

      // First set a user
      useAuthStore.getState().setUser(mockUser);
      expect(useAuthStore.getState().user).toEqual(mockUser);

      // Then set to null
      useAuthStore.getState().setUser(null);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('setUserProfile', () => {
    it('should update userProfile state', () => {
      const mockProfile = createMockUserProfile({
        role: 'admin',
        combustiblesPermissions: {
          'movements:create': true,
          'movements:update': true,
          'movements:delete': true,
        },
      });

      useAuthStore.getState().setUserProfile(mockProfile);

      const { userProfile } = useAuthStore.getState();
      expect(userProfile).toEqual(mockProfile);
    });

    it('should set userProfile to null', () => {
      const mockProfile = createMockUserProfile();

      // First set a profile
      useAuthStore.getState().setUserProfile(mockProfile);
      expect(useAuthStore.getState().userProfile).toEqual(mockProfile);

      // Then set to null
      useAuthStore.getState().setUserProfile(null);
      expect(useAuthStore.getState().userProfile).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should update loading state to false', () => {
      // Initial state is loading: true
      expect(useAuthStore.getState().loading).toBe(true);

      useAuthStore.getState().setLoading(false);

      expect(useAuthStore.getState().loading).toBe(false);
    });

    it('should update loading state to true', () => {
      // Set to false first
      useAuthStore.getState().setLoading(false);
      expect(useAuthStore.getState().loading).toBe(false);

      // Then set to true
      useAuthStore.getState().setLoading(true);
      expect(useAuthStore.getState().loading).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Authentication failed';

      useAuthStore.getState().setError(errorMessage);

      const { error } = useAuthStore.getState();
      expect(error).toBe(errorMessage);
    });

    it('should clear error by setting to null', () => {
      // First set an error
      useAuthStore.getState().setError('Some error');
      expect(useAuthStore.getState().error).toBe('Some error');

      // Then clear it
      useAuthStore.getState().setError(null);
      expect(useAuthStore.getState().error).toBeNull();
    });
  });

  describe('setAuthReady', () => {
    it('should set authReady to true', () => {
      // Initial state is authReady: false
      expect(useAuthStore.getState().authReady).toBe(false);

      useAuthStore.getState().setAuthReady(true);

      expect(useAuthStore.getState().authReady).toBe(true);
    });

    it('should set authReady to false', () => {
      // Set to true first
      useAuthStore.getState().setAuthReady(true);
      expect(useAuthStore.getState().authReady).toBe(true);

      // Then set to false
      useAuthStore.getState().setAuthReady(false);
      expect(useAuthStore.getState().authReady).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return false when no user profile', () => {
      const hasPermission = useAuthStore.getState().hasPermission('movements:create');
      expect(hasPermission).toBe(false);
    });

    it('should return false when userProfile has no permissions', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile());

      const hasPermission = useAuthStore.getState().hasPermission('movements:create');
      expect(hasPermission).toBe(false);
    });

    it('should return true when user has the permission', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        role: 'admin',
        combustiblesPermissions: {
          'movements:create': true,
        },
      }));

      const hasPermission = useAuthStore.getState().hasPermission('movements:create');
      expect(hasPermission).toBe(true);
    });

    it('should return false when permission is explicitly false', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        combustiblesPermissions: {
          'movements:create': false,
        },
      }));

      const hasPermission = useAuthStore.getState().hasPermission('movements:create');
      expect(hasPermission).toBe(false);
    });

    it('should handle multiple permissions correctly', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        role: 'supervisor',
        combustiblesPermissions: {
          'movements:create': true,
          'movements:update': false,
          'movements:delete': false,
        },
      }));

      expect(useAuthStore.getState().hasPermission('movements:create')).toBe(true);
      expect(useAuthStore.getState().hasPermission('movements:update')).toBe(false);
      expect(useAuthStore.getState().hasPermission('movements:delete')).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return false when no user profile', () => {
      const isAdmin = useAuthStore.getState().isAdmin();
      expect(isAdmin).toBe(false);
    });

    it('should return true for admin role', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        role: 'admin',
      }));

      const isAdmin = useAuthStore.getState().isAdmin();
      expect(isAdmin).toBe(true);
    });

    it('should return false for non-admin role', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        role: 'operador',
      }));

      const isAdmin = useAuthStore.getState().isAdmin();
      expect(isAdmin).toBe(false);
    });

    it('should return false for supervisor role', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        role: 'supervisor',
      }));

      const isAdmin = useAuthStore.getState().isAdmin();
      expect(isAdmin).toBe(false);
    });
  });

  describe('isCounterOrAbove', () => {
    it('should return false when no user profile', () => {
      const isCounter = useAuthStore.getState().isCounterOrAbove();
      expect(isCounter).toBe(false);
    });

    it('should return true for admin role', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        role: 'admin',
      }));

      const isCounter = useAuthStore.getState().isCounterOrAbove();
      expect(isCounter).toBe(true);
    });

    it('should return true for contador role', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        role: 'contador',
      }));

      const isCounter = useAuthStore.getState().isCounterOrAbove();
      expect(isCounter).toBe(true);
    });

    it('should return false for operador role', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        role: 'operador',
      }));

      const isCounter = useAuthStore.getState().isCounterOrAbove();
      expect(isCounter).toBe(false);
    });

    it('should return false for supervisor role', () => {
      useAuthStore.getState().setUserProfile(createMockUserProfile({
        role: 'supervisor',
      }));

      const isCounter = useAuthStore.getState().isCounterOrAbove();
      expect(isCounter).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      // Set some state
      const mockUser = createMockFirebaseUser();
      const mockProfile = createMockUserProfile({
        role: 'admin',
        combustiblesPermissions: { 'movements:create': true },
      });

      useAuthStore.getState().setUser(mockUser);
      useAuthStore.getState().setUserProfile(mockProfile);
      useAuthStore.getState().setLoading(false);
      useAuthStore.getState().setError('Some error');
      useAuthStore.getState().setAuthReady(true);

      // Verify state was set
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(useAuthStore.getState().userProfile).toEqual(mockProfile);
      expect(useAuthStore.getState().loading).toBe(false);
      expect(useAuthStore.getState().error).toBe('Some error');
      expect(useAuthStore.getState().authReady).toBe(true);

      // Reset
      useAuthStore.getState().reset();

      // Verify reset
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.userProfile).toBeNull();
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.authReady).toBe(false);
    });
  });

  describe('Selectors', () => {
    describe('selectUserEmail', () => {
      it('should return undefined when no user', () => {
        const email = selectUserEmail(useAuthStore.getState());
        expect(email).toBeUndefined();
      });

      it('should return user email when user exists', () => {
        const mockUser = createMockFirebaseUser({
          email: 'test@example.com',
        });

        useAuthStore.getState().setUser(mockUser);

        const email = selectUserEmail(useAuthStore.getState());
        expect(email).toBe('test@example.com');
      });
    });

    describe('selectUserRole', () => {
      it('should return undefined when no user profile', () => {
        const role = selectUserRole(useAuthStore.getState());
        expect(role).toBeUndefined();
      });

      it('should return user role when profile exists', () => {
        useAuthStore.getState().setUserProfile(createMockUserProfile({
          role: 'admin',
        }));

        const role = selectUserRole(useAuthStore.getState());
        expect(role).toBe('admin');
      });
    });

    describe('selectLoading', () => {
      it('should return loading state', () => {
        expect(selectLoading(useAuthStore.getState())).toBe(true);

        useAuthStore.getState().setLoading(false);
        expect(selectLoading(useAuthStore.getState())).toBe(false);
      });
    });

    describe('selectIsAuthenticated', () => {
      it('should return false when no user', () => {
        const isAuth = selectIsAuthenticated(useAuthStore.getState());
        expect(isAuth).toBe(false);
      });

      it('should return false when user exists but authReady is false', () => {
        useAuthStore.getState().setUser(createMockFirebaseUser());

        const isAuth = selectIsAuthenticated(useAuthStore.getState());
        expect(isAuth).toBe(false);
      });

      it('should return true when user exists and authReady is true', () => {
        useAuthStore.getState().setUser(createMockFirebaseUser());
        useAuthStore.getState().setAuthReady(true);

        const isAuth = selectIsAuthenticated(useAuthStore.getState());
        expect(isAuth).toBe(true);
      });
    });
  });
});

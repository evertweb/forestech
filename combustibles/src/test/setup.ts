import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Add global IS_REACT_ACT_ENVIRONMENT for React 18+
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

// Mock Firebase SDK modules para evitar inicialización real en pruebas
vi.mock('firebase/app', () => {
  return {
    initializeApp: vi.fn(),
    getApps: vi.fn(() => []),
    getApp: vi.fn(() => ({})),
  };
});

vi.mock('firebase/auth', () => {
  const mockAuth = {
    currentUser: {
      uid: 'test-user',
      email: 'test-user@forestech.test',
      displayName: 'Test User',
    },
  };

  return {
    getAuth: vi.fn(() => mockAuth),
    onAuthStateChanged: vi.fn((_auth, callback) => {
      callback(mockAuth.currentUser);
      return vi.fn();
    }),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock('firebase/functions', () => {
  const callable = vi.fn(async () => ({ data: { success: true, data: null } }));

  return {
    getFunctions: vi.fn(() => ({})),
    httpsCallable: vi.fn(() => callable),
  };
});

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  collection: vi.fn(() => ({})),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  serverTimestamp: vi.fn(() => new Date()),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  onSnapshot: vi.fn(() => () => {}),
  addDoc: vi.fn(() => Promise.resolve({ id: 'mock-id' })),
}));


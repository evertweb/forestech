/* global vi */
// Vitest + Testing Library setup for React (JSDOM)
import '@testing-library/jest-dom';
import React from 'react';

// Polyfills and globals if needed
import { TextEncoder, TextDecoder } from 'node:util';
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

// Mock window.matchMedia used by some UI libs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Simple mock for scrollIntoView in JSDOM
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Stub window.alert to avoid jsdom "Not implemented" errors during form submits
window.alert = vi.fn();

// Silence console noise in tests (keep errors)
const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = String(args[0] || '');
  if (
    msg.includes('ReactDOM.render is no longer supported') ||
    msg.includes('Deprecated') ||
    msg.includes('ErrorBoundary') ||
    msg.includes('Each child in a list should have a unique "key"')
  )
    return;
  originalWarn(...args);
};

// Mock AuthContext globally to satisfy CombustiblesProvider
const AuthStubContext = React.createContext({
  user: { uid: 'test-user' },
  loading: false,
  isAdmin: () => true,
  isCounterOrAbove: () => true,
  userProfile: { uid: 'test-user', name: 'Tester' },
});

vi.mock('../contexts/AuthContext', async () => ({
  useAuth: () => React.useContext(AuthStubContext),
  AuthProvider: ({ children }) => (
    <AuthStubContext.Provider
      value={{
        user: { uid: 'test-user' },
        loading: false,
        isAdmin: () => true,
        isCounterOrAbove: () => true,
        userProfile: { uid: 'test-user', name: 'Tester' },
      }}
    >
      {children}
    </AuthStubContext.Provider>
  ),
}));

// Mock del AuthContextLazy (runtime) para tests
vi.mock('../contexts/AuthContextLazy', async () => ({
  useAuth: () => React.useContext(AuthStubContext),
  AuthProvider: ({ children }) => (
    <AuthStubContext.Provider
      value={{
        user: { uid: 'test-user' },
        loading: false,
        isAdmin: () => true,
        isCounterOrAbove: () => true,
        userProfile: { uid: 'test-user', name: 'Tester' },
      }}
    >
      {children}
    </AuthStubContext.Provider>
  ),
}));

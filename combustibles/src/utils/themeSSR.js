// utils/themeSSR.js - Utilidades para manejar el esquema de color de la app (SSR-safe)
// Persistencia: localStorage('color-scheme') con valores 'light' | 'dark'

import { safeWindow, safeDocument, isServer } from './ssr';

const STORAGE_KEY = 'color-scheme';

export const getStoredScheme = () => {
  if (isServer) return 'light'; // Default para SSR

  // Forzar siempre modo claro - eliminar soporte para dark mode
  return 'light';
};

export const setStoredScheme = (scheme) => {
  if (isServer) return; // No hacer nada en servidor

  safeWindow((window) => {
    try {
      window.localStorage?.setItem(STORAGE_KEY, scheme);
    } catch {
      // noop: fallo silencioso si no se puede persistir
    }
  });
};

export const applySchemeToDocument = (scheme) => {
  if (isServer) return; // No hacer nada en servidor

  safeDocument((document) => {
    const root = document.documentElement;
    // Siempre marcar explícitamente el esquema activo
    root.setAttribute('data-color-scheme', scheme);
    // Hint para navegadores compatibles
    // Nota: el meta de index.html ya declara 'light' por defecto
    document.documentElement.style.colorScheme = scheme;
  });
};

export const initSchemeFromStorage = () => {
  if (isServer) return; // No hacer nada en servidor

  const scheme = getStoredScheme();
  applySchemeToDocument(scheme);
  return scheme;
};

export const getCurrentScheme = () => {
  if (isServer) return 'light'; // Default para SSR

  return safeDocument((document) => {
    return document.documentElement?.getAttribute('data-color-scheme') || 'light';
  }, 'light');
};

export const toggleScheme = () => {
  if (isServer) return 'light'; // No hacer nada en servidor

  const current = getCurrentScheme();
  const newScheme = current === 'light' ? 'dark' : 'light';
  setStoredScheme(newScheme);
  applySchemeToDocument(newScheme);
  return newScheme;
};

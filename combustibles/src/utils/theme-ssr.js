// utils/themeSSR.js - Utilidades para manejar el esquema de color SSR-compatible
// Versión SSR-safe del theme.js original

import { safeDocument, safeWindow } from './ssr.js';

const STORAGE_KEY = 'color-scheme';

export const getStoredScheme = () => {
  return safeWindow((window) => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      if (v === 'light' || v === 'dark') return v;
    } catch {
      // noop: si localStorage no está disponible, usamos 'light'
    }
    return 'light';
  }, 'light');
};

export const setStoredScheme = (scheme) => {
  safeWindow((window) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, scheme);
    } catch {
      // noop: fallo silencioso si no se puede persistir
    }
  });
};

export const applySchemeToDocument = (scheme) => {
  safeDocument((document) => {
    const root = document.documentElement;
    // Siempre marcar explícitamente el esquema activo
    root.setAttribute('data-color-scheme', scheme);
    // Hint para navegadores compatibles
    document.documentElement.style.colorScheme = scheme;
  });
};

export const initSchemeFromStorage = () => {
  const scheme = getStoredScheme();
  applySchemeToDocument(scheme);
  return scheme;
};

export const toggleScheme = () => {
  const current = getStoredScheme();
  const next = current === 'light' ? 'dark' : 'light';
  setStoredScheme(next);
  applySchemeToDocument(next);
  return next;
};

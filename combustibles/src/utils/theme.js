// utils/theme.js - Utilidades para manejar el esquema de color de la app
// Persistencia: localStorage('color-scheme') con valores 'light' | 'dark'

const STORAGE_KEY = 'color-scheme';

export const getStoredScheme = () => {
  // Forzar siempre modo claro - eliminar soporte para dark mode
  return 'light';
};

export const setStoredScheme = (scheme) => {
  try {
    localStorage.setItem(STORAGE_KEY, scheme);
  } catch {
    // noop: fallo silencioso si no se puede persistir
  }
};

export const applySchemeToDocument = (scheme) => {
  const root = document.documentElement;
  // Siempre marcar explícitamente el esquema activo
  root.setAttribute('data-color-scheme', scheme);
  // Hint para navegadores compatibles
  // Nota: el meta de index.html ya declara 'light' por defecto
  document.documentElement.style.colorScheme = scheme;
};

export const initSchemeFromStorage = () => {
  const scheme = getStoredScheme();
  applySchemeToDocument(scheme);
  return scheme;
};

// hooks/useColorScheme.js - Hook para manejar el color scheme (light/dark)
import { useEffect, useState } from 'react';
import { applySchemeToDocument, getStoredScheme } from '../utils/theme';

export const useColorScheme = () => {
  const [scheme, setScheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return getStoredScheme();
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      applySchemeToDocument(scheme);
    }
  }, [scheme]);

  // Sincronizar cambios entre pestañas/ventanas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'color-scheme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setScheme(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Remover funciones de toggle y dark mode - forzar siempre light
  return { scheme: 'light' };
};

export default useColorScheme;

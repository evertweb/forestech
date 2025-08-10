// hooks/useColorScheme.js - Hook para manejar el color scheme (light/dark)
import { useCallback, useEffect, useState } from 'react';
import { applySchemeToDocument, getStoredScheme, setStoredScheme } from '../utils/theme';

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

  const toggleScheme = useCallback(() => {
    setScheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      setStoredScheme(next);
      return next;
    });
  }, []);

  const setLight = useCallback(() => {
    setStoredScheme('light');
    setScheme('light');
  }, []);

  const setDark = useCallback(() => {
    setStoredScheme('dark');
    setScheme('dark');
  }, []);

  return { scheme, toggleScheme, setLight, setDark };
};

export default useColorScheme;

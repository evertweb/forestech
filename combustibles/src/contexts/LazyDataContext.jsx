// combustibles/src/contexts/LazyDataContext.jsx
// Context lazy para datos - no carga Firebase DB hasta ser necesario
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';

const LazyDataContext = createContext();

export const useLazyData = () => {
  const context = useContext(LazyDataContext);
  if (!context) {
    throw new Error('useLazyData debe usarse dentro de LazyDataProvider');
  }
  return context;
};

export const LazyDataProvider = ({ children }) => {
  const [firebaseDb, setFirebaseDb] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lazy loader para Firebase DB - solo se carga cuando se necesita
  const loadFirebaseDb = useCallback(async () => {
    if (firebaseDb) return firebaseDb;

    if (!loading) {
      setLoading(true);
      try {
        // Importar Firebase DB solo cuando sea necesario (no en initial load)
        const [{ loadFirebase }, firestoreModule] = await Promise.all([
          import('../firebase/lazyFirebase'),
          import('firebase/firestore'),
        ]);

        const { db } = await loadFirebase();
        const dbWithMethods = {
          db,
          ...firestoreModule,
        };

        setFirebaseDb(dbWithMethods);
        return dbWithMethods;
      } finally {
        setLoading(false);
      }
    }

    return null;
  }, [firebaseDb, loading]);

  const value = {
    loadFirebaseDb,
    isDbLoaded: !!firebaseDb,
    loading,
  };

  return <LazyDataContext.Provider value={value}>{children}</LazyDataContext.Provider>;
};

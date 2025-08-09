// combustibles/src/contexts/AuthContextLazy.jsx
// AuthContext optimizado para LCP - no bloquea carga inicial
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadFirebase } from '../firebase/lazyFirebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  
  useEffect(() => {
    let unsubscribe = null;
    
    // Cargar Firebase de forma lazy después del mount inicial
    const initAuth = async () => {
      try {
        // Delay mínimo para permitir que la UI inicial se renderice
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { auth } = await loadFirebase();
        setFirebaseLoaded(true);
        
        // Solo después de cargar Firebase, escuchar cambios de auth
        unsubscribe = auth.onAuthStateChanged((user) => {
          setUser(user);
          setLoading(false);
        });
        
      } catch (error) {
        console.error('Error inicializando Firebase Auth:', error);
        setLoading(false);
      }
    };
    
    initAuth();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    if (!firebaseLoaded) {
      throw new Error('Firebase no está cargado aún');
    }
    
    // Carga lazy de auth específicamente para reducir FCP
    const [{ auth }, { signInWithEmailAndPassword }] = await Promise.all([
      loadFirebase(),
      import('firebase/auth')
    ]);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (!firebaseLoaded) return;
    
    const { auth } = await loadFirebase();
    const { signOut } = await import('firebase/auth');
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    firebaseLoaded,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
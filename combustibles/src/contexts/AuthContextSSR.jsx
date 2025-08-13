// combustibles/src/contexts/AuthContextSSR.jsx
// AuthContext compatible con SSR - no ejecuta efectos en servidor
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { setAuthCookie, clearAuthCookie, setupCookieRefresh } from '../utils/authCookies';
import { isServer } from '../utils/ssr';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Estado inicial para SSR - asumimos no autenticado
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isServer ? false : true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  useEffect(() => {
    // Solo ejecutar en cliente
    if (isServer) return;

    let unsubscribe = null;
    let cookieRefreshCleanup = null;

    // Cargar Firebase de forma lazy después del mount inicial
    const initAuth = async () => {
      try {
        // Delay mínimo para permitir que la UI inicial se renderice
        await new Promise((resolve) => setTimeout(resolve, 100));

        const { auth, onAuthStateChanged } = await import('../firebase/lazyFirebase').then((m) =>
          m.loadFirebase()
        );
        setFirebaseLoaded(true);

        unsubscribe = onAuthStateChanged(auth, async (authUser) => {
          setUser(authUser);
          setLoading(false);

          if (authUser) {
            // 🍪 Establecer cookie para SSR
            await setAuthCookie(authUser);

            // Configurar refresh automático de cookies
            if (cookieRefreshCleanup) {
              cookieRefreshCleanup();
            }
            cookieRefreshCleanup = setupCookieRefresh(authUser);
          } else {
            // 🧹 Limpiar cookie cuando no hay usuario
            clearAuthCookie();

            if (cookieRefreshCleanup) {
              cookieRefreshCleanup();
              cookieRefreshCleanup = null;
            }
          }
        });
      } catch (error) {
        console.error('Error inicializando Auth:', error);
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (cookieRefreshCleanup) {
        cookieRefreshCleanup();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    if (isServer) {
      throw new Error('SignIn not available in server');
    }

    if (!firebaseLoaded) {
      throw new Error('Firebase no está cargado aún');
    }

    const { signInWithEmailAndPassword, auth } = await import('../firebase/lazyFirebase').then(
      (m) => m.loadFirebase()
    );
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (isServer) {
      throw new Error('SignOut not available in server');
    }

    if (!firebaseLoaded) {
      throw new Error('Firebase no está cargado aún');
    }

    const { signOutFromFirebase, auth } = await import('../firebase/lazyFirebase').then((m) =>
      m.loadFirebase()
    );
    return signOutFromFirebase(auth);
  };

  const value = {
    user,
    loading,
    firebaseLoaded,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

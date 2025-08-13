// combustibles/src/contexts/AuthContext.jsx
// Context minimalista solo para autenticación - NIVEL 2 OPTIMIZACIÓN
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile, getUserProfile } from '../firebase/userService';
import { setAuthCookie, clearAuthCookie, setupCookieRefresh } from '../utils/authCookies';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cookieRefreshCleanup = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        setError(null);

        if (firebaseUser) {
          setUser(firebaseUser);

          // 🍪 Establecer cookie para SSR
          await setAuthCookie(firebaseUser);

          // Configurar refresh automático de cookies
          if (cookieRefreshCleanup) {
            cookieRefreshCleanup();
          }
          cookieRefreshCleanup = setupCookieRefresh(firebaseUser);

          let profileResult = await getUserProfile(firebaseUser.uid);

          if (!profileResult.success) {
            profileResult = await createUserProfile(firebaseUser, {
              provider: 'existing_account',
              appContext: 'combustibles',
            });
          }

          if (profileResult.success) {
            setUserProfile(profileResult.userData);
          } else {
            setError('Error cargando perfil de usuario');
          }
        } else {
          setUser(null);
          setUserProfile(null);

          // 🧹 Limpiar cookie cuando no hay usuario
          clearAuthCookie();

          if (cookieRefreshCleanup) {
            cookieRefreshCleanup();
            cookieRefreshCleanup = null;
          }
        }
      } catch (error) {
        console.error('Error en autenticación:', error);
        setError('Error de autenticación');
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (cookieRefreshCleanup) {
        cookieRefreshCleanup();
      }
    };
  }, []);

  // Funciones de utilidad para permisos
  const hasPermission = (permission) => {
    return userProfile?.combustiblesPermissions?.[permission] || false;
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const isCounterOrAbove = () => {
    return userProfile?.role === 'admin' || userProfile?.role === 'contador';
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    hasPermission,
    isAdmin,
    isCounterOrAbove,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// combustibles/src/contexts/AuthContext.jsx
// Context minimalista solo para autenticación - NIVEL 2 OPTIMIZACIÓN
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile, getUserProfile } from '../firebase/userService';
import { setAuthCookie, clearAuthCookie, setupCookieRefresh } from '../utils/authCookies';
import { sendLoginNotification } from '../services/webhookService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  console.log('🚀 AuthProvider: Inicializando...');

  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isInitialLoadRef = useRef(true);
  const lastUserUidRef = useRef(null);

  useEffect(() => {
    let cookieRefreshCleanup = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        console.log(
          '🔥 AuthContext: onAuthStateChanged ejecutado - Usuario:',
          firebaseUser?.email || 'null'
        );
        setLoading(true);
        setError(null);

        if (firebaseUser) {
          console.log('👤 AuthContext: Usuario autenticado detectado:', firebaseUser.email);
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
            profileResult = await createUserProfile(firebaseUser);
          }

          if (profileResult.success) {
            setUserProfile(profileResult.userData);

            // Enviar notificación de login a n8n si:
            // 1. No es la carga inicial O
            // 2. Es la carga inicial pero el usuario cambió (nuevo login)
            const isNewLogin =
              !isInitialLoadRef.current ||
              (isInitialLoadRef.current && lastUserUidRef.current !== firebaseUser.uid);

            console.log(
              '🤔 AuthContext: Evaluando notificación - isInitialLoad:',
              isInitialLoadRef.current,
              'lastUserUid:',
              lastUserUidRef.current,
              'currentUid:',
              firebaseUser.uid,
              'isNewLogin:',
              isNewLogin
            );

            if (isNewLogin) {
              try {
                console.log(
                  '🔔 Enviando notificación de login desde AuthContext - Usuario:',
                  firebaseUser.email
                );
                await sendLoginNotification(firebaseUser, 'firebase_auth');
                console.log('✅ Notificación de login enviada correctamente');
              } catch (webhookError) {
                console.warn(
                  'Error enviando notificación de login desde AuthContext:',
                  webhookError
                );
                // No bloquear el login por errores de webhook
              }
            } else {
              console.log('⏭️ Saltando notificación - Es carga inicial del mismo usuario');
            }

            // Actualizar el último UID de usuario
            lastUserUidRef.current = firebaseUser.uid;
          } else {
            setError('Error cargando perfil de usuario');
          }
        } else {
          setUser(null);
          setUserProfile(null);
          lastUserUidRef.current = null;

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
        isInitialLoadRef.current = false;
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

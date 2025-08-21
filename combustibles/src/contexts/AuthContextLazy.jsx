// combustibles/src/contexts/AuthContextLazy.jsx
// AuthContext optimizado para LCP - no bloquea carga inicial
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadFirebase } from '../firebase/lazyFirebase';
import { sendLoginNotification } from '../services/webhookService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  console.log('🚀 AuthProviderLazy: Inicializando...');

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastUserUid, setLastUserUid] = useState(null);

  useEffect(() => {
    let unsubscribe = null;

    // Cargar Firebase de forma lazy después del mount inicial
    const initAuth = async () => {
      try {
        // Delay mínimo para permitir que la UI inicial se renderice
        await new Promise((resolve) => setTimeout(resolve, 100));

        const { auth } = await loadFirebase();
        setFirebaseLoaded(true);

        // Solo después de cargar Firebase, escuchar cambios de auth
        unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
          console.log(
            '🔥 AuthLazy: onAuthStateChanged ejecutado - Usuario:',
            firebaseUser?.email || 'null'
          );

          if (firebaseUser) {
            console.log('👤 AuthLazy: Usuario autenticado detectado:', firebaseUser.email);
            setUser(firebaseUser);

            // Determinar si es un login nuevo
            const isNewLogin =
              !isInitialLoad || (isInitialLoad && lastUserUid !== firebaseUser.uid);

            console.log(
              '🤔 AuthLazy: Evaluando notificación - isInitialLoad:',
              isInitialLoad,
              'lastUserUid:',
              lastUserUid,
              'currentUid:',
              firebaseUser.uid,
              'isNewLogin:',
              isNewLogin
            );

            if (isNewLogin) {
              try {
                console.log(
                  '🔔 Enviando notificación de login desde AuthLazy - Usuario:',
                  firebaseUser.email
                );
                await sendLoginNotification(firebaseUser, 'firebase_auth_lazy');
                console.log('✅ Notificación de login enviada correctamente desde AuthLazy');
              } catch (webhookError) {
                console.warn('Error enviando notificación de login desde AuthLazy:', webhookError);
              }
            } else {
              console.log(
                '⏭️ Saltando notificación - Es carga inicial del mismo usuario (AuthLazy)'
              );
            }

            setLastUserUid(firebaseUser.uid);
          } else {
            console.log('🔓 AuthLazy: Usuario desconectado');
            setUser(null);
            setLastUserUid(null);
          }

          setLoading(false);
          setIsInitialLoad(false);
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
      import('firebase/auth'),
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

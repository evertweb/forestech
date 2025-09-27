// combustibles/src/contexts/AuthContextLazy.jsx
// AuthContext optimizado para LCP - no bloquea carga inicial
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { loadFirebase } from '../firebase/lazyFirebase';
import { sendLoginNotification } from '../services/webhookService';
import { createUserProfile, getUserProfile } from '../firebase/userService';

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
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const isInitialLoadRef = useRef(true);
  const lastUserUidRef = useRef(null);

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

            // Obtener perfil del usuario
            let profile = null;
            try {
              let profileResult = await getUserProfile(firebaseUser.uid);

              if (!profileResult.success) {
                profileResult = await createUserProfile(firebaseUser);
              }

              if (profileResult.success) {
                profile = profileResult.userData;
                setUserProfile(profile);
                console.log('📋 AuthLazy: Perfil cargado:', profile.role);
              }
            } catch (error) {
              console.warn('⚠️ AuthLazy: Error cargando perfil:', error);
            }

            // Determinar si es un login nuevo
            const isNewLogin =
              !isInitialLoadRef.current ||
              (isInitialLoadRef.current && lastUserUidRef.current !== firebaseUser.uid);

            console.log(
              '🤔 AuthLazy: Evaluando notificación - isInitialLoad:',
              isInitialLoadRef.current,
              'lastUserUid:',
              lastUserUidRef.current,
              'currentUid:',
              firebaseUser.uid,
              'isNewLogin:',
              isNewLogin
            );

            // Establecer contexto de usuario global para webhooks
            if (typeof window !== 'undefined') {
              const userContext = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName:
                  firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
                role: profile?.role || 'cliente',
              };

              // Múltiples estrategias para exponer el contexto
              window.combustiblesUserContext = userContext;
              window.authContextData = {
                user: firebaseUser,
                userProfile: profile,
              };

              console.log(
                '🌐 Contexto global establecido:',
                userContext.email,
                'Rol:',
                userContext.role
              );
              console.log('🌐 window.combustiblesUserContext:', window.combustiblesUserContext);
            }

            if (isNewLogin) {
              try {
                console.log(
                  '🔔 Enviando notificación de login desde AuthLazy - Usuario:',
                  firebaseUser.email,
                  'Rol:',
                  profile?.role || 'cliente'
                );
                await sendLoginNotification(firebaseUser, 'firebase_auth_lazy', profile);
                console.log('✅ Notificación de login enviada correctamente desde AuthLazy');
              } catch (webhookError) {
                console.warn('Error enviando notificación de login desde AuthLazy:', webhookError);
              }
            } else {
              console.log(
                '⏭️ Saltando notificación - Es carga inicial del mismo usuario (AuthLazy)'
              );
            }

            lastUserUidRef.current = firebaseUser.uid;
          } else {
            console.log('🔓 AuthLazy: Usuario desconectado');
            setUser(null);
            setUserProfile(null);
            lastUserUidRef.current = null;

            // Limpiar contexto de usuario global
            if (typeof window !== 'undefined') {
              delete window.combustiblesUserContext;
              delete window.authContextData;
              console.log('🧹 Contextos globales limpiados');
            }
          }

          setLoading(false);
          setAuthReady(true);
          isInitialLoadRef.current = false;
        });
      } catch (error) {
        console.error('Error inicializando Firebase Auth:', error);
        setLoading(false);
        setAuthReady(false);
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
    userProfile,
    loading,
    firebaseLoaded,
    authReady,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

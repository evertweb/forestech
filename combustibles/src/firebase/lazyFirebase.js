// combustibles/src/firebase/lazyFirebase.js
// Firebase lazy loading para optimizar LCP crítico

let firebaseModule = null;

// Inicialización lazy de Firebase (solo cuando se necesite auth)
export const loadFirebase = async () => {
  if (firebaseModule) return firebaseModule;

  // Cargar Firebase de forma async para no bloquear LCP
  const [firebaseApp, auth, firestore, storage] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
    import('firebase/storage'),
  ]);

  // Configurar Firebase solo una vez
  const env = import.meta.env;
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    appId: env.VITE_FIREBASE_APP_ID,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'liquidacionapp-62962.firebaseapp.com',
    projectId: env.VITE_FIREBASE_PROJECT_ID || 'liquidacionapp-62962',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'liquidacionapp-62962.appspot.com',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '851382130132',
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
  };

  if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
    console.error(
      '❌ Firebase config incompleta: asegúrate de definir VITE_FIREBASE_API_KEY y VITE_FIREBASE_APP_ID en combustibles/.env.local'
    );
    throw new Error(
      'Configuración Firebase incompleta. Falta VITE_FIREBASE_API_KEY o VITE_FIREBASE_APP_ID.'
    );
  }

  const app = firebaseApp.initializeApp(firebaseConfig);

  firebaseModule = {
    app,
    auth: auth.getAuth(app),
    db: firestore.getFirestore(app),
    storage: storage.getStorage(app),
  };

  return firebaseModule;
};

// Re-export para compatibilidad con código existente
export const getFirebaseModule = () => firebaseModule;

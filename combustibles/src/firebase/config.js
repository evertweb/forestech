// combustibles/src/firebase/config.js
// Configuración Firebase para la app de combustibles (LEGACY - usar lazyFirebase.js)
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Lazy loading disponible en lazyFirebase.js para optimizar LCP
// import { getAnalytics, isSupported } from "firebase/analytics";
// import { getPerformance } from "firebase/performance";

// Cargar variables de entorno y validar críticas
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  appId: env.VITE_FIREBASE_APP_ID,
  // Valores con fallback del proyecto por defecto (no sensibles)
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'liquidacionapp-62962.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'liquidacionapp-62962',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'liquidacionapp-62962.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '851382130132',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
  // Mensaje claro en consola para guiar configuración local
  console.error(
    '❌ Firebase config incompleta: asegúrate de definir VITE_FIREBASE_API_KEY y VITE_FIREBASE_APP_ID en combustibles/.env.local. Revisa combustibles/.env.example para la lista completa.'
  );
  // Lanzar error amigable antes de inicializar Firebase para evitar auth/invalid-api-key
  throw new Error(
    'Configuración Firebase incompleta. Falta VITE_FIREBASE_API_KEY o VITE_FIREBASE_APP_ID.'
  );
}

// Inicializar Firebase o reutilizar la app existente
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics y Performance deshabilitados temporalmente debido a CORB
export let analytics = null;
export let performance = null;

// Comentado temporalmente para evitar errores CORB
/*
try {
  // Solo inicializar Analytics si está soportado
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    console.warn('Firebase Analytics no está soportado en este entorno');
  });

  // Performance
  if (typeof window !== 'undefined') {
    performance = getPerformance(app);
  }
} catch (error) {
  console.warn('Error al inicializar Firebase Analytics/Performance:', error);
}
*/

export default app;

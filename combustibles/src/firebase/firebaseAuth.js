// combustibles/src/firebase/firebaseAuth.js
// Configuración Firebase específica para Auth y Storage (SIN Firestore)
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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
  console.error(
    '❌ Firebase config incompleta: asegúrate de definir VITE_FIREBASE_API_KEY y VITE_FIREBASE_APP_ID en combustibles/.env.local'
  );
  throw new Error(
    'Configuración Firebase incompleta. Falta VITE_FIREBASE_API_KEY o VITE_FIREBASE_APP_ID.'
  );
}

// Inicializar Firebase o reutilizar la app existente
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Solo Auth y Storage - NO Firestore (ahora usando Azure SQL)
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
// shared/firebase/config.js
// Configuración Firebase compartida entre todas las apps del monorepo Forestech
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Verificar variables de entorno críticas
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

if (!apiKey) {
  console.error('❌ VITE_FIREBASE_API_KEY no está definida en las variables de entorno');
}

if (!appId) {
  console.error('❌ VITE_FIREBASE_APP_ID no está definida en las variables de entorno');
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "liquidacionapp-62962.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "liquidacionapp-62962",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "851382130132",
  appId: appId
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Analytics y Performance con manejo de errores
let analytics = null;
let performance = null;

if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics inicializado');
  } catch (error) {
    console.warn('⚠️ No se pudo inicializar Analytics:', error.message);
    analytics = null;
  }
  
  try {
    performance = getPerformance(app);
    console.log('✅ Firebase Performance inicializado');
  } catch (error) {
    console.warn('⚠️ No se pudo inicializar Performance:', error.message);
    performance = null;
  }
}

export { analytics, performance };

// Exportar los servicios compartidos
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Exportar el app para uso avanzado
export default app;
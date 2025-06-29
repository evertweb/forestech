// combustibles/src/firebase/config.js
// Configuración Firebase para la app de combustibles
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Verificar variables de entorno
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

if (!apiKey) {
  console.error('❌ VITE_FIREBASE_API_KEY no está definida en las variables de entorno');
}

if (!appId) {
  console.error('❌ VITE_FIREBASE_APP_ID no está definida en las variables de entorno');
}

const firebaseConfig = {
  apiKey: apiKey || 'placeholder-key',
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: appId || 'placeholder-app-id'
};

// Inicializar Firebase con manejo de errores
let app;
let auth;
let db;
let storage;
let analytics = null;
let performance = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Inicializar Analytics y Performance (solo en browser)
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('⚠️ No se pudo inicializar Analytics:', error.message);
    }
    
    try {
      performance = getPerformance(app);
    } catch (error) {
      console.warn('⚠️ No se pudo inicializar Performance:', error.message);
    }
  }
  
  console.log('✅ Firebase inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error);
  throw new Error(`Error al inicializar Firebase: ${error.message}`);
}

// Exportar los servicios
export { analytics, performance, auth, db, storage };

// Exportar el app para uso avanzado
export default app;
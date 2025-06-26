// combustibles/src/firebase/config.js
// Configuración Firebase para la app de combustibles
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Analytics y Performance (solo en browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const performance = typeof window !== 'undefined' ? getPerformance(app) : null;

// Exportar los servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Exportar el app para uso avanzado
export default app;
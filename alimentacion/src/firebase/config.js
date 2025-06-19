// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  // --- ESTA ES LA LÍNEA DEL PROBLEMA ---
  // Debe apuntar al bucket de 'firebasestorage.app'
  storageBucket: "liquidacionapp-62962.firebasestorage.app", // <-- CORRECCIÓN
  messagingSenderId: "851382130132",
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios que usaremos en la aplicación
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
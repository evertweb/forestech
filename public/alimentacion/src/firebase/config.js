// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ Tu configuración personalizada (ya está en tu proyecto actual)
const firebaseConfig = {
  apiKey: "AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.appspot.com",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:eaba38fab449f14fb5b241"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);

// combustibles/src/firebase/config.js
// Configuración Firebase para la app de combustibles
// IMPORTANTE: Usar configuración centralizada desde shared/

// Re-exportar la configuración shared para mantener compatibilidad
export { 
  analytics, 
  performance, 
  auth, 
  db, 
  storage 
} from '../../../shared/firebase/config.js';

// También exportar app por defecto
export { default } from '../../../shared/firebase/config.js';
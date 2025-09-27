/**
 * FirebaseFunctionsService - Servicio base para comunicación con Firebase Functions
 * Forestech Combustibles App
 */

import { httpsCallable, getFunctions } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

class FirebaseFunctionsService {
  constructor() {
    this.functions = getFunctions();
  }

  /**
   * Ejecutar una Firebase Function
   * @param {string} functionName - Nombre de la función
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Resultado de la función
   */
  async callFunction(functionName, data = {}) {
    try {
      console.log(`🔥 Firebase Functions: Llamando a ${functionName}`, data);

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const callableFunction = httpsCallable(this.functions, functionName);
      const result = await callableFunction(data);

      console.log(`✅ Firebase Functions: ${functionName} ejecutada exitosamente`, result.data);

      return {
        success: true,
        data: result.data,
        ...result.data
      };

    } catch (error) {
      console.error(`❌ Firebase Functions: Error en ${functionName}:`, error);

      // Manejar diferentes tipos de errores
      let errorMessage = 'Error desconocido';

      if (error.code === 'functions/unauthenticated') {
        errorMessage = 'Usuario no autenticado';
      } else if (error.code === 'functions/permission-denied') {
        errorMessage = 'Permisos insuficientes';
      } else if (error.code === 'functions/not-found') {
        errorMessage = 'Función no encontrada';
      } else if (error.code === 'functions/internal') {
        errorMessage = error.message || 'Error interno del servidor';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
        code: error.code
      };
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} - Estado de autenticación
   */
  isAuthenticated() {
    const auth = getAuth();
    return !!auth.currentUser;
  }

  /**
   * Obtener información del usuario actual
   * @returns {Object|null} - Información del usuario
   */
  getCurrentUser() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }
}

export default FirebaseFunctionsService;
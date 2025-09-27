/**
 * HttpService - Servicio base para comunicación HTTP con Cloud Run endpoints
 * Reemplaza FirebaseFunctionsService para la migración a Cloud Run
 * Forestech Combustibles App
 */

import { getAuth } from 'firebase/auth';

const CLOUD_RUN_URL = import.meta.env.VITE_CLOUD_RUN_SQL_URL || 'https://forestech-sql-service-851382130132.us-central1.run.app';

export class HttpService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || CLOUD_RUN_URL;
    this.auth = getAuth();
    
    // Circuit Breaker para evitar bucles infinitos
    this.circuitBreaker = {
      failures: new Map(), // endpoint -> count
      lastFailure: new Map(), // endpoint -> timestamp
      isOpen: new Map(), // endpoint -> boolean
      failureThreshold: 3, // máximo errores consecutivos (más agresivo)
      timeout: 120000, // 2 minutos de pausa después de circuit abierto
      resetTimeout: 30000, // tiempo para intentar reset
    };
  }

  /**
   * Obtener ID token del usuario autenticado
   * @returns {Promise<string>} - ID Token
   */
  async getIdToken() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    return await user.getIdToken();
  }

  /**
   * Verificar si el circuit breaker está abierto para un endpoint
   */
  isCircuitOpen(endpoint) {
    const isOpen = this.circuitBreaker.isOpen.get(endpoint);
    if (!isOpen) return false;
    
    const lastFailure = this.circuitBreaker.lastFailure.get(endpoint);
    const now = Date.now();
    
    // Si ha pasado el tiempo de timeout, intentar reset
    if (now - lastFailure > this.circuitBreaker.timeout) {
      console.log(`🔄 Circuit Breaker: Intentando reset para ${endpoint}`);
      this.circuitBreaker.isOpen.set(endpoint, false);
      this.circuitBreaker.failures.set(endpoint, 0);
      return false;
    }
    
    return true;
  }

  /**
   * Registrar fallo en circuit breaker
   */
  recordFailure(endpoint) {
    const failures = (this.circuitBreaker.failures.get(endpoint) || 0) + 1;
    this.circuitBreaker.failures.set(endpoint, failures);
    this.circuitBreaker.lastFailure.set(endpoint, Date.now());
    
    if (failures >= this.circuitBreaker.failureThreshold) {
      console.error(`🚨 Circuit Breaker: ABIERTO para ${endpoint} (${failures} fallos)`);
      this.circuitBreaker.isOpen.set(endpoint, true);
    }
  }

  /**
   * Registrar éxito en circuit breaker
   */
  recordSuccess(endpoint) {
    this.circuitBreaker.failures.set(endpoint, 0);
    this.circuitBreaker.isOpen.set(endpoint, false);
  }

  /**
   * Verificar si un endpoint está disponible para usar (circuit breaker cerrado)
   */
  isEndpointAvailable(endpoint) {
    return !this.isCircuitOpen(endpoint);
  }

  /**
   * Ejecutar endpoint en Cloud Run
   * @param {string} endpoint - Nombre del endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>} - Resultado de la consulta
   */
  async callEndpoint(endpoint, data = {}) {
    try {
      // Verificar circuit breaker ANTES de hacer la llamada
      if (this.isCircuitOpen(endpoint)) {
        console.warn(`⚡ Circuit Breaker: ${endpoint} está CERRADO temporalmente`);
        console.warn(`🔍 Debug Info - Endpoint: ${endpoint}, BaseURL: ${this.baseUrl}, Data:`, data);
        return {
          success: false,
          error: 'Servicio temporalmente no disponible (circuit breaker)',
          circuitBreakerOpen: true
        };
      }

      console.log(`🌐 Cloud Run: Llamando a ${endpoint}`, data);
      console.log(`🔍 Debug Info - URL completa: ${this.baseUrl}/${endpoint}`);
      console.log(`🔍 Debug Info - Headers:`, {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer [ID_TOKEN]' // No loguear token completo por seguridad
      });

      // Verificar autenticación antes de hacer la llamada
      const isAuth = await this.isAuthenticated();
      if (!isAuth) {
        console.warn(`⚠️ Cloud Run: Usuario no autenticado para ${endpoint}`);
        return {
          success: false,
          error: 'Usuario no autenticado',
        };
      }

      const idToken = await this.getIdToken();

      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Cloud Run ${endpoint}: HTTP ${response.status} - ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Cloud Run: ${endpoint} ejecutada exitosamente`, result);

      // Registrar éxito en circuit breaker
      this.recordSuccess(endpoint);

      if (result.success !== false) {
        return {
          success: true,
          data: result,
          ...result
        };
      } else {
        return {
          success: false,
          error: result.error || 'Error desconocido',
          ...result
        };
      }
    } catch (error) {
      console.error(`❌ Cloud Run: Error en ${endpoint}:`, error);
      
      // Registrar fallo en circuit breaker
      this.recordFailure(endpoint);
      
      return {
        success: false,
        error: error.message || 'Error de conexión',
        circuitBreakerFailure: true
      };
    }
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {Promise<boolean>} - Estado de autenticación
   */
  async isAuthenticated() {
    const auth = getAuth();
    return !!auth.currentUser;
  }

  /**
   * Obtener información del usuario actual
   * @returns {Promise<Object|null>} - Información del usuario
   */
  async getCurrentUser() {
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

export default HttpService;
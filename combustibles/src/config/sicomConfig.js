/**
 * Configuración para la API SICOM
 * (Sistema de Información de Comercialización de Combustibles)
 */

// Configuración de autenticación SICOM
export const SICOM_CONFIG = {
  // API Key - Se debe configurar en variables de entorno
  API_KEY: import.meta.env.VITE_SICOM_API_KEY || null,

  // URLs base
  BASE_URL: 'https://eds.sicom.gov.co/eds/api/v1/birest',

  // Endpoints disponibles
  ENDPOINTS: {
    DEPARTAMENTOS: '/departamentos',
    MUNICIPIOS: '/municipios',
    PRECIOS: '/precios-combustibles',
    EDS: '/estaciones-servicio',
    AUTH: '/auth/token',
  },

  // Configuración de requests
  REQUEST_CONFIG: {
    TIMEOUT: 15000, // 15 segundos
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 1000, // 1 segundo entre reintentos
  },

  // Headers por defecto
  DEFAULT_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'ForestechCombustibles/1.0',
  },

  // Municipios prioritarios para La Primavera
  PRIORITY_MUNICIPALITIES: {
    'LA PRIMAVERA': {
      id: null, // Se obtiene dinámicamente
      departamento: 'VICHADA',
      codigo_dane: '99524',
      alternativeNames: ['PRIMAVERA', 'LA PRIMAVERA VICHADA'],
    },
    BOGOTÁ: {
      id: null,
      departamento: 'CUNDINAMARCA',
      codigo_dane: '11001',
      alternativeNames: ['BOGOTA', 'BOGOTÁ D.C.', 'DISTRITO CAPITAL'],
    },
  },
};

/**
 * Obtener headers de autenticación para SICOM
 * @returns {Object} Headers con autenticación
 */
export const getSicomAuthHeaders = () => {
  const headers = { ...SICOM_CONFIG.DEFAULT_HEADERS };

  if (SICOM_CONFIG.API_KEY) {
    headers['Authorization'] = `Bearer ${SICOM_CONFIG.API_KEY}`;
  } else {
    console.warn('⚠️ SICOM API Key no configurada. Usando acceso público limitado.');
  }

  return headers;
};

/**
 * Verificar si SICOM está disponible
 * @returns {Promise<boolean>} True si SICOM responde
 */
export const checkSicomAvailability = async () => {
  try {
    const response = await fetch(`${SICOM_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: getSicomAuthHeaders(),
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch (error) {
    console.warn('⚠️ SICOM no disponible:', error.message);
    return false;
  }
};

/**
 * Obtener información de configuración API Key
 * @returns {Object} Estado de configuración
 */
export const getSicomConfigStatus = () => {
  return {
    hasApiKey: !!SICOM_CONFIG.API_KEY,
    apiKeyLength: SICOM_CONFIG.API_KEY ? SICOM_CONFIG.API_KEY.length : 0,
    baseUrl: SICOM_CONFIG.BASE_URL,
    isConfigured: !!SICOM_CONFIG.API_KEY,
  };
};

export default SICOM_CONFIG;

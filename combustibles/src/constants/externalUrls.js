/**
 * URLs externas y enlaces centralizados para la app combustibles
 * Centraliza URLs de APIs, servicios externos, CDNs y recursos web
 */

// ===================================================================
// URLS DE COMUNICACIÓN Y SOPORTE
// ===================================================================
export const COMMUNICATION_URLS = {
  // WhatsApp de soporte
  WHATSAPP_SUPPORT: 'https://wa.me/573124559869?text=Hola,%20necesito%20un%20código%20de%20invitación%20para%20acceder%20al%20sistema%20de%20combustibles',
  
  // WhatsApp con mensajes predefinidos
  WHATSAPP_TECH_SUPPORT: 'https://wa.me/573124559869?text=Hola,%20necesito%20ayuda%20técnica%20con%20el%20sistema%20de%20combustibles',
  WHATSAPP_BUG_REPORT: 'https://wa.me/573124559869?text=Hola,%20quiero%20reportar%20un%20error%20en%20el%20sistema%20de%20combustibles',
  WHATSAPP_FEATURE_REQUEST: 'https://wa.me/573124559869?text=Hola,%20tengo%20una%20sugerencia%20para%20mejorar%20el%20sistema%20de%20combustibles',
  
  // Otros canales de comunicación (si aplican en el futuro)
  EMAIL_SUPPORT: 'mailto:soporte@forestech.com.co',
  PHONE_SUPPORT: 'tel:+573124559869'
};

// ===================================================================
// URLS DE RECURSOS EXTERNOS (CDNs, FUENTES, ICONOS)
// ===================================================================
export const CDN_URLS = {
  // Google Fonts
  FONTS: {
    // Fuente para tema SAP Fiori
    GOOGLE_FONTS_SAP: 'https://fonts.googleapis.com/css2?family=72:wght@400;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap',
    
    // Fuente para tema Retro 80s
    GOOGLE_FONTS_RETRO: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap',
    
    // Fuente para movimientos SAP
    GOOGLE_FONTS_MOVEMENTS: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap'
  },
  
  // SVG externos y recursos gráficos
  GRAPHICS: {
    // React logo (usado en assets)
    REACT_SVG: 'https://vitejs.dev/logo.svg',
    
    // Iconos de FontAwesome (si se requieren en el futuro)
    FONTAWESOME_CSS: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    
    // Iconos de Material Design (si se requieren)
    MATERIAL_ICONS: 'https://fonts.googleapis.com/icon?family=Material+Icons'
  }
};

// ===================================================================
// URLS DE APIS Y SERVICIOS EXTERNOS
// ===================================================================
export const API_URLS = {
  // APIs de Google (para posibles integraciones futuras)
  GOOGLE: {
    MAPS_API: 'https://maps.googleapis.com/maps/api/js',
    SHEETS_API: 'https://sheets.googleapis.com/v4/spreadsheets',
    DRIVE_API: 'https://www.googleapis.com/drive/v3'
  },
  
  // APIs gubernamentales colombianas (para validaciones)
  COLOMBIA: {
    RUNT_VEHICULOS: 'https://www.runt.com.co/consultaCiudadana',
    DIAN_NIT: 'https://muisca.dian.gov.co/WebRUT/DefConsultaEstadoRUT.faces',
    SIMIT_COMPARENDOS: 'https://www.simit.org.co/simit-consulta-web'
  },
  
  // APIs de servicios de combustibles (para futuras integraciones)
  FUEL_SERVICES: {
    PRECIO_COMBUSTIBLES: 'https://www.minenergia.gov.co/web/10180/precio-de-los-combustibles',
    ESTACIONES_SERVICIO: 'https://www.ecopetrol.com.co/wps/portal/es/ecopetrol-web'
  }
};

// ===================================================================
// URLS DE DOCUMENTACIÓN Y AYUDA
// ===================================================================
export const DOCUMENTATION_URLS = {
  // Enlaces a documentación técnica
  TECHNICAL: {
    FIREBASE_DOCS: 'https://firebase.google.com/docs',
    REACT_DOCS: 'https://react.dev/learn',
    VITE_DOCS: 'https://vitejs.dev/guide',
    FORESTECH_DOCS: 'https://docs.forestech.com.co' // URL hipotética
  },
  
  // Manuales de usuario
  USER_MANUALS: {
    COMBUSTIBLES_MANUAL: '/docs/manual-combustibles.pdf',
    VIDEO_TUTORIALS: 'https://www.youtube.com/@forestech',
    FAQ: '/docs/preguntas-frecuentes.html'
  },
  
  // Legal y compliance
  LEGAL: {
    TERMINOS_SERVICIO: '/legal/terminos-servicio.html',
    POLITICA_PRIVACIDAD: '/legal/politica-privacidad.html',
    LICENCIAS: '/legal/licencias.html'
  }
};

// ===================================================================
// URLS INTERNAS DEL SISTEMA
// ===================================================================
export const INTERNAL_URLS = {
  // Rutas principales de la aplicación
  ROUTES: {
    DASHBOARD: '/',
    VEHICLES: '/vehicles',
    INVENTORY: '/inventory',
    MOVEMENTS: '/movements',
    SUPPLIERS: '/suppliers',
    MAINTENANCE: '/maintenance',
    PRODUCTS: '/products',
    REPORTS: '/reports',
    ADMIN: '/admin',
    AUTH: '/auth'
  },
  
  // URLs de recursos estáticos
  STATIC: {
    IMAGES: '/images',
    ICONS: '/icons',
    DOCUMENTS: '/documents',
    EXPORTS: '/exports'
  },
  
  // URLs de API interna
  API: {
    BASE: '/api',
    VEHICLES: '/api/vehicles',
    INVENTORY: '/api/inventory', 
    MOVEMENTS: '/api/movements',
    SUPPLIERS: '/api/suppliers',
    AUTH: '/api/auth'
  }
};

// ===================================================================
// URLS DE DESARROLLO Y TESTING
// ===================================================================
export const DEVELOPMENT_URLS = {
  // Herramientas de desarrollo
  TOOLS: {
    LOCALHOST: 'http://localhost:5173',
    LOCALHOST_API: 'http://localhost:3000',
    FIREBASE_EMULATOR: 'http://localhost:4000',
    STORYBOOK: 'http://localhost:6006'
  },
  
  // URLs de testing
  TESTING: {
    TEST_API: 'https://jsonplaceholder.typicode.com',
    MOCK_DATA: '/mock-data',
    TEST_IMAGES: 'https://picsum.photos'
  }
};

// ===================================================================
// CONFIGURACIÓN DE URLs POR AMBIENTE
// ===================================================================
export const ENVIRONMENT_URLS = {
  // Producción
  PRODUCTION: {
    APP_URL: 'https://combustibles.forestech.com.co',
    API_URL: 'https://api.forestech.com.co',
    CDN_URL: 'https://cdn.forestech.com.co'
  },
  
  // Staging/Pruebas
  STAGING: {
    APP_URL: 'https://staging-combustibles.forestech.com.co',
    API_URL: 'https://staging-api.forestech.com.co',
    CDN_URL: 'https://staging-cdn.forestech.com.co'
  },
  
  // Desarrollo local
  DEVELOPMENT: {
    APP_URL: 'http://localhost:5173',
    API_URL: 'http://localhost:3000',
    CDN_URL: 'http://localhost:8080'
  }
};

// ===================================================================
// UTILIDADES PARA URLs
// ===================================================================

/**
 * Construye URL de WhatsApp con mensaje personalizado
 * @param {string} phoneNumber - Número de teléfono con código de país
 * @param {string} message - Mensaje predefinido
 * @returns {string} URL completa de WhatsApp
 */
export const buildWhatsAppURL = (phoneNumber = '573124559869', message = '') => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

/**
 * Obtiene URLs según el ambiente actual
 * @param {string} environment - Ambiente (production, staging, development)
 * @returns {object} URLs del ambiente especificado
 */
export const getEnvironmentUrls = (environment = 'development') => {
  return ENVIRONMENT_URLS[environment.toUpperCase()] || ENVIRONMENT_URLS.DEVELOPMENT;
};

/**
 * Construye URL completa de API
 * @param {string} endpoint - Endpoint de la API
 * @param {string} environment - Ambiente actual
 * @returns {string} URL completa
 */
export const buildApiUrl = (endpoint, environment = 'development') => {
  const baseUrl = getEnvironmentUrls(environment).API_URL;
  return `${baseUrl}${endpoint}`;
};

// ===================================================================
// EXPORTACIÓN PRINCIPAL
// ===================================================================
export const EXTERNAL_URLS = {
  COMMUNICATION: COMMUNICATION_URLS,
  CDN: CDN_URLS,
  API: API_URLS,
  DOCUMENTATION: DOCUMENTATION_URLS,
  INTERNAL: INTERNAL_URLS,
  DEVELOPMENT: DEVELOPMENT_URLS,
  ENVIRONMENT: ENVIRONMENT_URLS,
  
  // Utilidades
  buildWhatsAppURL,
  getEnvironmentUrls,
  buildApiUrl
};

export default EXTERNAL_URLS;
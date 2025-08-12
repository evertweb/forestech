import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHtmlTemplate } from './html-template.js';
import AppSSRMinimal from './AppSSRMinimal.js';
import { initFirebaseServerApp, getSerializableUser, hasRouteAccess } from './firebase-server-app.js';
import { getRouteMetadata, validateMetadata, generateStructuredData } from './route-meta.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readCSRIndex = async () => {
  // En Cloud Functions, servir desde el directorio functions/public/
  const root = path.resolve(__dirname, '../');
  const filePath = path.resolve(root, 'public/combustibles/index.html');
  return fs.readFile(filePath, 'utf8');
};

export function healthHandler(req, res) {
  res.setHeader('Server-Timing', 'ssr_total;dur=1');
  res.status(200).send('OK');
}

export async function ssrHandler(req, res) {
  const start = Date.now();
  let dataFetchStart = 0;
  let dataFetchDuration = 0;
  
  // Limpiar cache en el primer request después de deploy (para nueva versión de componentes)
  if (!global.ssrCacheInitialized) {
    clearCache();
    global.ssrCacheInitialized = true;
    console.info('🚀 SSR initialized with fresh cache');
  }
  
  const sendFallback = async (status = 200, reason = 'error', errorCode = null) => {
    try {
      const html = await readCSRIndex();
      res.setHeader('x-fallback-csr', '1');
      res.setHeader('x-fallback-reason', reason);
      if (errorCode) {
        res.setHeader('x-error-code', errorCode);
      }
      res.status(status).send(html);
      
      // Log fallback estruturado para monitoreo y alertas
      const logData = {
        type: 'ssr_fallback',
        route: req.path,
        reason,
        errorCode,
        fallback: true,
        duration: Date.now() - start,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection?.remoteAddress,
        user: req.user?.uid || null
      };
      
      console.info(`SSR Fallback:`, JSON.stringify(logData));
      
      // Incrementar contador para alertas
      incrementErrorCounter(reason, errorCode);
      
    } catch (e) {
      console.error('Fallback CSR error:', e);
      
      // Log critical error
      const criticalLog = {
        type: 'ssr_critical_error',
        route: req.path,
        error: e.message,
        stack: e.stack?.substring(0, 500),
        fallback: false,
        timestamp: new Date().toISOString()
      };
      
      console.error(`SSR Critical:`, JSON.stringify(criticalLog));
      res.status(500).send('SSR critical error');
    }
  };

  try {
    // 1. Inicializar Firebase Server App con continuidad de sesión
    const firebase = await initFirebaseServerApp(req);
    const user = getSerializableUser(firebase);
    
    // Log usuario autenticado (solo UID por privacidad)
    if (user?.uid) {
      console.info(`SSR Auth: ${req.path} | UID: ${user.uid} | Email: ${user.email || 'N/A'}`);
    }
    
    // 2. Verificar si SSR está habilitado para esta ruta via Remote Config
    // Usar configuración de test en emulador
    const useTestConfig = process.env.FUNCTIONS_EMULATOR === 'true' || process.env.NODE_ENV === 'test';
    const { isSSREnabled } = useTestConfig 
      ? await import('./remote-config-test.js')
      : await import('./remote-config.js');
    
    const ssrEnabled = await isSSREnabled(req.path, user);
    if (!ssrEnabled) {
      return sendFallback(200, 'ssr_disabled', 'RC001');
    }
    
    // 3. Verificar acceso a la ruta
    if (!hasRouteAccess(user, req.path)) {
      // Para rutas protegidas sin auth, redirigir a login via CSR
      return sendFallback(200, 'auth_required', 'AUTH001');
    }
    
    // 4. Cargar datos iniciales según la ruta
    dataFetchStart = Date.now();
    const initialData = await fetchInitialData(req.path, firebase);
    dataFetchDuration = Date.now() - dataFetchStart;
    
    // 5. Preparar initial state completo
    const initialState = {
      route: req.path,
      timestamp: Date.now(),
      ssr: true,
      user,
      data: initialData,
      // Metadata para hydration
      ssrTiming: {
        start,
        dataFetch: dataFetchDuration,
      }
    };
    
    // 6. Validar tamaño del initial state (< 100KB)
    const serializedState = JSON.stringify(initialState);
    const stateSize = new TextEncoder().encode(serializedState).length;
    if (stateSize > 100 * 1024) { // 100KB
      console.warn(`Initial state too large: ${stateSize} bytes for ${req.path}`);
      // Reducir datos o fallback a CSR
      initialState.data = { error: 'data_too_large', size: stateSize };
    }

    // 7. Determinar metadatos dinámicos por ruta
    const dynamicData = prepareDynamicData(req.path, initialData, user);
    const routeMetadata = getRouteMetadata(req.path, dynamicData);
    const validatedMetadata = validateMetadata(routeMetadata);
    
    // 8. Renderizar con React SSR
    const renderStart = Date.now();
    const { pipe } = renderToPipeableStream(
      React.createElement(AppSSRMinimal, { 
        location: req.url,
        initialState,
        user
      }),
      {
        onShellReady() {
          res.status(200);
          res.setHeader('Content-Type', 'text/html');
          
          const totalDur = Date.now() - start;
          const renderDur = Date.now() - renderStart;
          
          // Server-Timing headers detallados
          res.setHeader('Server-Timing', 
            `ssr_total;dur=${totalDur}, ssr_render;dur=${renderDur}, data_fetch;dur=${dataFetchDuration}`
          );
          
          // Crear HTML template completo con metadatos dinámicos
          const html = createHtmlTemplate({
            metadata: validatedMetadata,
            initialState,
            appHtml: '', // Se llenará por pipe
            serverTiming: `ssr_total;dur=${totalDur}, ssr_render;dur=${renderDur}, data_fetch;dur=${dataFetchDuration}`,
            currentUrl: req.path
          });
          
          // Enviar template hasta el div root
          const [beforeRoot, afterRoot] = html.split('<div id="root">');
          const [, afterContent] = afterRoot.split('</div>');
          
          res.write(beforeRoot + '<div id="root">');
          pipe(res);
          res.write('</div>' + afterContent);
          
          // Log exitoso para monitoreo
          console.info(`SSR Success: ${req.path} | Total: ${totalDur}ms | Render: ${renderDur}ms | DataFetch: ${dataFetchDuration}ms | User: ${user?.uid || 'anonymous'}`);
        },
        onError(err) {
          console.error('SSR render error:', err);
          sendFallback(200, 'render_error', 'RENDER001');
        },
      }
    );
  } catch (e) {
    console.error('SSR top-level error', e);
    sendFallback(200, 'server_error', 'SERVER001');
  }
}

/**
 * Cargar datos iniciales según la ruta con cache SWR
 * @param {string} route - Ruta actual
 * @param {Object} firebase - Contexto Firebase (app, auth, firestore, user)
 * @returns {Promise<Object>} - Datos iniciales para la ruta
 */
async function fetchInitialData(route, firebase) {
  try {
    // Generar cache key considerando usuario para datos personalizados
    const userId = firebase.user?.uid || 'anonymous';
    const cacheKey = `${route}:${userId}`;
    
    // Intentar obtener datos del cache para datos no sensibles
    const isPublicRoute = route.includes('/login') || route === '/combustibles/' || route === '/combustibles';
    if (isPublicRoute) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.info(`Cache hit for ${route}`);
        return cached;
      }
    }
    
    // Timeout para fetch de datos (máximo 800ms)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Data fetch timeout')), 800)
    );
    
    const dataPromise = (async () => {
      // Rutas públicas - sin datos
      if (route.includes('/login') || route === '/combustibles/' || route === '/combustibles') {
        const data = { pageType: 'login', requiresAuth: false };
        // Cache datos públicos
        setCachedData(cacheKey, data);
        return data;
      }
      
      // Ruta movements - cargar datos iniciales
      if (route.includes('/movements')) {
        return await fetchMovementsData(firebase);
      }
      
      // Ruta inventory - cargar datos SSR
      if (route.includes('/inventory')) {
        return await fetchInventoryData(firebase);
      }
      
      // Ruta vehicles - cargar datos SSR  
      if (route.includes('/vehicles')) {
        return await fetchVehiclesData(firebase);
      }
      
      // Dashboard - datos personalizados
      if (route.includes('/dashboard')) {
        return { pageType: 'dashboard', requiresAuth: true, user: firebase.user };
      }
      
      // Ruta por defecto
      return { pageType: 'unknown', route };
    })();
    
    const result = await Promise.race([dataPromise, timeoutPromise]);
    
    // Cache result para rutas apropiadas (no datos sensibles)
    if (isPublicRoute) {
      setCachedData(cacheKey, result);
    }
    
    return result;
    
  } catch (error) {
    console.warn(`Data fetch error for ${route}:`, error.message);
    return { 
      error: error.message, 
      pageType: 'error',
      fallback: true 
    };
  }
}

/**
 * Cargar datos iniciales para la página de movements
 * @param {Object} firebase - Contexto Firebase
 * @returns {Promise<Object>} - Datos de movements
 */
async function fetchMovementsData(firebase) {
  if (!firebase.user) {
    return { pageType: 'movements', requiresAuth: true, authenticated: false };
  }
  
  try {
    // Por ahora, datos mock - en implementación real sería Firestore query
    // TODO: Implementar query real a Firestore en próximas iteraciones
    const mockMovements = [
      {
        id: 'mov_001',
        date: new Date().toISOString(),
        type: 'entrada',
        quantity: 1500,
        fuel: 'diesel',
        vehicle: 'Camión 001'
      },
      {
        id: 'mov_002', 
        date: new Date(Date.now() - 86400000).toISOString(), // Ayer
        type: 'salida',
        quantity: 800,
        fuel: 'gasolina',
        vehicle: 'Pickup 002'
      }
    ];
    
    return {
      pageType: 'movements',
      requiresAuth: true,
      authenticated: true,
      movements: mockMovements,
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        hasMore: false
      }
    };
  } catch (error) {
    console.error('Error fetching movements:', error);
    return {
      pageType: 'movements',
      requiresAuth: true,
      authenticated: true,
      error: error.message
    };
  }
}

/**
 * Cargar datos iniciales para la página de inventory
 * @param {Object} firebase - Contexto Firebase
 * @returns {Promise<Object>} - Datos de inventory
 */
async function fetchInventoryData(firebase) {
  if (!firebase.user) {
    return { pageType: 'inventory', requiresAuth: true, authenticated: false };
  }
  
  try {
    // Datos mock para inventory - en implementación real sería Firestore query
    const mockInventory = {
      products: [
        {
          id: 'prod_001',
          name: 'Diesel',
          category: 'combustible',
          currentStock: 15000,
          minStock: 5000,
          maxStock: 25000,
          unit: 'litros',
          lastUpdate: new Date().toISOString(),
          status: 'normal'
        },
        {
          id: 'prod_002',
          name: 'Gasolina Extra',
          category: 'combustible',
          currentStock: 8500,
          minStock: 3000,
          maxStock: 15000,
          unit: 'litros',
          lastUpdate: new Date().toISOString(),
          status: 'normal'
        },
        {
          id: 'prod_003',
          name: 'Aceite Motor 15W40',
          category: 'lubricante',
          currentStock: 250,
          minStock: 100,
          maxStock: 500,
          unit: 'litros',
          lastUpdate: new Date().toISOString(),
          status: 'low'
        }
      ],
      summary: {
        totalProducts: 12,
        activeProducts: 11,
        lowStockItems: 3,
        totalValue: 125000000,
        lastInventoryDate: new Date(Date.now() - 86400000).toISOString()
      }
    };
    
    return {
      pageType: 'inventory',
      requiresAuth: true,
      authenticated: true,
      ...mockInventory
    };
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return {
      pageType: 'inventory',
      requiresAuth: true,
      authenticated: true,
      error: error.message
    };
  }
}

/**
 * Cargar datos iniciales para la página de vehicles
 * @param {Object} firebase - Contexto Firebase
 * @returns {Promise<Object>} - Datos de vehicles
 */
async function fetchVehiclesData(firebase) {
  if (!firebase.user) {
    return { pageType: 'vehicles', requiresAuth: true, authenticated: false };
  }
  
  try {
    // Datos mock para vehicles - en implementación real sería Firestore query
    const mockVehicles = {
      vehicles: [
        {
          id: 'veh_001',
          plate: 'ABC123',
          brand: 'Chevrolet',
          model: 'NPR',
          year: 2020,
          category: 'camion',
          fuelType: 'diesel',
          status: 'activo',
          lastMaintenance: new Date(Date.now() - 15 * 86400000).toISOString(),
          nextMaintenance: new Date(Date.now() + 15 * 86400000).toISOString(),
          mileage: 85000
        },
        {
          id: 'veh_002',
          plate: 'DEF456',
          brand: 'Toyota',
          model: 'Hilux',
          year: 2019,
          category: 'pickup',
          fuelType: 'gasolina',
          status: 'activo',
          lastMaintenance: new Date(Date.now() - 30 * 86400000).toISOString(),
          nextMaintenance: new Date(Date.now() + 30 * 86400000).toISOString(),
          mileage: 125000
        }
      ],
      categories: [
        { id: 'camion', name: 'Camión', count: 8 },
        { id: 'pickup', name: 'Pickup', count: 12 },
        { id: 'moto', name: 'Motocicleta', count: 5 }
      ],
      summary: {
        totalVehicles: 25,
        activeVehicles: 23,
        inMaintenance: 2,
        needsMaintenance: 4,
        categories: 5
      }
    };
    
    return {
      pageType: 'vehicles',
      requiresAuth: true,
      authenticated: true,
      ...mockVehicles
    };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return {
      pageType: 'vehicles',
      requiresAuth: true,
      authenticated: true,
      error: error.message
    };
  }
}

/**
 * Preparar datos dinámicos para enriquecer metadatos
 * @param {string} route - Ruta actual
 * @param {Object} data - Datos iniciales de la ruta
 * @param {Object} user - Usuario autenticado
 * @returns {Object} - Datos dinámicos para metadatos
 */
function prepareDynamicData(route, data, user) {
  const dynamicData = {};

  // Movements: preparar stats para metadatos
  if (route.includes('/movements') && data?.movements) {
    dynamicData.movementsStats = {
      total: data.movements.length || 0,
      today: data.movements.filter(m => {
        const movDate = new Date(m.date);
        const today = new Date();
        return movDate.toDateString() === today.toDateString();
      }).length || 0
    };
  }

  // Inventory: preparar stats (mock por ahora)
  if (route.includes('/inventory')) {
    dynamicData.inventoryStats = {
      activeProducts: data?.products?.length || 12, // Mock
      totalStock: 45000, // Mock - litros totales
      lowStockItems: 3 // Mock
    };
  }

  // Vehicles: preparar stats (mock por ahora)
  if (route.includes('/vehicles')) {
    dynamicData.vehiclesStats = {
      totalVehicles: data?.vehicles?.length || 25, // Mock
      categories: 5, // Mock
      activeVehicles: 23 // Mock
    };
  }

  // Dashboard: stats de usuario personalizado
  if (route.includes('/dashboard') && user) {
    dynamicData.userStats = {
      userName: user.displayName || user.email?.split('@')[0] || 'Usuario',
      lastLogin: user.lastSignInTime,
      role: user.customClaims?.role || 'operador'
    };
  }

  return dynamicData;
}

/**
 * Implementar cache SWR en memoria para datos no sensibles
 */
const memoryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCachedData(key) {
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data) {
  memoryCache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  // Cleanup: eliminar entradas expiradas
  if (memoryCache.size > 100) {
    const now = Date.now();
    for (const [k, v] of memoryCache.entries()) {
      if (now - v.timestamp > CACHE_TTL) {
        memoryCache.delete(k);
      }
    }
  }
}

// Función para limpiar cache manualmente (útil después de deploys)
function clearCache() {
  memoryCache.clear();
  console.info('🧹 SSR Cache cleared');
  return { cleared: true, timestamp: new Date().toISOString() };
}

// Endpoint especial para limpiar cache (solo en desarrollo)
export function clearCacheHandler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Cache clear not allowed in production' });
  }
  
  const result = clearCache();
  res.json(result);
}

/**
 * Sistema de contadores para monitoreo y alertas
 */
const errorCounters = new Map();
const COUNTER_RESET_INTERVAL = 5 * 60 * 1000; // 5 minutos
const ERROR_THRESHOLD = 0.05; // 5% de error rate
const LATENCY_THRESHOLD = 2000; // 2 segundos

// Reset contadores cada 5 minutos
setInterval(() => {
  errorCounters.clear();
}, COUNTER_RESET_INTERVAL);

/**
 * Incrementar contador de errores para alertas
 * @param {string} reason - Razón del fallback
 * @param {string} errorCode - Código de error
 */
function incrementErrorCounter(reason, errorCode) {
  const key = `${reason}_${errorCode || 'UNKNOWN'}`;
  const current = errorCounters.get(key) || 0;
  errorCounters.set(key, current + 1);
  
  // Check si excede threshold para alertar
  const totalRequests = getTotalRequestCount();
  if (totalRequests > 20) { // Mínimo 20 requests para calcular rate
    const errorRate = current / totalRequests;
    if (errorRate > ERROR_THRESHOLD) {
      console.error(`🚨 HIGH ERROR RATE ALERT: ${key} - Rate: ${(errorRate * 100).toFixed(2)}% | Count: ${current}/${totalRequests}`);
      
      // En producción, aquí se podría enviar a un sistema de alertas
      // sendAlert('high_error_rate', { reason, errorCode, rate: errorRate, count: current });
    }
  }
}

/**
 * Obtener total de requests (simplificado - en producción usar métricas reales)
 * @returns {number} Total de requests estimado
 */
function getTotalRequestCount() {
  // Simplificado: suma todos los contadores + estimación de éxitos
  const totalErrors = Array.from(errorCounters.values()).reduce((sum, count) => sum + count, 0);
  // Estimamos que por cada error hay ~19 éxitos (5% error rate base)
  return totalErrors * 20;
}

/**
 * Obtener estadísticas de errores para dashboard
 * @returns {Object} Estadísticas de errores
 */
export function getErrorStats() {
  const stats = {};
  const totalRequests = getTotalRequestCount();
  
  for (const [key, count] of errorCounters.entries()) {
    const rate = totalRequests > 0 ? (count / totalRequests) * 100 : 0;
    stats[key] = {
      count,
      rate: Math.round(rate * 100) / 100
    };
  }
  
  return {
    counters: stats,
    totalRequests,
    errorThreshold: ERROR_THRESHOLD * 100,
    latencyThreshold: LATENCY_THRESHOLD
  };
}

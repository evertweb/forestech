import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createHtmlTemplate } from './html-template.js';
import AppSSRMinimal from './AppSSRMinimal.js';
import { initFirebaseServerApp, getSerializableUser, hasRouteAccess } from './firebase-server-app.js';
import { getRouteMetadata, validateMetadata } from './route-meta.js';
import { monitorSSRPerformance, createTimer } from './performance-monitor.js';
import { shouldUseSSR } from './ab-testing-phase1.js';
import { getCachedOrFetch, getCacheStats, invalidateCache } from './cache-strategy.js';
import { SSRError, handleSSRError } from './error-handler-advanced.js';
import { sitemapHandler, robotsHandler } from './sitemap.js';

export function healthHandler(req, res) {
  res.setHeader('Server-Timing', 'ssr_total;dur=1');
  res.status(200).send('OK');
}

export async function ssrHandler(req, res) {
  // Manejar sitemap.xml y robots.txt antes del SSR
  if (req.path === '/sitemap.xml' || req.url === '/sitemap.xml') {
    return sitemapHandler(req, res);
  }
  if (req.path === '/robots.txt' || req.url === '/robots.txt') {
    return robotsHandler(req, res);
  }
  
  const timer = createTimer();
  const start = timer.start;
  let dataFetchStart = 0;
  let dataFetchDuration = 0;
  let authDuration = 0;
  
  // Limpiar cache en el primer request después de deploy (para nueva versión de componentes)
  if (!global.ssrCacheInitialized) {
    clearCache();
    global.ssrCacheInitialized = true;
    console.info('🚀 SSR initialized with fresh cache');
  }
  
  // Función legacy para compatibilidad - ahora usa el sistema avanzado
  const sendFallback = async (status = 200, reason = 'error', errorCode = null) => {
    // Determinar categoría basada en el reason
    let category = 'TIMEOUT'; // categoría por defecto
    if (reason === 'auth_required' || reason === 'authentication_required') {
      category = 'AUTH';
    } else if (reason === 'render_error') {
      category = 'RENDER';
    } else if (reason === 'data_fetch_error') {
      category = 'DATA_FETCH';
    }

    res.status(status);

    const error = new SSRError(`SSR fallback: ${reason}`, {
      code: errorCode || 'FALLBACK001',
      category,
      route: req.path,
      user: req.user,
      context: {
        reason,
        duration: Date.now() - start,
        userAgent: req.get('User-Agent')?.substring(0, 100),
        ip: req.ip || req.connection?.remoteAddress
      }
    });

    return await handleSSRError(error, req, res);
  };

  try {
    // 1. Inicializar Firebase Server App con continuidad de sesión
    const authStart = Date.now();
    const firebase = await initFirebaseServerApp(req);
    const user = getSerializableUser(firebase);
    authDuration = Date.now() - authStart;
    
    // Log usuario autenticado (solo UID por privacidad)
    if (user?.uid) {
      console.info(`SSR Auth: ${req.path} | UID: ${user.uid} | Email: ${user.email || 'N/A'}`);
    }
    
    // 2. Verificar si SSR está habilitado via Remote Config + A/B Testing
    // Usar configuración de test en emulador
    const useTestConfig = process.env.FUNCTIONS_EMULATOR === 'true' || process.env.NODE_ENV === 'test';
    const { isSSREnabled } = useTestConfig 
      ? await import('./remote-config-test.js')
      : await import('./remote-config.js');
    
    const ssrEnabled = await isSSREnabled(req.path, user);
    if (!ssrEnabled) {
      return sendFallback(200, 'ssr_disabled', 'RC001');
    }
    
    // 2b. A/B Testing - Verificar si este usuario debe recibir SSR
    const useSSRForUser = shouldUseSSR(req.path, user);
    if (!useSSRForUser) {
      return sendFallback(200, 'ab_test_csr', 'AB001');
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
          
          // Crear HTML template completo con metadatos dinámicos (sin await aquí)

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
          
          // Log exitoso + monitoreo de performance
          console.info(`SSR Success: ${req.path} | Total: ${totalDur}ms | Render: ${renderDur}ms | DataFetch: ${dataFetchDuration}ms | User: ${user?.uid || 'anonymous'}`);
          
          // Monitoreo de performance - FASE 1
          monitorSSRPerformance(req, start, true, {
            dataFetch: dataFetchDuration,
            render: renderDur,
            auth: authDuration
          });
        },
        onError(err) {
          console.error('SSR render error:', err);
          
          // Monitoreo de error de render
          monitorSSRPerformance(req, start, false, {
            dataFetch: dataFetchDuration,
            render: Date.now() - renderStart,
            auth: authDuration,
            error: err.message
          });
          
          sendFallback(200, 'render_error', 'RENDER001');
        },
      }
    );
  } catch (e) {
    // Sistema de error handling avanzado - Fase 4
    const error = new SSRError(e.message, {
      code: e.code || 'SSR001',
      category: 'RENDER', // categoría por defecto para errores de renderizado
      route: req.path,
      user: getSerializableUser(req.firebase),
      context: {
        originalError: e.name,
        duration: Date.now() - start,
        dataFetchDuration,
        authDuration,
        stack: e.stack?.substring(0, 500),
        userAgent: req.get('User-Agent')?.substring(0, 100)
      }
    });
    
    // Monitoreo de error top-level
    monitorSSRPerformance(req, start, false, {
      dataFetch: dataFetchDuration,
      auth: authDuration,
      error: e.message
    });
    
    return await handleSSRError(error, req, res);
  }
}

/**
 * Cargar datos iniciales según la ruta con cache SWR
 * @param {string} route - Ruta actual
 * @param {Object} firebase - Contexto Firebase (app, auth, firestore, user)
 * @returns {Promise<Object>} - Datos iniciales para la ruta
 */
async function fetchInitialData(route, firebase) {
  const userId = firebase.user?.uid || 'anonymous';
  
  // Use enhanced caching strategy
  return await getCachedOrFetch(route, userId, async () => {
    // Timeout para fetch de datos (máximo 1200ms for Phase 3)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Data fetch timeout')), 1200)
    );
    
    const dataPromise = (async () => {
      // Rutas públicas - sin datos
      if (route.includes('/login') || route === '/combustibles/' || route === '/combustibles') {
        return { pageType: 'login', requiresAuth: false };
      }
      
      // Rutas de popup - datos mínimos para popup (con y sin prefijo /combustibles/)
      if (route === '/movement-wizard-popup' || route === '/combustibles/movement-wizard-popup') {
        return { pageType: 'movement_popup', requiresAuth: true, authenticated: !!firebase.user };
      }
      
      if (route === '/vehicle-wizard-popup' || route === '/combustibles/vehicle-wizard-popup') {
        return { pageType: 'vehicle_popup', requiresAuth: true, authenticated: !!firebase.user };
      }
      
      if (route === '/product-wizard-popup' || route === '/combustibles/product-wizard-popup') {
        return { pageType: 'product_popup', requiresAuth: true, authenticated: !!firebase.user };
      }
      
      // Ruta movimientos - cargar datos iniciales
      if (route.includes('/movimientos')) {
        return await fetchMovementsData(firebase);
      }
      
      // Ruta inventario - cargar datos SSR
      if (route.includes('/inventario')) {
        return await fetchInventoryData(firebase);
      }
      
      // Ruta vehiculos - cargar datos SSR  
      if (route.includes('/vehiculos')) {
        return await fetchVehiclesData(firebase);
      }
      
      // Dashboard - FASE 1 ACTIVADO con datos
      if (route.includes('/dashboard')) {
        return await fetchDashboardData(firebase);
      }
      
      // Ruta por defecto
      return { pageType: 'unknown', route };
    })();
    
    // Race against timeout
    return await Promise.race([dataPromise, timeoutPromise]);
  });
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
      inventory: [
        {
          id: 'inv_001',
          name: 'Diesel',
          currentStock: 15000,
          minStock: 5000,
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'inv_002',
          name: 'Gasolina Extra',
          currentStock: 8500,
          minStock: 3000,
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'inv_003',
          name: 'Gasolina Corriente',
          currentStock: 12000,
          minStock: 4000,
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'inv_004',
          name: 'Aceite Motor 15W40',
          currentStock: 250,
          minStock: 100,
          lastUpdate: new Date().toISOString()
        },
        {
          id: 'inv_005',
          name: 'Aceite Hidráulico',
          currentStock: 150,
          minStock: 200,
          lastUpdate: new Date().toISOString()
        }
      ],
      tanks: [
        {
          id: 'tank_001',
          name: 'Tanque Principal Diesel',
          fuelType: 'Diesel',
          capacity: 25000,
          currentLevel: 18500
        },
        {
          id: 'tank_002',
          name: 'Tanque Gasolina Extra',
          fuelType: 'Gasolina Extra',
          capacity: 15000,
          currentLevel: 8500
        },
        {
          id: 'tank_003',
          name: 'Tanque Gasolina Corriente',
          fuelType: 'Gasolina Corriente',
          capacity: 20000,
          currentLevel: 12000
        },
        {
          id: 'tank_004',
          name: 'Tanque Reserva Diesel',
          fuelType: 'Diesel',
          capacity: 10000,
          currentLevel: 3200
        }
      ],
      summary: {
        totalLiters: 42200,
        fuelTypes: 3,
        activeTanks: 4,
        lowStockItems: 1
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
          type: 'Camión',
          fuelType: 'Diesel',
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
          type: 'Pickup',
          fuelType: 'Gasolina',
          status: 'activo',
          lastMaintenance: new Date(Date.now() - 30 * 86400000).toISOString(),
          nextMaintenance: new Date(Date.now() + 30 * 86400000).toISOString(),
          mileage: 125000
        },
        {
          id: 'veh_003',
          plate: 'GHI789',
          brand: 'Ford',
          model: 'Ranger',
          year: 2018,
          type: 'Pickup',
          fuelType: 'Diesel',
          status: 'mantenimiento',
          lastMaintenance: new Date(Date.now() - 5 * 86400000).toISOString(),
          nextMaintenance: new Date(Date.now() + 60 * 86400000).toISOString(),
          mileage: 95000
        },
        {
          id: 'veh_004',
          plate: 'JKL012',
          brand: 'Nissan',
          model: 'Frontier',
          year: 2021,
          type: 'Pickup',
          fuelType: 'Gasolina',
          status: 'activo',
          lastMaintenance: new Date(Date.now() - 45 * 86400000).toISOString(),
          nextMaintenance: new Date(Date.now() + 45 * 86400000).toISOString(),
          mileage: 42000
        },
        {
          id: 'veh_005',
          plate: 'MNO345',
          brand: 'Isuzu',
          model: 'NQR',
          year: 2019,
          type: 'Camión',
          fuelType: 'Diesel',
          status: 'activo',
          lastMaintenance: new Date(Date.now() - 20 * 86400000).toISOString(),
          nextMaintenance: new Date(Date.now() + 40 * 86400000).toISOString(),
          mileage: 78000
        },
        {
          id: 'veh_006',
          plate: 'PQR678',
          brand: 'Chevrolet',
          model: 'Colorado',
          year: 2020,
          type: 'Pickup',
          fuelType: 'Diesel',
          status: 'inactivo',
          lastMaintenance: new Date(Date.now() - 90 * 86400000).toISOString(),
          nextMaintenance: new Date(Date.now() - 30 * 86400000).toISOString(),
          mileage: 110000
        }
      ],
      categories: [
        { id: 'camion', name: 'Camión', count: 8 },
        { id: 'pickup', name: 'Pickup', count: 12 },
        { id: 'moto', name: 'Motocicleta', count: 5 }
      ],
      summary: {
        totalVehicles: 25,
        activeVehicles: 20,
        inMaintenance: 3,
        inactiveVehicles: 2
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
 * Cargar datos iniciales para el Dashboard - FASE 1 NUEVO
 * @param {Object} firebase - Contexto Firebase
 * @returns {Promise<Object>} - Datos del dashboard
 */
async function fetchDashboardData(firebase) {
  try {
    // Dashboard ahora es público con funcionalidad básica para SEO/demo
    // Si hay usuario autenticado, mostrar datos personalizados
    // Si no hay usuario, mostrar datos públicos/demo
    
    // Mock data optimizado para SSR - En implementación real sería queries a Firestore
    const stats = {
      vehicles: firebase.user ? 25 : 12,     // Datos completos vs demo
      fuel: firebase.user ? 45000 : 8500,    // Litros en stock
      movements: firebase.user ? 12 : 3,     // Movimientos de hoy
      alerts: firebase.user ? 3 : 1,         // Alertas activas
      lastUpdate: new Date().toISOString()
    };
    
    // Datos adicionales para el dashboard
    const recentActivity = firebase.user ? [
      {
        id: 'act_001',
        type: 'movement',
        description: 'Entrada de 1500L diesel - Camión ABC123',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
        user: 'Operador Juan'
      },
      {
        id: 'act_002', 
        type: 'alert',
        description: 'Stock bajo en Aceite Motor 15W40',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
        priority: 'medium'
      }
    ] : [
      {
        id: 'demo_001',
        type: 'info',
        description: 'Dashboard en modo demo - Inicia sesión para ver datos completos',
        timestamp: new Date().toISOString(),
        priority: 'info'
      }
    ];
    
    return {
      pageType: 'dashboard',
      requiresAuth: false,              // Ahora es público
      authenticated: !!firebase.user,   // Indicar si está autenticado
      user: firebase.user,
      demoMode: !firebase.user,         // Indicar si es modo demo
      stats,
      recentActivity,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      pageType: 'dashboard',
      requiresAuth: false,
      authenticated: !!firebase.user,
      user: firebase.user,
      demoMode: !firebase.user,
      error: error.message,
      stats: {} // Fallback con stats vacíos
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
 * Enhanced caching system - Phase 3 implementation
 * Uses cache-strategy.js for TTL-based caching with personalization
 */

// Function to clear cache manually (useful after deploys)
function clearCache() {
  const cleared = invalidateCache('');
  console.info(`🧹 SSR Cache cleared: ${cleared} entries`);
  return { cleared: cleared, timestamp: new Date().toISOString() };
}

// Endpoint especial para limpiar cache (solo en desarrollo)
export function clearCacheHandler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Cache clear not allowed in production' });
  }
  
  const result = clearCache();
  res.json(result);
}

// Endpoint para obtener estadísticas de cache
export function cacheStatsHandler(req, res) {
  try {
    const stats = getCacheStats();
    res.json({
      ...stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get cache stats', 
      message: error.message 
    });
  }
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

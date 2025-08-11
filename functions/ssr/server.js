import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHtmlTemplate } from './html-template.js';
import AppSSRMinimal from './AppSSRMinimal.js';
import { initFirebaseServerApp, getSerializableUser, hasRouteAccess } from './firebase-server-app.js';
import { isSSREnabled } from './remote-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readCSRIndex = async () => {
  // Lee el index.html del build de combustibles publicado en hosting local (fallback)
  const root = path.resolve(__dirname, '../../');
  // En tiempo de emulador/hosting, serviremos desde /public/combustibles/index.html
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
  
  const sendFallback = async (status = 200, reason = 'error') => {
    try {
      const html = await readCSRIndex();
      res.setHeader('x-fallback-csr', '1');
      res.setHeader('x-fallback-reason', reason);
      res.status(status).send(html);
      
      // Log fallback para monitoreo
      console.info(`SSR Fallback: ${req.path} | Reason: ${reason} | Duration: ${Date.now() - start}ms`);
    } catch (e) {
      console.error('Fallback error:', e);
      res.status(500).send('SSR fallback error');
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
    const ssrEnabled = await isSSREnabled(req.path, user);
    if (!ssrEnabled) {
      return sendFallback(200, 'ssr_disabled');
    }
    
    // 3. Verificar acceso a la ruta
    if (!hasRouteAccess(user, req.path)) {
      // Para rutas protegidas sin auth, redirigir a login via CSR
      return sendFallback(200, 'auth_required');
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
    const routeMeta = getRouteMeta(req.path, initialData, user);
    
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
          
          // Crear HTML template completo con datos
          const html = createHtmlTemplate({
            title: routeMeta.title,
            description: routeMeta.description,
            ogImage: routeMeta.ogImage,
            initialState,
            appHtml: '', // Se llenará por pipe
            serverTiming: `ssr_total;dur=${totalDur}`
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
          sendFallback(200, 'render_error');
        },
      }
    );
  } catch (e) {
    console.error('SSR top-level error', e);
    sendFallback(200, 'server_error');
  }
}

/**
 * Cargar datos iniciales según la ruta
 * @param {string} route - Ruta actual
 * @param {Object} firebase - Contexto Firebase (app, auth, firestore, user)
 * @returns {Promise<Object>} - Datos iniciales para la ruta
 */
async function fetchInitialData(route, firebase) {
  try {
    // Timeout para fetch de datos (máximo 800ms)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Data fetch timeout')), 800)
    );
    
    const dataPromise = (async () => {
      // Rutas públicas - sin datos
      if (route.includes('/login') || route === '/combustibles/' || route === '/combustibles') {
        return { pageType: 'login', requiresAuth: false };
      }
      
      // Ruta movements - cargar datos iniciales
      if (route.includes('/movements')) {
        return await fetchMovementsData(firebase);
      }
      
      // Ruta inventory - placeholder para Fase 4
      if (route.includes('/inventory')) {
        return { pageType: 'inventory', requiresAuth: true };
      }
      
      // Ruta vehicles - placeholder para Fase 4  
      if (route.includes('/vehicles')) {
        return { pageType: 'vehicles', requiresAuth: true };
      }
      
      // Ruta por defecto
      return { pageType: 'unknown', route };
    })();
    
    return await Promise.race([dataPromise, timeoutPromise]);
    
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
 * Obtener metadatos SEO dinámicos por ruta
 * @param {string} route - Ruta actual
 * @param {Object} data - Datos iniciales
 * @param {Object} user - Usuario autenticado
 * @returns {Object} - Metadatos de la ruta
 */
function getRouteMeta(route, data, user) {
  const baseMeta = {
    title: 'Combustibles - Gestión de Inventario',
    description: 'Sistema de gestión de inventario de combustibles',
    ogImage: null
  };
  
  if (route.includes('/login') || route === '/combustibles/' || route === '/combustibles') {
    return {
      title: 'Login - Combustibles',
      description: 'Acceder al sistema de gestión de combustibles',
      ogImage: null
    };
  }
  
  if (route.includes('/movements')) {
    const movementsCount = data?.movements?.length || 0;
    return {
      title: `Movimientos (${movementsCount}) - Combustibles`,
      description: `Gestión de movimientos de combustible. ${movementsCount} movimientos recientes.`,
      ogImage: null
    };
  }
  
  return baseMeta;
}

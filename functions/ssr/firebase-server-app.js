import admin from 'firebase-admin';

/**
 * Inicializar Firebase App en servidor con continuidad de sesión
 * @param {Object} req - Request object con headers/cookies
 * @returns {Promise<{app: FirebaseApp, auth: admin.auth.Auth, firestore: admin.firestore.Firestore, user: Object|null}>}
 */
export async function initFirebaseServerApp(req) {
  try {
    // Extraer token de autenticación desde cookie o header Authorization
    const authIdToken = extractAuthToken(req);
    
    // Inicializar Admin SDK si no está inicializado
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
    }
    
    const auth = admin.auth();
    const firestore = admin.firestore();
    
    // Verificar usuario actual si hay token
    let user = null;
    if (authIdToken) {
      try {
        const decodedToken = await auth.verifyIdToken(authIdToken);
        user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name,
          photoURL: decodedToken.picture,
          emailVerified: decodedToken.email_verified,
          isAnonymous: decodedToken.firebase?.sign_in_provider === 'anonymous',
          customClaims: decodedToken
        };
      } catch (error) {
        console.warn('Error verifying token:', error.message);
      }
    }
    
    return {
      app: admin.app(),
      auth,
      firestore,
      user
    };
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    
    // Fallback básico - inicializar sin autenticación
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
    }
    
    return {
      app: admin.app(),
      auth: admin.auth(),
      firestore: admin.firestore(),
      user: null
    };
  }
}

/**
 * Extraer token de autenticación de cookie o header Authorization
 * @param {Object} req - Request object
 * @returns {string|null} - Token ID o null si no existe
 */
function extractAuthToken(req) {
  // 1. Intentar desde cookie '__session' (Firebase Hosting estándar)
  const cookies = parseCookies(req.headers.cookie || '');
  if (cookies.__session) {
    return cookies.__session;
  }
  
  // 2. Intentar desde header Authorization Bearer
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 3. Intentar desde cookie personalizada 'authToken'
  if (cookies.authToken) {
    return cookies.authToken;
  }
  
  return null;
}

/**
 * Parser simple de cookies
 * @param {string} cookieString - String de cookies del header
 * @returns {Object} - Objeto con cookies parseadas
 */
function parseCookies(cookieString) {
  const cookies = {};
  if (!cookieString) return cookies;
  
  cookieString.split(';').forEach(cookie => {
    const [key, ...rest] = cookie.split('=');
    const value = rest.join('=').trim();
    if (key && value) {
      cookies[key.trim()] = decodeURIComponent(value);
    }
  });
  
  return cookies;
}

/**
 * Obtener información del usuario autenticado de forma segura
 * @param {Object} firebase - Objeto con app, auth, user
 * @returns {Object|null} - Datos seguros del usuario para serializar
 */
export function getSerializableUser(firebase) {
  if (!firebase.user) return null;
  
  try {
    // Solo datos seguros para serializar (sin tokens ni datos sensibles)
    return {
      uid: firebase.user.uid,
      email: firebase.user.email,
      displayName: firebase.user.displayName,
      photoURL: firebase.user.photoURL,
      emailVerified: firebase.user.emailVerified,
      isAnonymous: firebase.user.isAnonymous,
      // Metadata útil pero no sensible
      creationTime: firebase.user.metadata?.creationTime,
      lastSignInTime: firebase.user.metadata?.lastSignInTime
    };
  } catch (error) {
    console.warn('Error serializing user:', error);
    return null;
  }
}

/**
 * Verificar si el usuario tiene permisos para acceder a una ruta
 * @param {Object} user - Usuario autenticado
 * @param {string} route - Ruta a verificar
 * @returns {boolean} - true si tiene acceso, false caso contrario
 */
export function hasRouteAccess(user, route) {
  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ['/combustibles/'];
  
  if (publicRoutes.some(publicRoute => route === publicRoute || route.startsWith(publicRoute))) {
    return true;
  }
  
  // Rutas protegidas requieren usuario autenticado (usar rutas reales de React Router)
  const protectedRoutes = ['/combustibles/movimientos', '/combustibles/inventario', '/combustibles/vehiculos'];
  
  if (protectedRoutes.some(protectedRoute => route.startsWith(protectedRoute))) {
    return !!user && !user.isAnonymous;
  }
  
  // Por defecto, permitir acceso (rutas nuevas no definidas)
  return true;
}
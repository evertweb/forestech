// combustibles/src/services/optimizedFirestore.js
// Servicio de consultas Firestore optimizadas - NIVEL 3 OPTIMIZACIÓN
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../firebase/config';

class OptimizedFirestoreService {
  constructor() {
    this.activeQueries = new Map();
    this.queryCache = new Map();
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutos
    this.performanceTracker = null; // Will be injected
  }

  // Inject performance tracker
  setPerformanceTracker(tracker) {
    this.performanceTracker = tracker;
  }

  // Track Firebase read
  trackFirebaseRead() {
    if (this.performanceTracker?.updateGlobalMetrics) {
      this.performanceTracker.updateGlobalMetrics('totalFirebaseReads', 1);
    }
  }

  // Track cache hit
  trackCacheHit() {
    if (this.performanceTracker?.updateGlobalMetrics) {
      this.performanceTracker.updateGlobalMetrics('totalCacheHits', 1);
    }
  }

  // Consulta optimizada con paginación y cache
  async getOptimizedQuery(collectionName, options = {}) {
    const {
      filters = [],
      orderByField = 'createdAt',
      orderDirection = 'desc',
      limitCount = 20,
      startAfterDoc = null,
      useCache = true
    } = options;

    const cacheKey = this.generateCacheKey(collectionName, options);

    // Verificar cache
    if (useCache && this.queryCache.has(cacheKey)) {
      const cached = this.queryCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log(`📋 Cache hit para ${collectionName}`);
        this.trackCacheHit(); // ✅ Track cache hit
        return cached.data;
      }
    }

    try {
      console.log(`🔥 Ejecutando consulta optimizada: ${collectionName}`);
      this.trackFirebaseRead(); // ✅ Track Firebase read

      let q = collection(db, collectionName);

      // Aplicar filtros
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });

      // Aplicar ordenamiento
      q = query(q, orderBy(orderByField, orderDirection));

      // Aplicar límite
      q = query(q, limit(limitCount));

      // Aplicar paginación
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Guardar en cache
      if (useCache) {
        this.queryCache.set(cacheKey, {
          data: docs,
          timestamp: Date.now()
        });
      }

      return docs;
    } catch (error) {
      console.error(`Error en consulta optimizada ${collectionName}:`, error);
      throw error;
    }
  }

  // Suscripción optimizada con debounce
  subscribeOptimized(collectionName, callback, options = {}) {
    const {
      filters = [],
      orderByField = 'createdAt',
      orderDirection = 'desc',
      limitCount = 50,
      debounceMs = 300
    } = options;

    const queryKey = this.generateCacheKey(collectionName, options);

    // Cancelar suscripción anterior si existe
    if (this.activeQueries.has(queryKey)) {
      this.activeQueries.get(queryKey)();
    }

    let debounceTimer = null;

    try {
      let q = collection(db, collectionName);

      // Aplicar filtros
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });

      // Aplicar ordenamiento y límite
      q = query(q, orderBy(orderByField, orderDirection), limit(limitCount));

      // ✅ Track Firebase read for subscription
      this.trackFirebaseRead();

      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          // ✅ Track Firebase read for each snapshot update
          this.trackFirebaseRead();

          // Debounce para evitar múltiples actualizaciones rápidas
          if (debounceTimer) clearTimeout(debounceTimer);

          debounceTimer = setTimeout(() => {
            const docs = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));

            console.log(`📡 Datos actualizados: ${collectionName} (${docs.length} items)`);
            callback(docs);
          }, debounceMs);
        },
        (error) => {
          console.error(`Error en suscripción ${collectionName}:`, error);
          callback([], error);
        }
      );

      // Guardar referencia para cleanup
      this.activeQueries.set(queryKey, unsubscribe);

      return unsubscribe;
    } catch (error) {
      console.error(`Error creando suscripción ${collectionName}:`, error);
      throw error;
    }
  }

  // Obtener conteo optimizado sin cargar todos los documentos
  async getCount(collectionName, filters = []) {
    try {
      let q = collection(db, collectionName);

      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });

      this.trackFirebaseRead(); // ✅ Track Firebase read for count
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error(`Error obteniendo conteo ${collectionName}:`, error);
      return 0;
    }
  }

  // Limpiar cache
  clearCache(collectionName = null) {
    if (collectionName) {
      const keysToDelete = Array.from(this.queryCache.keys())
        .filter(key => key.includes(collectionName));
      keysToDelete.forEach(key => this.queryCache.delete(key));
    } else {
      this.queryCache.clear();
    }
  }

  // Cleanup de suscripciones activas
  cleanup() {
    this.activeQueries.forEach(unsubscribe => unsubscribe());
    this.activeQueries.clear();
    this.queryCache.clear();
  }

  // Generar clave de cache única
  generateCacheKey(collectionName, options) {
    return `${collectionName}_${JSON.stringify(options)}`;
  }
}

// Instancia singleton
export const optimizedFirestore = new OptimizedFirestoreService();

// Hook para usar el servicio optimizado
export const useOptimizedFirestore = () => {
  return optimizedFirestore;
};

// combustibles/src/hooks/useFirestoreCache.js
// Sistema de cache local para Firestore - NIVEL 3 OPTIMIZACIÓN
import { useState, useEffect, useRef, useCallback } from 'react';

class FirestoreCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.subscribers = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  }

  set(key, data) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
    this.notifySubscribers(key, data);
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() - timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear(key) {
    if (key) {
      this.cache.delete(key);
      this.timestamps.delete(key);
    } else {
      this.cache.clear();
      this.timestamps.clear();
    }
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);

    // Retornar función de cleanup
    return () => {
      const keySubscribers = this.subscribers.get(key);
      if (keySubscribers) {
        keySubscribers.delete(callback);
        if (keySubscribers.size === 0) {
          this.subscribers.delete(key);
        }
      }
    };
  }

  notifySubscribers(key, data) {
    const keySubscribers = this.subscribers.get(key);
    if (keySubscribers) {
      keySubscribers.forEach(callback => callback(data));
    }
  }
}

// Instancia global del cache
const firestoreCache = new FirestoreCache();

// Hook para usar cache con Firestore
export const useFirestoreCache = (key, fetchFunction, dependencies = []) => {
  const [data, setData] = useState(() => firestoreCache.get(key) || []);
  const [loading, setLoading] = useState(!firestoreCache.has(key));
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Cancelar fetch anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFunction(abortControllerRef.current.signal);

      if (!abortControllerRef.current.signal.aborted) {
        firestoreCache.set(key, result);
        setData(result);
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        setError(err.message);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
    }
  }, [key, fetchFunction]);

  // Efecto para cargar datos si no están en cache
  useEffect(() => {
    if (!firestoreCache.has(key)) {
      fetchData();
    }

    // Suscribirse a cambios en el cache
    const unsubscribe = firestoreCache.subscribe(key, (newData) => {
      setData(newData);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [key, fetchData, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => {
    firestoreCache.clear(key);
    fetchData();
  }, [key, fetchData]);

  const clearCache = useCallback(() => {
    firestoreCache.clear(key);
    setData([]);
  }, [key]);

  return { data, loading, error, refresh, clearCache };
};

// Hook específico para consultas optimizadas
export const useOptimizedQuery = (collection, queryConfig = {}) => {
  const cacheKey = `${collection}_${JSON.stringify(queryConfig)}`;

  const fetchFunction = useCallback(async (_signal) => {
    // Aquí implementarías la lógica de consulta Firestore optimizada
    // con límites, índices, etc.
    console.log(`Ejecutando consulta optimizada para ${collection}`, queryConfig);

    // TODO: Implementar consulta Firestore real
    return [];
  }, [collection, queryConfig]);

  return useFirestoreCache(cacheKey, fetchFunction, [collection, queryConfig]);
};

export { firestoreCache };

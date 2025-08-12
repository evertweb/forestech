/**
 * Enhanced caching strategy for Phase 3 SSR implementation
 * Implements TTL-based caching with personalization support
 */

// In-memory cache store
const memoryCache = new Map();

// Cache configuration per route
const CACHE_CONFIG = {
  '/combustibles/dashboard': {
    ttl: 300, // 5 minutos
    stale: 600, // 10 minutos stale-while-revalidate
    personalized: true, // Cache por usuario
    maxSize: 100 // Max entries for this route type
  },
  '/combustibles/movimientos': {
    ttl: 120, // 2 minutos
    stale: 300, // 5 minutos stale-while-revalidate
    personalized: true,
    maxSize: 50
  },
  '/combustibles/vehiculos': {
    ttl: 1800, // 30 minutos
    stale: 3600, // 1 hora stale-while-revalidate
    personalized: false, // Cache global (vehicles don't change per user)
    maxSize: 10
  },
  '/combustibles/inventario': {
    ttl: 300, // 5 minutos
    stale: 600, // 10 minutos stale-while-revalidate
    personalized: false, // Cache global (inventory is shared)
    maxSize: 10
  },
  '/combustibles/': {
    ttl: 3600, // 1 hora (landing page)
    stale: 7200, // 2 horas stale-while-revalidate
    personalized: false, // Cache global
    maxSize: 5
  },
};

/**
 * Get cached data or fetch fresh data
 * @param {string} route - The route path
 * @param {string} userId - User ID for personalized caching (or 'anonymous')
 * @param {Function} fetcher - Function to fetch fresh data
 * @returns {Promise<Object>} - Cached or fresh data
 */
export async function getCachedOrFetch(route, userId, fetcher) {
  const config = CACHE_CONFIG[route];
  if (!config) {
    // No caching config, fetch directly
    return await fetcher();
  }

  const cacheKey = config.personalized ? `${route}:${userId}` : route;
  const cached = memoryCache.get(cacheKey);

  // Check if we have valid cached data
  if (cached && !isExpired(cached, config)) {
    // Log cache hit for monitoring
    console.info(`Cache HIT: ${cacheKey} (age: ${Date.now() - cached.timestamp}ms)`);
    return cached.data;
  }

  // Check if we can serve stale data while revalidating
  if (cached && !isStale(cached, config)) {
    console.info(`Cache STALE: ${cacheKey} (serving stale while revalidating)`);
    
    // Serve stale data immediately
    const staleData = cached.data;
    
    // Revalidate in background (don't await)
    revalidateInBackground(cacheKey, fetcher, config).catch(error => {
      console.warn(`Background revalidation failed for ${cacheKey}:`, error.message);
    });
    
    return staleData;
  }

  // No valid cache, fetch fresh data
  console.info(`Cache MISS: ${cacheKey}`);
  const fresh = await fetcher();

  // Store in cache with cleanup
  setCacheEntry(cacheKey, fresh, config);

  return fresh;
}

/**
 * Set cache entry with size management
 * @param {string} cacheKey - Cache key
 * @param {Object} data - Data to cache
 * @param {Object} config - Cache configuration
 */
function setCacheEntry(cacheKey, data, config) {
  const route = cacheKey.split(':')[0];
  
  // Clean up old entries for this route if we're at max size
  const routeEntries = Array.from(memoryCache.keys()).filter(key => key.startsWith(route));
  if (routeEntries.length >= config.maxSize) {
    // Remove oldest entries
    routeEntries
      .map(key => ({ key, timestamp: memoryCache.get(key)?.timestamp || 0 }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, routeEntries.length - config.maxSize + 1)
      .forEach(({ key }) => {
        memoryCache.delete(key);
        console.info(`Cache EVICT: ${key} (size limit)`);
      });
  }

  // Store new entry
  memoryCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    ttl: config.ttl,
  });

  console.info(`Cache SET: ${cacheKey} (size: ${memoryCache.size})`);
}

/**
 * Revalidate cache entry in background
 * @param {string} cacheKey - Cache key
 * @param {Function} fetcher - Function to fetch fresh data
 * @param {Object} config - Cache configuration
 */
async function revalidateInBackground(cacheKey, fetcher, config) {
  try {
    const fresh = await fetcher();
    setCacheEntry(cacheKey, fresh, config);
    console.info(`Cache REVALIDATE: ${cacheKey}`);
  } catch (error) {
    console.warn(`Cache revalidation failed for ${cacheKey}:`, error.message);
    throw error;
  }
}

/**
 * Check if cache entry is expired (beyond stale time)
 * @param {Object} cached - Cached entry
 * @param {Object} config - Cache configuration
 * @returns {boolean} - True if expired
 */
function isExpired(cached, config) {
  const age = Date.now() - cached.timestamp;
  return age > config.stale * 1000;
}

/**
 * Check if cache entry is stale (beyond TTL but within stale time)
 * @param {Object} cached - Cached entry
 * @param {Object} config - Cache configuration
 * @returns {boolean} - True if stale
 */
function isStale(cached, config) {
  const age = Date.now() - cached.timestamp;
  return age > config.ttl * 1000;
}

/**
 * Invalidate cache entries by pattern
 * @param {string} pattern - Pattern to match (route or user)
 */
export function invalidateCache(pattern) {
  const keysToDelete = [];
  
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => {
    memoryCache.delete(key);
    console.info(`Cache INVALIDATE: ${key}`);
  });
  
  return keysToDelete.length;
}

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
export function getCacheStats() {
  const now = Date.now();
  const entries = Array.from(memoryCache.entries());
  
  const stats = {
    totalEntries: entries.length,
    totalSize: JSON.stringify([...memoryCache.values()]).length,
    byRoute: {},
    hitRate: global.cacheHitRate || 0,
  };
  
  // Group by route
  entries.forEach(([key, value]) => {
    const route = key.split(':')[0];
    if (!stats.byRoute[route]) {
      stats.byRoute[route] = {
        count: 0,
        avgAge: 0,
        fresh: 0,
        stale: 0,
        expired: 0,
      };
    }
    
    const config = CACHE_CONFIG[route];
    const age = now - value.timestamp;
    
    stats.byRoute[route].count++;
    stats.byRoute[route].avgAge += age;
    
    if (config) {
      if (age < config.ttl * 1000) {
        stats.byRoute[route].fresh++;
      } else if (age < config.stale * 1000) {
        stats.byRoute[route].stale++;
      } else {
        stats.byRoute[route].expired++;
      }
    }
  });
  
  // Calculate averages
  Object.keys(stats.byRoute).forEach(route => {
    if (stats.byRoute[route].count > 0) {
      stats.byRoute[route].avgAge = Math.round(
        stats.byRoute[route].avgAge / stats.byRoute[route].count
      );
    }
  });
  
  return stats;
}

/**
 * Clear all cache entries
 */
export function clearCache() {
  const size = memoryCache.size;
  memoryCache.clear();
  console.info(`Cache CLEAR: ${size} entries removed`);
  return size;
}

/**
 * Periodic cleanup of expired entries
 */
export function cleanupExpiredEntries() {
  const now = Date.now();
  const keysToDelete = [];
  
  for (const [key, value] of memoryCache.entries()) {
    const route = key.split(':')[0];
    const config = CACHE_CONFIG[route];
    
    if (config && isExpired(value, config)) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach(key => {
    memoryCache.delete(key);
  });
  
  if (keysToDelete.length > 0) {
    console.info(`Cache CLEANUP: ${keysToDelete.length} expired entries removed`);
  }
  
  return keysToDelete.length;
}

// Initialize periodic cleanup (every 10 minutes)
if (typeof global !== 'undefined') {
  global.cacheCleanupInterval = setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}

// Export memory cache for direct access if needed
export { memoryCache };
import NodeCache from "node-cache";
import crypto from "crypto";

// Cache dengan TTL 1 jam (3600 detik)
const projectionCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 600, // Check expired keys setiap 10 menit
  useClones: true, // ✅ Enable clones untuk safety (prevent mutation)
});

// Cache metrics untuk monitoring
let cacheMetrics = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0,
  lastReset: new Date(),
};

/**
 * Generate cache key dari user profile data
 * @param {Object} data - Data user profile untuk projection
 * @returns {string} Hash MD5 sebagai cache key
 */
export function generateCacheKey(data) {
  const normalized = JSON.stringify(data, Object.keys(data).sort());
  return crypto.createHash("md5").update(normalized).digest("hex");
}

/**
 * Generate cache key yang di-scope per user agar invalidasi per user bekerja.
 * @param {string} userId
 * @param {string} inputHash
 * @returns {string}
 */
export function generateUserProjectionCacheKey(userId, inputHash) {
  return `projection:${userId}:${inputHash}`;
}

/**
 * Get cached projection result
 * @param {string} key - Cache key
 * @returns {Object|undefined} Cached data atau undefined jika tidak ada
 */
export function getCachedProjection(key) {
  const data = projectionCache.get(key);
  
  // Track metrics
  if (data !== undefined) {
    cacheMetrics.hits++;
  } else {
    cacheMetrics.misses++;
  }
  
  return data;
}

/**
 * Set projection result ke cache
 * @param {string} key - Cache key
 * @param {Object} data - Projection result
 * @param {number} [ttl] - Custom TTL dalam detik (optional)
 */
export function setCachedProjection(key, data, ttl) {
  cacheMetrics.sets++;
  return projectionCache.set(key, data, ttl);
}

/**
 * Clear cache untuk user tertentu (digunakan saat user update profile)
 * @param {string} pattern - Pattern untuk delete keys (e.g., userId)
 */
export function clearUserCache(pattern) {
  const keys = projectionCache.keys();
  const deleted = keys.filter((key) => key.includes(pattern));
  deleted.forEach((key) => projectionCache.del(key));
  
  cacheMetrics.deletes += deleted.length;
  
  console.log(`[CACHE] Cleared ${deleted.length} cache entries for pattern: ${pattern}`);
  return deleted.length;
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const nodeCacheStats = projectionCache.getStats();
  const totalRequests = cacheMetrics.hits + cacheMetrics.misses;
  const hitRate = totalRequests > 0 
    ? ((cacheMetrics.hits / totalRequests) * 100).toFixed(2) 
    : 0;
  
  return {
    // NodeCache built-in stats
    keys: nodeCacheStats.keys,
    ksize: nodeCacheStats.ksize,
    vsize: nodeCacheStats.vsize,
    
    // Custom metrics
    hits: cacheMetrics.hits,
    misses: cacheMetrics.misses,
    sets: cacheMetrics.sets,
    deletes: cacheMetrics.deletes,
    hitRate: `${hitRate}%`,
    totalRequests,
    uptime: Math.floor((new Date() - cacheMetrics.lastReset) / 1000), // seconds
  };
}

/**
 * Log cache metrics (for monitoring)
 */
export function logCacheMetrics() {
  const stats = getCacheStats();
  console.log('[CACHE METRICS]', {
    hitRate: stats.hitRate,
    hits: stats.hits,
    misses: stats.misses,
    totalKeys: stats.keys,
    uptime: `${stats.uptime}s`,
  });
}

/**
 * Reset cache metrics
 */
export function resetCacheMetrics() {
  cacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    lastReset: new Date(),
  };
  console.log('[CACHE] Metrics reset');
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  const keysCount = projectionCache.keys().length;
  projectionCache.flushAll();
  cacheMetrics.deletes += keysCount;
  console.log(`[CACHE] Cleared all cache (${keysCount} entries)`);
  return keysCount;
}

// Log cache metrics every 5 minutes in production
if (process.env.NODE_ENV === 'production') {
  setInterval(logCacheMetrics, 5 * 60 * 1000); // 5 minutes
}

// Log cache metrics every minute in development
if (process.env.NODE_ENV === 'development') {
  setInterval(logCacheMetrics, 60 * 1000); // 1 minute
}

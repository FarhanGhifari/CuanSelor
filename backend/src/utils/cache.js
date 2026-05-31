import NodeCache from "node-cache";
import crypto from "crypto";

// Cache dengan TTL 1 jam (3600 detik)
const projectionCache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 600, // Check expired keys setiap 10 menit
  useClones: false, // Untuk performa, tidak clone object
});

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
  return projectionCache.get(key);
}

/**
 * Set projection result ke cache
 * @param {string} key - Cache key
 * @param {Object} data - Projection result
 * @param {number} [ttl] - Custom TTL dalam detik (optional)
 */
export function setCachedProjection(key, data, ttl) {
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
  return deleted.length;
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return projectionCache.getStats();
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  return projectionCache.flushAll();
}

import { asyncHandler } from "../../utils/async-handler.js";
import { ok } from "../../utils/api-response.js";
import { getCacheStats, clearAllCache } from "../../utils/cache.js";

/**
 * GET /api/projection/cache/stats
 * Mendapatkan statistik cache (untuk monitoring/debugging)
 */
export const getCacheStatistics = asyncHandler(async (req, res) => {
  const stats = getCacheStats();
  return ok(res, stats, "Cache statistics retrieved successfully");
});

/**
 * DELETE /api/projection/cache
 * Clear semua cache (untuk admin/debugging)
 */
export const clearCache = asyncHandler(async (req, res) => {
  const clearedCount = clearAllCache();
  return ok(res, { clearedCount }, `Cache cleared successfully (${clearedCount} entries)`);
});

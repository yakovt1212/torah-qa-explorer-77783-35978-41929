import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Sefer } from '@/types/torah';

interface TorahDB extends DBSchema {
  sefarim: {
    key: number;
    value: {
      seferId: number;
      data: Sefer;
      timestamp: number;
      version: string;
    };
  };
  metadata: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'torah-app-db';
const DB_VERSION = 1;
const CACHE_VERSION = '1.0.0'; // Increment to invalidate cache
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

let dbInstance: IDBPDatabase<TorahDB> | null = null;

/**
 * Initialize and get the IndexedDB instance
 */
async function getDB(): Promise<IDBPDatabase<TorahDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<TorahDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('sefarim')) {
        db.createObjectStore('sefarim', { keyPath: 'seferId' });
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata');
      }
    },
  });

  return dbInstance;
}

/**
 * Get cached sefer from IndexedDB
 */
export async function getCachedSefer(seferId: number): Promise<Sefer | null> {
  try {
    const db = await getDB();
    const cached = await db.get('sefarim', seferId);

    if (!cached) {
      console.log(`[IndexedDB] Sefer ${seferId} not found in cache`);
      return null;
    }

    // Check if cache is expired
    const age = Date.now() - cached.timestamp;
    if (age > CACHE_DURATION || cached.version !== CACHE_VERSION) {
      console.log(`[IndexedDB] Sefer ${seferId} cache expired or outdated`);
      await db.delete('sefarim', seferId);
      return null;
    }

    console.log(`[IndexedDB] Sefer ${seferId} loaded from cache (age: ${Math.round(age / 1000 / 60)}m)`);
    return cached.data;
  } catch (error) {
    console.error('[IndexedDB] Error getting cached sefer:', error);
    return null;
  }
}

/**
 * Cache sefer in IndexedDB
 */
export async function setCachedSefer(seferId: number, data: Sefer): Promise<void> {
  try {
    const db = await getDB();
    await db.put('sefarim', {
      seferId,
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    });
    console.log(`[IndexedDB] Sefer ${seferId} cached successfully`);
  } catch (error) {
    console.error('[IndexedDB] Error caching sefer:', error);
  }
}

/**
 * Check if all sefarim are cached
 */
export async function areAllSefarimCached(): Promise<boolean> {
  try {
    const db = await getDB();
    const allKeys = await db.getAllKeys('sefarim');
    return allKeys.length === 5; // We have 5 sefarim
  } catch (error) {
    console.error('[IndexedDB] Error checking cache status:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  cachedCount: number;
  totalSize: number;
  oldestCache: number;
}> {
  try {
    const db = await getDB();
    const allSefarim = await db.getAll('sefarim');
    
    const totalSize = allSefarim.reduce((acc, item) => {
      return acc + JSON.stringify(item.data).length;
    }, 0);

    const oldestCache = allSefarim.length > 0
      ? Math.min(...allSefarim.map(s => s.timestamp))
      : 0;

    return {
      cachedCount: allSefarim.length,
      totalSize,
      oldestCache,
    };
  } catch (error) {
    console.error('[IndexedDB] Error getting cache stats:', error);
    return { cachedCount: 0, totalSize: 0, oldestCache: 0 };
  }
}

/**
 * Clear all cached data
 */
export async function clearCache(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('sefarim');
    console.log('[IndexedDB] Cache cleared successfully');
  } catch (error) {
    console.error('[IndexedDB] Error clearing cache:', error);
  }
}

/**
 * Preload all sefarim into IndexedDB
 */
export async function preloadAllSefarimToCache(
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const seferFiles: Record<number, () => Promise<any>> = {
    1: () => import('../data/bereishit.json'),
    2: () => import('../data/shemot.json'),
    3: () => import('../data/vayikra.json'),
    4: () => import('../data/bamidbar.json'),
    5: () => import('../data/devarim.json'),
  };

  for (let seferId = 1; seferId <= 5; seferId++) {
    try {
      // Check if already cached
      const cached = await getCachedSefer(seferId);
      if (cached) {
        console.log(`[IndexedDB] Sefer ${seferId} already cached, skipping`);
        onProgress?.(seferId, 5);
        continue;
      }

      // Load and cache
      const seferModule = await seferFiles[seferId]();
      await setCachedSefer(seferId, seferModule.default);
      onProgress?.(seferId, 5);
      
      console.log(`[IndexedDB] Preloaded sefer ${seferId}`);
    } catch (error) {
      console.error(`[IndexedDB] Failed to preload sefer ${seferId}:`, error);
    }
  }
}

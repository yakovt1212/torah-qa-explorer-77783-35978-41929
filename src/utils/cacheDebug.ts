/**
 * Debug utility to inspect cache status
 * Helps diagnose Service Worker and caching issues
 */
export async function debugCacheStatus(): Promise<void> {
  if (!('caches' in window)) {
    console.log('[Cache Debug] ❌ Cache API not supported');
    return;
  }

  try {
    const cacheNames = await caches.keys();
    console.log('[Cache Debug] 📦 Active caches:', cacheNames);
    console.log('[Cache Debug] 📊 Total caches:', cacheNames.length);

    for (const name of cacheNames) {
      const cache = await caches.open(name);
      const keys = await cache.keys();
      console.log(`[Cache Debug] 📂 Cache "${name}" contains ${keys.length} items:`);
      keys.slice(0, 10).forEach(req => console.log('  -', req.url));
      if (keys.length > 10) {
        console.log(`  ... and ${keys.length - 10} more items`);
      }
    }

    // Check service worker status
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('[Cache Debug] ✅ Service Worker registered');
        console.log('[Cache Debug] SW State:', {
          installing: !!registration.installing,
          waiting: !!registration.waiting,
          active: !!registration.active,
        });
      } else {
        console.log('[Cache Debug] ⚠️ No Service Worker registration found');
      }
    }
  } catch (error) {
    console.error('[Cache Debug] ❌ Error inspecting caches:', error);
  }
}

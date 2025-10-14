import { Workbox } from 'workbox-window';

/**
 * Register service worker for offline support and caching
 * Only runs in production builds
 */
export async function registerServiceWorker(): Promise<void> {
  // Only register in production AND only if service worker is supported
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported');
    return;
  }

  if (!import.meta.env.PROD) {
    console.log('[SW] Skipping service worker registration in development');
    return;
  }

  try {
    const startTime = performance.now();
    console.log('[SW] 🚀 Starting registration...');
    
    const wb = new Workbox('/sw.js');

    // Listen for service worker updates - immediate reload
    wb.addEventListener('waiting', () => {
      console.log('[SW] ⏳ New service worker waiting to activate...');
      
      // Set up controlling listener before skip waiting
      wb.addEventListener('controlling', () => {
        console.log('[SW] 🎮 New SW controlling - reloading immediately');
        window.location.reload();
      });

      console.log('[SW] 🔄 Sending SKIP_WAITING message');
      wb.messageSkipWaiting();
    });

    wb.addEventListener('activated', (event) => {
      const timeTaken = Math.round(performance.now() - startTime);
      if (!event.isUpdate) {
        console.log(`[SW] ✅ Service worker activated for the first time (${timeTaken}ms)`);
      } else {
        console.log(`[SW] ✅ Service worker updated (${timeTaken}ms)`);
      }
    });

    // Register with extended timeout (30 seconds)
    const registrationTimeout = setTimeout(() => {
      console.error('[SW] ⚠️ Registration taking longer than 30 seconds!');
      console.error('[SW] This may indicate a network issue or Service Worker problem');
    }, 30000);

    console.log('[SW] 📝 Calling wb.register()...');
    await wb.register({
      immediate: true
    });
    clearTimeout(registrationTimeout);
    
    const registrationTime = Math.round(performance.now() - startTime);
    console.log(`[SW] ✅ Registration complete (${registrationTime}ms)`);

    // Force update check every 60 seconds
    setInterval(() => {
      console.log('[SW] 🔍 Checking for updates...');
      wb.update();
    }, 60000);

    // Check for updates when tab becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('[SW] 👁️ Tab visible - checking for updates');
        wb.update();
      }
    });
  } catch (error) {
    console.error('[SW] ❌ Service worker registration failed:', error);
    if (error instanceof Error) {
      console.error('[SW] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    // Don't throw - let the app continue without SW
  }
}

/**
 * Unregister all service workers (for development/debugging)
 */
export async function unregisterServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('[SW] Service worker unregistered');
    }
  }
}

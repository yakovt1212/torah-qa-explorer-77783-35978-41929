import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerServiceWorker } from "./utils/serviceWorkerRegistration";
import { debugCacheStatus } from "./utils/cacheDebug";

// Clear cache in development for instant updates
if (import.meta.env.DEV) {
  console.log('[DEV] 🧹 Clearing all caches...');
  caches.keys().then(keys => {
    keys.forEach(key => caches.delete(key));
  });
}

// Register service worker in production
registerServiceWorker();

// Debug cache status in production (after 3 seconds to let SW initialize)
if (import.meta.env.PROD) {
  setTimeout(() => {
    console.log('[PROD] 🔍 Running cache diagnostics...');
    debugCacheStatus();
  }, 3000);
}

createRoot(document.getElementById("root")!).render(<App />);

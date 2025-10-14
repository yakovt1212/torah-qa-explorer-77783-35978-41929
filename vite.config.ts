import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 4500, // פורט ייעודי לפרויקט - בטווח 4000-5000
    strictPort: true, // כשל אם הפורט תפוס (מונע בלבול)
    hmr: {
      overlay: true,
      timeout: 5000,
    },
    watch: {
      usePolling: false,
      interval: 100,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Compression plugins only in production
    mode === 'production' && viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    mode === 'production' && viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    // Bundle analyzer only in production
    mode === 'production' && visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          // Keep Torah data separate per sefer (already done by dynamic imports)
        },
      },
    },
    // Increase chunk size warning limit (we have large JSON files)
    chunkSizeWarningLimit: 1000,
    // Disable source maps for faster builds
    sourcemap: false,
    // Minify with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console.logs for debugging publish issues
        drop_debugger: true,
        pure_funcs: ['console.debug'], // Only remove console.debug
        passes: 2, // Run compression twice for better results
      },
    },
    // Inject build time into service worker
    define: {
      '{{BUILD_TIME}}': JSON.stringify(new Date().toISOString())
    },
  },
  // Preview server configuration
  preview: {
    port: 4501, // פורט preview - סמוך לפורט ה-dev
    strictPort: true,
    host: "::",
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));

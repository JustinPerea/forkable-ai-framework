import { defineConfig } from 'vite'

export default defineConfig({
  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    open: true, // Open browser on start
    cors: true, // Enable CORS for API calls
    proxy: {
      // Proxy API calls to backend during development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true, // Generate source maps for debugging
    minify: 'esbuild', // Use esbuild for faster minification
    target: 'es2015', // Support modern browsers
    rollupOptions: {
      external: [
        'fsevents' // Exclude fsevents from bundle (optional dependency)
      ],
      output: {
        // Chunk splitting for better caching
        manualChunks: {
          vendor: [],
        }
      }
    }
  },

  // CSS configuration
  css: {
    devSourcemap: true, // Source maps for CSS in development
  },

  // Base path configuration
  base: './',

  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // Preview server configuration (for testing builds)
  preview: {
    port: 4173,
    host: true,
  }
})
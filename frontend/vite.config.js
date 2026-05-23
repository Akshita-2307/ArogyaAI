import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Vite 8 (Rolldown) expects manualChunks to be a function.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router-dom/')
          ) {
            return 'vendor'
          }
          if (
            id.includes('/axios/') ||
            id.includes('/jspdf/') ||
            id.includes('/lucide-react/') ||
            id.includes('/react-hot-toast/')
          ) {
            return 'utils'
          }
          return 'vendor'
        },
      },
    },
  },
})

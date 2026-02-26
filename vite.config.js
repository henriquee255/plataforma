import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Otimizações de bundle com lazy loading já implementado
    rollupOptions: {
      output: {
        // Manual chunks - separa bibliotecas grandes
        manualChunks: {
          // Separar React do restante
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          // Recharts é muito grande - chunk separado
          'recharts': ['recharts'],
        },
        // Chunks menores e organizados
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Aumentar limite de warning para 1000 KB
    chunkSizeWarningLimit: 1000,
    // CSS code splitting habilitado
    cssCodeSplit: true,
    // Target browsers modernos
    target: 'es2015',
  },
})

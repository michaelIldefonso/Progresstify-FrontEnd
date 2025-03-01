import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process'; // ✅ Fix ESLint issue

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // ✅ No more ESLint error

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          main: 'index.html',
          dashboard: 'public/dashboard.html' // Ensure Vite includes this static file in the build
        }
      }
    },
    server: {
      port: parseInt(env.VITE_PORT) || 5173, // ✅ Use .env port, fallback to 5173
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false
        },
        '/auth': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});

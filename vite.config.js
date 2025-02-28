import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process'; // ✅ Fix ESLint issue

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // ✅ No more ESLint error

  return {
      plugins: [react()],
      server: {
          port: parseInt(env.VITE_PORT) || 5173 // ✅ Use .env port, fallback to 5173
      }
  };
});

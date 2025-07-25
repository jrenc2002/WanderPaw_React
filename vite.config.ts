import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://backeenee.zeabur.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 移除/api前缀，因为后端路径不包含/api
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
})

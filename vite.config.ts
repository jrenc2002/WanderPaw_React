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
      // WanderPaw 后端API代理
      '/api': {
        target: 'https://backeenee.zeabur.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('API proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('API proxy request:', req.method, req.url, '-> ', proxyReq.path);
          });
        }
      },
      // 小红书API代理 - 已禁用，无法爬取
      /* 
      '/xhs-api': {
        target: 'https://xhsxhs.zeabur.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/xhs-api/, ''),
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('XHS proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('XHS proxy request:', req.method, req.url, '-> ', proxyReq.path);
          });
        }
      }
      */
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
  },
})

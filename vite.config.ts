import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        mkcert(),
    ],
    // 배포 환경에 따라 base 경로를 유연하게 설정 (Vercel/Local: '/', GitHub Pages: '/semicolon-front-prototype/')
    // base: process.env.GITHUB_ACTIONS ? '/semicolon-front-prototype/' : '/',
    base: process.env.VITE_BASE_PATH || '/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        https: {},
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});


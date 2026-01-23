import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        basicSsl(),
    ],
    // GitHub Pages 배포 시 레포지토리 이름으로 서브 URL 설정
    base: process.env.GITHUB_ACTIONS ? '/semicolon-front-prototype/' : '/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        https: {}, // basicSsl 플러그인이 인증서를 주입함
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});


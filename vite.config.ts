import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  // 諛고룷 ?섍꼍???곕씪 base 寃쎈줈瑜??좎뿰?섍쾶 ?ㅼ젙 (Vercel/Local: '/', GitHub Pages: '/semicolon-front-prototype/')
  // base: process.env.GITHUB_ACTIONS ? '/semicolon-front-prototype/' : '/',
  base: process.env.VITE_BASE_PATH || "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    https: {},
    hmr: {
      protocol: "wss",
      host: "localhost",
      clientPort: 3000,
    },
    proxy: {
      "/api": {
        target: "http://100.99.145.22:80",
        changeOrigin: true,
        secure: false,
      },
      "/oauth2": {
        target: "http://100.99.145.22:80",
        changeOrigin: true,
        secure: false,
      },
      "/login/oauth2": {
        target: "http://100.99.145.22:80",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    define: {
        global: {},
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://wsn-monitoring-1-0-0-1.onrender.com',
                changeOrigin: true,
                secure: false,
            },
            '/ws': {
                target: 'https://wsn-monitoring-1-0-0-1.onrender.com',
                ws: true,
                changeOrigin: true,
            },
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load .env variables based on mode (development, production, etc.)
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        define: {
            global: {},
        },
        server: {
            port: 3000,
            proxy: {
                '/api': {
                    target: env.VITE_BACKEND_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '/ws': {
                    target: env.VITE_BACKEND_URL,
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
    };
});

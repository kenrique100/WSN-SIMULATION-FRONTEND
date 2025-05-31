import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory
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
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '/ws': {
                    target: env.VITE_API_URL,
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
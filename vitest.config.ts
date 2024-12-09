import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [
            './test/setup/vitest.setup.ts',
            './test/setup/setup.ts'
        ],
        include: ['./test/**/*.{test,spec}.{ts,tsx}'],
    },
    resolve: {
        alias: {
            '@test': path.resolve(__dirname, './test'),
            '@src': path.resolve(__dirname, './src')
        }
    }
});
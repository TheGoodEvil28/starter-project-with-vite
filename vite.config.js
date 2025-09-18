import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/starter-project-with-vite/',  // 👈 nama repo kamu
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});

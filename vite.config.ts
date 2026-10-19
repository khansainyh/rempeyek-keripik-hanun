import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  server: {
    port: 8080,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        syarat: resolve(__dirname, 'syarat.html'),
        privasi: resolve(__dirname, 'privasi.html'),
      },
    },
  },
});

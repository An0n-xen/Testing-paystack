import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        callback: resolve(__dirname, 'callback.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});

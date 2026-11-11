import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — BẮT BUỘC để chạy được trên itch.io / iframe (đường dẫn tương đối)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    sourcemap: false,
  },
});

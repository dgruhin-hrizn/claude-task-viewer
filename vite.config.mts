import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// The Express server serves `public/` statically and that is the whole frontend
// contract, so the build writes there directly. Source lives in `web/`, and the
// hand-authored PWA assets live in `web/public/` (Vite's passthrough dir) so
// emptyOutDir cannot delete them.
export default defineConfig({
  root: 'web',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'web/src') },
  },
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  server: {
    // /api/events is an open SSE stream; t2 verifies it actually streams
    // through this proxy rather than being buffered.
    proxy: {
      '/api': { target: 'http://localhost:3456', changeOrigin: true },
    },
  },
});

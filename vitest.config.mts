import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'web/src') } },
  test: { include: ['web/src/**/*.test.ts'], environment: 'node' },
});

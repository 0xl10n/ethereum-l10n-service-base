import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [],
  test: {
    testTimeout: 1000 * 60 * 60 * 1,
    setupFiles: [],
  },
});

import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  test: {
    testTimeout: 1000 * 60 * 60 * 1,
    setupFiles: ['./test.setup.ts'],
  },
});

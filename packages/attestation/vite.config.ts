import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  test: {
    testTimeout: 1000 * 60 * 60 * 1,
    setupFiles: [],
  },
});

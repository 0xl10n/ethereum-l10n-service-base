import { resolve } from 'path';
import { createConfig } from './vite.base.config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import react from '@vitejs/plugin-react';

// TODO content script with externalized react deps

const build = {
  target: 'es2020',
  outDir: './dist-portal',
  lib: {
    entry: {
      portal: resolve(__dirname, 'src/contentscript/Portal.tsx'),
    },
    formats: ['es'],
  },
  build: {
    minify: false,
  },
  rollupOptions: {
    output: {
      inlineDynamicImports: false,
    },
  },
};

const plugins = [
  react(),
  nodePolyfills({
    globals: {
      Buffer: true, // can also be 'build', 'dev', or false
      global: true,
      process: true,
    },
  }),
];
export default createConfig(build, plugins);

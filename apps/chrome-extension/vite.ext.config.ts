import { resolve } from 'path';
import { createConfig } from './vite.base.config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const build = {
  target: 'es2020',
  outDir: './dist-ext',
  lib: {
    entry: {
      index: resolve(__dirname, 'index.html'),
      sidepanel: resolve(__dirname, 'sidepanel.html'),
    },
    formats: ['es'],
  },
  rollupOptions: {
    // output: {
    //   inlineDynamicImports: true,
    // }
  },
};

const plugins = [
  nodePolyfills({
    globals: {
      Buffer: true, // can also be 'build', 'dev', or false
      global: true,
      process: true,
    },
  }),
];
export default createConfig(build, plugins);

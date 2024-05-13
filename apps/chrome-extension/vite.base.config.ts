import { resolve } from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

const DEFAULT_PLUGINS = [
  nodePolyfills({
    globals: {
      Buffer: true, // can also be 'build', 'dev', or false
      global: true,
      process: true,
    },
  }),
];

export const createConfig = (build, plugins = []) =>
  defineConfig({
    plugins: [
      /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
      // devtools(),
      solidPlugin(),
      ...DEFAULT_PLUGINS,
      ...plugins,
    ],
    server: {
      port: 3000,
    },
    //Multiple entry points are not supported when output formats include "umd" or "iife".
    build: {
      ...build,
    },
  });

// one input when we need
// inlineDynamicImports

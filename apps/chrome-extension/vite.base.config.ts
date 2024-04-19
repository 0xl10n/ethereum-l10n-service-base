import { resolve } from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export const createConfig = (build) =>
  defineConfig({
    plugins: [
      /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
      // devtools(),
      solidPlugin(),
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

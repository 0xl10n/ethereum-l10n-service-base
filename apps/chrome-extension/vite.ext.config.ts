import { resolve } from 'path';
import { createConfig } from './vite.base.config';

const build = {
  target: 'es2015',
  outDir: './dist-ext',
  lib: {
    entry: {
      index: resolve(__dirname, 'index.html'),
    },
    formats: ['es'],
  },
  rollupOptions: {
    // output: {
    //   inlineDynamicImports: true,
    // }
  },
};

export default createConfig(build);

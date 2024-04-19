import { resolve } from 'path';
import { createConfig } from './vite.base.config';

// need es / .mjs otherwise "exports not defined"

const build = {
  target: 'es2015',
  outDir: './dist-cs',
  lib: {
    entry: {
      contentscript: resolve(__dirname, 'src/ContentScript.tsx'),
    },
    formats: ['es'],
  },
  rollupOptions: {
    output: {
      inlineDynamicImports: true,
    },
  },
};

export default createConfig(build);

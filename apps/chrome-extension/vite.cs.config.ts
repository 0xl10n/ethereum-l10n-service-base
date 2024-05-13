import { resolve } from 'path';
import { createConfig } from './vite.base.config';

// need es / .mjs otherwise "exports not defined"

const build = {
  target: 'es2020',
  outDir: './dist-cs',
  lib: {
    entry: {
      contentscript: resolve(__dirname, 'src/ContentScript.tsx'),
    },
    formats: ['es'],
  },
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        if (assetInfo.name === 'style.css') return 'cs.css';
        return assetInfo.name;
      },
      inlineDynamicImports: true,
    },
  },
};

export default createConfig(build);

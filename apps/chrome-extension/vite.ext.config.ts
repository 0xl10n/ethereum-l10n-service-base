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
    output: {
      assetFileNames: (assetInfo) => {
        if (assetInfo.name === 'style.css') return 'ext.css';
        return assetInfo.name;
      },
      //   inlineDynamicImports: true,
    },
  },
};

export default createConfig(build);

import { resolve } from 'path';
import { createConfig } from './vite.base.config';

// need es / .mjs otherwise "exports not defined"

const build = {
  target: 'es2020',
  outDir: './dist-site-l10n',
  lib: {
    entry: {
      'site-l10n': resolve(__dirname, 'src/SiteL10n.tsx'),
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

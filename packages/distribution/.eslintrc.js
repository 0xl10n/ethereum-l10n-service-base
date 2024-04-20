const { resolve } = require('node:path');
const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'eslint-config-turbo',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'only-warn'],
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ['.*.js', 'jest.config.js', 'node_modules/'],
  overrides: [
    {
      files: ['*.spec.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
    },
  ],
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vite_base_config_1 = require("./vite.base.config");
// need es / .mjs otherwise "exports not defined"
const build = {
    target: 'es2020',
    outDir: './dist-cs',
    lib: {
        entry: {
            contentscript: (0, path_1.resolve)(__dirname, 'src/ContentScript.tsx'),
        },
        formats: ['es'],
    },
    rollupOptions: {
        output: {
            inlineDynamicImports: true,
        },
    },
};
exports.default = (0, vite_base_config_1.createConfig)(build);

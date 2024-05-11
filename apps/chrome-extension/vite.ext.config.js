"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vite_base_config_1 = require("./vite.base.config");
const vite_plugin_node_polyfills_1 = require("vite-plugin-node-polyfills");
const build = {
    target: 'es2020',
    outDir: './dist-ext',
    lib: {
        entry: {
            index: (0, path_1.resolve)(__dirname, 'index.html'),
            sidepanel: (0, path_1.resolve)(__dirname, 'sidepanel.html'),
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
    (0, vite_plugin_node_polyfills_1.nodePolyfills)({
        globals: {
            Buffer: true, // can also be 'build', 'dev', or false
            global: true,
            process: true,
        },
    }),
];
exports.default = (0, vite_base_config_1.createConfig)(build, plugins);

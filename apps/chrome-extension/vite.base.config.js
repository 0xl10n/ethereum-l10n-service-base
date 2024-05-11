"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = void 0;
const vite_1 = require("vite");
const vite_plugin_solid_1 = __importDefault(require("vite-plugin-solid"));
// import devtools from 'solid-devtools/vite';
const createConfig = (build, plugins = []) => (0, vite_1.defineConfig)({
    plugins: [
        /*
      Uncomment the following line to enable solid-devtools.
      For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
      */
        // devtools(),
        (0, vite_plugin_solid_1.default)(),
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
exports.createConfig = createConfig;
// one input when we need
// inlineDynamicImports

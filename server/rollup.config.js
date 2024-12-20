import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "app/app.ts",
  output: {
    file: "../output/backend/app/bundle.js",
    format: "esm",
  },
  plugins: [
    nodeResolve(),
    typescript({ module: "esnext", outDir: "../output/backend/app" }),
    commonjs({ requireReturnsDefault: "auto" }),
    json(),
  ],
  external: ["fs", "path"], // Add any built-in modules you want to exclude from the bundle
};

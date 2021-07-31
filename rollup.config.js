import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";
import autoExternal from "rollup-plugin-auto-external";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/cli.js",
  output: {
    name: "cli",
    file: "dist/cli-bundle.js",
    format: "cjs",
    globals: {
      fs: "fs",
      inquirer: "inquirer",
      arg: "arg",
      chalk: "chalk",
      ora: "ora",
      "edit-json-file": "editJsonFile",
      child_process: "child_process",
    },
  },
  plugins: [
    resolve({
      browser: false,
    }),

    autoExternal(),

    typescript({ sourceMap: !production }),

    commonjs(),

    // If dev mode, serve
    !production && serve(),

    // If prod mode, minify
    production && terser(),
  ],
  watch: {
    clearScreen: true,
  },
};

function serve() {
  let started = false;

  return {
    writeBundle() {},
  };
}

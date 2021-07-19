import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import livereload from 'rollup-plugin-livereload';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import html from 'rollup-plugin-bundle-html-plus';
import svgr from '@svgr/rollup';

const production = !process.env.ROLLUP_WATCH;

export default [
  /* 
  Transpiling React code and injecting into index.html for Figma  
  */
  {
    input: 'src/app/index.jsx',
    output: {
      name: 'ui',
      file: 'dist/bundle.js',
      format: 'umd',
    },
    plugins: [
      // What extensions is rollup looking for
      resolve({
        extensions: ['.jsx', '.js', '.json'],
        browser: true,
        dedupe: ['react', 'react-dom'],
      }),

      // Manage process.env
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(production),
      }),

      // Babel config to support React
      babel({
        presets: ['@babel/preset-react', '@babel/preset-env'],
        babelHelpers: 'runtime',
        plugins: ['@babel/plugin-transform-runtime'],
        extensions: ['.js', '.ts', 'tsx', 'jsx'],
        compact: true,
        exclude: 'node_modules/**',
      }),

      commonjs(),

      svgr(),

      // Config to allow sass and css modules
      postcss({
        extract: false,
        modules: true,
        use: ['sass'],
      }),

      // Injecting UI code into ui.html
      html({
        template: 'src/app/index.html',
        dest: 'dist',
        filename: 'index.html',
        inline: true,
        inject: 'body',
        ignore: /code.js/,
      }),

      // If dev mode, serve and livereload
      !production && serve(),
      !production && livereload('dist'),

      // If prod mode, minify
      production && terser(),
    ],
    watch: {
      clearScreen: true,
    },
  },

  /* 
  Main Figma plugin code
  */
  {
    input: 'src/plugin/controller.js',
    output: {
      file: 'dist/code.js',
      format: 'iife',
      name: 'code',
    },
    plugins: [resolve(), commonjs({ transformMixedEsModules: true }), production && terser()],
  },
];

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        // Start localhost dev server on port 5000 to work on the UI in the browser
        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        });
      }
    },
  };
}

const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    ui: './src/app/index.jsx', // The entry point for your UI code
    code: './src/plugin/controller.js', // The entry point for your plugin code
  },

  module: {
    rules: [
      // Transpiles Javascript ready for the browser
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
        exclude: /node-modules/,
      },

      // Enables including CSS by doing "import './file.css'" in your TypeScript code
      {
        test: /\.(s?c|a)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /\.module\.s(c|a)ss$/,
      },

      {
        test: /\.(s?c|a)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.s(c|a)ss$/,
      },

      // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
      {test: /\.(png|jpg|gif|webp|svg)$/, loader: 'url-loader'},
    ],
  },

  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: {extensions: ['.tsx', '.ts', '.jsx', '.js']},

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
  },

  // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['ui'],
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
});

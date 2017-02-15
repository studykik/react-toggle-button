/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  // enable HMR globally
  new webpack.NamedModulesPlugin(),
  // prints more readable module names in the browser console on HMR updates
  new HtmlWebpackPlugin({
    filename: 'app.html',
    chunks: ['app'],
    templateContent: templateContent('app/index.html'), // eslint-disable-line no-use-before-define
  }),
  new HtmlWebpackPlugin({
    filename: 'corporate.html',
    chunks: ['corporate'],
    templateContent: templateContent('corporate/index.html')
  }),
];

module.exports = require('./webpack.base.babel')({
  entry: {
    'app': [
      'babel-polyfill', // Necessary for browser usage
      'eventsource-polyfill', // Necessary for hot reloading with IE
      'webpack-hot-middleware/client',
      path.join(process.cwd(), 'app/app.js'), // Start with js/app.js
    ],
    'corporate': [
      'babel-polyfill', // Necessary for browser usage
      'eventsource-polyfill', // Necessary for hot reloading with IE
      'webpack-hot-middleware/client',
      path.join(process.cwd(), 'corporate/app.js'), // Start with js/app.js
    ],
  },

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
  },

  // Add development plugins
  plugins: plugins, // eslint-disable-line no-use-before-define

  // Load the CSS in a style tag in development
  // We can restore css-loader?sourceMap
  // once style-loader fixes background image issue
  lessLoaders: [
    {
      loader: 'style-loader',
    }, {
      loader: 'css-loader',
    }, {
      loader: 'less-loader',
    }
  ],
  // Emit a source map for easier debugging
  devtool: 'cheap-module-eval-source-map',
  stats: "errors-only",
});

/**
 * We dynamically generate the HTML content in development so that the different
 * DLL Javascript files are loaded in script tags and available to our application.
 */
function templateContent(indexPath) {//
  const html = fs.readFileSync(
    path.resolve(process.cwd(), indexPath)
  ).toString();

  return html;
}
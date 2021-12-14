const {join} = require('path');
const externals = require('./package.json').dependencies;
const webpack = require('webpack');
const env = require('./env');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    background: './main/index.js',
  },
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.node'],
    modules: [join(process.cwd(), 'app'), 'node_modules'],
  },
  externals: [...Object.keys(externals)],
  output: {
    filename: 'index.js',
    path: join(process.cwd(), 'app'),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      ...env,
      NODE_OPTIONS:
        '--max-old-space-size=1536 --enable-one-shot-optimization --expose-gc --gc-interval=100 --clear-free-memory',
    }),
  ],
};

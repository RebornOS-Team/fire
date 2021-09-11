const {join} = require('path');
const externals = require('./package.json').dependencies;
const webpack = require('webpack');
const {version, codeName} = require('./package.json');

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
      VERSION: version,
      CODE_NAME: codeName,
    }),
  ],
};

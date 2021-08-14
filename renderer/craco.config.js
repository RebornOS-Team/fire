const webpack = require('webpack');
const {version} = require('./package.json');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.EnvironmentPlugin({
          VERSION: version,
        }),
      ],
    },
    configure: (webpackConfig, {env}) => {
      webpackConfig.target = 'electron-renderer';
      delete webpackConfig.devtool;
      if (env === 'production') {
        const TerserPlugin = webpackConfig.optimization.minimizer.find(
          i => i.constructor.name === 'TerserPlugin'
        );
        if (TerserPlugin) {
          TerserPlugin.options.terserOptions.compress.drop_console = true;
        }
      }
      if (process.env.CI !== 'true') {
        webpackConfig.performance = {
          hints: 'warning',
        };
      }
      return webpackConfig;
    },
  },
};

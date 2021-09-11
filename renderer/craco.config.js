const webpack = require('webpack');
const {version, codeName} = require('./package.json');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.EnvironmentPlugin({
          VERSION: version,
          CODE_NAME: codeName,
        }),
      ],
    },
    configure: (webpackConfig, {env}) => {
      webpackConfig.target = 'electron-renderer';
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

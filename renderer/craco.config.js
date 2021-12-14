const webpack = require('webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.EnvironmentPlugin({
          VERSION: process.env.VERSION,
          CODE_NAME: process.env.CODE_NAME,
          MODULES_KEY: process.env.MODULES_KEY,
          FIRE_MODULES_SERVER: process.env.FIRE_MODULES_SERVER,
          PUBLIC_KEY_X: process.env.PUBLIC_KEY_X,
          PUBLIC_KEY_Y: process.env.PUBLIC_KEY_Y,
          PUBLIC_KEY_KTY: process.env.PUBLIC_KEY_KTY,
          PUBLIC_KEY_CRV: process.env.PUBLIC_KEY_CRV,
          PUBLIC_KEY_ALG: process.env.PUBLIC_KEY_ALG,
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

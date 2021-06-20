module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  optimizeFonts: true,
  webpack: config =>
    Object.assign(config, {
      target: 'electron-renderer',
    }),
  experimental: {
    cpus: 2,
    optimizeImages: true,
    optimizeCss: true,
    eslint: true,
  },
  devIndicators: {
    autoPrerender: true,
  },
  webpack5: false,
};

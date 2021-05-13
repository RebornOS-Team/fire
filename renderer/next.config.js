module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  optimizeFonts: true,
  webpack: config =>
    Object.assign(config, {
      target: 'electron-renderer',
    }),
  experimental: {
    cpus: 4,
    optimizeImages: true,
    optimizeCss: true,
    turboMode: true,
    eslint: true,
    enableBlurryPlaceholder: true,
  },
  devIndicators: {
    autoPrerender: true,
  },
};

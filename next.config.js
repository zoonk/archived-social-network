const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  typescript: {
    ignoreDevErrors: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);

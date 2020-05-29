const withOffline = require('next-offline');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  workboxOpts: {
    // Move the service worker to the public folder.
    // Otherwise, we'll get a 404 error in production.
    swDest: 'static/service-worker.js',
  },
};

module.exports = withOffline(withBundleAnalyzer(nextConfig));

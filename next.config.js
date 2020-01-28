/* eslint-disable */
require('dotenv').config();
const path = require('path');
const withOffline = require('next-offline');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Add these environment variables to the build process.
  env: {
    APP_LANG: process.env.APP_LANG,

    // We can use this variable to check for a production or staging build.
    BUILD_ENV: process.env.BUILD_ENV,
  },
  typescript: {
    ignoreDevErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias['@zoonk'] = path.join(__dirname, 'src');
    return config;
  },
  workboxOpts: {
    // Move the service worker to the public folder.
    // Otherwise, we'll get a 404 error in production.
    swDest: 'static/service-worker.js',
  },
};

module.exports = withOffline(withBundleAnalyzer(nextConfig));

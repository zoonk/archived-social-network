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
    BUILD_ENV: process.env.BUILD_ENV,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_SEARCH_KEY: process.env.ALGOLIA_SEARCH_KEY,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DB_URL: process.env.FIREBASE_DB_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_ID: process.env.FIREBASE_MESSAGING_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
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

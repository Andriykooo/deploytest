/** @type {import('next').NextConfig} */
const { i18nRewriter } = require('next-i18n-router');
const i18nConfig = require('./i18nConfig');

const nextConfig = {
  async rewrites() {
    return {
      afterFiles: i18nRewriter(i18nConfig)
    };
  },
  output: "standalone",
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "swifty-global-app-assets-central.s3.eu-west-1.amazonaws.com",
        port: "",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: "swifty.prerelease-env.biz",
        port: "",
        pathname: "/*/**",
      },
    ],
  },
};

module.exports = nextConfig;

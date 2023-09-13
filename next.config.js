/** @type {import('next').NextConfig} */

const nextConfig = {
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

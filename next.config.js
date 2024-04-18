/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  rewrites: async () => {
    return [
      {
        source: "/manifest.json",
        destination: "/webmanifest.manifest",
      },
    ];
  },
  images: {
    minimumCacheTTL: 31536000,
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
      {
        protocol: "https",
        hostname: "cdn.softswiss.net",
        port: "",
        pathname: "/*/**",
      },
    ],
  },
};

module.exports = nextConfig;

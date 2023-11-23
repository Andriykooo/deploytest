/** @type {import('next').NextConfig} */

const withPWA = require("@imbios/next-pwa")({
  dest: "public",
});

const nextConfig = {
  ...withPWA({
    output: "standalone",
    compiler: {
      removeConsole: process.env.NODE_ENV === "production",
    },
    // async redirects() {
    //   return [
    //     {
    //       source: "/",
    //       destination: "/en",
    //       permanent: true,
    //     },
    //   ];
    // },
    async rewrites() {
      return [
        {
          source: "/manifest.json",
          destination: "/api/manifest",
        },
      ];
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname:
            "swifty-global-app-assets-central.s3.eu-west-1.amazonaws.com",
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
  }),
};

module.exports = nextConfig;

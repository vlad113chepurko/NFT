import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img-cdn.magiceden.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sensei.launchifi.xyz",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;

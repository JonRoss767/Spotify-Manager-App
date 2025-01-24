import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows any hostname
        pathname: '/**', // Allows any pathname
      },
    ],
  },
};

export default nextConfig;
